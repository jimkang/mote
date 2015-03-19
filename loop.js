var d3 = require('./lib/d3-small');
var createLayerRenderer = require('./layer-renderer').create;
var idmaker = require('idmaker');
var createProbable = require('probable').createProbable;
var seedrandom = require('seedrandom');
var _ = require('lodash');
var queue = require('queue-async');
var createGame = require('./game').create;

var seed = (new Date).getTime().toString();

console.log('Seed:', seed);

var probable = createProbable({
  random: seedrandom(seed)
});

var layers = {};
var griddler;
var clock;

var game;

function start() {
  game = createGame({
    probable: probable,
    cellWidth: 25,
    cellHeight: 25
  });

  var floor = d3.select('.floor');
  floor.on('click', function floorClicked() {
    var point = d3.mouse(floor.node());
    var coords = pointToCoords(point);
    console.log('Click at ', point, 'which maps to coords', coords);

    kickOffPlanning();
  });

  game.clock.on('tickDone', advanceAllToNextState);

  renderLayers();
}

function kickOffPlanning() {
  var planPack = {
    clock: game.clock,
    griddler: game.griddler
  };

  var planFns = _.pluck(game.layers.guys.cells, 'plan');
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

  game.clock.tick();
}

function advanceAllToNextState() {
  updateCells();
  renderLayers();
}

function updateCells() {
  game.layers.floor.cells.forEach(updateCell);
  game.layers.guys.cells.forEach(updateCell);
}

function updateCell(cell) {
  // TODO: _.cloneDeep?
  if (cell.next) {
    cell.live = cell.next;
    cell.next = {};
  }
}

function renderLayers() {
  game.layers.floor.render();
  game.layers.guys.render();
}

function pointToCoords(point) {
  return [~~(point[0]/25), ~~(point[1]/25)];
}

module.exports = {
  start: start
};
