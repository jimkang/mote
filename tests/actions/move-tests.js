var test = require('tape');
var createMove = require('../../actions/move').create;

test('Move action', function moveActionTest(t) {
  t.plan(3);

  var mockGriddler = {
    getVerticleSliceAtCoords: function mockSliceAtCoords(coords) {
      t.deepEqual(coords, [4, 4], 'Calls griddler to check for dest cell.');
      return null;
    }
  };

  var move = createMove({
    vector: [1, 0],
    respectObstacle: true,
    griddler: mockGriddler
  });

  var cell = {
    id: 'mover',
    live: {
      coords: [3, 4]
    },
    next: {      
    }
  };

  move.go(
    {
      actor: cell      
    },
    function checkResults(error) {
      t.ok(!error, 'No error while moving.');
      t.deepEqual(cell.next.coords, [4, 4]);
    }
  );
});
