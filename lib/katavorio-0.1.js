/**
 drag/drop functionality for use with jsPlumb but with
 no knowledge of jsPlumb. supports multiple scopes, dragging
 multiple elements, containment, drop filters, drag start filters, custom
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
    
    var _classes = {
            drag : "jsplumb-drag",
            active : "jsplumb-drag-active",
            hover : "jsplumb-drag-hover",
            noSelect : "jsplumb-drag-no-select"
        }, 
        _scope = "jsplumb-drag-scope",
        _pageLocation = function(e) {
            return e.pageX ?
                   [ e.pageX, e.pageY ] :
                   [ e.clientX + document.documentElement.scrollLeft, e.clientY + document.documentElement.scrollTop ];
        },        
        _positions = {},        
        _each = function(l, fn, from) {
            for (var i = 0; i < l.length; i++) {
                if (l[i] != from)
                    fn(l[i]);
            }
        },
        _setDroppablesActive = function(dd, val, andHover) {
            _each(dd, function(e) {
                e.setActive(val);
                if (val) e.updatePosition();
                if (andHover) e.setHover(val);
            });
        };
        
    var Super = function(el, params) {
        this.el = el;
        var enabled = true;
        this.scopes = params.scope ? params.scope.split(/\s+/) : [ _scope ];        
        this.setEnabled = function(e) { enabled = e; };
        this.isEnabled = function() { return enabled; };
        return params.katavorio;
    };
    
    // 
    var Drag = function(el, params) {
        var k = Super.apply(this, arguments),
            downAt = [0,0], down= false, posAtDown = null,
            constrain = params.constrain || function(pos) { return pos; },
            matchingDroppables = [], intersectingDroppables = [],            
            _mark = function() {
                posAtDown = params.getPosition(el);
                this.size = params.getSize(el);
            }.bind(this),
            downListener = function(e) {
                if (this.isEnabled()) {
                    downAt = _pageLocation(e);
                    _mark();
                    params.bind(document, "mousemove", moveListener);
                    params.bind(document, "mouseup", upListener);
                    down = true;
                    matchingDroppables = k.getMatchingDroppables(this);
                    _setDroppablesActive(matchingDroppables, true);                    
                    k.markSelection(this);                    
                    params.addClass(el, params.dragClass || _classes.drag);
                    params.addClass(document.body, _classes.noSelect);
                    params.fireEvent("start", el, posAtDown, e);
                }
            }.bind(this),
            _moveBy = function(dx, dy, e) {                
                var cPos = constrain([posAtDown[0] + dx, posAtDown[1] + dy]),
                    rect = { x:cPos[0], y:cPos[1], w:this.size[0], h:this.size[1]};
                                        
                params.setPosition(el, cPos);
                for (var i = 0; i < matchingDroppables.length; i++) {
                    var r2 = { x:matchingDroppables[i].position[0], y:matchingDroppables[i].position[1], w:matchingDroppables[i].size[0], h:matchingDroppables[i].size[1]};
                    if (params.intersects(rect, r2) && matchingDroppables[i].canDrop(this)) {
                        intersectingDroppables.push(matchingDroppables[i]);
                        matchingDroppables[i].setHover(this, true);
                    }
                    else if (matchingDroppables[i].el._katavorioDragHover)
                        matchingDroppables[i].setHover(this, false);
                }
                                
                if (e) params.fireEvent("drag", el, cPos, e);
                
            }.bind(this),
            moveListener = function(e) {
                if (down) {
                    intersectingDroppables.length = 0;
                    var pos = _pageLocation(e),
                        dx = pos[0] - downAt[0],
                        dy = pos[1] - downAt[1];
                        
                    _moveBy(dx, dy, e);
                    k.updateSelection(dx, dy, this);
                }                
            }.bind(this),
            upListener = function(e) {                
                down = false;
                params.unbind(document, moveListener);
                params.unbind(document, upListener);
                params.removeClass(el, params.dragClass || _classes.drag);
                params.removeClass(document.body, _classes.noSelect);
                _setDroppablesActive(matchingDroppables, false, true);                
                
                // if over anything, tell it to fire a drop event.
                for (var i = 0; i < intersectingDroppables.length; i++)
                    intersectingDroppables[i].drop(this, e);
                    
                intersectingDroppables.length = 0;                             
                params.fireEvent("stop", el, null, e);
            }.bind(this);
            
        params.bind(el, "mousedown", downListener);
                
        this.destroy = function() {
            params.unbind(el, downListener);
        };
        this.mark = _mark;
        this.moveBy = _moveBy;               
    };
    
    var Drop = function(el, params) {
        var k = Super.apply(this, arguments), hover = false;   
        
        this.setActive = function(val) {
            params[val ? "addClass" : "removeClass"](el, _classes.active);
        };
        
        this.updatePosition = function() {
            this.position = params.getPosition(el);
            this.size = params.getSize(el);
        };
        
        this.canDrop = function(drag) {
           return true; // TODO
        };
        
        this.setHover = function(drag, val) {
            // if turning off hover but this was not the drag that caused the hover, ignore.
            if (val || el._katavorioDragHover == null || el._katavorioDragHover == drag.el._katavorio) {
                params[val ? "addClass" : "removeClass"](el, _classes.hover);
                el._katavorioDragHover = val ? drag.el._katavorio : null;    
            }
            
        };
        
        this.drop = function(drag, event) {
            params.fireEvent("drop", { drag:drag, event:event });
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
            _registerByScope = function(obj, map) {
                for(var i = 0; i < obj.scopes.length; i++) {
                    map[obj.scopes[i]] = map[obj.scopes[i]] || [];
                    map[obj.scopes[i]].push(obj);
                }
            },
            _getMatchingDroppables = this.getMatchingDroppables = function(drag) {
                var dd = [];
                for (var i = 0; i < drag.scopes.length; i++) {
                    var _dd = _dropsByScope[drag.scopes[i]];
                    if (_dd) dd.push.apply(dd, _dd);
                }
                // TODO: there might be duplicates
                return dd;
            };
    
        var _prepareParams = function(p) {
            p = p || {};
            var _p = {};            
            for (var i in katavorioParams) _p[i] = katavorioParams[i];
            for (var i in p) _p[i] = p[i];                
            _p.katavorio = this;
            return _p;
        }.bind(this);
        
        this.draggable = function(el, params) {
            el = _gel(el);            
            var p = _prepareParams(params, this);
            // add constrain stuff
            if (p.constrain) {
                // constrain may be to "parent", a dom element, or an arbitrary selector,                 
                // but only a single element, so if you provide a selector,
                // the first element will be used.
                var cel = typeof p.constrain == "string" ?
                            p.constrain === "parent" ? el.parentNode :
                            document.querySelectorAll(p.constrain)[0] :
                            p.constrain;
                            
                p.constrain = function(pos, size) {
                    //console.log("asking for constrain ", pos, size, cel);
                    return pos;
                };
            }
            
            // supply the fireEvent function
            p.fireEvento = function(id, el, pos, evt) {
                
            }
            
            el._katavorioDrag = new Drag(el, p);
            _registerByScope(el._katavorioDrag, _dragsByScope);
        };
        
        this.droppable = function(el, params) {
            el = _gel(el);
            el._katavorioDrop = new Drop(el, _prepareParams(params));
            _registerByScope(el._katavorioDrop, _dropsByScope);
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
                    _selection.splice(e[1], 1);
                    delete _selectionMap[el._katavorio];
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
        
        this.getSelection = function() {
            return _selection.slice(0);
        };
        
        this.updateSelection = function(dx, dy, drag) {
            _each(_selection, function(e) { e.moveBy(dx, dy); }, drag);
        };
    };
        
}).call(this);