/**
 drag/drop functionality for use with jsPlumb but with
 no knowledge of jsPlumb. supports multiple scopes (separated by whitespace), dragging
 multiple elements, constrain to parent, drop filters, drag start filters, custom
 css classes.
 
 a lot of the functionality of this script is expected to be plugged in:
 
 addClass
 removeClass
 getPosition
 setPosition
 fireEvent
 
 the name came from here:
 
 http://mrsharpoblunto.github.io/foswig.js/
 
 copyright 2013 Simon Porritt
*/ 

;(function() {
    
    "use strict";

    var ms = typeof HTMLElement != "undefined" ? (HTMLElement.prototype.webkitMatchesSelector || HTMLElement.prototype.mozMatchesSelector || HTMLElement.prototype.oMatchesSelector || HTMLElement.prototype.msMatchesSelector) : null;
	var matchesSelector = function(el, selector, ctx) {
		if (ms)
            return ms.apply(el, [ selector, ctx ]);

		ctx = ctx || el.parentNode;
		var possibles = ctx.querySelectorAll(selector);
		for (var i = 0; i < possibles.length; i++) {
			if (possibles[i] === el)
				return true;
		}
		return false;
	};
    
    var _classes = {
            draggable:"jsplumb-draggable",    // draggable elements
            droppable:"jsplumb-droppable",    // droppable elements
            drag : "jsplumb-drag",            // elements currently being dragged            
            selected:"jsplumb-drag-selected", // elements in current drag selection
            active : "jsplumb-drag-active",   // droppables that are targets of a currently dragged element
            hover : "jsplumb-drag-hover",     // droppables over which a matching drag element is hovering
            noSelect : "jsplumb-drag-no-select" // added to the body to provide a hook to suppress text selection
        }, 
        _scope = "jsplumb-drag-scope",
        _events = [ "stop", "start", "drag", "drop", "over", "out" ],
        _devNull = function() {},
        _true = function() { return true; },
        _pl = function(e) {
            return e.pageX ?
                   [ e.pageX, e.pageY ] :
                   [ e.clientX + document.documentElement.scrollLeft, e.clientY + document.documentElement.scrollTop ];
        },                
        _each = function(l, fn, from) {
            for (var i = 0; i < l.length; i++) {
                if (l[i] != from)
                    fn(l[i]);
            }
        },
        _setDroppablesActive = function(dd, val, andHover, drag) {
            _each(dd, function(e) {
                e.setActive(val);
                if (val) e.updatePosition();
                if (andHover) e.setHover(drag, val);
            });
        };
        
    var Super = function(el, params) {
        params.addClass(el, this._class);
        this.el = el;
        var enabled = true;
        this.setEnabled = function(e) { enabled = e; };
        this.isEnabled = function() { return enabled; };
		
		this.setScope = function(scopes) {
			this.scopes = scopes ? scopes.split(/\s+/) : [ _scope ];
		};
		
		this.setScope(params.scope);
		this.k = params.katavorio;
        return params.katavorio;
    };
        
    var Drag = function(el, params) {
        this._class = _classes.draggable;
        var k = Super.apply(this, arguments),
            downAt = [0,0], posAtDown = null,
			toGrid = function(pos) {
				return params.grid == null ? pos :
					[
						params.grid[0] * Math.floor(pos[0] / params.grid[0]),
						params.grid[1] * Math.floor(pos[1] / params.grid[1])
					];
			},
			constrain = params.constrain ? function(pos) {
                var r = { x:pos[0], y:pos[1], w:this.size[0], h:this.size[1] };
                return [ 
					Math.max(0, Math.min(constrainRect.w - this.size[0], pos[0])),
					Math.max(0, Math.min(constrainRect.h - this.size[1], pos[1]))
				];
            }.bind(this) : function(pos) { return pos; },
            filter = _true,
            _setFilter = this.setFilter = function(f) {
                if (f) {
                    filter = function(e) {
                        var t = e.srcElement || e.target;
                        return !matchesSelector(t, f, el);
                    };
                }
            },
            canDrag = params.canDrag || _true,
            constrainRect,
            matchingDroppables = [], intersectingDroppables = [],            
            downListener = function(e) {
                if (this.isEnabled() && canDrag() && filter(e)) {
                    downAt = _pl(e);
                    this.mark();
                    params.bind(document, "mousemove", moveListener);
                    params.bind(document, "mouseup", upListener);                    
                    k.markSelection(this);                    
                    params.addClass(document.body, _classes.noSelect);
                    params.events["start"]({el:el, pos:posAtDown, e:e, drag:this});
                }
            }.bind(this),            
            moveListener = function(e) {
                if (downAt) {
                    intersectingDroppables.length = 0;
                    var pos = _pl(e), dx = pos[0] - downAt[0], dy = pos[1] - downAt[1],
                    z = k.getZoom();
                    dx /= z;
                    dy /= z;
                    this.moveBy(dx, dy, e);
                    k.updateSelection(dx, dy, this);
                }                
            }.bind(this),
            upListener = function(e) {
                downAt = null;
                params.unbind(document, "mousemove", moveListener);
                params.unbind(document, "mouseup", upListener);            
                params.removeClass(document.body, _classes.noSelect);
                this.unmark(e);
                k.unmarkSelection(this, e);
                params.events["stop"]({el:el, pos:params.getPosition(el), e:e, drag:this});
            }.bind(this);

        this.mark = function() {
            posAtDown = params.getPosition(el);
            this.size = params.getSize(el);
            matchingDroppables = k.getMatchingDroppables(this);
            _setDroppablesActive(matchingDroppables, true, false, this);
            params.addClass(el, params.dragClass || _classes.drag);
            if (params.constrain) {
                var cs = params.getSize(this.el.parentNode);
                constrainRect = { w:cs[0], h:cs[1] };
            }
        };
        this.unmark = function(e) {
            _setDroppablesActive(matchingDroppables, false, true, this);
            matchingDroppables.length = 0;
            for (var i = 0; i < intersectingDroppables.length; i++)
                intersectingDroppables[i].drop(this, e);
            params.removeClass(el, params.dragClass || _classes.drag);
        };
        this.moveBy = function(dx, dy, e) {
            intersectingDroppables.length = 0;
            var cPos = constrain(toGrid(([posAtDown[0] + dx, posAtDown[1] + dy]))),
                rect = { x:cPos[0], y:cPos[1], w:this.size[0], h:this.size[1]};
            params.setPosition(el, cPos);
            for (var i = 0; i < matchingDroppables.length; i++) {
                var r2 = { x:matchingDroppables[i].position[0], y:matchingDroppables[i].position[1], w:matchingDroppables[i].size[0], h:matchingDroppables[i].size[1]};
                if (params.intersects(rect, r2) && matchingDroppables[i].canDrop(this)) {
                    intersectingDroppables.push(matchingDroppables[i]);
                    matchingDroppables[i].setHover(this, true, e);
                }
                else if (matchingDroppables[i].el._katavorioDragHover) {
                    matchingDroppables[i].setHover(this, false, e);
                }
            }
          	params.events["drag"]({el:el, pos:cPos, e:e, drag:this});
        };

		// init:register mousedown, and perhaps set a filter
		params.bind(el, "mousedown", downListener);
        _setFilter(params.filter);
    };
    
    var Drop = function(el, params) {
        this._class = _classes.droppable;
        this._activeClass = params.activeClass || _classes.active;
        this._hoverClass = params.hoverClass || _classes.hover;
        var k = Super.apply(this, arguments), hover = false;
                
        this.setActive = function(val) {
            params[val ? "addClass" : "removeClass"](el, this._activeClass);
        };
        
        this.updatePosition = function() {
            this.position = params.getPosition(el);
            this.size = params.getSize(el);
        };
        
        this.canDrop = params.canDrop || function(drag) {
           return true;
        };
        
        this.setHover = function(drag, val, e) {
            // if turning off hover but this was not the drag that caused the hover, ignore.
            if (val || el._katavorioDragHover == null || el._katavorioDragHover == drag.el._katavorio) {
                params[val ? "addClass" : "removeClass"](el, this._hoverClass);
                el._katavorioDragHover = val ? drag.el._katavorio : null;
                if (hover !== val)
                    params.events[val ? "over" : "out"]({el:el, e:e, drag:drag, drop:this});
                hover = val;
            }
        };
        
        this.drop = function(drag, event) {
            params.events["drop"]({ drag:drag, event:event, drop:this });
        };
    };
    
    var _uuid = function() {
        return ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        }));
    };
    
    var _gel = function(el) {
        el = typeof el === "string" ? document.getElementById(el) : el;
        el._katavorio = el._katavorio || _uuid();
        return el;
    };
        
    this.Katavorio = function(katavorioParams) {

        var _selection = [],
            _selectionMap = {},
            _dragsByScope = {},
            _dropsByScope = {},
            _zoom = 1,
            _reg = function(obj, map) {
                for(var i = 0; i < obj.scopes.length; i++) {
                    map[obj.scopes[i]] = map[obj.scopes[i]] || [];
                    map[obj.scopes[i]].push(obj);
                }
            },
			_unreg = function(obj, map) {
				for(var i = 0; i < obj.scopes.length; i++) {
                    if (map[obj.scopes[i]]) {
						debugger;
						var idx = katavorioParams.indexOf(map[obj.scopes[i]], obj);
						if (idx != -1)
							map[obj.scopes[i]].splice(idx, 1);
					}
                }
			},
            _getMatchingDroppables = this.getMatchingDroppables = function(drag) {
                var dd = [], _m = {};
                for (var i = 0; i < drag.scopes.length; i++) {
                    var _dd = _dropsByScope[drag.scopes[i]];
                    if (_dd) {
                        for (var j = 0; j < _dd.length; j++) {
                            if (_dd[j].canDrop(drag) &&  !_m[_dd[j].el._katavorio] && _dd[j].el !== drag.el) {
                                _m[_dd[j].el._katavorio] = true;
                                dd.push(_dd[j]);
                            }
                        }
                    }
                }
                return dd;
            },
            _prepareParams = function(p) {
                p = p || {};
                var _p = {
                    events:{}
                };
                for (var i in katavorioParams) _p[i] = katavorioParams[i];
                for (var i in p) _p[i] = p[i];
                // events
                
                for (var i = 0; i < _events.length; i++) {
                    _p.events[_events[i]] = p[_events[i]] || _devNull;
                }
                _p.katavorio = this;
                return _p;
            }.bind(this);
        
        this.draggable = function(el, params) {
            el = _gel(el);
            var p = _prepareParams(params, this);
            el._katavorioDrag = new Drag(el, p);
            _reg(el._katavorioDrag, _dragsByScope);
			return el._katavorioDrag;
        };
        
        this.droppable = function(el, params) {
            el = _gel(el);
            el._katavorioDrop = new Drop(el, _prepareParams(params));
            _reg(el._katavorioDrop, _dropsByScope);
			return el._katavorioDrop;
        };
        
        /**
        * @name Katavorio#select
        * @function
        * @desc Adds an element to the current selection (for multiple node drag)
        * @param {Element|String} DOM element - or id of the element - to add.
        */
        this.select = function(el) {
            el = _gel(el);
            if (el && el._katavorioDrag) {
                if (!_selectionMap[el._katavorio]) {
                    _selection.push(el._katavorioDrag);
                    _selectionMap[el._katavorio] = [ el, _selection.length - 1 ];
                    katavorioParams.addClass(el, _classes.selected);
                }
            }
        };
        
        /**
        * @name Katavorio#deselect
        * @function
        * @desc Removes an element from the current selection (for multiple node drag)
        * @param {Element|String} DOM element - or id of the element - to remove.
        */
        this.deselect = function(el) {
            el = _gel(el);
            if (el && el._katavorio) {
                var e = _selectionMap[el._katavorio];
                if (e) {
                    params.removeClass(el, _classes.dragSelect);
                    _selection.splice(e[1], 1);
                    delete _selectionMap[el._katavorio];
                    katavorioParams.removeClass(el, _classes.selected);
                }
            }
        };
        
        this.deselectAll = function() {
            _selection.length = 0;
            _selectionMap = {};
        };

        this.markSelection = function(drag) {
            _each(_selection, function(e) { e.mark(); }, drag);
        };

        this.unmarkSelection = function(drag, event) {
            _each(_selection, function(e) { e.unmark(event); }, drag);
        };

        this.getSelection = function() {
            return _selection.slice(0);
        };

        this.updateSelection = function(dx, dy, drag) {
            _each(_selection, function(e) { e.moveBy(dx, dy); }, drag);
        };

        this.setZoom = function(z) {
            _zoom = z;
        };

        this.getZoom = function() { return _zoom; };
		
		// does the work of changing scopes
		var _setScope = function(kObj, scopes, map) {
			if (kObj != null) {
				// deregister existing scopes
				_unreg(kObj, map);
				// set scopes
				kObj.setScope(scopes);
				// register new ones
				_reg(kObj, map);
			}
		};
		
		// sets the scope of the given object, both for drag and drop if it
		// is registered for both. to target just drag or drop, see setDragScope
		// and setDropScope
		this.setScope = function(el, scopes) {
			_setScope(el._katavorioDrag, scopes, _dragsByScope);
			_setScope(el._katavorioDrop, scopes, _dropsByScope);
		};
		
		this.setDragScope = function(el, scopes) {
			_setScope(el._katavorioDrag, scopes, _dragsByScope);
		};
		
		this.setDropScope = function(el, scopes) {
			_setScope(el._katavorioDrop, scopes, _dropsByScope);
		};
		
		this.getDragsForScope = function(s) {
			return _dragsByScope[s];
		}; 
		
		this.getDropsForScope = function(s) {
			return _dropsByScope[s];
		};
    };
}).call(this);