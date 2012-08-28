/*
 * jsPlumb
 * 
 * Title:jsPlumb 1.3.13
 * 
 * Provides a way to visually connect elements on an HTML page, using either SVG, Canvas
 * elements, or VML.  
 * 
 * This file contains the base functionality for DOM type adapters. 
 *
 * Copyright (c) 2010 - 2012 Simon Porritt (http://jsplumb.org)
 * 
 * http://jsplumb.org
 * http://github.com/sporritt/jsplumb
 * http://code.google.com/p/jsplumb
 * 
 * Dual licensed under the MIT and GPL2 licenses.
 */
;(function() {
    
		var canvasAvailable = !!document.createElement('canvas').getContext,
		svgAvailable = !!window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"),
		// http://stackoverflow.com/questions/654112/how-do-you-detect-support-for-vml-or-svg-in-a-browser
		vmlAvailable = function() {		    
				if (vmlAvailable.vml == undefined) { 
						var a = document.body.appendChild(document.createElement('div'));
		        a.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
		        var b = a.firstChild;
		        b.style.behavior = "url(#default#VML)";
		        vmlAvailable.vml = b ? typeof b.adj == "object": true;
		        a.parentNode.removeChild(a);
				}
				return vmlAvailable.vml;
		};
        
    /**
				Manages dragging for some instance of jsPlumb.
		*/
		var DragManager = function(_currentInstance) {		
				var _draggables = {}, _dlist = [], _delements = {}, _elementsWithEndpoints = {};

				/**
					register some element as draggable.  right now the drag init stuff is done elsewhere, and it is
					possible that will continue to be the case.
				*/
				this.register = function(el) {
						var jpcl = jsPlumb.CurrentLibrary;
						el = jpcl.getElementObject(el);
						var id = _currentInstance.getId(el),
								domEl = jpcl.getDOMElement(el),
								parentOffset = jpcl.getOffset(el);
								
						if (!_draggables[id]) {
								_draggables[id] = el;
								_dlist.push(el);
								_delements[id] = {};
						}
				
				// look for child elements that have endpoints and register them against this draggable.
				var _oneLevel = function(p, startOffset) {
						if (p) {											
								for (var i = 0; i < p.childNodes.length; i++) {
										if (p.childNodes[i].nodeType != 3) {
												var cEl = jpcl.getElementObject(p.childNodes[i]),
														cid = _currentInstance.getId(cEl, null, true);
												if (cid && _elementsWithEndpoints[cid] && _elementsWithEndpoints[cid] > 0) {
														var cOff = jpcl.getOffset(cEl);
														_delements[id][cid] = {
																id:cid,
																offset:{
																		left:cOff.left - parentOffset.left,
																		top:cOff.top - parentOffset.top
																}
														};
												}
												_oneLevel(p.childNodes[i]);
										}	
								}
						}
				};

				_oneLevel(domEl);
		};

		/**
			notification that an endpoint was added to the given el.  we go up from that el's parent
			node, looking for a parent that has been registered as a draggable. if we find one, we add this
			el to that parent's list of elements to update on drag (if it is not there already)
		*/
		this.endpointAdded = function(el) {
			var jpcl = jsPlumb.CurrentLibrary, b = document.body, id = _currentInstance.getId(el), c = jpcl.getDOMElement(el), 
				p = c.parentNode, done = p == b;

			_elementsWithEndpoints[id] = _elementsWithEndpoints[id] ? _elementsWithEndpoints[id] + 1 : 1;

			while (p != b) {
				var pid = _currentInstance.getId(p);
				if (_draggables[pid]) {
					var idx = -1, pEl = jpcl.getElementObject(p), pLoc = jpcl.getOffset(pEl);
					
					if (_delements[pid][id] == null) {
						var cLoc = jsPlumb.CurrentLibrary.getOffset(el);
						_delements[pid][id] = {
							id:id,
							offset:{
								left:cLoc.left - pLoc.left,
								top:cLoc.top - pLoc.top
							}
						};
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
						delete _delements[i][endpoint.elementId];
					}
				}
			}		
		};

		this.getElementsForDraggable = function(id) {
			return _delements[id];	
		};

		this.reset = function() {
			_draggables = {};
			_dlist = [];
			_delements = {};
			_elementsWithEndpoints = {};
		};
		
	};
        
    // for those browsers that dont have it.  they still don't have it! but at least they won't crash.
	if (!window.console)
		window.console = { time:function(){}, timeEnd:function(){}, group:function(){}, groupEnd:function(){}, log:function(){} };
            
    window.jsPlumbAdapter = {
        
        headless:false,
        
        appendToRoot : function(node) {
            document.body.appendChild(node);
        },
        getRenderModes : function() {
            return [ "canvas", "svg", "vml" ]
        },
        isRenderModeAvailable : function(m) {
            return {
                "canvas":canvasAvailable,
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
			            
                var canvasAvailable = this.isRenderModeAvailable("canvas"),
                    svgAvailable = this.isRenderModeAvailable("svg"),
                    vmlAvailable = this.isRenderModeAvailable("vml");
                
                //if (mode !== jsPlumb.CANVAS && mode !== jsPlumb.SVG && mode !== jsPlumb.VML) throw new Error("render mode must be one of jsPlumb.CANVAS, jsPlumb.SVG or jsPlumb.VML");
                // now test we actually have the capability to do this.						
                if (mode === "svg") {
                    if (svgAvailable) renderMode = "svg"
                    else if (canvasAvailable) renderMode = "canvas"
                    else if (vmlAvailable) renderMode = "vml"
                }
                else if (mode === "canvas" && canvasAvailable) renderMode = "canvas";
                else if (vmlAvailable) renderMode = "vml";
            }

			return renderMode;
        }
    };
    
})();