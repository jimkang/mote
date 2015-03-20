var callBackOnNextTick = require('conform-async').callBackOnNextTick;
// var EventEmitter = require('events').EventEmitter;
var async = require('async');
var _ = require('lodash');

function createClock(opts) {
  var actions = [];
  var flipCoin;

  if (opts) {
    flipCoin = opts.flipCoin;
  }
  if (!flipCoin) {
    throw new Error('No flip provided to clock.');
  }

  var tickDoneCallback;

  // var emitter = new EventEmitter();

  function queueAction(action) {
    actions.push(action);
  }

  function clearQueue() {
    actions.length = 0;
  }

  function getNumberOfQueuedActions() {
    return actions.length;
  }

  function tick(done) {
    tickDoneCallback = done;
    runActions(cleanUpTick);
  }

  function cleanUpTick() {
    clearQueue();
    // emitter.emit('tickDone');
    if (tickDoneCallback) {
      tickDoneCallback();
    }
  }

  function runActions(done) {
    actions.sort(compareActionSegments);
    async.series(_.pluck(actions, 'go'), done);
  }

  function compareActionSegments(a, b) {
    if (a.segment === b.segment) {
      // 0 favors a, 1 favors b.
      return flipCoin() === 0 ? -1 : 1;
    }
    else {
      return a.segment > b.segment;
    }
  }

  return {
    tick: tick,
    queueAction: queueAction,
    clearQueue: clearQueue,
    getNumberOfQueuedActions: getNumberOfQueuedActions,
    // on: emitter.on.bind(emitter),
    // removeListener: emitter.removeListener.bind(emitter)
  };  
}

module.exports = {
  create: createClock
};
