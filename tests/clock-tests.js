var test = require('tape');
var createClock = require('../clock').create;
var callBackOnNextTick = require('conform-async').callBackOnNextTick;

test('Queue actions', function testQueueActions(t) {
  t.plan(7);

  var clock = createClock({
    flipCoin: function mockFlipCoin() {
      return 1;
    }
  });

  var lastActionThatRan;

  var action1 = {
    segment: 1,
    go: function go1(done) {
      t.equal(lastActionThatRan, undefined, 'action1 runs first.');
      lastActionThatRan = 'action1';
      callBackOnNextTick(done);
    }
  };

  var action2 = {
    segment: 2,
    go: function go2(done) {
      t.equal(lastActionThatRan, 'action1', 'action2 runs after action1.');
      lastActionThatRan = 'action2';
      callBackOnNextTick(done);
    }
  };

  var action3 = {
    segment: 2,
    go: function go3(done) {
      t.equal(
        lastActionThatRan, 
        'action2',
        'action3 (at the same segment as action2) runs after action2 because ' +
        'of a random tie breaker.'
      );
      lastActionThatRan = 'action3';
      callBackOnNextTick(done);
    }
  };

  var action4 = {
    segment: 4,
    go: function go4(done) {
      t.equal(lastActionThatRan, 'action3', 'action4 runs after action3.');
      lastActionThatRan = 'action4';
      callBackOnNextTick(done);
    }
  };

  clock.queueAction(action1);
  clock.queueAction(action3);
  clock.queueAction(action2);
  clock.queueAction(action4);

  t.equal(clock.getNumberOfQueuedActions(), 4, 'Queue has actions.');

  clock.on('tickDone', function checkFinalAction() {
    t.equal(
      lastActionThatRan,
      'action4',
      'action4 is the last action run by time tickDone is emitted.'
    );
    t.equal(clock.getNumberOfQueuedActions(), 0, 'Queue is cleared.');
  });

  clock.tick();
});

// Who starts the clock? UI, after checking to make sure all the AI stuff is done.
// run actions
// make updates - Who should do this? Cell thing?
// render - nah, rendering is not up to clock.

