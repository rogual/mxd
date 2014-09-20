var MXD = require('./MXD.js');
var Util = require('./Util.js');

var M = MXD.Matrix;

Util.assert(
  M.eq(
    [[1,2], [3,4]],
    [[1,2], [3,4]]
  )
);

Util.assert(
  !M.eq(
    [[1,2], [3,4]],
    [[1,2], [3,5]]
  )
);

Util.assert(
  M.eq(
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
  )
);
