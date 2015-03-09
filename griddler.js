// Tracks what cell is at what position on all layers.

function createGriddler() {
  var map = {};

  function setCell(layer, cell) {
    var layerMap = map[layer];
    if (!layerMap) {
      layerMap = {};
      map[layer] = layerMap;
    }

    var coords = getCoordsString(cell.coords);

    var currentOccupant = layerMap[coords];
    if (currentOccupant) {
      if (currentOccupant.d && currentOccupant.d.notifyRemoved) {
        currentOccupant.d.notifyRemoved({
          replacement: cell
        });
      }
    }

    layerMap[coords] = cell;
  }

  function getCell(layer, coords) {
    var cell;

    if (map[layer]) {
      cell = map[layer][getCoordsString(coords)];
    }

    return cell;
  }

  function getCellsOnAllLayers(coords) {
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
      delete map[layer][getCoordsString(coords)];
    }
  }

  return {
    setCell: setCell,
    getCell: getCell,
    getCellsOnAllLayers: getCellsOnAllLayers,
    removeCell: removeCell
  };
}

function getCoordsString(coords) {
  return coords[0] + '_' + coords[1];
}

module.exports = {
  create: createGriddler
};
