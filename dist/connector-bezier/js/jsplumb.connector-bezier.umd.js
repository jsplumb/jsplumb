(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@jsplumb/util'), require('@jsplumb/core'), require('@jsplumb/bezier')) :
  typeof define === 'function' && define.amd ? define(['exports', '@jsplumb/util', '@jsplumb/core', '@jsplumb/bezier'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jsPlumbConnectorBezier = {}, global.jsPlumbUtil, global.jsPlumb, global.jsPlumbBezier));
}(this, (function (exports, util, core, bezier) { 'use strict';

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

  var AbstractBezierConnector =
  function (_AbstractConnector) {
    _inherits(AbstractBezierConnector, _AbstractConnector);
    _createClass(AbstractBezierConnector, [{
      key: "getDefaultStubs",
      value: function getDefaultStubs() {
        return [0, 0];
      }
    }]);
    function AbstractBezierConnector(connection, params) {
      var _this;
      _classCallCheck(this, AbstractBezierConnector);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractBezierConnector).call(this, connection, params));
      _this.connection = connection;
      _defineProperty(_assertThisInitialized(_this), "showLoopback", void 0);
      _defineProperty(_assertThisInitialized(_this), "curviness", void 0);
      _defineProperty(_assertThisInitialized(_this), "margin", void 0);
      _defineProperty(_assertThisInitialized(_this), "proximityLimit", void 0);
      _defineProperty(_assertThisInitialized(_this), "orientation", void 0);
      _defineProperty(_assertThisInitialized(_this), "loopbackRadius", void 0);
      _defineProperty(_assertThisInitialized(_this), "clockwise", void 0);
      _defineProperty(_assertThisInitialized(_this), "isLoopbackCurrently", void 0);
      _defineProperty(_assertThisInitialized(_this), "geometry", void 0);
      params = params || {};
      _this.showLoopback = params.showLoopback !== false;
      _this.curviness = params.curviness || 10;
      _this.margin = params.margin || 5;
      _this.proximityLimit = params.proximityLimit || 80;
      _this.clockwise = params.orientation && params.orientation === "clockwise";
      _this.loopbackRadius = params.loopbackRadius || 25;
      _this.isLoopbackCurrently = false;
      return _this;
    }
    _createClass(AbstractBezierConnector, [{
      key: "_compute",
      value: function _compute(paintInfo, p) {
        var sp = p.sourcePos,
            tp = p.targetPos,
            _w = Math.abs(sp.curX - tp.curX),
            _h = Math.abs(sp.curY - tp.curY);
        if (!this.showLoopback || p.sourceEndpoint.elementId !== p.targetEndpoint.elementId) {
          this.isLoopbackCurrently = false;
          this._computeBezier(paintInfo, p, sp, tp, _w, _h);
        } else {
          this.isLoopbackCurrently = true;
          var x1 = p.sourcePos.curX,
              y1 = p.sourcePos.curY - this.margin,
              cx = x1,
              cy = y1 - this.loopbackRadius,
          _x = cx - this.loopbackRadius,
              _y = cy - this.loopbackRadius;
          _w = 2 * this.loopbackRadius;
          _h = 2 * this.loopbackRadius;
          paintInfo.points[0] = _x;
          paintInfo.points[1] = _y;
          paintInfo.points[2] = _w;
          paintInfo.points[3] = _h;
          this._addSegment(core.ArcSegment, {
            loopback: true,
            x1: x1 - _x + 4,
            y1: y1 - _y,
            startAngle: 0,
            endAngle: 2 * Math.PI,
            r: this.loopbackRadius,
            ac: !this.clockwise,
            x2: x1 - _x - 4,
            y2: y1 - _y,
            cx: cx - _x,
            cy: cy - _y
          });
        }
      }
    }, {
      key: "exportGeometry",
      value: function exportGeometry() {
        if (this.geometry == null) {
          return null;
        } else {
          var s = [],
              t = [],
              cp1 = [],
              cp2 = [];
          Array.prototype.push.apply(s, this.geometry.source);
          Array.prototype.push.apply(t, this.geometry.target);
          Array.prototype.push.apply(cp1, this.geometry.controlPoints[0]);
          Array.prototype.push.apply(cp2, this.geometry.controlPoints[1]);
          return {
            source: s,
            target: t,
            controlPoints: [cp1, cp2]
          };
        }
      }
    }, {
      key: "importGeometry",
      value: function importGeometry(geometry) {
        if (geometry != null) {
          if (geometry.controlPoints == null || geometry.controlPoints.length != 2) {
            util.log("jsPlumb Bezier: cannot import geometry; controlPoints missing or does not have length 2");
            this.setGeometry(null, true);
            return false;
          }
          if (geometry.controlPoints[0].length != 2 || geometry.controlPoints[1].length != 2) {
            util.log("jsPlumb Bezier: cannot import geometry; controlPoints malformed");
            this.setGeometry(null, true);
            return false;
          }
          if (geometry.source == null || geometry.source.length != 4) {
            util.log("jsPlumb Bezier: cannot import geometry; source missing or malformed");
            this.setGeometry(null, true);
            return false;
          }
          if (geometry.target == null || geometry.target.length != 4) {
            util.log("jsPlumb Bezier: cannot import geometry; target missing or malformed");
            this.setGeometry(null, true);
            return false;
          }
          this.setGeometry(geometry, false);
          return true;
        } else {
          return false;
        }
      }
    }]);
    return AbstractBezierConnector;
  }(core.AbstractConnector);

  var BezierConnector =
  function (_AbstractBezierConnec) {
    _inherits(BezierConnector, _AbstractBezierConnec);
    function BezierConnector(connection, params) {
      var _this;
      _classCallCheck(this, BezierConnector);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(BezierConnector).call(this, connection, params));
      _this.connection = connection;
      _defineProperty(_assertThisInitialized(_this), "type", BezierConnector.type);
      _defineProperty(_assertThisInitialized(_this), "majorAnchor", void 0);
      _defineProperty(_assertThisInitialized(_this), "minorAnchor", void 0);
      params = params || {};
      _this.majorAnchor = params.curviness || 150;
      _this.minorAnchor = 10;
      return _this;
    }
    _createClass(BezierConnector, [{
      key: "getCurviness",
      value: function getCurviness() {
        return this.majorAnchor;
      }
    }, {
      key: "_findControlPoint",
      value: function _findControlPoint(point, sourceAnchorPosition, targetAnchorPosition, soo, too) {
        var perpendicular = soo[0] !== too[0] || soo[1] === too[1],
            p = [];
        if (!perpendicular) {
          if (soo[0] === 0) {
            p.push(sourceAnchorPosition[0] < targetAnchorPosition[0] ? point[0] + this.minorAnchor : point[0] - this.minorAnchor);
          } else {
            p.push(point[0] - this.majorAnchor * soo[0]);
          }
          if (soo[1] === 0) {
            p.push(sourceAnchorPosition[1] < targetAnchorPosition[1] ? point[1] + this.minorAnchor : point[1] - this.minorAnchor);
          } else {
            p.push(point[1] + this.majorAnchor * too[1]);
          }
        } else {
          if (too[0] === 0) {
            p.push(targetAnchorPosition[0] < sourceAnchorPosition[0] ? point[0] + this.minorAnchor : point[0] - this.minorAnchor);
          } else {
            p.push(point[0] + this.majorAnchor * too[0]);
          }
          if (too[1] === 0) {
            p.push(targetAnchorPosition[1] < sourceAnchorPosition[1] ? point[1] + this.minorAnchor : point[1] - this.minorAnchor);
          } else {
            p.push(point[1] + this.majorAnchor * soo[1]);
          }
        }
        return p;
      }
    }, {
      key: "_computeBezier",
      value: function _computeBezier(paintInfo, p, sp, tp, _w, _h) {
        var _CP,
            _CP2,
            _sx = sp.curX < tp.curX ? _w : 0,
            _sy = sp.curY < tp.curY ? _h : 0,
            _tx = sp.curX < tp.curX ? 0 : _w,
            _ty = sp.curY < tp.curY ? 0 : _h;
        if (this.edited !== true) {
          _CP = this._findControlPoint([_sx, _sy], sp, tp, paintInfo.so, paintInfo.to);
          _CP2 = this._findControlPoint([_tx, _ty], tp, sp, paintInfo.to, paintInfo.so);
        } else {
          _CP = this.geometry.controlPoints[0];
          _CP2 = this.geometry.controlPoints[1];
        }
        this.geometry = {
          controlPoints: [_CP, _CP2],
          source: p.sourcePos,
          target: p.targetPos
        };
        this._addSegment(bezier.BezierSegment, {
          x1: _sx,
          y1: _sy,
          x2: _tx,
          y2: _ty,
          cp1x: _CP[0],
          cp1y: _CP[1],
          cp2x: _CP2[0],
          cp2y: _CP2[1]
        });
      }
    }]);
    return BezierConnector;
  }(AbstractBezierConnector);
  _defineProperty(BezierConnector, "type", "Bezier");

  function _segment(x1, y1, x2, y2) {
    if (x1 <= x2 && y2 <= y1) {
      return 1;
    } else if (x1 <= x2 && y1 <= y2) {
      return 2;
    } else if (x2 <= x1 && y2 >= y1) {
      return 3;
    }
    return 4;
  }
  function _findControlPoint(midx, midy, segment, sourceEdge, targetEdge, dx, dy, distance, proximityLimit) {
    if (distance <= proximityLimit) {
      return [midx, midy];
    }
    if (segment === 1) {
      if (sourceEdge.curY <= 0 && targetEdge.curY >= 1) {
        return [midx + (sourceEdge.x < 0.5 ? -1 * dx : dx), midy];
      } else if (sourceEdge.curX >= 1 && targetEdge.curX <= 0) {
        return [midx, midy + (sourceEdge.y < 0.5 ? -1 * dy : dy)];
      } else {
        return [midx + -1 * dx, midy + -1 * dy];
      }
    } else if (segment === 2) {
      if (sourceEdge.curY >= 1 && targetEdge.curY <= 0) {
        return [midx + (sourceEdge.x < 0.5 ? -1 * dx : dx), midy];
      } else if (sourceEdge.curX >= 1 && targetEdge.curX <= 0) {
        return [midx, midy + (sourceEdge.y < 0.5 ? -1 * dy : dy)];
      } else {
        return [midx + dx, midy + -1 * dy];
      }
    } else if (segment === 3) {
      if (sourceEdge.curY >= 1 && targetEdge.curY <= 0) {
        return [midx + (sourceEdge.x < 0.5 ? -1 * dx : dx), midy];
      } else if (sourceEdge.curX <= 0 && targetEdge.curX >= 1) {
        return [midx, midy + (sourceEdge.y < 0.5 ? -1 * dy : dy)];
      } else {
        return [midx + -1 * dx, midy + -1 * dy];
      }
    } else if (segment === 4) {
      if (sourceEdge.curY <= 0 && targetEdge.curY >= 1) {
        return [midx + (sourceEdge.x < 0.5 ? -1 * dx : dx), midy];
      } else if (sourceEdge.curX <= 0 && targetEdge.curX >= 1) {
        return [midx, midy + (sourceEdge.y < 0.5 ? -1 * dy : dy)];
      } else {
        return [midx + dx, midy + -1 * dy];
      }
    }
  }
  var StateMachineConnector =
  function (_AbstractBezierConnec) {
    _inherits(StateMachineConnector, _AbstractBezierConnec);
    function StateMachineConnector(connection, params) {
      var _this;
      _classCallCheck(this, StateMachineConnector);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(StateMachineConnector).call(this, connection, params));
      _this.connection = connection;
      _defineProperty(_assertThisInitialized(_this), "type", StateMachineConnector.type);
      _defineProperty(_assertThisInitialized(_this), "_controlPoint", void 0);
      _defineProperty(_assertThisInitialized(_this), "proximityLimit", void 0);
      _this.curviness = params.curviness || 10;
      _this.margin = params.margin || 5;
      _this.proximityLimit = params.proximityLimit || 80;
      _this.clockwise = params.orientation && params.orientation === "clockwise";
      return _this;
    }
    _createClass(StateMachineConnector, [{
      key: "_computeBezier",
      value: function _computeBezier(paintInfo, params, sp, tp, w, h) {
        var _sx = sp.curX < tp.curX ? 0 : w,
            _sy = sp.curY < tp.curY ? 0 : h,
            _tx = sp.curX < tp.curX ? w : 0,
            _ty = sp.curY < tp.curY ? h : 0;
        if (sp.x === 0) {
          _sx -= this.margin;
        }
        if (sp.x === 1) {
          _sx += this.margin;
        }
        if (sp.y === 0) {
          _sy -= this.margin;
        }
        if (sp.y === 1) {
          _sy += this.margin;
        }
        if (tp.x === 0) {
          _tx -= this.margin;
        }
        if (tp.x === 1) {
          _tx += this.margin;
        }
        if (tp.y === 0) {
          _ty -= this.margin;
        }
        if (tp.y === 1) {
          _ty += this.margin;
        }
        if (this.edited !== true) {
          var _midx = (_sx + _tx) / 2,
              _midy = (_sy + _ty) / 2,
              segment = _segment(_sx, _sy, _tx, _ty),
              distance = Math.sqrt(Math.pow(_tx - _sx, 2) + Math.pow(_ty - _sy, 2));
          this._controlPoint = _findControlPoint(_midx, _midy, segment, params.sourcePos, params.targetPos, this.curviness, this.curviness, distance, this.proximityLimit);
        } else {
          this._controlPoint = this.geometry.controlPoints[0];
        }
        var cp1x, cp2x, cp1y, cp2y;
        cp1x = this._controlPoint[0];
        cp2x = this._controlPoint[0];
        cp1y = this._controlPoint[1];
        cp2y = this._controlPoint[1];
        this.geometry = {
          controlPoints: [this._controlPoint, this._controlPoint],
          source: params.sourcePos,
          target: params.targetPos
        };
        this._addSegment(bezier.BezierSegment, {
          x1: _tx,
          y1: _ty,
          x2: _sx,
          y2: _sy,
          cp1x: cp1x,
          cp1y: cp1y,
          cp2x: cp2x,
          cp2y: cp2y
        });
      }
    }]);
    return StateMachineConnector;
  }(AbstractBezierConnector);
  _defineProperty(StateMachineConnector, "type", "StateMachine");

  core.Connectors.register(BezierConnector.type, BezierConnector);
  core.Connectors.register(StateMachineConnector.type, StateMachineConnector);

  exports.AbstractBezierConnector = AbstractBezierConnector;
  exports.BezierConnector = BezierConnector;
  exports.StateMachineConnector = StateMachineConnector;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
