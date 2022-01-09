'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var browserUi = require('@jsplumb/browser-ui');
var util = require('@jsplumb/util');

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

function _randomEvent() {
  var x = Math.floor(Math.random() * 2000),
      y = Math.floor(Math.random() * 2000);
  return {
    clientX: x,
    clientY: y,
    screenX: x,
    screenY: y,
    pageX: x,
    pageY: y
  };
}
var _distantPointEvent = {
  clientX: 50000,
  clientY: 50000,
  screenX: 50000,
  screenY: 50000,
  pageX: 50000,
  pageY: 50000
};
var lut = [];
for (var i = 0; i < 256; i++) {
  lut[i] = (i < 16 ? '0' : '') + i.toString(16);
}
var VERY_SMALL_NUMBER = 0.00000000001;
var BrowserUITestSupport = function () {
  function BrowserUITestSupport(_jsPlumb, ok, equal) {
    _classCallCheck(this, BrowserUITestSupport);
    this._jsPlumb = _jsPlumb;
    this.ok = ok;
    this.equal = equal;
    _defineProperty(this, "_divs", []);
    _defineProperty(this, "mottle", void 0);
    _defineProperty(this, "isTargetAttribute", "data-jtk-target");
    _defineProperty(this, "isSourceAttribute", "data-jtk-source");
    _defineProperty(this, "droppableClass", "jtk-droppable");
    this.mottle = new browserUi.EventManager();
  }
  _createClass(BrowserUITestSupport, [{
    key: "_t",
    value: function _t(el, evt, x, y) {
      this.mottle.trigger(el, evt, {
        pageX: x,
        pageY: y,
        screenX: x,
        screenY: y,
        clientX: x,
        clientY: y
      });
    }
  }, {
    key: "addDiv",
    value: function addDiv(id, parent, className, x, y, w, h) {
      var d1 = document.createElement("div");
      d1.style.position = "absolute";
      d1.innerHTML = id;
      if (parent) parent.appendChild(d1);else this._jsPlumb.getContainer().appendChild(d1);
      d1.setAttribute("id", id);
      d1.style.left = (x != null ? x : Math.floor(Math.random() * 1000)) + "px";
      d1.style.top = (y != null ? y : Math.floor(Math.random() * 1000)) + "px";
      if (className) d1.className = className;
      if (w) d1.style.width = w + "px";
      if (h) d1.style.height = h + "px";
      this._divs.push(id);
      return d1;
    }
  }, {
    key: "addDivs",
    value: function addDivs(ids, parent) {
      for (var _i = 0; _i < ids.length; _i++) {
        this.addDiv(ids[_i], parent);
      }
    }
  }, {
    key: "assertEndpointCount",
    value: function assertEndpointCount(el, count) {
      var ep = this._jsPlumb.getEndpoints(el),
          epl = ep ? ep.length : 0;
      this.equal(epl, count, el.getAttribute("data-jtk-managed") + " has " + count + (count > 1 || count == 0 ? " endpoints" : " endpoint"));
    }
  }, {
    key: "_assertManagedEndpointCount",
    value: function _assertManagedEndpointCount(el, count) {
      var id = this._jsPlumb.getId(el),
          _mel = this._jsPlumb._managedElements[id];
      this.equal(_mel.endpoints.length, count, id + " has " + count + " endpoints in managed record");
    }
  }, {
    key: "_assertManagedConnectionCount",
    value: function _assertManagedConnectionCount(el, count) {
      var id = this._jsPlumb.getId(el),
          _mel = this._jsPlumb._managedElements[id];
      this.equal(_mel.connections.length, count, id + " has " + count + " connections in managed record");
    }
  }, {
    key: "_registerDiv",
    value: function _registerDiv(div) {
      this._divs.push(div);
    }
  }, {
    key: "makeDragStartEvt",
    value: function makeDragStartEvt(el) {
      var e = this.makeEvent(el),
          c = this._jsPlumb.getContainer();
      e.clientX += c.offsetLeft;
      e.screenX += c.offsetLeft;
      e.pageX += c.offsetLeft;
      e.clientY += c.offsetTop;
      e.screenY += c.offsetTop;
      e.pageY += c.offsetTop;
      return e;
    }
  }, {
    key: "getAttribute",
    value: function getAttribute(el, att) {
      return el.getAttribute(att);
    }
  }, {
    key: "dragNodeBy",
    value: function dragNodeBy(el, x, y, events) {
      events = events || {};
      if (events.before) events.before();
      var downEvent = this.makeEvent(el);
      this._jsPlumb.trigger(el, browserUi.EVENT_MOUSEDOWN, downEvent);
      if (events.beforeMouseMove) {
        events.beforeMouseMove();
      }
      this._t(document, browserUi.EVENT_MOUSEMOVE, downEvent.pageX + x, downEvent.pageY + y);
      if (events.beforeMouseUp) {
        events.beforeMouseUp();
      }
      this.mottle.trigger(document, browserUi.EVENT_MOUSEUP, null);
      if (events.after) events.after();
    }
  }, {
    key: "dragNodeTo",
    value: function dragNodeTo(el, x, y, events) {
      events = events || {};
      var size = this._jsPlumb.getSize(el);
      if (events.before) events.before();
      var downEvent = this.makeEvent(el);
      this._jsPlumb.trigger(el, browserUi.EVENT_MOUSEDOWN, downEvent);
      var cb = this._jsPlumb.getContainer().getBoundingClientRect();
      if (events.beforeMouseMove) {
        events.beforeMouseMove();
      }
      this._t(document, browserUi.EVENT_MOUSEMOVE, cb.x + x + size.w / 2, cb.y + y + size.h / 2);
      if (events.beforeMouseUp) {
        events.beforeMouseUp();
      }
      this.mottle.trigger(document, browserUi.EVENT_MOUSEUP, null);
      if (events.after) events.after();
    }
  }, {
    key: "dragToGroup",
    value: function dragToGroup(el, targetGroupId, events) {
      var targetGroup = this._jsPlumb.getGroup(targetGroupId);
      var tgo = this._jsPlumb.getOffset(targetGroup.el),
          tgs = this._jsPlumb.getSize(targetGroup.el),
          tx = tgo.x + tgs.w / 2,
          ty = tgo.y + tgs.h / 2;
      this.dragNodeTo(el, tx, ty, events);
    }
  }, {
    key: "aSyncDragNodeBy",
    value: function aSyncDragNodeBy(el, x, y, events) {
      var _this = this;
      events = events || {};
      if (events.before) {
        events.before();
      }
      var downEvent = this.makeEvent(el);
      this._jsPlumb.trigger(el, browserUi.EVENT_MOUSEDOWN, downEvent);
      if (events.beforeMouseMove) {
        events.beforeMouseMove();
      }
      setTimeout(function () {
        _this._t(document, browserUi.EVENT_MOUSEMOVE, downEvent.pageX + x, downEvent.pageY + y);
        if (events.beforeMouseUp) {
          events.beforeMouseUp();
        }
        setTimeout(function () {
          _this.mottle.trigger(document, browserUi.EVENT_MOUSEUP, null);
          if (events.after) {
            events.after();
          }
        }, 45);
      }, 45);
    }
  }, {
    key: "dragANodeAround",
    value: function dragANodeAround(el, functionToAssertWhileDragging, assertMessage) {
      this._jsPlumb.trigger(el, browserUi.EVENT_MOUSEDOWN, this.makeEvent(el));
      var steps = Math.random() * 50;
      for (var i = 0; i < steps; i++) {
        var evt = _randomEvent();
        el.style.left = evt.screenX + "px";
        el.style.top = evt.screenY + "px";
        this._jsPlumb.trigger(document, browserUi.EVENT_MOUSEMOVE, evt);
      }
      if (functionToAssertWhileDragging) {
        this.ok(functionToAssertWhileDragging(), assertMessage || "while dragging assert");
      }
      this._jsPlumb.trigger(document, browserUi.EVENT_MOUSEUP, _distantPointEvent);
    }
  }, {
    key: "dragConnection",
    value: function dragConnection(d1, d2, mouseUpOnTarget) {
      var el1 = this.getCanvas(d1),
          el2 = this.getCanvas(d2);
      var e1 = this.makeEvent(el1),
          e2 = this.makeEvent(el2);
      var conns = this._jsPlumb.select().length;
      this._jsPlumb.trigger(el1, browserUi.EVENT_MOUSEDOWN, e1);
      this._jsPlumb.trigger(mouseUpOnTarget ? el2 : document, browserUi.EVENT_MOUSEMOVE, e2);
      this._jsPlumb.trigger(mouseUpOnTarget ? el2 : document, browserUi.EVENT_MOUSEUP, e2);
      return this._jsPlumb.select().get(conns);
    }
  }, {
    key: "aSyncDragConnection",
    value: function aSyncDragConnection(d1, d2, events) {
      var _this2 = this;
      events = events || {};
      var el1 = this.getCanvas(d1),
          el2 = this.getCanvas(d2);
      var e1 = this.makeEvent(el1),
          e2 = this.makeEvent(el2);
      var conns = this._jsPlumb.select().length;
      this._jsPlumb.trigger(el1, browserUi.EVENT_MOUSEDOWN, e1);
      setTimeout(function () {
        if (events.beforeMouseMove) {
          events.beforeMouseMove();
        }
        _this2._jsPlumb.trigger(document, browserUi.EVENT_MOUSEMOVE, e2);
        setTimeout(function () {
          if (events.beforeMouseUp) {
            events.beforeMouseUp();
          }
          _this2._jsPlumb.trigger(el2, browserUi.EVENT_MOUSEUP, e2);
          if (events.after) {
            events.after(_this2._jsPlumb.select().get(conns));
          }
        }, 5);
      }, 5);
    }
  }, {
    key: "dragAndAbortConnection",
    value: function dragAndAbortConnection(d1) {
      this.dragAndAbort(d1);
    }
  }, {
    key: "dragAndAbort",
    value: function dragAndAbort(d1) {
      var el1 = this.getCanvas(d1);
      var e1 = this.makeEvent(el1);
      this._jsPlumb.trigger(el1, browserUi.EVENT_MOUSEDOWN, e1);
      this._jsPlumb.trigger(document, browserUi.EVENT_MOUSEMOVE, _distantPointEvent);
      this._jsPlumb.trigger(document, browserUi.EVENT_MOUSEUP, _distantPointEvent);
    }
  }, {
    key: "dragToDistantLand",
    value: function dragToDistantLand(d1) {
      this.dragAndAbort(d1);
    }
  }, {
    key: "detachConnection",
    value: function detachConnection(e, connIndex) {
      var el1 = this.getEndpointCanvas(e);
          e.connections[connIndex];
      var e1 = this.makeEvent(el1);
      this._jsPlumb.trigger(el1, browserUi.EVENT_MOUSEDOWN, e1);
      this._jsPlumb.trigger(document, browserUi.EVENT_MOUSEMOVE, _distantPointEvent);
      this._jsPlumb.trigger(document, browserUi.EVENT_MOUSEUP, _distantPointEvent);
    }
  }, {
    key: "detachConnectionByTarget",
    value: function detachConnectionByTarget(c) {
      var idx = c.endpoints[1].connections.indexOf(c);
      this.detachConnection(c.endpoints[1], idx);
    }
  }, {
    key: "relocateTarget",
    value: function relocateTarget(conn, target, events) {
      this.relocate(conn, 1, target, events);
    }
  }, {
    key: "relocate",
    value: function relocate(conn, idx, newEl, events) {
      events = events || {};
      newEl = this.getCanvas(newEl);
      var el1 = this.getEndpointCanvas(conn.endpoints[idx]);
      var e1 = this.makeEvent(el1);
      var e2 = this.makeEvent(newEl);
      events.before && events.before();
      this._jsPlumb.trigger(el1, browserUi.EVENT_MOUSEDOWN, e1);
      events.beforeMouseMove && events.beforeMouseMove();
      this._jsPlumb.trigger(document, browserUi.EVENT_MOUSEMOVE, e2);
      events.beforeMouseUp && events.beforeMouseUp();
      this._jsPlumb.trigger(newEl, browserUi.EVENT_MOUSEUP, e2);
      events.after && events.after();
    }
  }, {
    key: "relocateSource",
    value: function relocateSource(conn, source, events) {
      this.relocate(conn, 0, source, events);
    }
  }, {
    key: "makeEvent",
    value: function makeEvent(el) {
      var b = el.getBoundingClientRect();
      var l = b.x + b.width / 2,
          t = b.y + b.height / 2;
      return {
        clientX: l,
        clientY: t,
        screenX: l,
        screenY: t,
        pageX: l,
        pageY: t
      };
    }
  }, {
    key: "getCanvas",
    value: function getCanvas(epOrEl) {
      if (epOrEl.endpoint) {
        return this.getEndpointCanvas(epOrEl);
      } else {
        return epOrEl;
      }
    }
  }, {
    key: "getEndpointCanvas",
    value: function getEndpointCanvas(ep) {
      return ep.endpoint.canvas;
    }
  }, {
    key: "getConnectionCanvas",
    value: function getConnectionCanvas(c) {
      return c.connector.canvas;
    }
  }, {
    key: "within",
    value: function within(val, target, msg) {
      this.ok(Math.abs(val - target) < VERY_SMALL_NUMBER, msg + "[expected: " + target + " got " + val + "] [diff:" + Math.abs(val - target) + "]");
    }
  }, {
    key: "assertManagedEndpointCount",
    value:
    function assertManagedEndpointCount(el, count) {
      var id = this._jsPlumb.getId(el),
          _mel = this._jsPlumb._managedElements[id];
      this.equal(_mel.endpoints.length, count, id + " has " + count + " endpoints in managed record");
    }
  }, {
    key: "assertManagedConnectionCount",
    value: function assertManagedConnectionCount(el, count) {
      var id = this._jsPlumb.getId(el),
          _mel = this._jsPlumb._managedElements[id];
      this.equal(_mel.connections.length, count, id + " has " + count + " connections in managed record");
    }
  }, {
    key: "fireEventOnEndpoint",
    value: function fireEventOnEndpoint(ep) {
      var canvas = this.getEndpointCanvas(ep);
      for (var _i2 = 0; _i2 < (arguments.length <= 1 ? 0 : arguments.length - 1); _i2++) {
        this._jsPlumb.trigger(canvas, _i2 + 1 < 1 || arguments.length <= _i2 + 1 ? undefined : arguments[_i2 + 1]);
      }
    }
  }, {
    key: "fireEventOnConnection",
    value: function fireEventOnConnection(connection) {
      var canvas = this.getConnectionCanvas(connection);
      for (var _i3 = 0; _i3 < (arguments.length <= 1 ? 0 : arguments.length - 1); _i3++) {
        this._jsPlumb.trigger(canvas, _i3 + 1 < 1 || arguments.length <= _i3 + 1 ? undefined : arguments[_i3 + 1]);
      }
    }
  }, {
    key: "clickOnConnection",
    value: function clickOnConnection(connection) {
      this.fireEventOnConnection(connection, browserUi.EVENT_CLICK);
    }
  }, {
    key: "dblClickOnConnection",
    value: function dblClickOnConnection(connection) {
      this.fireEventOnConnection(connection, browserUi.EVENT_DBL_CLICK);
    }
  }, {
    key: "tapOnConnection",
    value: function tapOnConnection(connection) {
      this.fireEventOnConnection(connection, browserUi.EVENT_MOUSEDOWN);
      this.fireEventOnConnection(connection, browserUi.EVENT_MOUSEUP);
    }
  }, {
    key: "dblTapOnConnection",
    value: function dblTapOnConnection(connection) {
      this.fireEventOnConnection(connection, browserUi.EVENT_MOUSEDOWN);
      this.fireEventOnConnection(connection, browserUi.EVENT_MOUSEUP);
      this.fireEventOnConnection(connection, browserUi.EVENT_MOUSEDOWN);
      this.fireEventOnConnection(connection, browserUi.EVENT_MOUSEUP);
    }
  }, {
    key: "clickOnElement",
    value: function clickOnElement(element, clickCount) {
      this._jsPlumb.trigger(element, browserUi.EVENT_CLICK, null, null, clickCount == null ? 1 : clickCount);
    }
  }, {
    key: "dblClickOnElement",
    value: function dblClickOnElement(element) {
      this._jsPlumb.trigger(element, browserUi.EVENT_DBL_CLICK);
    }
  }, {
    key: "tapOnElement",
    value: function tapOnElement(element) {
      this._jsPlumb.trigger(element, browserUi.EVENT_MOUSEDOWN);
      this._jsPlumb.trigger(element, browserUi.EVENT_MOUSEUP);
    }
  }, {
    key: "dblTapOnElement",
    value: function dblTapOnElement(element) {
      this._jsPlumb.trigger(element, browserUi.EVENT_MOUSEDOWN);
      this._jsPlumb.trigger(element, browserUi.EVENT_MOUSEUP);
      this._jsPlumb.trigger(element, browserUi.EVENT_MOUSEDOWN);
      this._jsPlumb.trigger(element, browserUi.EVENT_MOUSEUP);
    }
  }, {
    key: "getOverlayCanvas",
    value: function getOverlayCanvas(overlay) {
      return overlay.canvas || overlay.path;
    }
  }, {
    key: "fireEventOnOverlay",
    value: function fireEventOnOverlay(connection, overlayId, event) {
      var overlay = connection.getOverlay(overlayId);
      var canvas = this.getOverlayCanvas(overlay);
      this._jsPlumb.trigger(canvas, event);
    }
  }, {
    key: "clickOnOverlay",
    value: function clickOnOverlay(connection, overlayId) {
      this.fireEventOnOverlay(connection, overlayId, browserUi.EVENT_CLICK);
    }
  }, {
    key: "dblClickOnOverlay",
    value: function dblClickOnOverlay(connection, overlayId) {
      this.fireEventOnOverlay(connection, overlayId, browserUi.EVENT_DBL_CLICK);
    }
  }, {
    key: "tapOnOverlay",
    value: function tapOnOverlay(connection, overlayId) {
      this.fireEventOnOverlay(connection, overlayId, browserUi.EVENT_MOUSEDOWN);
      this.fireEventOnOverlay(connection, overlayId, browserUi.EVENT_MOUSEUP);
    }
  }, {
    key: "dblTapOnOverlay",
    value: function dblTapOnOverlay(connection, overlayId) {
      this.fireEventOnOverlay(connection, overlayId, browserUi.EVENT_MOUSEDOWN);
      this.fireEventOnOverlay(connection, overlayId, browserUi.EVENT_MOUSEUP);
      this.fireEventOnOverlay(connection, overlayId, browserUi.EVENT_MOUSEDOWN);
      this.fireEventOnOverlay(connection, overlayId, browserUi.EVENT_MOUSEUP);
    }
  }, {
    key: "cleanup",
    value: function cleanup() {
      var container = this._jsPlumb.getContainer();
      this._jsPlumb.destroy();
      for (var i in this._divs) {
        var d = document.getElementById(this._divs[i]);
        d && d.parentNode.removeChild(d);
      }
      this._divs.length = 0;
      var connCount = this._jsPlumb.select().length,
          epCount = this._jsPlumb.selectEndpoints().length,
          epElCount = container.querySelectorAll(".jtk-endpoint").length,
          connElCount = container.querySelectorAll(".jtk-connector").length;
      for (var k in container.__ta) {
        for (var kk in container.__ta[k]) {
          throw "Container event bindings not empty for key " + k;
        }
      }
      if (connCount > 0) throw "there are connections in the data model!";
      if (epCount > 0) throw "there are endpoints in the data model!";
      if (epElCount > 0) {
        throw "there are " + epElCount + " endpoints left in the dom!";
      }
      if (connElCount > 0) {
        throw "there are " + connElCount + " connections left in the dom!";
      }
    }
  }, {
    key: "makeContent",
    value: function makeContent(s) {
      var d = document.createElement("div");
      d.innerHTML = s;
      return d.firstChild;
    }
  }, {
    key: "length",
    value: function length(obj) {
      var c = 0;
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) c++;
      }
      return c;
    }
  }, {
    key: "head",
    value: function head(obj) {
      for (var i in obj) {
        return obj[i];
      }
    }
  }, {
    key: "uuid",
    value: function uuid() {
      return util.uuid();
    }
  }]);
  return BrowserUITestSupport;
}();

function getInstance(instance, ok, equal) {
  return new BrowserUITestSupport(instance, ok, equal);
}
function getInstanceQUnit(instance) {
  return new BrowserUITestSupport(instance, QUnit.ok, QUnit.equal);
}

exports.BrowserUITestSupport = BrowserUITestSupport;
exports.getInstance = getInstance;
exports.getInstanceQUnit = getInstanceQUnit;
