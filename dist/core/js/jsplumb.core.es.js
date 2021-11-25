import { log, quadrant, gradient, pointOnLine, lineLength, uuid, isString, EventGenerator, isFunction, clone, extend, merge, setToArray, populate, isNumber, map, isObject, isAssignableFrom, getWithFunction, removeWithFunction, suggest, forEach, getsert, insertSorted, findWithFunction, rotatePoint, filterList, functionChain, addToDictionary, TWO_PI, theta, normal, perpendicularLineTo } from '@jsplumb/util';
import { EMPTY_BOUNDS, AbstractSegment, PerimeterAnchorShapes, AnchorLocations, DEFAULT, WILDCARD } from '@jsplumb/common';

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

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var endpointMap = {};
var endpointComputers = {};
var handlers = {};
var EndpointFactory = {
  get: function get(ep, name, params) {
    var e = endpointMap[name];
    if (!e) {
      throw {
        message: "jsPlumb: unknown endpoint type '" + name + "'"
      };
    } else {
      return new e(ep, params);
    }
  },
  clone: function clone(epr) {
    var handler = handlers[epr.type];
    return EndpointFactory.get(epr.endpoint, epr.type, handler.getParams(epr));
  },
  compute: function compute(endpoint, anchorPoint, orientation, endpointStyle) {
    var c = endpointComputers[endpoint.type];
    if (c != null) {
      return c(endpoint, anchorPoint, orientation, endpointStyle);
    } else {
      log("jsPlumb: cannot find endpoint calculator for endpoint of type ", endpoint.type);
    }
  },
  registerHandler: function registerHandler(eph) {
    handlers[eph.type] = eph;
    endpointMap[eph.type] = eph.cls;
    endpointComputers[eph.type] = eph.compute;
  }
};

var EndpointRepresentation = function () {
  function EndpointRepresentation(endpoint, params) {
    _classCallCheck(this, EndpointRepresentation);
    this.endpoint = endpoint;
    _defineProperty(this, "typeId", void 0);
    _defineProperty(this, "x", void 0);
    _defineProperty(this, "y", void 0);
    _defineProperty(this, "w", void 0);
    _defineProperty(this, "h", void 0);
    _defineProperty(this, "computedValue", void 0);
    _defineProperty(this, "bounds", EMPTY_BOUNDS());
    _defineProperty(this, "classes", []);
    _defineProperty(this, "instance", void 0);
    _defineProperty(this, "type", void 0);
    params = params || {};
    this.instance = endpoint.instance;
    if (endpoint.cssClass) {
      this.classes.push(endpoint.cssClass);
    }
    if (params.cssClass) {
      this.classes.push(params.cssClass);
    }
  }
  _createClass(EndpointRepresentation, [{
    key: "addClass",
    value: function addClass(c) {
      this.classes.push(c);
      this.instance.addEndpointClass(this.endpoint, c);
    }
  }, {
    key: "removeClass",
    value: function removeClass(c) {
      this.classes = this.classes.filter(function (_c) {
        return _c !== c;
      });
      this.instance.removeEndpointClass(this.endpoint, c);
    }
  }, {
    key: "compute",
    value: function compute(anchorPoint, orientation, endpointStyle) {
      this.computedValue = EndpointFactory.compute(this, anchorPoint, orientation, endpointStyle);
      this.bounds.xmin = this.x;
      this.bounds.ymin = this.y;
      this.bounds.xmax = this.x + this.w;
      this.bounds.ymax = this.y + this.h;
    }
  }, {
    key: "setVisible",
    value: function setVisible(v) {
      this.instance.setEndpointVisible(this.endpoint, v);
    }
  }]);
  return EndpointRepresentation;
}();

var DotEndpoint = function (_EndpointRepresentati) {
  _inherits(DotEndpoint, _EndpointRepresentati);
  var _super = _createSuper(DotEndpoint);
  function DotEndpoint(endpoint, params) {
    var _this;
    _classCallCheck(this, DotEndpoint);
    _this = _super.call(this, endpoint, params);
    _defineProperty(_assertThisInitialized(_this), "radius", void 0);
    _defineProperty(_assertThisInitialized(_this), "defaultOffset", void 0);
    _defineProperty(_assertThisInitialized(_this), "defaultInnerRadius", void 0);
    _defineProperty(_assertThisInitialized(_this), "type", DotEndpoint.type);
    params = params || {};
    _this.radius = params.radius || 5;
    _this.defaultOffset = 0.5 * _this.radius;
    _this.defaultInnerRadius = _this.radius / 3;
    return _this;
  }
  return DotEndpoint;
}(EndpointRepresentation);
_defineProperty(DotEndpoint, "type", "Dot");
var DotEndpointHandler = {
  type: DotEndpoint.type,
  cls: DotEndpoint,
  compute: function compute(ep, anchorPoint, orientation, endpointStyle) {
    var x = anchorPoint.curX - ep.radius,
        y = anchorPoint.curY - ep.radius,
        w = ep.radius * 2,
        h = ep.radius * 2;
    if (endpointStyle && endpointStyle.stroke) {
      var lw = endpointStyle.strokeWidth || 1;
      x -= lw;
      y -= lw;
      w += lw * 2;
      h += lw * 2;
    }
    ep.x = x;
    ep.y = y;
    ep.w = w;
    ep.h = h;
    return [x, y, w, h, ep.radius];
  },
  getParams: function getParams(ep) {
    return {
      radius: ep.radius
    };
  }
};

var BlankEndpoint = function (_EndpointRepresentati) {
  _inherits(BlankEndpoint, _EndpointRepresentati);
  var _super = _createSuper(BlankEndpoint);
  function BlankEndpoint(endpoint, params) {
    var _this;
    _classCallCheck(this, BlankEndpoint);
    _this = _super.call(this, endpoint, params);
    _defineProperty(_assertThisInitialized(_this), "type", BlankEndpoint.type);
    return _this;
  }
  return BlankEndpoint;
}(EndpointRepresentation);
_defineProperty(BlankEndpoint, "type", "Blank");
var BlankEndpointHandler = {
  type: BlankEndpoint.type,
  cls: BlankEndpoint,
  compute: function compute(ep, anchorPoint, orientation, endpointStyle) {
    ep.x = anchorPoint.curX;
    ep.y = anchorPoint.curY;
    ep.w = 10;
    ep.h = 0;
    return [anchorPoint.curX, anchorPoint.curY, 10, 0];
  },
  getParams: function getParams(ep) {
    return {};
  }
};

var RectangleEndpoint = function (_EndpointRepresentati) {
  _inherits(RectangleEndpoint, _EndpointRepresentati);
  var _super = _createSuper(RectangleEndpoint);
  function RectangleEndpoint(endpoint, params) {
    var _this;
    _classCallCheck(this, RectangleEndpoint);
    _this = _super.call(this, endpoint, params);
    _defineProperty(_assertThisInitialized(_this), "width", void 0);
    _defineProperty(_assertThisInitialized(_this), "height", void 0);
    _defineProperty(_assertThisInitialized(_this), "type", RectangleEndpoint.type);
    params = params || {};
    _this.width = params.width || 10;
    _this.height = params.height || 10;
    return _this;
  }
  _createClass(RectangleEndpoint, null, [{
    key: "_getParams",
    value: function _getParams(ep) {
      return {
        width: ep.width,
        height: ep.height
      };
    }
  }]);
  return RectangleEndpoint;
}(EndpointRepresentation);
_defineProperty(RectangleEndpoint, "type", "Rectangle");
var RectangleEndpointHandler = {
  type: RectangleEndpoint.type,
  cls: RectangleEndpoint,
  compute: function compute(ep, anchorPoint, orientation, endpointStyle) {
    var width = endpointStyle.width || ep.width,
        height = endpointStyle.height || ep.height,
        x = anchorPoint.curX - width / 2,
        y = anchorPoint.curY - height / 2;
    ep.x = x;
    ep.y = y;
    ep.w = width;
    ep.h = height;
    return [x, y, width, height];
  },
  getParams: function getParams(ep) {
    return {
      width: ep.width,
      height: ep.height
    };
  }
};

var AbstractConnector = function () {
  function AbstractConnector(connection, params) {
    _classCallCheck(this, AbstractConnector);
    this.connection = connection;
    _defineProperty(this, "type", void 0);
    _defineProperty(this, "edited", false);
    _defineProperty(this, "stub", void 0);
    _defineProperty(this, "sourceStub", void 0);
    _defineProperty(this, "targetStub", void 0);
    _defineProperty(this, "maxStub", void 0);
    _defineProperty(this, "typeId", void 0);
    _defineProperty(this, "gap", void 0);
    _defineProperty(this, "sourceGap", void 0);
    _defineProperty(this, "targetGap", void 0);
    _defineProperty(this, "segments", []);
    _defineProperty(this, "totalLength", 0);
    _defineProperty(this, "segmentProportions", []);
    _defineProperty(this, "segmentProportionalLengths", []);
    _defineProperty(this, "paintInfo", null);
    _defineProperty(this, "strokeWidth", void 0);
    _defineProperty(this, "x", void 0);
    _defineProperty(this, "y", void 0);
    _defineProperty(this, "w", void 0);
    _defineProperty(this, "h", void 0);
    _defineProperty(this, "segment", void 0);
    _defineProperty(this, "bounds", EMPTY_BOUNDS());
    _defineProperty(this, "cssClass", void 0);
    _defineProperty(this, "hoverClass", void 0);
    _defineProperty(this, "geometry", void 0);
    this.stub = params.stub || this.getDefaultStubs();
    this.sourceStub = Array.isArray(this.stub) ? this.stub[0] : this.stub;
    this.targetStub = Array.isArray(this.stub) ? this.stub[1] : this.stub;
    this.gap = params.gap || 0;
    this.sourceGap = Array.isArray(this.gap) ? this.gap[0] : this.gap;
    this.targetGap = Array.isArray(this.gap) ? this.gap[1] : this.gap;
    this.maxStub = Math.max(this.sourceStub, this.targetStub);
    this.cssClass = params.cssClass || "";
    this.hoverClass = params.hoverClass || "";
  }
  _createClass(AbstractConnector, [{
    key: "getTypeDescriptor",
    value: function getTypeDescriptor() {
      return "connector";
    }
  }, {
    key: "getIdPrefix",
    value: function getIdPrefix() {
      return "_jsplumb_connector";
    }
  }, {
    key: "setGeometry",
    value: function setGeometry(g, internal) {
      this.geometry = g;
      this.edited = g != null && !internal;
    }
  }, {
    key: "exportGeometry",
    value: function exportGeometry() {
      return this.geometry;
    }
  }, {
    key: "importGeometry",
    value: function importGeometry(g) {
      this.geometry = g;
      return true;
    }
  }, {
    key: "resetGeometry",
    value: function resetGeometry() {
      this.geometry = null;
      this.edited = false;
    }
  }, {
    key: "resetBounds",
    value: function resetBounds() {
      this.bounds = EMPTY_BOUNDS();
    }
  }, {
    key: "findSegmentForPoint",
    value: function findSegmentForPoint(x, y) {
      var out = {
        d: Infinity,
        s: null,
        x: null,
        y: null,
        l: null,
        x1: null,
        y1: null,
        x2: null,
        y2: null,
        index: null,
        connectorLocation: null
      };
      for (var i = 0; i < this.segments.length; i++) {
        var _s = this.segments[i].findClosestPointOnPath(x, y);
        if (_s.d < out.d) {
          out.d = _s.d;
          out.l = _s.l;
          out.x = _s.x;
          out.y = _s.y;
          out.s = this.segments[i];
          out.x1 = _s.x1;
          out.x2 = _s.x2;
          out.y1 = _s.y1;
          out.y2 = _s.y2;
          out.index = i;
          out.connectorLocation = this.segmentProportions[i][0] + _s.l * (this.segmentProportions[i][1] - this.segmentProportions[i][0]);
        }
      }
      return out;
    }
  }, {
    key: "lineIntersection",
    value: function lineIntersection(x1, y1, x2, y2) {
      var out = [];
      for (var i = 0; i < this.segments.length; i++) {
        out.push.apply(out, this.segments[i].lineIntersection(x1, y1, x2, y2));
      }
      return out;
    }
  }, {
    key: "boxIntersection",
    value: function boxIntersection(x, y, w, h) {
      var out = [];
      for (var i = 0; i < this.segments.length; i++) {
        out.push.apply(out, this.segments[i].boxIntersection(x, y, w, h));
      }
      return out;
    }
  }, {
    key: "boundingBoxIntersection",
    value: function boundingBoxIntersection(box) {
      var out = [];
      for (var i = 0; i < this.segments.length; i++) {
        out.push.apply(out, this.segments[i].boundingBoxIntersection(box));
      }
      return out;
    }
  }, {
    key: "_updateSegmentProportions",
    value: function _updateSegmentProportions() {
      var curLoc = 0;
      for (var i = 0; i < this.segments.length; i++) {
        var sl = this.segments[i].getLength();
        this.segmentProportionalLengths[i] = sl / this.totalLength;
        this.segmentProportions[i] = [curLoc, curLoc += sl / this.totalLength];
      }
    }
  }, {
    key: "_findSegmentForLocation",
    value: function _findSegmentForLocation(location, absolute) {
      var idx, i, inSegmentProportion;
      if (absolute) {
        location = location > 0 ? location / this.totalLength : (this.totalLength + location) / this.totalLength;
      }
      if (location === 1) {
        idx = this.segments.length - 1;
        inSegmentProportion = 1;
      } else if (location === 0) {
        inSegmentProportion = 0;
        idx = 0;
      } else {
        if (location >= 0.5) {
          idx = 0;
          inSegmentProportion = 0;
          for (i = this.segmentProportions.length - 1; i > -1; i--) {
            if (this.segmentProportions[i][1] >= location && this.segmentProportions[i][0] <= location) {
              idx = i;
              inSegmentProportion = (location - this.segmentProportions[i][0]) / this.segmentProportionalLengths[i];
              break;
            }
          }
        } else {
          idx = this.segmentProportions.length - 1;
          inSegmentProportion = 1;
          for (i = 0; i < this.segmentProportions.length; i++) {
            if (this.segmentProportions[i][1] >= location) {
              idx = i;
              inSegmentProportion = (location - this.segmentProportions[i][0]) / this.segmentProportionalLengths[i];
              break;
            }
          }
        }
      }
      return {
        segment: this.segments[idx],
        proportion: inSegmentProportion,
        index: idx
      };
    }
  }, {
    key: "_addSegment",
    value: function _addSegment(clazz, params) {
      if (params.x1 === params.x2 && params.y1 === params.y2) {
        return;
      }
      var s = new clazz(params);
      this.segments.push(s);
      this.totalLength += s.getLength();
      this.updateBounds(s);
    }
  }, {
    key: "_clearSegments",
    value: function _clearSegments() {
      this.totalLength = 0;
      this.segments.length = 0;
      this.segmentProportions.length = 0;
      this.segmentProportionalLengths.length = 0;
    }
  }, {
    key: "getLength",
    value: function getLength() {
      return this.totalLength;
    }
  }, {
    key: "_prepareCompute",
    value: function _prepareCompute(params) {
      this.strokeWidth = params.strokeWidth;
      var x1 = params.sourcePos.curX,
          x2 = params.targetPos.curX,
          y1 = params.sourcePos.curY,
          y2 = params.targetPos.curY,
          segment = quadrant({
        x: x1,
        y: y1
      }, {
        x: x2,
        y: y2
      }),
          swapX = x2 < x1,
          swapY = y2 < y1,
          so = [params.sourcePos.ox, params.sourcePos.oy],
          to = [params.targetPos.ox, params.targetPos.oy],
          x = swapX ? x2 : x1,
          y = swapY ? y2 : y1,
          w = Math.abs(x2 - x1),
          h = Math.abs(y2 - y1);
      if (so[0] === 0 && so[1] === 0 || to[0] === 0 && to[1] === 0) {
        var index = w > h ? 0 : 1,
            oIndex = [1, 0][index],
            v1 = index === 0 ? x1 : y1,
            v2 = index === 0 ? x2 : y2;
        so[index] = v1 > v2 ? -1 : 1;
        to[index] = v1 > v2 ? 1 : -1;
        so[oIndex] = 0;
        to[oIndex] = 0;
      }
      var sx = swapX ? w + this.sourceGap * so[0] : this.sourceGap * so[0],
          sy = swapY ? h + this.sourceGap * so[1] : this.sourceGap * so[1],
          tx = swapX ? this.targetGap * to[0] : w + this.targetGap * to[0],
          ty = swapY ? this.targetGap * to[1] : h + this.targetGap * to[1],
          oProduct = so[0] * to[0] + so[1] * to[1];
      var result = {
        sx: sx,
        sy: sy,
        tx: tx,
        ty: ty,
        xSpan: Math.abs(tx - sx),
        ySpan: Math.abs(ty - sy),
        mx: (sx + tx) / 2,
        my: (sy + ty) / 2,
        so: so,
        to: to,
        x: x,
        y: y,
        w: w,
        h: h,
        segment: segment,
        startStubX: sx + so[0] * this.sourceStub,
        startStubY: sy + so[1] * this.sourceStub,
        endStubX: tx + to[0] * this.targetStub,
        endStubY: ty + to[1] * this.targetStub,
        isXGreaterThanStubTimes2: Math.abs(sx - tx) > this.sourceStub + this.targetStub,
        isYGreaterThanStubTimes2: Math.abs(sy - ty) > this.sourceStub + this.targetStub,
        opposite: oProduct === -1,
        perpendicular: oProduct === 0,
        orthogonal: oProduct === 1,
        sourceAxis: so[0] === 0 ? "y" : "x",
        points: [x, y, w, h, sx, sy, tx, ty],
        stubs: [this.sourceStub, this.targetStub]
      };
      result.anchorOrientation = result.opposite ? "opposite" : result.orthogonal ? "orthogonal" : "perpendicular";
      return result;
    }
  }, {
    key: "updateBounds",
    value: function updateBounds(segment) {
      var segBounds = segment.extents;
      this.bounds.xmin = Math.min(this.bounds.xmin, segBounds.xmin);
      this.bounds.xmax = Math.max(this.bounds.xmax, segBounds.xmax);
      this.bounds.ymin = Math.min(this.bounds.ymin, segBounds.ymin);
      this.bounds.ymax = Math.max(this.bounds.ymax, segBounds.ymax);
    }
  }, {
    key: "dumpSegmentsToConsole",
    value: function dumpSegmentsToConsole() {
      log("SEGMENTS:");
      for (var i = 0; i < this.segments.length; i++) {
        log(this.segments[i].type, "" + this.segments[i].getLength(), "" + this.segmentProportions[i]);
      }
    }
  }, {
    key: "pointOnPath",
    value: function pointOnPath(location, absolute) {
      var seg = this._findSegmentForLocation(location, absolute);
      return seg.segment && seg.segment.pointOnPath(seg.proportion, false) || {
        x: 0,
        y: 0
      };
    }
  }, {
    key: "gradientAtPoint",
    value: function gradientAtPoint(location, absolute) {
      var seg = this._findSegmentForLocation(location, absolute);
      return seg.segment && seg.segment.gradientAtPoint(seg.proportion, false) || 0;
    }
  }, {
    key: "pointAlongPathFrom",
    value: function pointAlongPathFrom(location, distance, absolute) {
      var seg = this._findSegmentForLocation(location, absolute);
      return seg.segment && seg.segment.pointAlongPathFrom(seg.proportion, distance, false) || {
        x: 0,
        y: 0
      };
    }
  }, {
    key: "compute",
    value: function compute(params) {
      this.paintInfo = this._prepareCompute(params);
      this._clearSegments();
      this._compute(this.paintInfo, params);
      this.x = this.paintInfo.points[0];
      this.y = this.paintInfo.points[1];
      this.w = this.paintInfo.points[2];
      this.h = this.paintInfo.points[3];
      this.segment = this.paintInfo.segment;
      this._updateSegmentProportions();
    }
  }, {
    key: "setAnchorOrientation",
    value: function setAnchorOrientation(idx, orientation) {}
  }]);
  return AbstractConnector;
}();

var StraightSegment = function (_AbstractSegment) {
  _inherits(StraightSegment, _AbstractSegment);
  var _super = _createSuper(StraightSegment);
  function StraightSegment(params) {
    var _this;
    _classCallCheck(this, StraightSegment);
    _this = _super.call(this, params);
    _defineProperty(_assertThisInitialized(_this), "length", void 0);
    _defineProperty(_assertThisInitialized(_this), "m", void 0);
    _defineProperty(_assertThisInitialized(_this), "m2", void 0);
    _defineProperty(_assertThisInitialized(_this), "type", StraightSegment.segmentType);
    _this._setCoordinates({
      x1: params.x1,
      y1: params.y1,
      x2: params.x2,
      y2: params.y2
    });
    return _this;
  }
  _createClass(StraightSegment, [{
    key: "getPath",
    value: function getPath(isFirstSegment) {
      return (isFirstSegment ? "M " + this.x1 + " " + this.y1 + " " : "") + "L " + this.x2 + " " + this.y2;
    }
  }, {
    key: "_recalc",
    value: function _recalc() {
      this.length = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2));
      this.m = gradient({
        x: this.x1,
        y: this.y1
      }, {
        x: this.x2,
        y: this.y2
      });
      this.m2 = -1 / this.m;
      this.extents = {
        xmin: Math.min(this.x1, this.x2),
        ymin: Math.min(this.y1, this.y2),
        xmax: Math.max(this.x1, this.x2),
        ymax: Math.max(this.y1, this.y2)
      };
    }
  }, {
    key: "getLength",
    value: function getLength() {
      return this.length;
    }
  }, {
    key: "getGradient",
    value: function getGradient() {
      return this.m;
    }
  }, {
    key: "_setCoordinates",
    value: function _setCoordinates(coords) {
      this.x1 = coords.x1;
      this.y1 = coords.y1;
      this.x2 = coords.x2;
      this.y2 = coords.y2;
      this._recalc();
    }
  }, {
    key: "pointOnPath",
    value: function pointOnPath(location, absolute) {
      if (location === 0 && !absolute) {
        return {
          x: this.x1,
          y: this.y1
        };
      } else if (location === 1 && !absolute) {
        return {
          x: this.x2,
          y: this.y2
        };
      } else {
        var l = absolute ? location > 0 ? location : this.length + location : location * this.length;
        return pointOnLine({
          x: this.x1,
          y: this.y1
        }, {
          x: this.x2,
          y: this.y2
        }, l);
      }
    }
  }, {
    key: "gradientAtPoint",
    value: function gradientAtPoint(location, absolute) {
      return this.m;
    }
  }, {
    key: "pointAlongPathFrom",
    value: function pointAlongPathFrom(location, distance, absolute) {
      var p = this.pointOnPath(location, absolute),
          farAwayPoint = distance <= 0 ? {
        x: this.x1,
        y: this.y1
      } : {
        x: this.x2,
        y: this.y2
      };
      if (distance <= 0 && Math.abs(distance) > 1) {
        distance *= -1;
      }
      return pointOnLine(p, farAwayPoint, distance);
    }
  }, {
    key: "within",
    value: function within(a, b, c) {
      return c >= Math.min(a, b) && c <= Math.max(a, b);
    }
  }, {
    key: "closest",
    value: function closest(a, b, c) {
      return Math.abs(c - a) < Math.abs(c - b) ? a : b;
    }
  }, {
    key: "findClosestPointOnPath",
    value: function findClosestPointOnPath(x, y) {
      var out = {
        d: Infinity,
        x: null,
        y: null,
        l: null,
        x1: this.x1,
        x2: this.x2,
        y1: this.y1,
        y2: this.y2
      };
      if (this.m === 0) {
        out.y = this.y1;
        out.x = this.within(this.x1, this.x2, x) ? x : this.closest(this.x1, this.x2, x);
      } else if (this.m === Infinity || this.m === -Infinity) {
        out.x = this.x1;
        out.y = this.within(this.y1, this.y2, y) ? y : this.closest(this.y1, this.y2, y);
      } else {
        var b = this.y1 - this.m * this.x1,
            b2 = y - this.m2 * x,
        _x1 = (b2 - b) / (this.m - this.m2),
            _y1 = this.m * _x1 + b;
        out.x = this.within(this.x1, this.x2, _x1) ? _x1 : this.closest(this.x1, this.x2, _x1);
        out.y = this.within(this.y1, this.y2, _y1) ? _y1 : this.closest(this.y1, this.y2, _y1);
      }
      var fractionInSegment = lineLength({
        x: out.x,
        y: out.y
      }, {
        x: this.x1,
        y: this.y1
      });
      out.d = lineLength({
        x: x,
        y: y
      }, out);
      out.l = fractionInSegment / length;
      return out;
    }
  }, {
    key: "_pointLiesBetween",
    value: function _pointLiesBetween(q, p1, p2) {
      return p2 > p1 ? p1 <= q && q <= p2 : p1 >= q && q >= p2;
    }
  }, {
    key: "lineIntersection",
    value: function lineIntersection(_x1, _y1, _x2, _y2) {
      var m2 = Math.abs(gradient({
        x: _x1,
        y: _y1
      }, {
        x: _x2,
        y: _y2
      })),
          m1 = Math.abs(this.m),
          b = m1 === Infinity ? this.x1 : this.y1 - m1 * this.x1,
          out = [],
          b2 = m2 === Infinity ? _x1 : _y1 - m2 * _x1;
      if (m2 !== m1) {
        if (m2 === Infinity && m1 === 0) {
          if (this._pointLiesBetween(_x1, this.x1, this.x2) && this._pointLiesBetween(this.y1, _y1, _y2)) {
            out.push({
              x: _x1,
              y: this.y1
            });
          }
        } else if (m2 === 0 && m1 === Infinity) {
          if (this._pointLiesBetween(_y1, this.y1, this.y2) && this._pointLiesBetween(this.x1, _x1, _x2)) {
            out.push({
              x: this.x1,
              y: _y1
            });
          }
        } else {
          var X, Y;
          if (m2 === Infinity) {
            X = _x1;
            if (this._pointLiesBetween(X, this.x1, this.x2)) {
              Y = m1 * _x1 + b;
              if (this._pointLiesBetween(Y, _y1, _y2)) {
                out.push({
                  x: X,
                  y: Y
                });
              }
            }
          } else if (m2 === 0) {
            Y = _y1;
            if (this._pointLiesBetween(Y, this.y1, this.y2)) {
              X = (_y1 - b) / m1;
              if (this._pointLiesBetween(X, _x1, _x2)) {
                out.push({
                  x: X,
                  y: Y
                });
              }
            }
          } else {
            X = (b2 - b) / (m1 - m2);
            Y = m1 * X + b;
            if (this._pointLiesBetween(X, this.x1, this.x2) && this._pointLiesBetween(Y, this.y1, this.y2)) {
              out.push({
                x: X,
                y: Y
              });
            }
          }
        }
      }
      return out;
    }
  }, {
    key: "boxIntersection",
    value: function boxIntersection(x, y, w, h) {
      var a = [];
      a.push.apply(a, this.lineIntersection(x, y, x + w, y));
      a.push.apply(a, this.lineIntersection(x + w, y, x + w, y + h));
      a.push.apply(a, this.lineIntersection(x + w, y + h, x, y + h));
      a.push.apply(a, this.lineIntersection(x, y + h, x, y));
      return a;
    }
  }]);
  return StraightSegment;
}(AbstractSegment);
_defineProperty(StraightSegment, "segmentType", "Straight");

var StraightConnector = function (_AbstractConnector) {
  _inherits(StraightConnector, _AbstractConnector);
  var _super = _createSuper(StraightConnector);
  function StraightConnector() {
    var _this;
    _classCallCheck(this, StraightConnector);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "type", StraightConnector.type);
    return _this;
  }
  _createClass(StraightConnector, [{
    key: "getDefaultStubs",
    value: function getDefaultStubs() {
      return [0, 0];
    }
  }, {
    key: "_compute",
    value: function _compute(paintInfo, p) {
      this._addSegment(StraightSegment, {
        x1: paintInfo.sx,
        y1: paintInfo.sy,
        x2: paintInfo.startStubX,
        y2: paintInfo.startStubY
      });
      this._addSegment(StraightSegment, {
        x1: paintInfo.startStubX,
        y1: paintInfo.startStubY,
        x2: paintInfo.endStubX,
        y2: paintInfo.endStubY
      });
      this._addSegment(StraightSegment, {
        x1: paintInfo.endStubX,
        y1: paintInfo.endStubY,
        x2: paintInfo.tx,
        y2: paintInfo.ty
      });
      this.geometry = {
        source: p.sourcePos,
        target: p.targetPos
      };
    }
  }]);
  return StraightConnector;
}(AbstractConnector);
_defineProperty(StraightConnector, "type", "Straight");

var connectorMap = {};
var Connectors = {
  get: function get(connection, name, params) {
    var c = connectorMap[name];
    if (!c) {
      throw {
        message: "jsPlumb: unknown connector type '" + name + "'"
      };
    } else {
      return new c(connection, params);
    }
  },
  register: function register(name, conn) {
    connectorMap[name] = conn;
  }
};

function cls() {
  for (var _len = arguments.length, className = new Array(_len), _key = 0; _key < _len; _key++) {
    className[_key] = arguments[_key];
  }
  return className.map(function (cn) {
    return "." + cn;
  }).join(",");
}
function classList() {
  for (var _len2 = arguments.length, className = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    className[_key2] = arguments[_key2];
  }
  return className.join(" ");
}
function att() {
  for (var _len3 = arguments.length, attName = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    attName[_key3] = arguments[_key3];
  }
  return attName.map(function (an) {
    return "[" + an + "]";
  }).join(",");
}
var SOURCE = "source";
var TARGET = "target";
var BLOCK = "block";
var NONE = "none";
var SOURCE_INDEX = 0;
var TARGET_INDEX = 1;
var ABSOLUTE = "absolute";
var FIXED = "fixed";
var STATIC = "static";
var ATTRIBUTE_GROUP = "data-jtk-group";
var ATTRIBUTE_MANAGED = "data-jtk-managed";
var ATTRIBUTE_NOT_DRAGGABLE = "data-jtk-not-draggable";
var ATTRIBUTE_TABINDEX = "tabindex";
var ATTRIBUTE_SCOPE = "data-jtk-scope";
var ATTRIBUTE_SCOPE_PREFIX = ATTRIBUTE_SCOPE + "-";
var CHECK_CONDITION = "checkCondition";
var CHECK_DROP_ALLOWED = "checkDropAllowed";
var CLASS_CONNECTOR = "jtk-connector";
var CLASS_CONNECTOR_OUTLINE = "jtk-connector-outline";
var CLASS_CONNECTED = "jtk-connected";
var CLASS_ENDPOINT = "jtk-endpoint";
var CLASS_ENDPOINT_CONNECTED = "jtk-endpoint-connected";
var CLASS_ENDPOINT_FULL = "jtk-endpoint-full";
var CLASS_ENDPOINT_DROP_ALLOWED = "jtk-endpoint-drop-allowed";
var CLASS_ENDPOINT_DROP_FORBIDDEN = "jtk-endpoint-drop-forbidden";
var CLASS_ENDPOINT_ANCHOR_PREFIX = "jtk-endpoint-anchor";
var CLASS_GROUP_COLLAPSED = "jtk-group-collapsed";
var CLASS_GROUP_EXPANDED = "jtk-group-expanded";
var CLASS_OVERLAY = "jtk-overlay";
var EVENT_ANCHOR_CHANGED = "anchor:changed";
var EVENT_CONNECTION = "connection";
var EVENT_INTERNAL_CONNECTION = "internal.connection";
var EVENT_CONNECTION_DETACHED = "connection:detach";
var EVENT_CONNECTION_MOVED = "connection:move";
var EVENT_CONTAINER_CHANGE = "container:change";
var EVENT_ENDPOINT_REPLACED = "endpoint:replaced";
var EVENT_INTERNAL_ENDPOINT_UNREGISTERED = "internal.endpoint:unregistered";
var EVENT_INTERNAL_CONNECTION_DETACHED = "internal.connection:detached";
var EVENT_MANAGE_ELEMENT = "element:manage";
var EVENT_GROUP_ADDED = "group:added";
var EVENT_GROUP_COLLAPSE = "group:collapse";
var EVENT_GROUP_EXPAND = "group:expand";
var EVENT_GROUP_MEMBER_ADDED = "group:member:added";
var EVENT_GROUP_MEMBER_REMOVED = "group:member:removed";
var EVENT_GROUP_REMOVED = "group:removed";
var EVENT_MAX_CONNECTIONS = "maxConnections";
var EVENT_NESTED_GROUP_ADDED = "group:nested:added";
var EVENT_NESTED_GROUP_REMOVED = "group:nested:removed";
var EVENT_UNMANAGE_ELEMENT = "element:unmanage";
var EVENT_ZOOM = "zoom";
var IS_DETACH_ALLOWED = "isDetachAllowed";
var INTERCEPT_BEFORE_DRAG = "beforeDrag";
var INTERCEPT_BEFORE_DROP = "beforeDrop";
var INTERCEPT_BEFORE_DETACH = "beforeDetach";
var INTERCEPT_BEFORE_START_DETACH = "beforeStartDetach";
var SELECTOR_MANAGED_ELEMENT = att(ATTRIBUTE_MANAGED);
var ERROR_SOURCE_ENDPOINT_FULL = "Cannot establish connection: source endpoint is full";
var ERROR_TARGET_ENDPOINT_FULL = "Cannot establish connection: target endpoint is full";
var ERROR_SOURCE_DOES_NOT_EXIST = "Cannot establish connection: source does not exist";
var ERROR_TARGET_DOES_NOT_EXIST = "Cannot establish connection: target does not exist";
var KEY_CONNECTION_OVERLAYS = "connectionOverlays";

function isFullOverlaySpec(o) {
  return o.type != null && o.options != null;
}
function convertToFullOverlaySpec(spec) {
  var o = null;
  if (isString(spec)) {
    o = {
      type: spec,
      options: {}
    };
  } else {
    o = spec;
  }
  o.options.id = o.options.id || uuid();
  return o;
}
var Overlay = function (_EventGenerator) {
  _inherits(Overlay, _EventGenerator);
  var _super = _createSuper(Overlay);
  function Overlay(instance, component, p) {
    var _this;
    _classCallCheck(this, Overlay);
    _this = _super.call(this);
    _this.instance = instance;
    _this.component = component;
    _defineProperty(_assertThisInitialized(_this), "id", void 0);
    _defineProperty(_assertThisInitialized(_this), "type", void 0);
    _defineProperty(_assertThisInitialized(_this), "cssClass", void 0);
    _defineProperty(_assertThisInitialized(_this), "visible", true);
    _defineProperty(_assertThisInitialized(_this), "location", void 0);
    _defineProperty(_assertThisInitialized(_this), "events", void 0);
    p = p || {};
    _this.id = p.id || uuid();
    _this.cssClass = p.cssClass || "";
    _this.location = p.location || 0.5;
    _this.events = p.events || {};
    for (var _event in _this.events) {
      _this.bind(_event, _this.events[_event]);
    }
    return _this;
  }
  _createClass(Overlay, [{
    key: "shouldFireEvent",
    value: function shouldFireEvent(event, value, originalEvent) {
      return true;
    }
  }, {
    key: "setVisible",
    value: function setVisible(v) {
      this.visible = v;
      this.instance.setOverlayVisible(this, v);
    }
  }, {
    key: "isVisible",
    value: function isVisible() {
      return this.visible;
    }
  }]);
  return Overlay;
}(EventGenerator);

var overlayMap = {};
var OverlayFactory = {
  get: function get(instance, name, component, params) {
    var c = overlayMap[name];
    if (!c) {
      throw {
        message: "jsPlumb: unknown overlay type '" + name + "'"
      };
    } else {
      return new c(instance, component, params);
    }
  },
  register: function register(name, overlay) {
    overlayMap[name] = overlay;
  }
};

var LabelOverlay = function (_Overlay) {
  _inherits(LabelOverlay, _Overlay);
  var _super = _createSuper(LabelOverlay);
  function LabelOverlay(instance, component, p) {
    var _this;
    _classCallCheck(this, LabelOverlay);
    _this = _super.call(this, instance, component, p);
    _this.instance = instance;
    _this.component = component;
    _defineProperty(_assertThisInitialized(_this), "label", void 0);
    _defineProperty(_assertThisInitialized(_this), "labelText", void 0);
    _defineProperty(_assertThisInitialized(_this), "type", LabelOverlay.type);
    _defineProperty(_assertThisInitialized(_this), "cachedDimensions", void 0);
    p = p || {
      label: ""
    };
    _this.setLabel(p.label);
    return _this;
  }
  _createClass(LabelOverlay, [{
    key: "getLabel",
    value: function getLabel() {
      if (isFunction(this.label)) {
        return this.label(this);
      } else {
        return this.labelText;
      }
    }
  }, {
    key: "setLabel",
    value: function setLabel(l) {
      this.label = l;
      this.labelText = null;
      this.instance.updateLabel(this);
    }
  }, {
    key: "getDimensions",
    value: function getDimensions() {
      return {
        w: 1,
        h: 1
      };
    }
  }, {
    key: "updateFrom",
    value: function updateFrom(d) {
      if (d.label != null) {
        this.setLabel(d.label);
      }
    }
  }]);
  return LabelOverlay;
}(Overlay);
_defineProperty(LabelOverlay, "type", "Label");
function isLabelOverlay(o) {
  return o.type === LabelOverlay.type;
}
OverlayFactory.register("Label", LabelOverlay);

function _splitType(t) {
  return t == null ? null : t.split(" ");
}
function _mapType(map, obj, typeId) {
  for (var i in obj) {
    map[i] = typeId;
  }
}
var CONNECTOR = "connector";
var MERGE_STRATEGY_OVERRIDE = "override";
var CSS_CLASS = "cssClass";
var DEFAULT_TYPE_KEY = "__default";
var ANCHOR = "anchor";
var ANCHORS = "anchors";
var _internalLabelOverlayId = "__label";
var TYPE_ITEM_OVERLAY = "overlay";
var LOCATION_ATTRIBUTE = "labelLocation";
var ACTION_ADD = "add";
var ACTION_REMOVE = "remove";
function _applyTypes(component, params) {
  if (component.getDefaultType) {
    var td = component.getTypeDescriptor(),
        map = {};
    var defType = component.getDefaultType();
    var o = extend({}, defType);
    _mapType(map, defType, DEFAULT_TYPE_KEY);
    for (var i = 0, j = component._types.length; i < j; i++) {
      var tid = component._types[i];
      if (tid !== DEFAULT_TYPE_KEY) {
        var _t = component.instance.getType(tid, td);
        if (_t != null) {
          var overrides = new Set([CONNECTOR, ANCHOR, ANCHORS]);
          if (_t.mergeStrategy === MERGE_STRATEGY_OVERRIDE) {
            for (var k in _t) {
              overrides.add(k);
            }
          }
          o = merge(o, _t, [CSS_CLASS], setToArray(overrides));
          _mapType(map, _t, tid);
        }
      }
    }
    if (params) {
      o = populate(o, params, "_");
    }
    component.applyType(o, map);
  }
}
function _removeTypeCssHelper(component, typeIndex) {
  var typeId = component._types[typeIndex],
      type = component.instance.getType(typeId, component.getTypeDescriptor());
  if (type != null && type.cssClass) {
    component.removeClass(type.cssClass);
  }
}
function _updateHoverStyle(component) {
  if (component.paintStyle && component.hoverPaintStyle) {
    var mergedHoverStyle = {};
    extend(mergedHoverStyle, component.paintStyle);
    extend(mergedHoverStyle, component.hoverPaintStyle);
    component.hoverPaintStyle = mergedHoverStyle;
  }
}
function _makeLabelOverlay(component, params) {
  var _params = {
    cssClass: params.cssClass,
    id: _internalLabelOverlayId,
    component: component
  },
      mergedParams = extend(_params, params);
  return new LabelOverlay(component.instance, component, mergedParams);
}
function _processOverlay(component, o) {
  var _newOverlay = null;
  if (isString(o)) {
    _newOverlay = OverlayFactory.get(component.instance, o, component, {});
  } else if (o.type != null && o.options != null) {
    var oa = o;
    var p = extend({}, oa.options);
    _newOverlay = OverlayFactory.get(component.instance, oa.type, component, p);
  } else {
    _newOverlay = o;
  }
  _newOverlay.id = _newOverlay.id || uuid();
  component.cacheTypeItem(TYPE_ITEM_OVERLAY, _newOverlay, _newOverlay.id);
  component.overlays[_newOverlay.id] = _newOverlay;
  return _newOverlay;
}
var Component = function (_EventGenerator) {
  _inherits(Component, _EventGenerator);
  var _super = _createSuper(Component);
  function Component(instance, params) {
    var _this;
    _classCallCheck(this, Component);
    _this = _super.call(this);
    _this.instance = instance;
    _defineProperty(_assertThisInitialized(_this), "defaultLabelLocation", 0.5);
    _defineProperty(_assertThisInitialized(_this), "overlays", {});
    _defineProperty(_assertThisInitialized(_this), "overlayPositions", {});
    _defineProperty(_assertThisInitialized(_this), "overlayPlacements", {});
    _defineProperty(_assertThisInitialized(_this), "clone", void 0);
    _defineProperty(_assertThisInitialized(_this), "deleted", void 0);
    _defineProperty(_assertThisInitialized(_this), "segment", void 0);
    _defineProperty(_assertThisInitialized(_this), "x", void 0);
    _defineProperty(_assertThisInitialized(_this), "y", void 0);
    _defineProperty(_assertThisInitialized(_this), "w", void 0);
    _defineProperty(_assertThisInitialized(_this), "h", void 0);
    _defineProperty(_assertThisInitialized(_this), "id", void 0);
    _defineProperty(_assertThisInitialized(_this), "visible", true);
    _defineProperty(_assertThisInitialized(_this), "typeId", void 0);
    _defineProperty(_assertThisInitialized(_this), "params", {});
    _defineProperty(_assertThisInitialized(_this), "paintStyle", void 0);
    _defineProperty(_assertThisInitialized(_this), "hoverPaintStyle", void 0);
    _defineProperty(_assertThisInitialized(_this), "paintStyleInUse", void 0);
    _defineProperty(_assertThisInitialized(_this), "_hover", false);
    _defineProperty(_assertThisInitialized(_this), "lastPaintedAt", void 0);
    _defineProperty(_assertThisInitialized(_this), "data", void 0);
    _defineProperty(_assertThisInitialized(_this), "_defaultType", void 0);
    _defineProperty(_assertThisInitialized(_this), "events", void 0);
    _defineProperty(_assertThisInitialized(_this), "parameters", void 0);
    _defineProperty(_assertThisInitialized(_this), "_types", void 0);
    _defineProperty(_assertThisInitialized(_this), "_typeCache", void 0);
    _defineProperty(_assertThisInitialized(_this), "cssClass", void 0);
    _defineProperty(_assertThisInitialized(_this), "hoverClass", void 0);
    _defineProperty(_assertThisInitialized(_this), "beforeDetach", void 0);
    _defineProperty(_assertThisInitialized(_this), "beforeDrop", void 0);
    params = params || {};
    _this.cssClass = params.cssClass || "";
    _this.hoverClass = params.hoverClass || instance.defaults.hoverClass;
    _this.beforeDetach = params.beforeDetach;
    _this.beforeDrop = params.beforeDrop;
    _this._types = [];
    _this._typeCache = {};
    _this.parameters = clone(params.parameters || {});
    _this.id = params.id || _this.getIdPrefix() + new Date().getTime();
    _this._defaultType = {
      parameters: _this.parameters,
      scope: params.scope || _this.instance.defaultScope,
      overlays: {}
    };
    if (params.events) {
      for (var evtName in params.events) {
        _this.bind(evtName, params.events[evtName]);
      }
    }
    _this.clone = function () {
      var o = Object.create(_this.constructor.prototype);
      _this.constructor.apply(o, [instance, params]);
      return o;
    };
    _this.overlays = {};
    _this.overlayPositions = {};
    var o = params.overlays || [],
        oo = {};
    var defaultOverlayKey = _this.getDefaultOverlayKey();
    if (defaultOverlayKey) {
      var defaultOverlays = _this.instance.defaults[defaultOverlayKey];
      if (defaultOverlays) {
        o.push.apply(o, _toConsumableArray(defaultOverlays));
      }
      for (var i = 0; i < o.length; i++) {
        var fo = convertToFullOverlaySpec(o[i]);
        oo[fo.options.id] = fo;
      }
    }
    _this._defaultType.overlays = oo;
    if (params.label) {
      _this.getDefaultType().overlays[_internalLabelOverlayId] = {
        type: LabelOverlay.type,
        options: {
          label: params.label,
          location: params.labelLocation || _this.defaultLabelLocation,
          id: _internalLabelOverlayId
        }
      };
    }
    return _this;
  }
  _createClass(Component, [{
    key: "isDetachAllowed",
    value: function isDetachAllowed(connection) {
      var r = true;
      if (this.beforeDetach) {
        try {
          r = this.beforeDetach(connection);
        } catch (e) {
          log("jsPlumb: beforeDetach callback failed", e);
        }
      }
      return r;
    }
  }, {
    key: "isDropAllowed",
    value: function isDropAllowed(sourceId, targetId, scope, connection, dropEndpoint) {
      var r;
      var payload = {
        sourceId: sourceId,
        targetId: targetId,
        scope: scope,
        connection: connection,
        dropEndpoint: dropEndpoint
      };
      if (this.beforeDrop) {
        try {
          r = this.beforeDrop(payload);
        } catch (e) {
          log("jsPlumb: beforeDrop callback failed", e);
        }
      } else {
        r = this.instance.checkCondition(INTERCEPT_BEFORE_DROP, payload);
      }
      return r;
    }
  }, {
    key: "getDefaultType",
    value: function getDefaultType() {
      return this._defaultType;
    }
  }, {
    key: "appendToDefaultType",
    value: function appendToDefaultType(obj) {
      for (var i in obj) {
        this._defaultType[i] = obj[i];
      }
    }
  }, {
    key: "getId",
    value: function getId() {
      return this.id;
    }
  }, {
    key: "cacheTypeItem",
    value: function cacheTypeItem(key, item, typeId) {
      this._typeCache[typeId] = this._typeCache[typeId] || {};
      this._typeCache[typeId][key] = item;
    }
  }, {
    key: "getCachedTypeItem",
    value: function getCachedTypeItem(key, typeId) {
      return this._typeCache[typeId] ? this._typeCache[typeId][key] : null;
    }
  }, {
    key: "setType",
    value: function setType(typeId, params) {
      this.clearTypes();
      this._types = _splitType(typeId) || [];
      _applyTypes(this, params);
    }
  }, {
    key: "getType",
    value: function getType() {
      return this._types;
    }
  }, {
    key: "reapplyTypes",
    value: function reapplyTypes(params) {
      _applyTypes(this, params);
    }
  }, {
    key: "hasType",
    value: function hasType(typeId) {
      return this._types.indexOf(typeId) !== -1;
    }
  }, {
    key: "addType",
    value: function addType(typeId, params) {
      var t = _splitType(typeId),
          _somethingAdded = false;
      if (t != null) {
        for (var i = 0, j = t.length; i < j; i++) {
          if (!this.hasType(t[i])) {
            this._types.push(t[i]);
            _somethingAdded = true;
          }
        }
        if (_somethingAdded) {
          _applyTypes(this, params);
        }
      }
    }
  }, {
    key: "removeType",
    value: function removeType(typeId, params) {
      var _this2 = this;
      var t = _splitType(typeId),
          _cont = false,
          _one = function _one(tt) {
        var idx = _this2._types.indexOf(tt);
        if (idx !== -1) {
          _removeTypeCssHelper(_this2, idx);
          _this2._types.splice(idx, 1);
          return true;
        }
        return false;
      };
      if (t != null) {
        for (var i = 0, j = t.length; i < j; i++) {
          _cont = _one(t[i]) || _cont;
        }
        if (_cont) {
          _applyTypes(this, params);
        }
      }
    }
  }, {
    key: "clearTypes",
    value: function clearTypes(params, doNotRepaint) {
      var i = this._types.length;
      for (var j = 0; j < i; j++) {
        _removeTypeCssHelper(this, 0);
        this._types.splice(0, 1);
      }
      _applyTypes(this, params);
    }
  }, {
    key: "toggleType",
    value: function toggleType(typeId, params) {
      var t = _splitType(typeId);
      if (t != null) {
        for (var i = 0, j = t.length; i < j; i++) {
          var idx = this._types.indexOf(t[i]);
          if (idx !== -1) {
            _removeTypeCssHelper(this, idx);
            this._types.splice(idx, 1);
          } else {
            this._types.push(t[i]);
          }
        }
        _applyTypes(this, params);
      }
    }
  }, {
    key: "applyType",
    value: function applyType(t, params) {
      this.setPaintStyle(t.paintStyle);
      this.setHoverPaintStyle(t.hoverPaintStyle);
      this.mergeParameters(t.parameters);
      this.paintStyleInUse = this.getPaintStyle();
      if (t.overlays) {
        var keep = {},
            i;
        for (i in t.overlays) {
          var existing = this.overlays[t.overlays[i].options.id];
          if (existing) {
            existing.updateFrom(t.overlays[i].options);
            keep[t.overlays[i].options.id] = true;
            this.instance.reattachOverlay(existing, this);
          } else {
            var _c = this.getCachedTypeItem("overlay", t.overlays[i].options.id);
            if (_c != null) {
              this.instance.reattachOverlay(_c, this);
              _c.setVisible(true);
              _c.updateFrom(t.overlays[i].options);
              this.overlays[_c.id] = _c;
            } else {
              _c = this.addOverlay(t.overlays[i]);
            }
            keep[_c.id] = true;
          }
        }
        for (i in this.overlays) {
          if (keep[this.overlays[i].id] == null) {
            this.removeOverlay(this.overlays[i].id, true);
          }
        }
      }
    }
  }, {
    key: "setPaintStyle",
    value: function setPaintStyle(style) {
      this.paintStyle = style;
      this.paintStyleInUse = this.paintStyle;
      _updateHoverStyle(this);
    }
  }, {
    key: "getPaintStyle",
    value: function getPaintStyle() {
      return this.paintStyle;
    }
  }, {
    key: "setHoverPaintStyle",
    value: function setHoverPaintStyle(style) {
      this.hoverPaintStyle = style;
      _updateHoverStyle(this);
    }
  }, {
    key: "getHoverPaintStyle",
    value: function getHoverPaintStyle() {
      return this.hoverPaintStyle;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      for (var i in this.overlays) {
        this.instance.destroyOverlay(this.overlays[i]);
      }
      this.overlays = {};
      this.overlayPositions = {};
      this.unbind();
      this.clone = null;
    }
  }, {
    key: "isHover",
    value: function isHover() {
      return this._hover;
    }
  }, {
    key: "mergeParameters",
    value: function mergeParameters(p) {
      if (p != null) {
        extend(this.parameters, p);
      }
    }
  }, {
    key: "setVisible",
    value: function setVisible(v) {
      this.visible = v;
      if (v) {
        this.showOverlays();
      } else {
        this.hideOverlays();
      }
    }
  }, {
    key: "isVisible",
    value: function isVisible() {
      return this.visible;
    }
  }, {
    key: "setAbsoluteOverlayPosition",
    value: function setAbsoluteOverlayPosition(overlay, xy) {
      this.overlayPositions[overlay.id] = xy;
    }
  }, {
    key: "getAbsoluteOverlayPosition",
    value: function getAbsoluteOverlayPosition(overlay) {
      return this.overlayPositions ? this.overlayPositions[overlay.id] : null;
    }
  }, {
    key: "_clazzManip",
    value: function _clazzManip(action, clazz) {
      for (var i in this.overlays) {
        if (action === ACTION_ADD) {
          this.instance.addOverlayClass(this.overlays[i], clazz);
        } else if (action === ACTION_REMOVE) {
          this.instance.removeOverlayClass(this.overlays[i], clazz);
        }
      }
    }
  }, {
    key: "addClass",
    value: function addClass(clazz, cascade) {
      var parts = (this.cssClass || "").split(" ");
      parts.push(clazz);
      this.cssClass = parts.join(" ");
      this._clazzManip(ACTION_ADD, clazz);
    }
  }, {
    key: "removeClass",
    value: function removeClass(clazz, cascade) {
      var parts = (this.cssClass || "").split(" ");
      this.cssClass = parts.filter(function (p) {
        return p !== clazz;
      }).join(" ");
      this._clazzManip(ACTION_REMOVE, clazz);
    }
  }, {
    key: "getClass",
    value: function getClass() {
      return this.cssClass;
    }
  }, {
    key: "shouldFireEvent",
    value: function shouldFireEvent(event, value, originalEvent) {
      return true;
    }
  }, {
    key: "getData",
    value: function getData() {
      return this.data;
    }
  }, {
    key: "setData",
    value: function setData(d) {
      this.data = d || {};
    }
  }, {
    key: "mergeData",
    value: function mergeData(d) {
      this.data = extend(this.data, d);
    }
  }, {
    key: "addOverlay",
    value: function addOverlay(overlay) {
      var o = _processOverlay(this, overlay);
      if (this.getData && o.type === LabelOverlay.type && !isString(overlay)) {
        var d = this.getData(),
            p = overlay.options;
        if (d) {
          var locationAttribute = p.labelLocationAttribute || LOCATION_ATTRIBUTE;
          var loc = d[locationAttribute];
          if (loc) {
            o.location = loc;
          }
        }
      }
      return o;
    }
  }, {
    key: "getOverlay",
    value: function getOverlay(id) {
      return this.overlays[id];
    }
  }, {
    key: "getOverlays",
    value: function getOverlays() {
      return this.overlays;
    }
  }, {
    key: "hideOverlay",
    value: function hideOverlay(id) {
      var o = this.getOverlay(id);
      if (o) {
        o.setVisible(false);
      }
    }
  }, {
    key: "hideOverlays",
    value: function hideOverlays() {
      for (var i in this.overlays) {
        this.overlays[i].setVisible(false);
      }
    }
  }, {
    key: "showOverlay",
    value: function showOverlay(id) {
      var o = this.getOverlay(id);
      if (o) {
        o.setVisible(true);
      }
    }
  }, {
    key: "showOverlays",
    value: function showOverlays() {
      for (var i in this.overlays) {
        this.overlays[i].setVisible(true);
      }
    }
  }, {
    key: "removeAllOverlays",
    value: function removeAllOverlays() {
      for (var i in this.overlays) {
        this.instance.destroyOverlay(this.overlays[i]);
      }
      this.overlays = {};
      this.overlayPositions = null;
      this.overlayPlacements = {};
    }
  }, {
    key: "removeOverlay",
    value: function removeOverlay(overlayId, dontCleanup) {
      var o = this.overlays[overlayId];
      if (o) {
        o.setVisible(false);
        if (!dontCleanup) {
          this.instance.destroyOverlay(o);
        }
        delete this.overlays[overlayId];
        if (this.overlayPositions) {
          delete this.overlayPositions[overlayId];
        }
        if (this.overlayPlacements) {
          delete this.overlayPlacements[overlayId];
        }
      }
    }
  }, {
    key: "removeOverlays",
    value: function removeOverlays() {
      for (var _len = arguments.length, overlays = new Array(_len), _key = 0; _key < _len; _key++) {
        overlays[_key] = arguments[_key];
      }
      for (var i = 0, j = overlays.length; i < j; i++) {
        this.removeOverlay(arguments[i]);
      }
    }
  }, {
    key: "getLabel",
    value: function getLabel() {
      var lo = this.getLabelOverlay();
      return lo != null ? lo.getLabel() : null;
    }
  }, {
    key: "getLabelOverlay",
    value: function getLabelOverlay() {
      return this.getOverlay(_internalLabelOverlayId);
    }
  }, {
    key: "setLabel",
    value: function setLabel(l) {
      var lo = this.getLabelOverlay();
      if (!lo) {
        var _params2 = isString(l) || isFunction(l) ? {
          label: l
        } : l;
        lo = _makeLabelOverlay(this, _params2);
        this.overlays[_internalLabelOverlayId] = lo;
      } else {
        if (isString(l) || isFunction(l)) {
          lo.setLabel(l);
        } else {
          var ll = l;
          if (ll.label) {
            lo.setLabel(ll.label);
          }
          if (ll.location) {
            lo.location = ll.location;
          }
        }
      }
    }
  }]);
  return Component;
}(EventGenerator);

var _opposites, _clockwiseOptions, _antiClockwiseOptions;
var FaceValues;
(function (FaceValues) {
  FaceValues["top"] = "top";
  FaceValues["left"] = "left";
  FaceValues["right"] = "right";
  FaceValues["bottom"] = "bottom";
})(FaceValues || (FaceValues = {}));
var TOP = FaceValues.top;
var LEFT = FaceValues.left;
var RIGHT = FaceValues.right;
var BOTTOM = FaceValues.bottom;
var X_AXIS_FACES = [LEFT, RIGHT];
var Y_AXIS_FACES = [TOP, BOTTOM];
var LightweightFloatingAnchor = function () {
  function LightweightFloatingAnchor(instance, element) {
    _classCallCheck(this, LightweightFloatingAnchor);
    this.instance = instance;
    this.element = element;
    _defineProperty(this, "isFloating", true);
    _defineProperty(this, "isContinuous", void 0);
    _defineProperty(this, "isDynamic", void 0);
    _defineProperty(this, "locations", [{
      x: 0,
      y: 0,
      ox: 0,
      oy: 0,
      offx: 0,
      offy: 0,
      iox: 0,
      ioy: 0,
      cls: ''
    }]);
    _defineProperty(this, "currentLocation", 0);
    _defineProperty(this, "locked", false);
    _defineProperty(this, "cssClass", '');
    _defineProperty(this, "timestamp", null);
    _defineProperty(this, "type", "Floating");
    _defineProperty(this, "id", uuid());
    _defineProperty(this, "orientation", [0, 0]);
    _defineProperty(this, "size", void 0);
    this.size = instance.getSize(element);
  }
  _createClass(LightweightFloatingAnchor, [{
    key: "over",
    value: function over(endpoint) {
      this.orientation = this.instance.router.getEndpointOrientation(endpoint);
      this.locations[0].ox = this.orientation[0];
      this.locations[0].oy = this.orientation[1];
    }
  }, {
    key: "out",
    value: function out() {
      this.orientation = null;
      this.locations[0].ox = this.locations[0].iox;
      this.locations[0].oy = this.locations[0].ioy;
    }
  }]);
  return LightweightFloatingAnchor;
}();
var opposites = (_opposites = {}, _defineProperty(_opposites, TOP, BOTTOM), _defineProperty(_opposites, RIGHT, LEFT), _defineProperty(_opposites, LEFT, RIGHT), _defineProperty(_opposites, BOTTOM, TOP), _opposites);
var clockwiseOptions = (_clockwiseOptions = {}, _defineProperty(_clockwiseOptions, TOP, RIGHT), _defineProperty(_clockwiseOptions, RIGHT, BOTTOM), _defineProperty(_clockwiseOptions, LEFT, TOP), _defineProperty(_clockwiseOptions, BOTTOM, LEFT), _clockwiseOptions);
var antiClockwiseOptions = (_antiClockwiseOptions = {}, _defineProperty(_antiClockwiseOptions, TOP, LEFT), _defineProperty(_antiClockwiseOptions, RIGHT, TOP), _defineProperty(_antiClockwiseOptions, LEFT, BOTTOM), _defineProperty(_antiClockwiseOptions, BOTTOM, RIGHT), _antiClockwiseOptions);
function getDefaultFace(a) {
  return a.faces.length === 0 ? TOP : a.faces[0];
}
function _isFaceAvailable(a, face) {
  return a.faces.indexOf(face) !== -1;
}
function _secondBest(a, edge) {
  return (a.clockwise ? clockwiseOptions : antiClockwiseOptions)[edge];
}
function _lastChoice(a, edge) {
  return (a.clockwise ? antiClockwiseOptions : clockwiseOptions)[edge];
}
function isEdgeSupported(a, edge) {
  return a.lockedAxis == null ? a.lockedFace == null ? _isFaceAvailable(a, edge) === true : a.lockedFace === edge : a.lockedAxis.indexOf(edge) !== -1;
}
function verifyFace(a, edge) {
  if (_isFaceAvailable(a, edge)) {
    return edge;
  } else if (_isFaceAvailable(a, opposites[edge])) {
    return opposites[edge];
  } else {
    var secondBest = _secondBest(a, edge);
    if (_isFaceAvailable(a, secondBest)) {
      return secondBest;
    } else {
      var lastChoice = _lastChoice(a, edge);
      if (_isFaceAvailable(a, lastChoice)) {
        return lastChoice;
      }
    }
  }
  return edge;
}
var _top = {
  x: 0.5,
  y: 0,
  ox: 0,
  oy: -1,
  offx: 0,
  offy: 0
},
    _bottom = {
  x: 0.5,
  y: 1,
  ox: 0,
  oy: 1,
  offx: 0,
  offy: 0
},
    _left = {
  x: 0,
  y: 0.5,
  ox: -1,
  oy: 0,
  offx: 0,
  offy: 0
},
    _right = {
  x: 1,
  y: 0.5,
  ox: 1,
  oy: 0,
  offx: 0,
  offy: 0
},
    _topLeft = {
  x: 0,
  y: 0,
  ox: 0,
  oy: -1,
  offx: 0,
  offy: 0
},
    _topRight = {
  x: 1,
  y: 0,
  ox: 1,
  oy: -1,
  offx: 0,
  offy: 0
},
    _bottomLeft = {
  x: 0,
  y: 1,
  ox: 0,
  oy: 1,
  offx: 0,
  offy: 0
},
    _bottomRight = {
  x: 1,
  y: 1,
  ox: 0,
  oy: 1,
  offx: 0,
  offy: 0
},
    _center = {
  x: 0.5,
  y: 0.5,
  ox: 0,
  oy: 0,
  offx: 0,
  offy: 0
};
var namedValues = {
  "Top": [_top],
  "Bottom": [_bottom],
  "Left": [_left],
  "Right": [_right],
  "TopLeft": [_topLeft],
  "TopRight": [_topRight],
  "BottomLeft": [_bottomLeft],
  "BottomRight": [_bottomRight],
  "Center": [_center],
  "AutoDefault": [_top, _left, _bottom, _right]
};
var namedContinuousValues = {
  "Continuous": {
    faces: [TOP, LEFT, BOTTOM, RIGHT]
  },
  "ContinuousTop": {
    faces: [TOP]
  },
  "ContinuousRight": {
    faces: [RIGHT]
  },
  "ContinuousBottom": {
    faces: [BOTTOM]
  },
  "ContinuousLeft": {
    faces: [LEFT]
  },
  "ContinuousLeftRight": {
    faces: [LEFT, RIGHT]
  },
  "ContinuousTopBottom": {
    faces: [TOP, BOTTOM]
  }
};
function getNamedAnchor(name, params) {
  params = params || {};
  if (name === AnchorLocations.Perimeter) {
    return _createPerimeterAnchor(params);
  }
  var a = namedValues[name];
  if (a != null) {
    return _createAnchor(name, map(a, function (_a) {
      return extend({
        iox: _a.ox,
        ioy: _a.oy
      }, _a);
    }), params);
  }
  a = namedContinuousValues[name];
  if (a != null) {
    return _createContinuousAnchor(name, a.faces, params);
  }
  throw {
    message: "jsPlumb: unknown anchor type '" + name + "'"
  };
}
function _createAnchor(type, locations, params) {
  return {
    type: type,
    locations: locations,
    currentLocation: 0,
    locked: false,
    id: uuid(),
    isFloating: false,
    isContinuous: false,
    isDynamic: locations.length > 1,
    timestamp: null,
    cssClass: params.cssClass || ""
  };
}
function createFloatingAnchor(instance, element) {
  return new LightweightFloatingAnchor(instance, element);
}
var PROPERTY_CURRENT_FACE = "currentFace";
function _createContinuousAnchor(type, faces, params) {
  var ca = {
    type: type,
    locations: [],
    currentLocation: 0,
    locked: false,
    id: uuid(),
    cssClass: params.cssClass || "",
    isFloating: false,
    isContinuous: true,
    timestamp: null,
    faces: params.faces || faces,
    lockedFace: null,
    lockedAxis: null,
    clockwise: !(params.clockwise === false),
    __currentFace: null
  };
  Object.defineProperty(ca, PROPERTY_CURRENT_FACE, {
    get: function get() {
      return this.__currentFace;
    },
    set: function set(f) {
      this.__currentFace = verifyFace(this, f);
    }
  });
  return ca;
}
function isPrimitiveAnchorSpec(sa) {
  return sa.length < 7 && sa.every(isNumber) || sa.length === 7 && sa.slice(0, 5).every(isNumber) && isString(sa[6]);
}
function makeLightweightAnchorFromSpec(spec) {
  if (isString(spec)) {
    return getNamedAnchor(spec, null);
  } else if (Array.isArray(spec)) {
    if (isPrimitiveAnchorSpec(spec)) {
      var _spec = spec;
      return _createAnchor(null, [{
        x: _spec[0],
        y: _spec[1],
        ox: _spec[2],
        oy: _spec[3],
        offx: _spec[4] == null ? 0 : _spec[4],
        offy: _spec[5] == null ? 0 : _spec[5],
        iox: _spec[2],
        ioy: _spec[3],
        cls: _spec[6] || ""
      }], {
        cssClass: _spec[6] || ""
      });
    } else {
      var locations = map(spec, function (aSpec) {
        if (isString(aSpec)) {
          var a = namedValues[aSpec];
          return a != null ? extend({
            iox: 0,
            ioy: 0,
            cls: ""
          }, a[0]) : null;
        } else if (isPrimitiveAnchorSpec(aSpec)) {
          return {
            x: aSpec[0],
            y: aSpec[1],
            ox: aSpec[2],
            oy: aSpec[3],
            offx: aSpec[4] == null ? 0 : aSpec[4],
            offy: aSpec[5] == null ? 0 : aSpec[5],
            iox: aSpec[2],
            ioy: aSpec[3],
            cls: aSpec[6] || ""
          };
        }
      }).filter(function (ar) {
        return ar != null;
      });
      return _createAnchor("Dynamic", locations, {});
    }
  } else {
    var sa = spec;
    return getNamedAnchor(sa.type, sa.options);
  }
}
function circleGenerator(anchorCount) {
  var r = 0.5,
      step = Math.PI * 2 / anchorCount,
      a = [];
  var current = 0;
  for (var i = 0; i < anchorCount; i++) {
    var x = r + r * Math.sin(current),
        y = r + r * Math.cos(current);
    a.push({
      x: x,
      y: y,
      ox: 0,
      oy: 0,
      offx: 0,
      offy: 0,
      iox: 0,
      ioy: 0,
      cls: ''
    });
    current += step;
  }
  return a;
}
function _path(segments, anchorCount) {
  var anchorsPerFace = anchorCount / segments.length,
      a = [],
      _computeFace = function _computeFace(x1, y1, x2, y2, fractionalLength, ox, oy) {
    anchorsPerFace = anchorCount * fractionalLength;
    var dx = (x2 - x1) / anchorsPerFace,
        dy = (y2 - y1) / anchorsPerFace;
    for (var i = 0; i < anchorsPerFace; i++) {
      a.push({
        x: x1 + dx * i,
        y: y1 + dy * i,
        ox: ox == null ? 0 : ox,
        oy: oy == null ? 0 : oy,
        offx: 0,
        offy: 0,
        iox: 0,
        ioy: 0,
        cls: ''
      });
    }
  };
  for (var i = 0; i < segments.length; i++) {
    _computeFace.apply(null, segments[i]);
  }
  return a;
}
function shapeGenerator(faces, anchorCount) {
  var s = [];
  for (var i = 0; i < faces.length; i++) {
    s.push([faces[i][0], faces[i][1], faces[i][2], faces[i][3], 1 / faces.length, faces[i][4], faces[i][5]]);
  }
  return _path(s, anchorCount);
}
function rectangleGenerator(anchorCount) {
  return shapeGenerator([[0, 0, 1, 0, 0, -1], [1, 0, 1, 1, 1, 0], [1, 1, 0, 1, 0, 1], [0, 1, 0, 0, -1, 0]], anchorCount);
}
function diamondGenerator(anchorCount) {
  return shapeGenerator([[0.5, 0, 1, 0.5], [1, 0.5, 0.5, 1], [0.5, 1, 0, 0.5], [0, 0.5, 0.5, 0]], anchorCount);
}
function triangleGenerator(anchorCount) {
  return shapeGenerator([[0.5, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0.5, 0]], anchorCount);
}
function rotate$1(points, amountInDegrees) {
  var o = [],
      theta = amountInDegrees / 180 * Math.PI;
  for (var i = 0; i < points.length; i++) {
    var _x = points[i].x - 0.5,
        _y = points[i].y - 0.5;
    o.push({
      x: 0.5 + (_x * Math.cos(theta) - _y * Math.sin(theta)),
      y: 0.5 + (_x * Math.sin(theta) + _y * Math.cos(theta)),
      ox: points[i].ox,
      oy: points[i].oy,
      offx: 0,
      offy: 0,
      iox: 0,
      ioy: 0,
      cls: ''
    });
  }
  return o;
}
var anchorGenerators = new Map();
anchorGenerators.set(PerimeterAnchorShapes.Circle, circleGenerator);
anchorGenerators.set(PerimeterAnchorShapes.Ellipse, circleGenerator);
anchorGenerators.set(PerimeterAnchorShapes.Rectangle, rectangleGenerator);
anchorGenerators.set(PerimeterAnchorShapes.Square, rectangleGenerator);
anchorGenerators.set(PerimeterAnchorShapes.Diamond, diamondGenerator);
anchorGenerators.set(PerimeterAnchorShapes.Triangle, triangleGenerator);
function _createPerimeterAnchor(params) {
  params = params || {};
  var anchorCount = params.anchorCount || 60,
      shape = params.shape;
  if (!shape) {
    throw new Error("no shape supplied to Perimeter Anchor type");
  }
  if (!anchorGenerators.has(shape)) {
    throw new Error("Shape [" + shape + "] is unknown by Perimeter Anchor type");
  }
  var da = anchorGenerators.get(shape)(anchorCount);
  if (params.rotation) {
    da = rotate$1(da, params.rotation);
  }
  var a = _createAnchor(AnchorLocations.Perimeter, da, params);
  var aa = extend(a, {
    shape: shape
  });
  return aa;
}

var TYPE_ITEM_ANCHORS = "anchors";
var TYPE_ITEM_CONNECTOR = "connector";
function prepareEndpoint(conn, existing, index, anchor, element, elementId, endpoint) {
  var e;
  if (existing) {
    conn.endpoints[index] = existing;
    existing.addConnection(conn);
  } else {
    var ep = endpoint || conn.endpointSpec || conn.endpointsSpec[index] || conn.instance.defaults.endpoints[index] || conn.instance.defaults.endpoint;
    var es = conn.endpointStyles[index] || conn.endpointStyle || conn.instance.defaults.endpointStyles[index] || conn.instance.defaults.endpointStyle;
    if (es.fill == null && conn.paintStyle != null) {
      es.fill = conn.paintStyle.stroke;
    }
    if (es.outlineStroke == null && conn.paintStyle != null) {
      es.outlineStroke = conn.paintStyle.outlineStroke;
    }
    if (es.outlineWidth == null && conn.paintStyle != null) {
      es.outlineWidth = conn.paintStyle.outlineWidth;
    }
    var ehs = conn.endpointHoverStyles[index] || conn.endpointHoverStyle || conn.endpointHoverStyle || conn.instance.defaults.endpointHoverStyles[index] || conn.instance.defaults.endpointHoverStyle;
    if (conn.hoverPaintStyle != null) {
      if (ehs == null) {
        ehs = {};
      }
      if (ehs.fill == null) {
        ehs.fill = conn.hoverPaintStyle.stroke;
      }
    }
    var u = conn.uuids ? conn.uuids[index] : null;
    anchor = anchor != null ? anchor : conn.instance.defaults.anchors != null ? conn.instance.defaults.anchors[index] : conn.instance.defaults.anchor;
    e = conn.instance._internal_newEndpoint({
      paintStyle: es,
      hoverPaintStyle: ehs,
      endpoint: ep,
      connections: [conn],
      uuid: u,
      element: element,
      scope: conn.scope,
      anchor: anchor,
      reattachConnections: conn.reattach || conn.instance.defaults.reattachConnections,
      connectionsDetachable: conn.detachable || conn.instance.defaults.connectionsDetachable
    });
    if (existing == null) {
      e.deleteOnEmpty = true;
    }
    conn.endpoints[index] = e;
  }
  return e;
}
var Connection = function (_Component) {
  _inherits(Connection, _Component);
  var _super = _createSuper(Connection);
  function Connection(instance, params) {
    var _this;
    _classCallCheck(this, Connection);
    _this = _super.call(this, instance, params);
    _this.instance = instance;
    _defineProperty(_assertThisInitialized(_this), "connector", void 0);
    _defineProperty(_assertThisInitialized(_this), "defaultLabelLocation", 0.5);
    _defineProperty(_assertThisInitialized(_this), "scope", void 0);
    _defineProperty(_assertThisInitialized(_this), "typeId", "_jsplumb_connection");
    _defineProperty(_assertThisInitialized(_this), "previousConnection", void 0);
    _defineProperty(_assertThisInitialized(_this), "sourceId", void 0);
    _defineProperty(_assertThisInitialized(_this), "targetId", void 0);
    _defineProperty(_assertThisInitialized(_this), "source", void 0);
    _defineProperty(_assertThisInitialized(_this), "target", void 0);
    _defineProperty(_assertThisInitialized(_this), "detachable", true);
    _defineProperty(_assertThisInitialized(_this), "reattach", false);
    _defineProperty(_assertThisInitialized(_this), "uuids", void 0);
    _defineProperty(_assertThisInitialized(_this), "cost", 1);
    _defineProperty(_assertThisInitialized(_this), "directed", void 0);
    _defineProperty(_assertThisInitialized(_this), "endpoints", [null, null]);
    _defineProperty(_assertThisInitialized(_this), "endpointStyles", void 0);
    _defineProperty(_assertThisInitialized(_this), "endpointSpec", void 0);
    _defineProperty(_assertThisInitialized(_this), "endpointsSpec", void 0);
    _defineProperty(_assertThisInitialized(_this), "endpointStyle", {});
    _defineProperty(_assertThisInitialized(_this), "endpointHoverStyle", {});
    _defineProperty(_assertThisInitialized(_this), "endpointHoverStyles", void 0);
    _defineProperty(_assertThisInitialized(_this), "suspendedEndpoint", void 0);
    _defineProperty(_assertThisInitialized(_this), "suspendedIndex", void 0);
    _defineProperty(_assertThisInitialized(_this), "suspendedElement", void 0);
    _defineProperty(_assertThisInitialized(_this), "suspendedElementId", void 0);
    _defineProperty(_assertThisInitialized(_this), "suspendedElementType", void 0);
    _defineProperty(_assertThisInitialized(_this), "_forceReattach", void 0);
    _defineProperty(_assertThisInitialized(_this), "_forceDetach", void 0);
    _defineProperty(_assertThisInitialized(_this), "proxies", []);
    _defineProperty(_assertThisInitialized(_this), "pending", false);
    _this.id = params.id;
    _this.previousConnection = params.previousConnection;
    _this.source = params.source;
    _this.target = params.target;
    if (params.sourceEndpoint) {
      _this.source = params.sourceEndpoint.element;
      _this.sourceId = params.sourceEndpoint.elementId;
    } else {
      _this.sourceId = instance.getId(_this.source);
    }
    if (params.targetEndpoint) {
      _this.target = params.targetEndpoint.element;
      _this.targetId = params.targetEndpoint.elementId;
    } else {
      _this.targetId = instance.getId(_this.target);
    }
    _this.scope = params.scope;
    var sourceAnchor = params.anchors ? params.anchors[0] : params.anchor;
    var targetAnchor = params.anchors ? params.anchors[1] : params.anchor;
    instance.manage(_this.source);
    instance.manage(_this.target);
    _this.visible = true;
    _this.params = {
      cssClass: params.cssClass,
      hoverClass: params.hoverClass,
      "pointer-events": params["pointer-events"],
      overlays: params.overlays
    };
    _this.lastPaintedAt = null;
    if (params.type) {
      params.endpoints = params.endpoints || _this.instance._deriveEndpointAndAnchorSpec(params.type).endpoints;
    }
    _this.endpointSpec = params.endpoint;
    _this.endpointsSpec = params.endpoints || [null, null];
    _this.endpointStyle = params.endpointStyle;
    _this.endpointHoverStyle = params.endpointHoverStyle;
    _this.endpointStyles = params.endpointStyles || [null, null];
    _this.endpointHoverStyles = params.endpointHoverStyles || [null, null];
    _this.paintStyle = params.paintStyle;
    _this.hoverPaintStyle = params.hoverPaintStyle;
    _this.uuids = params.uuids;
    _this.makeEndpoint(true, _this.source, _this.sourceId, sourceAnchor, params.sourceEndpoint);
    _this.makeEndpoint(false, _this.target, _this.targetId, targetAnchor, params.targetEndpoint);
    if (!_this.scope) {
      _this.scope = _this.endpoints[0].scope;
    }
    if (params.deleteEndpointsOnEmpty != null) {
      _this.endpoints[0].deleteOnEmpty = params.deleteEndpointsOnEmpty;
      _this.endpoints[1].deleteOnEmpty = params.deleteEndpointsOnEmpty;
    }
    var _detachable = _this.instance.defaults.connectionsDetachable;
    if (params.detachable === false) {
      _detachable = false;
    }
    if (_this.endpoints[0].connectionsDetachable === false) {
      _detachable = false;
    }
    if (_this.endpoints[1].connectionsDetachable === false) {
      _detachable = false;
    }
    _this.endpointsSpec = params.endpoints || [null, null];
    _this.endpointSpec = params.endpoint || null;
    var _reattach = params.reattach || _this.endpoints[0].reattachConnections || _this.endpoints[1].reattachConnections || _this.instance.defaults.reattachConnections;
    _this.appendToDefaultType({
      detachable: _detachable,
      reattach: _reattach,
      paintStyle: _this.endpoints[0].connectorStyle || _this.endpoints[1].connectorStyle || params.paintStyle || _this.instance.defaults.paintStyle,
      hoverPaintStyle: _this.endpoints[0].connectorHoverStyle || _this.endpoints[1].connectorHoverStyle || params.hoverPaintStyle || _this.instance.defaults.hoverPaintStyle
    });
    if (!_this.instance._suspendDrawing) {
      var initialTimestamp = _this.instance._suspendedAt || uuid();
      _this.instance.paintEndpoint(_this.endpoints[0], {
        timestamp: initialTimestamp
      });
      _this.instance.paintEndpoint(_this.endpoints[1], {
        timestamp: initialTimestamp
      });
    }
    _this.cost = params.cost || _this.endpoints[0].connectionCost;
    _this.directed = params.directed;
    if (params.directed == null) {
      _this.directed = _this.endpoints[0].connectionsDirected;
    }
    var _p = extend({}, _this.endpoints[1].parameters);
    extend(_p, _this.endpoints[0].parameters);
    extend(_p, _this.parameters);
    _this.parameters = _p;
    _this.paintStyleInUse = _this.getPaintStyle() || {};
    _this.setConnector(_this.endpoints[0].connector || _this.endpoints[1].connector || params.connector || _this.instance.defaults.connector, true);
    var data = params.data == null || !isObject(params.data) ? {} : params.data;
    _this.setData(data);
    var _types = [DEFAULT, _this.endpoints[0].edgeType, _this.endpoints[1].edgeType, params.type].join(" ");
    if (/[^\s]/.test(_types)) {
      _this.addType(_types, params.data);
    }
    return _this;
  }
  _createClass(Connection, [{
    key: "getIdPrefix",
    value: function getIdPrefix() {
      return "_jsPlumb_c";
    }
  }, {
    key: "getDefaultOverlayKey",
    value: function getDefaultOverlayKey() {
      return KEY_CONNECTION_OVERLAYS;
    }
  }, {
    key: "getXY",
    value: function getXY() {
      return {
        x: this.connector.x,
        y: this.connector.y
      };
    }
  }, {
    key: "makeEndpoint",
    value: function makeEndpoint(isSource, el, elId, anchor, ep) {
      elId = elId || this.instance.getId(el);
      return prepareEndpoint(this, ep, isSource ? 0 : 1, anchor, el);
    }
  }, {
    key: "getTypeDescriptor",
    value: function getTypeDescriptor() {
      return Connection.type;
    }
  }, {
    key: "isDetachable",
    value: function isDetachable(ep) {
      return this.detachable === false ? false : ep != null ? ep.connectionsDetachable === true : this.detachable === true;
    }
  }, {
    key: "setDetachable",
    value: function setDetachable(detachable) {
      this.detachable = detachable === true;
    }
  }, {
    key: "isReattach",
    value: function isReattach() {
      return this.reattach === true || this.endpoints[0].reattachConnections === true || this.endpoints[1].reattachConnections === true;
    }
  }, {
    key: "setReattach",
    value: function setReattach(reattach) {
      this.reattach = reattach === true;
    }
  }, {
    key: "applyType",
    value: function applyType(t, typeMap) {
      var _connector = null;
      if (t.connector != null) {
        _connector = this.getCachedTypeItem(TYPE_ITEM_CONNECTOR, typeMap.connector);
        if (_connector == null) {
          _connector = this.prepareConnector(t.connector, typeMap.connector);
          this.cacheTypeItem(TYPE_ITEM_CONNECTOR, _connector, typeMap.connector);
        }
        this.setPreparedConnector(_connector);
      }
      _get(_getPrototypeOf(Connection.prototype), "applyType", this).call(this, t, typeMap);
      if (t.detachable != null) {
        this.setDetachable(t.detachable);
      }
      if (t.reattach != null) {
        this.setReattach(t.reattach);
      }
      if (t.scope) {
        this.scope = t.scope;
      }
      var _anchors = null;
      if (t.anchor) {
        _anchors = this.getCachedTypeItem(TYPE_ITEM_ANCHORS, typeMap.anchor);
        if (_anchors == null) {
          _anchors = [makeLightweightAnchorFromSpec(t.anchor), makeLightweightAnchorFromSpec(t.anchor)];
          this.cacheTypeItem(TYPE_ITEM_ANCHORS, _anchors, typeMap.anchor);
        }
      } else if (t.anchors) {
        _anchors = this.getCachedTypeItem(TYPE_ITEM_ANCHORS, typeMap.anchors);
        if (_anchors == null) {
          _anchors = [makeLightweightAnchorFromSpec(t.anchors[0]), makeLightweightAnchorFromSpec(t.anchors[1])];
          this.cacheTypeItem(TYPE_ITEM_ANCHORS, _anchors, typeMap.anchors);
        }
      }
      if (_anchors != null) {
        this.instance.router.setConnectionAnchors(this, _anchors);
        if (this.instance.router.isDynamicAnchor(this.endpoints[1])) {
          this.instance.repaint(this.endpoints[1].element);
        }
      }
      this.instance.applyConnectorType(this.connector, t);
    }
  }, {
    key: "addClass",
    value: function addClass(c, cascade) {
      _get(_getPrototypeOf(Connection.prototype), "addClass", this).call(this, c);
      if (cascade) {
        this.endpoints[0].addClass(c);
        this.endpoints[1].addClass(c);
        if (this.suspendedEndpoint) {
          this.suspendedEndpoint.addClass(c);
        }
      }
      if (this.connector) {
        this.instance.addConnectorClass(this.connector, c);
      }
    }
  }, {
    key: "removeClass",
    value: function removeClass(c, cascade) {
      _get(_getPrototypeOf(Connection.prototype), "removeClass", this).call(this, c);
      if (cascade) {
        this.endpoints[0].removeClass(c);
        this.endpoints[1].removeClass(c);
        if (this.suspendedEndpoint) {
          this.suspendedEndpoint.removeClass(c);
        }
      }
      if (this.connector) {
        this.instance.removeConnectorClass(this.connector, c);
      }
    }
  }, {
    key: "setVisible",
    value: function setVisible(v) {
      _get(_getPrototypeOf(Connection.prototype), "setVisible", this).call(this, v);
      if (this.connector) {
        this.instance.setConnectorVisible(this.connector, v);
      }
      this.instance.paintConnection(this);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(Connection.prototype), "destroy", this).call(this);
      this.endpoints = null;
      this.endpointStyles = null;
      this.source = null;
      this.target = null;
      this.instance.destroyConnector(this);
      this.connector = null;
      this.deleted = true;
    }
  }, {
    key: "getUuids",
    value: function getUuids() {
      return [this.endpoints[0].getUuid(), this.endpoints[1].getUuid()];
    }
  }, {
    key: "prepareConnector",
    value: function prepareConnector(connectorSpec, typeId) {
      var connectorArgs = {
        cssClass: this.params.cssClass,
        hoverClass: this.params.hoverClass,
        "pointer-events": this.params["pointer-events"]
      },
          connector;
      if (isString(connectorSpec)) {
        connector = this.instance.makeConnector(this, connectorSpec, connectorArgs);
      } else {
        var co = connectorSpec;
        connector = this.instance.makeConnector(this, co.type, merge(co.options, connectorArgs));
      }
      if (typeId != null) {
        connector.typeId = typeId;
      }
      return connector;
    }
  }, {
    key: "setPreparedConnector",
    value: function setPreparedConnector(connector, doNotRepaint, doNotChangeListenerComponent, typeId) {
      if (this.connector !== connector) {
        var previous,
            previousClasses = "";
        if (this.connector != null) {
          previous = this.connector;
          previousClasses = this.instance.getConnectorClass(this.connector);
          this.instance.destroyConnector(this);
        }
        this.connector = connector;
        if (typeId) {
          this.cacheTypeItem(TYPE_ITEM_CONNECTOR, connector, typeId);
        }
        this.addClass(previousClasses);
        if (previous != null) {
          var o = this.getOverlays();
          for (var i in o) {
            this.instance.reattachOverlay(o[i], this);
          }
        }
        if (!doNotRepaint) {
          this.instance.paintConnection(this);
        }
      }
    }
  }, {
    key: "setConnector",
    value: function setConnector(connectorSpec, doNotRepaint, doNotChangeListenerComponent, typeId) {
      var connector = this.prepareConnector(connectorSpec, typeId);
      this.setPreparedConnector(connector, doNotRepaint, doNotChangeListenerComponent, typeId);
    }
  }, {
    key: "replaceEndpoint",
    value: function replaceEndpoint(idx, endpointDef) {
      var current = this.endpoints[idx],
          elId = current.elementId,
          ebe = this.instance.getEndpoints(current.element),
          _idx = ebe.indexOf(current),
          _new = prepareEndpoint(this, null, idx, null, current.element, elId, endpointDef);
      this.endpoints[idx] = _new;
      ebe.splice(_idx, 1, _new);
      current.detachFromConnection(this);
      this.instance.deleteEndpoint(current);
      this.instance.fire(EVENT_ENDPOINT_REPLACED, {
        previous: current,
        current: _new
      });
    }
  }]);
  return Connection;
}(Component);
_defineProperty(Connection, "type", "connection");

var typeParameters = ["connectorStyle", "connectorHoverStyle", "connectorOverlays", "connector", "connectionType", "connectorClass", "connectorHoverClass"];
var Endpoint = function (_Component) {
  _inherits(Endpoint, _Component);
  var _super = _createSuper(Endpoint);
  function Endpoint(instance, params) {
    var _this;
    _classCallCheck(this, Endpoint);
    _this = _super.call(this, instance, params);
    _this.instance = instance;
    _defineProperty(_assertThisInitialized(_this), "connections", []);
    _defineProperty(_assertThisInitialized(_this), "endpoint", void 0);
    _defineProperty(_assertThisInitialized(_this), "element", void 0);
    _defineProperty(_assertThisInitialized(_this), "elementId", void 0);
    _defineProperty(_assertThisInitialized(_this), "dragAllowedWhenFull", true);
    _defineProperty(_assertThisInitialized(_this), "timestamp", void 0);
    _defineProperty(_assertThisInitialized(_this), "portId", void 0);
    _defineProperty(_assertThisInitialized(_this), "maxConnections", void 0);
    _defineProperty(_assertThisInitialized(_this), "proxiedBy", void 0);
    _defineProperty(_assertThisInitialized(_this), "connectorClass", void 0);
    _defineProperty(_assertThisInitialized(_this), "connectorHoverClass", void 0);
    _defineProperty(_assertThisInitialized(_this), "finalEndpoint", void 0);
    _defineProperty(_assertThisInitialized(_this), "enabled", true);
    _defineProperty(_assertThisInitialized(_this), "isSource", void 0);
    _defineProperty(_assertThisInitialized(_this), "isTarget", void 0);
    _defineProperty(_assertThisInitialized(_this), "isTemporarySource", void 0);
    _defineProperty(_assertThisInitialized(_this), "connectionCost", 1);
    _defineProperty(_assertThisInitialized(_this), "connectionsDirected", void 0);
    _defineProperty(_assertThisInitialized(_this), "connectionsDetachable", void 0);
    _defineProperty(_assertThisInitialized(_this), "reattachConnections", void 0);
    _defineProperty(_assertThisInitialized(_this), "currentAnchorClass", void 0);
    _defineProperty(_assertThisInitialized(_this), "referenceEndpoint", void 0);
    _defineProperty(_assertThisInitialized(_this), "edgeType", void 0);
    _defineProperty(_assertThisInitialized(_this), "connector", void 0);
    _defineProperty(_assertThisInitialized(_this), "connectorOverlays", void 0);
    _defineProperty(_assertThisInitialized(_this), "connectorStyle", void 0);
    _defineProperty(_assertThisInitialized(_this), "connectorHoverStyle", void 0);
    _defineProperty(_assertThisInitialized(_this), "deleteOnEmpty", void 0);
    _defineProperty(_assertThisInitialized(_this), "uuid", void 0);
    _defineProperty(_assertThisInitialized(_this), "scope", void 0);
    _defineProperty(_assertThisInitialized(_this), "_anchor", void 0);
    _defineProperty(_assertThisInitialized(_this), "defaultLabelLocation", [0.5, 0.5]);
    _this.appendToDefaultType({
      edgeType: params.edgeType,
      maxConnections: params.maxConnections == null ? _this.instance.defaults.maxConnections : params.maxConnections,
      paintStyle: params.paintStyle || _this.instance.defaults.endpointStyle,
      hoverPaintStyle: params.hoverPaintStyle || _this.instance.defaults.endpointHoverStyle,
      connectorStyle: params.connectorStyle,
      connectorHoverStyle: params.connectorHoverStyle,
      connectorClass: params.connectorClass,
      connectorHoverClass: params.connectorHoverClass,
      connectorOverlays: params.connectorOverlays,
      connector: params.connector
    });
    _this.enabled = !(params.enabled === false);
    _this.visible = true;
    _this.element = params.element;
    _this.uuid = params.uuid;
    _this.portId = params.portId;
    _this.elementId = params.elementId;
    _this.connectionCost = params.connectionCost == null ? 1 : params.connectionCost;
    _this.connectionsDirected = params.connectionsDirected;
    _this.currentAnchorClass = "";
    _this.events = {};
    _this.connectorOverlays = params.connectorOverlays;
    _this.connectorStyle = params.connectorStyle;
    _this.connectorHoverStyle = params.connectorHoverStyle;
    _this.connector = params.connector;
    _this.edgeType = params.edgeType;
    _this.connectorClass = params.connectorClass;
    _this.connectorHoverClass = params.connectorHoverClass;
    _this.deleteOnEmpty = params.deleteOnEmpty === true;
    _this.isSource = params.source || false;
    _this.isTemporarySource = params.isTemporarySource || false;
    _this.isTarget = params.target || false;
    _this.connections = params.connections || [];
    _this.scope = params.scope || instance.defaultScope;
    _this.timestamp = null;
    _this.reattachConnections = params.reattachConnections || instance.defaults.reattachConnections;
    _this.connectionsDetachable = instance.defaults.connectionsDetachable;
    if (params.connectionsDetachable === false) {
      _this.connectionsDetachable = false;
    }
    _this.dragAllowedWhenFull = params.dragAllowedWhenFull !== false;
    if (params.onMaxConnections) {
      _this.bind(EVENT_MAX_CONNECTIONS, params.onMaxConnections);
    }
    var ep = params.endpoint || params.existingEndpoint || instance.defaults.endpoint;
    _this.setEndpoint(ep);
    if (params.preparedAnchor != null) {
      _this.setPreparedAnchor(params.preparedAnchor);
    } else {
      var anchorParamsToUse = params.anchor ? params.anchor : params.anchors ? params.anchors : instance.defaults.anchor || AnchorLocations.Top;
      _this.setAnchor(anchorParamsToUse);
    }
    var type = [DEFAULT, params.type || ""].join(" ");
    _this.addType(type, params.data);
    return _this;
  }
  _createClass(Endpoint, [{
    key: "getIdPrefix",
    value: function getIdPrefix() {
      return "_jsplumb_e";
    }
  }, {
    key: "getTypeDescriptor",
    value: function getTypeDescriptor() {
      return "endpoint";
    }
  }, {
    key: "getXY",
    value: function getXY() {
      return {
        x: this.endpoint.x,
        y: this.endpoint.y
      };
    }
  }, {
    key: "getDefaultOverlayKey",
    value: function getDefaultOverlayKey() {
      return "endpointOverlays";
    }
  }, {
    key: "_updateAnchorClass",
    value: function _updateAnchorClass() {
      var ac = this._anchor && this._anchor.cssClass;
      if (ac != null && ac.length > 0) {
        var oldAnchorClass = this.instance.endpointAnchorClassPrefix + "-" + this.currentAnchorClass;
        this.currentAnchorClass = ac;
        var anchorClass = this.instance.endpointAnchorClassPrefix + (this.currentAnchorClass ? "-" + this.currentAnchorClass : "");
        if (oldAnchorClass !== anchorClass) {
          this.removeClass(oldAnchorClass);
          this.addClass(anchorClass);
          this.instance.removeClass(this.element, oldAnchorClass);
          this.instance.addClass(this.element, anchorClass);
        }
      }
    }
  }, {
    key: "setPreparedAnchor",
    value: function setPreparedAnchor(anchor) {
      this.instance.router.setAnchor(this, anchor);
      this._updateAnchorClass();
      return this;
    }
  }, {
    key: "_anchorLocationChanged",
    value: function _anchorLocationChanged(currentAnchor) {
      this.fire(EVENT_ANCHOR_CHANGED, {
        endpoint: this,
        anchor: currentAnchor
      });
      this._updateAnchorClass();
    }
  }, {
    key: "setAnchor",
    value: function setAnchor(anchorParams) {
      var a = this.instance.router.prepareAnchor(this, anchorParams);
      this.setPreparedAnchor(a);
      return this;
    }
  }, {
    key: "addConnection",
    value: function addConnection(conn) {
      var wasFull = this.isFull();
      var wasEmpty = this.connections.length === 0;
      this.connections.push(conn);
      if (wasEmpty) {
        this.addClass(this.instance.endpointConnectedClass);
      }
      if (this.isFull()) {
        if (!wasFull) {
          this.addClass(this.instance.endpointFullClass);
        }
      } else if (wasFull) {
        this.removeClass(this.instance.endpointFullClass);
      }
    }
  }, {
    key: "detachFromConnection",
    value: function detachFromConnection(connection, idx, transientDetach) {
      idx = idx == null ? this.connections.indexOf(connection) : idx;
      if (idx >= 0) {
        this.connections.splice(idx, 1);
        this.instance.refreshEndpoint(this);
      }
      if (!transientDetach && this.deleteOnEmpty && this.connections.length === 0) {
        this.instance.deleteEndpoint(this);
      }
    }
  }, {
    key: "deleteEveryConnection",
    value: function deleteEveryConnection(params) {
      var c = this.connections.length;
      for (var i = 0; i < c; i++) {
        this.instance.deleteConnection(this.connections[0], params);
      }
    }
  }, {
    key: "detachFrom",
    value: function detachFrom(otherEndpoint) {
      var c = [];
      for (var i = 0; i < this.connections.length; i++) {
        if (this.connections[i].endpoints[1] === otherEndpoint || this.connections[i].endpoints[0] === otherEndpoint) {
          c.push(this.connections[i]);
        }
      }
      for (var j = 0, count = c.length; j < count; j++) {
        this.instance.deleteConnection(c[0]);
      }
      return this;
    }
  }, {
    key: "setVisible",
    value: function setVisible(v, doNotChangeConnections, doNotNotifyOtherEndpoint) {
      _get(_getPrototypeOf(Endpoint.prototype), "setVisible", this).call(this, v);
      this.endpoint.setVisible(v);
      if (v) {
        this.showOverlays();
      } else {
        this.hideOverlays();
      }
      if (!doNotChangeConnections) {
        for (var i = 0; i < this.connections.length; i++) {
          this.connections[i].setVisible(v);
          if (!doNotNotifyOtherEndpoint) {
            var oIdx = this === this.connections[i].endpoints[0] ? 1 : 0;
            if (this.connections[i].endpoints[oIdx].connections.length === 1) {
              this.connections[i].endpoints[oIdx].setVisible(v, true, true);
            }
          }
        }
      }
    }
  }, {
    key: "applyType",
    value: function applyType(t, typeMap) {
      _get(_getPrototypeOf(Endpoint.prototype), "applyType", this).call(this, t, typeMap);
      this.setPaintStyle(t.endpointStyle || t.paintStyle);
      this.setHoverPaintStyle(t.endpointHoverStyle || t.hoverPaintStyle);
      this.connectorStyle = t.connectorStyle;
      this.connectorHoverStyle = t.connectorHoverStyle;
      this.connector = t.connector;
      this.connectorOverlays = t.connectorOverlays;
      this.edgeType = t.edgeType;
      if (t.maxConnections != null) {
        this.maxConnections = t.maxConnections;
      }
      if (t.scope) {
        this.scope = t.scope;
      }
      extend(t, typeParameters);
      this.instance.applyEndpointType(this, t);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(Endpoint.prototype), "destroy", this).call(this);
      if (this.endpoint != null) {
        this.instance.destroyEndpoint(this);
      }
    }
  }, {
    key: "isFull",
    value: function isFull() {
      return this.maxConnections === 0 ? true : !(this.isFloating() || this.maxConnections < 0 || this.connections.length < this.maxConnections);
    }
  }, {
    key: "isFloating",
    value: function isFloating() {
      return this.instance.router.isFloating(this);
    }
  }, {
    key: "isConnectedTo",
    value: function isConnectedTo(otherEndpoint) {
      var found = false;
      if (otherEndpoint) {
        for (var i = 0; i < this.connections.length; i++) {
          if (this.connections[i].endpoints[1] === otherEndpoint || this.connections[i].endpoints[0] === otherEndpoint) {
            found = true;
            break;
          }
        }
      }
      return found;
    }
  }, {
    key: "setDragAllowedWhenFull",
    value: function setDragAllowedWhenFull(allowed) {
      this.dragAllowedWhenFull = allowed;
    }
  }, {
    key: "getUuid",
    value: function getUuid() {
      return this.uuid;
    }
  }, {
    key: "connectorSelector",
    value: function connectorSelector() {
      return this.connections[0];
    }
  }, {
    key: "prepareEndpoint",
    value: function prepareEndpoint(ep, typeId) {
      var endpointArgs = {
        cssClass: this.cssClass,
        endpoint: this
      };
      var endpoint;
      if (isAssignableFrom(ep, EndpointRepresentation)) {
        var epr = ep;
        endpoint = EndpointFactory.clone(epr);
      } else if (isString(ep)) {
        endpoint = EndpointFactory.get(this, ep, endpointArgs);
      } else {
        var fep = ep;
        extend(endpointArgs, fep.options || {});
        endpoint = EndpointFactory.get(this, fep.type, endpointArgs);
      }
      endpoint.typeId = typeId;
      return endpoint;
    }
  }, {
    key: "setEndpoint",
    value: function setEndpoint(ep) {
      var _ep = this.prepareEndpoint(ep);
      this.setPreparedEndpoint(_ep);
    }
  }, {
    key: "setPreparedEndpoint",
    value: function setPreparedEndpoint(ep) {
      if (this.endpoint != null) {
        this.instance.destroyEndpoint(this);
      }
      this.endpoint = ep;
    }
  }, {
    key: "addClass",
    value: function addClass(clazz, cascade) {
      _get(_getPrototypeOf(Endpoint.prototype), "addClass", this).call(this, clazz, cascade);
      if (this.endpoint != null) {
        this.endpoint.addClass(clazz);
      }
    }
  }, {
    key: "removeClass",
    value: function removeClass(clazz, cascade) {
      _get(_getPrototypeOf(Endpoint.prototype), "removeClass", this).call(this, clazz, cascade);
      if (this.endpoint != null) {
        this.endpoint.removeClass(clazz);
      }
    }
  }]);
  return Endpoint;
}(Component);

var UINode = function UINode(instance, el) {
  _classCallCheck(this, UINode);
  this.instance = instance;
  this.el = el;
  _defineProperty(this, "group", void 0);
};
var UIGroup = function (_UINode) {
  _inherits(UIGroup, _UINode);
  var _super = _createSuper(UIGroup);
  function UIGroup(instance, el, options) {
    var _this;
    _classCallCheck(this, UIGroup);
    _this = _super.call(this, instance, el);
    _this.instance = instance;
    _defineProperty(_assertThisInitialized(_this), "children", []);
    _defineProperty(_assertThisInitialized(_this), "collapsed", false);
    _defineProperty(_assertThisInitialized(_this), "droppable", void 0);
    _defineProperty(_assertThisInitialized(_this), "enabled", void 0);
    _defineProperty(_assertThisInitialized(_this), "orphan", void 0);
    _defineProperty(_assertThisInitialized(_this), "constrain", void 0);
    _defineProperty(_assertThisInitialized(_this), "proxied", void 0);
    _defineProperty(_assertThisInitialized(_this), "ghost", void 0);
    _defineProperty(_assertThisInitialized(_this), "revert", void 0);
    _defineProperty(_assertThisInitialized(_this), "prune", void 0);
    _defineProperty(_assertThisInitialized(_this), "dropOverride", void 0);
    _defineProperty(_assertThisInitialized(_this), "anchor", void 0);
    _defineProperty(_assertThisInitialized(_this), "endpoint", void 0);
    _defineProperty(_assertThisInitialized(_this), "connections", {
      source: [],
      target: [],
      internal: []
    });
    _defineProperty(_assertThisInitialized(_this), "manager", void 0);
    _defineProperty(_assertThisInitialized(_this), "id", void 0);
    _defineProperty(_assertThisInitialized(_this), "elId", void 0);
    var jel = _this.el;
    jel._isJsPlumbGroup = true;
    jel._jsPlumbGroup = _assertThisInitialized(_this);
    _this.elId = instance.getId(el);
    _this.orphan = options.orphan === true;
    _this.revert = _this.orphan === true ? false : options.revert !== false;
    _this.droppable = options.droppable !== false;
    _this.ghost = options.ghost === true;
    _this.enabled = options.enabled !== false;
    _this.prune = _this.orphan !== true && options.prune === true;
    _this.constrain = _this.ghost || options.constrain === true;
    _this.proxied = options.proxied !== false;
    _this.id = options.id || uuid();
    _this.dropOverride = options.dropOverride === true;
    _this.anchor = options.anchor;
    _this.endpoint = options.endpoint;
    _this.anchor = options.anchor;
    instance.setAttribute(el, ATTRIBUTE_GROUP, "");
    return _this;
  }
  _createClass(UIGroup, [{
    key: "overrideDrop",
    value: function overrideDrop(el, targetGroup) {
      return this.dropOverride && (this.revert || this.prune || this.orphan);
    }
  }, {
    key: "getAnchor",
    value: function getAnchor(conn, endpointIndex) {
      return this.anchor || "Continuous";
    }
  }, {
    key: "getEndpoint",
    value: function getEndpoint(conn, endpointIndex) {
      return this.endpoint || {
        type: DotEndpoint.type,
        options: {
          radius: 10
        }
      };
    }
  }, {
    key: "add",
    value: function add(_el, doNotFireEvent) {
      var dragArea = this.instance.getGroupContentArea(this);
      var __el = _el;
      if (__el._jsPlumbParentGroup != null) {
        if (__el._jsPlumbParentGroup === this) {
          return;
        } else {
          __el._jsPlumbParentGroup.remove(_el, true, doNotFireEvent, false);
        }
      }
      __el._jsPlumbParentGroup = this;
      this.children.push(new UINode(this.instance, _el));
      this.instance._appendElement(__el, dragArea);
      this.manager._updateConnectionsForGroup(this);
    }
  }, {
    key: "resolveNode",
    value: function resolveNode(el) {
      return el == null ? null : getWithFunction(this.children, function (u) {
        return u.el === el;
      });
    }
  }, {
    key: "remove",
    value: function remove(el, manipulateDOM, doNotFireEvent, doNotUpdateConnections, targetGroup) {
      var uiNode = this.resolveNode(el);
      if (uiNode != null) {
        this._doRemove(uiNode, manipulateDOM, doNotFireEvent, doNotUpdateConnections, targetGroup);
      }
    }
  }, {
    key: "_doRemove",
    value: function _doRemove(child, manipulateDOM, doNotFireEvent, doNotUpdateConnections, targetGroup) {
      var __el = child.el;
      delete __el._jsPlumbParentGroup;
      removeWithFunction(this.children, function (e) {
        return e === child;
      });
      if (manipulateDOM) {
        try {
          this.instance.getGroupContentArea(this).removeChild(__el);
        } catch (e) {
          log("Could not remove element from Group " + e);
        }
      }
      if (!doNotFireEvent) {
        var p = {
          group: this,
          el: __el
        };
        if (targetGroup) {
          p.targetGroup = targetGroup;
        }
        this.instance.fire(EVENT_GROUP_MEMBER_REMOVED, p);
      }
      if (!doNotUpdateConnections) {
        this.manager._updateConnectionsForGroup(this);
      }
    }
  }, {
    key: "removeAll",
    value: function removeAll(manipulateDOM, doNotFireEvent) {
      for (var i = 0, l = this.children.length; i < l; i++) {
        var child = this.children[0];
        this._doRemove(child, manipulateDOM, doNotFireEvent, true);
        this.instance.unmanage(child.el, true);
      }
      this.children.length = 0;
      this.manager._updateConnectionsForGroup(this);
    }
  }, {
    key: "orphanAll",
    value: function orphanAll() {
      var orphanedPositions = {};
      for (var i = 0; i < this.children.length; i++) {
        var newPosition = this.manager.orphan(this.children[i].el, false);
        orphanedPositions[newPosition.id] = newPosition.pos;
      }
      this.children.length = 0;
      return orphanedPositions;
    }
  }, {
    key: "addGroup",
    value: function addGroup(group) {
      if (this.instance.allowNestedGroups && group !== this) {
        if (this.instance.groupManager.isAncestor(this, group)) {
          return false;
        }
        if (group.group != null) {
          group.group.removeGroup(group);
        }
        var groupElId = this.instance.getId(group.el);
        var entry = this.instance.getManagedElements()[groupElId];
        entry.group = this.elId;
        var elpos = this.instance.getOffsetRelativeToRoot(group.el);
        var cpos = this.collapsed ? this.instance.getOffsetRelativeToRoot(this.el) : this.instance.getOffsetRelativeToRoot(this.instance.getGroupContentArea(this));
        group.el._jsPlumbParentGroup = this;
        this.children.push(group);
        this.instance._appendElement(group.el, this.instance.getGroupContentArea(this));
        group.group = this;
        var newPosition = {
          x: elpos.x - cpos.x,
          y: elpos.y - cpos.y
        };
        this.instance.setPosition(group.el, newPosition);
        this.instance.fire(EVENT_NESTED_GROUP_ADDED, {
          parent: this,
          child: group
        });
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "removeGroup",
    value: function removeGroup(group) {
      if (group.group === this) {
        var jel = group.el;
        var d = this.instance.getGroupContentArea(this);
        if (d === jel.parentNode) {
          d.removeChild(group.el);
        }
        var groupElId = this.instance.getId(group.el);
        var entry = this.instance.getManagedElements()[groupElId];
        if (entry) {
          delete entry.group;
        }
        this.children = this.children.filter(function (cg) {
          return cg.id !== group.id;
        });
        delete group.group;
        delete jel._jsPlumbParentGroup;
        this.instance.fire(EVENT_NESTED_GROUP_REMOVED, {
          parent: this,
          child: group
        });
      }
    }
  }, {
    key: "getGroups",
    value: function getGroups() {
      return this.children.filter(function (cg) {
        return cg.constructor === UIGroup;
      });
    }
  }, {
    key: "getNodes",
    value: function getNodes() {
      return this.children.filter(function (cg) {
        return cg.constructor === UINode;
      });
    }
  }, {
    key: "collapseParent",
    get: function get() {
      var cg = null;
      if (this.group == null) {
        return null;
      } else {
        var g = this.group;
        while (g != null) {
          if (g.collapsed) {
            cg = g;
          }
          g = g.group;
        }
        return cg;
      }
    }
  }]);
  return UIGroup;
}(UINode);

var GroupManager = function () {
  function GroupManager(instance) {
    var _this = this;
    _classCallCheck(this, GroupManager);
    this.instance = instance;
    _defineProperty(this, "groupMap", {});
    _defineProperty(this, "_connectionSourceMap", {});
    _defineProperty(this, "_connectionTargetMap", {});
    instance.bind(EVENT_INTERNAL_CONNECTION, function (p) {
      var sourceGroup = _this.getGroupFor(p.source);
      var targetGroup = _this.getGroupFor(p.target);
      if (sourceGroup != null && targetGroup != null && sourceGroup === targetGroup) {
        _this._connectionSourceMap[p.connection.id] = sourceGroup;
        _this._connectionTargetMap[p.connection.id] = sourceGroup;
        suggest(sourceGroup.connections.internal, p.connection);
      } else {
        if (sourceGroup != null) {
          if (p.target._jsPlumbGroup === sourceGroup) {
            suggest(sourceGroup.connections.internal, p.connection);
          } else {
            suggest(sourceGroup.connections.source, p.connection);
          }
          _this._connectionSourceMap[p.connection.id] = sourceGroup;
        }
        if (targetGroup != null) {
          if (p.source._jsPlumbGroup === targetGroup) {
            suggest(targetGroup.connections.internal, p.connection);
          } else {
            suggest(targetGroup.connections.target, p.connection);
          }
          _this._connectionTargetMap[p.connection.id] = targetGroup;
        }
      }
    });
    instance.bind(EVENT_INTERNAL_CONNECTION_DETACHED, function (p) {
      _this._cleanupDetachedConnection(p.connection);
    });
    instance.bind(EVENT_CONNECTION_MOVED, function (p) {
      var originalElement = p.originalEndpoint.element,
          originalGroup = _this.getGroupFor(originalElement),
          newEndpoint = p.connection.endpoints[p.index],
          newElement = newEndpoint.element,
          newGroup = _this.getGroupFor(newElement),
          connMap = p.index === 0 ? _this._connectionSourceMap : _this._connectionTargetMap,
          otherConnMap = p.index === 0 ? _this._connectionTargetMap : _this._connectionSourceMap;
      if (newGroup != null) {
        connMap[p.connection.id] = newGroup;
        if (p.connection.source === p.connection.target) {
          otherConnMap[p.connection.id] = newGroup;
        }
      } else {
        delete connMap[p.connection.id];
        if (p.connection.source === p.connection.target) {
          delete otherConnMap[p.connection.id];
        }
      }
      if (originalGroup != null) {
        _this._updateConnectionsForGroup(originalGroup);
      }
      if (newGroup != null) {
        _this._updateConnectionsForGroup(newGroup);
      }
    });
  }
  _createClass(GroupManager, [{
    key: "_cleanupDetachedConnection",
    value: function _cleanupDetachedConnection(conn) {
      conn.proxies.length = 0;
      var group = this._connectionSourceMap[conn.id],
          f;
      if (group != null) {
        f = function f(c) {
          return c.id === conn.id;
        };
        removeWithFunction(group.connections.source, f);
        removeWithFunction(group.connections.target, f);
        removeWithFunction(group.connections.internal, f);
        delete this._connectionSourceMap[conn.id];
      }
      group = this._connectionTargetMap[conn.id];
      if (group != null) {
        f = function f(c) {
          return c.id === conn.id;
        };
        removeWithFunction(group.connections.source, f);
        removeWithFunction(group.connections.target, f);
        removeWithFunction(group.connections.internal, f);
        delete this._connectionTargetMap[conn.id];
      }
    }
  }, {
    key: "addGroup",
    value: function addGroup(params) {
      var jel = params.el;
      if (this.groupMap[params.id] != null) {
        throw new Error("cannot create Group [" + params.id + "]; a Group with that ID exists");
      }
      if (jel._isJsPlumbGroup != null) {
        throw new Error("cannot create Group [" + params.id + "]; the given element is already a Group");
      }
      var group = new UIGroup(this.instance, params.el, params);
      this.groupMap[group.id] = group;
      if (params.collapsed) {
        this.collapseGroup(group);
      }
      this.instance.manage(group.el);
      this.instance.addClass(group.el, CLASS_GROUP_EXPANDED);
      group.manager = this;
      this._updateConnectionsForGroup(group);
      this.instance.fire(EVENT_GROUP_ADDED, {
        group: group
      });
      return group;
    }
  }, {
    key: "getGroup",
    value: function getGroup(groupId) {
      var group = groupId;
      if (isString(groupId)) {
        group = this.groupMap[groupId];
        if (group == null) {
          throw new Error("No such group [" + groupId + "]");
        }
      }
      return group;
    }
  }, {
    key: "getGroupFor",
    value: function getGroupFor(el) {
      var jel = el;
      var c = this.instance.getContainer();
      var abort = false,
          g = null;
      while (!abort) {
        if (jel == null || jel === c) {
          abort = true;
        } else {
          if (jel._jsPlumbParentGroup) {
            g = jel._jsPlumbParentGroup;
            abort = true;
          } else {
            jel = jel.parentNode;
          }
        }
      }
      return g;
    }
  }, {
    key: "getGroups",
    value: function getGroups() {
      var g = [];
      for (var key in this.groupMap) {
        g.push(this.groupMap[key]);
      }
      return g;
    }
  }, {
    key: "removeGroup",
    value: function removeGroup(group, deleteMembers, manipulateView, doNotFireEvent) {
      var _this2 = this;
      var actualGroup = this.getGroup(group);
      this.expandGroup(actualGroup, true);
      var newPositions = {};
      forEach(actualGroup.children, function (uiNode) {
        var entry = _this2.instance.getManagedElements()[_this2.instance.getId(uiNode.el)];
        if (entry) {
          delete entry.group;
        }
      });
      if (deleteMembers) {
        forEach(actualGroup.getGroups(), function (cg) {
          return _this2.removeGroup(cg, deleteMembers, manipulateView);
        });
        actualGroup.removeAll(manipulateView, doNotFireEvent);
      } else {
        if (actualGroup.group) {
          forEach(actualGroup.children, function (c) {
            return actualGroup.group.add(c.el);
          });
        }
        newPositions = actualGroup.orphanAll();
      }
      if (actualGroup.group) {
        actualGroup.group.removeGroup(actualGroup);
      }
      this.instance.unmanage(actualGroup.el, true);
      delete this.groupMap[actualGroup.id];
      this.instance.fire(EVENT_GROUP_REMOVED, {
        group: actualGroup
      });
      return newPositions;
    }
  }, {
    key: "removeAllGroups",
    value: function removeAllGroups(deleteMembers, manipulateView, doNotFireEvent) {
      for (var _g in this.groupMap) {
        this.removeGroup(this.groupMap[_g], deleteMembers, manipulateView, doNotFireEvent);
      }
    }
  }, {
    key: "forEach",
    value: function forEach(f) {
      for (var key in this.groupMap) {
        f(this.groupMap[key]);
      }
    }
  }, {
    key: "orphan",
    value: function orphan(el, doNotTransferToAncestor) {
      var jel = el;
      if (jel._jsPlumbParentGroup) {
        var currentParent = jel._jsPlumbParentGroup;
        var positionRelativeToGroup = this.instance.getOffset(jel);
        var id = this.instance.getId(jel);
        var pos = this.instance.getOffset(el);
        jel.parentNode.removeChild(jel);
        if (doNotTransferToAncestor !== true && currentParent.group) {
          pos.x += positionRelativeToGroup.x;
          pos.y += positionRelativeToGroup.y;
          this.instance.getGroupContentArea(currentParent.group).appendChild(el);
        } else {
          this.instance._appendElement(el, this.instance.getContainer());
        }
        this.instance.setPosition(el, pos);
        delete jel._jsPlumbParentGroup;
        return {
          id: id,
          pos: pos
        };
      }
    }
  }, {
    key: "_updateConnectionsForGroup",
    value: function _updateConnectionsForGroup(group) {
      var _this3 = this;
      group.connections.source.length = 0;
      group.connections.target.length = 0;
      group.connections.internal.length = 0;
      var members = group.children.slice().map(function (cn) {
        return cn.el;
      });
      var childMembers = [];
      forEach(members, function (member) {
        Array.prototype.push.apply(childMembers, _this3.instance.getSelector(member, SELECTOR_MANAGED_ELEMENT));
      });
      Array.prototype.push.apply(members, childMembers);
      if (members.length > 0) {
        var c1 = this.instance.getConnections({
          source: members,
          scope: WILDCARD
        }, true);
        var c2 = this.instance.getConnections({
          target: members,
          scope: WILDCARD
        }, true);
        var processed = {};
        var gs, gt;
        var oneSet = function oneSet(c) {
          for (var i = 0; i < c.length; i++) {
            if (processed[c[i].id]) {
              continue;
            }
            processed[c[i].id] = true;
            gs = _this3.getGroupFor(c[i].source);
            gt = _this3.getGroupFor(c[i].target);
            if (c[i].source === group.el && gt === group || c[i].target === group.el && gs === group) {
              group.connections.internal.push(c[i]);
            } else if (gs === group) {
              if (gt !== group) {
                group.connections.source.push(c[i]);
              } else {
                group.connections.internal.push(c[i]);
              }
              _this3._connectionSourceMap[c[i].id] = group;
            } else if (gt === group) {
              group.connections.target.push(c[i]);
              _this3._connectionTargetMap[c[i].id] = group;
            }
          }
        };
        oneSet(c1);
        oneSet(c2);
      }
    }
  }, {
    key: "_collapseConnection",
    value: function _collapseConnection(conn, index, group) {
      var otherEl = conn.endpoints[index === 0 ? 1 : 0].element;
      if (otherEl._jsPlumbParentGroup && !otherEl._jsPlumbParentGroup.proxied && otherEl._jsPlumbParentGroup.collapsed) {
        return false;
      }
      var es = conn.endpoints[0].element,
          esg = es._jsPlumbParentGroup,
          esgcp = esg != null ? esg.collapseParent || esg : null,
          et = conn.endpoints[1].element,
          etg = et._jsPlumbParentGroup,
          etgcp = etg != null ? etg.collapseParent || etg : null;
      if (esgcp == null || etgcp == null || esgcp.id !== etgcp.id) {
        var groupEl = group.el;
            this.instance.getId(groupEl);
        this.instance.proxyConnection(conn, index, groupEl,
        function (conn, index) {
          return group.getEndpoint(conn, index);
        }, function (conn, index) {
          return group.getAnchor(conn, index);
        });
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "_expandConnection",
    value: function _expandConnection(c, index, group) {
      this.instance.unproxyConnection(c, index);
    }
  }, {
    key: "isElementDescendant",
    value: function isElementDescendant(el, parentEl) {
      var c = this.instance.getContainer();
      var abort = false;
      while (!abort) {
        if (el == null || el === c) {
          return false;
        } else {
          if (el === parentEl) {
            return true;
          } else {
            el = el.parentNode;
          }
        }
      }
    }
  }, {
    key: "collapseGroup",
    value: function collapseGroup(group) {
      var _this4 = this;
      var actualGroup = this.getGroup(group);
      if (actualGroup == null || actualGroup.collapsed) {
        return;
      }
      var groupEl = actualGroup.el;
      if (actualGroup.collapseParent == null) {
        this.instance.setGroupVisible(actualGroup, false);
        actualGroup.collapsed = true;
        this.instance.removeClass(groupEl, CLASS_GROUP_EXPANDED);
        this.instance.addClass(groupEl, CLASS_GROUP_COLLAPSED);
        if (actualGroup.proxied) {
          var collapsedConnectionIds = new Set();
          var _collapseSet = function _collapseSet(conns, index) {
            for (var i = 0; i < conns.length; i++) {
              var c = conns[i];
              if (_this4._collapseConnection(c, index, actualGroup) === true) {
                collapsedConnectionIds.add(c.id);
              }
            }
          };
          _collapseSet(actualGroup.connections.source, 0);
          _collapseSet(actualGroup.connections.target, 1);
          forEach(actualGroup.getGroups(), function (cg) {
            _this4.cascadeCollapse(actualGroup, cg, collapsedConnectionIds);
          });
        }
        this.instance.revalidate(groupEl);
        this.repaintGroup(actualGroup);
        this.instance.fire(EVENT_GROUP_COLLAPSE, {
          group: actualGroup
        });
      } else {
        actualGroup.collapsed = true;
        this.instance.removeClass(groupEl, CLASS_GROUP_EXPANDED);
        this.instance.addClass(groupEl, CLASS_GROUP_COLLAPSED);
      }
    }
  }, {
    key: "cascadeCollapse",
    value: function cascadeCollapse(collapsedGroup, targetGroup, collapsedIds) {
      var _this5 = this;
      if (collapsedGroup.proxied) {
        var _collapseSet = function _collapseSet(conns, index) {
          for (var i = 0; i < conns.length; i++) {
            var c = conns[i];
            if (!collapsedIds.has(c.id)) {
              if (_this5._collapseConnection(c, index, collapsedGroup) === true) {
                collapsedIds.add(c.id);
              }
            }
          }
        };
        _collapseSet(targetGroup.connections.source, 0);
        _collapseSet(targetGroup.connections.target, 1);
      }
      forEach(targetGroup.getGroups(), function (cg) {
        _this5.cascadeCollapse(collapsedGroup, cg, collapsedIds);
      });
    }
  }, {
    key: "expandGroup",
    value: function expandGroup(group, doNotFireEvent) {
      var _this6 = this;
      var actualGroup = this.getGroup(group);
      if (actualGroup == null) {
        return;
      }
      var groupEl = actualGroup.el;
      if (actualGroup.collapseParent == null) {
        this.instance.setGroupVisible(actualGroup, true);
        actualGroup.collapsed = false;
        this.instance.addClass(groupEl, CLASS_GROUP_EXPANDED);
        this.instance.removeClass(groupEl, CLASS_GROUP_COLLAPSED);
        if (actualGroup.proxied) {
          var _expandSet = function _expandSet(conns, index) {
            for (var i = 0; i < conns.length; i++) {
              var c = conns[i];
              _this6._expandConnection(c, index, actualGroup);
            }
          };
          _expandSet(actualGroup.connections.source, 0);
          _expandSet(actualGroup.connections.target, 1);
          var _expandNestedGroup = function _expandNestedGroup(group, ignoreCollapsedStateForNested) {
            if (ignoreCollapsedStateForNested || group.collapsed) {
              var _collapseSet = function _collapseSet(conns, index) {
                for (var i = 0; i < conns.length; i++) {
                  var c = conns[i];
                  _this6._collapseConnection(c, index, group.collapseParent || group);
                }
              };
              _collapseSet(group.connections.source, 0);
              _collapseSet(group.connections.target, 1);
              forEach(group.connections.internal, function (c) {
                return c.setVisible(false);
              });
              forEach(group.getGroups(), function (g) {
                return _expandNestedGroup(g, true);
              });
            } else {
              _this6.expandGroup(group, true);
            }
          };
          forEach(actualGroup.getGroups(), _expandNestedGroup);
        }
        this.instance.revalidate(groupEl);
        this.repaintGroup(actualGroup);
        if (!doNotFireEvent) {
          this.instance.fire(EVENT_GROUP_EXPAND, {
            group: actualGroup
          });
        }
      } else {
        actualGroup.collapsed = false;
        this.instance.addClass(groupEl, CLASS_GROUP_EXPANDED);
        this.instance.removeClass(groupEl, CLASS_GROUP_COLLAPSED);
      }
    }
  }, {
    key: "toggleGroup",
    value: function toggleGroup(group) {
      group = this.getGroup(group);
      if (group != null) {
        if (group.collapsed) {
          this.expandGroup(group);
        } else {
          this.collapseGroup(group);
        }
      }
    }
  }, {
    key: "repaintGroup",
    value: function repaintGroup(group) {
      var actualGroup = this.getGroup(group);
      var m = actualGroup.children;
      for (var i = 0; i < m.length; i++) {
        this.instance.revalidate(m[i].el);
      }
    }
  }, {
    key: "addToGroup",
    value: function addToGroup(group, doNotFireEvent) {
      var _this7 = this;
      var actualGroup = this.getGroup(group);
      if (actualGroup) {
        var groupEl = actualGroup.el;
        var _one = function _one(el) {
          var jel = el;
          var isGroup = jel._isJsPlumbGroup != null,
              droppingGroup = jel._jsPlumbGroup;
          var currentGroup = jel._jsPlumbParentGroup;
          if (currentGroup !== actualGroup) {
            var entry = _this7.instance.manage(el);
            var elpos = _this7.instance.getOffset(el);
            var cpos = actualGroup.collapsed ? _this7.instance.getOffsetRelativeToRoot(groupEl) : _this7.instance.getOffset(_this7.instance.getGroupContentArea(actualGroup));
            entry.group = actualGroup.elId;
            if (currentGroup != null) {
              currentGroup.remove(el, false, doNotFireEvent, false, actualGroup);
              _this7._updateConnectionsForGroup(currentGroup);
            }
            if (isGroup) {
              actualGroup.addGroup(droppingGroup);
            } else {
              actualGroup.add(el, doNotFireEvent);
            }
            var handleDroppedConnections = function handleDroppedConnections(list, index) {
              var oidx = index === 0 ? 1 : 0;
              list.each(function (c) {
                c.setVisible(false);
                if (c.endpoints[oidx].element._jsPlumbGroup === actualGroup) {
                  c.endpoints[oidx].setVisible(false);
                  _this7._expandConnection(c, oidx, actualGroup);
                } else {
                  c.endpoints[index].setVisible(false);
                  _this7._collapseConnection(c, index, actualGroup);
                }
              });
            };
            if (actualGroup.collapsed) {
              handleDroppedConnections(_this7.instance.select({
                source: el
              }), 0);
              handleDroppedConnections(_this7.instance.select({
                target: el
              }), 1);
            }
            _this7.instance.getId(el);
            var newPosition = {
              x: elpos.x - cpos.x,
              y: elpos.y - cpos.y
            };
            _this7.instance.setPosition(el, newPosition);
            _this7._updateConnectionsForGroup(actualGroup);
            _this7.instance.revalidate(el);
            if (!doNotFireEvent) {
              var p = {
                group: actualGroup,
                el: el,
                pos: newPosition
              };
              if (currentGroup) {
                p.sourceGroup = currentGroup;
              }
              _this7.instance.fire(EVENT_GROUP_MEMBER_ADDED, p);
            }
          }
        };
        for (var _len = arguments.length, el = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          el[_key - 2] = arguments[_key];
        }
        forEach(el, _one);
      }
    }
  }, {
    key: "removeFromGroup",
    value: function removeFromGroup(group, doNotFireEvent) {
      var _this8 = this;
      var actualGroup = this.getGroup(group);
      if (actualGroup) {
        var _one = function _one(_el) {
          if (actualGroup.collapsed) {
            var _expandSet = function _expandSet(conns, index) {
              for (var i = 0; i < conns.length; i++) {
                var c = conns[i];
                if (c.proxies) {
                  for (var j = 0; j < c.proxies.length; j++) {
                    if (c.proxies[j] != null) {
                      var proxiedElement = c.proxies[j].originalEp.element;
                      if (proxiedElement === _el || _this8.isElementDescendant(proxiedElement, _el)) {
                        _this8._expandConnection(c, index, actualGroup);
                      }
                    }
                  }
                }
              }
            };
            _expandSet(actualGroup.connections.source.slice(), 0);
            _expandSet(actualGroup.connections.target.slice(), 1);
          }
          actualGroup.remove(_el, null, doNotFireEvent);
          var entry = _this8.instance.getManagedElements()[_this8.instance.getId(_el)];
          if (entry) {
            delete entry.group;
          }
        };
        for (var _len2 = arguments.length, el = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          el[_key2 - 2] = arguments[_key2];
        }
        forEach(el, _one);
      }
    }
  }, {
    key: "getAncestors",
    value: function getAncestors(group) {
      var ancestors = [];
      var p = group.group;
      while (p != null) {
        ancestors.push(p);
        p = p.group;
      }
      return ancestors;
    }
  }, {
    key: "isAncestor",
    value: function isAncestor(group, possibleAncestor) {
      if (group == null || possibleAncestor == null) {
        return false;
      }
      return this.getAncestors(group).indexOf(possibleAncestor) !== -1;
    }
  }, {
    key: "getDescendants",
    value: function getDescendants(group) {
      var d = [];
      var _one = function _one(g) {
        var childGroups = g.getGroups();
        d.push.apply(d, _toConsumableArray(childGroups));
        forEach(childGroups, _one);
      };
      _one(group);
      return d;
    }
  }, {
    key: "isDescendant",
    value: function isDescendant(possibleDescendant, ancestor) {
      if (possibleDescendant == null || ancestor == null) {
        return false;
      }
      return this.getDescendants(ancestor).indexOf(possibleDescendant) !== -1;
    }
  }, {
    key: "reset",
    value: function reset() {
      this._connectionSourceMap = {};
      this._connectionTargetMap = {};
      this.groupMap = {};
    }
  }]);
  return GroupManager;
}();

var SelectionBase = function () {
  function SelectionBase(instance, entries) {
    _classCallCheck(this, SelectionBase);
    this.instance = instance;
    this.entries = entries;
  }
  _createClass(SelectionBase, [{
    key: "length",
    get: function get() {
      return this.entries.length;
    }
  }, {
    key: "each",
    value: function each(handler) {
      forEach(this.entries, function (e) {
        return handler(e);
      });
      return this;
    }
  }, {
    key: "get",
    value: function get(index) {
      return this.entries[index];
    }
  }, {
    key: "addClass",
    value: function addClass(clazz, cascade) {
      this.each(function (c) {
        return c.addClass(clazz, cascade);
      });
      return this;
    }
  }, {
    key: "removeClass",
    value: function removeClass(clazz, cascade) {
      this.each(function (c) {
        return c.removeClass(clazz, cascade);
      });
      return this;
    }
  }, {
    key: "removeAllOverlays",
    value: function removeAllOverlays() {
      this.each(function (c) {
        return c.removeAllOverlays();
      });
      return this;
    }
  }, {
    key: "setLabel",
    value: function setLabel(label) {
      this.each(function (c) {
        return c.setLabel(label);
      });
      return this;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.entries.length = 0;
      return this;
    }
  }, {
    key: "map",
    value: function map(fn) {
      var a = [];
      this.each(function (e) {
        return a.push(fn(e));
      });
      return a;
    }
  }, {
    key: "addOverlay",
    value: function addOverlay(spec) {
      this.each(function (c) {
        return c.addOverlay(spec);
      });
      return this;
    }
  }, {
    key: "removeOverlay",
    value: function removeOverlay(id) {
      this.each(function (c) {
        return c.removeOverlay(id);
      });
      return this;
    }
  }, {
    key: "removeOverlays",
    value: function removeOverlays() {
      this.each(function (c) {
        return c.removeOverlays();
      });
      return this;
    }
  }, {
    key: "showOverlay",
    value: function showOverlay(id) {
      this.each(function (c) {
        return c.showOverlay(id);
      });
      return this;
    }
  }, {
    key: "hideOverlay",
    value: function hideOverlay(id) {
      this.each(function (c) {
        return c.hideOverlay(id);
      });
      return this;
    }
  }, {
    key: "setPaintStyle",
    value: function setPaintStyle(style) {
      this.each(function (c) {
        return c.setPaintStyle(style);
      });
      return this;
    }
  }, {
    key: "setHoverPaintStyle",
    value: function setHoverPaintStyle(style) {
      this.each(function (c) {
        return c.setHoverPaintStyle(style);
      });
      return this;
    }
  }, {
    key: "setSuspendEvents",
    value: function setSuspendEvents(suspend) {
      this.each(function (c) {
        return c.setSuspendEvents(suspend);
      });
      return this;
    }
  }, {
    key: "setParameter",
    value: function setParameter(name, value) {
      this.each(function (c) {
        return c.parameters[name] = value;
      });
      return this;
    }
  }, {
    key: "setParameters",
    value: function setParameters(p) {
      this.each(function (c) {
        return c.parameters = p;
      });
      return this;
    }
  }, {
    key: "setVisible",
    value: function setVisible(v) {
      this.each(function (c) {
        return c.setVisible(v);
      });
      return this;
    }
  }, {
    key: "addType",
    value: function addType(name) {
      this.each(function (c) {
        return c.addType(name);
      });
      return this;
    }
  }, {
    key: "toggleType",
    value: function toggleType(name) {
      this.each(function (c) {
        return c.toggleType(name);
      });
      return this;
    }
  }, {
    key: "removeType",
    value: function removeType(name) {
      this.each(function (c) {
        return c.removeType(name);
      });
      return this;
    }
  }, {
    key: "bind",
    value: function bind(evt, handler) {
      this.each(function (c) {
        return c.bind(evt, handler);
      });
      return this;
    }
  }, {
    key: "unbind",
    value: function unbind(evt, handler) {
      this.each(function (c) {
        return c.unbind(evt, handler);
      });
      return this;
    }
  }, {
    key: "setHover",
    value: function setHover(h) {
      var _this = this;
      this.each(function (c) {
        return _this.instance.setHover(c, h);
      });
      return this;
    }
  }]);
  return SelectionBase;
}();

var EndpointSelection = function (_SelectionBase) {
  _inherits(EndpointSelection, _SelectionBase);
  var _super = _createSuper(EndpointSelection);
  function EndpointSelection() {
    _classCallCheck(this, EndpointSelection);
    return _super.apply(this, arguments);
  }
  _createClass(EndpointSelection, [{
    key: "setEnabled",
    value: function setEnabled(e) {
      this.each(function (ep) {
        return ep.enabled = e;
      });
      return this;
    }
  }, {
    key: "setAnchor",
    value: function setAnchor(a) {
      this.each(function (ep) {
        return ep.setAnchor(a);
      });
      return this;
    }
  }, {
    key: "deleteEveryConnection",
    value: function deleteEveryConnection() {
      this.each(function (ep) {
        return ep.deleteEveryConnection();
      });
      return this;
    }
  }, {
    key: "deleteAll",
    value: function deleteAll() {
      var _this = this;
      this.each(function (ep) {
        return _this.instance.deleteEndpoint(ep);
      });
      this.clear();
      return this;
    }
  }]);
  return EndpointSelection;
}(SelectionBase);

var ConnectionSelection = function (_SelectionBase) {
  _inherits(ConnectionSelection, _SelectionBase);
  var _super = _createSuper(ConnectionSelection);
  function ConnectionSelection() {
    _classCallCheck(this, ConnectionSelection);
    return _super.apply(this, arguments);
  }
  _createClass(ConnectionSelection, [{
    key: "setDetachable",
    value: function setDetachable(d) {
      this.each(function (c) {
        return c.setDetachable(d);
      });
      return this;
    }
  }, {
    key: "setReattach",
    value: function setReattach(d) {
      this.each(function (c) {
        return c.setReattach(d);
      });
      return this;
    }
  }, {
    key: "setConnector",
    value: function setConnector(spec) {
      this.each(function (c) {
        return c.setConnector(spec);
      });
      return this;
    }
  }, {
    key: "deleteAll",
    value: function deleteAll() {
      var _this = this;
      this.each(function (c) {
        return _this.instance.deleteConnection(c);
      });
      this.clear();
    }
  }, {
    key: "repaint",
    value: function repaint() {
      var _this2 = this;
      this.each(function (c) {
        return _this2.instance.paintConnection(c);
      });
      return this;
    }
  }]);
  return ConnectionSelection;
}(SelectionBase);

var Transaction = function Transaction() {
  _classCallCheck(this, Transaction);
  _defineProperty(this, "affectedElements", new Set());
};
function EMPTY_POSITION() {
  return {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    r: 0,
    c: {
      x: 0,
      y: 0
    },
    x2: 0,
    y2: 0,
    t: {
      x: 0,
      y: 0,
      c: {
        x: 0,
        y: 0
      },
      w: 0,
      h: 0,
      r: 0,
      x2: 0,
      y2: 0,
      cr: 0,
      sr: 0
    },
    dirty: true
  };
}
function rotate(x, y, w, h, r) {
  var center = {
    x: x + w / 2,
    y: y + h / 2
  },
      cr = Math.cos(r / 360 * Math.PI * 2),
      sr = Math.sin(r / 360 * Math.PI * 2),
      _point = function _point(x, y) {
    return {
      x: center.x + Math.round((x - center.x) * cr - (y - center.y) * sr),
      y: center.y + Math.round((y - center.y) * cr - (x - center.x) * sr)
    };
  };
  var p1 = _point(x, y),
      p2 = _point(x + w, y),
      p3 = _point(x + w, y + h),
      p4 = _point(x, y + h),
      c = _point(x + w / 2, y + h / 2);
  var xmin = Math.min(p1.x, p2.x, p3.x, p4.x),
      xmax = Math.max(p1.x, p2.x, p3.x, p4.x),
      ymin = Math.min(p1.y, p2.y, p3.y, p4.y),
      ymax = Math.max(p1.y, p2.y, p3.y, p4.y);
  return {
    x: xmin,
    y: ymin,
    w: xmax - xmin,
    h: ymax - ymin,
    c: c,
    r: r,
    x2: xmax,
    y2: ymax,
    cr: cr,
    sr: sr
  };
}
var entryComparator = function entryComparator(value, arrayEntry) {
  var c = 0;
  if (arrayEntry[1] > value[1]) {
    c = -1;
  } else if (arrayEntry[1] < value[1]) {
    c = 1;
  }
  return c;
};
var reverseEntryComparator = function reverseEntryComparator(value, arrayEntry) {
  return entryComparator(value, arrayEntry) * -1;
};
function _updateElementIndex(id, value, array, sortDescending) {
  insertSorted([id, value], array, entryComparator, sortDescending);
}
function _clearElementIndex(id, array) {
  var idx = findWithFunction(array, function (entry) {
    return entry[0] === id;
  });
  if (idx > -1) {
    array.splice(idx, 1);
  }
}
var Viewport = function (_EventGenerator) {
  _inherits(Viewport, _EventGenerator);
  var _super = _createSuper(Viewport);
  function Viewport(instance) {
    var _this;
    _classCallCheck(this, Viewport);
    _this = _super.call(this);
    _this.instance = instance;
    _defineProperty(_assertThisInitialized(_this), "_currentTransaction", null);
    _defineProperty(_assertThisInitialized(_this), "_sortedElements", {
      xmin: [],
      xmax: [],
      ymin: [],
      ymax: []
    });
    _defineProperty(_assertThisInitialized(_this), "_elementMap", new Map());
    _defineProperty(_assertThisInitialized(_this), "_transformedElementMap", new Map());
    _defineProperty(_assertThisInitialized(_this), "_bounds", {
      minx: 0,
      maxx: 0,
      miny: 0,
      maxy: 0
    });
    return _this;
  }
  _createClass(Viewport, [{
    key: "_updateBounds",
    value: function _updateBounds(id, updatedElement, doNotRecalculateBounds) {
      if (updatedElement != null) {
        _clearElementIndex(id, this._sortedElements.xmin);
        _clearElementIndex(id, this._sortedElements.xmax);
        _clearElementIndex(id, this._sortedElements.ymin);
        _clearElementIndex(id, this._sortedElements.ymax);
        _updateElementIndex(id, updatedElement.t.x, this._sortedElements.xmin, false);
        _updateElementIndex(id, updatedElement.t.x + updatedElement.t.w, this._sortedElements.xmax, true);
        _updateElementIndex(id, updatedElement.t.y, this._sortedElements.ymin, false);
        _updateElementIndex(id, updatedElement.t.y + updatedElement.t.h, this._sortedElements.ymax, true);
        if (doNotRecalculateBounds !== true) {
          this._recalculateBounds();
        }
      }
    }
  }, {
    key: "_recalculateBounds",
    value: function _recalculateBounds() {
      this._bounds.minx = this._sortedElements.xmin.length > 0 ? this._sortedElements.xmin[0][1] : 0;
      this._bounds.maxx = this._sortedElements.xmax.length > 0 ? this._sortedElements.xmax[0][1] : 0;
      this._bounds.miny = this._sortedElements.ymin.length > 0 ? this._sortedElements.ymin[0][1] : 0;
      this._bounds.maxy = this._sortedElements.ymax.length > 0 ? this._sortedElements.ymax[0][1] : 0;
    }
  }, {
    key: "recomputeBounds",
    value: function recomputeBounds() {
      var _this2 = this;
      this._sortedElements.xmin.length = 0;
      this._sortedElements.xmax.length = 0;
      this._sortedElements.ymin.length = 0;
      this._sortedElements.ymax.length = 0;
      this._elementMap.forEach(function (vp, id) {
        _this2._sortedElements.xmin.push([id, vp.t.x]);
        _this2._sortedElements.xmax.push([id, vp.t.x + vp.t.w]);
        _this2._sortedElements.ymin.push([id, vp.t.y]);
        _this2._sortedElements.ymax.push([id, vp.t.y + vp.t.h]);
      });
      this._sortedElements.xmin.sort(entryComparator);
      this._sortedElements.ymin.sort(entryComparator);
      this._sortedElements.xmax.sort(reverseEntryComparator);
      this._sortedElements.ymax.sort(reverseEntryComparator);
      this._recalculateBounds();
    }
  }, {
    key: "_finaliseUpdate",
    value: function _finaliseUpdate(id, e, doNotRecalculateBounds) {
      e.t = rotate(e.x, e.y, e.w, e.h, e.r);
      this._transformedElementMap.set(id, e.t);
      if (doNotRecalculateBounds !== true) {
        this._updateBounds(id, e, doNotRecalculateBounds);
      }
    }
  }, {
    key: "shouldFireEvent",
    value: function shouldFireEvent(event, value, originalEvent) {
      return true;
    }
  }, {
    key: "startTransaction",
    value: function startTransaction() {
      if (this._currentTransaction != null) {
        throw new Error("Viewport: cannot start transaction; a transaction is currently active.");
      }
      this._currentTransaction = new Transaction();
    }
  }, {
    key: "endTransaction",
    value: function endTransaction() {
      var _this3 = this;
      if (this._currentTransaction != null) {
        this._currentTransaction.affectedElements.forEach(function (id) {
          var entry = _this3.getPosition(id);
          _this3._finaliseUpdate(id, entry, true);
        });
        this.recomputeBounds();
        this._currentTransaction = null;
      }
    }
  }, {
    key: "updateElements",
    value: function updateElements(entries) {
      var _this4 = this;
      forEach(entries, function (e) {
        return _this4.updateElement(e.id, e.x, e.y, e.width, e.height, e.rotation);
      });
    }
  }, {
    key: "updateElement",
    value: function updateElement(id, x, y, width, height, rotation, doNotRecalculateBounds) {
      var e = getsert(this._elementMap, id, EMPTY_POSITION);
      e.dirty = x == null && e.x == null || y == null && e.y == null || width == null && e.w == null || height == null && e.h == null;
      if (x != null) {
        e.x = x;
      }
      if (y != null) {
        e.y = y;
      }
      if (width != null) {
        e.w = width;
      }
      if (height != null) {
        e.h = height;
      }
      if (rotation != null) {
        e.r = rotation || 0;
      }
      e.c.x = e.x + e.w / 2;
      e.c.y = e.y + e.h / 2;
      e.x2 = e.x + e.w;
      e.y2 = e.y + e.h;
      if (this._currentTransaction == null) {
        this._finaliseUpdate(id, e, doNotRecalculateBounds);
      } else {
        this._currentTransaction.affectedElements.add(id);
      }
      return e;
    }
  }, {
    key: "refreshElement",
    value: function refreshElement(elId, doNotRecalculateBounds) {
      var me = this.instance.getManagedElements();
      var s = me[elId] ? me[elId].el : null;
      if (s != null) {
        var size = this.getSize(s);
        var offset = this.getOffset(s);
        return this.updateElement(elId, offset.x, offset.y, size.w, size.h, null, doNotRecalculateBounds);
      } else {
        return null;
      }
    }
  }, {
    key: "getSize",
    value: function getSize(el) {
      return this.instance.getSize(el);
    }
  }, {
    key: "getOffset",
    value: function getOffset(el) {
      return this.instance.getOffset(el);
    }
  }, {
    key: "registerElement",
    value: function registerElement(id, doNotRecalculateBounds) {
      return this.updateElement(id, 0, 0, 0, 0, 0, doNotRecalculateBounds);
    }
  }, {
    key: "addElement",
    value: function addElement(id, x, y, width, height, rotation) {
      return this.updateElement(id, x, y, width, height, rotation);
    }
  }, {
    key: "rotateElement",
    value: function rotateElement(id, rotation) {
      var e = getsert(this._elementMap, id, EMPTY_POSITION);
      e.r = rotation || 0;
      this._finaliseUpdate(id, e);
      return e;
    }
  }, {
    key: "getBoundsWidth",
    value: function getBoundsWidth() {
      return this._bounds.maxx - this._bounds.minx;
    }
  }, {
    key: "getBoundsHeight",
    value: function getBoundsHeight() {
      return this._bounds.maxy - this._bounds.miny;
    }
  }, {
    key: "getX",
    value: function getX() {
      return this._bounds.minx;
    }
  }, {
    key: "getY",
    value: function getY() {
      return this._bounds.miny;
    }
  }, {
    key: "setSize",
    value: function setSize(id, w, h) {
      if (this._elementMap.has(id)) {
        return this.updateElement(id, null, null, w, h, null);
      }
    }
  }, {
    key: "setPosition",
    value: function setPosition(id, x, y) {
      if (this._elementMap.has(id)) {
        return this.updateElement(id, x, y, null, null, null);
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      this._sortedElements.xmin.length = 0;
      this._sortedElements.xmax.length = 0;
      this._sortedElements.ymin.length = 0;
      this._sortedElements.ymax.length = 0;
      this._elementMap.clear();
      this._transformedElementMap.clear();
      this._recalculateBounds();
    }
  }, {
    key: "remove",
    value: function remove(id) {
      _clearElementIndex(id, this._sortedElements.xmin);
      _clearElementIndex(id, this._sortedElements.xmax);
      _clearElementIndex(id, this._sortedElements.ymin);
      _clearElementIndex(id, this._sortedElements.ymax);
      this._elementMap["delete"](id);
      this._transformedElementMap["delete"](id);
      this._recalculateBounds();
    }
  }, {
    key: "getPosition",
    value: function getPosition(id) {
      return this._elementMap.get(id);
    }
  }, {
    key: "getElements",
    value: function getElements() {
      return this._elementMap;
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this._elementMap.size === 0;
    }
  }]);
  return Viewport;
}(EventGenerator);

var ConnectionDragSelector = function () {
  function ConnectionDragSelector(selector, def) {
    var exclude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    _classCallCheck(this, ConnectionDragSelector);
    this.selector = selector;
    this.def = def;
    this.exclude = exclude;
  }
  _createClass(ConnectionDragSelector, [{
    key: "setEnabled",
    value: function setEnabled(enabled) {
      this.def.enabled = enabled;
    }
  }, {
    key: "isEnabled",
    value: function isEnabled() {
      return this.def.enabled !== false;
    }
  }]);
  return ConnectionDragSelector;
}();
var REDROP_POLICY_STRICT = "strict";
var REDROP_POLICY_ANY = "any";
var SourceSelector = function (_ConnectionDragSelect) {
  _inherits(SourceSelector, _ConnectionDragSelect);
  var _super = _createSuper(SourceSelector);
  function SourceSelector(selector, def, exclude) {
    var _this;
    _classCallCheck(this, SourceSelector);
    _this = _super.call(this, selector, def, exclude);
    _this.def = def;
    _defineProperty(_assertThisInitialized(_this), "redrop", void 0);
    _this.redrop = def.def.redrop || REDROP_POLICY_STRICT;
    return _this;
  }
  return SourceSelector;
}(ConnectionDragSelector);
var TargetSelector = function (_ConnectionDragSelect2) {
  _inherits(TargetSelector, _ConnectionDragSelect2);
  var _super2 = _createSuper(TargetSelector);
  function TargetSelector(selector, def, exclude) {
    var _this2;
    _classCallCheck(this, TargetSelector);
    _this2 = _super2.call(this, selector, def, exclude);
    _this2.def = def;
    return _this2;
  }
  return TargetSelector;
}(ConnectionDragSelector);

var _edgeSortFunctions;
function _placeAnchorsOnLine(element, connections, horizontal, otherMultiplier, reverse) {
  var sizeInAxis = horizontal ? element.w : element.h;
  var sizeInOtherAxis = horizontal ? element.h : element.w;
  var a = [],
      step = sizeInAxis / (connections.length + 1);
  for (var i = 0; i < connections.length; i++) {
    var val = (i + 1) * step,
        other = otherMultiplier * sizeInOtherAxis;
    if (reverse) {
      val = sizeInAxis - val;
    }
    var dx = horizontal ? val : other,
        x = element.x + dx,
        xp = dx / element.w;
    var dy = horizontal ? other : val,
        y = element.y + dy,
        yp = dy / element.h;
    if (element.r !== 0 && element.r != null) {
      var rotated = rotatePoint({
        x: x,
        y: y
      }, element.c, element.r);
      x = rotated.x;
      y = rotated.y;
    }
    a.push({
      x: x,
      y: y,
      xLoc: xp,
      yLoc: yp,
      c: connections[i].c
    });
  }
  return a;
}
function _rightAndBottomSort(a, b) {
  return b.theta - a.theta;
}
function _leftAndTopSort(a, b) {
  var p1 = a.theta < 0 ? -Math.PI - a.theta : Math.PI - a.theta,
      p2 = b.theta < 0 ? -Math.PI - b.theta : Math.PI - b.theta;
  return p1 - p2;
}
var edgeSortFunctions = (_edgeSortFunctions = {}, _defineProperty(_edgeSortFunctions, TOP, _leftAndTopSort), _defineProperty(_edgeSortFunctions, RIGHT, _rightAndBottomSort), _defineProperty(_edgeSortFunctions, BOTTOM, _rightAndBottomSort), _defineProperty(_edgeSortFunctions, LEFT, _leftAndTopSort), _edgeSortFunctions);
function isContinuous(a) {
  return a.isContinuous === true;
}
function _isFloating(a) {
  return a.isContinuous === true;
}
function isDynamic(a) {
  return a.locations.length > 1;
}
function getCurrentLocation(anchor) {
  return [anchor.currentLocation, anchor.locations[anchor.currentLocation]];
}
var LightweightRouter = function () {
  function LightweightRouter(instance) {
    var _this = this;
    _classCallCheck(this, LightweightRouter);
    this.instance = instance;
    _defineProperty(this, "anchorLists", new Map());
    _defineProperty(this, "anchorLocations", new Map());
    instance.bind(EVENT_INTERNAL_CONNECTION_DETACHED, function (p) {
      _this._removeEndpointFromAnchorLists(p.sourceEndpoint);
      _this._removeEndpointFromAnchorLists(p.targetEndpoint);
    });
    instance.bind(EVENT_INTERNAL_ENDPOINT_UNREGISTERED, function (ep) {
      _this._removeEndpointFromAnchorLists(ep);
    });
  }
  _createClass(LightweightRouter, [{
    key: "getAnchorOrientation",
    value: function getAnchorOrientation(anchor) {
      var loc = this.anchorLocations.get(anchor.id);
      return loc ? [loc.ox, loc.oy] : [0, 0];
    }
  }, {
    key: "_distance",
    value: function _distance(anchor, cx, cy, xy, wh, rotation, targetRotation) {
      var ax = xy.x + anchor.x * wh.w,
          ay = xy.y + anchor.y * wh.h,
          acx = xy.x + wh.w / 2,
          acy = xy.y + wh.h / 2;
      if (rotation != null && rotation.length > 0) {
        var rotated = this.instance._applyRotations([ax, ay, 0, 0], rotation);
        ax = rotated.x;
        ay = rotated.y;
      }
      return Math.sqrt(Math.pow(cx - ax, 2) + Math.pow(cy - ay, 2)) + Math.sqrt(Math.pow(acx - ax, 2) + Math.pow(acy - ay, 2));
    }
  }, {
    key: "_anchorSelector",
    value: function _anchorSelector(xy, wh, txy, twh, rotation, targetRotation, locations) {
      var cx = txy.x + twh.w / 2,
          cy = txy.y + twh.h / 2;
      var minIdx = -1,
          minDist = Infinity;
      for (var i = 0; i < locations.length; i++) {
        var d = this._distance(locations[i], cx, cy, xy, wh, rotation, targetRotation);
        if (d < minDist) {
          minIdx = i + 0;
          minDist = d;
        }
      }
      return [minIdx, locations[minIdx]];
    }
  }, {
    key: "_floatingAnchorCompute",
    value: function _floatingAnchorCompute(anchor, params) {
      var xy = params.xy;
      var pos = {
        curX: xy.x + anchor.size.w / 2,
        curY: xy.y + anchor.size.h / 2,
        x: 0,
        y: 0,
        ox: 0,
        oy: 0
      };
      return this._setComputedPosition(anchor, pos);
    }
  }, {
    key: "_setComputedPosition",
    value: function _setComputedPosition(anchor, pos, timestamp) {
      this.anchorLocations.set(anchor.id, pos);
      anchor.computedPosition = pos;
      if (timestamp) {
        anchor.timestamp = timestamp;
      }
      return pos;
    }
  }, {
    key: "_computeSingleLocation",
    value: function _computeSingleLocation(loc, xy, wh, params) {
      var candidate = {
        curX: xy.x + loc.x * wh.w + loc.offx,
        curY: xy.y + loc.y * wh.h + loc.offy,
        x: loc.x,
        y: loc.y,
        ox: 0,
        oy: 0
      };
      var pos;
      var rotation = params.rotation;
      if (rotation != null && rotation.length > 0) {
        var o = [loc.iox, loc.ioy],
            current = {
          x: candidate.curX,
          y: candidate.curY,
          cr: 0,
          sr: 0
        };
        forEach(rotation, function (r) {
          current = rotatePoint(current, r.c, r.r);
          var _o = [Math.round(o[0] * current.cr - o[1] * current.sr), Math.round(o[1] * current.cr + o[0] * current.sr)];
          o = _o.slice();
        });
        loc.ox = o[0];
        loc.oy = o[1];
        pos = {
          curX: current.x,
          curY: current.y,
          x: loc.x,
          y: loc.y,
          ox: o[0],
          oy: o[1]
        };
      } else {
        loc.ox = loc.iox;
        loc.oy = loc.ioy;
        pos = extend({
          ox: loc.iox,
          oy: loc.ioy
        }, candidate);
      }
      return pos;
    }
  }, {
    key: "_singleAnchorCompute",
    value: function _singleAnchorCompute(anchor, params) {
      var xy = params.xy,
          wh = params.wh,
          timestamp = params.timestamp,
          pos = this.anchorLocations.get(anchor.id);
      if (pos != null && timestamp && timestamp === anchor.timestamp) {
        return pos;
      }
      var _getCurrentLocation = getCurrentLocation(anchor),
          _getCurrentLocation2 = _slicedToArray(_getCurrentLocation, 2);
          _getCurrentLocation2[0];
          var currentLoc = _getCurrentLocation2[1];
      pos = this._computeSingleLocation(currentLoc, xy, wh, params);
      return this._setComputedPosition(anchor, pos, timestamp);
    }
  }, {
    key: "_defaultAnchorCompute",
    value: function _defaultAnchorCompute(anchor, params) {
      var pos;
      if (anchor.locations.length === 1) {
        return this._singleAnchorCompute(anchor, params);
      }
      var xy = params.xy,
          wh = params.wh,
          txy = params.txy,
          twh = params.twh;
      var _getCurrentLocation3 = getCurrentLocation(anchor),
          _getCurrentLocation4 = _slicedToArray(_getCurrentLocation3, 2),
          currentIdx = _getCurrentLocation4[0],
          currentLoc = _getCurrentLocation4[1];
      if (anchor.locked || txy == null || twh == null) {
        pos = this._computeSingleLocation(currentLoc, xy, wh, params);
      } else {
        var _this$_anchorSelector = this._anchorSelector(xy, wh, txy, twh, params.rotation, params.tRotation, anchor.locations),
            _this$_anchorSelector2 = _slicedToArray(_this$_anchorSelector, 2),
            newIdx = _this$_anchorSelector2[0],
            newLoc = _this$_anchorSelector2[1];
        anchor.currentLocation = newIdx;
        if (newIdx !== currentIdx) {
          anchor.cssClass = newLoc.cls || anchor.cssClass;
          params.element._anchorLocationChanged(anchor);
        }
        pos = this._computeSingleLocation(newLoc, xy, wh, params);
      }
      return this._setComputedPosition(anchor, pos, params.timestamp);
    }
  }, {
    key: "_placeAnchors",
    value: function _placeAnchors(elementId, _anchorLists) {
      var _this2 = this;
      var cd = this.instance.viewport.getPosition(elementId),
          placeSomeAnchors = function placeSomeAnchors(desc, element, unsortedConnections, isHorizontal, otherMultiplier, orientation) {
        if (unsortedConnections.length > 0) {
          var sc = unsortedConnections.sort(edgeSortFunctions[desc]),
          reverse = desc === RIGHT || desc === TOP,
              anchors = _placeAnchorsOnLine(cd, sc, isHorizontal, otherMultiplier, reverse);
          for (var i = 0; i < anchors.length; i++) {
            var c = anchors[i].c,
                weAreSource = c.endpoints[0].elementId === elementId,
                ep = weAreSource ? c.endpoints[0] : c.endpoints[1];
            _this2._setComputedPosition(ep._anchor, {
              curX: anchors[i].x,
              curY: anchors[i].y,
              x: anchors[i].xLoc,
              y: anchors[i].yLoc,
              ox: orientation[0],
              oy: orientation[1]
            });
          }
        }
      };
      placeSomeAnchors(BOTTOM, cd, _anchorLists.bottom, true, 1, [0, 1]);
      placeSomeAnchors(TOP, cd, _anchorLists.top, true, 0, [0, -1]);
      placeSomeAnchors(LEFT, cd, _anchorLists.left, false, 0, [-1, 0]);
      placeSomeAnchors(RIGHT, cd, _anchorLists.right, false, 1, [1, 0]);
    }
  }, {
    key: "_updateAnchorList",
    value: function _updateAnchorList(lists, theta, order, conn, aBoolean, otherElId, idx, reverse, edgeId, connsToPaint, endpointsToPaint) {
      var endpoint = conn.endpoints[idx],
          endpointId = endpoint.id,
          oIdx = [1, 0][idx],
          values = {
        theta: theta,
        order: order,
        c: conn,
        b: aBoolean,
        elId: otherElId,
        epId: endpointId
      },
          listToAddTo = lists[edgeId],
          listToRemoveFrom = endpoint._continuousAnchorEdge ? lists[endpoint._continuousAnchorEdge] : null,
          candidate;
      if (listToRemoveFrom) {
        var rIdx = findWithFunction(listToRemoveFrom, function (e) {
          return e.epId === endpointId;
        });
        if (rIdx !== -1) {
          listToRemoveFrom.splice(rIdx, 1);
          for (var i = 0; i < listToRemoveFrom.length; i++) {
            candidate = listToRemoveFrom[i].c;
            if (candidate.placeholder !== true) {
              connsToPaint.add(candidate);
            }
            endpointsToPaint.add(listToRemoveFrom[i].c.endpoints[idx]);
            endpointsToPaint.add(listToRemoveFrom[i].c.endpoints[oIdx]);
          }
        }
      }
      for (var _i = 0; _i < listToAddTo.length; _i++) {
        candidate = listToAddTo[_i].c;
        if (candidate.placeholder !== true) {
          connsToPaint.add(candidate);
        }
        endpointsToPaint.add(listToAddTo[_i].c.endpoints[idx]);
        endpointsToPaint.add(listToAddTo[_i].c.endpoints[oIdx]);
      }
      {
        var insertIdx = reverse ? 0 : listToAddTo.length;
        listToAddTo.splice(insertIdx, 0, values);
      }
      endpoint._continuousAnchorEdge = edgeId;
    }
  }, {
    key: "_removeEndpointFromAnchorLists",
    value: function _removeEndpointFromAnchorLists(endpoint) {
      var listsForElement = this.anchorLists.get(endpoint.elementId);
      var total = 0;
      (function (list, eId) {
        if (list) {
          var f = function f(e) {
            return e.epId === eId;
          };
          removeWithFunction(list.top, f);
          removeWithFunction(list.left, f);
          removeWithFunction(list.bottom, f);
          removeWithFunction(list.right, f);
          total += list.top.length;
          total += list.left.length;
          total += list.bottom.length;
          total += list.right.length;
        }
      })(listsForElement, endpoint.id);
      if (total === 0) {
        this.anchorLists["delete"](endpoint.elementId);
      }
      this.anchorLocations["delete"](endpoint._anchor.id);
    }
  }, {
    key: "computeAnchorLocation",
    value: function computeAnchorLocation(anchor, params) {
      var pos;
      if (isContinuous(anchor)) {
        pos = this.anchorLocations.get(anchor.id) || {
          curX: 0,
          curY: 0,
          x: 0,
          y: 0,
          ox: 0,
          oy: 0
        };
      } else if (_isFloating(anchor)) {
        pos = this._floatingAnchorCompute(anchor, params);
      } else {
        pos = this._defaultAnchorCompute(anchor, params);
      }
      anchor.timestamp = params.timestamp;
      return pos;
    }
  }, {
    key: "computePath",
    value: function computePath(connection, timestamp) {
      var sourceInfo = this.instance.viewport.getPosition(connection.sourceId),
          targetInfo = this.instance.viewport.getPosition(connection.targetId),
          sE = connection.endpoints[0],
          tE = connection.endpoints[1];
      var sAnchorP = this.getEndpointLocation(sE, {
        xy: sourceInfo,
        wh: sourceInfo,
        element: sE,
        timestamp: timestamp,
        rotation: this.instance._getRotations(connection.sourceId)
      }),
          tAnchorP = this.getEndpointLocation(tE, {
        xy: targetInfo,
        wh: targetInfo,
        element: tE,
        timestamp: timestamp,
        rotation: this.instance._getRotations(connection.targetId)
      });
      connection.connector.resetBounds();
      connection.connector.compute({
        sourcePos: sAnchorP,
        targetPos: tAnchorP,
        sourceEndpoint: connection.endpoints[0],
        targetEndpoint: connection.endpoints[1],
        strokeWidth: connection.paintStyleInUse.strokeWidth,
        sourceInfo: sourceInfo,
        targetInfo: targetInfo
      });
    }
  }, {
    key: "getEndpointLocation",
    value: function getEndpointLocation(endpoint, params) {
      params = params || {};
      var anchor = endpoint._anchor;
      var pos = this.anchorLocations.get(anchor.id);
      if (pos == null || params.timestamp != null && anchor.timestamp !== params.timestamp) {
        pos = this.computeAnchorLocation(anchor, params);
        this._setComputedPosition(anchor, pos, params.timestamp);
      }
      return pos;
    }
  }, {
    key: "getEndpointOrientation",
    value: function getEndpointOrientation(ep) {
      return ep._anchor ? this.getAnchorOrientation(ep._anchor) : [0, 0];
    }
  }, {
    key: "isDynamicAnchor",
    value: function isDynamicAnchor(ep) {
      return ep._anchor ? !isContinuous(ep._anchor) && ep._anchor.locations.length > 1 : false;
    }
  }, {
    key: "isFloating",
    value: function isFloating(ep) {
      return ep._anchor ? _isFloating(ep._anchor) : false;
    }
  }, {
    key: "prepareAnchor",
    value: function prepareAnchor(endpoint, params) {
      return makeLightweightAnchorFromSpec(params);
    }
  }, {
    key: "redraw",
    value: function redraw(elementId, timestamp, offsetToUI) {
      var _this3 = this;
      var connectionsToPaint = new Set(),
          endpointsToPaint = new Set(),
          anchorsToUpdate = new Set();
      if (!this.instance._suspendDrawing) {
        var ep = this.instance.endpointsByElement[elementId] || [];
        timestamp = timestamp || uuid();
        var orientationCache = {},
            a,
            anEndpoint;
        for (var i = 0; i < ep.length; i++) {
          anEndpoint = ep[i];
          endpointsToPaint.add(anEndpoint);
          a = anEndpoint._anchor;
          if (anEndpoint.connections.length === 0) {
            if (isContinuous(a)) {
              if (!this.anchorLists.has(elementId)) {
                this.anchorLists.set(elementId, {
                  top: [],
                  right: [],
                  bottom: [],
                  left: []
                });
              }
              this._updateAnchorList(this.anchorLists.get(elementId), -Math.PI / 2, 0, {
                endpoints: [anEndpoint, anEndpoint],
                placeholder: true
              }, false, elementId, 0, false, getDefaultFace(a), connectionsToPaint, endpointsToPaint);
              anchorsToUpdate.add(elementId);
            }
          } else {
            for (var _i2 = 0; _i2 < anEndpoint.connections.length; _i2++) {
              var conn = anEndpoint.connections[_i2],
                  sourceId = conn.sourceId,
                  targetId = conn.targetId,
                  sourceContinuous = isContinuous(conn.endpoints[0]._anchor),
                  targetContinuous = isContinuous(conn.endpoints[1]._anchor);
              if (sourceContinuous || targetContinuous) {
                var oKey = sourceId + "_" + targetId,
                    o = orientationCache[oKey],
                    oIdx = conn.sourceId === elementId ? 1 : 0;
                if (sourceContinuous && !this.anchorLists.has(sourceId)) {
                  this.anchorLists.set(sourceId, {
                    top: [],
                    right: [],
                    bottom: [],
                    left: []
                  });
                }
                if (targetContinuous && !this.anchorLists.has(targetId)) {
                  this.anchorLists.set(targetId, {
                    top: [],
                    right: [],
                    bottom: [],
                    left: []
                  });
                }
                var td = this.instance.viewport.getPosition(targetId),
                    sd = this.instance.viewport.getPosition(sourceId);
                if (targetId === sourceId && (sourceContinuous || targetContinuous)) {
                  this._updateAnchorList(this.anchorLists.get(sourceId), -Math.PI / 2, 0, conn, false, targetId, 0, false, TOP, connectionsToPaint, endpointsToPaint);
                  this._updateAnchorList(this.anchorLists.get(targetId), -Math.PI / 2, 0, conn, false, sourceId, 1, false, TOP, connectionsToPaint, endpointsToPaint);
                } else {
                  var sourceRotation = this.instance._getRotations(sourceId);
                  var targetRotation = this.instance._getRotations(targetId);
                  if (!o) {
                    o = this._calculateOrientation(sourceId, targetId, sd, td, conn.endpoints[0]._anchor, conn.endpoints[1]._anchor, sourceRotation, targetRotation);
                    orientationCache[oKey] = o;
                  }
                  if (sourceContinuous) {
                    this._updateAnchorList(this.anchorLists.get(sourceId), o.theta, 0, conn, false, targetId, 0, false, o.a[0], connectionsToPaint, endpointsToPaint);
                  }
                  if (targetContinuous) {
                    this._updateAnchorList(this.anchorLists.get(targetId), o.theta2, -1, conn, true, sourceId, 1, true, o.a[1], connectionsToPaint, endpointsToPaint);
                  }
                }
                if (sourceContinuous) {
                  anchorsToUpdate.add(sourceId);
                }
                if (targetContinuous) {
                  anchorsToUpdate.add(targetId);
                }
                connectionsToPaint.add(conn);
                if (sourceContinuous && oIdx === 0 || targetContinuous && oIdx === 1) {
                  endpointsToPaint.add(conn.endpoints[oIdx]);
                }
              } else {
                var otherEndpoint = anEndpoint.connections[_i2].endpoints[conn.sourceId === elementId ? 1 : 0],
                    otherAnchor = otherEndpoint._anchor;
                if (isDynamic(otherAnchor)) {
                  this.instance.paintEndpoint(otherEndpoint, {
                    elementWithPrecedence: elementId,
                    timestamp: timestamp
                  });
                  connectionsToPaint.add(anEndpoint.connections[_i2]);
                  for (var k = 0; k < otherEndpoint.connections.length; k++) {
                    if (otherEndpoint.connections[k] !== anEndpoint.connections[_i2]) {
                      connectionsToPaint.add(otherEndpoint.connections[k]);
                    }
                  }
                } else {
                  connectionsToPaint.add(anEndpoint.connections[_i2]);
                }
              }
            }
          }
        }
        anchorsToUpdate.forEach(function (anchor) {
          _this3._placeAnchors(anchor, _this3.anchorLists.get(anchor));
        });
        endpointsToPaint.forEach(function (ep) {
          var cd = _this3.instance.viewport.getPosition(ep.elementId);
          _this3.instance.paintEndpoint(ep, {
            timestamp: timestamp,
            offset: cd
          });
        });
        connectionsToPaint.forEach(function (c) {
          _this3.instance.paintConnection(c, {
            timestamp: timestamp
          });
        });
      }
      return {
        c: connectionsToPaint,
        e: endpointsToPaint
      };
    }
  }, {
    key: "reset",
    value: function reset() {
      this.anchorLocations.clear();
      this.anchorLists.clear();
    }
  }, {
    key: "setAnchor",
    value: function setAnchor(endpoint, anchor) {
      if (anchor != null) {
        endpoint._anchor = anchor;
      }
    }
  }, {
    key: "setConnectionAnchors",
    value: function setConnectionAnchors(conn, anchors) {
      conn.endpoints[0]._anchor = anchors[0];
      conn.endpoints[1]._anchor = anchors[1];
    }
  }, {
    key: "_calculateOrientation",
    value: function _calculateOrientation(sourceId, targetId, sd, td, sourceAnchor, targetAnchor, sourceRotation, targetRotation) {
      var _this4 = this;
      var Orientation = {
        HORIZONTAL: "horizontal",
        VERTICAL: "vertical",
        DIAGONAL: "diagonal",
        IDENTITY: "identity"
      };
      if (sourceId === targetId) {
        return {
          orientation: Orientation.IDENTITY,
          a: [TOP, TOP]
        };
      }
      var theta = Math.atan2(td.c.y - sd.c.y, td.c.x - sd.c.x),
          theta2 = Math.atan2(sd.c.y - td.c.y, sd.c.x - td.c.x);
      var candidates = [],
          midpoints = {};
      (function (types, dim) {
        for (var i = 0; i < types.length; i++) {
          var _midpoints$types$i;
          midpoints[types[i]] = (_midpoints$types$i = {}, _defineProperty(_midpoints$types$i, LEFT, {
            x: dim[i][0].x,
            y: dim[i][0].c.y
          }), _defineProperty(_midpoints$types$i, RIGHT, {
            x: dim[i][0].x + dim[i][0].w,
            y: dim[i][0].c.y
          }), _defineProperty(_midpoints$types$i, TOP, {
            x: dim[i][0].c.x,
            y: dim[i][0].y
          }), _defineProperty(_midpoints$types$i, BOTTOM, {
            x: dim[i][0].c.x,
            y: dim[i][0].y + dim[i][0].h
          }), _midpoints$types$i);
          if (dim[i][1] != null && dim[i][1].length > 0) {
            for (var axis in midpoints[types[i]]) {
              midpoints[types[i]][axis] = _this4.instance._applyRotationsXY(midpoints[types[i]][axis], dim[i][1]);
            }
          }
        }
      })([SOURCE, TARGET], [[sd, sourceRotation], [td, targetRotation]]);
      var FACES = [TOP, LEFT, RIGHT, BOTTOM];
      for (var sf = 0; sf < FACES.length; sf++) {
        for (var tf = 0; tf < FACES.length; tf++) {
          candidates.push({
            source: FACES[sf],
            target: FACES[tf],
            dist: lineLength(midpoints.source[FACES[sf]], midpoints.target[FACES[tf]])
          });
        }
      }
      candidates.sort(function (a, b) {
        if (a.dist < b.dist) {
          return -1;
        } else if (b.dist < a.dist) {
          return 1;
        } else {
          var _axisIndices;
          var axisIndices = (_axisIndices = {}, _defineProperty(_axisIndices, LEFT, 0), _defineProperty(_axisIndices, TOP, 1), _defineProperty(_axisIndices, RIGHT, 2), _defineProperty(_axisIndices, BOTTOM, 3), _axisIndices),
              ais = axisIndices[a.source],
              bis = axisIndices[b.source],
              ait = axisIndices[a.target],
              bit = axisIndices[b.target];
          return ais < bis ? -1 : bis < ais ? 1 : ait < bit ? -1 : bit < ait ? 1 : 0;
        }
      });
      var sourceEdge = candidates[0].source,
          targetEdge = candidates[0].target;
      for (var i = 0; i < candidates.length; i++) {
        if (isContinuous(sourceAnchor) && sourceAnchor.locked) {
          sourceEdge = sourceAnchor.currentFace;
        } else if (!sourceAnchor.isContinuous || isEdgeSupported(sourceAnchor, candidates[i].source)) {
          sourceEdge = candidates[i].source;
        } else {
          sourceEdge = null;
        }
        if (targetAnchor.isContinuous && targetAnchor.locked) {
          targetEdge = targetAnchor.currentFace;
        } else if (!targetAnchor.isContinuous || isEdgeSupported(targetAnchor, candidates[i].target)) {
          targetEdge = candidates[i].target;
        } else {
          targetEdge = null;
        }
        if (sourceEdge != null && targetEdge != null) {
          break;
        }
      }
      if (sourceAnchor.isContinuous) {
        this.setCurrentFace(sourceAnchor, sourceEdge);
      }
      if (targetAnchor.isContinuous) {
        this.setCurrentFace(targetAnchor, targetEdge);
      }
      return {
        a: [sourceEdge, targetEdge],
        theta: theta,
        theta2: theta2
      };
    }
  }, {
    key: "setCurrentFace",
    value: function setCurrentFace(a, face, overrideLock) {
      a.currentFace = face;
      if (overrideLock && a.lockedFace != null) {
        a.lockedFace = a.currentFace;
      }
    }
  }, {
    key: "lock",
    value: function lock(a) {
      a.locked = true;
      if (isContinuous(a)) {
        a.lockedFace = a.currentFace;
      }
    }
  }, {
    key: "unlock",
    value: function unlock(a) {
      a.locked = false;
      if (isContinuous(a)) {
        a.lockedFace = null;
      }
    }
  }, {
    key: "selectAnchorLocation",
    value: function selectAnchorLocation(a, coords) {
      var idx = findWithFunction(a.locations, function (loc) {
        return loc.x === coords.x && loc.y === coords.y;
      });
      if (idx !== -1) {
        a.currentLocation = idx;
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "lockCurrentAxis",
    value: function lockCurrentAxis(a) {
      if (a.currentFace != null) {
        a.lockedAxis = a.currentFace === LEFT || a.currentFace === RIGHT ? X_AXIS_FACES : Y_AXIS_FACES;
      }
    }
  }, {
    key: "unlockCurrentAxis",
    value: function unlockCurrentAxis(a) {
      a.lockedAxis = null;
    }
  }, {
    key: "anchorsEqual",
    value: function anchorsEqual(a1, a2) {
      if (!a1 || !a2) {
        return false;
      }
      var l1 = a1.locations[a1.currentLocation],
          l2 = a2.locations[a2.currentLocation];
      return l1.x === l2.x && l1.y === l2.y && l1.offx === l2.offx && l1.offy === l2.offy && l1.ox === l2.ox && l1.oy === l2.oy;
    }
  }]);
  return LightweightRouter;
}();

function _scopeMatch(e1, e2) {
  var s1 = e1.scope.split(/\s/),
      s2 = e2.scope.split(/\s/);
  for (var i = 0; i < s1.length; i++) {
    for (var j = 0; j < s2.length; j++) {
      if (s2[j] === s1[i]) {
        return true;
      }
    }
  }
  return false;
}
function prepareList(instance, input, doNotGetIds) {
  var r = [];
  var _resolveId = function _resolveId(i) {
    if (isString(i)) {
      return i;
    } else {
      return instance.getId(i);
    }
  };
  if (input) {
    if (typeof input === 'string') {
      if (input === "*") {
        return input;
      }
      r.push(input);
    } else {
      if (doNotGetIds) {
        r = input;
      } else {
        if (input.length != null) {
          var _r;
          (_r = r).push.apply(_r, _toConsumableArray(_toConsumableArray(input).map(_resolveId)));
        } else {
          r.push(_resolveId(input));
        }
      }
    }
  }
  return r;
}
function addManagedEndpoint(managedElement, ep) {
  if (managedElement != null) {
    managedElement.endpoints.push(ep);
  }
}
function removeManagedEndpoint(managedElement, endpoint) {
  if (managedElement != null) {
    removeWithFunction(managedElement.endpoints, function (ep) {
      return ep === endpoint;
    });
  }
}
function addManagedConnection(connection, sourceEl, targetEl) {
  if (sourceEl != null) {
    sourceEl.connections.push(connection);
    if (sourceEl.connections.length === 1) {
      connection.instance.addClass(connection.source, connection.instance.connectedClass);
    }
  }
  if (targetEl != null) {
    if (sourceEl == null || connection.sourceId !== connection.targetId) {
      targetEl.connections.push(connection);
      if (targetEl.connections.length === 1) {
        connection.instance.addClass(connection.target, connection.instance.connectedClass);
      }
    }
  }
}
function removeManagedConnection(connection, sourceEl, targetEl) {
  if (sourceEl != null) {
    var sourceCount = sourceEl.connections.length;
    removeWithFunction(sourceEl.connections, function (_c) {
      return connection.id === _c.id;
    });
    if (sourceCount > 0 && sourceEl.connections.length === 0) {
      connection.instance.removeClass(connection.source, connection.instance.connectedClass);
    }
  }
  if (targetEl != null) {
    var targetCount = targetEl.connections.length;
    if (sourceEl == null || connection.sourceId !== connection.targetId) {
      removeWithFunction(targetEl.connections, function (_c) {
        return connection.id === _c.id;
      });
    }
    if (targetCount > 0 && targetEl.connections.length === 0) {
      connection.instance.removeClass(connection.target, connection.instance.connectedClass);
    }
  }
}
var JsPlumbInstance = function (_EventGenerator) {
  _inherits(JsPlumbInstance, _EventGenerator);
  var _super = _createSuper(JsPlumbInstance);
  function JsPlumbInstance(_instanceIndex, defaults) {
    var _this;
    _classCallCheck(this, JsPlumbInstance);
    _this = _super.call(this);
    _this._instanceIndex = _instanceIndex;
    _defineProperty(_assertThisInitialized(_this), "defaults", void 0);
    _defineProperty(_assertThisInitialized(_this), "_initialDefaults", {});
    _defineProperty(_assertThisInitialized(_this), "isConnectionBeingDragged", false);
    _defineProperty(_assertThisInitialized(_this), "currentlyDragging", false);
    _defineProperty(_assertThisInitialized(_this), "hoverSuspended", false);
    _defineProperty(_assertThisInitialized(_this), "_suspendDrawing", false);
    _defineProperty(_assertThisInitialized(_this), "_suspendedAt", null);
    _defineProperty(_assertThisInitialized(_this), "connectorClass", CLASS_CONNECTOR);
    _defineProperty(_assertThisInitialized(_this), "connectorOutlineClass", CLASS_CONNECTOR_OUTLINE);
    _defineProperty(_assertThisInitialized(_this), "connectedClass", CLASS_CONNECTED);
    _defineProperty(_assertThisInitialized(_this), "endpointClass", CLASS_ENDPOINT);
    _defineProperty(_assertThisInitialized(_this), "endpointConnectedClass", CLASS_ENDPOINT_CONNECTED);
    _defineProperty(_assertThisInitialized(_this), "endpointFullClass", CLASS_ENDPOINT_FULL);
    _defineProperty(_assertThisInitialized(_this), "endpointDropAllowedClass", CLASS_ENDPOINT_DROP_ALLOWED);
    _defineProperty(_assertThisInitialized(_this), "endpointDropForbiddenClass", CLASS_ENDPOINT_DROP_FORBIDDEN);
    _defineProperty(_assertThisInitialized(_this), "endpointAnchorClassPrefix", CLASS_ENDPOINT_ANCHOR_PREFIX);
    _defineProperty(_assertThisInitialized(_this), "overlayClass", CLASS_OVERLAY);
    _defineProperty(_assertThisInitialized(_this), "connections", []);
    _defineProperty(_assertThisInitialized(_this), "endpointsByElement", {});
    _defineProperty(_assertThisInitialized(_this), "endpointsByUUID", new Map());
    _defineProperty(_assertThisInitialized(_this), "sourceSelectors", []);
    _defineProperty(_assertThisInitialized(_this), "targetSelectors", []);
    _defineProperty(_assertThisInitialized(_this), "allowNestedGroups", void 0);
    _defineProperty(_assertThisInitialized(_this), "_curIdStamp", 1);
    _defineProperty(_assertThisInitialized(_this), "viewport", new Viewport(_assertThisInitialized(_this)));
    _defineProperty(_assertThisInitialized(_this), "router", void 0);
    _defineProperty(_assertThisInitialized(_this), "groupManager", void 0);
    _defineProperty(_assertThisInitialized(_this), "_connectionTypes", new Map());
    _defineProperty(_assertThisInitialized(_this), "_endpointTypes", new Map());
    _defineProperty(_assertThisInitialized(_this), "_container", void 0);
    _defineProperty(_assertThisInitialized(_this), "_managedElements", {});
    _defineProperty(_assertThisInitialized(_this), "DEFAULT_SCOPE", void 0);
    _defineProperty(_assertThisInitialized(_this), "_zoom", 1);
    _this.defaults = {
      anchor: AnchorLocations.Bottom,
      anchors: [null, null],
      connectionsDetachable: true,
      connectionOverlays: [],
      connector: StraightConnector.type,
      container: null,
      endpoint: DotEndpoint.type,
      endpointOverlays: [],
      endpoints: [null, null],
      endpointStyle: {
        fill: "#456"
      },
      endpointStyles: [null, null],
      endpointHoverStyle: null,
      endpointHoverStyles: [null, null],
      hoverPaintStyle: null,
      listStyle: {},
      maxConnections: 1,
      paintStyle: {
        strokeWidth: 2,
        stroke: "#456"
      },
      reattachConnections: false,
      scope: "jsplumb_defaultscope",
      allowNestedGroups: true
    };
    if (defaults) {
      extend(_this.defaults, defaults);
    }
    extend(_this._initialDefaults, _this.defaults);
    _this.DEFAULT_SCOPE = _this.defaults.scope;
    _this.allowNestedGroups = _this._initialDefaults.allowNestedGroups !== false;
    _this.router = new LightweightRouter(_assertThisInitialized(_this));
    _this.groupManager = new GroupManager(_assertThisInitialized(_this));
    _this.setContainer(_this._initialDefaults.container);
    return _this;
  }
  _createClass(JsPlumbInstance, [{
    key: "defaultScope",
    get: function get() {
      return this.DEFAULT_SCOPE;
    }
  }, {
    key: "currentZoom",
    get: function get() {
      return this._zoom;
    }
  }, {
    key: "areDefaultAnchorsSet",
    value: function areDefaultAnchorsSet() {
      return this.validAnchorsSpec(this.defaults.anchors);
    }
  }, {
    key: "validAnchorsSpec",
    value: function validAnchorsSpec(anchors) {
      return anchors != null && anchors[0] != null && anchors[1] != null;
    }
  }, {
    key: "getContainer",
    value: function getContainer() {
      return this._container;
    }
  }, {
    key: "setZoom",
    value: function setZoom(z, repaintEverything) {
      this._zoom = z;
      this.fire(EVENT_ZOOM, this._zoom);
      if (repaintEverything) {
        this.repaintEverything();
      }
      return true;
    }
  }, {
    key: "_idstamp",
    value: function _idstamp() {
      return "" + this._curIdStamp++;
    }
  }, {
    key: "checkCondition",
    value: function checkCondition(conditionName, args) {
      var l = this.getListener(conditionName),
          r = true;
      if (l && l.length > 0) {
        var values = Array.prototype.slice.call(arguments, 1);
        try {
          for (var i = 0, j = l.length; i < j; i++) {
            r = r && l[i].apply(l[i], values);
          }
        } catch (e) {
          log("cannot check condition [" + conditionName + "]" + e);
        }
      }
      return r;
    }
  }, {
    key: "getId",
    value: function getId(element, uuid) {
      if (element == null) {
        return null;
      }
      var id = this.getAttribute(element, ATTRIBUTE_MANAGED);
      if (!id || id === "undefined") {
        if (arguments.length === 2 && arguments[1] !== undefined) {
          id = uuid;
        } else if (arguments.length === 1 || arguments.length === 3 && !arguments[2]) {
          id = "jsplumb-" + this._instanceIndex + "-" + this._idstamp();
        }
        this.setAttribute(element, ATTRIBUTE_MANAGED, id);
      }
      return id;
    }
  }, {
    key: "getConnections",
    value: function getConnections(options, flat) {
      if (!options) {
        options = {};
      } else if (options.constructor === String) {
        options = {
          "scope": options
        };
      }
      var scope = options.scope || this.defaultScope,
          scopes = prepareList(this, scope, true),
          sources = prepareList(this, options.source),
          targets = prepareList(this, options.target),
          results = !flat && scopes.length > 1 ? {} : [],
          _addOne = function _addOne(scope, obj) {
        if (!flat && scopes.length > 1) {
          var ss = results[scope];
          if (ss == null) {
            ss = results[scope] = [];
          }
          ss.push(obj);
        } else {
          results.push(obj);
        }
      };
      for (var j = 0, jj = this.connections.length; j < jj; j++) {
        var _c2 = this.connections[j],
            sourceId = _c2.proxies && _c2.proxies[0] ? _c2.proxies[0].originalEp.elementId : _c2.sourceId,
            targetId = _c2.proxies && _c2.proxies[1] ? _c2.proxies[1].originalEp.elementId : _c2.targetId;
        if (filterList(scopes, _c2.scope) && filterList(sources, sourceId) && filterList(targets, targetId)) {
          _addOne(_c2.scope, _c2);
        }
      }
      return results;
    }
  }, {
    key: "select",
    value: function select(params) {
      params = params || {};
      params.scope = params.scope || "*";
      return new ConnectionSelection(this, params.connections || this.getConnections(params, true));
    }
  }, {
    key: "selectEndpoints",
    value: function selectEndpoints(params) {
      params = params || {};
      params.scope = params.scope || WILDCARD;
      var noElementFilters = !params.element && !params.source && !params.target,
          elements = noElementFilters ? WILDCARD : prepareList(this, params.element),
          sources = noElementFilters ? WILDCARD : prepareList(this, params.source),
          targets = noElementFilters ? WILDCARD : prepareList(this, params.target),
          scopes = prepareList(this, params.scope, true);
      var ep = [];
      for (var _el2 in this.endpointsByElement) {
        var either = filterList(elements, _el2, true),
            source = filterList(sources, _el2, true),
            sourceMatchExact = sources !== "*",
            target = filterList(targets, _el2, true),
            targetMatchExact = targets !== "*";
        if (either || source || target) {
          inner: for (var i = 0, ii = this.endpointsByElement[_el2].length; i < ii; i++) {
            var _ep = this.endpointsByElement[_el2][i];
            if (filterList(scopes, _ep.scope, true)) {
              var noMatchSource = sourceMatchExact && sources.length > 0 && !_ep.isSource,
                  noMatchTarget = targetMatchExact && targets.length > 0 && !_ep.isTarget;
              if (noMatchSource || noMatchTarget) {
                continue inner;
              }
              ep.push(_ep);
            }
          }
        }
      }
      return new EndpointSelection(this, ep);
    }
  }, {
    key: "setContainer",
    value: function setContainer(c) {
      this._container = c;
      this.fire(EVENT_CONTAINER_CHANGE, this._container);
    }
  }, {
    key: "_set",
    value: function _set(c, el, idx) {
      var stTypes = [{
        el: "source",
        elId: "sourceId"
      }, {
        el: "target",
        elId: "targetId"
      }];
      var ep,
          _st = stTypes[idx],
          cId = c[_st.elId],
          sid,
          oldEndpoint = c.endpoints[idx];
      var evtParams = {
        index: idx,
        originalEndpoint: oldEndpoint,
        originalSourceId: idx === 0 ? cId : c.sourceId,
        newSourceId: c.sourceId,
        originalTargetId: idx === 1 ? cId : c.targetId,
        newTargetId: c.targetId,
        connection: c,
        newEndpoint: oldEndpoint
      };
      if (el instanceof Endpoint) {
        ep = el;
        ep.addConnection(c);
      } else {
        sid = this.getId(el);
        if (sid === c[_st.elId]) {
          ep = null;
        } else {
          ep = c.makeEndpoint(idx === 0, el, sid);
        }
      }
      if (ep != null) {
        evtParams.newEndpoint = ep;
        oldEndpoint.detachFromConnection(c);
        c.endpoints[idx] = ep;
        c[_st.el] = ep.element;
        c[_st.elId] = ep.elementId;
        evtParams[idx === 0 ? "newSourceId" : "newTargetId"] = ep.elementId;
        this.fireMoveEvent(evtParams);
        this.paintConnection(c);
      }
      return evtParams;
    }
  }, {
    key: "setSource",
    value: function setSource(connection, el) {
      removeManagedConnection(connection, this._managedElements[connection.sourceId]);
      var p = this._set(connection, el, 0);
      addManagedConnection(connection, this._managedElements[p.newSourceId]);
    }
  }, {
    key: "setTarget",
    value: function setTarget(connection, el) {
      removeManagedConnection(connection, this._managedElements[connection.targetId]);
      var p = this._set(connection, el, 1);
      addManagedConnection(connection, this._managedElements[p.newTargetId]);
    }
  }, {
    key: "isHoverSuspended",
    value: function isHoverSuspended() {
      return this.hoverSuspended;
    }
  }, {
    key: "setSuspendDrawing",
    value: function setSuspendDrawing(val, repaintAfterwards) {
      var curVal = this._suspendDrawing;
      this._suspendDrawing = val;
      if (val) {
        this._suspendedAt = "" + new Date().getTime();
      } else {
        this._suspendedAt = null;
        this.viewport.recomputeBounds();
      }
      if (repaintAfterwards) {
        this.repaintEverything();
      }
      return curVal;
    }
  }, {
    key: "getSuspendedAt",
    value: function getSuspendedAt() {
      return this._suspendedAt;
    }
  }, {
    key: "batch",
    value: function batch(fn, doNotRepaintAfterwards) {
      var _wasSuspended = this._suspendDrawing === true;
      if (!_wasSuspended) {
        this.setSuspendDrawing(true);
      }
      fn();
      if (!_wasSuspended) {
        this.setSuspendDrawing(false, !doNotRepaintAfterwards);
      }
    }
  }, {
    key: "each",
    value: function each(spec, fn) {
      if (spec == null) {
        return;
      }
      if (spec.length != null) {
        for (var i = 0; i < spec.length; i++) {
          fn(spec[i]);
        }
      } else {
        fn(spec);
      }
      return this;
    }
  }, {
    key: "updateOffset",
    value: function updateOffset(params) {
      var elId = params.elId;
      if (params.recalc) {
        return this.viewport.refreshElement(elId);
      } else {
        return this.viewport.getPosition(elId);
      }
    }
  }, {
    key: "deleteConnection",
    value: function deleteConnection(connection, params) {
      if (connection != null && connection.deleted !== true) {
        params = params || {};
        if (params.force || functionChain(true, false, [[connection.endpoints[0], IS_DETACH_ALLOWED, [connection]], [connection.endpoints[1], IS_DETACH_ALLOWED, [connection]], [connection, IS_DETACH_ALLOWED, [connection]], [this, CHECK_CONDITION, [INTERCEPT_BEFORE_DETACH, connection]]])) {
          removeManagedConnection(connection, this._managedElements[connection.sourceId], this._managedElements[connection.targetId]);
          this.fireDetachEvent(connection, !connection.pending && params.fireEvent !== false, params.originalEvent);
          var sourceEndpoint = connection.endpoints[0];
          var targetEndpoint = connection.endpoints[1];
          if (sourceEndpoint !== params.endpointToIgnore) {
            sourceEndpoint.detachFromConnection(connection, null, true);
          }
          if (targetEndpoint !== params.endpointToIgnore) {
            targetEndpoint.detachFromConnection(connection, null, true);
          }
          removeWithFunction(this.connections, function (_c) {
            return connection.id === _c.id;
          });
          connection.destroy();
          if (sourceEndpoint !== params.endpointToIgnore && sourceEndpoint.deleteOnEmpty && sourceEndpoint.connections.length === 0) {
            this.deleteEndpoint(sourceEndpoint);
          }
          if (targetEndpoint !== params.endpointToIgnore && targetEndpoint.deleteOnEmpty && targetEndpoint.connections.length === 0) {
            this.deleteEndpoint(targetEndpoint);
          }
          return true;
        }
      }
      return false;
    }
  }, {
    key: "deleteEveryConnection",
    value: function deleteEveryConnection(params) {
      var _this2 = this;
      params = params || {};
      var count = this.connections.length,
          deletedCount = 0;
      this.batch(function () {
        for (var i = 0; i < count; i++) {
          deletedCount += _this2.deleteConnection(_this2.connections[0], params) ? 1 : 0;
        }
      });
      return deletedCount;
    }
  }, {
    key: "deleteConnectionsForElement",
    value: function deleteConnectionsForElement(el, params) {
      var id = this.getId(el),
          m = this._managedElements[id];
      if (m) {
        var l = m.connections.length;
        for (var i = 0; i < l; i++) {
          this.deleteConnection(m.connections[0], params);
        }
      }
      return this;
    }
  }, {
    key: "fireDetachEvent",
    value: function fireDetachEvent(jpc, doFireEvent, originalEvent) {
      var argIsConnection = jpc.id != null,
          params = argIsConnection ? {
        connection: jpc,
        source: jpc.source,
        target: jpc.target,
        sourceId: jpc.sourceId,
        targetId: jpc.targetId,
        sourceEndpoint: jpc.endpoints[0],
        targetEndpoint: jpc.endpoints[1]
      } : jpc;
      if (doFireEvent) {
        this.fire(EVENT_CONNECTION_DETACHED, params, originalEvent);
      }
      this.fire(EVENT_INTERNAL_CONNECTION_DETACHED, params, originalEvent);
    }
  }, {
    key: "fireMoveEvent",
    value: function fireMoveEvent(params, evt) {
      this.fire(EVENT_CONNECTION_MOVED, params, evt);
    }
  }, {
    key: "manageAll",
    value: function manageAll(elements, recalc) {
      var nl = isString(elements) ? this.getSelector(this.getContainer(), elements) : elements;
      for (var i = 0; i < nl.length; i++) {
        this.manage(nl[i], null, recalc);
      }
    }
  }, {
    key: "manage",
    value: function manage(element, internalId, _recalc) {
      if (this.getAttribute(element, ATTRIBUTE_MANAGED) == null) {
        internalId = internalId || this.getAttribute(element, "id") || uuid();
        this.setAttribute(element, ATTRIBUTE_MANAGED, internalId);
      }
      var elId = this.getId(element);
      if (!this._managedElements[elId]) {
        var obj = {
          el: element,
          endpoints: [],
          connections: [],
          rotation: 0
        };
        this._managedElements[elId] = obj;
        if (this._suspendDrawing) {
          obj.viewportElement = this.viewport.registerElement(elId, true);
        } else {
          obj.viewportElement = this.updateOffset({
            elId: elId,
            recalc: true
          });
        }
        this.fire(EVENT_MANAGE_ELEMENT, {
          el: element
        });
      } else {
        if (_recalc) {
          this._managedElements[elId].viewportElement = this.updateOffset({
            elId: elId,
            timestamp: null,
            recalc: true
          });
        }
      }
      return this._managedElements[elId];
    }
  }, {
    key: "getManagedElement",
    value: function getManagedElement(id) {
      return this._managedElements[id] ? this._managedElements[id].el : null;
    }
  }, {
    key: "unmanage",
    value: function unmanage(el, removeElement) {
      var _this3 = this;
      this.removeAllEndpoints(el, true);
      var _one = function _one(_el) {
        var id = _this3.getId(_el);
        _this3.removeAttribute(_el, ATTRIBUTE_MANAGED);
        delete _this3._managedElements[id];
        _this3.viewport.remove(id);
        _this3.fire(EVENT_UNMANAGE_ELEMENT, {
          el: _el
        });
        if (_el && removeElement) {
          _this3._removeElement(_el);
        }
      };
      this._getAssociatedElements(el).map(_one);
      _one(el);
    }
  }, {
    key: "rotate",
    value: function rotate(element, rotation, _doNotRepaint) {
      var elementId = this.getId(element);
      if (this._managedElements[elementId]) {
        this._managedElements[elementId].rotation = rotation;
        this.viewport.rotateElement(elementId, rotation);
        if (_doNotRepaint !== true) {
          return this.revalidate(element);
        }
      }
      return {
        c: new Set(),
        e: new Set()
      };
    }
  }, {
    key: "_getRotation",
    value: function _getRotation(elementId) {
      var entry = this._managedElements[elementId];
      if (entry != null) {
        return entry.rotation || 0;
      } else {
        return 0;
      }
    }
  }, {
    key: "_getRotations",
    value: function _getRotations(elementId) {
      var _this4 = this;
      var rotations = [];
      var entry = this._managedElements[elementId];
      var _oneLevel = function _oneLevel(e) {
        if (e.group != null) {
          var gEntry = _this4._managedElements[e.group];
          if (gEntry != null) {
            rotations.push({
              r: gEntry.viewportElement.r,
              c: gEntry.viewportElement.c
            });
            _oneLevel(gEntry);
          }
        }
      };
      if (entry != null) {
        rotations.push({
          r: entry.viewportElement.r || 0,
          c: entry.viewportElement.c
        });
        _oneLevel(entry);
      }
      return rotations;
    }
  }, {
    key: "_applyRotations",
    value: function _applyRotations(point, rotations) {
      var sl = point.slice();
      var current = {
        x: sl[0],
        y: sl[1],
        cr: 0,
        sr: 0
      };
      forEach(rotations, function (rotation) {
        current = rotatePoint(current, rotation.c, rotation.r);
      });
      return current;
    }
  }, {
    key: "_applyRotationsXY",
    value: function _applyRotationsXY(point, rotations) {
      forEach(rotations, function (rotation) {
        point = rotatePoint(point, rotation.c, rotation.r);
      });
      return point;
    }
  }, {
    key: "_internal_newEndpoint",
    value: function _internal_newEndpoint(params) {
      var _p = extend({}, params);
      var managedElement = this.manage(_p.element);
      _p.elementId = this.getId(_p.element);
      _p.id = "ep_" + this._idstamp();
      var ep = new Endpoint(this, _p);
      addManagedEndpoint(managedElement, ep);
      if (params.uuid) {
        this.endpointsByUUID.set(params.uuid, ep);
      }
      addToDictionary(this.endpointsByElement, ep.elementId, ep);
      if (!this._suspendDrawing) {
        this.paintEndpoint(ep, {
          timestamp: this._suspendedAt
        });
      }
      return ep;
    }
  }, {
    key: "_deriveEndpointAndAnchorSpec",
    value: function _deriveEndpointAndAnchorSpec(type, dontPrependDefault) {
      var bits = ((dontPrependDefault ? "" : "default ") + type).split(/[\s]/),
          eps = null,
          ep = null,
          a = null,
          as = null;
      for (var i = 0; i < bits.length; i++) {
        var _t = this.getConnectionType(bits[i]);
        if (_t) {
          if (_t.endpoints) {
            eps = _t.endpoints;
          }
          if (_t.endpoint) {
            ep = _t.endpoint;
          }
          if (_t.anchors) {
            as = _t.anchors;
          }
          if (_t.anchor) {
            a = _t.anchor;
          }
        }
      }
      return {
        endpoints: eps ? eps : [ep, ep],
        anchors: as ? as : [a, a]
      };
    }
  }, {
    key: "revalidate",
    value: function revalidate(el, timestamp) {
      var elId = this.getId(el);
      this.updateOffset({
        elId: elId,
        recalc: true,
        timestamp: timestamp
      });
      return this.repaint(el);
    }
  }, {
    key: "repaintEverything",
    value: function repaintEverything() {
      var timestamp = uuid(),
          elId;
      for (elId in this._managedElements) {
        this.viewport.refreshElement(elId, true);
      }
      this.viewport.recomputeBounds();
      for (elId in this._managedElements) {
        this.repaint(this._managedElements[elId].el, timestamp, true);
      }
      return this;
    }
  }, {
    key: "setElementPosition",
    value: function setElementPosition(el, x, y) {
      var id = this.getId(el);
      this.viewport.setPosition(id, x, y);
      return this.repaint(el);
    }
  }, {
    key: "repaint",
    value: function repaint(el, timestamp, offsetsWereJustCalculated) {
      var r = {
        c: new Set(),
        e: new Set()
      };
      var _mergeRedraw = function _mergeRedraw(r2) {
        r2.c.forEach(function (c) {
          return r.c.add(c);
        });
        r2.e.forEach(function (e) {
          return r.e.add(e);
        });
      };
      if (!this._suspendDrawing) {
        var id = this.getId(el);
        if (el != null) {
          var repaintEls = this._getAssociatedElements(el);
          if (timestamp == null) {
            timestamp = uuid();
          }
          if (!offsetsWereJustCalculated) {
            for (var i = 0; i < repaintEls.length; i++) {
              this.updateOffset({
                elId: this.getId(repaintEls[i]),
                recalc: true,
                timestamp: timestamp
              });
            }
          }
          _mergeRedraw(this.router.redraw(id, timestamp, null));
          if (repaintEls.length > 0) {
            for (var j = 0; j < repaintEls.length; j++) {
              _mergeRedraw(this.router.redraw(this.getId(repaintEls[j]), timestamp, null));
            }
          }
        }
      }
      return r;
    }
  }, {
    key: "unregisterEndpoint",
    value: function unregisterEndpoint(endpoint) {
      var uuid = endpoint.getUuid();
      if (uuid) {
        this.endpointsByUUID["delete"](uuid);
      }
      removeManagedEndpoint(this._managedElements[endpoint.elementId], endpoint);
      for (var _e in this.endpointsByElement) {
        var endpoints = this.endpointsByElement[_e];
        if (endpoints) {
          var newEndpoints = [];
          for (var i = 0, j = endpoints.length; i < j; i++) {
            if (endpoints[i] !== endpoint) {
              newEndpoints.push(endpoints[i]);
            }
          }
          this.endpointsByElement[_e] = newEndpoints;
        }
        if (this.endpointsByElement[_e].length < 1) {
          delete this.endpointsByElement[_e];
        }
      }
      this.fire(EVENT_INTERNAL_ENDPOINT_UNREGISTERED, endpoint);
    }
  }, {
    key: "_maybePruneEndpoint",
    value: function _maybePruneEndpoint(endpoint) {
      if (endpoint.deleteOnEmpty && endpoint.connections.length === 0) {
        this.deleteEndpoint(endpoint);
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "deleteEndpoint",
    value: function deleteEndpoint(object) {
      var _this5 = this;
      var endpoint = typeof object === "string" ? this.endpointsByUUID.get(object) : object;
      if (endpoint) {
        var proxy = endpoint.proxiedBy;
        var connectionsToDelete = endpoint.connections.slice();
        forEach(connectionsToDelete, function (connection) {
          endpoint.detachFromConnection(connection, null, true);
        });
        this.unregisterEndpoint(endpoint);
        endpoint.destroy();
        forEach(connectionsToDelete, function (connection) {
          _this5.deleteConnection(connection, {
            force: true,
            endpointToIgnore: endpoint
          });
        });
        if (proxy != null) {
          this.deleteEndpoint(proxy);
        }
      }
      return this;
    }
  }, {
    key: "addEndpoint",
    value: function addEndpoint(el, params, referenceParams) {
      referenceParams = referenceParams || {};
      var p = extend({}, referenceParams);
      extend(p, params || {});
      var _p = extend({
        element: el
      }, p);
      return this._internal_newEndpoint(_p);
    }
  }, {
    key: "addEndpoints",
    value: function addEndpoints(el, endpoints, referenceParams) {
      var results = [];
      for (var i = 0, j = endpoints.length; i < j; i++) {
        results.push(this.addEndpoint(el, endpoints[i], referenceParams));
      }
      return results;
    }
  }, {
    key: "reset",
    value: function reset() {
      var _this6 = this;
      this.silently(function () {
        _this6.endpointsByElement = {};
        _this6._managedElements = {};
        _this6.endpointsByUUID.clear();
        _this6.viewport.reset();
        _this6.router.reset();
        _this6.groupManager.reset();
        _this6.connections.length = 0;
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.reset();
      this.unbind();
      this.sourceSelectors.length = 0;
      this.targetSelectors.length = 0;
      this._connectionTypes.clear();
      this._endpointTypes.clear();
    }
  }, {
    key: "getEndpoints",
    value: function getEndpoints(el) {
      return this.endpointsByElement[this.getId(el)] || [];
    }
  }, {
    key: "getEndpoint",
    value: function getEndpoint(uuid) {
      return this.endpointsByUUID.get(uuid);
    }
  }, {
    key: "setEndpointUuid",
    value: function setEndpointUuid(endpoint, uuid) {
      if (endpoint.uuid) {
        this.endpointsByUUID["delete"](endpoint.uuid);
      }
      endpoint.uuid = uuid;
      this.endpointsByUUID.set(uuid, endpoint);
    }
  }, {
    key: "connect",
    value: function connect(params, referenceParams) {
      try {
        var _p = this._prepareConnectionParams(params, referenceParams),
            jpc = this._newConnection(_p);
        this._finaliseConnection(jpc, _p);
        return jpc;
      } catch (errorMessage) {
        log(errorMessage);
        return;
      }
    }
  }, {
    key: "_prepareConnectionParams",
    value: function _prepareConnectionParams(params, referenceParams) {
      var temp = extend({}, params);
      if (referenceParams) {
        extend(temp, referenceParams);
      }
      var _p = temp;
      if (_p.source) {
        if (_p.source.endpoint) {
          _p.sourceEndpoint = _p.source;
        }
      }
      if (_p.target) {
        if (_p.target.endpoint) {
          _p.targetEndpoint = _p.target;
        }
      }
      if (params.uuids) {
        _p.sourceEndpoint = this.getEndpoint(params.uuids[0]);
        _p.targetEndpoint = this.getEndpoint(params.uuids[1]);
      }
      if (_p.sourceEndpoint != null) {
        if (_p.sourceEndpoint.isFull()) {
          throw ERROR_SOURCE_ENDPOINT_FULL;
        }
        if (!_p.type) {
          _p.type = _p.sourceEndpoint.edgeType;
        }
        if (_p.sourceEndpoint.connectorOverlays) {
          _p.overlays = _p.overlays || [];
          for (var i = 0, j = _p.sourceEndpoint.connectorOverlays.length; i < j; i++) {
            _p.overlays.push(_p.sourceEndpoint.connectorOverlays[i]);
          }
        }
        if (_p.sourceEndpoint.scope) {
          _p.scope = _p.sourceEndpoint.scope;
        }
      } else {
        if (_p.source == null) {
          throw ERROR_SOURCE_DOES_NOT_EXIST;
        }
      }
      if (_p.targetEndpoint != null) {
        if (_p.targetEndpoint.isFull()) {
          throw ERROR_TARGET_ENDPOINT_FULL;
        }
      } else {
        if (_p.target == null) {
          throw ERROR_TARGET_DOES_NOT_EXIST;
        }
      }
      if (_p.sourceEndpoint && _p.targetEndpoint) {
        if (!_scopeMatch(_p.sourceEndpoint, _p.targetEndpoint)) {
          throw "Cannot establish connection: scopes do not match";
        }
      }
      return _p;
    }
  }, {
    key: "_newConnection",
    value: function _newConnection(params) {
      params.id = "con_" + this._idstamp();
      var c = new Connection(this, params);
      addManagedConnection(c, this._managedElements[c.sourceId], this._managedElements[c.targetId]);
      this.paintConnection(c);
      return c;
    }
  }, {
    key: "_finaliseConnection",
    value: function _finaliseConnection(jpc, params, originalEvent) {
      params = params || {};
      if (!jpc.suspendedEndpoint) {
        this.connections.push(jpc);
      }
      jpc.pending = null;
      jpc.endpoints[0].isTemporarySource = false;
      this.repaint(jpc.source);
      var payload = {
        connection: jpc,
        source: jpc.source,
        target: jpc.target,
        sourceId: jpc.sourceId,
        targetId: jpc.targetId,
        sourceEndpoint: jpc.endpoints[0],
        targetEndpoint: jpc.endpoints[1]
      };
      this.fire(EVENT_INTERNAL_CONNECTION, payload, originalEvent);
      if (!params.doNotFireConnectionEvent && params.fireEvent !== false) {
        this.fire(EVENT_CONNECTION, payload, originalEvent);
      }
    }
  }, {
    key: "removeAllEndpoints",
    value: function removeAllEndpoints(el, recurse) {
      var _this7 = this;
      var _one = function _one(_el) {
        var id = _this7.getId(_el),
            ebe = _this7.endpointsByElement[id],
            i,
            ii;
        if (ebe) {
          for (i = 0, ii = ebe.length; i < ii; i++) {
            _this7.deleteEndpoint(ebe[i]);
          }
        }
        delete _this7.endpointsByElement[id];
      };
      if (recurse) {
        this._getAssociatedElements(el).map(_one);
      }
      _one(el);
      return this;
    }
  }, {
    key: "_createSourceDefinition",
    value: function _createSourceDefinition(params, referenceParams) {
      var p = extend({}, referenceParams);
      extend(p, params);
      p.edgeType = p.edgeType || DEFAULT;
      var aae = this._deriveEndpointAndAnchorSpec(p.edgeType);
      p.endpoint = p.endpoint || aae.endpoints[0];
      p.anchor = p.anchor || aae.anchors[0];
      var maxConnections = p.maxConnections || -1;
      var _def = {
        def: extend({}, p),
        uniqueEndpoint: p.uniqueEndpoint,
        maxConnections: maxConnections,
        enabled: true,
        endpoint: null
      };
      return _def;
    }
  }, {
    key: "addSourceSelector",
    value: function addSourceSelector(selector, params) {
      var exclude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var _def = this._createSourceDefinition(params);
      var sel = new SourceSelector(selector, _def, exclude);
      this.sourceSelectors.push(sel);
      return sel;
    }
  }, {
    key: "removeSourceSelector",
    value: function removeSourceSelector(selector) {
      removeWithFunction(this.sourceSelectors, function (s) {
        return s === selector;
      });
    }
  }, {
    key: "removeTargetSelector",
    value: function removeTargetSelector(selector) {
      removeWithFunction(this.targetSelectors, function (s) {
        return s === selector;
      });
    }
  }, {
    key: "addTargetSelector",
    value: function addTargetSelector(selector, params) {
      var exclude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var _def = this._createTargetDefinition(params);
      var sel = new TargetSelector(selector, _def, exclude);
      this.targetSelectors.push(sel);
      return sel;
    }
  }, {
    key: "_createTargetDefinition",
    value: function _createTargetDefinition(params, referenceParams) {
      var p = extend({}, referenceParams);
      extend(p, params);
      p.edgeType = p.edgeType || DEFAULT;
      var maxConnections = p.maxConnections || -1;
      var _def = {
        def: extend({}, p),
        uniqueEndpoint: p.uniqueEndpoint,
        maxConnections: maxConnections,
        enabled: true,
        endpoint: null
      };
      return _def;
    }
  }, {
    key: "show",
    value: function show(el, changeEndpoints) {
      return this._setVisible(el, BLOCK, changeEndpoints);
    }
  }, {
    key: "hide",
    value: function hide(el, changeEndpoints) {
      return this._setVisible(el, NONE, changeEndpoints);
    }
  }, {
    key: "_setVisible",
    value: function _setVisible(el, state, alsoChangeEndpoints) {
      var visible = state === BLOCK;
      var endpointFunc = null;
      if (alsoChangeEndpoints) {
        endpointFunc = function endpointFunc(ep) {
          ep.setVisible(visible, true, true);
        };
      }
      var id = this.getId(el);
      this._operation(el, function (jpc) {
        if (visible && alsoChangeEndpoints) {
          var oidx = jpc.sourceId === id ? 1 : 0;
          if (jpc.endpoints[oidx].isVisible()) {
            jpc.setVisible(true);
          }
        } else {
          jpc.setVisible(visible);
        }
      }, endpointFunc);
      return this;
    }
  }, {
    key: "toggleVisible",
    value: function toggleVisible(el, changeEndpoints) {
      var endpointFunc = null;
      if (changeEndpoints) {
        endpointFunc = function endpointFunc(ep) {
          var state = ep.isVisible();
          ep.setVisible(!state);
        };
      }
      this._operation(el, function (jpc) {
        var state = jpc.isVisible();
        jpc.setVisible(!state);
      }, endpointFunc);
    }
  }, {
    key: "_operation",
    value: function _operation(el, func, endpointFunc) {
      var elId = this.getId(el);
      var endpoints = this.endpointsByElement[elId];
      if (endpoints && endpoints.length) {
        for (var i = 0, ii = endpoints.length; i < ii; i++) {
          for (var j = 0, jj = endpoints[i].connections.length; j < jj; j++) {
            var retVal = func(endpoints[i].connections[j]);
            if (retVal) {
              return;
            }
          }
          if (endpointFunc) {
            endpointFunc(endpoints[i]);
          }
        }
      }
    }
  }, {
    key: "registerConnectionType",
    value: function registerConnectionType(id, type) {
      this._connectionTypes.set(id, extend({}, type));
      if (type.overlays) {
        var to = {};
        for (var i = 0; i < type.overlays.length; i++) {
          var fo = convertToFullOverlaySpec(type.overlays[i]);
          to[fo.options.id] = fo;
        }
        this._connectionTypes.get(id).overlays = to;
      }
    }
  }, {
    key: "registerConnectionTypes",
    value: function registerConnectionTypes(types) {
      for (var i in types) {
        this.registerConnectionType(i, types[i]);
      }
    }
  }, {
    key: "registerEndpointType",
    value: function registerEndpointType(id, type) {
      this._endpointTypes.set(id, extend({}, type));
      if (type.overlays) {
        var to = {};
        for (var i = 0; i < type.overlays.length; i++) {
          var fo = convertToFullOverlaySpec(type.overlays[i]);
          to[fo.options.id] = fo;
        }
        this._endpointTypes.get(id).overlays = to;
      }
    }
  }, {
    key: "registerEndpointTypes",
    value: function registerEndpointTypes(types) {
      for (var i in types) {
        this.registerEndpointType(i, types[i]);
      }
    }
  }, {
    key: "getType",
    value: function getType(id, typeDescriptor) {
      return typeDescriptor === "connection" ? this.getConnectionType(id) : this.getEndpointType(id);
    }
  }, {
    key: "getConnectionType",
    value: function getConnectionType(id) {
      return this._connectionTypes.get(id);
    }
  }, {
    key: "getEndpointType",
    value: function getEndpointType(id) {
      return this._endpointTypes.get(id);
    }
  }, {
    key: "importDefaults",
    value: function importDefaults(d) {
      for (var i in d) {
        this.defaults[i] = d[i];
      }
      if (d.container) {
        this.setContainer(d.container);
      }
      return this;
    }
  }, {
    key: "restoreDefaults",
    value: function restoreDefaults() {
      this.defaults = extend({}, this._initialDefaults);
      return this;
    }
  }, {
    key: "getManagedElements",
    value: function getManagedElements() {
      return this._managedElements;
    }
  }, {
    key: "proxyConnection",
    value: function proxyConnection(connection, index, proxyEl, endpointGenerator, anchorGenerator) {
      var alreadyProxied = connection.proxies[index] != null,
          proxyEp,
          originalElementId = alreadyProxied ? connection.proxies[index].originalEp.elementId : connection.endpoints[index].elementId,
          originalEndpoint = alreadyProxied ? connection.proxies[index].originalEp : connection.endpoints[index],
          proxyElId = this.getId(proxyEl);
      if (connection.proxies[index]) {
        if (connection.proxies[index].ep.elementId === proxyElId) {
          proxyEp = connection.proxies[index].ep;
        } else {
          connection.proxies[index].ep.detachFromConnection(connection, index);
          proxyEp = this._internal_newEndpoint({
            element: proxyEl,
            endpoint: endpointGenerator(connection, index),
            anchor: anchorGenerator(connection, index),
            parameters: {
              isProxyEndpoint: true
            }
          });
        }
      } else {
        proxyEp = this._internal_newEndpoint({
          element: proxyEl,
          endpoint: endpointGenerator(connection, index),
          anchor: anchorGenerator(connection, index),
          parameters: {
            isProxyEndpoint: true
          }
        });
      }
      proxyEp.deleteOnEmpty = true;
      connection.proxies[index] = {
        ep: proxyEp,
        originalEp: originalEndpoint
      };
      this.sourceOrTargetChanged(originalElementId, proxyElId, connection, proxyEl, index);
      originalEndpoint.detachFromConnection(connection, null, true);
      proxyEp.connections = [connection];
      connection.endpoints[index] = proxyEp;
      originalEndpoint.proxiedBy = proxyEp;
      originalEndpoint.setVisible(false);
      connection.setVisible(true);
      this.revalidate(proxyEl);
    }
  }, {
    key: "unproxyConnection",
    value: function unproxyConnection(connection, index) {
      if (connection.proxies == null || connection.proxies[index] == null) {
        return;
      }
      var originalElement = connection.proxies[index].originalEp.element,
          originalElementId = connection.proxies[index].originalEp.elementId,
          proxyElId = connection.proxies[index].ep.elementId;
      connection.endpoints[index] = connection.proxies[index].originalEp;
      delete connection.proxies[index].originalEp.proxiedBy;
      this.sourceOrTargetChanged(proxyElId, originalElementId, connection, originalElement, index);
      connection.proxies[index].ep.detachFromConnection(connection, null);
      connection.proxies[index].originalEp.addConnection(connection);
      if (connection.isVisible()) {
        connection.proxies[index].originalEp.setVisible(true);
      }
      connection.proxies[index] = null;
      if (findWithFunction(connection.proxies, function (p) {
        return p != null;
      }) === -1) {
        connection.proxies.length = 0;
      }
    }
  }, {
    key: "sourceOrTargetChanged",
    value: function sourceOrTargetChanged(originalId, newId, connection, newElement, index) {
      if (originalId !== newId) {
        if (index === 0) {
          connection.sourceId = newId;
          connection.source = newElement;
        } else if (index === 1) {
          connection.targetId = newId;
          connection.target = newElement;
        }
        removeManagedConnection(connection, this._managedElements[originalId]);
        addManagedConnection(connection, this._managedElements[newId]);
      }
    }
  }, {
    key: "getGroup",
    value: function getGroup(groupId) {
      return this.groupManager.getGroup(groupId);
    }
  }, {
    key: "getGroupFor",
    value: function getGroupFor(el) {
      return this.groupManager.getGroupFor(el);
    }
  }, {
    key: "addGroup",
    value: function addGroup(params) {
      return this.groupManager.addGroup(params);
    }
  }, {
    key: "addToGroup",
    value: function addToGroup(group) {
      var _this$groupManager;
      for (var _len = arguments.length, el = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        el[_key - 1] = arguments[_key];
      }
      return (_this$groupManager = this.groupManager).addToGroup.apply(_this$groupManager, [group, false].concat(el));
    }
  }, {
    key: "collapseGroup",
    value: function collapseGroup(group) {
      this.groupManager.collapseGroup(group);
    }
  }, {
    key: "expandGroup",
    value: function expandGroup(group) {
      this.groupManager.expandGroup(group);
    }
  }, {
    key: "toggleGroup",
    value: function toggleGroup(group) {
      this.groupManager.toggleGroup(group);
    }
  }, {
    key: "removeGroup",
    value: function removeGroup(group, deleteMembers, manipulateView, doNotFireEvent) {
      return this.groupManager.removeGroup(group, deleteMembers, manipulateView, doNotFireEvent);
    }
  }, {
    key: "removeAllGroups",
    value: function removeAllGroups(deleteMembers, manipulateView) {
      this.groupManager.removeAllGroups(deleteMembers, manipulateView, false);
    }
  }, {
    key: "removeFromGroup",
    value: function removeFromGroup(group, el, doNotFireEvent) {
      this.groupManager.removeFromGroup(group, doNotFireEvent, el);
      this._appendElement(el, this.getContainer());
      this.updateOffset({
        recalc: true,
        elId: this.getId(el)
      });
    }
  }, {
    key: "paintEndpoint",
    value: function paintEndpoint(endpoint, params) {
      function findConnectionToUseForDynamicAnchor(ep) {
        var idx = 0;
        if (params.elementWithPrecedence != null) {
          for (var i = 0; i < ep.connections.length; i++) {
            if (ep.connections[i].sourceId === params.elementWithPrecedence || ep.connections[i].targetId === params.elementWithPrecedence) {
              idx = i;
              break;
            }
          }
        }
        return ep.connections[idx];
      }
      params = params || {};
      var timestamp = params.timestamp,
          recalc = !(params.recalc === false);
      if (!timestamp || endpoint.timestamp !== timestamp) {
        var info = this.viewport.getPosition(endpoint.elementId);
        var xy = params.offset ? {
          x: params.offset.x,
          y: params.offset.y
        } : {
          x: info.x,
          y: info.y
        };
        if (xy != null) {
          var ap = params.anchorLoc;
          if (ap == null) {
            var anchorParams = {
              xy: xy,
              wh: info,
              element: endpoint,
              timestamp: timestamp
            };
            if (recalc && this.router.isDynamicAnchor(endpoint) && endpoint.connections.length > 0) {
              var _c3 = findConnectionToUseForDynamicAnchor(endpoint),
                  oIdx = _c3.endpoints[0] === endpoint ? 1 : 0,
                  oId = oIdx === 0 ? _c3.sourceId : _c3.targetId,
                  oInfo = this.viewport.getPosition(oId);
              anchorParams.index = oIdx === 0 ? 1 : 0;
              anchorParams.connection = _c3;
              anchorParams.txy = oInfo;
              anchorParams.twh = oInfo;
              anchorParams.tElement = _c3.endpoints[oIdx];
              anchorParams.tRotation = this._getRotations(oId);
            } else if (endpoint.connections.length > 0) {
              anchorParams.connection = endpoint.connections[0];
            }
            anchorParams.rotation = this._getRotations(endpoint.elementId);
            ap = this.router.computeAnchorLocation(endpoint._anchor, anchorParams);
          }
          endpoint.endpoint.compute(ap, this.router.getEndpointOrientation(endpoint), endpoint.paintStyleInUse);
          this.renderEndpoint(endpoint, endpoint.paintStyleInUse);
          endpoint.timestamp = timestamp;
          for (var i in endpoint.overlays) {
            if (endpoint.overlays.hasOwnProperty(i)) {
              var _o = endpoint.overlays[i];
              if (_o.isVisible()) {
                endpoint.overlayPlacements[i] = this.drawOverlay(_o, endpoint.endpoint, endpoint.paintStyleInUse, endpoint.getAbsoluteOverlayPosition(_o));
                this.paintOverlay(_o, endpoint.overlayPlacements[i], {
                  xmin: 0,
                  ymin: 0
                });
              }
            }
          }
        }
      }
    }
  }, {
    key: "paintConnection",
    value: function paintConnection(connection, params) {
      if (!this._suspendDrawing && connection.visible !== false) {
        params = params || {};
        var timestamp = params.timestamp;
        if (timestamp != null && timestamp === connection.lastPaintedAt) {
          return;
        }
        if (timestamp == null || timestamp !== connection.lastPaintedAt) {
          this.router.computePath(connection, timestamp);
          var overlayExtents = {
            xmin: Infinity,
            ymin: Infinity,
            xmax: -Infinity,
            ymax: -Infinity
          };
          for (var i in connection.overlays) {
            if (connection.overlays.hasOwnProperty(i)) {
              var _o2 = connection.overlays[i];
              if (_o2.isVisible()) {
                connection.overlayPlacements[i] = this.drawOverlay(_o2, connection.connector, connection.paintStyleInUse, connection.getAbsoluteOverlayPosition(_o2));
                overlayExtents.xmin = Math.min(overlayExtents.xmin, connection.overlayPlacements[i].xmin);
                overlayExtents.xmax = Math.max(overlayExtents.xmax, connection.overlayPlacements[i].xmax);
                overlayExtents.ymin = Math.min(overlayExtents.ymin, connection.overlayPlacements[i].ymin);
                overlayExtents.ymax = Math.max(overlayExtents.ymax, connection.overlayPlacements[i].ymax);
              }
            }
          }
          var lineWidth = parseFloat("" + connection.paintStyleInUse.strokeWidth || "1") / 2,
              outlineWidth = parseFloat("" + connection.paintStyleInUse.strokeWidth || "0"),
              _extents = {
            xmin: Math.min(connection.connector.bounds.xmin - (lineWidth + outlineWidth), overlayExtents.xmin),
            ymin: Math.min(connection.connector.bounds.ymin - (lineWidth + outlineWidth), overlayExtents.ymin),
            xmax: Math.max(connection.connector.bounds.xmax + (lineWidth + outlineWidth), overlayExtents.xmax),
            ymax: Math.max(connection.connector.bounds.ymax + (lineWidth + outlineWidth), overlayExtents.ymax)
          };
          this.paintConnector(connection.connector, connection.paintStyleInUse, _extents);
          for (var j in connection.overlays) {
            if (connection.overlays.hasOwnProperty(j)) {
              var _p2 = connection.overlays[j];
              if (_p2.isVisible()) {
                this.paintOverlay(_p2, connection.overlayPlacements[j], _extents);
              }
            }
          }
        }
        connection.lastPaintedAt = timestamp;
      }
    }
  }, {
    key: "refreshEndpoint",
    value: function refreshEndpoint(endpoint) {
      if (endpoint.connections.length > 0) {
        this.addEndpointClass(endpoint, this.endpointConnectedClass);
      } else {
        this.removeEndpointClass(endpoint, this.endpointConnectedClass);
      }
      if (endpoint.isFull()) {
        this.addEndpointClass(endpoint, this.endpointFullClass);
      } else {
        this.removeEndpointClass(endpoint, this.endpointFullClass);
      }
    }
  }, {
    key: "makeConnector",
    value: function makeConnector(connection, name, args) {
      return Connectors.get(connection, name, args);
    }
  }, {
    key: "getPathData",
    value: function getPathData(connector) {
      var p = "";
      for (var i = 0; i < connector.segments.length; i++) {
        p += connector.segments[i].getPath(i === 0);
        p += " ";
      }
      return p;
    }
  }]);
  return JsPlumbInstance;
}(EventGenerator);

var VERY_SMALL_VALUE = 0.0000000001;
function gentleRound(n) {
  var f = Math.floor(n),
      r = Math.ceil(n);
  if (n - f < VERY_SMALL_VALUE) {
    return f;
  } else if (r - n < VERY_SMALL_VALUE) {
    return r;
  }
  return n;
}
var ArcSegment = function (_AbstractSegment) {
  _inherits(ArcSegment, _AbstractSegment);
  var _super = _createSuper(ArcSegment);
  function ArcSegment(params) {
    var _this;
    _classCallCheck(this, ArcSegment);
    _this = _super.call(this, params);
    _defineProperty(_assertThisInitialized(_this), "type", ArcSegment.segmentType);
    _defineProperty(_assertThisInitialized(_this), "cx", void 0);
    _defineProperty(_assertThisInitialized(_this), "cy", void 0);
    _defineProperty(_assertThisInitialized(_this), "radius", void 0);
    _defineProperty(_assertThisInitialized(_this), "anticlockwise", void 0);
    _defineProperty(_assertThisInitialized(_this), "startAngle", void 0);
    _defineProperty(_assertThisInitialized(_this), "endAngle", void 0);
    _defineProperty(_assertThisInitialized(_this), "sweep", void 0);
    _defineProperty(_assertThisInitialized(_this), "length", void 0);
    _defineProperty(_assertThisInitialized(_this), "circumference", void 0);
    _defineProperty(_assertThisInitialized(_this), "frac", void 0);
    _this.cx = params.cx;
    _this.cy = params.cy;
    _this.radius = params.r;
    _this.anticlockwise = params.ac;
    if (params.startAngle && params.endAngle) {
      _this.startAngle = params.startAngle;
      _this.endAngle = params.endAngle;
      _this.x1 = _this.cx + _this.radius * Math.cos(_this.startAngle);
      _this.y1 = _this.cy + _this.radius * Math.sin(_this.startAngle);
      _this.x2 = _this.cx + _this.radius * Math.cos(_this.endAngle);
      _this.y2 = _this.cy + _this.radius * Math.sin(_this.endAngle);
    } else {
      _this.startAngle = _this._calcAngle(_this.x1, _this.y1);
      _this.endAngle = _this._calcAngle(_this.x2, _this.y2);
    }
    if (_this.endAngle < 0) {
      _this.endAngle += TWO_PI;
    }
    if (_this.startAngle < 0) {
      _this.startAngle += TWO_PI;
    }
    var ea = _this.endAngle < _this.startAngle ? _this.endAngle + TWO_PI : _this.endAngle;
    _this.sweep = Math.abs(ea - _this.startAngle);
    if (_this.anticlockwise) {
      _this.sweep = TWO_PI - _this.sweep;
    }
    _this.circumference = 2 * Math.PI * _this.radius;
    _this.frac = _this.sweep / TWO_PI;
    _this.length = _this.circumference * _this.frac;
    _this.extents = {
      xmin: _this.cx - _this.radius,
      xmax: _this.cx + _this.radius,
      ymin: _this.cy - _this.radius,
      ymax: _this.cy + _this.radius
    };
    return _this;
  }
  _createClass(ArcSegment, [{
    key: "_calcAngle",
    value: function _calcAngle(_x, _y) {
      return theta({
        x: this.cx,
        y: this.cy
      }, {
        x: _x,
        y: _y
      });
    }
  }, {
    key: "_calcAngleForLocation",
    value: function _calcAngleForLocation(segment, location) {
      if (segment.anticlockwise) {
        var sa = segment.startAngle < segment.endAngle ? segment.startAngle + TWO_PI : segment.startAngle,
            s = Math.abs(sa - segment.endAngle);
        return sa - s * location;
      } else {
        var ea = segment.endAngle < segment.startAngle ? segment.endAngle + TWO_PI : segment.endAngle,
            ss = Math.abs(ea - segment.startAngle);
        return segment.startAngle + ss * location;
      }
    }
  }, {
    key: "getPath",
    value: function getPath(isFirstSegment) {
      var laf = this.sweep > Math.PI ? 1 : 0,
          sf = this.anticlockwise ? 0 : 1;
      return (isFirstSegment ? "M" + this.x1 + " " + this.y1 + " " : "") + "A " + this.radius + " " + this.radius + " 0 " + laf + "," + sf + " " + this.x2 + " " + this.y2;
    }
  }, {
    key: "getLength",
    value: function getLength() {
      return this.length;
    }
  }, {
    key: "pointOnPath",
    value: function pointOnPath(location, absolute) {
      if (location === 0) {
        return {
          x: this.x1,
          y: this.y1,
          theta: this.startAngle
        };
      } else if (location === 1) {
        return {
          x: this.x2,
          y: this.y2,
          theta: this.endAngle
        };
      }
      if (absolute) {
        location = location / length;
      }
      var angle = this._calcAngleForLocation(this, location),
          _x = this.cx + this.radius * Math.cos(angle),
          _y = this.cy + this.radius * Math.sin(angle);
      return {
        x: gentleRound(_x),
        y: gentleRound(_y),
        theta: angle
      };
    }
  }, {
    key: "gradientAtPoint",
    value: function gradientAtPoint(location, absolute) {
      var p = this.pointOnPath(location, absolute);
      var m = normal({
        x: this.cx,
        y: this.cy
      }, p);
      if (!this.anticlockwise && (m === Infinity || m === -Infinity)) {
        m *= -1;
      }
      return m;
    }
  }, {
    key: "pointAlongPathFrom",
    value: function pointAlongPathFrom(location, distance, absolute) {
      var p = this.pointOnPath(location, absolute),
          arcSpan = distance / this.circumference * 2 * Math.PI,
          dir = this.anticlockwise ? -1 : 1,
          startAngle = p.theta + dir * arcSpan,
          startX = this.cx + this.radius * Math.cos(startAngle),
          startY = this.cy + this.radius * Math.sin(startAngle);
      return {
        x: startX,
        y: startY
      };
    }
  }]);
  return ArcSegment;
}(AbstractSegment);
_defineProperty(ArcSegment, "segmentType", "Arc");

var DEFAULT_WIDTH = 20;
var DEFAULT_LENGTH = 20;
var ArrowOverlay = function (_Overlay) {
  _inherits(ArrowOverlay, _Overlay);
  var _super = _createSuper(ArrowOverlay);
  function ArrowOverlay(instance, component, p) {
    var _this;
    _classCallCheck(this, ArrowOverlay);
    _this = _super.call(this, instance, component, p);
    _this.instance = instance;
    _this.component = component;
    _defineProperty(_assertThisInitialized(_this), "width", void 0);
    _defineProperty(_assertThisInitialized(_this), "length", void 0);
    _defineProperty(_assertThisInitialized(_this), "foldback", void 0);
    _defineProperty(_assertThisInitialized(_this), "direction", void 0);
    _defineProperty(_assertThisInitialized(_this), "location", 0.5);
    _defineProperty(_assertThisInitialized(_this), "paintStyle", void 0);
    _defineProperty(_assertThisInitialized(_this), "type", ArrowOverlay.type);
    _defineProperty(_assertThisInitialized(_this), "cachedDimensions", void 0);
    p = p || {};
    _this.width = p.width || DEFAULT_WIDTH;
    _this.length = p.length || DEFAULT_LENGTH;
    _this.direction = (p.direction || 1) < 0 ? -1 : 1;
    _this.foldback = p.foldback || 0.623;
    _this.paintStyle = p.paintStyle || {
      "strokeWidth": 1
    };
    _this.location = p.location == null ? _this.location : Array.isArray(p.location) ? p.location[0] : p.location;
    return _this;
  }
  _createClass(ArrowOverlay, [{
    key: "draw",
    value: function draw(component, currentConnectionPaintStyle, absolutePosition) {
      if (component instanceof AbstractConnector) {
        var connector = component;
        var hxy, mid, txy, tail, cxy;
        if (this.location > 1 || this.location < 0) {
          var fromLoc = this.location < 0 ? 1 : 0;
          hxy = connector.pointAlongPathFrom(fromLoc, this.location, false);
          mid = connector.pointAlongPathFrom(fromLoc, this.location - this.direction * this.length / 2, false);
          txy = pointOnLine(hxy, mid, this.length);
        } else if (this.location === 1) {
          hxy = connector.pointOnPath(this.location);
          mid = connector.pointAlongPathFrom(this.location, -this.length);
          txy = pointOnLine(hxy, mid, this.length);
          if (this.direction === -1) {
            var _ = txy;
            txy = hxy;
            hxy = _;
          }
        } else if (this.location === 0) {
          txy = connector.pointOnPath(this.location);
          mid = connector.pointAlongPathFrom(this.location, this.length);
          hxy = pointOnLine(txy, mid, this.length);
          if (this.direction === -1) {
            var __ = txy;
            txy = hxy;
            hxy = __;
          }
        } else {
          hxy = connector.pointAlongPathFrom(this.location, this.direction * this.length / 2);
          mid = connector.pointOnPath(this.location);
          txy = pointOnLine(hxy, mid, this.length);
        }
        tail = perpendicularLineTo(hxy, txy, this.width);
        cxy = pointOnLine(hxy, txy, this.foldback * this.length);
        var d = {
          hxy: hxy,
          tail: tail,
          cxy: cxy
        },
            stroke = this.paintStyle.stroke || currentConnectionPaintStyle.stroke,
            fill = this.paintStyle.fill || currentConnectionPaintStyle.stroke,
            lineWidth = this.paintStyle.strokeWidth || currentConnectionPaintStyle.strokeWidth;
        return {
          component: component,
          d: d,
          "stroke-width": lineWidth,
          stroke: stroke,
          fill: fill,
          xmin: Math.min(hxy.x, tail[0].x, tail[1].x),
          xmax: Math.max(hxy.x, tail[0].x, tail[1].x),
          ymin: Math.min(hxy.y, tail[0].y, tail[1].y),
          ymax: Math.max(hxy.y, tail[0].y, tail[1].y)
        };
      }
    }
  }, {
    key: "updateFrom",
    value: function updateFrom(d) {}
  }]);
  return ArrowOverlay;
}(Overlay);
_defineProperty(ArrowOverlay, "type", "Arrow");
function isArrowOverlay(o) {
  return o.type === ArrowOverlay.type;
}
OverlayFactory.register(ArrowOverlay.type, ArrowOverlay);

var PlainArrowOverlay = function (_ArrowOverlay) {
  _inherits(PlainArrowOverlay, _ArrowOverlay);
  var _super = _createSuper(PlainArrowOverlay);
  function PlainArrowOverlay(instance, component, p) {
    var _this;
    _classCallCheck(this, PlainArrowOverlay);
    _this = _super.call(this, instance, component, p);
    _this.instance = instance;
    _defineProperty(_assertThisInitialized(_this), "type", PlainArrowOverlay.type);
    _this.foldback = 1;
    return _this;
  }
  return PlainArrowOverlay;
}(ArrowOverlay);
_defineProperty(PlainArrowOverlay, "type", "PlainArrow");
function isPlainArrowOverlay(o) {
  return o.type === PlainArrowOverlay.type;
}
OverlayFactory.register("PlainArrow", PlainArrowOverlay);

var DiamondOverlay = function (_ArrowOverlay) {
  _inherits(DiamondOverlay, _ArrowOverlay);
  var _super = _createSuper(DiamondOverlay);
  function DiamondOverlay(instance, component, p) {
    var _this;
    _classCallCheck(this, DiamondOverlay);
    _this = _super.call(this, instance, component, p);
    _this.instance = instance;
    _defineProperty(_assertThisInitialized(_this), "type", DiamondOverlay.type);
    _this.length = _this.length / 2;
    _this.foldback = 2;
    return _this;
  }
  return DiamondOverlay;
}(ArrowOverlay);
_defineProperty(DiamondOverlay, "type", "Diamond");
function isDiamondOverlay(o) {
  return o.type === DiamondOverlay.type;
}
OverlayFactory.register(DiamondOverlay.type, DiamondOverlay);

var CustomOverlay = function (_Overlay) {
  _inherits(CustomOverlay, _Overlay);
  var _super = _createSuper(CustomOverlay);
  function CustomOverlay(instance, component, p) {
    var _this;
    _classCallCheck(this, CustomOverlay);
    _this = _super.call(this, instance, component, p);
    _this.instance = instance;
    _this.component = component;
    _defineProperty(_assertThisInitialized(_this), "create", void 0);
    _defineProperty(_assertThisInitialized(_this), "type", CustomOverlay.type);
    _this.create = p.create;
    return _this;
  }
  _createClass(CustomOverlay, [{
    key: "updateFrom",
    value: function updateFrom(d) {}
  }]);
  return CustomOverlay;
}(Overlay);
_defineProperty(CustomOverlay, "type", "Custom");
function isCustomOverlay(o) {
  return o.type === CustomOverlay.type;
}
OverlayFactory.register("Custom", CustomOverlay);

EndpointFactory.registerHandler(DotEndpointHandler);
EndpointFactory.registerHandler(RectangleEndpointHandler);
EndpointFactory.registerHandler(BlankEndpointHandler);
Connectors.register(StraightConnector.type, StraightConnector);

export { ABSOLUTE, ATTRIBUTE_GROUP, ATTRIBUTE_MANAGED, ATTRIBUTE_NOT_DRAGGABLE, ATTRIBUTE_SCOPE, ATTRIBUTE_SCOPE_PREFIX, ATTRIBUTE_TABINDEX, AbstractConnector, ArcSegment, ArrowOverlay, BLOCK, BOTTOM, BlankEndpoint, BlankEndpointHandler, CHECK_CONDITION, CHECK_DROP_ALLOWED, CLASS_CONNECTED, CLASS_CONNECTOR, CLASS_CONNECTOR_OUTLINE, CLASS_ENDPOINT, CLASS_ENDPOINT_ANCHOR_PREFIX, CLASS_ENDPOINT_CONNECTED, CLASS_ENDPOINT_DROP_ALLOWED, CLASS_ENDPOINT_DROP_FORBIDDEN, CLASS_ENDPOINT_FULL, CLASS_GROUP_COLLAPSED, CLASS_GROUP_EXPANDED, CLASS_OVERLAY, Component, Connection, ConnectionDragSelector, ConnectionSelection, Connectors, CustomOverlay, DiamondOverlay, DotEndpoint, DotEndpointHandler, ERROR_SOURCE_DOES_NOT_EXIST, ERROR_SOURCE_ENDPOINT_FULL, ERROR_TARGET_DOES_NOT_EXIST, ERROR_TARGET_ENDPOINT_FULL, EVENT_ANCHOR_CHANGED, EVENT_CONNECTION, EVENT_CONNECTION_DETACHED, EVENT_CONNECTION_MOVED, EVENT_CONTAINER_CHANGE, EVENT_ENDPOINT_REPLACED, EVENT_GROUP_ADDED, EVENT_GROUP_COLLAPSE, EVENT_GROUP_EXPAND, EVENT_GROUP_MEMBER_ADDED, EVENT_GROUP_MEMBER_REMOVED, EVENT_GROUP_REMOVED, EVENT_INTERNAL_CONNECTION, EVENT_INTERNAL_CONNECTION_DETACHED, EVENT_INTERNAL_ENDPOINT_UNREGISTERED, EVENT_MANAGE_ELEMENT, EVENT_MAX_CONNECTIONS, EVENT_NESTED_GROUP_ADDED, EVENT_NESTED_GROUP_REMOVED, EVENT_UNMANAGE_ELEMENT, EVENT_ZOOM, Endpoint, EndpointFactory, EndpointRepresentation, EndpointSelection, FIXED, GroupManager, INTERCEPT_BEFORE_DETACH, INTERCEPT_BEFORE_DRAG, INTERCEPT_BEFORE_DROP, INTERCEPT_BEFORE_START_DETACH, IS_DETACH_ALLOWED, JsPlumbInstance, KEY_CONNECTION_OVERLAYS, LEFT, LabelOverlay, LightweightFloatingAnchor, LightweightRouter, NONE, Overlay, OverlayFactory, PlainArrowOverlay, REDROP_POLICY_ANY, REDROP_POLICY_STRICT, RIGHT, RectangleEndpoint, RectangleEndpointHandler, SELECTOR_MANAGED_ELEMENT, SOURCE, SOURCE_INDEX, STATIC, SourceSelector, StraightConnector, StraightSegment, TARGET, TARGET_INDEX, TOP, TargetSelector, UIGroup, UINode, Viewport, X_AXIS_FACES, Y_AXIS_FACES, _createPerimeterAnchor, _removeTypeCssHelper, _updateHoverStyle, att, classList, cls, convertToFullOverlaySpec, createFloatingAnchor, getDefaultFace, isArrowOverlay, isContinuous, isCustomOverlay, isDiamondOverlay, isDynamic, isEdgeSupported, _isFloating as isFloating, isFullOverlaySpec, isLabelOverlay, isPlainArrowOverlay, makeLightweightAnchorFromSpec };
