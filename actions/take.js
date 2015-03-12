var callBackOnNextTick = require('conform-async').callBackOnNextTick;

function createTake(opts) {
  // var vector;
  // var griddler;
  var what;

  if (opts) {
    what = opts.what;
    // vector = opts.vector;
    // griddler = opts.griddler;
  }

  if (!what) {
    throw new Error('No what given to take.');
  }
  
  function go(actionOpts, done) {
    // TODO: Check range.
    actionOpts.actor.next.inventory = actionOpts.actor.live.inventory
      .concat([what]);

    callBackOnNextTick(done);
  }

  return {
    go: go
  };
}

module.exports = {
  create: createTake
};
