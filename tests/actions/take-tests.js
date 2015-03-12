var test = require('tape');
var createTake = require('../../actions/take').create;

test('Take action', function takeActionTest(t) {
  t.plan(2);

  var taker = {
    id: 'taker',
    live: {
      coords: [5, 2],
      inventory: []
    },
    next: {
    }
  };

  var sword = {
    id: 'sword',
    live: {
      coords: [5, 1]
    },
    next: {      
    }
  };

  var take = createTake({
    actor: taker,
    what: sword
    // griddler: mockGriddler
  });

  take.go(checkResults);

  function checkResults(error) {
    t.ok(!error, 'No error while taking.');
    t.deepEqual(taker.next.inventory, [sword]);
  }
});

// test('Can take', function canTake(t) {
//   // TODO. take.possible()  
// });
