

var Context = require('./Context');
var Util = require('./Util');
var _ = require('lodash');

var MXD = module.exports = {};

MXD.Vector = require('./Vector');
MXD.Rect = require('./Rect');
MXD.Matrix = require('./Matrix');

var context = new Context();

context.operator('+', 10, 'l');
context.operator('-', 10, 'l');

context.operator('*', 20, 'l');
context.operator('x', 20, 'l');
context.operator('.', 20, 'l');
context.operator('/', 20, 'l');
context.operator('%', 20, 'l');

context.operator('^', 30, 'r');

context.method('Vector + Vector', 'Vector', 'MXD.Vector.add');
context.method('Vector - Vector', 'Vector', 'MXD.Vector.sub');
context.method('Vector . Vector', 'Number', 'MXD.Vector.dot');
context.method('Vector x Vector', 'Vector', 'MXD.Vector.cross');
context.method('Vector * Vector', 'Vector', 'MXD.Vector.mul');
context.method('Vector / Vector', 'Vector', 'MXD.Vector.div');
context.method('Vector * Number', 'Vector', 'MXD.Vector.scale');
context.method('Number * Vector', 'Vector', 'MXD.Vector.rscale');
context.method('Vector / Number', 'Vector', 'MXD.Vector.scaleInverse');
context.method('Number / Vector', 'Vector', 'MXD.Vector.rscaleInverse');
context.method('Vector % Number', 'Vector', 'MXD.Vector.mod');

context.method('Matrix x Matrix', 'Matrix', 'MXD.Matrix.mul');
context.method('Matrix x Vector', 'Vector', 'MXD.Matrix.apply');

var cache = {};

MXD.math = function(src) {
  var args = _.toArray(arguments).slice(1);
  return MXD.compile(src).apply(null, args);
};

MXD.compile = function(src) {
  return cache[src] || (cache[src] = MXD.compileNoCache(src));
};

MXD.compileNoCache = function(src) {
  var fn = context.parse(src);
  return function() {
    var args = _.toArray(arguments);
    return fn.apply(null, [MXD].concat(args));
  };
};
