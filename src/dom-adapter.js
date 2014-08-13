/*
 * jsPlumb
 *
 * Title:jsPlumb 1.6.4
 *
 * Provides a way to visually connect elements on an HTML page, using SVG or VML.
 *
 * This file contains the base functionality for DOM type adapters.
 *
 * Copyright (c) 2010 - 2014 Simon Porritt (simon@jsplumbtoolkit.com)
 *
 * http://jsplumbtoolkit.com
 * http://github.com/sporritt/jsplumb
 *
 * Dual licensed under the MIT and GPL2 licenses.
 */
;(function() {

  var root = this;

	var svgAvailable = !!window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"),
		vmlAvailable = function() {
	        if (vmlAvailable.vml === undefined) {
	            var a = document.body.appendChild(document.createElement('div'));
	        	a.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
	        	var b = a.firstChild;
	        	if (b != null && b.style != null) {
	            	b.style.behavior = "url(#default#VML)";
	            	vmlAvailable.vml = b ? typeof b.adj == "object": true;
	            }
	            else
	            	vmlAvailable.vml = false;
	        	a.parentNode.removeChild(a);
	        }
	        return vmlAvailable.vml;
		},
		// TODO: remove this once we remove all library adapter versions and have only vanilla jsplumb: this functionality
		// comes from Mottle.
		iev = (function() {
			var rv = -1;
			if (navigator.appName == 'Microsoft Internet Explorer') {
				var ua = navigator.userAgent,
					re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
				if (re.exec(ua) != null)
					rv = parseFloat(RegExp.$1);
			}
			return rv;
		})(),
		isIELT9 = iev > -1 && iev < 9,
		_genLoc = function(e, prefix) {
			if (e == null) return [ 0, 0 ];
			var ts = _touches(e), t = _getTouch(ts, 0);
			return [t[prefix + "X"], t[prefix + "Y"]];
		},
		_pageLocation = function(e) {
			if (e == null) return [ 0, 0 ];
			if (isIELT9) {
				return [ e.clientX + document.documentElement.scrollLeft, e.clientY + document.documentElement.scrollTop ];
			}
			else {
				return _genLoc(e, "page");
			}
		},
		_screenLocation = function(e) {
			return _genLoc(e, "screen");
		},
		_clientLocation = function(e) {
			return _genLoc(e, "client");
		},
		_getTouch = function(touches, idx) { return touches.item ? touches.item(idx) : touches[idx]; },
		_touches = function(e) {
			return e.touches && e.touches.length > 0 ? e.touches :
				   e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches :
				   e.targetTouches && e.targetTouches.length > 0 ? e.targetTouches :
				   [ e ];
		};

    /**
		Manages dragging for some instance of jsPlumb.
	*/
	var DragManager = function(_currentInstance) {
		var _draggables = {}, _dlist = [], _delements = {}, _elementsWithEndpoints = {},
			// elementids mapped to the draggable to which they belong.
			_draggablesForElements = {};

        /**
            register some element as draggable.  right now the drag init stuff is done elsewhere, and it is
            possible that will continue to be the case.
        */
		this.register = function(el) {
            var id = _currentInstance.getId(el),
                parentOffset = jsPlumbAdapter.getOffset(el, _currentInstance);

            if (!_draggables[id]) {
                _draggables[id] = el;
                _dlist.push(el);
                _delements[id] = {};
            }

			// look for child elements that have endpoints and register them against this draggable.
			var _oneLevel = function(p, startOffset) {
				if (p) {
					for (var i = 0; i < p.childNodes.length; i++) {
						if (p.childNodes[i].nodeType != 3 && p.childNodes[i].nodeType != 8) {
							var cEl = jsPlumb.getElementObject(p.childNodes[i]),
								cid = _currentInstance.getId(p.childNodes[i], null, true);
							if (cid && _elementsWithEndpoints[cid] && _elementsWithEndpoints[cid] > 0) {
								var cOff = jsPlumbAdapter.getOffset(cEl, _currentInstance);
								_delements[id][cid] = {
									id:cid,
									offset:{
										left:cOff.left - parentOffset.left,
										top:cOff.top - parentOffset.top
									}
								};
								_draggablesForElements[cid] = id;
							}
							_oneLevel(p.childNodes[i]);
						}
					}
				}
			};

			_oneLevel(el);
		};

		// refresh the offsets for child elements of this element.
		this.updateOffsets = function(elId) {
			if (elId != null) {
				var domEl = jsPlumb.getDOMElement(elId),
					id = _currentInstance.getId(domEl),
					children = _delements[id],
					parentOffset = jsPlumbAdapter.getOffset(domEl, _currentInstance);

				if (children) {
					for (var i in children) {
						var cel = jsPlumb.getElementObject(i),
							cOff = jsPlumbAdapter.getOffset(cel, _currentInstance);

						_delements[id][i] = {
							id:i,
							offset:{
								left:cOff.left - parentOffset.left,
								top:cOff.top - parentOffset.top
							}
						};
						_draggablesForElements[i] = id;
					}
				}
			}
		};

		/**
			notification that an endpoint was added to the given el.  we go up from that el's parent
			node, looking for a parent that has been registered as a draggable. if we find one, we add this
			el to that parent's list of elements to update on drag (if it is not there already)
		*/
		this.endpointAdded = function(el) {
			var b = document.body, id = _currentInstance.getId(el),
				cLoc = jsPlumbAdapter.getOffset(el, _currentInstance),
				p = el.parentNode, done = p == b;

			_elementsWithEndpoints[id] = _elementsWithEndpoints[id] ? _elementsWithEndpoints[id] + 1 : 1;

			while (p != null && p != b) {
				var pid = _currentInstance.getId(p, null, true);
				if (pid && _draggables[pid]) {
					var idx = -1, pLoc = jsPlumbAdapter.getOffset(p, _currentInstance);

					if (_delements[pid][id] == null) {
						_delements[pid][id] = {
							id:id,
							offset:{
								left:cLoc.left - pLoc.left,
								top:cLoc.top - pLoc.top
							}
						};
						_draggablesForElements[id] = pid;
					}
					break;
				}
				p = p.parentNode;
			}
		};

		this.endpointDeleted = function(endpoint) {
			if (_elementsWithEndpoints[endpoint.elementId]) {
				_elementsWithEndpoints[endpoint.elementId]--;
				if (_elementsWithEndpoints[endpoint.elementId] <= 0) {
					for (var i in _delements) {
						if (_delements[i]) {
                            delete _delements[i][endpoint.elementId];
                            delete _draggablesForElements[endpoint.elementId];
                        }
					}
				}
			}
		};

		this.changeId = function(oldId, newId) {
			_delements[newId] = _delements[oldId];
			_delements[oldId] = {};
			_draggablesForElements[newId] = _draggablesForElements[oldId];
			_draggablesForElements[oldId] = null;
		};

		this.getElementsForDraggable = function(id) {
			return _delements[id];
		};

		this.elementRemoved = function(elementId) {
			var elId = _draggablesForElements[elementId];
			if (elId) {
				delete _delements[elId][elementId];
				delete _draggablesForElements[elementId];
			}
		};

		this.reset = function() {
			_draggables = {};
			_dlist = [];
			_delements = {};
			_elementsWithEndpoints = {};
		};

		//
		// notification drag ended. We check automatically if need to update some
		// ancestor's offsets.
		//
		this.dragEnded = function(el) {
			var id = _currentInstance.getId(el),
				ancestor = _draggablesForElements[id];

			if (ancestor) this.updateOffsets(ancestor);
		};

		this.setParent = function(el, elId, p, pId) {
			var current = _draggablesForElements[elId];
			if (current) {
				if (!_delements[pId])
					_delements[pId] = {};
				_delements[pId][elId] = _delements[current][elId];
				delete _delements[current][elId];
				var pLoc = jsPlumbAdapter.getOffset(p, _currentInstance),
					cLoc = jsPlumbAdapter.getOffset(el, _currentInstance);
				_delements[pId][elId].offset = {
					left:cLoc.left - pLoc.left,
					top:cLoc.top - pLoc.top
				};
				_draggablesForElements[elId] = pId;
			}
		};

		this.getDragAncestor = function(el) {
			var de = jsPlumb.getDOMElement(el),
				id = _currentInstance.getId(de),
				aid = _draggablesForElements[id];

			if (aid) 
				return jsPlumb.getDOMElement(aid);
			else
				return null;
		};

	};

    // for those browsers that dont have it.  they still don't have it! but at least they won't crash.
	if (!window.console)
		window.console = { time:function(){}, timeEnd:function(){}, group:function(){}, groupEnd:function(){}, log:function(){} };


	// TODO: katavorio default helper uses this stuff.  should i extract to a support lib?
	var trim = function(str) {
			return str == null ? null : (str.replace(/^\s\s*/, '').replace(/\s\s*$/, ''));
		},
		_setClassName = function(el, cn) {
			cn = trim(cn);
			if (typeof el.className.baseVal != "undefined")  // SVG
				el.className.baseVal = cn;
			else
				el.className = cn;
		},
		_getClassName = function(el) {
			return (typeof el.className.baseVal == "undefined") ? el.className : el.className.baseVal;
		},
		_classManip = function(el, add, clazz) {

			// TODO if classList exists, use it.

			var classesToAddOrRemove = jsPlumbUtil.isArray(clazz) ? clazz : clazz.split(/\s+/),
				className = _getClassName(el),
				curClasses = className.split(/\s+/);

			for (var i = 0; i < classesToAddOrRemove.length; i++) {
				if (add) {
					if (jsPlumbUtil.indexOf(curClasses, classesToAddOrRemove[i]) == -1)
						curClasses.push(classesToAddOrRemove[i]);
				}
				else {
					var idx = jsPlumbUtil.indexOf(curClasses, classesToAddOrRemove[i]);
					if (idx != -1)
						curClasses.splice(idx, 1);
				}
			}
			_setClassName(el, curClasses.join(" "));
		},
		_each = function(spec, fn) {
			if (spec == null) return;
			if (typeof spec === "string")
				fn(jsPlumb.getDOMElement(spec));
			else if (spec.length != null) {
				for (var i = 0; i < spec.length; i++)
					fn(jsPlumb.getDOMElement(spec[i]));
			}
			else
				fn(spec); // assume it's an element.
		};

    window.jsPlumbAdapter = {

        headless:false,

        pageLocation:_pageLocation,
        screenLocation:_screenLocation,
        clientLocation:_clientLocation,

        getAttribute:function(el, attName) {
        	return el.getAttribute(attName);
        },

        setAttribute:function(el, a, v) {
        	el.setAttribute(a, v);
        },

        appendToRoot : function(node) {
            document.body.appendChild(node);
        },
        getRenderModes : function() {
            return [ "svg", "vml" ];
        },
        isRenderModeAvailable : function(m) {
            return {
                "svg":svgAvailable,
                "vml":vmlAvailable()
            }[m];
        },
        getDragManager : function(_jsPlumb) {
            return new DragManager(_jsPlumb);
        },
        setRenderMode : function(mode) {
            var renderMode;

            if (mode) {
				mode = mode.toLowerCase();

                var svgAvailable = this.isRenderModeAvailable("svg"),
                    vmlAvailable = this.isRenderModeAvailable("vml");

                // now test we actually have the capability to do this.
                if (mode === "svg") {
                    if (svgAvailable) renderMode = "svg";
                    else if (vmlAvailable) renderMode = "vml";
                }
                else if (vmlAvailable) renderMode = "vml";
            }

			return renderMode;
        },
		addClass:function(el, clazz) {
			_each(el, function(e) {
				_classManip(e, true, clazz);
			});
		},
		hasClass:function(el, clazz) {
			el = jsPlumb.getDOMElement(el);
			if (el.classList) return el.classList.contains(clazz);
			else {
				return _getClassName(el).indexOf(clazz) != -1;
			}
		},
		removeClass:function(el, clazz) {
			_each(el, function(e) {
				_classManip(e, false, clazz);
			});
		},
		setClass:function(el, clazz) {
			_each(el, function(e) {
				_setClassName(e, clazz);
			});
		},
		setPosition:function(el, p) {
			el.style.left = p.left + "px";
			el.style.top = p.top + "px";
		},
		getPosition:function(el) {
			var _one = function(prop) {
				var v = el.style[prop];
				return v ? v.substring(0, v.length - 2) : 0;
			};
			return {
				left:_one("left"),
				top:_one("top")
			};
		},
		getOffset:function(el, _instance, relativeToRoot) {
			el = jsPlumb.getDOMElement(el);
			var container = _instance.getContainer();
			var l = el.offsetLeft, t = el.offsetTop, op = (relativeToRoot  || (container != null && el.offsetParent != container)) ?  el.offsetParent : null;
			while (op != null) {
				l += op.offsetLeft;
				t += op.offsetTop;
				op = relativeToRoot ? op.offsetParent :
					op.offsetParent == container ? null : op.offsetParent;
			}
			return {
				left:l, top:t
			};
		},
		//
		// return x+y proportion of the given element's size corresponding to the location of the given event.
		//
    getPositionOnElement:function(evt, el, zoom) {
      var box = typeof el.getBoundingClientRect !== "undefined" ? el.getBoundingClientRect() : { left:0, top:0, width:0, height:0 },
				  body = document.body,
    			docElem = document.documentElement,
    			offPar = el.offsetParent,
    			scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
				  scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
				  clientTop = docElem.clientTop || body.clientTop || 0,
				  clientLeft = docElem.clientLeft || body.clientLeft || 0,
				  pst = 0,//offPar ? offPar.scrollTop : 0,
				  psl = 0,//offPar ? offPar.scrollLeft : 0,
				  top  = box.top +  scrollTop - clientTop + (pst * zoom),
				  left = box.left + scrollLeft - clientLeft + (psl * zoom),
				  cl = jsPlumbAdapter.pageLocation(evt),
				  w = box.width || (el.offsetWidth * zoom),
				  h = box.height || (el.offsetHeight * zoom),
				  x = (cl[0] - left) / w,
				  y = (cl[1] - top) / h;

			 return [ x, y ];
     },

     /**
    * Gets the absolute position of some element as read from the left/top properties in its style.
    * @method getAbsolutePosition
    * @param {Element} el The element to retrieve the absolute coordinates from. **Note** this is a DOM element, not a selector from the underlying library.
    * @return [Float, Float] [left, top] pixel values.
    */
    getAbsolutePosition : function(el) {
        var _one = function(s) {
            var ss = el.style[s];
            if (ss) return parseFloat(ss.substring(0, ss.length - 2));
        };
        return [ _one("left"), _one("top") ];
    },

    /**
    * Sets the absolute position of some element by setting the left/top properties in its style.
    * @method setAbsolutePosition
    * @param {Element} el The element to set the absolute coordinates on. **Note** this is a DOM element, not a selector from the underlying library.
    * @param {Float[]} xy x and y coordinates
	  * @param {Float[]} [animateFrom] Optional previous xy to animate from.
    */
    setAbsolutePosition : function(el, xy, animateFrom, animateOptions) {
		  if (animateFrom) {
			     root.jsPlumb.animate(el, {
				     left: "+=" + (xy[0] - animateFrom[0]),
				     top: "+=" + (xy[1] - animateFrom[1])
			     }, animateOptions);
		  }
		  else {
			  el.style.left = xy[0] + "px";
			  el.style.top = xy[1] + "px";
		  }
    },




    };

}).call(this);
