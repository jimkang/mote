var test = require('tape');
var createGriddler = require('../griddler').create;

test('Basic tests', function basicTests(t) {
  t.plan(9);

  var griddler = createGriddler();

  var cellOne_A = {
    id: 'one_A',
    notifyRemoved: function notifyRemoved(opts) {
      t.deepEqual(
        opts.replacement, 
        cellOne_C,
        'Cell is notified about its replacement.'
      );
    },
    live: {
      coords: [10, 11]
    }
  };

  var cellOne_C = {
    id: 'one_C',
    live: {
      coords: [10, 11]
    }
  };

  var cellOne_B = {
    id: 'one_B',
    live: {
      coords: [11, 11]
    }
  };

  var cellTwo_A = {
    id: 'two_A',
    live: {
      coords: [10, 11]
    }
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

  var cellsAt10_11 = griddler.getVerticleSliceAtCoords([10, 11]);
  t.deepEqual(
    cellsAt10_11,
    [
      cellOne_C,
      cellTwo_A
    ],
    'Gets cells on both layers at 10, 11'
  );

  var layerOneCells = griddler.getLayer('layer-one');
  t.deepEqual(
    layerOneCells, [cellOne_B, cellOne_C], 'All cells on layer-one retrieved.'
  );

  griddler.removeCell('layer-one', [11, 11]);
  t.equal(
    griddler.getCell('layer-one', [11, 11]), undefined, 'removeCell works.'
  );
});
