var PerimeterAnchorShapes;
(function (PerimeterAnchorShapes) {
  PerimeterAnchorShapes["Circle"] = "Circle";
  PerimeterAnchorShapes["Ellipse"] = "Ellipse";
  PerimeterAnchorShapes["Triangle"] = "Triangle";
  PerimeterAnchorShapes["Diamond"] = "Diamond";
  PerimeterAnchorShapes["Rectangle"] = "Rectangle";
  PerimeterAnchorShapes["Square"] = "Square";
})(PerimeterAnchorShapes || (PerimeterAnchorShapes = {}));
var AnchorLocations;
(function (AnchorLocations) {
  AnchorLocations["Assign"] = "Assign";
  AnchorLocations["AutoDefault"] = "AutoDefault";
  AnchorLocations["Bottom"] = "Bottom";
  AnchorLocations["BottomLeft"] = "BottomLeft";
  AnchorLocations["BottomRight"] = "BottomRight";
  AnchorLocations["Center"] = "Center";
  AnchorLocations["Continuous"] = "Continuous";
  AnchorLocations["ContinuousBottom"] = "ContinuousBottom";
  AnchorLocations["ContinuousLeft"] = "ContinuousLeft";
  AnchorLocations["ContinuousRight"] = "ContinuousRight";
  AnchorLocations["ContinuousTop"] = "ContinuousTop";
  AnchorLocations["ContinuousLeftRight"] = "ContinuousLeftRight";
  AnchorLocations["ContinuousTopBottom"] = "ContinuousTopBottom";
  AnchorLocations["Left"] = "Left";
  AnchorLocations["Perimeter"] = "Perimeter";
  AnchorLocations["Right"] = "Right";
  AnchorLocations["Top"] = "Top";
  AnchorLocations["TopLeft"] = "TopLeft";
  AnchorLocations["TopRight"] = "TopRight";
})(AnchorLocations || (AnchorLocations = {}));

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

function noSuchPoint() {
  return {
    d: Infinity,
    x: null,
    y: null,
    l: null,
    x1: null,
    y1: null,
    x2: null,
    y2: null
  };
}
function EMPTY_BOUNDS() {
  return {
    xmin: Infinity,
    xmax: -Infinity,
    ymin: Infinity,
    ymax: -Infinity
  };
}
var AbstractSegment = function () {
  function AbstractSegment(params) {
    _classCallCheck(this, AbstractSegment);
    this.params = params;
    _defineProperty(this, "x1", void 0);
    _defineProperty(this, "x2", void 0);
    _defineProperty(this, "y1", void 0);
    _defineProperty(this, "y2", void 0);
    _defineProperty(this, "extents", EMPTY_BOUNDS());
    _defineProperty(this, "type", void 0);
    this.x1 = params.x1;
    this.y1 = params.y1;
    this.x2 = params.x2;
    this.y2 = params.y2;
  }
  _createClass(AbstractSegment, [{
    key: "findClosestPointOnPath",
    value: function findClosestPointOnPath(x, y) {
      return noSuchPoint();
    }
  }, {
    key: "lineIntersection",
    value: function lineIntersection(x1, y1, x2, y2) {
      return [];
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
  }, {
    key: "boundingBoxIntersection",
    value: function boundingBoxIntersection(box) {
      return this.boxIntersection(box.x, box.y, box.w, box.h);
    }
  }]);
  return AbstractSegment;
}();

var UNDEFINED = "undefined";
var DEFAULT = "default";
var TRUE = "true";
var FALSE = "false";
var WILDCARD = "*";

export { AbstractSegment, AnchorLocations, DEFAULT, EMPTY_BOUNDS, FALSE, PerimeterAnchorShapes, TRUE, UNDEFINED, WILDCARD };
