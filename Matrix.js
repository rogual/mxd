var _ = require('lodash');
var assert = require('assert');

var Util = require('./Util');
var V = require('./Vector');
var M = module.exports = {};

function def(name, fn) {
  M[name] = fn;
}

def('identity', _.memoize(function(n) {
  assert(n > 0);
  var r = new Array(n);
  for (var i=0; i<n; i++) {
    r[i] = V.unit(n, i);
  }
  return r;
}));

def('scaling', function(v) {
  var n = v.length;
  var r = new Array(n);
  for (var i=0; i<n; i++) {
    r[i] = V.scale(V.unit(n, i), v[i]);
  }
  return r;
});

def('rotation', function(a) {
  return [
    [Math.cos(a), -Math.sin(a)],
    [Math.sin(a), Math.cos(a)]
  ];
});

def('eq', function(a, b) {
  if (a.length != b.length)
    return false;
  for (var i in a) {
    if (a[i].length != b[i].length)
      return false;
    for (var j in a[i])
      if (a[i][j] != b[i][j])
        return false;
  }
  return true;
});

var mulInst = Util.memoize(function(m, n, p) {
  var code = 'return [' + _.times(n, function(i) {
    return '[' + _.times(p, function(j) {
      return _.times(m, function(k) {
        return 'a['+i+']['+k+'] * b['+k+']['+j+']';
      }).join(' + ');
    }).join(', ') + ']';
  }).join(',\n') + '];';
  return new Function('a', 'b', code);
});

def('mul', function(a, b) {

  var m = a[0].length;
  var n = a.length;

  var p = b[0].length;

  assert.equal(b.length, m);

  var impl = mulInst(m, n, p);

  return impl(a, b);
});

def('apply', function(m, v) {
  return M.mul([v], m)[0];
});
