MXD
Linear math library for JS

Goals:
    1. Readable
    2. Fast

Conventions:
    - Vectors are 1d JS Arrays
    - Matrices are 2d JS Arrays
    - Everything is immutable
    - Functions are pure unless otherwise noted

Usage:

    var mxd = require('mxd')

Vectors:

    var V = mxd.Vector;

    Basics:
        V.copy(v)
        V.eq(a, b)
        V.floor(v)
        V.ceil(v)
        V.dot(a, b)
        V.invert(v)

    Part-wise arithmetic (v, v) -> v:
        V.add(a, b)
        V.sub(a, b)
        V.mul(a, b)
        V.div(a, b)
        V.mod(a, b) -- uses mxd.Util.mod

    Magnitude functions:
        V.magSq(v)
        V.mag(v)
        V.norm(v) -- normalize v, except [0, 0] -> [0, 0]
        V.withMag(v, f)

    Scaling:
        V.scale(v, f)
        V.rscale(f, v)
        V.scaleInverse(v, f)
        V.rscaleInverse(f, v)

    Utilities:
        V.transform(v, m) [2D Vectors only]
            Transforms by six-element Canvas matrix

        V.iterect(a, b, cb) [2D Integer Vectors only] [impure]
            for (a[0] <= i < b[0], a[1] <= j < b[1]) cb([i, j])

        V.perpendicular(v) [2D Vectors only]
            [x, y] -> [y, -x] or [-y, x]

Matrices:

    var M = mxd.Matrix;

    M.mul(
        [[1, 2, 3],
         [4, 5, 6],
         [7, 8, 9]],
        [[1, 0, 0],
         [0, 1, 0],
         [0, 0, 1]]);

    M.eq(a, b)

    M.apply(m, v)

    M.scaling(v)
    M.rotation(a) -> [[cos(a), -sin(a)]
                      [sin(a), cos(a)]]


Util:

    var U = mxd.Util;

    U.mod(a, b) -- modulo, properly handling negative args


DSL:

    mxd.math('a + (b * f)')([1, 2], [3, 4], 1.5)
        -> V.add([1, 2]. V.scale([3, 4], 1.5))

    This is still pretty basic. Supports: precedence, grouping, type
    overloading (vec * vec != vec * num)

    mxd.math(expr) -> function(args...)

        args are mapped to variables appearing in 'expr' in the order
        they appear. Repeated variables correspond to the same argument.
