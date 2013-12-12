/**
 drag/drop functionality for use with jsPlumb but with
 no knowledge of jsPlumb. supports multiple scopes, dragging
 multiple elements, containment, drop filters, drag start filters, custom
 css class.
 
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
    
    var _dragClass = "jsplumb-drag",
        _activeClass = "jsplumb-drag-active",
        _hoverClass = "jsplumb-drag-hover",
        _no_select_class = "jsplumb-drag-no-select",
        _scope = "jsplumb-drag-scope",
        _pageLocation = function(e) {
            return e.pageX ?
                   [ e.pageX, e.pageY ] :
                   [ e.clientX + document.documentElement.scrollLeft, e.clientY + document.documentElement.scrollTop ];
        },
        _dragsByScope = {},
        _dropsByScope = {},
        _positions = {},
        _registerByScope = function(obj, map) {
            for(var i = 0; i < obj.scopes.length; i++) {
                map[obj.scopes[i]] = map[obj.scopes[i]] || [];
                map[obj.scopes[i]].push(obj);
            }
        },
        _getMatchingDroppables = function(drag) {
            var dd = [];
            for (var i = 0; i < drag.scopes.length; i++) {
                var _dd = _dropsByScope[drag.scopes[i]];
                if (_dd) dd.push.apply(dd, _dd);
            }
            // TODO: there might be duplicates
            return dd;
        },
        _setDroppablesActive = function(dd, val, andHover) {
            for (var i = 0; i < dd.length; i++) {
                dd[i].setActive(val);
                if (val) dd[i].updatePosition();
                if (andHover) dd[i].setHover(val);
            }
        };
        
    var Super = function(el, params) {
        var enabled = true;
        this.scopes = params.scope ? params.scope.split(/\s+/) : [ _scope ];        
        this.setEnabled = function(e) { enabled = e; };
        this.isEnabled = function() { return enabled; };
    };
    
    // 
    var Drag = function(el, params) {
        Super.apply(this, arguments);
        var downAt = [0,0], down= false, posAtDown = null,
            constrain = params.constrain || function(pos) { return pos; },
            matchingDroppables, intersectingDroppables = [],
            downListener = function(e) {
                if (this.isEnabled()) {
                    downAt = _pageLocation(e);
                    posAtDown = params.getPosition(el);               
                    params.bind(document, "mousemove", moveListener);
                    params.bind(document, "mouseup", upListener);
                    down = true;
                    matchingDroppables = _getMatchingDroppables(this);
                    _setDroppablesActive(matchingDroppables, true);
                    this.size = params.getSize(el);
                    params.addClass(el, params.dragClass || _dragClass);
                    params.addClass(document.body, _no_select_class);
                    params.fireEvent("start", el, posAtDown, e);
                }
            }.bind(this),
            moveListener = function(e) {
                if (down) {
                    intersectingDroppables.length = 0;
                    var pos = _pageLocation(e),
                        dx = pos[0] - downAt[0],
                        dy = pos[1] - downAt[1],
                        cPos = constrain([posAtDown[0] + dx, posAtDown[1] + dy]),
                        rect = { x:cPos[0], y:cPos[1], w:this.size[0], h:this.size[1]};
                                            
                    params.setPosition(el, cPos);
                    for (var i = 0; i < matchingDroppables.length; i++) {
                        var r2 = { x:matchingDroppables[i].position[0], y:matchingDroppables[i].position[1], w:matchingDroppables[i].size[0], h:matchingDroppables[i].size[1]};
                        if (jsPlumbGeom.intersects(rect, r2) && matchingDroppables[i].canDrop(this)) {
                            intersectingDroppables.push(matchingDroppables[i]);
                            matchingDroppables[i].setHover(this, true);
                        }
                        else
                            matchingDroppables[i].setHover(this, false);
                    }
                    params.fireEvent("drag", el, cPos, e);
                }                
            }.bind(this),
            upListener = function(e) {                
                down = false;
                params.unbind(document, moveListener);
                params.unbind(document, upListener);
                params.removeClass(el, params.dragClass || _dragClass);
                params.removeClass(document.body, _no_select_class);
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
        
        _registerByScope(this, _dragsByScope);
    };
    
    var Drop = function(el, params) {
        Super.apply(this, arguments);
        _registerByScope(this, _dropsByScope);
        
        this.setActive = function(val) {
            params[val ? "addClass" : "removeClass"](el, _activeClass);
        };
        
        this.updatePosition = function() {
            this.position = params.getPosition(el);
            this.size = params.getSize(el);
        };
        
        this.canDrop = function(drag) {
           return true; // TODO
        };
        
        this.setHover = function(drag, val) {
            params[val ? "addClass" : "removeClass"](el, _hoverClass);
        };
        
        this.drop = function(drag, event) {
            params.fireEvent("drop", { drag:drag, event:event });
        };
    };       
        
    this.Katavorio = function(katavorioParams) {        
        var _prepareParams = function(p) {
            p = p || {};
            var _p = {};            
            for (var i in katavorioParams) _p[i] = katavorioParams[i];
            for (var i in p) _p[i] = p[i];                
            return _p;
        };
        
        this.draggable = function(el, params) {
            // TODO
            new Drag(el, _prepareParams(params));
        };
        
        this.droppable = function(el, params) {
            // TODO
            new Drop(el, _prepareParams(params));
        };    
        
    };
        
}).call(this);