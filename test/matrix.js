var assert = require('assert');
var _ = require('lodash');

var MXD = require('../MXD.js');
var M = MXD.Matrix;

function assertAlmostEqual(a, b) {
  assert(_.isEqual(a, b, function(x, y) {
    if (typeof(x) == 'number' && typeof(y) == 'number')
      return Math.abs(x - y) < 0.00000001;
  }), a + " !~= " + b);
}

suite('Matrix', function() {

  test('eq', function() {
    var a = [[1, 2], [3, 4]];
    var b = [[1, 2], [3, 4]];
    var c = [[1, 2], [3, 5]];
    assert(M.eq(a, b));
    assert(!M.eq(a, c));
  });

  test('identity', function() {
    assert.deepEqual(
      M.identity(4),
      [[1,0,0,0],
       [0,1,0,0],
       [0,0,1,0],
       [0,0,0,1]]
    );
    assert.deepEqual(M.identity(1), [[1]]);
    assert.throws(_.partial(M.identity, 0));
  });

  test('multiplication', function() {
    assert.deepEqual(
      M.mul(
        [[1,2,3],
         [4,5,6],
         [7,8,9]],
        [[3,2,1],
         [4,2,1],
         [5,2,1]]),
      [[26,12,6],
       [62,30,15],
       [98,48,24]]
    );
  });

  test('apply', function() {
    assert.deepEqual(
      M.apply(
        [[1, 0],
         [0, 1]],
        [42, 57]
      ),
      [42, 57]
    );
  });

  test('rotation', function() {
    assertAlmostEqual(M.apply(M.rotation(Math.PI * 0), [42, 57]), [42, 57]);
    assertAlmostEqual(M.apply(M.rotation(Math.PI * .5), [42, 57]), [57, -42]);
    assertAlmostEqual(M.apply(M.rotation(Math.PI * 1), [42, 57]), [-42, -57]);
    assertAlmostEqual(M.apply(M.rotation(Math.PI * 2), [42, 57]), [42, 57]);
  });

  test('scaling', function() {
    assert.deepEqual(
      M.scaling([5, 6, 7]),
      [[5, 0, 0],
       [0, 6, 0],
       [0, 0, 7]]
    );
  });
});

