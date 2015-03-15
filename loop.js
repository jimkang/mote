var d3 = require('./lib/d3-small');
var createLayerRenderer = require('./layer-renderer').create;
var idmaker = require('idmaker');
var createProbable = require('probable').createProbable;
var seedrandom = require('seedrandom');
var createGriddler = require('./griddler').create;
var _ = require('lodash');
var createClock = require('./clock').create;
var createMove = require('./actions/move').create;
var callBackOnNextTick = require('conform-async').callBackOnNextTick;
var queue = require('queue-async');
var createFloorLayer = require('./layers/floor-layer').create;

var seed = (new Date).getTime().toString();

console.log('Seed:', seed);

var probable = createProbable({
  random: seedrandom(seed)
});

var layers = {};

var guyRenderer;
var guyCells;
var griddler;
var clock;

function start() {
  griddler = createGriddler();

  clock = createClock({
    flipCoin: function flipCoin() {
      return probable.roll(2) === 0;
    }
  });

  layers.floor = createFloorLayer({
    probable: probable,
    griddler: griddler
  });

  var floor = d3.select('.floor');
  floor.on('click', function floorClicked() {
    var point = d3.mouse(floor.node());
    var coords = floorRenderer.pointToCoords(point);
    console.log('Click at ', point, 'which maps to coords', coords);

    kickOffPlanning();
  });

  guyCells = d3.range(5).map(generateGuyCell);

  var setGuyCell = _.curry(griddler.setCell)('guys');
  guyCells.forEach(setGuyCell);

  guyRenderer = createLayerRenderer({
    cellWidth: 25,
    cellHeight: 25,
    cellClass: 'guy-cell',
    layerSelector: '.guys'
  });

  clock.on('tickDone', advanceAllToNextState);

  renderLayers();
}

function kickOffPlanning() {
  var planPack = {
    clock: clock,
    griddler: griddler
  };

  var planFns = _.pluck(guyCells, 'plan');
  var q = queue();
  planFns.forEach(function queuePlan(planFn) {
    q.defer(planFn, planPack);
  });
  q.awaitAll(execute);
}

function execute(error) {
  if (error) {
    console.log(error);
  }

  clock.tick();
}

function advanceAllToNextState() {
  updateCells();
  renderLayers();
}

function updateCells() {
  layers.floor.cells.forEach(updateCell);
  guyCells.forEach(updateCell);
}

function updateCell(cell) {
  // TODO: _.cloneDeep?
  if (cell.next) {
    cell.live = cell.next;
    cell.next = {};
  }
}

function renderLayers() {
  layers.floor.render();
  guyRenderer.render(griddler.getLayerCells('guys'));
}

function generateGuyCell() {
  var guy = {
    id: idmaker.randomId(5),
    plan: function plan(opts, done) {
      opts.clock.queueAction(createMove({
        actor: guy,
        griddler: opts.griddler,
        vector: pickRandomVector()
      }));
      callBackOnNextTick(done);
    },
    live: {
      coords: [
        probable.roll(10),
        probable.roll(10)
      ]
    },
    next: {
      coords: []
    }
  };

  return guy;
}

var range = [-1, 0, 1];

function pickRandomVector() {
  return [probable.pickFromArray(range), probable.pickFromArray(range)];
}

module.exports = {
  start: start
};
