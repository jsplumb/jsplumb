/*
 * jsPlumb
 * 
 * Title:jsPlumb 1.4.1
 * 
 * Provides a way to visually connect elements on an HTML page, using either SVG, Canvas
 * elements, or VML.  
 * 
 * This file contains the jsPlumb core code.
 *
 * Copyright (c) 2010 - 2013 Simon Porritt (simon.porritt@gmail.com)
 * 
 * http://jsplumb.org
 * http://github.com/sporritt/jsplumb
 * http://code.google.com/p/jsplumb
 * 
 * Dual licensed under the MIT and GPL2 licenses.
 */

;(function() {
			
    var _findWithFunction = jsPlumbUtil.findWithFunction,
	_indexOf = jsPlumbUtil.indexOf,
    _removeWithFunction = jsPlumbUtil.removeWithFunction,
    _remove = jsPlumbUtil.remove,
    // TODO support insert index
    _addWithFunction = jsPlumbUtil.addWithFunction,
    _addToList = jsPlumbUtil.addToList,
	/**
		an isArray function that even works across iframes...see here:
		
		http://tobyho.com/2011/01/28/checking-types-in-javascript/

		i was originally using "a.constructor == Array" as a test.
	*/
	_isArray = jsPlumbUtil.isArray,
	_isString = jsPlumbUtil.isString,
	_isObject = jsPlumbUtil.isObject;
		
	var _att = function(el, attName) { return jsPlumb.CurrentLibrary.getAttribute(_gel(el), attName); },
		_setAttribute = function(el, attName, attValue) { jsPlumb.CurrentLibrary.setAttribute(_gel(el), attName, attValue); },
		_addClass = function(el, clazz) { jsPlumb.CurrentLibrary.addClass(_gel(el), clazz); },
		_hasClass = function(el, clazz) { return jsPlumb.CurrentLibrary.hasClass(_gel(el), clazz); },
		_removeClass = function(el, clazz) { jsPlumb.CurrentLibrary.removeClass(_gel(el), clazz); },
		_gel = function(el) { return jsPlumb.CurrentLibrary.getElementObject(el); },
		_getOffset = function(el, _instance) {
            var o = jsPlumb.CurrentLibrary.getOffset(_gel(el));
			if (_instance != null) {
                var z = _instance.getZoom();
                return {left:o.left / z, top:o.top / z };    
            }
            else
                return o;
        },		
		_getSize = function(el) {
            return jsPlumb.CurrentLibrary.getSize(_gel(el));
        },
		_log = jsPlumbUtil.log,
		_group = jsPlumbUtil.group,
		_groupEnd = jsPlumbUtil.groupEnd,
		_time = jsPlumbUtil.time,
		_timeEnd = jsPlumbUtil.timeEnd,
		
		/**
		 * creates a timestamp, using milliseconds since 1970, but as a string.
		 */
		_timestamp = function() { return "" + (new Date()).getTime(); },
		
		/*
		 * Class:jsPlumbUIComponent
		 * Abstract superclass for UI components Endpoint and Connection.  Provides the abstraction of paintStyle/hoverPaintStyle,
		 * and also extends jsPlumbUtil.EventGenerator to provide the bind and fire methods.
		 */
		jsPlumbUIComponent = window.jsPlumbUIComponent = function(params) {
			var self = this, 
				a = arguments, 
				_hover = false, 
				parameters = params.parameters || {}, 
				idPrefix = self.idPrefix,
				id = idPrefix + (new Date()).getTime(),
				paintStyle = null,
				hoverPaintStyle = null;

			self._jsPlumb = params["_jsPlumb"];			
			self.getId = function() { return id; };			
			self.hoverClass = params.hoverClass || self._jsPlumb.Defaults.HoverClass || jsPlumb.Defaults.HoverClass;				
			
			// all components can generate events
			jsPlumbUtil.EventGenerator.apply(this);
			if (params.events) {
				for (var i in params.events)
					self.bind(i, params.events[i]);
			}

			// all components get this clone function.
			// TODO issue 116 showed a problem with this - it seems 'a' that is in
			// the clone function's scope is shared by all invocations of it, the classic
			// JS closure problem.  for now, jsPlumb does a version of this inline where 
			// it used to call clone.  but it would be nice to find some time to look
			// further at this.
			this.clone = function() {
				var o = new Object();
				self.constructor.apply(o, a);
				return o;
			};
			
			this.getParameter = function(name) { return parameters[name]; },
			this.getParameters = function() { 
				return parameters; 
			},
			this.setParameter = function(name, value) { parameters[name] = value; },
			this.setParameters = function(p) { parameters = p; },			
			this.overlayPlacements = [];			
			
			// user can supply a beforeDetach callback, which will be executed before a detach
			// is performed; returning false prevents the detach.
			var beforeDetach = params.beforeDetach;
			this.isDetachAllowed = function(connection) {
				var r = true;
				if (beforeDetach) {
					try { 
						r = beforeDetach(connection); 
					}
					catch (e) { _log("jsPlumb: beforeDetach callback failed", e); }
				}
				return r;
			};
			
			// user can supply a beforeDrop callback, which will be executed before a dropped
			// connection is confirmed. user can return false to reject connection.
			var beforeDrop = params.beforeDrop;
			this.isDropAllowed = function(sourceId, targetId, scope, connection, dropEndpoint) {
				var r = self._jsPlumb.checkCondition("beforeDrop", { 
					sourceId:sourceId, 
					targetId:targetId, 
					scope:scope,
					connection:connection,
					dropEndpoint:dropEndpoint 
				});
				if (beforeDrop) {
					try { 
						r = beforeDrop({ 
							sourceId:sourceId, 
							targetId:targetId, 
							scope:scope, 
							connection:connection,
							dropEndpoint:dropEndpoint
						}); 
					}
					catch (e) { _log("jsPlumb: beforeDrop callback failed", e); }
				}
				return r;
			};
									
			// helper method to update the hover style whenever it, or paintStyle, changes.
			// we use paintStyle as the foundation and merge hoverPaintStyle over the
			// top.
			var _updateHoverStyle = function() {
				if (paintStyle && hoverPaintStyle) {
					var mergedHoverStyle = {};
					jsPlumb.extend(mergedHoverStyle, paintStyle);
					jsPlumb.extend(mergedHoverStyle, hoverPaintStyle);
					delete self["hoverPaintStyle"];
					// we want the fillStyle of paintStyle to override a gradient, if possible.
					if (mergedHoverStyle.gradient && paintStyle.fillStyle)
						delete mergedHoverStyle["gradient"];
					hoverPaintStyle = mergedHoverStyle;
				}
			};
			
			/*
		     * Sets the paint style and then repaints the element.
		     * 
		     * Parameters:
		     * 	style - Style to use.
		     */
		    this.setPaintStyle = function(style, doNotRepaint) {
		    	paintStyle = style;
		    	self.paintStyleInUse = paintStyle;
		    	_updateHoverStyle();
		    	if (!doNotRepaint) self.repaint();
		    };

		    /**
		    * Gets the component's paint style.
		    *
		    * Returns:
		    * the component's paint style. if there is no hoverPaintStyle set then this will be the paint style used all the time, otherwise this is the style used when the mouse is not hovering.
		    */
		    this.getPaintStyle = function() {
		    	return paintStyle;
		    };
		    
		    /*
		     * Sets the paint style to use when the mouse is hovering over the element. This is null by default.
		     * The hover paint style is applied as extensions to the paintStyle; it does not entirely replace
		     * it.  This is because people will most likely want to change just one thing when hovering, say the
		     * color for example, but leave the rest of the appearance the same.
		     * 
		     * Parameters:
		     * 	style - Style to use when the mouse is hovering.
		     *  doNotRepaint - if true, the component will not be repainted.  useful when setting things up initially.
		     */
		    this.setHoverPaintStyle = function(style, doNotRepaint) {		    	
		    	hoverPaintStyle = style;
		    	_updateHoverStyle();
		    	if (!doNotRepaint) self.repaint();
		    };

		    /**
		    * Gets the component's hover paint style.
		    *
		    * Returns:
		    * the component's hover paint style. may be null.
		    */
		    this.getHoverPaintStyle = function() {
		    	return hoverPaintStyle;
		    };
		    
		    /*
		     * sets/unsets the hover state of this element.
		     * 
		     * Parameters:
		     * 	hover - hover state boolean
		     * 	ignoreAttachedElements - if true, does not notify any attached elements of the change in hover state.  used mostly to avoid infinite loops.
		     */
		    this.setHover = function(hover, ignoreAttachedElements, timestamp) {
		    	// while dragging, we ignore these events.  this keeps the UI from flashing and
		    	// swishing and whatevering.
				if (!self._jsPlumb.currentlyDragging && !self._jsPlumb.isHoverSuspended()) {
		    
			    	_hover = hover;
                        
                    if (self.canvas != null) {
                        if (self.hoverClass != null) {
                            if (hover) 
                                jpcl.addClass(self.canvas, self.hoverClass);						
                            else
                                jpcl.removeClass(self.canvas, self.hoverClass);
                        }
                        
                        if (hover) 
                            jpcl.addClass(self.canvas, self._jsPlumb.hoverClass);						
                        else
                            jpcl.removeClass(self.canvas, self._jsPlumb.hoverClass);
                    }
		   		 	if (hoverPaintStyle != null) {
						self.paintStyleInUse = hover ? hoverPaintStyle : paintStyle;
						if (!self._jsPlumb.isSuspendDrawing()) {
							timestamp = timestamp || _timestamp();
							self.repaint({timestamp:timestamp, recalc:false});
						}
					}
					// get the list of other affected elements, if supported by this component.
					// for a connection, its the endpoints.  for an endpoint, its the connections! surprise.
					if (self.getAttachedElements && !ignoreAttachedElements)
						_updateAttachedElements(hover, _timestamp(), self);
				}
		    };
		    
		    this.isHover = function() { return _hover; };
            
            this.bindListeners = function(obj, _self, _hoverFunction) {
                obj.bind("click", function(ep, e) { _self.fire("click", _self, e); });
                obj.bind("dblclick", function(ep, e) { _self.fire("dblclick", _self, e); });
                obj.bind("contextmenu", function(ep, e) { _self.fire("contextmenu", _self, e); });
                obj.bind("mouseenter", function(ep, e) {
                    if (!_self.isHover()) {
                        _hoverFunction(true);
                        _self.fire("mouseenter", _self, e);
                    }
                });
                obj.bind("mouseexit", function(ep, e) {
                    if (_self.isHover()) {
                        _hoverFunction(false);
                        _self.fire("mouseexit", _self, e);
                    }
                });	  
                obj.bind("mousedown", function(ep, e) { _self.fire("mousedown", _self, e); });
                obj.bind("mouseup", function(ep, e) { _self.fire("mouseup", _self, e); });
            };
		
			var jpcl = jsPlumb.CurrentLibrary,
				events = [ "click", "dblclick", "mouseenter", "mouseout", "mousemove", "mousedown", "mouseup", "contextmenu" ],
				eventFilters = { "mouseout":"mouseexit" },
				bindOne = function(o, c, evt) {
					var filteredEvent = eventFilters[evt] || evt;
					jpcl.bind(o, evt, function(ee) {
						c.fire(filteredEvent, c, ee);
					});
				},
				unbindOne = function(o, evt) {
					var filteredEvent = eventFilters[evt] || evt;
					jpcl.unbind(o, evt);
				};
		    
		    this.attachListeners = function(o, c) {
				for (var i = 0, j = events.length; i < j; i++) {
					bindOne(o, c, events[i]); 			
				}
			};
		    
		    var _updateAttachedElements = function(state, timestamp, sourceElement) {
		    	var affectedElements = self.getAttachedElements();		// implemented in subclasses
		    	if (affectedElements) {
		    		for (var i = 0, j = affectedElements.length; i < j; i++) {
		    			if (!sourceElement || sourceElement != affectedElements[i])
		    				affectedElements[i].setHover(state, true, timestamp);			// tell the attached elements not to inform their own attached elements.
		    		}
		    	}
		    };
		    
		    this.reattachListenersForElement = function(o) {
			    if (arguments.length > 1) {
		    		for (var i = 0, j = events.length; i < j; i++)
		    			unbindOne(o, events[i]);
			    	for (var i = 1, j = arguments.length; i < j; i++)
		    			self.attachListeners(o, arguments[i]);
		    	}
		    };		    	    
			
			/*
			 * TYPES
			 */
			var _types = [],
				_splitType = function(t) { return t == null ? null : t.split(" ")},				
				_applyTypes = function(params, doNotRepaint) {
					if (self.getDefaultType) {
						var td = self.getTypeDescriptor();
							
						var o = jsPlumbUtil.merge({}, self.getDefaultType());
						for (var i = 0, j = _types.length; i < j; i++)
							o = jsPlumbUtil.merge(o, self._jsPlumb.getType(_types[i], td));						
							
						if (params) {
							o = jsPlumbUtil.populate(o, params);
						}
					
						self.applyType(o, doNotRepaint);					
						if (!doNotRepaint) self.repaint();
					}
				};
			
			/*
				Function: setType	
				Sets the type, removing all existing types.
			*/
			self.setType = function(typeId, params, doNotRepaint) {				
				_types = _splitType(typeId) || [];
				_applyTypes(params, doNotRepaint);									
			};
			
			/*
			 * Function : getType
			 * Gets the 'types' of this component.
			 */
			self.getType = function() {
				return _types;
			};

			/**
				Function: reapplyTypes
				Reapply all existing types, but with the given new params.
			*/
			self.reapplyTypes = function(params, doNotRepaint) {
				_applyTypes(params, doNotRepaint);
			};
			
			self.hasType = function(typeId) {
				return jsPlumbUtil.indexOf(_types, typeId) != -1;
			};
			
			/*
				Function: addType
				adds a type. will not be re-added it already exists.
			*/
			self.addType = function(typeId, params, doNotRepaint) {
				var t = _splitType(typeId), _cont = false;
				if (t != null) {
					for (var i = 0, j = t.length; i < j; i++) {
						if (!self.hasType(t[i])) {
							_types.push(t[i]);
							_cont = true;						
						}
					}
					if (_cont) _applyTypes(params, doNotRepaint);
				}
			};
			
			self.removeType = function(typeId, doNotRepaint) {
				var t = _splitType(typeId), _cont = false, _one = function(tt) {
					var idx = jsPlumbUtil.indexOf(_types, tt);
					if (idx != -1) {
						_types.splice(idx, 1);
						return true;
					}
					return false;
				};
				
				if (t != null) {
					for (var i = 0,j = t.length; i < j; i++) {
						_cont = _one(t[i]) || _cont;
					}
					if (_cont) _applyTypes(null, doNotRepaint);
				}
			};
			
			self.toggleType = function(typeId, params, doNotRepaint) {
				var t = _splitType(typeId);
				if (t != null) {
					for (var i = 0, j = t.length; i < j; i++) {
						var idx = jsPlumbUtil.indexOf(_types, t[i]);
						if (idx != -1)
							_types.splice(idx, 1);
						else
							_types.push(t[i]);
					}
						
					_applyTypes(params, doNotRepaint);
				}
			};
			
			this.applyType = function(t, doNotRepaint) {
				self.setPaintStyle(t.paintStyle, doNotRepaint);				
				self.setHoverPaintStyle(t.hoverPaintStyle, doNotRepaint);
				if (t.parameters){
					for (var i in t.parameters)
						self.setParameter(i, t.parameters[i]);
				}
			};
            
            // CSS classes
            this.addClass = function(clazz) {
                if (self.canvas != null)
                    _addClass(self.canvas, clazz);
            };
			
            this.removeClass = function(clazz) {
                if (self.canvas != null)
                    _removeClass(self.canvas, clazz);
            };                    
		},

		overlayCapableJsPlumbUIComponent = window.overlayCapableJsPlumbUIComponent = function(params) {
			jsPlumbUIComponent.apply(this, arguments);
			var self = this;			
			this.overlays = [];

			var processOverlay = function(o) {
				var _newOverlay = null;
				if (_isArray(o)) {	// this is for the shorthand ["Arrow", { width:50 }] syntax
					// there's also a three arg version:
					// ["Arrow", { width:50 }, {location:0.7}] 
					// which merges the 3rd arg into the 2nd.
					var type = o[0],
						// make a copy of the object so as not to mess up anyone else's reference...
						p = jsPlumb.extend({component:self, _jsPlumb:self._jsPlumb}, o[1]);
					if (o.length == 3) jsPlumb.extend(p, o[2]);
					_newOverlay = new jsPlumb.Overlays[self._jsPlumb.getRenderMode()][type](p);					
				} else if (o.constructor == String) {
					_newOverlay = new jsPlumb.Overlays[self._jsPlumb.getRenderMode()][o]({component:self, _jsPlumb:self._jsPlumb});
				} else {
					_newOverlay = o;
				}										
					
				self.overlays.push(_newOverlay);
			},
			calculateOverlaysToAdd = function(params) {
				var defaultKeys = self.defaultOverlayKeys || [],
					o = params.overlays,
					checkKey = function(k) {
						return self._jsPlumb.Defaults[k] || jsPlumb.Defaults[k] || [];
					};
				
				if (!o) o = [];

				for (var i = 0, j = defaultKeys.length; i < j; i++)
					o.unshift.apply(o, checkKey(defaultKeys[i]));
				
				return o;
			}

			var _overlays = calculateOverlaysToAdd(params);
			if (_overlays) {
				for (var i = 0, j = _overlays.length; i < j; i++) {
					processOverlay(_overlays[i]);
				}
			}

		    // overlay finder helper method
			var _getOverlayIndex = function(id) {
				var idx = -1;
				for (var i = 0, j = self.overlays.length; i < j; i++) {
					if (id === self.overlays[i].id) {
						idx = i;
						break;
					}
				}
				return idx;
			};
						
			this.addOverlay = function(overlay, doNotRepaint) { 
				processOverlay(overlay); 
				if (!doNotRepaint) self.repaint();
			};
						
			this.getOverlay = function(id) {
				var idx = _getOverlayIndex(id);
				return idx >= 0 ? self.overlays[idx] : null;
			};
			
			this.getOverlays = function() {
				return self.overlays;
			};			
			
			this.hideOverlay = function(id) {
				var o = self.getOverlay(id);
				if (o) o.hide();
			};

			this.hideOverlays = function() {
				for (var i = 0, j = self.overlays.length; i < j; i++)
					self.overlays[i].hide();
			};
						
			this.showOverlay = function(id) {
				var o = self.getOverlay(id);
				if (o) o.show();
			};

			this.showOverlays = function() {
				for (var i = 0, j = self.overlays.length; i < j; i++)
					self.overlays[i].show();
			};
			
			this.removeAllOverlays = function() {
				for (var i = 0, j = self.overlays.length; i < j; i++) {
					if (self.overlays[i].cleanup) self.overlays[i].cleanup();
				}

				self.overlays.splice(0, self.overlays.length);
				self.repaint();
			};
						
			this.removeOverlay = function(overlayId) {
				var idx = _getOverlayIndex(overlayId);
				if (idx != -1) {
					var o = self.overlays[idx];
					if (o.cleanup) o.cleanup();
					self.overlays.splice(idx, 1);
				}
			};
						
			this.removeOverlays = function() {
				for (var i = 0, j = arguments.length; i < j; i++)
					self.removeOverlay(arguments[i]);
			};

			// this is a shortcut helper method to let people add a label as
			// overlay.			
			var _internalLabelOverlayId = "__label",
			_makeLabelOverlay = function(params) {

				var _params = {
					cssClass:params.cssClass,
					labelStyle : this.labelStyle,					
					id:_internalLabelOverlayId,
					component:self,
					_jsPlumb:self._jsPlumb
				},
				mergedParams = jsPlumb.extend(_params, params);

				return new jsPlumb.Overlays[self._jsPlumb.getRenderMode()].Label( mergedParams );
			};
			if (params.label) {
				var loc = params.labelLocation || self.defaultLabelLocation || 0.5,
					labelStyle = params.labelStyle || self._jsPlumb.Defaults.LabelStyle || jsPlumb.Defaults.LabelStyle;			
				this.overlays.push(_makeLabelOverlay({
					label:params.label,
					location:loc,
					labelStyle:labelStyle
				}));
			}
			
			this.setLabel = function(l) {
				var lo = self.getOverlay(_internalLabelOverlayId);
				if (!lo) {
					var params = l.constructor == String || l.constructor == Function ? { label:l } : l;
					lo = _makeLabelOverlay(params);	
					this.overlays.push(lo);
				}
				else {
					if (l.constructor == String || l.constructor == Function) lo.setLabel(l);
					else {
						if (l.label) lo.setLabel(l.label);
						if (l.location) lo.setLocation(l.location);
					}
				}
				
				if (!self._jsPlumb.isSuspendDrawing()) 
					self.repaint();
			};

			
			this.getLabel = function() {
				var lo = self.getOverlay(_internalLabelOverlayId);
				return lo != null ? lo.getLabel() : null;
			};

			
			this.getLabelOverlay = function() {
				return self.getOverlay(_internalLabelOverlayId);
			};
			
			var superAt = this.applyType;
			this.applyType = function(t, doNotRepaint) {
				superAt(t, doNotRepaint);
				self.removeAllOverlays();
				if (t.overlays) {
					for (var i = 0, j = t.overlays.length; i < j; i++)
						self.addOverlay(t.overlays[i], true);
				}
			};
            
            var superHover = this.setHover;
            this.setHover = function(hover, ignoreAttachedElements, timestamp) {
                superHover.apply(self, arguments);    
                for (var i = 0, j = self.overlays.length; i < j; i++) {
					self.overlays[i][hover ? "addClass":"removeClass"](self._jsPlumb.hoverClass);
				}
            };
		};		
		
		var _jsPlumbInstanceIndex = 0,
			getInstanceIndex = function() {
				var i = _jsPlumbInstanceIndex + 1;
				_jsPlumbInstanceIndex++;
				return i;
			};

		var jsPlumbInstance = function(_defaults) {
		
		
		this.Defaults = {
			Anchor : "BottomCenter",
			Anchors : [ null, null ],
            ConnectionsDetachable : true,
            ConnectionOverlays : [ ],
            Connector : "Bezier",
			Container : null,
			DoNotThrowErrors:false,
			DragOptions : { },
			DropOptions : { },
			Endpoint : "Dot",
			EndpointOverlays : [ ],
			Endpoints : [ null, null ],
			EndpointStyle : { fillStyle : "#456" },
			EndpointStyles : [ null, null ],
			EndpointHoverStyle : null,
			EndpointHoverStyles : [ null, null ],
			HoverPaintStyle : null,
			LabelStyle : { color : "black" },
			LogEnabled : false,
			Overlays : [ ],
			MaxConnections : 1, 
			PaintStyle : { lineWidth : 8, strokeStyle : "#456" },            
			ReattachConnections:false,
			RenderMode : "svg",
			Scope : "jsPlumb_DefaultScope"
		};
		if (_defaults) jsPlumb.extend(this.Defaults, _defaults);
		
		this.logEnabled = this.Defaults.LogEnabled;
		
		var _connectionTypes = { }, _endpointTypes = {};
		this.registerConnectionType = function(id, type) {
			_connectionTypes[id] = jsPlumb.extend({}, type);
		};
		this.registerConnectionTypes = function(types) {
			for (var i in types)
				_connectionTypes[i] = jsPlumb.extend({}, types[i]);
		};
		this.registerEndpointType = function(id, type) {
			_endpointTypes[id] = jsPlumb.extend({}, type);
		};
		this.registerEndpointTypes = function(types) {
			for (var i in types)
				_endpointTypes[i] = jsPlumb.extend({}, types[i]);
		};
		this.getType = function(id, typeDescriptor) {
			return typeDescriptor ===  "connection" ? _connectionTypes[id] : _endpointTypes[id];
		};

		jsPlumbUtil.EventGenerator.apply(this);
		var _currentInstance = this,
			_instanceIndex = getInstanceIndex(),
			_bb = _currentInstance.bind,
			_initialDefaults = {},
            _zoom = 1;
            
        this.getInstanceIndex = function() {
            return _instanceIndex;
        };
            
        this.setZoom = function(z, repaintEverything) {
            _zoom = z;
            if (repaintEverything) _currentInstance.repaintEverything();
        };
        this.getZoom = function() { return _zoom; };
                        
		for (var i in this.Defaults)
			_initialDefaults[i] = this.Defaults[i];

		this.bind = function(event, fn) {		
			if ("ready" === event && initialized) fn();
			else _bb.apply(_currentInstance,[event, fn]);
		};

		_currentInstance.importDefaults = function(d) {
			for (var i in d) {
				_currentInstance.Defaults[i] = d[i];
			}	
		};
		
		_currentInstance.restoreDefaults = function() {
			_currentInstance.Defaults = jsPlumb.extend({}, _initialDefaults);
		};
		
    var log = null,
        resizeTimer = null,
        initialized = false,
        _connectionBeingDragged = null,        
        connectionsByScope = {},
        /**
         * map of element id -> endpoint lists. an element can have an arbitrary
         * number of endpoints on it, and not all of them have to be connected
         * to anything.
         */
        endpointsByElement = {},
        endpointsByUUID = {},
        offsets = {},
        offsetTimestamps = {},
        floatingConnections = {},
        draggableStates = {},		
        canvasList = [],
        sizes = [],
        //listeners = {}, // a map: keys are event types, values are lists of listeners.
        DEFAULT_SCOPE = this.Defaults.Scope,
        renderMode = null,  // will be set in init()							
		

		/**
		 * appends an element to some other element, which is calculated as follows:
		 * 
		 * 1. if _currentInstance.Defaults.Container exists, use that element.
		 * 2. if the 'parent' parameter exists, use that.
		 * 3. otherwise just use the root element (for DOM usage, the document body).
		 * 
		 */
		_appendElement = function(el, parent) {
			if (_currentInstance.Defaults.Container)
				jsPlumb.CurrentLibrary.appendElement(el, _currentInstance.Defaults.Container);
			else if (!parent)
				jsPlumbAdapter.appendToRoot(el);
			else
				jsPlumb.CurrentLibrary.appendElement(el, parent);
		},

		_curIdStamp = 1,
		_idstamp = function() { return "" + _curIdStamp++; },		
		
		/**
		 * YUI, for some reason, put the result of a Y.all call into an object that contains
		 * a '_nodes' array, instead of handing back an array-like object like the other
		 * libraries do.
		 */
		_convertYUICollection = function(c) {
			return c._nodes ? c._nodes : c;
		},                

		/**
		 * Draws an endpoint and its connections. this is the main entry point into drawing connections as well
		 * as endpoints, since jsPlumb is endpoint-centric under the hood.
		 * 
		 * @param element element to draw (of type library specific element object)
		 * @param ui UI object from current library's event system. optional.
		 * @param timestamp timestamp for this paint cycle. used to speed things up a little by cutting down the amount of offset calculations we do.
		 */
		_draw = function(element, ui, timestamp, clearEdits) {
			
			// TODO is it correct to filter by headless at this top level? how would a headless adapter ever repaint?
            if (!jsPlumbAdapter.headless && !_suspendDrawing) {
			    var id = _att(element, "id"),
			    	repaintEls = _currentInstance.dragManager.getElementsForDraggable(id);			    

			    if (timestamp == null) timestamp = _timestamp();

			    _currentInstance.anchorManager.redraw(id, ui, timestamp, null, clearEdits);
			    if (repaintEls) {
				    for (var i in repaintEls) {
						_currentInstance.anchorManager.redraw(repaintEls[i].id, ui, timestamp, repaintEls[i].offset, clearEdits);			    	
				    }
				}
            }
		},

		/**
		 * executes the given function against the given element if the first
		 * argument is an object, or the list of elements, if the first argument
		 * is a list. the function passed in takes (element, elementId) as
		 * arguments.
		 */
		_elementProxy = function(element, fn) {
			var retVal = null;
			if (_isArray(element)) {
				retVal = [];
				for ( var i = 0, j = element.length; i < j; i++) {
					var el = _gel(element[i]), id = _att(el, "id");
					retVal.push(fn(el, id)); // append return values to what we will return
				}
			} else {
				var el = _gel(element), id = _att(el, "id");
				retVal = fn(el, id);
			}
			return retVal;
		},				

		/**
		 * gets an Endpoint by uuid.
		 */
		_getEndpoint = function(uuid) { return endpointsByUUID[uuid]; },

		/**
		 * inits a draggable if it's not already initialised.
		 */
		_initDraggableIfNecessary = function(element, isDraggable, dragOptions) {
			// TODO move to DragManager?
			if (!jsPlumbAdapter.headless) {
				var draggable = isDraggable == null ? false : isDraggable, jpcl = jsPlumb.CurrentLibrary;
				if (draggable) {
					if (jpcl.isDragSupported(element) && !jpcl.isAlreadyDraggable(element)) {
						var options = dragOptions || _currentInstance.Defaults.DragOptions || jsPlumb.Defaults.DragOptions;
						options = jsPlumb.extend( {}, options); // make a copy.
						var dragEvent = jpcl.dragEvents["drag"],
							stopEvent = jpcl.dragEvents["stop"],
							startEvent = jpcl.dragEvents["start"];
	
						options[startEvent] = _wrap(options[startEvent], function() {
							_currentInstance.setHoverSuspended(true);							
							_currentInstance.select({source:element}).addClass(_currentInstance.elementDraggingClass + " " + _currentInstance.sourceElementDraggingClass, true);
							_currentInstance.select({target:element}).addClass(_currentInstance.elementDraggingClass + " " + _currentInstance.targetElementDraggingClass, true);
						});
	
						options[dragEvent] = _wrap(options[dragEvent], function() {                            
							var ui = jpcl.getUIPosition(arguments, _currentInstance.getZoom());
							_draw(element, ui, null, true);
							_addClass(element, "jsPlumb_dragged");
						});
						options[stopEvent] = _wrap(options[stopEvent], function() {
							var ui = jpcl.getUIPosition(arguments, _currentInstance.getZoom());
							_draw(element, ui);
							_removeClass(element, "jsPlumb_dragged");
							_currentInstance.setHoverSuspended(false);							
							_currentInstance.select({source:element}).removeClass(_currentInstance.elementDraggingClass + " " + _currentInstance.sourceElementDraggingClass, true);
							_currentInstance.select({target:element}).removeClass(_currentInstance.elementDraggingClass + " " + _currentInstance.targetElementDraggingClass, true);
						});
						var elId = _getId(element); // need ID
						draggableStates[elId] = true;  
						var draggable = draggableStates[elId];
						options.disabled = draggable == null ? false : !draggable;
						jpcl.initDraggable(element, options, false, _currentInstance);
						_currentInstance.dragManager.register(element);
					}
				}
			}
		},
		
		/*
		* prepares a final params object that can be passed to _newConnection, taking into account defaults, events, etc.
		*/
		_prepareConnectionParams = function(params, referenceParams) {
			var _p = jsPlumb.extend( {
				sourceIsNew:true,
				targetIsNew:true
			}, params);
			if (referenceParams) jsPlumb.extend(_p, referenceParams);
			
			// hotwire endpoints passed as source or target to sourceEndpoint/targetEndpoint, respectively.
			if (_p.source && _p.source.endpoint) _p.sourceEndpoint = _p.source;
			if (_p.target && _p.target.endpoint) _p.targetEndpoint = _p.target;
			
			// test for endpoint uuids to connect
			if (params.uuids) {
				_p.sourceEndpoint = _getEndpoint(params.uuids[0]);
				_p.targetEndpoint = _getEndpoint(params.uuids[1]);
			}						

			// now ensure that if we do have Endpoints already, they're not full.
			// source:
			if (_p.sourceEndpoint && _p.sourceEndpoint.isFull()) {
				_log(_currentInstance, "could not add connection; source endpoint is full");
				return;
			}

			// target:
			if (_p.targetEndpoint && _p.targetEndpoint.isFull()) {
				_log(_currentInstance, "could not add connection; target endpoint is full");
				return;
			}
			
			// at this point, if we have source or target Endpoints, they were not new and we should mark the
			// flag to reflect that.  this is for use later with the deleteEndpointsOnDetach flag.
			if (_p.sourceEndpoint && !_p.sourceEndpoint.addedViaMouse) _p.sourceIsNew = false;
			if (_p.targetEndpoint && !_p.targetEndpoint.addedViaMouse) _p.targetIsNew = false;
			
			// if source endpoint mandates connection type and nothing specified in our params, use it.
			if (!_p.type && _p.sourceEndpoint)
				_p.type = _p.sourceEndpoint.connectionType;
			
			// copy in any connectorOverlays that were specified on the source endpoint.
			// it doesnt copy target endpoint overlays.  i'm not sure if we want it to or not.
			if (_p.sourceEndpoint && _p.sourceEndpoint.connectorOverlays) {
				_p.overlays = _p.overlays || [];
				for (var i = 0, j = _p.sourceEndpoint.connectorOverlays.length; i < j; i++) {
					_p.overlays.push(_p.sourceEndpoint.connectorOverlays[i]);
				}
			}		
            
            // pointer events
            if (!_p["pointer-events"] && _p.sourceEndpoint && _p.sourceEndpoint.connectorPointerEvents)
                _p["pointer-events"] = _p.sourceEndpoint.connectorPointerEvents;
						
			
			// if there's a target specified (which of course there should be), and there is no
			// target endpoint specified, and 'newConnection' was not set to true, then we check to
			// see if a prior call to makeTarget has provided us with the specs for the target endpoint, and
			// we use those if so.  additionally, if the makeTarget call was specified with 'uniqueEndpoint' set
			// to true, then if that target endpoint has already been created, we re-use it.
			if (_p.target && !_p.target.endpoint && !_p.targetEndpoint && !_p.newConnection) {				
				var tid = _getId(_p.target),
					tep =_targetEndpointDefinitions[tid],
					existingUniqueEndpoint = _targetEndpoints[tid];				

				if (tep) {			
					// if target not enabled, return.
					if (!_targetsEnabled[tid]) return;

					// check for max connections??						
					var newEndpoint = existingUniqueEndpoint != null ? existingUniqueEndpoint : _currentInstance.addEndpoint(_p.target, tep);
					if (_targetEndpointsUnique[tid]) _targetEndpoints[tid] = newEndpoint;
					 _p.targetEndpoint = newEndpoint;
					 newEndpoint._makeTargetCreator = true;
					 _p.targetIsNew = true;
				}
			}

			// same thing, but for source.
			if (_p.source && !_p.source.endpoint && !_p.sourceEndpoint && !_p.newConnection) {
				var tid = _getId(_p.source),
					tep = _sourceEndpointDefinitions[tid],
					existingUniqueEndpoint = _sourceEndpoints[tid];				

				if (tep) {
					// if source not enabled, return.					
					if (!_sourcesEnabled[tid]) return;
				
					var newEndpoint = existingUniqueEndpoint != null ? existingUniqueEndpoint : _currentInstance.addEndpoint(_p.source, tep);
					if (_sourceEndpointsUnique[tid]) _sourceEndpoints[tid] = newEndpoint;
					 _p.sourceEndpoint = newEndpoint;
					 _p.sourceIsNew = true;
				}
			}
			
			return _p;
		},
		
		_newConnection = function(params) {
			var connectionFunc = _currentInstance.Defaults.ConnectionType || _currentInstance.getDefaultConnectionType(),
			    endpointFunc = _currentInstance.Defaults.EndpointType || jsPlumb.Endpoint,
			    parent = jsPlumb.CurrentLibrary.getParent;
			
			if (params.container)
				params["parent"] = params.container;
			else {
				if (params.sourceEndpoint)
					params["parent"] = params.sourceEndpoint.parent;
				else if (params.source.constructor == endpointFunc)
					params["parent"] = params.source.parent;
				else params["parent"] = parent(params.source);
			}
			
			params["_jsPlumb"] = _currentInstance;
            params.newConnection = _newConnection;
            params.newEndpoint = _newEndpoint;
            params.endpointsByUUID = endpointsByUUID;             
            params.endpointsByElement = endpointsByElement;  
            params.finaliseConnection = _finaliseConnection;
			var con = new connectionFunc(params);
			con.id = "con_" + _idstamp();
			_eventFireProxy("click", "click", con);
			_eventFireProxy("dblclick", "dblclick", con);
            _eventFireProxy("contextmenu", "contextmenu", con);
			return con;
		},
		
		/**
		* adds the connection to the backing model, fires an event if necessary and then redraws
		*/
		_finaliseConnection = function(jpc, params, originalEvent) {
            params = params || {};
			// add to list of connections (by scope).
            if (!jpc.suspendedEndpoint)
			    _addToList(connectionsByScope, jpc.scope, jpc);					
			
            // always inform the anchor manager
            // except that if jpc has a suspended endpoint it's not true to say the
            // connection is new; it has just (possibly) moved. the question is whether
            // to make that call here or in the anchor manager.  i think perhaps here.
            _currentInstance.anchorManager.newConnection(jpc);
			// force a paint
			_draw(jpc.source);
			
			// fire an event
			if (!params.doNotFireConnectionEvent && params.fireEvent !== false) {
			
				var eventArgs = {
					connection:jpc,
					source : jpc.source, target : jpc.target,
					sourceId : jpc.sourceId, targetId : jpc.targetId,
					sourceEndpoint : jpc.endpoints[0], targetEndpoint : jpc.endpoints[1]
				};
			
				_currentInstance.fire("jsPlumbConnection", eventArgs, originalEvent);
				// this is from 1.3.11 onwards. "jsPlumbConnection" always felt so unnecessary, so
				// I've added this alias in 1.3.11, with a view to removing "jsPlumbConnection" completely in a future version. be aware, of course, you should only register listeners for one or the other of these events.
				_currentInstance.fire("connection", eventArgs, originalEvent);
			}
		},
		
		_eventFireProxy = function(event, proxyEvent, obj) {
			obj.bind(event, function(originalObject, originalEvent) {
				_currentInstance.fire(proxyEvent, obj, originalEvent);
			});
		},
		
		/**
		 * for the given endpoint params, returns an appropriate parent element for the UI elements that will be added.
		 * this function is used by _newEndpoint (directly below), and also in the makeSource function in jsPlumb.
		 * 
		 *   the logic is to first look for a "container" member of params, and pass that back if found.  otherwise we
		 *   handoff to the 'getParent' function in the current library.
		 */
		_getParentFromParams = function(params) {
			if (params.container)
				return params.container;
			else {
                var tag = jsPlumb.CurrentLibrary.getTagName(params.source),
                    p = jsPlumb.CurrentLibrary.getParent(params.source);
                if (tag && tag.toLowerCase() === "td")
                    return jsPlumb.CurrentLibrary.getParent(p);
                else return p;
            }
		},
		
		/**
			factory method to prepare a new endpoint.  this should always be used instead of creating Endpoints
			manually, since this method attaches event listeners and an id.
		*/
		_newEndpoint = function(params) {
				var endpointFunc = _currentInstance.Defaults.EndpointType || jsPlumb.Endpoint;
				var _p = jsPlumb.extend({}, params);				
				_p.parent = _getParentFromParams(_p);
				_p["_jsPlumb"] = _currentInstance;
                _p.newConnection = _newConnection;
                _p.newEndpoint = _newEndpoint;                
                _p.endpointsByUUID = endpointsByUUID;             
                _p.endpointsByElement = endpointsByElement;  
                _p.finaliseConnection = _finaliseConnection;
                _p.fireDetachEvent = fireDetachEvent;
                _p.floatingConnections = floatingConnections;
                _p.getParentFromParams = _getParentFromParams;
                _p.connectionsByScope = connectionsByScope;
				var ep = new endpointFunc(_p);
				ep.id = "ep_" + _idstamp();
				_eventFireProxy("click", "endpointClick", ep);
				_eventFireProxy("dblclick", "endpointDblClick", ep);
				_eventFireProxy("contextmenu", "contextmenu", ep);
				if (!jsPlumbAdapter.headless)
					_currentInstance.dragManager.endpointAdded(params.source);
			return ep;
		},
		
		/**
		 * performs the given function operation on all the connections found
		 * for the given element id; this means we find all the endpoints for
		 * the given element, and then for each endpoint find the connectors
		 * connected to it. then we pass each connection in to the given
		 * function.
		 */
		_operation = function(elId, func, endpointFunc) {
			var endpoints = endpointsByElement[elId];
			if (endpoints && endpoints.length) {
				for ( var i = 0, ii = endpoints.length; i < ii; i++) {
					for ( var j = 0, jj = endpoints[i].connections.length; j < jj; j++) {
						var retVal = func(endpoints[i].connections[j]);
						// if the function passed in returns true, we exit.
						// most functions return false.
						if (retVal) return;
					}
					if (endpointFunc) endpointFunc(endpoints[i]);
				}
			}
		},
		/**
		 * perform an operation on all elements.
		 */
		_operationOnAll = function(func) {
			for ( var elId in endpointsByElement) {
				_operation(elId, func);
			}
		},		
				        
		/**
		 * Sets whether or not the given element(s) should be draggable,
		 * regardless of what a particular plumb command may request.
		 * 
		 * @param element
		 *            May be a string, a element objects, or a list of
		 *            strings/elements.
		 * @param draggable
		 *            Whether or not the given element(s) should be draggable.
		 */
		_setDraggable = function(element, draggable) {
			return _elementProxy(element, function(el, id) {
				draggableStates[id] = draggable;
				if (jsPlumb.CurrentLibrary.isDragSupported(el)) {
					jsPlumb.CurrentLibrary.setDraggable(el, draggable);
				}
			});
		},
		/**
		 * private method to do the business of hiding/showing.
		 * 
		 * @param el
		 *            either Id of the element in question or a library specific
		 *            object for the element.
		 * @param state
		 *            String specifying a value for the css 'display' property
		 *            ('block' or 'none').
		 */
		_setVisible = function(el, state, alsoChangeEndpoints) {
			state = state === "block";
			var endpointFunc = null;
			if (alsoChangeEndpoints) {
				if (state) endpointFunc = function(ep) {
					ep.setVisible(true, true, true);
				};
				else endpointFunc = function(ep) {
					ep.setVisible(false, true, true);
				};
			}
			var id = _att(el, "id");
			_operation(id, function(jpc) {
				if (state && alsoChangeEndpoints) {		
					// this test is necessary because this functionality is new, and i wanted to maintain backwards compatibility.
					// this block will only set a connection to be visible if the other endpoint in the connection is also visible.
					var oidx = jpc.sourceId === id ? 1 : 0;
					if (jpc.endpoints[oidx].isVisible()) jpc.setVisible(true);
				}
				else  // the default behaviour for show, and what always happens for hide, is to just set the visibility without getting clever.
					jpc.setVisible(state);
			}, endpointFunc);
		},
		/**
		 * toggles the draggable state of the given element(s).
		 * 
		 * @param el
		 *            either an id, or an element object, or a list of
		 *            ids/element objects.
		 */
		_toggleDraggable = function(el) {
			return _elementProxy(el, function(el, elId) {
				var state = draggableStates[elId] == null ? false : draggableStates[elId];
				state = !state;
				draggableStates[elId] = state;
				jsPlumb.CurrentLibrary.setDraggable(el, state);
				return state;
			});
		},
		/**
		 * private method to do the business of toggling hiding/showing.
		 * 
		 * @param elId
		 *            Id of the element in question
		 */
		_toggleVisible = function(elId, changeEndpoints) {
			var endpointFunc = null;
			if (changeEndpoints) {
				endpointFunc = function(ep) {
					var state = ep.isVisible();
					ep.setVisible(!state);
				};
			}
			_operation(elId, function(jpc) {
				var state = jpc.isVisible();
				jpc.setVisible(!state);				
			}, endpointFunc);
			// todo this should call _elementProxy, and pass in the
			// _operation(elId, f) call as a function. cos _toggleDraggable does
			// that.
		},
		/**
		 * updates the offset and size for a given element, and stores the
		 * values. if 'offset' is not null we use that (it would have been
		 * passed in from a drag call) because it's faster; but if it is null,
		 * or if 'recalc' is true in order to force a recalculation, we get the current values.
		 */
		_updateOffset = function(params) {
			var timestamp = params.timestamp, recalc = params.recalc, offset = params.offset, elId = params.elId;
			if (_suspendDrawing && !timestamp) timestamp = _suspendedAt;
			if (!recalc) {
				if (timestamp && timestamp === offsetTimestamps[elId])
					return {o:offsets[elId], s:sizes[elId]};
			}
			if (recalc || !offset) { // if forced repaint or no offset available, we recalculate.
				// get the current size and offset, and store them
				var s = _gel(elId);
				if (s != null) {						
					sizes[elId] = _getSize(s);
					offsets[elId] = _getOffset(s, _currentInstance);
					offsetTimestamps[elId] = timestamp;
				}
			} else {
				offsets[elId] = offset;
                if (sizes[elId] == null) {
                    var s = _gel(elId);
                    if (s != null) sizes[elId] = _getSize(s);
                }
            }
			
			if(offsets[elId] && !offsets[elId].right) {
				offsets[elId].right = offsets[elId].left + sizes[elId][0];
				offsets[elId].bottom = offsets[elId].top + sizes[elId][1];	
				offsets[elId].width = sizes[elId][0];
				offsets[elId].height = sizes[elId][1];	
				offsets[elId].centerx = offsets[elId].left + (offsets[elId].width / 2);
				offsets[elId].centery = offsets[elId].top + (offsets[elId].height / 2);				
			}
			//return offsets[elId];
            return {o:offsets[elId], s:sizes[elId]};
		},

		// TODO comparison performance
		_getCachedData = function(elId) {
			var o = offsets[elId];
			if (!o) 
                return _updateOffset({elId:elId});
			else
                return {o:o, s:sizes[elId]};
		},

		/**
		 * gets an id for the given element, creating and setting one if
		 * necessary.  the id is of the form
		 *
		 *	jsPlumb_<instance index>_<index in instance>
		 *
		 * where "index in instance" is a monotonically increasing integer that starts at 0,
		 * for each instance.  this method is used not only to assign ids to elements that do not
		 * have them but also to connections and endpoints.
		 */
		_getId = function(element, uuid, doNotCreateIfNotFound) {
			var ele = _gel(element);
			var id = _att(ele, "id");
			if (!id || id == "undefined") {
				// check if fixed uuid parameter is given
				if (arguments.length == 2 && arguments[1] != undefined)
					id = uuid;
				else if (arguments.length == 1 || (arguments.length == 3 && !arguments[2]))
					id = "jsPlumb_" + _instanceIndex + "_" + _idstamp();
				
                if (!doNotCreateIfNotFound) _setAttribute(ele, "id", id);
			}
			return id;
		},		

		/**
		 * wraps one function with another, creating a placeholder for the
		 * wrapped function if it was null. this is used to wrap the various
		 * drag/drop event functions - to allow jsPlumb to be notified of
		 * important lifecycle events without imposing itself on the user's
		 * drag/drop functionality. TODO: determine whether or not we should
		 * support an error handler concept, if one of the functions fails.
		 * 
		 * @param wrappedFunction original function to wrap; may be null.
		 * @param newFunction function to wrap the original with.
		 * @param returnOnThisValue Optional. Indicates that the wrappedFunction should 
		 * not be executed if the newFunction returns a value matching 'returnOnThisValue'.
		 * note that this is a simple comparison and only works for primitives right now.
		 */
        // TODO move to util.
		_wrap = function(wrappedFunction, newFunction, returnOnThisValue) {
			wrappedFunction = wrappedFunction || function() { };
			newFunction = newFunction || function() { };
			return function() {
				var r = null;
				try {
					r = newFunction.apply(this, arguments);
				} catch (e) {
					_log(_currentInstance, "jsPlumb function failed : " + e);
				}
				if (returnOnThisValue == null || (r !== returnOnThisValue)) {
					try {
						wrappedFunction.apply(this, arguments);
					} catch (e) {
						_log(_currentInstance, "wrapped function failed : " + e);
					}
				}
				return r;
			};
		};	

        this.isConnectionBeingDragged = function() { return _connectionBeingDragged != null; };
        this.setConnectionBeingDragged = function(c) {_connectionBeingDragged = c; };
            
		this.connectorClass = "_jsPlumb_connector";            		
		this.hoverClass = "_jsPlumb_hover";            		
		this.endpointClass = "_jsPlumb_endpoint";		
		this.endpointConnectedClass = "_jsPlumb_endpoint_connected";		
		this.endpointFullClass = "_jsPlumb_endpoint_full";		
		this.endpointDropAllowedClass = "_jsPlumb_endpoint_drop_allowed";		
		this.endpointDropForbiddenClass = "_jsPlumb_endpoint_drop_forbidden";		
		this.overlayClass = "_jsPlumb_overlay";				
		this.draggingClass = "_jsPlumb_dragging";		
		this.elementDraggingClass = "_jsPlumb_element_dragging";			
		this.sourceElementDraggingClass = "_jsPlumb_source_element_dragging";
		this.targetElementDraggingClass = "_jsPlumb_target_element_dragging";
		this.endpointAnchorClassPrefix = "_jsPlumb_endpoint_anchor";	

		this.Anchors = {};		
		this.Connectors = {  "canvas":{}, "svg":{}, "vml":{} };				
		this.Endpoints = { "canvas":{}, "svg":{}, "vml":{} };
		this.Overlays = { "canvas":{}, "svg":{}, "vml":{}};		
		this.ConnectorRenderers = {};
				

// --------------------------- jsPLumbInstance public API ---------------------------------------------------------
		
		this.addClass = function(el, clazz) { return jsPlumb.CurrentLibrary.addClass(el, clazz); };		
		this.removeClass = function(el, clazz) { return jsPlumb.CurrentLibrary.removeClass(el, clazz); };		
		this.hasClass = function(el, clazz) { return jsPlumb.CurrentLibrary.hasClass(el, clazz); };
				
		this.addEndpoint = function(el, params, referenceParams) {
			referenceParams = referenceParams || {};
			var p = jsPlumb.extend({}, referenceParams);
			jsPlumb.extend(p, params);
			p.endpoint = p.endpoint || _currentInstance.Defaults.Endpoint || jsPlumb.Defaults.Endpoint;
			p.paintStyle = p.paintStyle || _currentInstance.Defaults.EndpointStyle || jsPlumb.Defaults.EndpointStyle;
            // YUI wrapper
			el = _convertYUICollection(el);							

			var results = [], 
				inputs = (_isArray(el) || (el.length != null && !_isString(el))) ? el : [ el ];
						
			for (var i = 0, j = inputs.length; i < j; i++) {
				var _el = _gel(inputs[i]), id = _getId(_el);
				p.source = _el;
                _updateOffset({ elId : id, timestamp:_suspendedAt });
				var e = _newEndpoint(p);
				if (p.parentAnchor) e.parentAnchor = p.parentAnchor;
				_addToList(endpointsByElement, id, e);
				var myOffset = offsets[id], myWH = sizes[id];
				var anchorLoc = e.anchor.compute( { xy : [ myOffset.left, myOffset.top ], wh : myWH, element : e, timestamp:_suspendedAt });
				var endpointPaintParams = { anchorLoc : anchorLoc, timestamp:_suspendedAt };
				
				if (_suspendDrawing) endpointPaintParams.recalc = false;
				if (!_suspendDrawing) e.paint(endpointPaintParams);
				
				results.push(e);
				//if (!jsPlumbAdapter.headless)
					//_currentInstance.dragManager.endpointAdded(_el);
			}
			
			return results.length == 1 ? results[0] : results;
		};
		
		
		this.addEndpoints = function(el, endpoints, referenceParams) {
			var results = [];
			for ( var i = 0, j = endpoints.length; i < j; i++) {
				var e = _currentInstance.addEndpoint(el, endpoints[i], referenceParams);
				if (_isArray(e))
					Array.prototype.push.apply(results, e);
				else results.push(e);
			}
			return results;
		};

		
		this.animate = function(el, properties, options) {
			var ele = _gel(el), id = _att(el, "id");
			options = options || {};
			var stepFunction = jsPlumb.CurrentLibrary.dragEvents['step'];
			var completeFunction = jsPlumb.CurrentLibrary.dragEvents['complete'];
			options[stepFunction] = _wrap(options[stepFunction], function() {
				_currentInstance.repaint(id);
			});

			// onComplete repaints, just to make sure everything looks good at the end of the animation.
			options[completeFunction] = _wrap(options[completeFunction],
					function() {
						_currentInstance.repaint(id);
					});

			jsPlumb.CurrentLibrary.animate(ele, properties, options);
		};		
		
		/**
		* checks for a listener for the given condition, executing it if found, passing in the given value.
		* condition listeners would have been attached using "bind" (which is, you could argue, now overloaded, since
		* firing click events etc is a bit different to what this does).  i thought about adding a "bindCondition"
		* or something, but decided against it, for the sake of simplicity. jsPlumb will never fire one of these
		* condition events anyway.
		*/
		this.checkCondition = function(conditionName, value) {
			var l = _currentInstance.getListener(conditionName),
				r = true;
				
			if (l && l.length > 0) {
				try {
					for (var i = 0, j = l.length; i < j; i++) {
						r = r && l[i](value); 
					}
				}
				catch (e) { 
					_log(_currentInstance, "cannot check condition [" + conditionName + "]" + e); 
				}
			}
			return r;
		};
		
		/**
		 * checks a condition asynchronously: fires the event handler and passes the handler
		 * a 'proceed' function and a 'stop' function. The handler MUST execute one or other
		 * of these once it has made up its mind.
		 *
		 * Note that although this reads the listener list for the given condition, it
		 * does not loop through and hit each listener, because that, with asynchronous
		 * callbacks, would be messy. so it uses only the first listener registered.
		 */ 
		this.checkASyncCondition = function(conditionName, value, proceed, stop) {
			var l = _currentInstance.getListener(conditionName);
				
			if (l && l.length > 0) {
				try {
					l[0](value, proceed, stop); 					
				}
				catch (e) { 
					_log(_currentInstance, "cannot asynchronously check condition [" + conditionName + "]" + e); 
				}
			}	
		};

		
		this.connect = function(params, referenceParams) {
			// prepare a final set of parameters to create connection with
			var _p = _prepareConnectionParams(params, referenceParams), jpc;
			// TODO probably a nicer return value if the connection was not made.  _prepareConnectionParams
			// will return null (and log something) if either endpoint was full.  what would be nicer is to 
			// create a dedicated 'error' object.
			if (_p) {
				// a connect call will delete its created endpoints on detach, unless otherwise specified.
				// this is because the endpoints belong to this connection only, and are no use to
				// anyone else, so they hang around like a bad smell.
				if (_p.deleteEndpointsOnDetach == null)
					_p.deleteEndpointsOnDetach = true;

				// create the connection.  it is not yet registered 
				jpc = _newConnection(_p);
				// now add it the model, fire an event, and redraw
				_finaliseConnection(jpc, _p);										
			}
			return jpc;
		};
		
		// delete the given endpoint: either an Endpoint here, or its UUID.
		this.deleteEndpoint = function(object, doNotRepaintAfterwards) {
			_currentInstance.doWhileSuspended(function() {
				var endpoint = (typeof object == "string") ? endpointsByUUID[object] : object;			
				if (endpoint) {					
					var uuid = endpoint.getUuid();
					if (uuid) endpointsByUUID[uuid] = null;				
					endpoint.detachAll().cleanup();
					if (endpoint.endpoint.cleanup) endpoint.endpoint.cleanup();
					jsPlumbUtil.removeElements(endpoint.endpoint.getDisplayElements());
					_currentInstance.anchorManager.deleteEndpoint(endpoint);
					for (var e in endpointsByElement) {
						var endpoints = endpointsByElement[e];
						if (endpoints) {
							var newEndpoints = [];
							for (var i = 0, j = endpoints.length; i < j; i++)
								if (endpoints[i] != endpoint) newEndpoints.push(endpoints[i]);
							
							endpointsByElement[e] = newEndpoints;
						}
						if(endpointsByElement[e].length <1){
							delete endpointsByElement[e];
						}
					}				
					if (!jsPlumbAdapter.headless)
						_currentInstance.dragManager.endpointDeleted(endpoint);								
				}
				return _currentInstance;									
			}, doNotRepaintAfterwards);
		};
		
		
		// delete every endpoint and their connections. distinct from reset because we dont clear listeners here.
		this.deleteEveryEndpoint = function() {
			_currentInstance.doWhileSuspended(function() {
				for ( var id in endpointsByElement) {
					var endpoints = endpointsByElement[id];
					if (endpoints && endpoints.length) {
						for ( var i = 0, j = endpoints.length; i < j; i++) {
							_currentInstance.deleteEndpoint(endpoints[i], true);
						}
					}
				}			
				endpointsByElement = {};			
				endpointsByUUID = {};
				_currentInstance.anchorManager.reset();
				_currentInstance.dragManager.reset();							
			});
			return _currentInstance;
		};

		var fireDetachEvent = function(jpc, doFireEvent, originalEvent) {
            // may have been given a connection, or in special cases, an object
            var connType =  _currentInstance.Defaults.ConnectionType || _currentInstance.getDefaultConnectionType(),
                argIsConnection = jpc.constructor == connType,
                params = argIsConnection ? {
                    connection:jpc,
				    source : jpc.source, target : jpc.target,
				    sourceId : jpc.sourceId, targetId : jpc.targetId,
				    sourceEndpoint : jpc.endpoints[0], targetEndpoint : jpc.endpoints[1]
                } : jpc;

			if (doFireEvent) {
				_currentInstance.fire("jsPlumbConnectionDetached", params, originalEvent);
				// introduced in 1.3.11..an alias because the original event name is unwieldy.  in future versions this will be the only event and the other will no longer be fired.
				_currentInstance.fire("connectionDetached", params, originalEvent);
			}
            _currentInstance.anchorManager.connectionDetached(params);
		};	

		// detach a connection
		this.detach = function() {

            if (arguments.length == 0) return;
            var connType =  _currentInstance.Defaults.ConnectionType || _currentInstance.getDefaultConnectionType(),
                firstArgIsConnection = arguments[0].constructor == connType,
                params = arguments.length == 2 ? firstArgIsConnection ? (arguments[1] || {}) : arguments[0] : arguments[0],
                fireEvent = (params.fireEvent !== false),
                forceDetach = params.forceDetach,
                conn = firstArgIsConnection ? arguments[0] : params.connection;
                                                    
				if (conn) {             
                    if (forceDetach || jsPlumbUtil.functionChain(true, false, [
                            [ conn.endpoints[0], "isDetachAllowed", [ conn ] ],    
                            [ conn.endpoints[1], "isDetachAllowed", [ conn ] ],
                            [ conn, "isDetachAllowed", [ conn ] ],
                            [ _currentInstance, "checkCondition", [ "beforeDetach", conn ] ] ])) {
                        
                        conn.endpoints[0].detach(conn, false, true, fireEvent); 
                    }
                }
                else {
					var _p = jsPlumb.extend( {}, params); // a backwards compatibility hack: source should be thought of as 'params' in this case.
					// test for endpoint uuids to detach
					if (_p.uuids) {
						_getEndpoint(_p.uuids[0]).detachFrom(_getEndpoint(_p.uuids[1]), fireEvent);
					} else if (_p.sourceEndpoint && _p.targetEndpoint) {
						_p.sourceEndpoint.detachFrom(_p.targetEndpoint);
					} else {
						var sourceId = _getId(_p.source),
						    targetId = _getId(_p.target);
						_operation(sourceId, function(jpc) {
						    if ((jpc.sourceId == sourceId && jpc.targetId == targetId) || (jpc.targetId == sourceId && jpc.sourceId == targetId)) {
							    if (_currentInstance.checkCondition("beforeDetach", jpc)) {
                                    jpc.endpoints[0].detach(jpc, false, true, fireEvent);
								}
							}
						});
					}
				}
		};

		// detach all connections from some element.
		this.detachAllConnections = function(el, params) {
            params = params || {};
            el = _gel(el);
			var id = _att(el, "id"),
                endpoints = endpointsByElement[id];
			if (endpoints && endpoints.length) {
				for ( var i = 0, j = endpoints.length; i < j; i++) {
					endpoints[i].detachAll(params.fireEvent);
				}
			}
			return _currentInstance;
		};

		// detach every connection but leave endpoints in place (unless a connection is set to auto delete them)
		this.detachEveryConnection = function(params) {
            params = params || {};
			for ( var id in endpointsByElement) {
				var endpoints = endpointsByElement[id];
				if (endpoints && endpoints.length) {
					for ( var i = 0, j = endpoints.length; i < j; i++) {
						endpoints[i].detachAll(params.fireEvent);
					}
				}
			}
			connectionsByScope = {};
			return _currentInstance;
		};


		 
		this.draggable = function(el, options) {
			if (typeof el == 'object' && el.length) {
				for ( var i = 0, j = el.length; i < j; i++) {
					var ele = _gel(el[i]);
					if (ele) _initDraggableIfNecessary(ele, true, options);
				}
			} 
			else if (el._nodes) { 	// TODO this is YUI specific; really the logic should be forced
				// into the library adapters (for jquery and mootools aswell)
				for ( var i = 0, j = el._nodes.length; i < j; i++) {
					var ele = _gel(el._nodes[i]);
					if (ele) _initDraggableIfNecessary(ele, true, options);
				}
			}
			else {
				var ele = _gel(el);
				if (ele) _initDraggableIfNecessary(ele, true, options);
			}
			return _currentInstance;
		};


		// just a library-agnostic wrapper.
		this.extend = function(o1, o2) {
			return jsPlumb.CurrentLibrary.extend(o1, o2);
		};
		
		// gets the default endpoint type. used when subclassing. see wiki.
		this.getDefaultEndpointType = function() {
			return jsPlumb.Endpoint;
		};
		
		// gets the default connection type. used when subclassing.  see wiki.
		this.getDefaultConnectionType = function() {
			return jsPlumb.Connection;
		};

		// helpers for select/selectEndpoints
		var _setOperation = function(list, func, args, selector) {
				for (var i = 0, j = list.length; i < j; i++) {
					list[i][func].apply(list[i], args);
				}	
				return selector(list);
			},
			_getOperation = function(list, func, args) {
				var out = [];
				for (var i = 0, j = list.length; i < j; i++) {					
					out.push([ list[i][func].apply(list[i], args), list[i] ]);
				}	
				return out;
			},
			setter = function(list, func, selector) {
				return function() {
					return _setOperation(list, func, arguments, selector);
				};
			},
			getter = function(list, func) {
				return function() {
					return _getOperation(list, func, arguments);
				};	
			},
			prepareList = function(input, doNotGetIds) {
				var r = [];
				if (input) {
					if (typeof input == 'string') {
						if (input === "*") return input;
						r.push(input);
					}
					else {
						if (doNotGetIds) r = input;
						else { 
							for (var i = 0, j = input.length; i < j; i++) 
								r.push(_getId(_gel(input[i])));
						}	
					}
				}
				return r;
			},
			filterList = function(list, value, missingIsFalse) {
				if (list === "*") return true;
				return list.length > 0 ? _indexOf(list, value) != -1 : !missingIsFalse;
			};

		// get some connections, specifying source/target/scope
		this.getConnections = function(options, flat) {
			if (!options) {
				options = {};
			} else if (options.constructor == String) {
				options = { "scope": options };
			}
			var
			scope = options.scope || _currentInstance.getDefaultScope(),
			scopes = prepareList(scope, true),
			sources = prepareList(options.source),
			targets = prepareList(options.target),			
			results = (!flat && scopes.length > 1) ? {} : [],
			_addOne = function(scope, obj) {
				if (!flat && scopes.length > 1) {
					var ss = results[scope];
					if (ss == null) {
						ss = []; results[scope] = ss;
					}
					ss.push(obj);
				} else results.push(obj);
			};
			for ( var i in connectionsByScope) {
				if (filterList(scopes, i)) {
					for ( var j = 0, jj = connectionsByScope[i].length; j < jj; j++) {
						var c = connectionsByScope[i][j];
						if (filterList(sources, c.sourceId) && filterList(targets, c.targetId))
							_addOne(i, c);
					}
				}
			}
			return results;
		};
		
		var _curryEach = function(list, executor) {
				return function(f) {
					for (var i = 0, ii = list.length; i < ii; i++) {
						f(list[i]);
					}
					return executor(list);
				};		
			},
			_curryGet = function(list) {
				return function(idx) {
					return list[idx];
				};
			};
			
		var _makeCommonSelectHandler = function(list, executor) {
            var out = {
                    length:list.length,
				    each:_curryEach(list, executor),
				    get:_curryGet(list)
                },
                setters = ["setHover", "removeAllOverlays", "setLabel", "addClass", "addOverlay", "removeOverlay", 
                           "removeOverlays", "showOverlay", "hideOverlay", "showOverlays", "hideOverlays", "setPaintStyle",
                           "setHoverPaintStyle", "setSuspendEvents", "setParameter", "setParameters", "setVisible", 
                           "repaint", "addType", "toggleType", "removeType", "removeClass", "setType", "bind", "unbind" ],
                
                getters = ["getLabel", "getOverlay", "isHover", "getParameter", "getParameters", "getPaintStyle",
                           "getHoverPaintStyle", "isVisible", "hasType", "getType", "isSuspendEvents" ];
            
            for (var i = 0, ii = setters.length; i < ii; i++)
                out[setters[i]] = setter(list, setters[i], executor);
            
            for (var i = 0, ii = getters.length; i < ii; i++)
                out[getters[i]] = getter(list, getters[i]);       
            
            return out;
		};
		
		var	_makeConnectionSelectHandler = function(list) {
			var common = _makeCommonSelectHandler(list, _makeConnectionSelectHandler);
			return jsPlumb.CurrentLibrary.extend(common, {
				// setters									
				setDetachable:setter(list, "setDetachable", _makeConnectionSelectHandler),
				setReattach:setter(list, "setReattach", _makeConnectionSelectHandler),
				setConnector:setter(list, "setConnector", _makeConnectionSelectHandler),			
				detach:function() {
					for (var i = 0, ii = list.length; i < ii; i++)
						_currentInstance.detach(list[i]);
				},				
				// getters
				isDetachable:getter(list, "isDetachable"),
				isReattach:getter(list, "isReattach")
			});
		};
		
		var	_makeEndpointSelectHandler = function(list) {
			var common = _makeCommonSelectHandler(list, _makeEndpointSelectHandler);
			return jsPlumb.CurrentLibrary.extend(common, {
				setEnabled:setter(list, "setEnabled", _makeEndpointSelectHandler),				
				setAnchor:setter(list, "setAnchor", _makeEndpointSelectHandler),
				isEnabled:getter(list, "isEnabled"),
				detachAll:function() {
					for (var i = 0, ii = list.length; i < ii; i++)
						list[i].detachAll();
				},
				"remove":function() {
					for (var i = 0, ii = list.length; i < ii; i++)
						_currentInstance.deleteEndpoint(list[i]);
				}
			});
		};
			

		this.select = function(params) {
			params = params || {};
			params.scope = params.scope || "*";
			var c = params.connections || _currentInstance.getConnections(params, true);
			return _makeConnectionSelectHandler(c);							
		};
		

		this.selectEndpoints = function(params) {
			params = params || {};
			params.scope = params.scope || "*";
			var noElementFilters = !params.element && !params.source && !params.target,			
				elements = noElementFilters ? "*" : prepareList(params.element),
				sources = noElementFilters ? "*" : prepareList(params.source),
				targets = noElementFilters ? "*" : prepareList(params.target),
				scopes = prepareList(params.scope, true);
			
			var ep = [];
			
			for (var el in endpointsByElement) {
				var either = filterList(elements, el, true),
					source = filterList(sources, el, true),
					sourceMatchExact = sources != "*",
					target = filterList(targets, el, true),
					targetMatchExact = targets != "*"; 
					
				// if they requested 'either' then just match scope. otherwise if they requested 'source' (not as a wildcard) then we have to match only endpoints that have isSource set to to true, and the same thing with isTarget.  
				if ( either || source  || target ) {
					inner:
					for (var i = 0, ii = endpointsByElement[el].length; i < ii; i++) {
						var _ep = endpointsByElement[el][i];
						if (filterList(scopes, _ep.scope, true)) {
						
							var noMatchSource = (sourceMatchExact && sources.length > 0 && !_ep.isSource),
								noMatchTarget = (targetMatchExact && targets.length > 0 && !_ep.isTarget);
						
							if (noMatchSource || noMatchTarget)								  
								  continue inner; 
							 							
							ep.push(_ep);		
						}
					}
				}					
			}
			
			return _makeEndpointSelectHandler(ep);
		};

		// get all connections managed by the instance of jsplumb.
		this.getAllConnections = function() {
			return connectionsByScope;
		};


		this.getDefaultScope = function() {
			return DEFAULT_SCOPE;
		};

		// get an endpoint by uuid.
		this.getEndpoint = _getEndpoint;
				
		// get endpoints for some element.
		this.getEndpoints = function(el) {
			return endpointsByElement[_getId(el)];
		};		

		/*
		 * Gets an element's id, creating one if necessary. really only exposed
		 * for the lib-specific functionality to access; would be better to pass
		 * the current instance into the lib-specific code (even though this is
		 * a static call. i just don't want to expose it to the public API).
		 */
		this.getId = _getId;
		this.getOffset = function(id) { 
			var o = offsets[id]; 
			return _updateOffset({elId:id});
		};
		
		// gets a library-agnostic selector.  not necessary for use outside of jsplumb, since
		// you already know what library you're using it with.	
		this.getSelector = function() {
			return jsPlumb.CurrentLibrary.getSelector.apply(null, arguments);
		};
		
		// get the size of the element with the given id, perhaps from cache.
		this.getSize = function(id) { 
			var s = sizes[id]; 
			if (!s) _updateOffset({elId:id});
			return sizes[id];
		};		
		
		this.appendElement = _appendElement;
		
		var _hoverSuspended = false;
		this.isHoverSuspended = function() { return _hoverSuspended; };
		this.setHoverSuspended = function(s) { _hoverSuspended = s; };

		var _isAvailable = function(m) {
			return function() {
				return jsPlumbAdapter.isRenderModeAvailable(m);
			};
		}
		this.isCanvasAvailable = _isAvailable("canvas");
		this.isSVGAvailable = _isAvailable("svg");
		this.isVMLAvailable = _isAvailable("vml");

		// set an element's connections to be hidden
		this.hide = function(el, changeEndpoints) {
			_setVisible(el, "none", changeEndpoints);
			return _currentInstance;
		};
		
		// exposed for other objects to use to get a unique id.
		this.idstamp = _idstamp;
		
		/**
		 * callback from the current library to tell us to prepare ourselves (attach
		 * mouse listeners etc; can't do that until the library has provided a bind method)		 
		 */
		this.init = function() {
			if (!initialized) {                
                _currentInstance.anchorManager = new jsPlumb.AnchorManager({jsPlumbInstance:_currentInstance});                
				_currentInstance.setRenderMode(_currentInstance.Defaults.RenderMode);  // calling the method forces the capability logic to be run.										
				initialized = true;
				_currentInstance.fire("ready", _currentInstance);
			}
		};
		
		this.log = log;
		this.jsPlumbUIComponent = jsPlumbUIComponent;		

		/*
		 * Creates an anchor with the given params.
		 * 
		 * 
		 * Returns: The newly created Anchor.
		 * Throws: an error if a named anchor was not found.
		 */
		this.makeAnchor = function() {
			var _a = function(t, p) {
				if (jsPlumb.Anchors[t]) return new jsPlumb.Anchors[t](p);
				if (!_currentInstance.Defaults.DoNotThrowErrors)
					throw { msg:"jsPlumb: unknown anchor type '" + t + "'" };
			};
			if (arguments.length == 0) return null;
			var specimen = arguments[0], elementId = arguments[1], jsPlumbInstance = arguments[2], newAnchor = null;			
			// if it appears to be an anchor already...
			if (specimen.compute && specimen.getOrientation) return specimen;  //TODO hazy here about whether it should be added or is already added somehow.
			// is it the name of an anchor type?
			else if (typeof specimen == "string") {
				//newAnchor = jsPlumb.Anchors[arguments[0]]({elementId:elementId, jsPlumbInstance:_currentInstance});
				newAnchor = _a(arguments[0], {elementId:elementId, jsPlumbInstance:_currentInstance});
			}
			// is it an array? it will be one of:
			// 		an array of [name, params] - this defines a single anchor
			//		an array of arrays - this defines some dynamic anchors
			//		an array of numbers - this defines a single anchor.				
			else if (_isArray(specimen)) {
				if (_isArray(specimen[0]) || _isString(specimen[0])) {
					if (specimen.length == 2 && _isString(specimen[0]) && _isObject(specimen[1])) {
						var pp = jsPlumb.extend({elementId:elementId, jsPlumbInstance:_currentInstance}, specimen[1]);
						//newAnchor = new jsPlumb.Anchors[specimen[0]](pp);
						newAnchor = _a(specimen[0], pp);
					}
					else
						newAnchor = new jsPlumb.DynamicAnchor({anchors:specimen, selector:null, elementId:elementId, jsPlumbInstance:jsPlumbInstance});
				}
				else {
					var anchorParams = {
						x:specimen[0], y:specimen[1],
						orientation : (specimen.length >= 4) ? [ specimen[2], specimen[3] ] : [0,0],
						offsets : (specimen.length >= 6) ? [ specimen[4], specimen[5] ] : [ 0, 0 ],
						elementId:elementId,
                        jsPlumbInstance:jsPlumbInstance,
                        cssClass:specimen.length == 7 ? specimen[6] : null
					};						
					newAnchor = new jsPlumb.Anchor(anchorParams);
					newAnchor.clone = function() { return new jsPlumb.Anchor(anchorParams); };						 					
				}
			}
			
			if (!newAnchor.id) newAnchor.id = "anchor_" + _idstamp();
			return newAnchor;
		};

		/**
		 * makes a list of anchors from the given list of types or coords, eg
		 * ["TopCenter", "RightMiddle", "BottomCenter", [0, 1, -1, -1] ]
		 */
		this.makeAnchors = function(types, elementId, jsPlumbInstance) {
			var r = [];
			for ( var i = 0, ii = types.length; i < ii; i++) {
				if (typeof types[i] == "string")
					r.push(jsPlumb.Anchors[types[i]]({elementId:elementId, jsPlumbInstance:jsPlumbInstance}));
				else if (_isArray(types[i]))
					r.push(_currentInstance.makeAnchor(types[i], elementId, jsPlumbInstance));
			}
			return r;
		};

		/**
		 * Makes a dynamic anchor from the given list of anchors (which may be in shorthand notation as strings or dimension arrays, or Anchor
		 * objects themselves) and the given, optional, anchorSelector function (jsPlumb uses a default if this is not provided; most people will
		 * not need to provide this - i think). 
		 */
		this.makeDynamicAnchor = function(anchors, anchorSelector) {
			return new jsPlumb.DynamicAnchor({anchors:anchors, selector:anchorSelector, elementId:null, jsPlumbInstance:_currentInstance});
		};
		
		
		var _targetEndpointDefinitions = {},
			_targetEndpoints = {},
			_targetEndpointsUnique = {},
			_targetMaxConnections = {},
			_setEndpointPaintStylesAndAnchor = function(ep, epIndex) {
				ep.paintStyle = ep.paintStyle ||
				 				_currentInstance.Defaults.EndpointStyles[epIndex] ||
	                            _currentInstance.Defaults.EndpointStyle ||
	                            jsPlumb.Defaults.EndpointStyles[epIndex] ||
	                            jsPlumb.Defaults.EndpointStyle;
				ep.hoverPaintStyle = ep.hoverPaintStyle ||
	                           _currentInstance.Defaults.EndpointHoverStyles[epIndex] ||
	                           _currentInstance.Defaults.EndpointHoverStyle ||
	                           jsPlumb.Defaults.EndpointHoverStyles[epIndex] ||
	                           jsPlumb.Defaults.EndpointHoverStyle;                            

				ep.anchor = ep.anchor ||
	                      	_currentInstance.Defaults.Anchors[epIndex] ||
	                      	_currentInstance.Defaults.Anchor ||
	                      	jsPlumb.Defaults.Anchors[epIndex] ||
	                      	jsPlumb.Defaults.Anchor;                           
					
				ep.endpoint = ep.endpoint ||
							  _currentInstance.Defaults.Endpoints[epIndex] ||
							  _currentInstance.Defaults.Endpoint ||
							  jsPlumb.Defaults.Endpoints[epIndex] ||
							  jsPlumb.Defaults.Endpoint;
			};

		// see API docs
		this.makeTarget = function(el, params, referenceParams) {						
			
			var p = jsPlumb.extend({_jsPlumb:_currentInstance}, referenceParams);
			jsPlumb.extend(p, params);
			_setEndpointPaintStylesAndAnchor(p, 1);                                                    
			var jpcl = jsPlumb.CurrentLibrary,
			    targetScope = p.scope || _currentInstance.Defaults.Scope,
			    deleteEndpointsOnDetach = !(p.deleteEndpointsOnDetach === false),
			    maxConnections = p.maxConnections || -1,
				onMaxConnections = p.onMaxConnections;
			_doOne = function(_el) {
				
				// get the element's id and store the endpoint definition for it.  jsPlumb.connect calls will look for one of these,
				// and use the endpoint definition if found.
				var elid = _getId(_el);
				_targetEndpointDefinitions[elid] = p;
				_targetEndpointsUnique[elid] = p.uniqueEndpoint,
				_targetMaxConnections[elid] = maxConnections,
				_targetsEnabled[elid] = true,
				proxyComponent = new jsPlumbUIComponent(p);								
				
				var dropOptions = jsPlumb.extend({}, p.dropOptions || {}),
				_drop = function() {

					var originalEvent = jsPlumb.CurrentLibrary.getDropEvent(arguments),
						targetCount = _currentInstance.select({target:elid}).length;																							

					_currentInstance.currentlyDragging = false;
					var draggable = _gel(jpcl.getDragObject(arguments)),
						id = _att(draggable, "dragId"),				
						// restore the original scope if necessary (issue 57)
						scope = _att(draggable, "originalScope"),
						jpc = floatingConnections[id],
						source = jpc.endpoints[0],
						_endpoint = p.endpoint ? jsPlumb.extend({}, p.endpoint) : {};
						
					if (!_targetsEnabled[elid] || _targetMaxConnections[elid] > 0 && targetCount >= _targetMaxConnections[elid]){
						if (onMaxConnections) {
							onMaxConnections({
								element:_el,
								connection:jpc
							}, originalEvent);
						}
						return false;
					}

					// unlock the source anchor to allow it to refresh its position if necessary
					source.anchor.locked = false;					
										
					if (scope) jpcl.setDragScope(draggable, scope);				
					
					// check if drop is allowed here.					
					//var _continue = jpc.isDropAllowed(jpc.sourceId, _getId(_el), jpc.scope);		
					var _continue = proxyComponent.isDropAllowed(jpc.sourceId, _getId(_el), jpc.scope, jpc, null);		
					
					// regardless of whether the connection is ok, reconfigure the existing connection to 
					// point at the current info. we need this to be correct for the detach event that will follow.
					// clear the source endpoint from the list to detach. we will detach this connection at this
					// point, but we want to keep the source endpoint.  the target is a floating endpoint and should
					// be removed.  TODO need to figure out whether this code can result in endpoints kicking around
					// when they shouldnt be.  like is this a full detach of a connection?  can it be?
					if (jpc.endpointsToDeleteOnDetach) {
						if (source === jpc.endpointsToDeleteOnDetach[0])
							jpc.endpointsToDeleteOnDetach[0] = null;
						else if (source === jpc.endpointsToDeleteOnDetach[1])
							jpc.endpointsToDeleteOnDetach[1] = null;
					}
					// reinstate any suspended endpoint; this just puts the connection back into
					// a state in which it will report sensible values if someone asks it about
					// its target.  we're going to throw this connection away shortly so it doesnt matter
					// if we manipulate it a bit.
					if (jpc.suspendedEndpoint) {
						jpc.targetId = jpc.suspendedEndpoint.elementId;
						jpc.target = jpcl.getElementObject(jpc.suspendedEndpoint.elementId);
						jpc.endpoints[1] = jpc.suspendedEndpoint;
					}																										
					
					if (_continue) {
					
						// detach this connection from the source.						
						source.detach(jpc, false, true, false);
					
						// make a new Endpoint for the target												
						var newEndpoint = _targetEndpoints[elid] || _currentInstance.addEndpoint(_el, p);
						if (p.uniqueEndpoint) _targetEndpoints[elid] = newEndpoint;  // may of course just store what it just pulled out. that's ok.
						newEndpoint._makeTargetCreator = true;
																
						// if the anchor has a 'positionFinder' set, then delegate to that function to find
						// out where to locate the anchor.
						if (newEndpoint.anchor.positionFinder != null) {
							var dropPosition = jpcl.getUIPosition(arguments, _currentInstance.getZoom()),
							elPosition = _getOffset(_el, _currentInstance),
							elSize = _getSize(_el),
							ap = newEndpoint.anchor.positionFinder(dropPosition, elPosition, elSize, newEndpoint.anchor.constructorParams);
							newEndpoint.anchor.x = ap[0];
							newEndpoint.anchor.y = ap[1];
							// now figure an orientation for it..kind of hard to know what to do actually. probably the best thing i can do is to
							// support specifying an orientation in the anchor's spec. if one is not supplied then i will make the orientation 
							// be what will cause the most natural link to the source: it will be pointing at the source, but it needs to be
							// specified in one axis only, and so how to make that choice? i think i will use whichever axis is the one in which
							// the target is furthest away from the source.
						}
						var c = _currentInstance.connect({
							source:source,
							target:newEndpoint,
							scope:scope,
							previousConnection:jpc,
							container:jpc.parent,
							deleteEndpointsOnDetach:deleteEndpointsOnDetach,
                            endpointsToDeleteOnDetach : deleteEndpointsOnDetach ? [ source, newEndpoint ] : null,
							// 'endpointWillMoveAfterConnection' is set by the makeSource function, and it indicates that the
							// given endpoint will actually transfer from the element it is currently attached to to some other
							// element after a connection has been established.  in that case, we do not want to fire the
							// connection event, since it will have the wrong data in it; makeSource will do it for us.
							// this is controlled by the 'parent' parameter on a makeSource call.
							doNotFireConnectionEvent:source.endpointWillMoveAfterConnection
						});

						// delete the original target endpoint.  but only want to do this if the endpoint was created
						// automatically and has no other connections.
						if (jpc.endpoints[1]._makeTargetCreator && jpc.endpoints[1].connections.length < 2)
							_currentInstance.deleteEndpoint(jpc.endpoints[1]);

						c.repaint();
					}				
					// if not allowed to drop...
					else {
						// TODO this code is identical (pretty much) to what happens when a connection
						// dragged from a normal endpoint is in this situation. refactor.
						// is this an existing connection, and will we reattach?
						if (jpc.suspendedEndpoint) {
							//if (source.isReattach) {
							if (jpc.isReattach()) {
								jpc.setHover(false);
								jpc.floatingAnchorIndex = null;
								jpc.suspendedEndpoint.addConnection(jpc);
								_currentInstance.repaint(source.elementId);
							}
							else
								source.detach(jpc, false, true, true, originalEvent);  // otherwise, detach the connection and tell everyone about it.
						}
						
					}														
				};
				
				var dropEvent = jpcl.dragEvents['drop'];
				dropOptions["scope"] = dropOptions["scope"] || targetScope;
				dropOptions[dropEvent] = _wrap(dropOptions[dropEvent], _drop);
				
				jpcl.initDroppable(_el, dropOptions, true);
			};
			
			el = _convertYUICollection(el);			
			
			var inputs = el.length && el.constructor != String ? el : [ el ];
						
			for (var i = 0, ii = inputs.length; i < ii; i++) {			
				_doOne(_gel(inputs[i]));
			}

			return _currentInstance;
		};

		// see api docs
		this.unmakeTarget = function(el, doNotClearArrays) {
			el = jsPlumb.CurrentLibrary.getElementObject(el);
			var elid = _getId(el);			

			// TODO this is not an exhaustive unmake of a target, since it does not remove the droppable stuff from
			// the element.  the effect will be to prevent it form behaving as a target, but it's not completely purged.
			if (!doNotClearArrays) {
				delete _targetEndpointDefinitions[elid];
				delete _targetEndpointsUnique[elid];
				delete _targetMaxConnections[elid];
				delete _targetsEnabled[elid];                
			}

			return _currentInstance;
		};
		
		// see api docs
		this.makeTargets = function(els, params, referenceParams) {
			for ( var i = 0, ii = els.length; i < ii; i++) {
				_currentInstance.makeTarget(els[i], params, referenceParams);				
			}
		};
		
		
		var _sourceEndpointDefinitions = {},
			_sourceEndpoints = {},
			_sourceEndpointsUnique = {},
			_sourcesEnabled = {},
			_sourceTriggers = {},
			_sourceMaxConnections = {},
			_targetsEnabled = {},
			selectorFilter = function(evt, _el, selector) {	            
                var t = evt.target || evt.srcElement, ok = false, 
                    sel = _currentInstance.getSelector(_el, selector);
                for (var j = 0; j < sel.length; j++) {
                    if (sel[j] == t) {
                        ok = true;
                        break;
                    }
                }
                return ok;	            
	        };

	    // see api docs
		this.makeSource = function(el, params, referenceParams) {
			var p = jsPlumb.extend({}, referenceParams);
			jsPlumb.extend(p, params);
			_setEndpointPaintStylesAndAnchor(p, 0);   
			var jpcl = jsPlumb.CurrentLibrary,
				maxConnections = p.maxConnections || -1,
				onMaxConnections = p.onMaxConnections,
				_doOne = function(_el) {
					// get the element's id and store the endpoint definition for it.  jsPlumb.connect calls will look for one of these,
					// and use the endpoint definition if found.
					var elid = _getId(_el),
						parentElement = function() {
							return p.parent == null ? p.parent : p.parent === "parent" ? jpcl.getElementObject(jpcl.getDOMElement(_el).parentNode) : jpcl.getElementObject(p.parent);
						},
						idToRegisterAgainst = p.parent != null ? _currentInstance.getId(parentElement()) : elid;
					
					_sourceEndpointDefinitions[idToRegisterAgainst] = p;
					_sourceEndpointsUnique[idToRegisterAgainst] = p.uniqueEndpoint;
					_sourcesEnabled[idToRegisterAgainst] = true;

					var stopEvent = jpcl.dragEvents["stop"],
						dragEvent = jpcl.dragEvents["drag"],
						dragOptions = jsPlumb.extend({ }, p.dragOptions || {}),
						existingDrag = dragOptions.drag,
						existingStop = dragOptions.stop,
						ep = null,
						endpointAddedButNoDragYet = false;
				
					_sourceMaxConnections[idToRegisterAgainst] = maxConnections;	

					// set scope if its not set in dragOptions but was passed in in params
					dragOptions["scope"] = dragOptions["scope"] || p.scope;

					dragOptions[dragEvent] = _wrap(dragOptions[dragEvent], function() {
						if (existingDrag) existingDrag.apply(this, arguments);
						endpointAddedButNoDragYet = false;
					});
					
					dragOptions[stopEvent] = _wrap(dragOptions[stopEvent], function() { 							
						if (existingStop) existingStop.apply(this, arguments);								

	                    //_currentlyDown = false;
						_currentInstance.currentlyDragging = false;
						
						if (ep.connections.length == 0)
							_currentInstance.deleteEndpoint(ep);
						else {
							
							jpcl.unbind(ep.canvas, "mousedown"); 
									
							// reset the anchor to the anchor that was initially provided. the one we were using to drag
							// the connection was just a placeholder that was located at the place the user pressed the
							// mouse button to initiate the drag.
							var anchorDef = p.anchor || _currentInstance.Defaults.Anchor,
								oldAnchor = ep.anchor,
								oldConnection = ep.connections[0];

							ep.setAnchor(_currentInstance.makeAnchor(anchorDef, elid, _currentInstance));																							
							
							if (p.parent) {						
								var parent = parentElement();
								if (parent) {	
									var currentId = ep.elementId,
										potentialParent = p.container || _currentInstance.Defaults.Container || jsPlumb.Defaults.Container;			
																	
									ep.setElement(parent, potentialParent);
									ep.endpointWillMoveAfterConnection = false;														
									_currentInstance.anchorManager.rehomeEndpoint(currentId, parent);																					
									oldConnection.previousConnection = null;
									// remove from connectionsByScope
									_removeWithFunction(connectionsByScope[oldConnection.scope], function(c) {
										return c.id === oldConnection.id;
									});										
									_currentInstance.anchorManager.connectionDetached({
										sourceId:oldConnection.sourceId,
										targetId:oldConnection.targetId,
										connection:oldConnection
									});											
									_finaliseConnection(oldConnection);					
								}
							}						
							
							ep.repaint();			
							_currentInstance.repaint(ep.elementId);																		
							_currentInstance.repaint(oldConnection.targetId);
						}				
					});
					// when the user presses the mouse, add an Endpoint, if we are enabled.
					var mouseDownListener = function(e) {

						// if disabled, return.
						if (!_sourcesEnabled[idToRegisterAgainst]) return;
	                    
	                    // if a filter was given, run it, and return if it says no.
						if (p.filter) {
							var evt = jpcl.getOriginalEvent(e),
								r = jsPlumbUtil.isString(p.filter) ? selectorFilter(evt, _el, p.filter) : p.filter(evt, _el);
							
							if (r === false) return;
						}
						
						// if maxConnections reached
						var sourceCount = _currentInstance.select({source:idToRegisterAgainst}).length
						if (_sourceMaxConnections[idToRegisterAgainst] >= 0 && sourceCount >= _sourceMaxConnections[idToRegisterAgainst]) {
							if (onMaxConnections) {
								onMaxConnections({
									element:_el,
									maxConnections:maxConnections
								}, e);
							}
							return false;
						}					

						// make sure we have the latest offset for this div 
						var myOffsetInfo = _updateOffset({elId:elid}).o,
							z = _currentInstance.getZoom(),		
							x = ( ((e.pageX || e.page.x) / z) - myOffsetInfo.left) / myOffsetInfo.width, 
						    y = ( ((e.pageY || e.page.y) / z) - myOffsetInfo.top) / myOffsetInfo.height,
						    parentX = x, 
						    parentY = y;					
								
						// if there is a parent, the endpoint will actually be added to it now, rather than the div
						// that was the source.  in that case, we have to adjust the anchor position so it refers to
						// the parent.
						if (p.parent) {
							var pEl = parentElement(), pId = _getId(pEl);
							myOffsetInfo = _updateOffset({elId:pId}).o;
							parentX = ((e.pageX || e.page.x) - myOffsetInfo.left) / myOffsetInfo.width, 
						    parentY = ((e.pageY || e.page.y) - myOffsetInfo.top) / myOffsetInfo.height;
						}											
						
						// we need to override the anchor in here, and force 'isSource', but we don't want to mess with
						// the params passed in, because after a connection is established we're going to reset the endpoint
						// to have the anchor we were given.
						var tempEndpointParams = {};
						jsPlumb.extend(tempEndpointParams, p);
						tempEndpointParams.isSource = true;
						tempEndpointParams.anchor = [x,y,0,0];
						tempEndpointParams.parentAnchor = [ parentX, parentY, 0, 0 ];
						tempEndpointParams.dragOptions = dragOptions;
						// if a parent was given we need to turn that into a "container" argument.  this is, by default,
						// the parent of the element we will move to, so parent of p.parent in this case.  however, if
						// the user has specified a 'container' on the endpoint definition or on 
						// the defaults, we should use that.
						if (p.parent) {
							var potentialParent = tempEndpointParams.container || _currentInstance.Defaults.Container || jsPlumb.Defaults.Container;
							if (potentialParent)
								tempEndpointParams.container = potentialParent;
							else
								tempEndpointParams.container = jsPlumb.CurrentLibrary.getParent(parentElement());
						}
						
						ep = _currentInstance.addEndpoint(elid, tempEndpointParams);

						endpointAddedButNoDragYet = true;
						// we set this to prevent connections from firing attach events before this function has had a chance
						// to move the endpoint.
						ep.endpointWillMoveAfterConnection = p.parent != null;
						ep.endpointWillMoveTo = p.parent ? parentElement() : null;
						ep.addedViaMouse = true;

	                    var _delTempEndpoint = function() {
							// this mouseup event is fired only if no dragging occurred, by jquery and yui, but for mootools
							// it is fired even if dragging has occurred, in which case we would blow away a perfectly
							// legitimate endpoint, were it not for this check.  the flag is set after adding an
							// endpoint and cleared in a drag listener we set in the dragOptions above.
							if(endpointAddedButNoDragYet) {
								_currentInstance.deleteEndpoint(ep);
	                        }
						};

						_currentInstance.registerListener(ep.canvas, "mouseup", _delTempEndpoint);
	                    _currentInstance.registerListener(_el, "mouseup", _delTempEndpoint);
						
						// and then trigger its mousedown event, which will kick off a drag, which will start dragging
						// a new connection from this endpoint.
						jpcl.trigger(ep.canvas, "mousedown", e);
						
					};
	               
	                // register this on jsPlumb so that it can be cleared by a reset.
	                _currentInstance.registerListener(_el, "mousedown", mouseDownListener);
	                _sourceTriggers[elid] = mouseDownListener;

	                // lastly, if a filter was provided, set it as a dragFilter on the element,
	                // to prevent the element drag function from kicking in when we want to
	                // drag a new connection
	                if (p.filter && jsPlumbUtil.isString(p.filter)) {
	                	jpcl.setDragFilter(_el, p.filter);
	                }
				};
			
			el = _convertYUICollection(el);			
			
			var inputs = el.length && el.constructor != String ? el : [ el ];
						
			for (var i = 0, ii = inputs.length; i < ii; i++) {			
				_doOne(_gel(inputs[i]));
			}

			return _currentInstance;
		};
	
		// see api docs		
		this.unmakeSource = function(el, doNotClearArrays) {
			el = jsPlumb.CurrentLibrary.getElementObject(el);
			var id = _getId(el),
				mouseDownListener = _sourceTriggers[id];
			
			if (mouseDownListener) 
				_currentInstance.unregisterListener(el, "mousedown", mouseDownListener);

			if (!doNotClearArrays) {
				delete _sourceEndpointDefinitions[id];
				delete _sourceEndpointsUnique[id];
				delete _sourcesEnabled[id];
				delete _sourceTriggers[id];
				delete _sourceMaxConnections[id];
			}

			return _currentInstance;
		};

		// see api docs
		this.unmakeEverySource = function() {
			for (var i in _sourcesEnabled)
				_currentInstance.unmakeSource(i, true);

			_sourceEndpointDefinitions = {};
			_sourceEndpointsUnique = {};
			_sourcesEnabled = {};
			_sourceTriggers = {};
		};
		
		// see api docs
		this.unmakeEveryTarget = function() {
			for (var i in _targetsEnabled)
				_currentInstance.unmakeTarget(i, true);
			
			_targetEndpointDefinitions = {};
			_targetEndpointsUnique = {};
			_targetMaxConnections = {};
			_targetsEnabled = {};

			return _currentInstance;
		};
		
		
		this.makeSources = function(els, params, referenceParams) {
			for ( var i = 0, ii = els.length; i < ii; i++) {
				_currentInstance.makeSource(els[i], params, referenceParams);				
			}

			return _currentInstance;
		};

		// does the work of setting a source enabled or disabled.
		var _setEnabled = function(type, el, state, toggle) {
			var a = type == "source" ? _sourcesEnabled : _targetsEnabled;									

			if (_isString(el)) a[el] = toggle ? !a[el] : state;
			else if (el.length) {
				el = _convertYUICollection(el);
				for (var i = 0, ii = el.length; i < ii; i++) {
					var id = _el = jsPlumb.CurrentLibrary.getElementObject(el[i]), id = _getId(_el);
					a[id] = toggle ? !a[id] : state;
				}
			}	
			return _currentInstance;
		};

		
		this.setSourceEnabled = function(el, state) {
			return _setEnabled("source", el, state);
		};

			
		this.toggleSourceEnabled = function(el) {
			_setEnabled("source", el, null, true);	
			return _currentInstance.isSourceEnabled(el);
		};

		
		this.isSource = function(el) {
			el = jsPlumb.CurrentLibrary.getElementObject(el);
			return _sourcesEnabled[_getId(el)] != null;
		};

		
		this.isSourceEnabled = function(el) {
			el = jsPlumb.CurrentLibrary.getElementObject(el);
			return _sourcesEnabled[_getId(el)] === true;
		};

		
		this.setTargetEnabled = function(el, state) {
			return _setEnabled("target", el, state);
		};

			
		this.toggleTargetEnabled = function(el) {
			_setEnabled("target", el, null, true);	
			return _currentInstance.isTargetEnabled(el);
		};

		
		this.isTarget = function(el) {
			el = jsPlumb.CurrentLibrary.getElementObject(el);
			return _targetsEnabled[_getId(el)] != null;
		};

		
		this.isTargetEnabled = function(el) {
			el = jsPlumb.CurrentLibrary.getElementObject(el);
			return _targetsEnabled[_getId(el)] === true;
		};
				
		this.ready = function(fn) {
			_currentInstance.bind("ready", fn);
		};

		// repaint some element's endpoints and connections
		this.repaint = function(el, ui, timestamp) {
			// support both lists...
			if (typeof el == 'object' && el.length)
				for ( var i = 0, ii = el.length; i < ii; i++) {			
					_draw(_gel(el[i]), ui, timestamp);
				}
			else // ...and single strings.				
				_draw(_gel(el), ui, timestamp);
				
			return _currentInstance;
		};

		// repaint every endpoint and connection.
		this.repaintEverything = function() {	
			var timestamp = null;// _timestamp();			
			for ( var elId in endpointsByElement) {
				_draw(_gel(elId), null, timestamp);				
			}
			return _currentInstance;
		};

		
		this.removeAllEndpoints = function(el, recurse) {
            var _one = function(_el) {                
                var elId = jsPlumbUtil.isString(_el) ? _el : _getId(_gel(_el)),
                    ebe = endpointsByElement[elId];
                if (ebe) {
                    for ( var i = 0, ii = ebe.length; i < ii; i++) 
                        _currentInstance.deleteEndpoint(ebe[i]);
                }
                delete endpointsByElement[elId];
                
                if (recurse) {
                    var del = jsPlumb.CurrentLibrary.getDOMElement(_gel(_el));
                    if (del && del.nodeType != 3 && del.nodeType != 8 ) {
                        for (var i = 0, ii = del.childNodes.length; i < ii; i++) {
                            _one(del.childNodes[i]);
                        }
                    }
                }
                
            };
            _one(el);
			return _currentInstance;
		};
                    
        this.remove = function(el) {
            var _el = _gel(el);
            var id = jsPlumbUtil.isString(el) ? el : _getId(_el);
            _currentInstance.doWhileSuspended(function() {
            	_currentInstance.removeAllEndpoints(id, true);
            	_currentInstance.dragManager.elementRemoved(id);
            });
            jsPlumb.CurrentLibrary.removeElement(_el);
        };

		var _registeredListeners = {},
			_unbindRegisteredListeners = function() {
				for (var i in _registeredListeners) {
					for (var j = 0, jj = _registeredListeners[i].length; j < jj; j++) {
						var info = _registeredListeners[i][j];
						jsPlumb.CurrentLibrary.unbind(info.el, info.event, info.listener);
					}
				}
				_registeredListeners = {};
			};

        // internal register listener method.  gives us a hook to clean things up
        // with if the user calls jsPlumb.reset.
        this.registerListener = function(el, type, listener) {
            jsPlumb.CurrentLibrary.bind(el, type, listener);
            _addToList(_registeredListeners, type, {el:el, event:type, listener:listener});
        };

        this.unregisterListener = function(el, type, listener) {
        	jsPlumb.CurrentLibrary.unbind(el, type, listener);
        	_removeWithFunction(_registeredListeners, function(rl) {
        		return rl.type == type && rl.listener == listener;
        	});
        };

		
		this.reset = function() {			
			_currentInstance.deleteEveryEndpoint();
			_currentInstance.unbind();
			_targetEndpointDefinitions = {};
			_targetEndpoints = {};
			_targetEndpointsUnique = {};
			_targetMaxConnections = {};
			_sourceEndpointDefinitions = {};
			_sourceEndpoints = {};
			_sourceEndpointsUnique = {};
			_sourceMaxConnections = {};
			_unbindRegisteredListeners();
			_currentInstance.anchorManager.reset();
			if (!jsPlumbAdapter.headless)
				_currentInstance.dragManager.reset();
		};
		

		this.setDefaultScope = function(scope) {
			DEFAULT_SCOPE = scope;
			return _currentInstance;
		};

		// sets whether or not some element should be currently draggable.
		this.setDraggable = _setDraggable;

		// sets the id of some element, changing whatever we need to to keep track.
		this.setId = function(el, newId, doNotSetAttribute) {
		
			var id = el.constructor == String ? el : _currentInstance.getId(el),
				sConns = _currentInstance.getConnections({source:id, scope:'*'}, true),
				tConns = _currentInstance.getConnections({target:id, scope:'*'}, true);

			newId = "" + newId;
							
			if (!doNotSetAttribute) {
				el = jsPlumb.CurrentLibrary.getElementObject(id);
				jsPlumb.CurrentLibrary.setAttribute(el, "id", newId);
			}
			
			el = jsPlumb.CurrentLibrary.getElementObject(newId);
			

			endpointsByElement[newId] = endpointsByElement[id] || [];
			for (var i = 0, ii = endpointsByElement[newId].length; i < ii; i++) {
				endpointsByElement[newId][i].setElementId(newId);
				endpointsByElement[newId][i].setReferenceElement(el);
			}
			delete endpointsByElement[id];

			_currentInstance.anchorManager.changeId(id, newId);
			if (!jsPlumbAdapter.headless)		
				_currentInstance.dragManager.changeId(id, newId);

			var _conns = function(list, epIdx, type) {
				for (var i = 0, ii = list.length; i < ii; i++) {
					list[i].endpoints[epIdx].setElementId(newId);
					list[i].endpoints[epIdx].setReferenceElement(el);
					list[i][type + "Id"] = newId;
					list[i][type] = el;
				}
			};
			_conns(sConns, 0, "source");
			_conns(tConns, 1, "target");
			
			_currentInstance.repaint(newId);
		};

		// called to notify us that an id WAS changed, and we should do our changes, but we
		// dont need to change the element's DOM attribute.
		this.setIdChanged = function(oldId, newId) {
			_currentInstance.setId(oldId, newId, true);
		};

		this.setDebugLog = function(debugLog) {
			log = debugLog;
		};

		
		var _suspendDrawing = false,
            _suspendedAt = null;

         // set whether or not drawing is suspended. you should use this when doing bulk painting,
         // like when first drawing a UI.
		this.setSuspendDrawing = function(val, repaintAfterwards) {
		    _suspendDrawing = val;
				if (val) _suspendedAt = new Date().getTime(); else _suspendedAt = null;
		    if (repaintAfterwards) _currentInstance.repaintEverything();
		};
        	
        // returns whether or not drawing is currently suspended.		
		this.isSuspendDrawing = function() {
			return _suspendDrawing;
		};
            
        // return timestamp for when drawing was suspended.
        this.getSuspendedAt = function() { return _suspendedAt; };

        // suspends drawing, runs the given function, then re-enables drawing (and repaints,
        // unless you tell it not to)
        this.doWhileSuspended = function(fn, doNotRepaintAfterwards) {
			_currentInstance.setSuspendDrawing(true);
			try {
				fn();
			}
			catch (e) {
				_log("Function run while suspended failed", e);
			}
			_currentInstance.setSuspendDrawing(false, !doNotRepaintAfterwards);
        };
            
        this.updateOffset = _updateOffset;
        this.getOffset = function(elId) { return offsets[elId]; };
        this.getSize = function(elId) { return sizes[elId]; };            
        this.getCachedData = _getCachedData;
        this.timestamp = _timestamp;
		
		/*
		 * Property: SVG
		 * Constant for use with the setRenderMode method
		 */
		 /*
		  * Property: VML
		  * Constant for use with the setRenderMode method
		  */
		/*
		 * Property: CANVAS
		 * Constant for use with the setRenderMode method
		 */
		this.SVG = "svg";
		
		this.CANVAS = "canvas";
		
		this.VML = "vml";
		
		/*
		 * Function: setRenderMode
		 * Sets render mode: jsPlumb.SVG or jsPlumb.VML.  jsPlumb will fall back to VML if it determines that
		 * what you asked for is not supported (and that VML is).  If you asked for VML but the browser does
		 * not support it, jsPlumb uses SVG.
		 *
		 * Parameters:
		 * mode	-	a string representing the mode. Use one of the jsPlumb render mode constants as discussed above.
		 * 
		 * Returns:
		 * The render mode that jsPlumb set, which of course may be different from that requested.
		 */
		this.setRenderMode = function(mode) {			
			renderMode = jsPlumbAdapter.setRenderMode(mode);
			return renderMode;
		};
		
		/*
		 * Function: getRenderMode
		 *
		 * Returns:
		 * The current render mode.
		 */
		this.getRenderMode = function() { return renderMode; };

		
		this.show = function(el, changeEndpoints) {
			_setVisible(el, "block", changeEndpoints);
			return _currentInstance;
		};

		/*
		 * Function: sizeCanvas 
		 * Helper to size a canvas. You would typically use
		 * this when writing your own Connector or Endpoint implementation.
		 * 
		 * Parameters: 
		 * 	x - [int] x position for the Canvas origin 
		 * 	y - [int] y position for the Canvas origin 
		 * 	w - [int] width of the canvas 
		 * 	h - [int] height of the canvas
		 *  
		 * Returns: 
		 * 	The current jsPlumb instance
		 */
		this.sizeCanvas = function(canvas, x, y, w, h) {
			if (canvas) {
				canvas.style.height = h + "px";
				canvas.height = h;
				canvas.style.width = w + "px";
				canvas.width = w;
				canvas.style.left = x + "px";
				canvas.style.top = y + "px";
			}
			return _currentInstance;
		};

		/**
		 * gets some test hooks. nothing writable.
		 */
		this.getTestHarness = function() {
			return {
				endpointsByElement : endpointsByElement,  
				endpointCount : function(elId) {
					var e = endpointsByElement[elId];
					return e ? e.length : 0;
				},
				connectionCount : function(scope) {
					scope = scope || DEFAULT_SCOPE;
					var c = connectionsByScope[scope];
					return c ? c.length : 0;
				},
				//findIndex : _findIndex,
				getId : _getId,
				makeAnchor:self.makeAnchor,
				makeDynamicAnchor:self.makeDynamicAnchor
			};
		};
		
		
		// TODO: update this method to return the current state.
		this.toggleVisible = _toggleVisible;
		this.toggleDraggable = _toggleDraggable;		

		/*
		 * Helper method to wrap an existing function with one of
		 * your own. This is used by the various implementations to wrap event
		 * callbacks for drag/drop etc; it allows jsPlumb to be transparent in
		 * its handling of these things. If a user supplies their own event
		 * callback, for anything, it will always be called. 
		 */
		this.wrap = _wrap;			
		this.addListener = this.bind;
		
        /*
            helper method to take an xy location and adjust it for the parent's offset and scroll.
        */
		this.adjustForParentOffsetAndScroll = function(xy, el) {

			var offsetParent = null, result = xy;
			if (el.tagName.toLowerCase() === "svg" && el.parentNode) {
				offsetParent = el.parentNode;
			}
			else if (el.offsetParent) {
				offsetParent = el.offsetParent;					
			}
			if (offsetParent != null) {
				var po = offsetParent.tagName.toLowerCase() === "body" ? {left:0,top:0} : _getOffset(offsetParent, _currentInstance),
					so = offsetParent.tagName.toLowerCase() === "body" ? {left:0,top:0} : {left:offsetParent.scrollLeft, top:offsetParent.scrollTop};					


				// i thought it might be cool to do this:
				//	lastReturnValue[0] = lastReturnValue[0] - offsetParent.offsetLeft + offsetParent.scrollLeft;
				//	lastReturnValue[1] = lastReturnValue[1] - offsetParent.offsetTop + offsetParent.scrollTop;					
				// but i think it ignores margins.  my reasoning was that it's quicker to not hand off to some underlying					
				// library.
				
				result[0] = xy[0] - po.left + so.left;
				result[1] = xy[1] - po.top + so.top;
			}
		
			return result;
			
		};

		if (!jsPlumbAdapter.headless) {
			_currentInstance.dragManager = jsPlumbAdapter.getDragManager(_currentInstance);
			_currentInstance.recalculateOffsets = _currentInstance.dragManager.updateOffsets;
	    }
				    
    };

// --------------------- static instance + AMD registration -------------------------------------------	
	
// create static instance and assign to window if window exists.	
	var jsPlumb = new jsPlumbInstance();
	if (typeof window != 'undefined') window.jsPlumb = jsPlumb;
// add 'getInstance' method to static instance
	jsPlumb.getInstance = function(_defaults) {
		var j = new jsPlumbInstance(_defaults);
		j.init();
		return j;
	};
// maybe register static instance as an AMD module, and getInstance method too.
	if ( typeof define === "function") {
		define( "jsplumb", [], function () { return jsPlumb; } );
		define( "jsplumbinstance", [], function () { return jsPlumb.getInstance(); } );
	}
 // CommonJS 
	if (typeof exports !== 'undefined') {
      exports.jsPlumb = jsPlumb;
  	}
	
	
// --------------------- end static instance + AMD registration -------------------------------------------		
	
})();
