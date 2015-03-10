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

  function cellId(cell) {
    return cell.d.id;
  }
  
  function cellX(cell) {
    return cellWidth * (cell.coords[0] + 0.5);
  }

  function cellY(cell) {
    return cellHeight * (cell.coords[1] + 0.5);
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
      x: cellX,
      y: cellY,
      width: cellWidth,
      height: cellHeight
    });

    if (customizeCellRendition) {
      cellRenditions.each(customizeCellRendition);
    }

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

  function pointToCoords(point) {
    return [~~(point[0]/cellWidth), ~~(point[1]/cellHeight)];
  }

  return {
    render: render,
    pointToCoords: pointToCoords
  };
}

module.exports = {
  create: createLayerRenderer
};
