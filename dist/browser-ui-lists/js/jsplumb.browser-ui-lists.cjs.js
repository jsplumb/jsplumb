'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@jsplumb/core');
var util = require('@jsplumb/util');
var common = require('@jsplumb/common');

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

(function (SupportedEdge) {
  SupportedEdge[SupportedEdge["top"] = 0] = "top";
  SupportedEdge[SupportedEdge["bottom"] = 1] = "bottom";
})(exports.SupportedEdge || (exports.SupportedEdge = {}));
var DEFAULT_ANCHOR_LOCATIONS = new Map();
DEFAULT_ANCHOR_LOCATIONS.set(exports.SupportedEdge.top, [common.AnchorLocations.TopRight, common.AnchorLocations.TopLeft]);
DEFAULT_ANCHOR_LOCATIONS.set(exports.SupportedEdge.bottom, [common.AnchorLocations.BottomRight, common.AnchorLocations.BottomLeft]);
var DEFAULT_LIST_OPTIONS = {
  deriveAnchor: function deriveAnchor(edge, index, ep, conn) {
    return DEFAULT_ANCHOR_LOCATIONS.get(edge)[index];
  }
};
var ATTR_SCROLLABLE_LIST = "jtk-scrollable-list";
var SELECTOR_SCROLLABLE_LIST = core.att(ATTR_SCROLLABLE_LIST);
var EVENT_SCROLL = "scroll";

var JsPlumbListManager =
function () {
  function JsPlumbListManager(instance, params) {
    var _this = this;
    _classCallCheck(this, JsPlumbListManager);
    this.instance = instance;
    _defineProperty(this, "options", void 0);
    _defineProperty(this, "count", void 0);
    _defineProperty(this, "lists", void 0);
    this.count = 0;
    this.lists = {};
    this.options = params || {};
    this.instance.bind(core.EVENT_MANAGE_ELEMENT, function (p) {
      var scrollableLists = _this.instance.getSelector(p.el, SELECTOR_SCROLLABLE_LIST);
      for (var i = 0; i < scrollableLists.length; i++) {
        _this.addList(scrollableLists[i]);
      }
    });
    this.instance.bind(core.EVENT_UNMANAGE_ELEMENT, function (p) {
      _this.removeList(p.el);
    });
    this.instance.bind(core.EVENT_CONNECTION, function (params, evt) {
      if (evt == null) {
        var targetParent = _this.findParentList(params.target);
        if (targetParent != null) {
          targetParent.newConnection(params.connection, params.target, 1);
        }
        var sourceParent = _this.findParentList(params.source);
        if (sourceParent != null) {
          sourceParent.newConnection(params.connection, params.source, 0);
        }
      }
    });
    this.instance.bind(core.INTERCEPT_BEFORE_DROP, function (p) {
      var el = p.dropEndpoint.element;
      var dropList = _this.findParentList(el);
      return dropList == null || el.offsetTop >= dropList.domElement.scrollTop && el.offsetTop + el.offsetHeight <= dropList.domElement.scrollTop + dropList.domElement.offsetHeight;
    });
  }
  _createClass(JsPlumbListManager, [{
    key: "addList",
    value: function addList(el, options) {
      var dp = util.extend({}, DEFAULT_LIST_OPTIONS);
      util.extend(dp, this.options);
      options = util.extend(dp, options || {});
      var id = [this.instance._instanceIndex, this.count++].join("_");
      this.lists[id] = new JsPlumbList(this.instance, el, options, id);
      return this.lists[id];
    }
  }, {
    key: "getList",
    value: function getList(el) {
      var listId = this.instance.getAttribute(el, ATTR_SCROLLABLE_LIST);
      if (listId != null) {
        return this.lists[listId];
      }
    }
  }, {
    key: "removeList",
    value: function removeList(el) {
      var list = this.getList(el);
      if (list) {
        list.destroy();
        delete this.lists[list.id];
      }
    }
  }, {
    key: "findParentList",
    value: function findParentList(el) {
      var parent = el.parentNode,
          container = this.instance.getContainer(),
          parentList;
      while (parent != null && parent !== container && parent !== document) {
        parentList = this.getList(parent);
        if (parentList != null) {
          return parentList;
        }
        parent = parent.parentNode;
      }
    }
  }]);
  return JsPlumbListManager;
}();
var JsPlumbList =
function () {
  function JsPlumbList(instance, el, options, id) {
    _classCallCheck(this, JsPlumbList);
    this.instance = instance;
    this.el = el;
    this.options = options;
    this.id = id;
    _defineProperty(this, "_scrollHandler", void 0);
    _defineProperty(this, "domElement", void 0);
    _defineProperty(this, "elId", void 0);
    this.domElement = el;
    this.elId = this.instance.getId(el);
    instance.setAttribute(el, ATTR_SCROLLABLE_LIST, id);
    this._scrollHandler = this.scrollHandler.bind(this);
    this.domElement._jsPlumbScrollHandler = this._scrollHandler;
    instance.on(el, EVENT_SCROLL, this._scrollHandler);
    this._scrollHandler();
  }
  _createClass(JsPlumbList, [{
    key: "deriveAnchor",
    value: function deriveAnchor(edge, index, ep, conn) {
      return this.options.anchor ? this.options.anchor : this.options.deriveAnchor(edge, index, ep, conn);
    }
  }, {
    key: "deriveEndpoint",
    value: function deriveEndpoint(edge, index, ep, conn) {
      return this.options.deriveEndpoint ? this.options.deriveEndpoint(edge, index, ep, conn) : this.options.endpoint ? this.options.endpoint : ep.endpoint.type;
    }
  }, {
    key: "newConnection",
    value: function newConnection(c, el, index) {
      if (el.offsetTop < this.el.scrollTop) {
        this._proxyConnection(el, c, index, exports.SupportedEdge.top);
      } else if (el.offsetTop + el.offsetHeight > this.el.scrollTop + this.domElement.offsetHeight) {
        this._proxyConnection(el, c, index, exports.SupportedEdge.bottom);
      }
    }
  }, {
    key: "scrollHandler",
    value: function scrollHandler() {
      var _this2 = this;
      var children = this.instance.getSelector(this.el, core.SELECTOR_MANAGED_ELEMENT);
      var _loop = function _loop(i) {
        if (children[i].offsetTop < _this2.el.scrollTop) {
          children[i]._jsPlumbProxies = children[i]._jsPlumbProxies || [];
          _this2.instance.select({
            source: children[i]
          }).each(function (c) {
            _this2._proxyConnection(children[i], c, 0, exports.SupportedEdge.top);
          });
          _this2.instance.select({
            target: children[i]
          }).each(function (c) {
            _this2._proxyConnection(children[i], c, 1, exports.SupportedEdge.top);
          });
        }
        else if (children[i].offsetTop + children[i].offsetHeight > _this2.el.scrollTop + _this2.domElement.offsetHeight) {
            children[i]._jsPlumbProxies = children[i]._jsPlumbProxies || [];
            _this2.instance.select({
              source: children[i]
            }).each(function (c) {
              _this2._proxyConnection(children[i], c, 0, exports.SupportedEdge.bottom);
            });
            _this2.instance.select({
              target: children[i]
            }).each(function (c) {
              _this2._proxyConnection(children[i], c, 1, exports.SupportedEdge.bottom);
            });
          } else if (children[i]._jsPlumbProxies) {
            for (var j = 0; j < children[i]._jsPlumbProxies.length; j++) {
              _this2.instance.unproxyConnection(children[i]._jsPlumbProxies[j][0], children[i]._jsPlumbProxies[j][1]);
            }
            delete children[i]._jsPlumbProxies;
          }
        _this2.instance.revalidate(children[i]);
      };
      for (var i = 0; i < children.length; i++) {
        _loop(i);
      }
    }
  }, {
    key: "_proxyConnection",
    value: function _proxyConnection(el, conn, index, edge) {
      var _this3 = this;
      this.instance.proxyConnection(conn, index, this.domElement, function (c, index) {
        return _this3.deriveEndpoint(edge, index, conn.endpoints[index], conn);
      }, function (c, index) {
        return _this3.deriveAnchor(edge, index, conn.endpoints[index], conn);
      });
      el._jsPlumbProxies = el._jsPlumbProxies || [];
      el._jsPlumbProxies.push([conn, index]);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.instance.off(this.el, EVENT_SCROLL, this._scrollHandler);
      delete this.domElement._jsPlumbScrollHandler;
      var children = this.instance.getSelector(this.el, core.SELECTOR_MANAGED_ELEMENT);
      for (var i = 0; i < children.length; i++) {
        if (children[i]._jsPlumbProxies) {
          for (var j = 0; j < children[i]._jsPlumbProxies.length; j++) {
            this.instance.unproxyConnection(children[i]._jsPlumbProxies[j][0], children[i]._jsPlumbProxies[j][1]);
          }
          delete children[i]._jsPlumbProxies;
        }
      }
    }
  }]);
  return JsPlumbList;
}();

function newInstance(instance, params) {
  return new JsPlumbListManager(instance, params);
}

exports.ATTR_SCROLLABLE_LIST = ATTR_SCROLLABLE_LIST;
exports.DEFAULT_LIST_OPTIONS = DEFAULT_LIST_OPTIONS;
exports.EVENT_SCROLL = EVENT_SCROLL;
exports.JsPlumbList = JsPlumbList;
exports.JsPlumbListManager = JsPlumbListManager;
exports.SELECTOR_SCROLLABLE_LIST = SELECTOR_SCROLLABLE_LIST;
exports.newInstance = newInstance;
