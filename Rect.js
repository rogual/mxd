var Vector = require('./Vector');
var Util = require('./Util');

var Rect = module.exports = function Rect(topLeft, bottomRight) {
  this.topLeft = topLeft;
  this.bottomRight = bottomRight;
};

Rect.fromSize = function(topLeft, size) {
  return new Rect(topLeft, Vector.add(topLeft, size));
};

Rect.fromSides = function(left, top, right, bottom) {
  return new Rect([left, top], [right, bottom]);
};

Rect.minimumBounds = function(a, b) {
  return Rect.fromSides(
    Math.min(a.left, b.left),
    Math.min(a.top, b.top),
    Math.max(a.right, b.right),
    Math.max(a.bottom, b.bottom)
  );
};

function part(prop, idx) {
  return {
    get: function() { return this[prop][idx]; },
    set: function(v) { this[prop][idx] = v; }
  };
}

Object.defineProperties(Rect.prototype, {
  top:    part('topLeft', 1),
  left:    part('topLeft', 0),
  bottom:    part('bottomRight', 1),
  right:    part('bottomRight', 0),
  width: {
    get: function() { return this.right - this.left; },
    set: function(w) { this.right = this.left + w; }
  },
  height: {
    get: function() { return this.bottom - this.top; },
    set: function(h) { this.bottom = this.top + h; }
  },
  size: {
    get: function() { return Vector.sub(this.bottomRight, this.topLeft); },
    set: function(sz) { this.bottomRight = Vector.add(this.topLeft, sz); }
  },
  centre: {
    get: function() {
      return Vector.add(this.topLeft, Vector.scale(this.size, .5));
    }
  },
  corners: {
    get: function() {
      return [
        this.topLeft,
        [this.left, this.bottom],
        [this.right, this.top],
        this.bottomRight
      ];
    }
  },
  norm: {
    get: function() {
      return Rect.fromSides(
        Math.min(this.left, this.right),
        Math.min(this.top, this.bottom),
        Math.max(this.left, this.right),
        Math.max(this.top, this.bottom)
      );
    }
  }
});

Rect.prototype.transform = function(m) {
  return new Rect(
    Vector.transform(this.topLeft, m),
    Vector.transform(this.bottomRight, m)
  );
};

Rect.prototype.translate = function(v) {
  return new Rect(
    Vector.add(this.topLeft, v),
    Vector.add(this.bottomRight, v)
  );
};

Rect.prototype.iterect = function(cb) {
  return Vector.iterect(this.topLeft, this.bottomRight, cb);
};

Rect.prototype.floor = function() {
  return new Rect(
    Vector.floor(this.topLeft),
    Vector.floor(this.bottomRight)
  );
};

Rect.prototype.ceil = function() {
  return new Rect(
    Vector.ceil(this.topLeft),
    Vector.ceil(this.bottomRight)
  );
};

Rect.prototype.roundOut = function() {
  return new Rect(
    Vector.floor(this.topLeft),
    Vector.ceil(this.bottomRight)
  );
};

Rect.prototype.roundIn = function() {
  return new Rect(
    Vector.ceil(this.topLeft),
    Vector.floor(this.bottomRight)
  );
};

Rect.prototype.map = function(fn) {
  return new Rect(
    fn(this.topLeft),
    fn(this.bottomRight)
  );
};

Rect.prototype.containsPoint = function(pt) {
  return this.left <= pt[0] && pt[0] < this.right &&
         this.top <= pt[1] && pt[1] < this.bottom;
};

Rect.prototype.toString = function() {
  return this.topLeft.toString() + ':' + this.size.toString();
};

Rect.boundsBuilder = function() {
  var bounds = null;

  function extendTo(pt) {
    if (pt[0] < bounds.left) bounds.left = pt[0];
    if (pt[0] > bounds.right) bounds.right = pt[0];
    if (pt[1] < bounds.top) bounds.top = pt[1];
    if (pt[1] > bounds.bottom) bounds.bottom = pt[1];
  }

  function pushPoint(pt) {
    if (bounds === null)
      bounds = Rect.fromSize(Vector.copy(pt), [1, 1]);
    else {
      extendTo(pt);
    }
  }

  function pushBounds(sub) {
    if (bounds === null)
      bounds = sub;
    else {
      bounds = Rect.minimumBounds(bounds, sub);
    }
  }

  return Object.defineProperties({
    pushPoint: pushPoint,
    pushBounds: pushBounds
  }, {
    bounds: {get: function() { return bounds; }}
  });
};
