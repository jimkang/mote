var d3 = require('d3');
var createLayerRenderer = require('./layer-renderer').create;
var idmaker = require('idmaker');
var createProbable = require('probable').createProbable;
var seedrandom = require('seedrandom');

var seed = (new Date).getTime().toString();

console.log('Seed:', seed);

var probable = createProbable({
  random: seedrandom(seed)
});

var floorRenderer = createLayerRenderer({
  cellWidth: 25,
  cellHeight: 25,
  cellClass: 'street-cell',  
  layerSelector: '.streets',
});

function generateCell() {
  return {
    d: {
      id: idmaker.randomId(5)
    },
    coords: [
      probable.roll(10),
      probable.roll(10)
    ]
  }
}

var floorCells = d3.range(100).map(generateCell);

floorRenderer.render(floorCells);
