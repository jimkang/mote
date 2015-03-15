// A grouping of: 1) cells and 2) a renderer for them.

var idmaker = require('idmaker');
var createLayerRenderer = require('../layer-renderer').create;
var _ = require('lodash');

function createFloorLayer(opts) {
  var probable;
  var griddler;

  if (opts) {
    probable = opts.probable;
    griddler = opts.griddler;
  }

  if (!probable) {
    throw new Error('probable not provided to floor layer.');
  }
  if (!griddler) {
    throw new Error('griddler not provided to floor layer.');
  }

  floorCells = d3.range(100).map(generateFloorCell);
  var setFloorCell = _.curry(griddler.setCell)('floor');
  floorCells.forEach(setFloorCell);

  floorRenderer = createLayerRenderer({
    cellWidth: 25,
    cellHeight: 25,
    cellClass: 'floor-cell',
    layerSelector: '.floor',
  });

  function render() {
    return floorRenderer.render(floorCells);
  }

  function generateFloorCell() {
    return {
      id: idmaker.randomId(5),
      live: {
        coords: [
          probable.roll(10),
          probable.roll(10)
        ]
      }
    };
  }

  return {
    cells: floorCells,
    render: render
  };
}

module.exports = {
  create: createFloorLayer
};
