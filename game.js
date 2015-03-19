// Holder for various singletons.

var createFloorLayer = require('./layers/floor-layer').create;
var createGuysLayer = require('./layers/guys-layer').create;
var createClock = require('./clock').create;
var createGriddler = require('./griddler').create;

function createGame(opts) {
  var game = {};
  var cellWidth;
  var cellHeight;
  var probable;

  if (opts) {
    cellWidth = opts.cellWidth;
    cellHeight = opts.cellHeight;
    probable = opts.probable;
  }

  game.griddler = createGriddler();

  game.clock = createClock({
    flipCoin: function flipCoin() {
      return probable.roll(2) === 0;
    }
  });

  game.layers = {};

  var commonLayerOpts = {
    probable: probable,
    griddler: game.griddler,
    cellWidth: cellWidth,
    cellHeight: cellHeight
  };

  game.layers.floor = createFloorLayer(commonLayerOpts);
  game.layers.guys = createGuysLayer(commonLayerOpts);

  // clock.on('tickDone', advanceAllToNextState);

  // renderLayers();
  return game;

}

module.exports = {
  create: createGame
};
