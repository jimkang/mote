// TODO: Factor common stuff from this and floor-layer into a general layer 
// function.

// A grouping of: 1) cells and 2) a renderer for them.

var idmaker = require('idmaker');
var createLayerRenderer = require('../layer-renderer').create;
var _ = require('lodash');
var createMove = require('../actions/move').create;
var callBackOnNextTick = require('conform-async').callBackOnNextTick;

function createGuysLayer(opts) {
  var probable;
  var griddler;
  var cellWidth;
  var cellHeight;

  if (opts) {
    probable = opts.probable;
    griddler = opts.griddler;
    cellWidth = opts.cellWidth;
    cellHeight = opts.cellHeight;
  }

  if (!probable) {
    throw new Error('probable not provided to guys layer.');
  }
  if (!griddler) {
    throw new Error('griddler not provided to guys layer.');
  }

  var guyCells = d3.range(5).map(generateGuyCell);
  var setGuysCell = _.curry(griddler.setCell)('guys');
  guyCells.forEach(setGuysCell);

  guysRenderer = createLayerRenderer({
    cellWidth: cellWidth,
    cellHeight: cellHeight,
    cellClass: 'guy-cell',
    layerSelector: '.guys',
  });

  function render() {
    return guysRenderer.render(guyCells);
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
  return {
    cells: guyCells,
    render: render
  };
}


module.exports = {
  create: createGuysLayer
};
