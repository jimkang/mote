var accessor = require('accessor');

function createLayerRenderer(opts) {
  if (!opts) {
    throw new Error('No opts given to createLayerRenderer.');
  }

  var cellWidth = opts.cellWidth;
  var cellHeight = opts.cellHeight;
  var cellClass = opts.cellClass;
  var layerSelector = opts.layerSelector;
  var customizeCellRendition = opts.customizeCellRendition;
  var fadeInDelay = opts.fadeInDelay;
  var fadeInDuration = opts.fadeInDuration;
  var fadeOutDuration = opts.fadeOutDuration;

  var cellId = accessor();
  
  function cellX(cell) {
    return cellWidth * (cell.live.coords[0] + 0.5);
  }

  function cellY(cell) {
    return cellHeight * (cell.live.coords[1] + 0.5);
  }

  var layer = d3.select(layerSelector);

  function render(cells) {
    var cellRenditions = layer.selectAll('.' + cellClass)
      .data(cells, cellId);

    var newCellRenditions = cellRenditions
      .enter()
      .append('g')
      .classed(cellClass, true)
      .attr('opacity', fadeInDelay ? 0 : 1);

    newCellRenditions.append('rect').attr({
      width: cellWidth,
      height: cellHeight
    });

    var rectsThatNeedUpdating = cellRenditions.select('rect');

    if (customizeCellRendition) {
      cellRenditions.each(customizeCellRendition);
    }

    rectsThatNeedUpdating.attr({
      x: cellX,
      y: cellY,
    });

    if (fadeInDelay) {
      cellRenditions
        .transition().delay(fadeInDelay)
        .duration(fadeInDuration)
        .attr('opacity', 1);
    }

    var deadCellRenditions = cellRenditions.exit();

    if (fadeOutDuration) {
      deadCellRenditions
        .transition()
        .duration(fadeOutDuration)
        .attr('opacity', 0)
        .remove();
    }
    else {
      deadCellRenditions.remove();
    }
  }
  
  return {
    render: render
  };
}

module.exports = {
  create: createLayerRenderer
};
