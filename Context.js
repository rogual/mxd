var _ = require('lodash');


var Util = require('./Util');

var Context = module.exports = function() {
  this.optab = {};
  this.methods = {};
};

Context.prototype.operator = function(token, precedence, assoc) {
  this.optab[token] = {
    precedence: precedence,
    assoc: assoc,
  };
};

Context.prototype.method = function(spec, ret, fn) {
  this.methods[spec] = {
    fn: fn,
    ret: ret
  };
};

Context.prototype.parse = function(src) {
  var rpn = toRPN(this, src);
  var fn = dispatcher(this, rpn);
  return fn;
};

function dispatcher(context, rpn) {

  var params = findParams(context, rpn);

  var target;

  target = function() {
    var args = _.toArray(arguments).slice(1);
    var types = findTypes(context, params, args);
    target = typed(context, rpn, params, types);
    return target.apply(null, arguments);
  };

  return function() {
    return target.apply(null, arguments);
  };

}

function findParams(context, rpn) {

  var params = [];

  rpn.forEach(function(token) {
    if (!context.optab[token] && /[a-z]+/.test(token)) {
      if (params.indexOf(token) == -1)
        params.push(token);
    }
  });

  return params;
}

function findTypes(context, params, args) {
  var r = {};
  for (var i in args) {
    var arg = args[i];
    var type = arg.constructor;
    var name = (type === Array) ? "Vector" : type.name;
    r[params[i]] = name;
  }
  return r;
}

function typed(context, rpn, params, types) {

  var stack = [];

  var optab = context.optab;

  function getType(x) {
    if (x.type) return x.type;
    return typeof(x) == "number" ? "Number" : types[x];
  }

  function str(x) {
    return x.js || x;
  }

  rpn.forEach(function(token) {
    var op = optab[token];
    if (op) {
      var a = stack.pop(); var ta = getType(a);
      var b = stack.pop(); var tb = getType(b);
      var key = [ta, token, tb].join(' ');
      var method = context.methods[key];

      if (!method)
        throw new Error("MXD: No method for " + key);

      stack.push({
        js: method.fn + "(" + str(a) + ", " + str(b) + ")",
        type: method.ret
      });
    }
    else {
      stack.push(token);
    }
  });

  var expr = str(stack.pop());

  return Function.apply(
    null, ["MXD"].concat(params).concat(["return " + expr + ";"])
  );
}

function toRPN(context, src) {
  var queue = [];
  var operators = [];

  var optab = context.optab;

  var peek = function() { return operators[operators.length - 1]; };

  tokens(src, function(token) {

    var top;

    var op = optab[token];

    if (token == "(") {
      operators.push(token);
    }
    else if (token == ")") {
      while ((top = operators.pop()) != "(")
        queue.push(top);
      if (top != "(")
        throw new Error("mismatched brackets");
    }
    else if (op) {
      for (;;) {

        top = optab[peek()];
        if (top && (
          op.precedence < top.precedence ||
          (op.assoc == 'l' && op.precedence == top.precedence)
        ))
          queue.push(operators.pop());
        else
          break;
      }
      operators.push(token);
    }
    else {
      queue.push(token);
    }
  });

  while (operators.length) {
    var top = operators.pop();
    if (top == "(" || top == ")")
      throw new Error("mismatched brackets");
    queue.push(top);
  }

  return queue;
}

function tokens(src, cb) {
  while (src.length) {

    var m = /^\s*([a-z]+|[^a-z])/.exec(src);
    if (!m)
      break;

    var tok = m[1];
    var num = parseFloat(tok);
    var r = isNaN(num) ? tok : num;

    cb(r);
    src = src.substr(m[0].length);
  }
}
