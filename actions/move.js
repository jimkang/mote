var callBackOnNextTick = require('conform-async').callBackOnNextTick;

function createMove(opts) {
  var vector;
  var griddler;
  var actor;

  if (opts) {
    vector = opts.vector;
    griddler = opts.griddler;
    actor = opts.actor;
  }

  if (!vector) {
    throw new Error('No vector given to move.');
  }
  if (!griddler) {
    throw new Error('No griddler provided to move');
  }
  if (!actor) {
    throw new Error('No actor given to move.');
  }

  function go(done) {
    var newSpot = addCoords(actor.live.coords, vector);
    var cellsAtNewSpot = griddler.getVerticleSliceAtCoords(newSpot);
    // TODO: Look for obstacles.
    actor.next.coords = newSpot;
    callBackOnNextTick(done);
  }

  return {
    go: go
  };
}

function addCoords(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

module.exports = {
  create: createMove
};
