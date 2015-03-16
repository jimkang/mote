var d3 = require('./lib/d3-small');
var createLayerRenderer = require('./layer-renderer').create;
var idmaker = require('idmaker');
var createProbable = require('probable').createProbable;
var seedrandom = require('seedrandom');
var createGriddler = require('./griddler').create;
var _ = require('lodash');
var createClock = require('./clock').create;
var queue = require('queue-async');
var createFloorLayer = require('./layers/floor-layer').create;
var createGuysLayer = require('./layers/guys-layer').create;

var seed = (new Date).getTime().toString();

console.log('Seed:', seed);

var probable = createProbable({
  random: seedrandom(seed)
});

var layers = {};
var griddler;
var clock;

var cellWidth = 25;
var cellHeight = 25;

function start() {
  griddler = createGriddler();

  clock = createClock({
    flipCoin: function flipCoin() {
      return probable.roll(2) === 0;
    }
  });

  layers.floor = createFloorLayer({
    probable: probable,
    griddler: griddler,
    cellWidth: cellWidth,
    cellHeight: cellHeight
  });


  var floor = d3.select('.floor');
  floor.on('click', function floorClicked() {
    var point = d3.mouse(floor.node());
    var coords = pointToCoords(point);
    console.log('Click at ', point, 'which maps to coords', coords);

    kickOffPlanning();
  });

  layers.guys = createGuysLayer({
    probable: probable,
    griddler: griddler,
    cellWidth: cellWidth,
    cellHeight: cellHeight
  });

  clock.on('tickDone', advanceAllToNextState);

  renderLayers();
}

function kickOffPlanning() {
  var planPack = {
    clock: clock,
    griddler: griddler
  };

  var planFns = _.pluck(layers.guys.cells, 'plan');
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
  layers.guys.cells.forEach(updateCell);
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
  layers.guys.render();
}

function pointToCoords(point) {
  return [~~(point[0]/cellWidth), ~~(point[1]/cellHeight)];
}

module.exports = {
  start: start
};
