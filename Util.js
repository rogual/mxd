var _ = require('lodash');

var Util = module.exports = {};

Util.mod = function(a, b) {
  return (((a%b)+b)%b);
};

Util.product = function(xs) {
  return _.reduce(xs, function(a, b) { return a * b; }, 1);
};

Util.sum = function(xs) {
  return _.reduce(xs, function(a, b) { return a + b; }, 0);
};

Util.memoize = function(fn) {
  return _.memoize(fn, function() { return _.toArray(arguments); });
};
