var callBackOnNextTick = require('conform-async').callBackOnNextTick;

function createPhaser(opts) {
  var phases;
  var phaseIndex = 0;
  if (opts) {
    phases = opts.phases;
  }

  if (!phases) {
    throw new Error('phases not provided to phaser.');
  }

  function runNextPhase() {
    var currentIndex = phaseIndex;
    phaseIndex += 1;
    if (phaseIndex >= phases.length) {
      phaseIndex = 0;
      // We're done with the iteration, so don't pass self as a callback.
      callBackOnNextTick(phases[currentIndex]);
    }
    else {
      callBackOnNextTick(phases[currentIndex], runNextPhase);
    }
  }

  return {
    runNextPhase: runNextPhase
  };
}

module.exports = {
  create: createPhaser
};
