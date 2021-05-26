var segmentMultipliers = [null, [1, -1], [1, 1], [-1, 1], [-1, -1]];
var inverseSegmentMultipliers = [null, [-1, -1], [-1, 1], [1, 1], [1, -1]];
var TWO_PI = 2 * Math.PI;
function pointXYFromArray(a) {
  return {
    x: a[0],
    y: a[1]
  };
}
function gradient(p1, p2) {
  if (p2.x === p1.x) return p2.y > p1.y ? Infinity : -Infinity;else if (p2.y === p1.y) return p2.x > p1.x ? 0 : -0;else return (p2.y - p1.y) / (p2.x - p1.x);
}
function normal(p1, p2) {
  return -1 / gradient(p1, p2);
}
function lineLength(p1, p2) {
  return Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2));
}
function quadrant(p1, p2) {
  if (p2.x > p1.x) {
    return p2.y > p1.y ? 2 : 1;
  } else if (p2.x == p1.x) {
    return p2.y > p1.y ? 2 : 1;
  } else {
    return p2.y > p1.y ? 3 : 4;
  }
}
function theta(p1, p2) {
  var m = gradient(p1, p2),
      t = Math.atan(m),
      s = quadrant(p1, p2);
  if (s == 4 || s == 3) t += Math.PI;
  if (t < 0) t += 2 * Math.PI;
  return t;
}
function intersects(r1, r2) {
  var x1 = r1.x,
      x2 = r1.x + r1.w,
      y1 = r1.y,
      y2 = r1.y + r1.h,
      a1 = r2.x,
      a2 = r2.x + r2.w,
      b1 = r2.y,
      b2 = r2.y + r2.h;
  return x1 <= a1 && a1 <= x2 && y1 <= b1 && b1 <= y2 || x1 <= a2 && a2 <= x2 && y1 <= b1 && b1 <= y2 || x1 <= a1 && a1 <= x2 && y1 <= b2 && b2 <= y2 || x1 <= a2 && a1 <= x2 && y1 <= b2 && b2 <= y2 || a1 <= x1 && x1 <= a2 && b1 <= y1 && y1 <= b2 || a1 <= x2 && x2 <= a2 && b1 <= y1 && y1 <= b2 || a1 <= x1 && x1 <= a2 && b1 <= y2 && y2 <= b2 || a1 <= x2 && x1 <= a2 && b1 <= y2 && y2 <= b2;
}
function encloses(r1, r2, allowSharedEdges) {
  var x1 = r1.x,
      x2 = r1.x + r1.w,
      y1 = r1.y,
      y2 = r1.y + r1.h,
      a1 = r2.x,
      a2 = r2.x + r2.w,
      b1 = r2.y,
      b2 = r2.y + r2.h,
      c = function c(v1, v2, v3, v4) {
    return allowSharedEdges ? v1 <= v2 && v3 >= v4 : v1 < v2 && v3 > v4;
  };
  return c(x1, a1, x2, a2) && c(y1, b1, y2, b2);
}
function pointOnLine(fromPoint, toPoint, distance) {
  var m = gradient(fromPoint, toPoint),
      s = quadrant(fromPoint, toPoint),
      segmentMultiplier = distance > 0 ? segmentMultipliers[s] : inverseSegmentMultipliers[s],
      theta = Math.atan(m),
      y = Math.abs(distance * Math.sin(theta)) * segmentMultiplier[1],
      x = Math.abs(distance * Math.cos(theta)) * segmentMultiplier[0];
  return {
    x: fromPoint.x + x,
    y: fromPoint.y + y
  };
}
function perpendicularLineTo(fromPoint, toPoint, length) {
  var m = gradient(fromPoint, toPoint),
      theta2 = Math.atan(-1 / m),
      y = length / 2 * Math.sin(theta2),
      x = length / 2 * Math.cos(theta2);
  return [{
    x: toPoint.x + x,
    y: toPoint.y + y
  }, {
    x: toPoint.x - x,
    y: toPoint.y - y
  }];
}

export { TWO_PI, encloses, gradient, intersects, lineLength, normal, perpendicularLineTo, pointOnLine, pointXYFromArray, quadrant, theta };
