import { StraightSegment, ArcSegment, AbstractConnector, Connectors } from '@jsplumb/core';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function sgn(n) {
  return n < 0 ? -1 : n === 0 ? 0 : 1;
}
function segmentDirections(segment) {
  return [sgn(segment[2] - segment[0]), sgn(segment[3] - segment[1])];
}
function segLength(s) {
  return Math.sqrt(Math.pow(s[0] - s[2], 2) + Math.pow(s[1] - s[3], 2));
}
function _cloneArray(a) {
  var _a = [];
  _a.push.apply(_a, a);
  return _a;
}
var FlowchartConnector = function (_AbstractConnector) {
  _inherits(FlowchartConnector, _AbstractConnector);
  var _super = _createSuper(FlowchartConnector);
  function FlowchartConnector(connection, params) {
    var _this;
    _classCallCheck(this, FlowchartConnector);
    _this = _super.call(this, connection, params);
    _this.connection = connection;
    _defineProperty(_assertThisInitialized(_this), "type", FlowchartConnector.type);
    _defineProperty(_assertThisInitialized(_this), "internalSegments", []);
    _defineProperty(_assertThisInitialized(_this), "midpoint", void 0);
    _defineProperty(_assertThisInitialized(_this), "alwaysRespectStubs", void 0);
    _defineProperty(_assertThisInitialized(_this), "cornerRadius", void 0);
    _defineProperty(_assertThisInitialized(_this), "lastx", void 0);
    _defineProperty(_assertThisInitialized(_this), "lasty", void 0);
    _defineProperty(_assertThisInitialized(_this), "lastOrientation", void 0);
    _defineProperty(_assertThisInitialized(_this), "loopbackRadius", void 0);
    _defineProperty(_assertThisInitialized(_this), "isLoopbackCurrently", void 0);
    _this.midpoint = params.midpoint == null || isNaN(params.midpoint) ? 0.5 : params.midpoint;
    _this.cornerRadius = params.cornerRadius != null ? params.cornerRadius : 0;
    _this.alwaysRespectStubs = params.alwaysRespectStubs === true;
    _this.lastx = null;
    _this.lasty = null;
    _this.lastOrientation = null;
    _this.loopbackRadius = params.loopbackRadius || 25;
    _this.isLoopbackCurrently = false;
    return _this;
  }
  _createClass(FlowchartConnector, [{
    key: "getDefaultStubs",
    value: function getDefaultStubs() {
      return [30, 30];
    }
  }, {
    key: "addASegment",
    value: function addASegment(x, y, paintInfo) {
      if (this.lastx === x && this.lasty === y) {
        return;
      }
      var lx = this.lastx == null ? paintInfo.sx : this.lastx,
          ly = this.lasty == null ? paintInfo.sy : this.lasty,
          o = lx === x ? "v" : "h";
      this.lastx = x;
      this.lasty = y;
      this.internalSegments.push([lx, ly, x, y, o]);
    }
  }, {
    key: "writeSegments",
    value: function writeSegments(paintInfo) {
      var current = null,
          next,
          currentDirection,
          nextDirection;
      for (var i = 0; i < this.internalSegments.length - 1; i++) {
        current = current || _cloneArray(this.internalSegments[i]);
        next = _cloneArray(this.internalSegments[i + 1]);
        currentDirection = segmentDirections(current);
        nextDirection = segmentDirections(next);
        if (this.cornerRadius > 0 && current[4] !== next[4]) {
          var minSegLength = Math.min(segLength(current), segLength(next));
          var radiusToUse = Math.min(this.cornerRadius, minSegLength / 2);
          current[2] -= currentDirection[0] * radiusToUse;
          current[3] -= currentDirection[1] * radiusToUse;
          next[0] += nextDirection[0] * radiusToUse;
          next[1] += nextDirection[1] * radiusToUse;
          var ac = currentDirection[1] === nextDirection[0] && nextDirection[0] === 1 || currentDirection[1] === nextDirection[0] && nextDirection[0] === 0 && currentDirection[0] !== nextDirection[1] || currentDirection[1] === nextDirection[0] && nextDirection[0] === -1,
              sgny = next[1] > current[3] ? 1 : -1,
              sgnx = next[0] > current[2] ? 1 : -1,
              sgnEqual = sgny === sgnx,
              cx = sgnEqual && ac || !sgnEqual && !ac ? next[0] : current[2],
              cy = sgnEqual && ac || !sgnEqual && !ac ? current[3] : next[1];
          this._addSegment(StraightSegment, {
            x1: current[0],
            y1: current[1],
            x2: current[2],
            y2: current[3]
          });
          this._addSegment(ArcSegment, {
            r: radiusToUse,
            x1: current[2],
            y1: current[3],
            x2: next[0],
            y2: next[1],
            cx: cx,
            cy: cy,
            ac: ac
          });
        } else {
          this._addSegment(StraightSegment, {
            x1: current[0],
            y1: current[1],
            x2: current[2],
            y2: current[3]
          });
        }
        current = next;
      }
      if (next != null) {
        this._addSegment(StraightSegment, {
          x1: next[0],
          y1: next[1],
          x2: next[2],
          y2: next[3]
        });
      }
    }
  }, {
    key: "_compute",
    value: function _compute(paintInfo, params) {
      var _this2 = this;
      this.internalSegments.length = 0;
      this.lastx = null;
      this.lasty = null;
      this.lastOrientation = null;
      var commonStubCalculator = function commonStubCalculator(axis) {
        return [paintInfo.startStubX, paintInfo.startStubY, paintInfo.endStubX, paintInfo.endStubY];
      },
          stubCalculators = {
        perpendicular: commonStubCalculator,
        orthogonal: commonStubCalculator,
        opposite: function opposite(axis) {
          var pi = paintInfo,
              idx = axis === "x" ? 0 : 1,
              areInProximity = {
            "x": function x() {
              return pi.so[idx] === 1 && (pi.startStubX > pi.endStubX && pi.tx > pi.startStubX || pi.sx > pi.endStubX && pi.tx > pi.sx) || pi.so[idx] === -1 && (pi.startStubX < pi.endStubX && pi.tx < pi.startStubX || pi.sx < pi.endStubX && pi.tx < pi.sx);
            },
            "y": function y() {
              return pi.so[idx] === 1 && (pi.startStubY > pi.endStubY && pi.ty > pi.startStubY || pi.sy > pi.endStubY && pi.ty > pi.sy) || pi.so[idx] === -1 && (pi.startStubY < pi.endStubY && pi.ty < pi.startStubY || pi.sy < pi.endStubY && pi.ty < pi.sy);
            }
          };
          if (!_this2.alwaysRespectStubs && areInProximity[axis]()) {
            return {
              "x": [(paintInfo.sx + paintInfo.tx) / 2, paintInfo.startStubY, (paintInfo.sx + paintInfo.tx) / 2, paintInfo.endStubY],
              "y": [paintInfo.startStubX, (paintInfo.sy + paintInfo.ty) / 2, paintInfo.endStubX, (paintInfo.sy + paintInfo.ty) / 2]
            }[axis];
          } else {
            return [paintInfo.startStubX, paintInfo.startStubY, paintInfo.endStubX, paintInfo.endStubY];
          }
        }
      };
      var stubs = stubCalculators[paintInfo.anchorOrientation](paintInfo.sourceAxis),
          idx = paintInfo.sourceAxis === "x" ? 0 : 1,
          oidx = paintInfo.sourceAxis === "x" ? 1 : 0,
          ss = stubs[idx],
          oss = stubs[oidx],
          es = stubs[idx + 2],
          oes = stubs[oidx + 2];
      this.addASegment(stubs[0], stubs[1], paintInfo);
      var midx = paintInfo.startStubX + (paintInfo.endStubX - paintInfo.startStubX) * this.midpoint,
          midy = paintInfo.startStubY + (paintInfo.endStubY - paintInfo.startStubY) * this.midpoint;
      var orientations = {
        x: [0, 1],
        y: [1, 0]
      },
          lineCalculators = {
        perpendicular: function perpendicular(axis, ss, oss, es, oes) {
          var pi = paintInfo,
              sis = {
            x: [[[1, 2, 3, 4], null, [2, 1, 4, 3]], null, [[4, 3, 2, 1], null, [3, 4, 1, 2]]],
            y: [[[3, 2, 1, 4], null, [2, 3, 4, 1]], null, [[4, 1, 2, 3], null, [1, 4, 3, 2]]]
          },
              stubs = {
            x: [[pi.startStubX, pi.endStubX], null, [pi.endStubX, pi.startStubX]],
            y: [[pi.startStubY, pi.endStubY], null, [pi.endStubY, pi.startStubY]]
          },
              midLines = {
            x: [[midx, pi.startStubY], [midx, pi.endStubY]],
            y: [[pi.startStubX, midy], [pi.endStubX, midy]]
          },
              linesToEnd = {
            x: [[pi.endStubX, pi.startStubY]],
            y: [[pi.startStubX, pi.endStubY]]
          },
              startToEnd = {
            x: [[pi.startStubX, pi.endStubY], [pi.endStubX, pi.endStubY]],
            y: [[pi.endStubX, pi.startStubY], [pi.endStubX, pi.endStubY]]
          },
              startToMidToEnd = {
            x: [[pi.startStubX, midy], [pi.endStubX, midy], [pi.endStubX, pi.endStubY]],
            y: [[midx, pi.startStubY], [midx, pi.endStubY], [pi.endStubX, pi.endStubY]]
          },
              otherStubs = {
            x: [pi.startStubY, pi.endStubY],
            y: [pi.startStubX, pi.endStubX]
          },
              soIdx = orientations[axis][0],
              toIdx = orientations[axis][1],
              _so = pi.so[soIdx] + 1,
              _to = pi.to[toIdx] + 1,
              otherFlipped = pi.to[toIdx] === -1 && otherStubs[axis][1] < otherStubs[axis][0] || pi.to[toIdx] === 1 && otherStubs[axis][1] > otherStubs[axis][0],
              stub1 = stubs[axis][_so][0],
              stub2 = stubs[axis][_so][1],
              segmentIndexes = sis[axis][_so][_to];
          if (pi.segment === segmentIndexes[3] || pi.segment === segmentIndexes[2] && otherFlipped) {
            return midLines[axis];
          } else if (pi.segment === segmentIndexes[2] && stub2 < stub1) {
            return linesToEnd[axis];
          } else if (pi.segment === segmentIndexes[2] && stub2 >= stub1 || pi.segment === segmentIndexes[1] && !otherFlipped) {
            return startToMidToEnd[axis];
          } else if (pi.segment === segmentIndexes[0] || pi.segment === segmentIndexes[1] && otherFlipped) {
            return startToEnd[axis];
          }
        },
        orthogonal: function orthogonal(axis, startStub, otherStartStub, endStub, otherEndStub) {
          var pi = paintInfo,
              extent = {
            "x": pi.so[0] === -1 ? Math.min(startStub, endStub) : Math.max(startStub, endStub),
            "y": pi.so[1] === -1 ? Math.min(startStub, endStub) : Math.max(startStub, endStub)
          }[axis];
          return {
            "x": [[extent, otherStartStub], [extent, otherEndStub], [endStub, otherEndStub]],
            "y": [[otherStartStub, extent], [otherEndStub, extent], [otherEndStub, endStub]]
          }[axis];
        },
        opposite: function opposite(axis, ss, oss, es, oes) {
          var pi = paintInfo,
              otherAxis = {
            "x": "y",
            "y": "x"
          }[axis],
              dim = {
            "x": "h",
            "y": "w"
          }[axis],
              comparator = pi["is" + axis.toUpperCase() + "GreaterThanStubTimes2"];
          if (params.sourceEndpoint.elementId === params.targetEndpoint.elementId) {
            var _val = oss + (1 - params.sourceEndpoint._anchor[otherAxis]) * params.sourceInfo[dim] + _this2.maxStub;
            return {
              "x": [[ss, _val], [es, _val]],
              "y": [[_val, ss], [_val, es]]
            }[axis];
          } else if (!comparator || pi.so[idx] === 1 && ss > es || pi.so[idx] === -1 && ss < es) {
            return {
              "x": [[ss, midy], [es, midy]],
              "y": [[midx, ss], [midx, es]]
            }[axis];
          } else if (pi.so[idx] === 1 && ss < es || pi.so[idx] === -1 && ss > es) {
            return {
              "x": [[midx, pi.sy], [midx, pi.ty]],
              "y": [[pi.sx, midy], [pi.tx, midy]]
            }[axis];
          }
        }
      };
      var p = lineCalculators[paintInfo.anchorOrientation](paintInfo.sourceAxis, ss, oss, es, oes);
      if (p) {
        for (var i = 0; i < p.length; i++) {
          this.addASegment(p[i][0], p[i][1], paintInfo);
        }
      }
      this.addASegment(stubs[2], stubs[3], paintInfo);
      this.addASegment(paintInfo.tx, paintInfo.ty, paintInfo);
      this.writeSegments(paintInfo);
    }
  }, {
    key: "transformGeometry",
    value: function transformGeometry(g, dx, dy) {
      return g;
    }
  }]);
  return FlowchartConnector;
}(AbstractConnector);
_defineProperty(FlowchartConnector, "type", "Flowchart");

Connectors.register(FlowchartConnector.type, FlowchartConnector);

export { FlowchartConnector };
