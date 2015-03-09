var test = require('tape');
var createGriddler = require('../griddler').create;

test('Basic tests', function basicTests(t) {
  t.plan(7);

  var griddler = createGriddler();

  var cellOne_A = {
    d: {
      notifyRemoved: function notifyRemoved(opts) {
        t.deepEqual(
          opts.replacement, 
          cellTwo_A,
          'Cell is notified about its replacement.'
        );
      }
    },
    coords: [10, 11]
  };

  var cellOne_C = {
    d: {},
    coords: [10, 11]
  };

  var cellOne_B = {
    d: {},
    coords: [11, 11]
  };

  var cellTwo_A = {
    d: {},
    coords: [10, 11]
  };

  griddler.setCell('layer-one', cellOne_A);

  var retrieved = griddler.getCell('layer-one', [10, 11]);
  t.deepEqual(retrieved, cellOne_A, 'Set cell A is retrieved.');

  griddler.setCell('layer-one', cellOne_B);

  var retrievedB = griddler.getCell('layer-one', [11, 11]);
  t.deepEqual(retrievedB, cellOne_B, 'Set cell B is retrieved.');

  var retrievedMissing = griddler.getCell('layer-one', [100, 0]);
  t.equal(
    retrievedMissing, undefined, 'Returns undefined for unoccupied coords.'
  );

  griddler.setCell('layer-one', cellOne_C);
  var retrievedOne_C = griddler.getCell('layer-one', [10, 11]);
  t.deepEqual(
    retrievedOne_C,
    cellOne_C,
    'Retrieves cell one_C, which replaced cell one_A.'
  );

  griddler.setCell('layer-two', cellTwo_A);
  var retrievedTwo_A = griddler.getCell('layer-two', [10, 11]);
  t.deepEqual(retrievedTwo_A, cellTwo_A, 'Set cell two_A is retrieved.');

  var cellsAt10_11 = griddler.getCellsOnAllLayers([10, 11]);
  t.deepEqual(
    cellsAt10_11,
    [
      cellOne_C,
      cellTwo_A
    ],
    'Gets cells on both layers at 10, 11'
  );
});
