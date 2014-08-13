/*
 * jsPlumb
 * 
 * Title:jsPlumb 1.6.4
 * 
 * Provides a way to visually connect elements on an HTML page, using SVG or VML.  
 * 
 * This file contains the core code.
 *
 * Copyright (c) 2010 - 2014 Simon Porritt (simon@jsplumbtoolkit.com)
 * 
 * http://jsplumbtoolkit.com
 * http://github.com/sporritt/jsplumb
 * 
 * Dual licensed under the MIT and GPL2 licenses.
 */
;(function() {
	
	"use strict";
			
    var _ju = jsPlumbUtil,
    	_getOffset = function(el, _instance, relativeToRoot) {
            return jsPlumbAdapter.getOffset(el, _instance, relativeToRoot);
        },
		
		/**
		 * creates a timestamp, using milliseconds since 1970, but as a string.
		 */
		_timestamp = function() { return "" + (new Date()).getTime(); },

		// helper method to update the hover style whenever it, or paintStyle, changes.
		// we use paintStyle as the foundation and merge hoverPaintStyle over the
		// top.
		_updateHoverStyle = function(component) {
			if (component._jsPlumb.paintStyle && component._jsPlumb.hoverPaintStyle) {
				var mergedHoverStyle = {};
				jsPlumb.extend(mergedHoverStyle, component._jsPlumb.paintStyle);
				jsPlumb.extend(mergedHoverStyle, component._jsPlumb.hoverPaintStyle);
				delete component._jsPlumb.hoverPaintStyle;
				// we want the fillStyle of paintStyle to override a gradient, if possible.
				if (mergedHoverStyle.gradient && component._jsPlumb.paintStyle.fillStyle)
					delete mergedHoverStyle.gradient;
				component._jsPlumb.hoverPaintStyle = mergedHoverStyle;
			}
		},		
		events = [ "click", "dblclick", "mouseenter", "mouseout", "mousemove", "mousedown", "mouseup", "contextmenu" ],
		eventFilters = { "mouseout":"mouseleave", "mouseexit":"mouseleave" },
		_updateAttachedElements = function(component, state, timestamp, sourceElement) {
			var affectedElements = component.getAttachedElements();
			if (affectedElements) {
				for (var i = 0, j = affectedElements.length; i < j; i++) {
					if (!sourceElement || sourceElement != affectedElements[i])
						affectedElements[i].setHover(state, true, timestamp);			// tell the attached elements not to inform their own attached elements.
				}
			}
		},
		_splitType = function(t) { return t == null ? null : t.split(" "); },		
		_applyTypes = function(component, params, doNotRepaint) {
			if (component.getDefaultType) {
				var td = component.getTypeDescriptor();
					
				var o = _ju.merge({}, component.getDefaultType());
				for (var i = 0, j = component._jsPlumb.types.length; i < j; i++)
					o = _ju.merge(o, component._jsPlumb.instance.getType(component._jsPlumb.types[i], td), [ "cssClass" ]);
					
				if (params) {
					o = _ju.populate(o, params);
				}
			
				component.applyType(o, doNotRepaint);					
				if (!doNotRepaint) component.repaint();
			}
		},		

// ------------------------------ BEGIN jsPlumbUIComponent --------------------------------------------

		jsPlumbUIComponent = window.jsPlumbUIComponent = function(params) {

			jsPlumbUtil.EventGenerator.apply(this, arguments);

			var self = this, 
				a = arguments, 				 				
				idPrefix = self.idPrefix,
				id = idPrefix + (new Date()).getTime();

			this._jsPlumb = { 
				instance: params._jsPlumb,
				parameters:params.parameters || {},
				paintStyle:null,
				hoverPaintStyle:null,
				paintStyleInUse:null,
				hover:false,
				beforeDetach:params.beforeDetach,
				beforeDrop:params.beforeDrop,
				overlayPlacements : [],
				hoverClass: params.hoverClass || params._jsPlumb.Defaults.HoverClass,
				types:[]
			};

			this.getId = function() { return id; };	
			
			// all components can generate events
			
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
				var o = {};//new Object();
				this.constructor.apply(o, a);
				return o;
			}.bind(this);				
						
			// user can supply a beforeDetach callback, which will be executed before a detach
			// is performed; returning false prevents the detach.			
			this.isDetachAllowed = function(connection) {
				var r = true;
				if (this._jsPlumb.beforeDetach) {
					try { 
						r = this._jsPlumb.beforeDetach(connection); 
					}
					catch (e) { _ju.log("jsPlumb: beforeDetach callback failed", e); }
				}
				return r;
			};
			
			// user can supply a beforeDrop callback, which will be executed before a dropped
			// connection is confirmed. user can return false to reject connection.			
			this.isDropAllowed = function(sourceId, targetId, scope, connection, dropEndpoint, source, target) {
					var r = this._jsPlumb.instance.checkCondition("beforeDrop", { 
						sourceId:sourceId, 
						targetId:targetId, 
						scope:scope,
						connection:connection,
						dropEndpoint:dropEndpoint,
						source:source, target:target
					});
					if (this._jsPlumb.beforeDrop) {
						try { 
							r = this._jsPlumb.beforeDrop({ 
								sourceId:sourceId, 
								targetId:targetId, 
								scope:scope, 
								connection:connection,
								dropEndpoint:dropEndpoint,
								source:source, target:target
							}); 
						}
						catch (e) { _ju.log("jsPlumb: beforeDrop callback failed", e); }
					}
					return r;
				};													

		    var boundListeners = [],
		    	bindAListener = function(obj, type, fn) {
			    	boundListeners.push([obj, type, fn]);
			    	obj.bind(type, fn);
			    },
		    	domListeners = [],
            	bindOne = function(o, c, evt, override) {
					var filteredEvent = eventFilters[evt] || evt,
						fn = function(ee) {
							if (override && override(ee) === false) return;
							c.fire(filteredEvent, c, ee);
						};
					domListeners.push([o, evt, fn, c]);
					c._jsPlumb.instance.on(o, evt, fn);
				},
				unbindOne = function(o, evt, fn, c) {
					var filteredEvent = eventFilters[evt] || evt;
					c._jsPlumb.instance.off(o, evt, fn);
				};

			// sets the component associated with listener events. for instance, an overlay delegates
			// its events back to a connector. but if the connector is swapped on the underlying connection,
			// then this component must be changed. This is called by setConnector in the Connection class.
			this.setListenerComponent = function(c) {
				for (var i = 0; i < domListeners.length; i++)
					domListeners[i][3] = c;
			};

            this.bindListeners = function(obj, _self, _hoverFunction) {
                bindAListener(obj, "click", function(ep, e) { _self.fire("click", _self, e); });             
             	bindAListener(obj, "dblclick", function(ep, e) { _self.fire("dblclick", _self, e); });
                bindAListener(obj, "contextmenu", function(ep, e) { _self.fire("contextmenu", _self, e); });
                bindAListener(obj, "mouseleave", function(ep, e) {
                    if (_self.isHover()) {
                        _hoverFunction(false);
                        _self.fire("mouseleave", _self, e);
                    }
                });
                bindAListener(obj, "mouseenter", function(ep, e) {
                    if (!_self.isHover()) {
                        _hoverFunction(true);
                        _self.fire("mouseenter", _self, e);
                    }
                });
                bindAListener(obj, "mousedown", function(ep, e) { _self.fire("mousedown", _self, e); });
                bindAListener(obj, "mouseup", function(ep, e) { _self.fire("mouseup", _self, e); });
            };

            this.unbindListeners = function() {
            	for (var i = 0; i < boundListeners.length; i++) {
            		var o = boundListeners[i];
            		o[0].unbind(o[1], o[2]);
            	}            	
            	boundListeners = null;
            };            
		    
		    this.attachListeners = function(o, c, overrides) {
				overrides = overrides || {};
				for (var i = 0, j = events.length; i < j; i++) {
					bindOne(o, c, events[i], overrides[events[i]]); 			
				}
			};	
			this.detachListeners = function() {
				for (var i = 0; i < domListeners.length; i++) {
					unbindOne(domListeners[i][0], domListeners[i][1], domListeners[i][2], domListeners[i][3]);
				}
				domListeners = null;
			};	   		    
		    
		    this.reattachListenersForElement = function(o) {
			    if (arguments.length > 1) {
		    		for (var i = 0, j = events.length; i < j; i++)
		    			unbindOne(o, events[i]);
			    	for (i = 1, j = arguments.length; i < j; i++)
		    			this.attachListeners(o, arguments[i]);
		    	}
		    };		    	    			                      
		};

		var _removeTypeCssHelper = function(component, typeIndex) {
			var typeId = component._jsPlumb.types[typeIndex],
				type = component._jsPlumb.instance.getType(typeId, component.getTypeDescriptor());

			if (type != null) {

				if (type.cssClass && component.canvas)
					component._jsPlumb.instance.removeClass(component.canvas, type.cssClass);
			}
		};

		jsPlumbUtil.extend(jsPlumbUIComponent, jsPlumbUtil.EventGenerator, {
			
			getParameter : function(name) { 
				return this._jsPlumb.parameters[name]; 
			},
			
			setParameter : function(name, value) { 
				this._jsPlumb.parameters[name] = value; 
			},
			
			getParameters : function() { 
				return this._jsPlumb.parameters; 
			},			
			
			setParameters : function(p) { 
				this._jsPlumb.parameters = p; 
			},			
			
			addClass : function(clazz) {
			    jsPlumbAdapter.addClass(this.canvas, clazz);
			},
						
			removeClass : function(clazz) {
			    jsPlumbAdapter.removeClass(this.canvas, clazz);
			},
			
			setType : function(typeId, params, doNotRepaint) {	
				this.clearTypes();			
				this._jsPlumb.types = _splitType(typeId) || [];
				_applyTypes(this, params, doNotRepaint);									
			},
			
			getType : function() {
				return this._jsPlumb.types;
			},
			
			reapplyTypes : function(params, doNotRepaint) {
				_applyTypes(this, params, doNotRepaint);
			},
			
			hasType : function(typeId) {
				return jsPlumbUtil.indexOf(this._jsPlumb.types, typeId) != -1;
			},
			
			addType : function(typeId, params, doNotRepaint) {
				var t = _splitType(typeId), _cont = false;
				if (t != null) {
					for (var i = 0, j = t.length; i < j; i++) {
						if (!this.hasType(t[i])) {
							this._jsPlumb.types.push(t[i]);
							_cont = true;						
						}
					}
					if (_cont) _applyTypes(this, params, doNotRepaint);
				}
			},
			
			removeType : function(typeId, doNotRepaint) {
				var t = _splitType(typeId), _cont = false, _one = function(tt) {
						var idx = _ju.indexOf(this._jsPlumb.types, tt);
						if (idx != -1) {
							// remove css class if necessary
							_removeTypeCssHelper(this, idx);
							this._jsPlumb.types.splice(idx, 1);
							return true;
						}
						return false;
					}.bind(this);
				
				if (t != null) {
					for (var i = 0,j = t.length; i < j; i++) {
						_cont = _one(t[i]) || _cont;
					}
					if (_cont) _applyTypes(this, null, doNotRepaint);
				}
			},
			clearTypes : function(doNotRepaint) {
				var i = this._jsPlumb.types.length;
				for (var j = 0; j < i; j++) {
					_removeTypeCssHelper(this, 0);
					this._jsPlumb.types.splice(0, 1);
				}
				_applyTypes(this, {}, doNotRepaint);
			},
			
			toggleType : function(typeId, params, doNotRepaint) {
				var t = _splitType(typeId);
				if (t != null) {
					for (var i = 0, j = t.length; i < j; i++) {
						var idx = jsPlumbUtil.indexOf(this._jsPlumb.types, t[i]);
						if (idx != -1) {
							_removeTypeCssHelper(this, idx);
							this._jsPlumb.types.splice(idx, 1);
						}
						else
							this._jsPlumb.types.push(t[i]);
					}
						
					_applyTypes(this, params, doNotRepaint);
				}
			},
			applyType : function(t, doNotRepaint) {
				this.setPaintStyle(t.paintStyle, doNotRepaint);				
				this.setHoverPaintStyle(t.hoverPaintStyle, doNotRepaint);
				if (t.parameters){
					for (var i in t.parameters)
						this.setParameter(i, t.parameters[i]);
				}
			},
			setPaintStyle : function(style, doNotRepaint) {
//		    	this._jsPlumb.paintStyle = jsPlumb.extend({}, style);
// TODO figure out if we want components to clone paintStyle so as not to share it.
				this._jsPlumb.paintStyle = style;
		    	this._jsPlumb.paintStyleInUse = this._jsPlumb.paintStyle;
		    	_updateHoverStyle(this);
		    	if (!doNotRepaint) this.repaint();
		    },
		    getPaintStyle : function() {
		    	return this._jsPlumb.paintStyle;
		    },
		    setHoverPaintStyle : function(style, doNotRepaint) {		    	
		    	//this._jsPlumb.hoverPaintStyle = jsPlumb.extend({}, style);
// TODO figure out if we want components to clone paintStyle so as not to share it.		    	
		    	this._jsPlumb.hoverPaintStyle = style;
		    	_updateHoverStyle(this);
		    	if (!doNotRepaint) this.repaint();
		    },
		    getHoverPaintStyle : function() {
		    	return this._jsPlumb.hoverPaintStyle;
		    },
			cleanup:function() {
				this.unbindListeners();
				this.detachListeners();
			},
			destroy:function() {
				this.cleanupListeners();
				this.clone = null;
				this._jsPlumb = null;
			},
			
			isHover : function() { return this._jsPlumb.hover; },
			
			setHover : function(hover, ignoreAttachedElements, timestamp) {
				// while dragging, we ignore these events.  this keeps the UI from flashing and
		    	// swishing and whatevering.
				if (this._jsPlumb && !this._jsPlumb.instance.currentlyDragging && !this._jsPlumb.instance.isHoverSuspended()) {
		    
			    	this._jsPlumb.hover = hover;
                        
                    if (this.canvas != null) {
                        if (this._jsPlumb.instance.hoverClass != null) {
                        	var method = hover ? "addClass" : "removeClass";
							this._jsPlumb.instance[method](this.canvas, this._jsPlumb.instance.hoverClass);
                        }
                        if (this._jsPlumb.hoverClass != null) {
							this._jsPlumb.instance[method](this.canvas, this._jsPlumb.hoverClass);
                        }
                    }
		   		 	if (this._jsPlumb.hoverPaintStyle != null) {
						this._jsPlumb.paintStyleInUse = hover ? this._jsPlumb.hoverPaintStyle : this._jsPlumb.paintStyle;
						if (!this._jsPlumb.instance.isSuspendDrawing()) {
							timestamp = timestamp || _timestamp();
							this.repaint({timestamp:timestamp, recalc:false});
						}
					}
					// get the list of other affected elements, if supported by this component.
					// for a connection, its the endpoints.  for an endpoint, its the connections! surprise.
					if (this.getAttachedElements && !ignoreAttachedElements)
						_updateAttachedElements(this, hover, _timestamp(), this);
				}
		    }
		});

// ------------------------------ END jsPlumbUIComponent --------------------------------------------

// ------------------------------ BEGIN OverlayCapablejsPlumbUIComponent --------------------------------------------

		var _internalLabelOverlayId = "__label",
			// helper to get the index of some overlay
			_getOverlayIndex = function(component, id) {
				var idx = -1;
				for (var i = 0, j = component._jsPlumb.overlays.length; i < j; i++) {
					if (id === component._jsPlumb.overlays[i].id) {
						idx = i;
						break;
					}
				}
				return idx;
			},
			// this is a shortcut helper method to let people add a label as
			// overlay.
			_makeLabelOverlay = function(component, params) {

				var _params = {
					cssClass:params.cssClass,
					labelStyle : component.labelStyle,
					id:_internalLabelOverlayId,
					component:component,
					_jsPlumb:component._jsPlumb.instance  // TODO not necessary, since the instance can be accessed through the component.
				},
				mergedParams = jsPlumb.extend(_params, params);

				return new jsPlumb.Overlays[component._jsPlumb.instance.getRenderMode()].Label( mergedParams );
			},
			_processOverlay = function(component, o) {
				var _newOverlay = null;
				if (_ju.isArray(o)) {	// this is for the shorthand ["Arrow", { width:50 }] syntax
					// there's also a three arg version:
					// ["Arrow", { width:50 }, {location:0.7}] 
					// which merges the 3rd arg into the 2nd.
					var type = o[0], 
						// make a copy of the object so as not to mess up anyone else's reference...
						p = jsPlumb.extend({component:component, _jsPlumb:component._jsPlumb.instance}, o[1]);
					if (o.length == 3) jsPlumb.extend(p, o[2]);
					_newOverlay = new jsPlumb.Overlays[component._jsPlumb.instance.getRenderMode()][type](p);
				} else if (o.constructor == String) {
					_newOverlay = new jsPlumb.Overlays[component._jsPlumb.instance.getRenderMode()][o]({component:component, _jsPlumb:component._jsPlumb.instance});
				} else {
					_newOverlay = o;
				}										
					
				component._jsPlumb.overlays.push(_newOverlay);
			},
			_calculateOverlaysToAdd = function(component, params) {
				var defaultKeys = component.defaultOverlayKeys || [], o = params.overlays,
					checkKey = function(k) {
						return component._jsPlumb.instance.Defaults[k] || jsPlumb.Defaults[k] || [];
					};
				
				if (!o) o = [];

				for (var i = 0, j = defaultKeys.length; i < j; i++)
					o.unshift.apply(o, checkKey(defaultKeys[i]));
				
				return o;
			},		
			OverlayCapableJsPlumbUIComponent = window.OverlayCapableJsPlumbUIComponent = function(params) {

				jsPlumbUIComponent.apply(this, arguments);
				this._jsPlumb.overlays = [];			

				var _overlays = _calculateOverlaysToAdd(this, params);
				if (_overlays) {
					for (var i = 0, j = _overlays.length; i < j; i++) {
						_processOverlay(this, _overlays[i]);
					}
				}
				
				if (params.label) {
					var loc = params.labelLocation || this.defaultLabelLocation || 0.5,
						labelStyle = params.labelStyle || this._jsPlumb.instance.Defaults.LabelStyle;

					this._jsPlumb.overlays.push(_makeLabelOverlay(this, {
						label:params.label,
						location:loc,
						labelStyle:labelStyle
					}));
				}		

				this.setListenerComponent = function(c) {
					if (this._jsPlumb) {
						for (var i = 0; i < this._jsPlumb.overlays.length; i++)
							this._jsPlumb.overlays[i].setListenerComponent(c);
					}
				};
			};

		jsPlumbUtil.extend(OverlayCapableJsPlumbUIComponent, jsPlumbUIComponent, {
			applyType : function(t, doNotRepaint) {			
				this.removeAllOverlays(doNotRepaint);
				if (t.overlays) {
					for (var i = 0, j = t.overlays.length; i < j; i++)
						this.addOverlay(t.overlays[i], true);
				}
			},
			setHover : function(hover, ignoreAttachedElements, timestamp) {            
				if (this._jsPlumb && !this._jsPlumb.instance.isConnectionBeingDragged()) {
	                for (var i = 0, j = this._jsPlumb.overlays.length; i < j; i++) {
						this._jsPlumb.overlays[i][hover ? "addClass":"removeClass"](this._jsPlumb.instance.hoverClass);
					}
				}
            },
            addOverlay : function(overlay, doNotRepaint) { 
				_processOverlay(this, overlay); 
				if (!doNotRepaint) this.repaint();
			},
			getOverlay : function(id) {
				var idx = _getOverlayIndex(this, id);
				return idx >= 0 ? this._jsPlumb.overlays[idx] : null;
			},			
			getOverlays : function() {
				return this._jsPlumb.overlays;
			},			
			hideOverlay : function(id) {
				var o = this.getOverlay(id);
				if (o) o.hide();
			},
			hideOverlays : function() {
				for (var i = 0, j = this._jsPlumb.overlays.length; i < j; i++)
					this._jsPlumb.overlays[i].hide();
			},
			showOverlay : function(id) {
				var o = this.getOverlay(id);
				if (o) o.show();
			},
			showOverlays : function() {
				for (var i = 0, j = this._jsPlumb.overlays.length; i < j; i++)
					this._jsPlumb.overlays[i].show();
			},
			removeAllOverlays : function(doNotRepaint) {
				for (var i = 0, j = this._jsPlumb.overlays.length; i < j; i++) {
					if (this._jsPlumb.overlays[i].cleanup) this._jsPlumb.overlays[i].cleanup();
				}

				this._jsPlumb.overlays.splice(0, this._jsPlumb.overlays.length);
				this._jsPlumb.overlayPositions = null;
				if (!doNotRepaint)
					this.repaint();
			},
			removeOverlay : function(overlayId) {
				var idx = _getOverlayIndex(this, overlayId);
				if (idx != -1) {
					var o = this._jsPlumb.overlays[idx];
					if (o.cleanup) o.cleanup();
					this._jsPlumb.overlays.splice(idx, 1);
					if (this._jsPlumb.overlayPositions)  
						delete this._jsPlumb.overlayPositions[overlayId];
				}
			},
			removeOverlays : function() {
				for (var i = 0, j = arguments.length; i < j; i++)
					this.removeOverlay(arguments[i]);
			},
			moveParent:function(newParent) {
				if (this.bgCanvas) {
				    this.bgCanvas.parentNode.removeChild(this.bgCanvas);
				    newParent.appendChild(this.bgCanvas);
				}
				
				this.canvas.parentNode.removeChild(this.canvas);
				newParent.appendChild(this.canvas);

				for (var i = 0; i < this._jsPlumb.overlays.length; i++) {
				    if (this._jsPlumb.overlays[i].isAppendedAtTopLevel) {
				        this._jsPlumb.overlays[i].canvas.parentNode.removeChild(this._jsPlumb.overlays[i].canvas);
				        newParent.appendChild(this._jsPlumb.overlays[i].canvas);  
				    }
				}
			},
			getLabel : function() {
				var lo = this.getOverlay(_internalLabelOverlayId);
				return lo != null ? lo.getLabel() : null;
			},		
			getLabelOverlay : function() {
				return this.getOverlay(_internalLabelOverlayId);
			},
			setLabel : function(l) {
				var lo = this.getOverlay(_internalLabelOverlayId);
				if (!lo) {
					var params = l.constructor == String || l.constructor == Function ? { label:l } : l;
					lo = _makeLabelOverlay(this, params);	
					this._jsPlumb.overlays.push(lo);
				}
				else {
					if (l.constructor == String || l.constructor == Function) lo.setLabel(l);
					else {
						if (l.label) lo.setLabel(l.label);
						if (l.location) lo.setLocation(l.location);
					}
				}
				
				if (!this._jsPlumb.instance.isSuspendDrawing()) 
					this.repaint();
			},
			cleanup:function() {
				for (var i = 0; i < this._jsPlumb.overlays.length; i++) {
					this._jsPlumb.overlays[i].cleanup();
					this._jsPlumb.overlays[i].destroy();
				}
				this._jsPlumb.overlays.splice(0);
				this._jsPlumb.overlayPositions = null;
			},
			setVisible:function(v) {
				this[v ? "showOverlays" : "hideOverlays"]();
			},
			setAbsoluteOverlayPosition:function(overlay, xy) {
				this._jsPlumb.overlayPositions = this._jsPlumb.overlayPositions || {};
				this._jsPlumb.overlayPositions[overlay.id] = xy;
			},
			getAbsoluteOverlayPosition:function(overlay) {
				return this._jsPlumb.overlayPositions ? this._jsPlumb.overlayPositions[overlay.id] : null;
			}
		});		

// ------------------------------ END OverlayCapablejsPlumbUIComponent --------------------------------------------
		
		var _jsPlumbInstanceIndex = 0,
			getInstanceIndex = function() {
				var i = _jsPlumbInstanceIndex + 1;
				_jsPlumbInstanceIndex++;
				return i;
			};

		var jsPlumbInstance = window.jsPlumbInstance = function(_defaults) {
				
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
			this._connectionTypes = {};
			this._endpointTypes = {};

			jsPlumbUtil.EventGenerator.apply(this);

			var _currentInstance = this,
				_instanceIndex = getInstanceIndex(),
				_bb = _currentInstance.bind,
				_initialDefaults = {},
	            _zoom = 1,
	            _info = function(el) {
	            	var _el = _currentInstance.getDOMElement(el);	
	            	return { el:_el, id:(jsPlumbUtil.isString(el) && _el == null) ? el : _getId(_el) };
	            };
            
	        this.getInstanceIndex = function() { return _instanceIndex; };

        	this.setZoom = function(z, repaintEverything) {
        		if (!jsPlumbUtil.oldIE) {
	            	_zoom = z;
					_currentInstance.fire("zoom", _zoom);
	            	if (repaintEverything) _currentInstance.repaintEverything();
	            }
	            return !jsPlumbUtil.oldIE;

        	};
        	this.getZoom = function() { return _zoom; };
                        
			for (var i in this.Defaults)
				_initialDefaults[i] = this.Defaults[i];

			var _container;
			this.setContainer = function(c) {
				c = this.getDOMElement(c);
				this.select().each(function(conn) {
					conn.moveParent(c);
				});
				this.selectEndpoints().each(function(ep) {
					ep.moveParent(c);
				});
				_container = c;
			};
			this.getContainer = function() {
				return _container;
			};
			
			this.bind = function(event, fn) {		
				if ("ready" === event && initialized) fn();
				else _bb.apply(_currentInstance,[event, fn]);
			};

			_currentInstance.importDefaults = function(d) {
				for (var i in d) {
					_currentInstance.Defaults[i] = d[i];
				}
				if (d.Container)
					this.setContainer(d.Container);

				return _currentInstance;
			};		
			
			_currentInstance.restoreDefaults = function() {
				_currentInstance.Defaults = jsPlumb.extend({}, _initialDefaults);
				return _currentInstance;
			};
		
		    var log = null,
		        resizeTimer = null,
		        initialized = false,
		        // TODO remove from window scope       
		        connections = [],
		        // map of element id -> endpoint lists. an element can have an arbitrary
		        // number of endpoints on it, and not all of them have to be connected
		        // to anything.         
		        endpointsByElement = {},
		        endpointsByUUID = {},
		        offsets = {},
		        offsetTimestamps = {},
		        floatingConnections = {},
		        draggableStates = {},		
		        connectionBeingDragged = false,
		        sizes = [],
		        _suspendDrawing = false,
		        _suspendedAt = null,
		        DEFAULT_SCOPE = this.Defaults.Scope,
		        renderMode = null,  // will be set in init()		
		        _curIdStamp = 1,
		        _idstamp = function() { return "" + _curIdStamp++; },							
		
				//
				// appends an element to some other element, which is calculated as follows:
				// 
				// 1. if Container exists, use that element.
				// 2. if the 'parent' parameter exists, use that.
				// 3. otherwise just use the root element (for DOM usage, the document body).
				// 
				//
				_appendElement = function(el, parent) {
					if (_container)
						_container.appendChild(el);
					else if (!parent)
						_currentInstance.appendToRoot(el);
					else
						jsPlumb.getDOMElement(parent).appendChild(el);
				},		
				
				//
				// YUI, for some reason, put the result of a Y.all call into an object that contains
				// a '_nodes' array, instead of handing back an array-like object like the other
				// libraries do.
				//
				_convertYUICollection = function(c) {
					return c._nodes ? c._nodes : c;
				},                

			//
			// Draws an endpoint and its connections. this is the main entry point into drawing connections as well
			// as endpoints, since jsPlumb is endpoint-centric under the hood.
			// 
			// @param element element to draw (of type library specific element object)
			// @param ui UI object from current library's event system. optional.
			// @param timestamp timestamp for this paint cycle. used to speed things up a little by cutting down the amount of offset calculations we do.
			// @param clearEdits defaults to false; indicates that mouse edits for connectors should be cleared
			///
			_draw = function(element, ui, timestamp, clearEdits) {

				// TODO is it correct to filter by headless at this top level? how would a headless adapter ever repaint?
	            if (!jsPlumbAdapter.headless && !_suspendDrawing) {
				    var id = _getId(element),
				    	repaintEls = _currentInstance.dragManager.getElementsForDraggable(id);			    

				    if (timestamp == null) timestamp = _timestamp();

				    // update the offset of everything _before_ we try to draw anything.
				    var o = _updateOffset( { elId : id, offset : ui, recalc : false, timestamp : timestamp });

			        if (repaintEls) {
			    	    for (var i in repaintEls) {
			    	    	// TODO this seems to cause a lag, but we provide the offset, so in theory it 
			    	    	// should not.  is the timestamp failing?
				    		_updateOffset( { 
				    			elId : repaintEls[i].id, 
				    			offset : {
									left:o.o.left + repaintEls[i].offset.left,
					    			top:o.o.top + repaintEls[i].offset.top
					    		}, 
				    			recalc : false, 
				    			timestamp : timestamp 
				    		});
				    	}
				    }	
				    		          

				    _currentInstance.anchorManager.redraw(id, ui, timestamp, null, clearEdits);
				    
				    if (repaintEls) {
					    for (var j in repaintEls) {
							_currentInstance.anchorManager.redraw(repaintEls[j].id, ui, timestamp, repaintEls[j].offset, clearEdits, true);			    	
					    }
					}		
	            }
			},

			//
			// executes the given function against the given element if the first
			// argument is an object, or the list of elements, if the first argument
			// is a list. the function passed in takes (element, elementId) as
			// arguments.
			//
			_elementProxy = function(element, fn) {
				var retVal = null, el, id, del;
				if (_ju.isArray(element)) {
					retVal = [];
					for ( var i = 0, j = element.length; i < j; i++) {
						el = _currentInstance.getElementObject(element[i]);
						del = _currentInstance.getDOMElement(el);
						id = _currentInstance.getAttribute(del, "id");
						//retVal.push(fn(el, id)); // append return values to what we will return
						retVal.push(fn.apply(_currentInstance, [del, id])); // append return values to what we will return
					}
				} else {
					el = _currentInstance.getDOMElement(element);
					id = _currentInstance.getId(el);
					retVal = fn.apply(_currentInstance, [el, id]);
				}
				return retVal;
			},				

			//
			// gets an Endpoint by uuid.
			//
			_getEndpoint = function(uuid) { return endpointsByUUID[uuid]; },

		/**
		 * inits a draggable if it's not already initialised.
		 * TODO: somehow abstract this to the adapter, because the concept of "draggable" has no
		 * place on the server.
		 */
		_initDraggableIfNecessary = function(element, isDraggable, dragOptions) {
			// TODO move to DragManager?
			if (!jsPlumbAdapter.headless) {
				var _draggable = isDraggable == null ? false : isDraggable;
				if (_draggable) {
					if (jsPlumb.isDragSupported(element, _currentInstance) && !jsPlumb.isAlreadyDraggable(element, _currentInstance)) {
						var options = dragOptions || _currentInstance.Defaults.DragOptions;
						options = jsPlumb.extend( {}, options); // make a copy.
						var dragEvent = jsPlumb.dragEvents.drag,
							stopEvent = jsPlumb.dragEvents.stop,
							startEvent = jsPlumb.dragEvents.start,
							ancestorOffset = null,
							_del = _currentInstance.getDOMElement(element),
							_ancestor = _currentInstance.dragManager.getDragAncestor(_del),
							_noOffset = {left:0, top:0},
							_ancestorOffset = _noOffset,
							_started = false;
	
						options[startEvent] = _ju.wrap(options[startEvent], function() {
							_ancestorOffset = _ancestor != null ? jsPlumbAdapter.getOffset(_ancestor, _currentInstance) : _noOffset;								
							_currentInstance.setHoverSuspended(true);							
							_currentInstance.select({source:element}).addClass(_currentInstance.elementDraggingClass + " " + _currentInstance.sourceElementDraggingClass, true);
							_currentInstance.select({target:element}).addClass(_currentInstance.elementDraggingClass + " " + _currentInstance.targetElementDraggingClass, true);
							_currentInstance.setConnectionBeingDragged(true);
							if (options.canDrag) return dragOptions.canDrag();
						}, false);
	
						options[dragEvent] = _ju.wrap(options[dragEvent], function() {
							// TODO: here we could actually use getDragObject, and then compute it ourselves,
							// since every adapter does the same thing. but i'm not sure why YUI's getDragObject
							// differs from getUIPosition so much						
							var ui = _currentInstance.getUIPosition(arguments, _currentInstance.getZoom());
							// adjust by ancestor offset if there is one: this is for the case that a draggable
							// is contained inside some other element that is not the Container.
							ui.left += _ancestorOffset.left;
							ui.top += _ancestorOffset.top;	
							_draw(element, ui, null, true);
							if (_started) _currentInstance.addClass(element, "jsPlumb_dragged");							
							_started = true;
						});
						options[stopEvent] = _ju.wrap(options[stopEvent], function() {
							var ui = _currentInstance.getUIPosition(arguments, _currentInstance.getZoom(), true);
							_draw(element, ui);
							_started = false;
							_currentInstance.removeClass(element, "jsPlumb_dragged");
							_currentInstance.setHoverSuspended(false);							
							_currentInstance.select({source:element}).removeClass(_currentInstance.elementDraggingClass + " " + _currentInstance.sourceElementDraggingClass, true);
							_currentInstance.select({target:element}).removeClass(_currentInstance.elementDraggingClass + " " + _currentInstance.targetElementDraggingClass, true);
							_currentInstance.setConnectionBeingDragged(false);
							_currentInstance.dragManager.dragEnded(element);
						});
						var elId = _getId(element); // need ID
						draggableStates[elId] = true;  
						var draggable = draggableStates[elId];
						options.disabled = draggable == null ? false : !draggable;
						_currentInstance.initDraggable(element, options, false);
						_currentInstance.dragManager.register(element);
					}
				}
			}
		},
		
		/*
		* prepares a final params object that can be passed to _newConnection, taking into account defaults, events, etc.
		*/
		_prepareConnectionParams = function(params, referenceParams) {
			var _p = jsPlumb.extend( { }, params);
			if (referenceParams) jsPlumb.extend(_p, referenceParams);
			
			// hotwire endpoints passed as source or target to sourceEndpoint/targetEndpoint, respectively.
			if (_p.source) {
				if (_p.source.endpoint) 
					_p.sourceEndpoint = _p.source;
				else
					_p.source = _currentInstance.getDOMElement(_p.source);
			}
			if (_p.target) {
				if (_p.target.endpoint) 
					_p.targetEndpoint = _p.target;
				else
					_p.target = _currentInstance.getDOMElement(_p.target);
			}
			
			// test for endpoint uuids to connect
			if (params.uuids) {
				_p.sourceEndpoint = _getEndpoint(params.uuids[0]);
				_p.targetEndpoint = _getEndpoint(params.uuids[1]);
			}						

			// now ensure that if we do have Endpoints already, they're not full.
			// source:
			if (_p.sourceEndpoint && _p.sourceEndpoint.isFull()) {
				_ju.log(_currentInstance, "could not add connection; source endpoint is full");
				return;
			}

			// target:
			if (_p.targetEndpoint && _p.targetEndpoint.isFull()) {
				_ju.log(_currentInstance, "could not add connection; target endpoint is full");
				return;
			}
			
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

            var _mergeOverrides = function(def, values) {
            	var m = jsPlumb.extend({}, def);
            	for (var i in values) {
            		if (values[i]) m[i] = values[i];
            	}
            	return m;
            };

            var _addEndpoint = function(el, def, idx) {
            	return _currentInstance.addEndpoint(el, _mergeOverrides(tep.def, {
            		anchor:_p.anchors ? _p.anchors[idx] : _p.anchor,
            		endpoint:_p.endpoints ? _p.endpoints[idx] : _p.endpoint,
            		paintStyle:_p.endpointStyles ? _p.endpointStyles[idx] : _p.endpointStyle,
            		hoverPaintStyle:_p.endpointHoverStyles ? _p.endpointHoverStyles[idx] : _p.endpointHoverStyle
            	}));
            };
									
			// if there's a target specified (which of course there should be), and there is no
			// target endpoint specified, and 'newConnection' was not set to true, then we check to
			// see if a prior call to makeTarget has provided us with the specs for the target endpoint, and
			// we use those if so.  additionally, if the makeTarget call was specified with 'uniqueEndpoint' set
			// to true, then if that target endpoint has already been created, we re-use it.

			var tid, tep, existingUniqueEndpoint, newEndpoint;

			// TODO: this code can be refactored to be a little dry.
			if (_p.target && !_p.target.endpoint && !_p.targetEndpoint && !_p.newConnection) {
				tid = _getId(_p.target);
				tep = this.targetEndpointDefinitions[tid];

				if (tep) {
					
					// if target not enabled, return.
					if (!tep.enabled) return;

					// TODO this is dubious. i think it is there so that the endpoint can subsequently
					// be dragged (ie it kicks off the draggable registration). but it is dubious.
					tep.isTarget = true;

					// check for max connections??						
					newEndpoint = tep.endpoint != null && tep.endpoint._jsPlumb ? tep.endpoint : _addEndpoint(_p.target, tep.def, 1);
					if (tep.uniqueEndpoint) tep.endpoint = newEndpoint;
					 _p.targetEndpoint = newEndpoint;
					 // TODO test options to makeTarget to see if we should do this?
					 newEndpoint._doNotDeleteOnDetach = false; // reset.
					 newEndpoint._deleteOnDetach = true;					 
				}
			}

			// same thing, but for source.
			if (_p.source && !_p.source.endpoint && !_p.sourceEndpoint && !_p.newConnection) {
				tid = _getId(_p.source);
				tep = this.sourceEndpointDefinitions[tid];

				if (tep) {
					// if source not enabled, return.					
					if (!tep.enabled) return;
				
					newEndpoint = tep.endpoint != null && tep.endpoint._jsPlumb ? tep.endpoint : _addEndpoint(_p.source, tep.def, 0);
					if (tep.uniqueEndpoint) tep.endpoint = newEndpoint;
					 _p.sourceEndpoint = newEndpoint;
					 // TODO test options to makeSource to see if we should do this?
					 newEndpoint._doNotDeleteOnDetach = false; // reset.
					 newEndpoint._deleteOnDetach = true;
				}
			}
			
			return _p;
		}.bind(_currentInstance),
		
		_newConnection = function(params) {
			var connectionFunc = _currentInstance.Defaults.ConnectionType || _currentInstance.getDefaultConnectionType(),
			    endpointFunc = _currentInstance.Defaults.EndpointType || jsPlumb.Endpoint;			    			
			
			params._jsPlumb = _currentInstance;
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

            // if the connection is draggable, then maybe we need to tell the target endpoint to init the
            // dragging code. it won't run again if it already configured to be draggable.
            if (con.isDetachable()) {
            	con.endpoints[0].initDraggable();
            	con.endpoints[1].initDraggable();
            }

			return con;
		},
		
		//
		// adds the connection to the backing model, fires an event if necessary and then redraws
		//
		_finaliseConnection = function(jpc, params, originalEvent, doInformAnchorManager) {
            params = params || {};
			// add to list of connections (by scope).
            if (!jpc.suspendedEndpoint)
			    connections.push(jpc);

			// turn off isTemporarySource on the source endpoint (only viable on first draw)
			jpc.endpoints[0].isTemporarySource = false;
			
            // always inform the anchor manager
            // except that if jpc has a suspended endpoint it's not true to say the
            // connection is new; it has just (possibly) moved. the question is whether
            // to make that call here or in the anchor manager.  i think perhaps here.
            if (jpc.suspendedEndpoint == null || doInformAnchorManager)
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
			
				_currentInstance.fire("connection", eventArgs, originalEvent);
			}
		},
		
		_eventFireProxy = function(event, proxyEvent, obj) {
			obj.bind(event, function(originalObject, originalEvent) {
				_currentInstance.fire(proxyEvent, obj, originalEvent);
			});
		},
		
		
		/*
			factory method to prepare a new endpoint.  this should always be used instead of creating Endpoints
			manually, since this method attaches event listeners and an id.
		*/
		_newEndpoint = function(params) {
				var endpointFunc = _currentInstance.Defaults.EndpointType || jsPlumb.Endpoint;
				var _p = jsPlumb.extend({}, params);
				_p._jsPlumb = _currentInstance;
                _p.newConnection = _newConnection;
                _p.newEndpoint = _newEndpoint;                
                _p.endpointsByUUID = endpointsByUUID;             
                _p.endpointsByElement = endpointsByElement;  
                _p.finaliseConnection = _finaliseConnection;
                _p.fireDetachEvent = fireDetachEvent;
                _p.fireMoveEvent = fireMoveEvent;
                _p.floatingConnections = floatingConnections;
                _p.elementId = _getId(_p.source);                
				var ep = new endpointFunc(_p);			
				ep.id = "ep_" + _idstamp();
				_eventFireProxy("click", "endpointClick", ep);
				_eventFireProxy("dblclick", "endpointDblClick", ep);
				_eventFireProxy("contextmenu", "contextmenu", ep);
				if (!jsPlumbAdapter.headless)
					_currentInstance.dragManager.endpointAdded(_p.source);
			return ep;
		},
		
		/*
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
		
		_setDraggable = function(element, draggable) {
			return _elementProxy(element, function(el, id) {
				draggableStates[id] = draggable;
				if (this.isDragSupported(el)) {
					this.setElementDraggable(el, draggable);
				}
			});
		},
		/*
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
			var info = _info(el);
			_operation(info.id, function(jpc) {
				if (state && alsoChangeEndpoints) {		
					// this test is necessary because this functionality is new, and i wanted to maintain backwards compatibility.
					// this block will only set a connection to be visible if the other endpoint in the connection is also visible.
					var oidx = jpc.sourceId === info.id ? 1 : 0;
					if (jpc.endpoints[oidx].isVisible()) jpc.setVisible(true);
				}
				else  // the default behaviour for show, and what always happens for hide, is to just set the visibility without getting clever.
					jpc.setVisible(state);
			}, endpointFunc);
		},
		/*
		 * toggles the draggable state of the given element(s).
		 * el is either an id, or an element object, or a list of ids/element objects.
		 */
		_toggleDraggable = function(el) {
			return _elementProxy(el, function(el, elId) {
				var state = draggableStates[elId] == null ? false : draggableStates[elId];
				state = !state;
				draggableStates[elId] = state;
				this.setDraggable(el, state);
				return state;
			});
		},
		/**
		 * private method to do the business of toggling hiding/showing.
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
		_updateOffset = this.updateOffset = function(params) {
			var timestamp = params.timestamp, recalc = params.recalc, offset = params.offset, elId = params.elId, s;
			if (_suspendDrawing && !timestamp) timestamp = _suspendedAt;
			if (!recalc) {
				if (timestamp && timestamp === offsetTimestamps[elId]) {			
					return {o:params.offset || offsets[elId], s:sizes[elId]};
				}
			}			
			if (recalc || !offset) { // if forced repaint or no offset available, we recalculate.
				// get the current size and offset, and store them
				s = document.getElementById(elId);
				if (s != null) {						
					sizes[elId] = _currentInstance.getSize(s);
					offsets[elId] = _getOffset(s, _currentInstance);
					offsetTimestamps[elId] = timestamp;
				}
			} else {
				offsets[elId] = offset;
                if (sizes[elId] == null) {
                    s = document.getElementById(elId);
                    if (s != null) sizes[elId] = _currentInstance.getSize(s);
                }
                offsetTimestamps[elId] = timestamp;
            }
			
			if(offsets[elId] && !offsets[elId].right) {
				offsets[elId].right = offsets[elId].left + sizes[elId][0];
				offsets[elId].bottom = offsets[elId].top + sizes[elId][1];	
				offsets[elId].width = sizes[elId][0];
				offsets[elId].height = sizes[elId][1];	
				offsets[elId].centerx = offsets[elId].left + (offsets[elId].width / 2);
				offsets[elId].centery = offsets[elId].top + (offsets[elId].height / 2);				
			}
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
			if (jsPlumbUtil.isString(element)) return element;			
			if (element == null) return null;			
			var id = _currentInstance.getAttribute(element, "id");
			if (!id || id === "undefined") {
				// check if fixed uuid parameter is given
				if (arguments.length == 2 && arguments[1] !== undefined)
					id = uuid;
				else if (arguments.length == 1 || (arguments.length == 3 && !arguments[2]))
					id = "jsPlumb_" + _instanceIndex + "_" + _idstamp();
				
                if (!doNotCreateIfNotFound) _currentInstance.setAttribute(element, "id", id);
			}
			return id;
		};

		this.setConnectionBeingDragged = function(v) {
			connectionBeingDragged = v;
		};
		this.isConnectionBeingDragged = function() {
			return connectionBeingDragged;
		};
    
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
		this.hoverSourceClass = "_jsPlumb_source_hover";	
		this.hoverTargetClass = "_jsPlumb_target_hover";
		this.dragSelectClass = "_jsPlumb_drag_select";

		this.Anchors = {};		
		this.Connectors = {  "svg":{}, "vml":{} };				
		this.Endpoints = { "svg":{}, "vml":{} };
		this.Overlays = { "svg":{}, "vml":{}};		
		this.ConnectorRenderers = {};				
		this.SVG = "svg";
		this.VML = "vml";				

// --------------------------- jsPLumbInstance public API ---------------------------------------------------------
					
		
		this.addEndpoint = function(el, params, referenceParams) {
			referenceParams = referenceParams || {};
			var p = jsPlumb.extend({}, referenceParams);
			jsPlumb.extend(p, params);
			p.endpoint = p.endpoint || _currentInstance.Defaults.Endpoint;
			p.paintStyle = p.paintStyle || _currentInstance.Defaults.EndpointStyle;
            // YUI wrapper
			el = _convertYUICollection(el);							

			var results = [], 
				inputs = (_ju.isArray(el) || (el.length != null && !_ju.isString(el))) ? el : [ el ];
						
			for (var i = 0, j = inputs.length; i < j; i++) {
				var _el = _currentInstance.getDOMElement(inputs[i]), id = _getId(_el);
				p.source = _el;

				_ensureContainer(p.source);
                _updateOffset({ elId : id, timestamp:_suspendedAt });
				var e = _newEndpoint(p);
				if (p.parentAnchor) e.parentAnchor = p.parentAnchor;
				_ju.addToList(endpointsByElement, id, e);
				var myOffset = offsets[id], 
					myWH = sizes[id],
					anchorLoc = e.anchor.compute( { xy : [ myOffset.left, myOffset.top ], wh : myWH, element : e, timestamp:_suspendedAt }),
					endpointPaintParams = { anchorLoc : anchorLoc, timestamp:_suspendedAt };
				
				if (_suspendDrawing) endpointPaintParams.recalc = false;
				if (!_suspendDrawing) e.paint(endpointPaintParams);
				
				results.push(e);
				e._doNotDeleteOnDetach = true; // mark this as being added via addEndpoint.				
			}
			
			return results.length == 1 ? results[0] : results;
		};
		
		
		this.addEndpoints = function(el, endpoints, referenceParams) {
			var results = [];
			for ( var i = 0, j = endpoints.length; i < j; i++) {
				var e = _currentInstance.addEndpoint(el, endpoints[i], referenceParams);
				if (_ju.isArray(e))
					Array.prototype.push.apply(results, e);
				else results.push(e);
			}
			return results;
		};
		
		this.animate = function(el, properties, options) {
			options = options || {};
			var ele = this.getElementObject(el), 
				del = this.getDOMElement(el),
				id = _getId(del),
				stepFunction = jsPlumb.animEvents.step,
				completeFunction = jsPlumb.animEvents.complete;

			options[stepFunction] = _ju.wrap(options[stepFunction], function() {
				_currentInstance.repaint(id);
			});

			// onComplete repaints, just to make sure everything looks good at the end of the animation.
			options[completeFunction] = _ju.wrap(options[completeFunction], function() {
				_currentInstance.repaint(id);
			});

			_currentInstance.doAnimate(ele, properties, options);
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
					_ju.log(_currentInstance, "cannot check condition [" + conditionName + "]" + e); 
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
					_ju.log(_currentInstance, "cannot asynchronously check condition [" + conditionName + "]" + e); 
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
				_ensureContainer(_p.source);
				// create the connection.  it is not yet registered 
				jpc = _newConnection(_p);
				// now add it the model, fire an event, and redraw
				_finaliseConnection(jpc, _p);										
			}
			return jpc;
		};		
		
		var stTypes = [
			{ el:"source", elId:"sourceId", epDefs:"sourceEndpointDefinitions" },
			{ el:"target", elId:"targetId", epDefs:"targetEndpointDefinitions" }
		];
		
		var _set = function(c, el, idx, doNotRepaint) {
			var ep, _st = stTypes[idx], cId = c[_st.elId], cEl = c[_st.el], sid, sep,
				oldEndpoint = c.endpoints[idx];
			
			var evtParams = {
				index:idx,
				originalSourceId:idx === 0 ? cId : c.sourceId,
				newSourceId:c.sourceId,
				originalTargetId:idx == 1 ? cId : c.targetId,
				newTargetId:c.targetId,
				connection:c
			};

			if (el.constructor == jsPlumb.Endpoint) { // TODO here match the current endpoint class; users can change it {
				ep = el;
				ep.addConnection(c);
			}
			else {
				sid = _getId(el);
				sep = this[_st.epDefs][sid];

				if (sid === c[_st.elId]) 
					ep = null;  // dont change source/target if the element is already the one given.
				else if (sep) {
					if (!sep.enabled) return;
					ep = sep.endpoint != null && sep.endpoint._jsPlumb ? sep.endpoint : this.addEndpoint(el, sep.def);
					if (sep.uniqueEndpoint) sep.endpoint = ep;
					ep._doNotDeleteOnDetach = false;
					ep._deleteOnDetach = true;
					ep.addConnection(c);
				}
				else {
					ep = c.makeEndpoint(idx === 0, el, sid);
					ep._doNotDeleteOnDetach = false;
					ep._deleteOnDetach = true;
				}
			}
			
			if (ep != null) {
				oldEndpoint.detachFromConnection(c);
				c.endpoints[idx] = ep;
				c[_st.el] = ep.element;
				c[_st.elId] = ep.elementId;			
				evtParams[idx === 0 ? "newSourceId" : "newTargetId"] = ep.elementId;

				fireMoveEvent(evtParams);
				
				if (!doNotRepaint)
					c.repaint();
			}

			return evtParams;
			
		}.bind(this);

		this.setSource = function(connection, el, doNotRepaint) { 
			var p = _set(connection, el, 0, doNotRepaint); 
			this.anchorManager.sourceChanged(p.originalSourceId, p.newSourceId, connection);
		};
		this.setTarget = function(connection, el, doNotRepaint) { 
			var p = _set(connection, el, 1, doNotRepaint); 
			this.anchorManager.updateOtherEndpoint(p.originalSourceId, p.originalTargetId, p.newTargetId, connection);
		};
		
		this.deleteEndpoint = function(object, doNotRepaintAfterwards) {
			var _is = _currentInstance.setSuspendDrawing(true);
			var endpoint = (typeof object == "string") ? endpointsByUUID[object] : object;
			if (endpoint) {		
				_currentInstance.deleteObject({
					endpoint:endpoint
				});
			}
			if(!_is) _currentInstance.setSuspendDrawing(false, doNotRepaintAfterwards);
			return _currentInstance;
		};		
		
		this.deleteEveryEndpoint = function() {
			var _is = _currentInstance.setSuspendDrawing(true);
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
			if(!_is) _currentInstance.setSuspendDrawing(false);
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

			if (doFireEvent)
				_currentInstance.fire("connectionDetached", params, originalEvent);
			
            _currentInstance.anchorManager.connectionDetached(params);
		};	

		var fireMoveEvent = function(params, evt) {
			_currentInstance.fire("connectionMoved", params, evt);
		};

		this.unregisterEndpoint = function(endpoint) {
			//if (endpoint._jsPlumb == null) return;
			if (endpoint._jsPlumb.uuid) endpointsByUUID[endpoint._jsPlumb.uuid] = null;				
			_currentInstance.anchorManager.deleteEndpoint(endpoint);			
			// TODO at least replace this with a removeWithFunction call.			
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
		};
				
		this.detach = function() {

            if (arguments.length === 0) return;
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
						var sourceId = _getId(_currentInstance.getDOMElement(_p.source)),
						    targetId = _getId(_currentInstance.getDOMElement(_p.target));
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

		this.detachAllConnections = function(el, params) {
            params = params || {};
            el = _currentInstance.getDOMElement(el);
			var id = _getId(el),
                endpoints = endpointsByElement[id];
			if (endpoints && endpoints.length) {
				for ( var i = 0, j = endpoints.length; i < j; i++) {
					endpoints[i].detachAll(params.fireEvent !== false);
				}
			}
			return _currentInstance;
		};

		this.detachEveryConnection = function(params) {
            params = params || {};
            _currentInstance.doWhileSuspended(function() {
				for ( var id in endpointsByElement) {
					var endpoints = endpointsByElement[id];
					if (endpoints && endpoints.length) {
						for ( var i = 0, j = endpoints.length; i < j; i++) {
							endpoints[i].detachAll(params.fireEvent !== false);
						}
					}
				}
				connections.splice(0);
			});
			return _currentInstance;
		};

		/// not public.  but of course its exposed. how to change this.
		this.deleteObject = function(params) {
			var result = {
					endpoints : {}, 
					connections : {},
					endpointCount:0,
					connectionCount:0
				},
				fireEvent = params.fireEvent !== false,
				deleteAttachedObjects = params.deleteAttachedObjects !== false;

			var unravelConnection = function(connection) {
				if(connection != null && result.connections[connection.id] == null) {
					if (connection._jsPlumb != null) connection.setHover(false);
					result.connections[connection.id] = connection;
					result.connectionCount++;
					if (deleteAttachedObjects) {
						for (var j = 0; j < connection.endpoints.length; j++) {
							if (connection.endpoints[j]._deleteOnDetach)
								unravelEndpoint(connection.endpoints[j]);
						}
					}					
				}
			};
			var unravelEndpoint = function(endpoint) {
				if(endpoint != null && result.endpoints[endpoint.id] == null) {
					if (endpoint._jsPlumb != null) endpoint.setHover(false);
					result.endpoints[endpoint.id] = endpoint;
					result.endpointCount++;

					if (deleteAttachedObjects) {
						for (var i = 0; i < endpoint.connections.length; i++) {
							var c = endpoint.connections[i];
							unravelConnection(c);
						}
					}
				}
			};

			if (params.connection) 
				unravelConnection(params.connection);
			else unravelEndpoint(params.endpoint);

			// loop through connections
			for (var i in result.connections) {
				var c = result.connections[i];
				if (c._jsPlumb) {
					jsPlumbUtil.removeWithFunction(connections, function(_c) {
						return c.id == _c.id;
					});
					fireDetachEvent(c, fireEvent, params.originalEvent);
					
					c.endpoints[0].detachFromConnection(c);
					c.endpoints[1].detachFromConnection(c);
					// sp was ere
					c.cleanup();
					c.destroy();
				}
			}

			// loop through endpoints
			for (var j in result.endpoints) {
				var e = result.endpoints[j];	
				if (e._jsPlumb) {
					_currentInstance.unregisterEndpoint(e);
					// FIRE some endpoint deleted event?
					e.cleanup();
					e.destroy();
				}
			}	

			return result;
		};
 
		this.draggable = function(el, options) {
			var i,j,ele;
			// allows for array or jquery/mootools selector
			if (typeof el == 'object' && el.length) {
				for (i = 0, j = el.length; i < j; i++) {
					ele = _currentInstance.getDOMElement(el[i]);
					if (ele) _initDraggableIfNecessary(ele, true, options);
				}
			} 
			// allows for YUI selector
			else if (el._nodes) { 	// TODO this is YUI specific; really the logic should be forced
				// into the library adapters (for jquery and mootools aswell)
				for (i = 0, j = el._nodes.length; i < j; i++) {
					ele = _currentInstance.getDOMElement(el._nodes[i]);
					if (ele) _initDraggableIfNecessary(ele, true, options);
				}
			}
			else {				
				ele = _currentInstance.getDOMElement(el);
				if (ele) _initDraggableIfNecessary(ele, true, options);
			}
			return _currentInstance;
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
							if (input.length) {
								//input = _currentInstance.getElementObject(input);
								for (var i = 0, j = input.length; i < j; i++) 
									r.push(_info(input[i]).id);
							}
							else
								r.push(_info(input).id);
						}	
					}
				}
				return r;
			},
			filterList = function(list, value, missingIsFalse) {
				if (list === "*") return true;
				return list.length > 0 ? jsPlumbUtil.indexOf(list, value) != -1 : !missingIsFalse;
			};

		// get some connections, specifying source/target/scope
		this.getConnections = function(options, flat) {
			if (!options) {
				options = {};
			} else if (options.constructor == String) {
				options = { "scope": options };
			}
			var scope = options.scope || _currentInstance.getDefaultScope(),
				scopes = prepareList(scope, true),
				sources = prepareList(options.source),
				targets = prepareList(options.target),			
				results = (!flat && scopes.length > 1) ? {} : [],
				_addOne = function(scope, obj) {
					if (!flat && scopes.length > 1) {
						var ss = results[scope];
						if (ss == null) {
							ss = results[scope] = [];
						}
						ss.push(obj);
					} else results.push(obj);
				};
			
			for ( var j = 0, jj = connections.length; j < jj; j++) {
				var c = connections[j];
				if (filterList(scopes, c.scope) && filterList(sources, c.sourceId) && filterList(targets, c.targetId))
					_addOne(c.scope, c);
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
                           "getHoverPaintStyle", "isVisible", "hasType", "getType", "isSuspendEvents" ],
                i, ii;
            
            for (i = 0, ii = setters.length; i < ii; i++)
                out[setters[i]] = setter(list, setters[i], executor);
            
            for (i = 0, ii = getters.length; i < ii; i++)
                out[getters[i]] = getter(list, getters[i]);       
            
            return out;
		};
		
		var	_makeConnectionSelectHandler = function(list) {
			var common = _makeCommonSelectHandler(list, _makeConnectionSelectHandler);
			return jsPlumb.extend(common, {
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
			return jsPlumb.extend(common, {
				setEnabled:setter(list, "setEnabled", _makeEndpointSelectHandler),				
				setAnchor:setter(list, "setAnchor", _makeEndpointSelectHandler),
				isEnabled:getter(list, "isEnabled"),
				detachAll:function() {
					for (var i = 0, ii = list.length; i < ii; i++)
						list[i].detachAll();
				},
				"remove":function() {
					for (var i = 0, ii = list.length; i < ii; i++)
						_currentInstance.deleteObject({endpoint:list[i]});
				}
			});
		};
			

		this.select = function(params) {
			params = params || {};
			params.scope = params.scope || "*";
			return _makeConnectionSelectHandler(params.connections || _currentInstance.getConnections(params, true));							
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
		this.getAllConnections = function() { return connections; };
		this.getDefaultScope = function() { return DEFAULT_SCOPE; };
		// get an endpoint by uuid.
		this.getEndpoint = _getEndpoint;				
		// get endpoints for some element.
		this.getEndpoints = function(el) { return endpointsByElement[_info(el).id]; };		
		// gets the default endpoint type. used when subclassing. see wiki.
		this.getDefaultEndpointType = function() { return jsPlumb.Endpoint; };		
		// gets the default connection type. used when subclassing.  see wiki.
		this.getDefaultConnectionType = function() { return jsPlumb.Connection; };
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
		
		this.appendElement = _appendElement;
		
		var _hoverSuspended = false;
		this.isHoverSuspended = function() { return _hoverSuspended; };
		this.setHoverSuspended = function(s) { _hoverSuspended = s; };

		var _isAvailable = function(m) {
			return function() {
				return jsPlumbAdapter.isRenderModeAvailable(m);
			};
		};

		this.isSVGAvailable = _isAvailable("svg");
		this.isVMLAvailable = _isAvailable("vml");

		// set an element's connections to be hidden
		this.hide = function(el, changeEndpoints) {
			_setVisible(el, "none", changeEndpoints);
			return _currentInstance;
		};
		
		// exposed for other objects to use to get a unique id.
		this.idstamp = _idstamp;

		this.connectorsInitialized = false;
		var connectorTypes = [], rendererTypes = ["svg", "vml"];
		this.registerConnectorType = function(connector, name) {
			connectorTypes.push([connector, name]);
		};
		
		// ensure that, if the current container exists, it is a DOM element and not a selector.
		// if it does not exist and `candidate` is supplied, the offset parent of that element will be set as the Container.
		// this is used to do a better default behaviour for the case that the user has not set a container:
		// addEndpoint, makeSource, makeTarget and connect all call this method with the offsetParent of the 
		// element in question (for connect it is the source element). So if no container is set, it is inferred
		// to be the offsetParent of the first element the user tries to connect.
		var _ensureContainer = function(candidate) {
			if (!_container && candidate) {
				var can = _currentInstance.getDOMElement(candidate);
				if (can.offsetParent) _container = can.offsetParent;
			}
		};

		var _getContainerFromDefaults = function() {
			if (_currentInstance.Defaults.Container)
				_container = _currentInstance.getDOMElement(_currentInstance.Defaults.Container);
		};
		
		/**
		 * callback from the current library to tell us to prepare ourselves (attach
		 * mouse listeners etc; can't do that until the library has provided a bind method)		 
		 */
		this.init = function() {
			var _oneType = function(renderer, name, fn) {
				jsPlumb.Connectors[renderer][name] = function() {
					fn.apply(this, arguments);
					jsPlumb.ConnectorRenderers[renderer].apply(this, arguments);		
				};
				jsPlumbUtil.extend(jsPlumb.Connectors[renderer][name], [ fn, jsPlumb.ConnectorRenderers[renderer]]);
			};

			if (!jsPlumb.connectorsInitialized) {
				for (var i = 0; i < connectorTypes.length; i++) {
					for (var j = 0; j < rendererTypes.length; j++) {
						_oneType(rendererTypes[j], connectorTypes[i][1], connectorTypes[i][0]);												
					}

				}
				jsPlumb.connectorsInitialized = true;
			}
			
			if (!initialized) {                
				_getContainerFromDefaults();	
                _currentInstance.anchorManager = new jsPlumb.AnchorManager({jsPlumbInstance:_currentInstance});                
				_currentInstance.setRenderMode(_currentInstance.Defaults.RenderMode);  // calling the method forces the capability logic to be run.														
				initialized = true;
				_currentInstance.fire("ready", _currentInstance);
			}
		}.bind(this);		
		
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
			var pp, _a = function(t, p) {
				if (jsPlumb.Anchors[t]) return new jsPlumb.Anchors[t](p);
				if (!_currentInstance.Defaults.DoNotThrowErrors)
					throw { msg:"jsPlumb: unknown anchor type '" + t + "'" };
			};
			if (arguments.length === 0) return null;
			var specimen = arguments[0], elementId = arguments[1], jsPlumbInstance = arguments[2], newAnchor = null;			
			// if it appears to be an anchor already...
			if (specimen.compute && specimen.getOrientation) return specimen;  //TODO hazy here about whether it should be added or is already added somehow.
			// is it the name of an anchor type?
			else if (typeof specimen == "string") {
				newAnchor = _a(arguments[0], {elementId:elementId, jsPlumbInstance:_currentInstance});
			}
			// is it an array? it will be one of:
			// 		an array of [spec, params] - this defines a single anchor, which may be dynamic, but has parameters.
			//		an array of arrays - this defines some dynamic anchors
			//		an array of numbers - this defines a single anchor.				
			else if (_ju.isArray(specimen)) {
				if (_ju.isArray(specimen[0]) || _ju.isString(specimen[0])) {
					// if [spec, params] format
					if (specimen.length == 2 && _ju.isObject(specimen[1])) {
						// if first arg is a string, its a named anchor with params
						if (_ju.isString(specimen[0])) {
							pp = jsPlumb.extend({elementId:elementId, jsPlumbInstance:_currentInstance}, specimen[1]);
							newAnchor = _a(specimen[0], pp);
						}
						// otherwise first arg is array, second is params. we treat as a dynamic anchor, which is fine
						// even if the first arg has only one entry. you could argue all anchors should be implicitly dynamic in fact.
						else {
							pp = jsPlumb.extend({elementId:elementId, jsPlumbInstance:_currentInstance, anchors:specimen[0]}, specimen[1]);
							newAnchor = new jsPlumb.DynamicAnchor(pp);
						}
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
				else if (_ju.isArray(types[i]))
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
		
// --------------------- makeSource/makeTarget ---------------------------------------------- 
		
		this.targetEndpointDefinitions = {};
		var _setEndpointPaintStylesAndAnchor = function(ep, epIndex, _instance) {
				ep.paintStyle = ep.paintStyle ||
				 				_instance.Defaults.EndpointStyles[epIndex] ||
	                            _instance.Defaults.EndpointStyle;
								
				ep.hoverPaintStyle = ep.hoverPaintStyle ||
	                           _instance.Defaults.EndpointHoverStyles[epIndex] ||
	                           _instance.Defaults.EndpointHoverStyle;                            

				ep.anchor = ep.anchor ||
	                      	_instance.Defaults.Anchors[epIndex] ||
	                      	_instance.Defaults.Anchor;
					
				ep.endpoint = ep.endpoint ||
							  _instance.Defaults.Endpoints[epIndex] ||
							  _instance.Defaults.Endpoint;
			};
			
			// TODO put all the source stuff inside one parent, keyed by id.
			this.sourceEndpointDefinitions = {};
			
			var selectorFilter = function(evt, _el, selector, _instance, negate) {
                var t = evt.target || evt.srcElement, ok = false, 
                    sel = _instance.getSelector(_el, selector);
                for (var j = 0; j < sel.length; j++) {
                    if (sel[j] == t) {
                        ok = true;
                        break;
                    }
                }
                return negate ? !ok : ok;
	        };

		// see API docs
		this.makeTarget = function(el, params, referenceParams) {

			// put jsplumb ref into params without altering the params passed in
			var p = jsPlumb.extend({_jsPlumb:this}, referenceParams);
			jsPlumb.extend(p, params);

			// calculate appropriate paint styles and anchor from the params given
			_setEndpointPaintStylesAndAnchor(p, 1, this);

			var targetScope = p.scope || _currentInstance.Defaults.Scope,
				deleteEndpointsOnDetach = !(p.deleteEndpointsOnDetach === false),
				maxConnections = p.maxConnections || -1,
				onMaxConnections = p.onMaxConnections,

				_doOne = function(el) {
					
					// get the element's id and store the endpoint definition for it.  jsPlumb.connect calls will look for one of these,
					// and use the endpoint definition if found.
					// decode the info for this element (id and element)
					var elInfo = _info(el), 
						elid = elInfo.id,
						proxyComponent = new jsPlumbUIComponent(p),
						dropOptions = jsPlumb.extend({}, p.dropOptions || {});

					_ensureContainer(elid);

					// store the definitions keyed against the element id.
					// TODO why not just store inside the element itself?
					this.targetEndpointDefinitions[elid] = {
						def:p,
						uniqueEndpoint:p.uniqueEndpoint,
						maxConnections:maxConnections,
						enabled:true
					};

					var _drop = function() {
						this.currentlyDragging = false;
						var originalEvent = this.getDropEvent(arguments),
							targetCount = this.select({target:elid}).length,
							draggable = this.getDOMElement(this.getDragObject(arguments)),
							id = this.getAttribute(draggable, "dragId"),
							scope = this.getAttribute(draggable, "originalScope"),
							jpc = floatingConnections[id];

						if (jpc == null) return;

						var idx = jpc.endpoints[0].isFloating() ? 0 : 1,
							// this is not necessarily correct. if the source is being dragged,
							// then the source endpoint is actually the currently suspended endpoint.
							source = jpc.endpoints[0],
							_endpoint = p.endpoint ? jsPlumb.extend({}, p.endpoint) : {},
							def = this.targetEndpointDefinitions[elid];
							
						if (!def.enabled || def.maxConnections > 0 && targetCount >= def.maxConnections){
							if (onMaxConnections) {
								// TODO here we still have the id of the floating element, not the
								// actual target.
								onMaxConnections({
									element:elInfo.el,
									connection:jpc
								}, originalEvent);
							}
							return false;
						}

						// unlock the source anchor to allow it to refresh its position if necessary
						source.anchor.locked = false;

						// restore the original scope if necessary (issue 57)
						if (scope) this.setDragScope(draggable, scope);		

						// if no suspendedEndpoint and not pending, it is likely there was a drop on two 
						// elements that are on top of each other. abort.
						if (jpc.suspendedEndpoint == null && !jpc.pending)
							return false;
						
						// check if drop is allowed here.
						// if the source is being dragged then in fact
						// the source and target ids to pass into the drop interceptor are
						// source - elid
						// target - jpc's targetId
						// 
						// otherwise the ids are
						// source - jpc.sourceId
						// target - elid
						//
						var _continue = proxyComponent.isDropAllowed(idx === 0 ? elid : jpc.sourceId, idx === 0 ? jpc.targetId : elid, jpc.scope, jpc, null, idx === 0 ? elInfo.el : jpc.source, idx === 0 ? jpc.target : elInfo.el);

						// reinstate any suspended endpoint; this just puts the connection back into
						// a state in which it will report sensible values if someone asks it about
						// its target.  we're going to throw this connection away shortly so it doesnt matter
						// if we manipulate it a bit.
						if (jpc.suspendedEndpoint) {
							jpc[idx ? "targetId" : "sourceId"] = jpc.suspendedEndpoint.elementId;
							jpc[idx ? "target" : "source"] = jpc.suspendedEndpoint.element;
							jpc.endpoints[idx] = jpc.suspendedEndpoint;
							
							// TODO this and the normal endpoint drop should
							// be refactored to share more of the common code.
							var suspendedElement = jpc.suspendedEndpoint.getElement(), suspendedElementId = jpc.suspendedEndpoint.elementId;
							fireMoveEvent({
								index:idx,
								originalSourceId:idx === 0 ? suspendedElementId : jpc.sourceId,
								newSourceId:idx === 0 ? elid : jpc.sourceId,
								originalTargetId:idx == 1 ? suspendedElementId : jpc.targetId,
								newTargetId:idx == 1 ? elid : jpc.targetId,
								connection:jpc
							}, originalEvent);
						}

						if (_continue) {
							// make a new Endpoint for the target, or get it from the cache if uniqueEndpoint
                            // is set.
							var _el = this.getElementObject(elInfo.el),
								newEndpoint = def.endpoint;

                            // if no cached endpoint, or there was one but it has been cleaned up
                            // (ie. detached), then create a new one.
                            if (newEndpoint == null || newEndpoint._jsPlumb == null)
                                newEndpoint = this.addEndpoint(_el, p);

							if (p.uniqueEndpoint) def.endpoint = newEndpoint;  // may of course just store what it just pulled out. that's ok.
							// TODO test options to makeTarget to see if we should do this?
							newEndpoint._doNotDeleteOnDetach = false; // reset.
							newEndpoint._deleteOnDetach = true;

							// if connection is detachable, init the new endpoint to be draggable, to support that happening.
							if (jpc.isDetachable())
								newEndpoint.initDraggable();
																	
							// if the anchor has a 'positionFinder' set, then delegate to that function to find
							// out where to locate the anchor.
							if (newEndpoint.anchor.positionFinder != null) {
								var dropPosition = this.getUIPosition(arguments, this.getZoom()),
								elPosition = _getOffset(_el, this),
								elSize = this.getSize(_el),
								ap = newEndpoint.anchor.positionFinder(dropPosition, elPosition, elSize, newEndpoint.anchor.constructorParams);
								newEndpoint.anchor.x = ap[0];
								newEndpoint.anchor.y = ap[1];
								// now figure an orientation for it..kind of hard to know what to do actually. probably the best thing i can do is to
								// support specifying an orientation in the anchor's spec. if one is not supplied then i will make the orientation 
								// be what will cause the most natural link to the source: it will be pointing at the source, but it needs to be
								// specified in one axis only, and so how to make that choice? i think i will use whichever axis is the one in which
								// the target is furthest away from the source.
							}
							
							// change the target endpoint and target element information. really this should be 
							// done on a method on connection
							jpc[idx ? "target" : "source"] = newEndpoint.element;
							jpc[idx ? "targetId" : "sourceId"] = newEndpoint.elementId;
							jpc.endpoints[idx].detachFromConnection(jpc);
							if (jpc.endpoints[idx]._deleteOnDetach)
								jpc.endpoints[idx].deleteAfterDragStop = true; // tell this endpoint to delet itself after drag stop.
							// set new endpoint, and configure the settings for endpoints to delete on detach
							newEndpoint.addConnection(jpc);
							jpc.endpoints[idx] = newEndpoint;
							jpc.deleteEndpointsOnDetach = deleteEndpointsOnDetach;

							// inform the anchor manager to update its target endpoint for this connection.
							// TODO refactor to make this a single method.
							if (idx == 1)
								this.anchorManager.updateOtherEndpoint(jpc.sourceId, jpc.suspendedElementId, jpc.targetId, jpc);
							else
								this.anchorManager.sourceChanged(jpc.suspendedEndpoint.elementId, jpc.sourceId, jpc);

							_finaliseConnection(jpc, null, originalEvent);
							jpc.pending = false;

						}				
						// if not allowed to drop...
						else {
							// TODO this code is identical (pretty much) to what happens when a connection
							// dragged from a normal endpoint is in this situation. refactor.
							// is this an existing connection, and will we reattach?
							if (jpc.suspendedEndpoint) {
								if (jpc.isReattach()) {
									jpc.setHover(false);
									jpc.floatingAnchorIndex = null;
									jpc.suspendedEndpoint.addConnection(jpc);
									this.repaint(source.elementId);
								}
								else
									jpc.deleteConnectionNow = true;
							}							
						}
					}.bind(this);
					
					// wrap drop events as needed and initialise droppable
					var dropEvent = jsPlumb.dragEvents.drop;
					dropOptions.scope = dropOptions.scope || targetScope;
					dropOptions[dropEvent] = _ju.wrap(dropOptions[dropEvent], _drop);
					// vanilla jsplumb only
					if (p.allowLoopback === false) {
						dropOptions.canDrop = function(_drag) {
							var de = _drag.getDragElement()._jsPlumbRelatedElement;
							return de != elInfo.el;
						};
					}
					this.initDroppable(this.getElementObject(elInfo.el), dropOptions, true);
				}.bind(this);
			
			// YUI collection fix
			el = _convertYUICollection(el);			
			// make an array if only given one element
			var inputs = el.length && el.constructor != String ? el : [ el ];
						
			// register each one in the list.
			for (var i = 0, ii = inputs.length; i < ii; i++) {							
				_doOne(inputs[i]);
			}

			return this;
		};

		// see api docs
		this.unmakeTarget = function(el, doNotClearArrays) {
			var info = _info(el);

			jsPlumb.destroyDroppable(info.el);
			// TODO this is not an exhaustive unmake of a target, since it does not remove the droppable stuff from
			// the element.  the effect will be to prevent it from behaving as a target, but it's not completely purged.
			if (!doNotClearArrays) {
				delete this.targetEndpointDefinitions[info.id];
			}

			return this;
		};						

	    // see api docs
		this.makeSource = function(el, params, referenceParams) {
			var p = jsPlumb.extend({}, referenceParams);
			jsPlumb.extend(p, params);
			_setEndpointPaintStylesAndAnchor(p, 0, this);
			var maxConnections = p.maxConnections || 1,
				onMaxConnections = p.onMaxConnections,
				_doOne = function(elInfo) {
					// get the element's id and store the endpoint definition for it.  jsPlumb.connect calls will look for one of these,
					// and use the endpoint definition if found.
					var elid = elInfo.id,
						_el = this.getElementObject(elInfo.el),
						_del = this.getDOMElement(_el),
						parentElement = function() {
							return p.parent == null ? null : p.parent === "parent" ? elInfo.el.parentNode : _currentInstance.getDOMElement(p.parent);
						},
						idToRegisterAgainst = p.parent != null ? this.getId(parentElement()) : elid;

					_ensureContainer(idToRegisterAgainst);
					
					this.sourceEndpointDefinitions[idToRegisterAgainst] = {
						def:p,
						uniqueEndpoint:p.uniqueEndpoint,
						maxConnections:maxConnections,
						enabled:true
					};
					var stopEvent = jsPlumb.dragEvents.stop,
						dragEvent = jsPlumb.dragEvents.drag,
						dragOptions = jsPlumb.extend({ }, p.dragOptions || {}),
						existingDrag = dragOptions.drag,
						existingStop = dragOptions.stop,
						ep = null,
						endpointAddedButNoDragYet = false;

					// set scope if its not set in dragOptions but was passed in in params
					dragOptions.scope = dragOptions.scope || p.scope;

					dragOptions[dragEvent] = _ju.wrap(dragOptions[dragEvent], function() {
						if (existingDrag) existingDrag.apply(this, arguments);
						endpointAddedButNoDragYet = false;
					});
					
					dragOptions[stopEvent] = _ju.wrap(dragOptions[stopEvent], function() { 

						if (existingStop) existingStop.apply(this, arguments);
	                    this.currentlyDragging = false;
						if (ep._jsPlumb != null) { // if not cleaned up...
									
							// reset the anchor to the anchor that was initially provided. the one we were using to drag
							// the connection was just a placeholder that was located at the place the user pressed the
							// mouse button to initiate the drag.
							var anchorDef = p.anchor || this.Defaults.Anchor,
								oldAnchor = ep.anchor,
								oldConnection = ep.connections[0],
								newAnchor = this.makeAnchor(anchorDef, elid, this),
								_el = ep.element;

							// if the anchor has a 'positionFinder' set, then delegate to that function to find
							// out where to locate the anchor. issue 117.
							if (newAnchor.positionFinder != null) {
								var elPosition = _getOffset(_el, this),
									elSize = this.getSize(_el),
									dropPosition = { left:elPosition.left + (oldAnchor.x * elSize[0]), top:elPosition.top + (oldAnchor.y * elSize[1]) },
									ap = newAnchor.positionFinder(dropPosition, elPosition, elSize, newAnchor.constructorParams);

								newAnchor.x = ap[0];
								newAnchor.y = ap[1];
							}

							ep.setAnchor(newAnchor, true);
							
							if (p.parent) {
								var parent = parentElement();
								if (parent) {	
									var potentialParent = p.container || _container;
									ep.setElement(parent, potentialParent);
								}
							}
							
							ep.repaint();
							this.repaint(ep.elementId);
							this.repaint(oldConnection.targetId);
						}
					}.bind(this));
					
					// when the user presses the mouse, add an Endpoint, if we are enabled.
					var mouseDownListener = function(e) {
						var evt = this.getOriginalEvent(e);
						var def = this.sourceEndpointDefinitions[idToRegisterAgainst];
						elid = this.getId(this.getDOMElement(_el)); // elid might have changed since this method was called to configure the element.
						
						// if disabled, return.
						if (!def.enabled) return;
	                    
	                    // if a filter was given, run it, and return if it says no.
						if (p.filter) {
							var r = jsPlumbUtil.isString(p.filter) ? selectorFilter(evt, _el, p.filter, this, p.filterExclude) : p.filter(evt, _el);
							if (r === false) return;
						}
						
						// if maxConnections reached
						var sourceCount = this.select({source:idToRegisterAgainst}).length;
						if (def.maxConnections >= 0 && (def.uniqueEndpoint && sourceCount >= def.maxConnections)) {
							if (onMaxConnections) {
								onMaxConnections({
									element:_el,
									maxConnections:maxConnections
								}, e);
							}
							return false;
						}

						// find the position on the element at which the mouse was pressed; this is where the endpoint 
						// will be located.
						var elxy = jsPlumbAdapter.getPositionOnElement(evt, _del, _zoom), pelxy = elxy;
						// for mootools/YUI..this parent stuff should be deprecated.
						if (p.parent) {
							pelxy = jsPlumbAdapter.getPositionOnElement(evt, parentElement(), _zoom);
						}
							
						// we need to override the anchor in here, and force 'isSource', but we don't want to mess with
						// the params passed in, because after a connection is established we're going to reset the endpoint
						// to have the anchor we were given.
						var tempEndpointParams = {};
						jsPlumb.extend(tempEndpointParams, p);
						tempEndpointParams.isTemporarySource = true;
						tempEndpointParams.anchor = [ elxy[0], elxy[1] , 0,0];
						tempEndpointParams.parentAnchor = [ pelxy[0], pelxy[1], 0, 0 ];
						tempEndpointParams.dragOptions = dragOptions;
						ep = this.addEndpoint(elid, tempEndpointParams);
						endpointAddedButNoDragYet = true;
						ep.endpointWillMoveTo = p.parent ? parentElement() : null;
						// TODO test options to makeSource to see if we should do this?
						ep._doNotDeleteOnDetach = false; // reset.
						ep._deleteOnDetach = true;

	                    var _delTempEndpoint = function() {
							// this mouseup event is fired only if no dragging occurred, by jquery and yui, but for mootools
							// it is fired even if dragging has occurred, in which case we would blow away a perfectly
							// legitimate endpoint, were it not for this check.  the flag is set after adding an
							// endpoint and cleared in a drag listener we set in the dragOptions above.
							if(endpointAddedButNoDragYet) {
								 endpointAddedButNoDragYet = false;
								_currentInstance.deleteEndpoint(ep);
	                        }
						};

						_currentInstance.registerListener(ep.canvas, "mouseup", _delTempEndpoint);
	                    _currentInstance.registerListener(_el, "mouseup", _delTempEndpoint);
						
						// and then trigger its mousedown event, which will kick off a drag, which will start dragging
						// a new connection from this endpoint.
						_currentInstance.trigger(ep.canvas, "mousedown", e);

						jsPlumbUtil.consume(e);
						
					}.bind(this);
	               
	                // register this on jsPlumb so that it can be cleared by a reset.
	                this.registerListener(_el, "mousedown", mouseDownListener);
	                this.sourceEndpointDefinitions[idToRegisterAgainst].trigger = mouseDownListener;

	                // lastly, if a filter was provided, set it as a dragFilter on the element,
	                // to prevent the element drag function from kicking in when we want to
	                // drag a new connection
	                if (p.filter && jsPlumbUtil.isString(p.filter)) {
	                	_currentInstance.setDragFilter(_el, p.filter);
	                }
				}.bind(this);
			
			el = _convertYUICollection(el);
			
			var inputs = el.length && el.constructor != String ? el : [ el ];
			for (var i = 0, ii = inputs.length; i < ii; i++) {
				_doOne(_info(inputs[i]));
			}

			return this;
		};
	
		// see api docs		
		this.unmakeSource = function(el, doNotClearArrays) {
			var info = _info(el),
				mouseDownListener = this.sourceEndpointDefinitions[info.id].trigger;
			
			if (mouseDownListener) 
				_currentInstance.unregisterListener(info.el, "mousedown", mouseDownListener);

			if (!doNotClearArrays) {
				delete this.sourceEndpointDefinitions[info.id];
			}

			return this;
		};

		// see api docs
		this.unmakeEverySource = function() {
			for (var i in this.sourceEndpointDefinitions)
				_currentInstance.unmakeSource(i, true);

			this.sourceEndpointDefinitions = {};
			return this;
		};
		
		// see api docs
		this.unmakeEveryTarget = function() {
			for (var i in this.targetEndpointDefinitions)
				_currentInstance.unmakeTarget(i, true);
			
			this.targetEndpointDefinitions = {};
			return this;
		};

		// does the work of setting a source enabled or disabled.
		var _setEnabled = function(type, el, state, toggle) {
			var a = type == "source" ? this.sourceEndpointDefinitions : this.targetEndpointDefinitions;
			el = _convertYUICollection(el);

			if (_ju.isString(el)) a[el].enabled = toggle ? !a[el].enabled : state;
			else if (el.length) {				
				for (var i = 0, ii = el.length; i < ii; i++) {
					var info = _info(el[i]);
					if (a[info.id])
						a[info.id].enabled = toggle ? !a[info.id].enabled : state;
				}
			}	
			// otherwise a DOM element
			else {
				var id = _info(el).id;
				a[id].enabled = toggle ? !a[id].enabled : state;
			}
			return this;
		}.bind(this);
		
		var _first = function(el, fn) {
			el = _convertYUICollection(el);
			if (_ju.isString(el) || !el.length) 
				return fn.apply(this, [ el ]);
			else if (el.length) 
				return fn.apply(this, [ el[0] ]);
				
		}.bind(this);

		this.toggleSourceEnabled = function(el) {
			_setEnabled("source", el, null, true);
			return this.isSourceEnabled(el);
		};

		this.setSourceEnabled = function(el, state) { return _setEnabled("source", el, state); };
		this.isSource = function(el) { 
			return _first(el, function(_el) { 
				return this.sourceEndpointDefinitions[_info(_el).id] != null; 
			});
		};
		this.isSourceEnabled = function(el) { 
			return _first(el, function(_el) {
				var sep = this.sourceEndpointDefinitions[_info(_el).id];
				return sep && sep.enabled === true;
			});
		};

		this.toggleTargetEnabled = function(el) {
			_setEnabled("target", el, null, true);
			return this.isTargetEnabled(el);
		};
		
		this.isTarget = function(el) { 
			return _first(el, function(_el) {
				return this.targetEndpointDefinitions[_info(_el).id] != null; 
			});
		};
		this.isTargetEnabled = function(el) { 
			return _first(el, function(_el) {
				var tep = this.targetEndpointDefinitions[_info(_el).id];
				return tep && tep.enabled === true;
			});
		};
		this.setTargetEnabled = function(el, state) { return _setEnabled("target", el, state); };

// --------------------- end makeSource/makeTarget ---------------------------------------------- 				
				
		this.ready = function(fn) {
			_currentInstance.bind("ready", fn);
		};

		// repaint some element's endpoints and connections
		this.repaint = function(el, ui, timestamp) {
			// support both lists...
			if (typeof el == 'object' && el.length)
				for ( var i = 0, ii = el.length; i < ii; i++) {
					_draw(el[i], ui, timestamp);
				}
			else // ...and single strings.
				_draw(el, ui, timestamp);
				
			return _currentInstance;
		};

		// repaint every endpoint and connection.
		this.repaintEverything = function(clearEdits) {	
			// TODO this timestamp causes continuous anchors to not repaint properly.
			// fix this. do not just take out the timestamp. it runs a lot faster with 
			// the timestamp included.
			//var timestamp = null;
			var timestamp = _timestamp();
			for ( var elId in endpointsByElement) {
				_draw(elId, null, timestamp, clearEdits);
			}
			return this;
		};

		this.removeAllEndpoints = function(el, recurse) {
            var _one = function(_el) {
                var info = _info(_el),
                    ebe = endpointsByElement[info.id],
                    i, ii;

                if (ebe) {
                    for ( i = 0, ii = ebe.length; i < ii; i++) 
                        _currentInstance.deleteEndpoint(ebe[i]);
                }
                delete endpointsByElement[info.id];
                
                if (recurse) {
                    if (info.el && info.el.nodeType != 3 && info.el.nodeType != 8 ) {
                        for ( i = 0, ii = info.el.childNodes.length; i < ii; i++) {
                            _one(info.el.childNodes[i]);
                        }
                    }
                }
                
            };
            _one(el);
			return this;
		};
                    
        /**
        * Remove the given element, including cleaning up all endpoints registered for it.
        * This is exposed in the public API but also used internally by jsPlumb when removing the
        * element associated with a connection drag.
        */
        this.remove = function(el, doNotRepaint) {
        	var info = _info(el);        	
            _currentInstance.doWhileSuspended(function() {
            	_currentInstance.removeAllEndpoints(info.id, true);
            	_currentInstance.dragManager.elementRemoved(info.id);
            	delete floatingConnections[info.id];     
            	_currentInstance.anchorManager.clearFor(info.id);						
            	_currentInstance.anchorManager.removeFloatingConnection(info.id);
            }, doNotRepaint === false);
            if (info.el) _currentInstance.removeElement(info.el);
			return _currentInstance;
        };

		var _registeredListeners = {},
			_unbindRegisteredListeners = function() {
				for (var i in _registeredListeners) {
					for (var j = 0, jj = _registeredListeners[i].length; j < jj; j++) {
						var info = _registeredListeners[i][j];
						_currentInstance.off(info.el, info.event, info.listener);
					}
				}
				_registeredListeners = {};
			};

        // internal register listener method.  gives us a hook to clean things up
        // with if the user calls jsPlumb.reset.
        this.registerListener = function(el, type, listener) {
            _currentInstance.on(el, type, listener);
            jsPlumbUtil.addToList(_registeredListeners, type, {el:el, event:type, listener:listener});
        };

        this.unregisterListener = function(el, type, listener) {
        	_currentInstance.off(el, type, listener);
        	jsPlumbUtil.removeWithFunction(_registeredListeners, function(rl) {
        		return rl.type == type && rl.listener == listener;
        	});
        };
		
		this.reset = function() {
			_currentInstance.deleteEveryEndpoint();
			_currentInstance.unbind();
			this.targetEndpointDefinitions = {};
			this.sourceEndpointDefinitions = {};
			connections.splice(0);
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
			// 
			var id;

			if (jsPlumbUtil.isString(el)) {
				id = el;
			}
			else {
				el = this.getDOMElement(el);
				id = this.getId(el);
			}

			var sConns = this.getConnections({source:id, scope:'*'}, true),
				tConns = this.getConnections({target:id, scope:'*'}, true);

			newId = "" + newId;

			if (!doNotSetAttribute) {
				el = this.getDOMElement(id);
				this.setAttribute(el, "id", newId);
			}
			else
				el = this.getDOMElement(newId);

			endpointsByElement[newId] = endpointsByElement[id] || [];
			for (var i = 0, ii = endpointsByElement[newId].length; i < ii; i++) {
				endpointsByElement[newId][i].setElementId(newId);
				endpointsByElement[newId][i].setReferenceElement(el);
			}
			delete endpointsByElement[id];

			this.anchorManager.changeId(id, newId);
			if (this.dragManager) this.dragManager.changeId(id, newId);

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

			this.repaint(newId);
		};

		this.setDebugLog = function(debugLog) {
			log = debugLog;
		};

		this.setSuspendDrawing = function(val, repaintAfterwards) {
			var curVal = _suspendDrawing;
		    _suspendDrawing = val;
				if (val) _suspendedAt = new Date().getTime(); else _suspendedAt = null;
		    if (repaintAfterwards) this.repaintEverything();
		    return curVal;
		};

        // returns whether or not drawing is currently suspended.
		this.isSuspendDrawing = function() {
			return _suspendDrawing;
		};

        // return timestamp for when drawing was suspended.
        this.getSuspendedAt = function() { return _suspendedAt; };

        this.doWhileSuspended = function(fn, doNotRepaintAfterwards) {
        	var _wasSuspended = this.isSuspendDrawing();
        	if (!_wasSuspended)
				this.setSuspendDrawing(true);
			try {
				fn();
			}
			catch (e) {
				_ju.log("Function run while suspended failed", e);
			}
			if (!_wasSuspended)
				this.setSuspendDrawing(false, !doNotRepaintAfterwards);
		};

		this.getOffset = function(elId) { return offsets[elId]; };
		this.getCachedData = _getCachedData;
		this.timestamp = _timestamp;
		this.setRenderMode = function(mode) {
			if (mode !== jsPlumb.SVG && mode !== jsPlumb.VML) throw new TypeError("Render mode [" + mode + "] not supported");
			renderMode = jsPlumbAdapter.setRenderMode(mode);
			return renderMode;
		};
		this.getRenderMode = function() { return renderMode; };
		this.show = function(el, changeEndpoints) {
			_setVisible(el, "block", changeEndpoints);
			return _currentInstance;
		};

		// TODO: update this method to return the current state.
		this.toggleVisible = _toggleVisible;
		this.toggleDraggable = _toggleDraggable;
		this.addListener = this.bind;

		if (!jsPlumbAdapter.headless) {
			_currentInstance.dragManager = jsPlumbAdapter.getDragManager(_currentInstance);
			_currentInstance.recalculateOffsets = _currentInstance.dragManager.updateOffsets;
		}
	};

    jsPlumbUtil.extend(jsPlumbInstance, jsPlumbUtil.EventGenerator, {
    	setAttribute : function(el, a, v) {
    		this.setAttribute(el, a, v);
    	},
    	getAttribute : function(el, a) {
    		return this.getAttribute(jsPlumb.getDOMElement(el), a);
    	},    	
    	registerConnectionType : function(id, type) {
    		this._connectionTypes[id] = jsPlumb.extend({}, type);
    	},    	
    	registerConnectionTypes : function(types) {
    		for (var i in types)
    			this._connectionTypes[i] = jsPlumb.extend({}, types[i]);
    	},
    	registerEndpointType : function(id, type) {
    		this._endpointTypes[id] = jsPlumb.extend({}, type);
    	},    	
    	registerEndpointTypes : function(types) {
    		for (var i in types)
    			this._endpointTypes[i] = jsPlumb.extend({}, types[i]);
    	},    	
    	getType : function(id, typeDescriptor) {
    		return typeDescriptor ===  "connection" ? this._connectionTypes[id] : this._endpointTypes[id];
    	},
    	setIdChanged : function(oldId, newId) {
    		this.setId(oldId, newId, true);
    	},
    	// set parent: change the parent for some node and update all the registrations we need to.
    	setParent : function(el, newParent) {
    		var _el = this.getElementObject(el),
    			_dom = this.getDOMElement(_el),
    			_id = this.getId(_dom),
    			_pel = this.getElementObject(newParent),
    			_pdom = this.getDOMElement(_pel),
    			_pid = this.getId(_pdom);

    		_dom.parentNode.removeChild(_dom);
    		_pdom.appendChild(_dom);
    		this.dragManager.setParent(_el, _id, _pel, _pid);
    	},
		/**
		 * gets the size for the element, in an array : [ width, height ].
		 */
		getSize : function(el) {
			return [ el.offsetWidth, el.offsetHeight ];
		},
		getWidth : function(el) {
			return el.offsetWidth;
		},
		getHeight : function(el) {
			return el.offsetHeight;
		},
		extend : function(o1, o2, names) {
			var i;
			if (names) {
				for (i = 0; i < names.length; i++)
					o1[names[i]] = o2[names[i]];
			}
			else
				for (i in o2) o1[i] = o2[i];
			return o1;
		}
    }, jsPlumbAdapter);

// --------------------- static instance + AMD registration -------------------------------------------	
	
// create static instance and assign to window if window exists.	
	var jsPlumb = new jsPlumbInstance();
	// register on window if defined (lets us run on server)
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
