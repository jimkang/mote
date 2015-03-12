var callBackOnNextTick = require('conform-async').callBackOnNextTick;

function createTake(opts) {
  // var vector;
  // var griddler;
  var what;
  var actor;

  if (opts) {
    what = opts.what;
    actor = opts.actor;
    // vector = opts.vector;
    // griddler = opts.griddler;
  }

  if (!what) {
    throw new Error('No what given to take.');
  }
  if (!actor) {
    throw new Error('No actor given to move.');
  }
  
  function go(done) {
    // TODO: Check range.
    actor.next.inventory = actor.live.inventory.concat([what]);
    callBackOnNextTick(done);
  }

  return {
    go: go
  };
}

module.exports = {
  create: createTake
};
