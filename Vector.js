var _ = require('lodash');

var Util = require('./Util');

var Vector = module.exports = {};

function def(name, fn) {
  Vector[name] = fn;
}

def('unit', function(n, i) {
  var v = new Array(n);
  for (var j=0; j<n; j++)
    v[j] = (j == i) ? 1 : 0;
  return v;
});

def('copy', function(a) {
  return a.slice();
});

def('eq', function(a, b) {
  return _.isEqual(a, b);
});

def('dot', function(a, b) {
  return Util.sum(Vector.mul(a, b));
});

def('magSq', function(a) { return Vector.dot(a, a); });
def('mag', function(a) { return Math.sqrt(Vector.magSq(a)); });

def('norm', function(a) {
  var mag = Vector.mag(a);
  return mag ? Vector.scale(a, 1 / mag) : a;
});

def('withMag', function(a, mag) { return Vector.scale(Vector.norm(a), mag); });

def('scale', function(v, f) { return v.map(function(x) { return x * f; }); });
def('rscale', function(f, v) { return Vector.scale(v, f); });

def('scaleInverse', function(v, f) { return v.map(function(x) { return f / x; }); });
def('rscaleInverse', function(f, v) { return Vector.scaleInverse(v, f); });

def('floor', function(v) { return v.map(Math.floor); });
def('ceil', function(v) { return v.map(Math.ceil); });

function partwise(op) {
  return function(a, b) {
    return _.zip([a, b]).map(function(x) { return op(x[0], x[1]); });
  };
}

def('add', partwise(function(a, b) { return a + b; }));
def('sub', partwise(function(a, b) { return a - b; }));
def('mul', partwise(function(a, b) { return a * b; }));
def('div', partwise(function(a, b) { return a / b; }));
def('mod', partwise(Util.mod));

def('transform', function(v, m) {
  return [
    v[0] * m[0] + v[1] * m[1] + m[4],
    v[0] * m[2] + v[1] * m[3] + m[5]
  ];
});

def('iterect', function(a, b, cb) {
  var i = [0, 0];
  for (i[0] = a[0]; i[0] < b[0]; i[0]++)
  for (i[1] = a[1]; i[1] < b[1]; i[1]++) {
    cb(i);
  }
});

def('perpendicular', function(a) {
  return [a[1], -a[0]];
});

def('invert', function(v) {
  return v.map(function(x) { return -x; });
});
