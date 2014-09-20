var MXD = require('../MXD.js');
var V = MXD.Vector;
var assert = require('assert');

suite('Math', function() {

  test('operators', function() {

    assert.deepEqual(MXD.math('a + b', [1, 2], [3, 4]), [4, 6]);
    assert.deepEqual(MXD.math('a + a', [1, 2]), [2, 4]);

  });

});
