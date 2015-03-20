var d3 = require('./lib/d3-small');
var createLayerRenderer = require('./layer-renderer').create;
var idmaker = require('idmaker');
var createProbable = require('probable').createProbable;
var seedrandom = require('seedrandom');
var _ = require('lodash');
var queue = require('queue-async');
var createGame = require('./game').create;
var callBackOnNextTick = require('conform-async').callBackOnNextTick;
var createPhaser = require('./phaser').create;

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

  var phaser = createPhaser({
    phases: [
      plan,
      execute,
      update,
      render
    ]
  });

  var floor = d3.select('.floor');
  floor.on('click', function floorClicked() {
    var point = d3.mouse(floor.node());
    var coords = pointToCoords(point);
    console.log('Click at ', point, 'which maps to coords', coords);

    phaser.runNextPhase();
  });

  render();
}

function plan(done) {
  var planPack = {
    clock: game.clock,
    griddler: game.griddler
  };

  var planFns = _.pluck(game.layers.guys.cells, 'plan');
  var q = queue();
  planFns.forEach(function queuePlan(planFn) {
    q.defer(planFn, planPack);
  });
  q.awaitAll(done);
  // TODO, maybe: Look at error.
}

function execute(done) {
  game.clock.tick(done);
}

function update(done) {
  game.layers.floor.cells.forEach(updateCell);
  game.layers.guys.cells.forEach(updateCell);
  callBackOnNextTick(done);
}

function updateCell(cell) {
  // TODO: _.cloneDeep?
  if (cell.next) {
    cell.live = cell.next;
    cell.next = {};
  }
}

function render(done) {
  game.layers.floor.render();
  game.layers.guys.render();
  if (done) {
    callBackOnNextTick(done);
  }
}

function pointToCoords(point) {
  return [~~(point[0]/25), ~~(point[1]/25)];
}

module.exports = {
  start: start
};
