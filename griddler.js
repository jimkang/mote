// Tracks what cell is at what position on all layers.
var _ = require('lodash');

function createGriddler() {
  var map = {};
  var cellArraysForLayers = {};

  function setCell(layer, cell) {
    var layerMap = map[layer];
    if (!layerMap) {
      layerMap = {};
      map[layer] = layerMap;
    }

    var coords = getCoordsString(cell.live.coords);

    var currentOccupant = layerMap[coords];
    if (currentOccupant) {
      removeCell(layer, currentOccupant.live.coords);

      if (currentOccupant.notifyRemoved) {
        currentOccupant.notifyRemoved({
          replacement: cell
        });
      }
    }

    layerMap[coords] = cell;
    addCellToLayer(layer, cell);
  }

  // Internal.
  function addCellToLayer(layer, cell) {
    var cellArray = cellArraysForLayers[layer];
    if (!cellArray) {
      cellArray = [];
      cellArraysForLayers[layer] = cellArray;
    }
    cellArray.push(cell);
  }

  // Internal.
  function removeCellFromLayer(layer, cell) {
    var cellArray = cellArraysForLayers[layer];
    if (cellArray) {
      var index = _.findIndex(cellArray, function idMatches(comparisonCell) {
        return (comparisonCell.id === cell.id);
      });
      if (index !== -1) {
        cellArray.splice(index, 1);
      }
    }
  }

  function getCell(layer, coords) {
    var cell;

    if (map[layer]) {
      cell = map[layer][getCoordsString(coords)];
    }

    return cell;
  }

  function getVerticleSliceAtCoords(coords) {
    var cells = [];
    var coordString = getCoordsString(coords);
    for (var layer in map) {
      var cell = map[layer][coordString];
      if (cell) {
        cells.push(cell);
      }
    }
    return cells;
  }

  function removeCell(layer, coords) {
    if (map[layer]) {
      var coordsString = getCoordsString(coords);
      var cell = map[layer][coordsString]
      removeCellFromLayer(layer, cell);
      delete map[layer][coordsString];
    }
  }

  function getLayerCells(layerName) {
    return cellArraysForLayers[layerName];
  }

  return {
    setCell: setCell,
    getCell: getCell,
    getVerticleSliceAtCoords: getVerticleSliceAtCoords,
    removeCell: removeCell,
    getLayerCells: getLayerCells
  };
}

function getCoordsString(coords) {
  return coords[0] + '_' + coords[1];
}

module.exports = {
  create: createGriddler
};
