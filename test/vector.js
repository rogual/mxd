var assert = require('assert');
var _ = require('lodash');

var MXD = require('../MXD.js');
var V = MXD.Vector;

suite('Vector', function() {

  test('eq', function() {
    var a = [1, 2, 3];
    var b = [1, 2, 3];
    var c = [1, 2, 4];
    assert(V.eq(a, b));
    assert(!V.eq(a, c));
  });

  test('unit', function() {
    assert.deepEqual(V.unit(3, 0), [1, 0, 0]);
    assert.deepEqual(V.unit(3, 1), [0, 1, 0]);
    assert.deepEqual(V.unit(3, 2), [0, 0, 1]);
  });

  test('arithmetic', function() {
    assert.deepEqual(V.add([1, 2, 3], [4, 5, 6]), [5, 7, 9]);
    assert.deepEqual(V.sub([5, 7, 9], [4, 5, 6]), [1, 2, 3]);
    assert.deepEqual(V.mul([5, 7, 9], [4, 5, 6]), [20, 35, 54]);
    assert.deepEqual(V.div([15, 21, 81], [5, 3, 9]), [3, 7, 9]);
  });

  test('mag', function() {
    assert.deepEqual(V.norm([42, 0]), [1, 0]);
    assert.deepEqual(V.withMag([42, 0], 56), [56, 0]);
  });

  test('iterect', function() {
    var r = [];
    V.iterect([1, 1], [3, 3], function(x) {
      r.push(V.copy(x));
    });
    assert(_.isEqual(r, [[1, 1], [1, 2], [2, 1], [2, 2]]));
  });

  test('angle', function() {
    [[1, 0], [2, 0], [1, 1], [0, -1], [-1, -1], [100, 67]].forEach(function(v) {
      assertVectorsAlmostEqual(V.norm(v), V.fromAngle(V.angle(v)));
    });

    assertAlmostEqual(V.angle([1, 0]), 0);
    assertAlmostEqual(V.angle([0, 1]), Math.PI / 2);
    assertAlmostEqual(V.angle([-1, 0]), Math.PI);
    assertAlmostEqual(V.angle([0, -1]), -Math.PI / 2);

    assertVectorsAlmostEqual(V.fromAngle(0), [1, 0]);
    assertVectorsAlmostEqual(V.fromAngle(Math.PI / 2), [0, 1]);
    assertVectorsAlmostEqual(V.fromAngle(Math.PI), [-1, 0]);
    assertVectorsAlmostEqual(V.fromAngle(-Math.PI / 2), [0, -1]);
  });

});

var epsilon = 10e-10;

function assertAlmostEqual(x, y) {
  assert(Math.abs(x - y) < epsilon);
}

function assertVectorsAlmostEqual(x, y) {
  assertAlmostEqual(x[0], y[0]);
  assertAlmostEqual(x[1], y[1]);
}
