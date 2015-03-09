var createGridRenderer = require('cellgridrenderer').createFixedCellGridRenderer;

function createMapper(opts) {
  var streetRenderer;
  var streets = [];

  if (opts) {
    if (opts.streetRenderer) {
      streetRenderer = opts.streetRenderer;
    }
  }

  if (!streetRenderer) {
    streetRenderer = createGridRenderer({
      selectors: {
        svg: '#neighborhood',
        root: '.streets'
      },
      cellWidth: 25,
      cellHeight: 25,
      cellClass: 'street-cell',
    });
  }

  function renderStreet(street) {
    streets.push(street);
    var streetCells = streets.reduce(
      function addStreetCells(cells, street) {
        cells = cells.concat(getCellsForStreet(street));
        return cells;
      },
      []
    );
    streetRenderer.renderCells(streetCells);
  }

  function getCellsForStreet(street) {
    var dx = street.end[0] - street.start[0];
    var dy = street.end[1] - street.start[1];
    var directionX = dx === 0 ? 0 : dx / Math.abs(dx);
    var directionY = dy === 0 ? 0 : dy / Math.abs(dy);

    var cells = [];
    
    var x = street.start[0];
    var y = street.start[1];

    while (x <= street.end[0] && y <= street.end[1]) {
      cells.push({
        coords: [x, y]
      });

      if (dx >= dy) {
        // Streets are three wide.
        cells.push({
          coords: [x, y - 1]
        });
        cells.push({
          coords: [x, y + 1]
        });
      }


      if (dy >= dx) {
        cells.push({
          coords: [x - 1, y]
        });
        cells.push({
          coords: [x + 1, y]
        });
      }

      x += directionX;
      y += directionY;
    }

    return cells;
  }

  return {
    renderStreet: renderStreet
  };
}

module.exports = {
  create: createMapper
};
