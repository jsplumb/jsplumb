/*
 * jsPlumb
 * 
 * Title:jsPlumb 1.5.3
 * 
 * Provides a way to visually connect elements on an HTML page, using either SVG, Canvas
 * elements, or VML.  
 * 
 * This file contains the jsPlumb connector editors.  It is not deployed wth the released versions of jsPlumb; you need to
 * include it as an extra script.
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
    
    var AbstractEditor = function(params) {
        var self = this;        
    };
    
    // TODO: this is for a Straight segment.it would be better to have these all available somewjere, keyed
    // by segment type
    var findClosestPointOnPath = function(seg, x, y, i, bounds) {
        var m = seg[0] == seg[2] ? Infinity : 0,
            m2 = -1 / m,
            out = { s:seg, m:m, i:i, x:-1, y:-1, d:Infinity };
        
        if (m == 0) {
            // a horizontal line. if x is in the range of this line then distance is delta y. otherwise we consider it to be
            // infinity.
            if ( (seg[0] <= x && x <= seg[2]) || (seg[2] <= x && x <= seg[0])) {
                out.x = x,
                out.y = seg[1];
                out.d = Math.abs(y - seg[1]);
            }
        }
        else if (m == Infinity || m == -Infinity) {
            // a vertical line. if y is in the range of this line then distance is delta x. otherwise we consider it to be
            // infinity.
            if ((seg[1] <= y && y <= seg[3]) || (seg[3] <= y && y <= seg[1])){
                out.x = seg[0];
                out.y = y;
                out.d = Math.abs(x - seg[0]);
            }                        
        }
        else {
            // closest point lies on normal from given point to this line.  
            var b = seg[1] - (m * seg[0]),
                b2 = y - (m2 * x),
            // now we know that
            // y1 = m.x1 + b   and   y1 = m2.x1 + b2
            // so:  m.x1 + b = m2.x1 + b2
            //      x1(m - m2) = b2 - b
            //      x1 = (b2 - b) / (m - m2)
                _x1 = (b2 -b) / (m - m2),
                _y1 = (m * _x1) + b,
                d = jsPlumbGeom.lineLength([ x, y ], [ _x1, _y1 ]),
                fractionInSegment = jsPlumbGeom.lineLength([ _x1, _y1 ], [ seg[0], seg[1] ]);
            
            out.d = d;
            out.x = _x1;
            out.y = _y1;
            out.l = fractionInSegment / length;
        }
        return out;
    };
    
    /**
    * @namespace jsPlumb.ConnectorEditors
    * @desc These are editors for the various connector types. They are not included in the
    * main jsPlumb release. To use them you have to build a custom version of jsPlumb - see
    * the Gruntfile for information on how to do that. 
    *
    * Currently there is only an editor for the Flowchart connector.
    */
    jsPlumb.ConnectorEditors = {
        /**
        * @name jsPlumb.ConnectorEditors.FlowchartConnectorEditor
        * @class
        * @classdesc Lets you drag the segments of a flowchart connection around. If you subsequently
        * drag an element, your edits are lost.
        */
        "Flowchart":function(params) {
            AbstractEditor.apply(this, arguments);            
            
            var jpcl = jsPlumb.CurrentLibrary,
                documentMouseUp = function(e) {                     
                    jpcl.removeClass(document.body, params.connection._jsPlumb.instance.dragSelectClass);
                    params.connection._jsPlumb.instance.setConnectionBeingDragged(false);
                    e.stopPropagation();
                    e.preventDefault();
                    jpcl.unbind(document, "mouseup", documentMouseUp);
                    jpcl.unbind(document, "mousemove", documentMouseMove);                    
                    downAt = null;
                    currentSegments = null;
                    selectedSegment = null; 
                    segmentCoords = null;
                    params.connection.setHover(false);                    
                    params.connector.setSuspendEvents(false); 
                    params.connection.endpoints[0].setSuspendEvents(false);                
                    params.connection.endpoints[1].setSuspendEvents(false);
                    params.connection.editCompleted();
                    params.connector.justEdited = editing;
                    editing = false;
                },
                downAt = null,
                currentSegments = null,
                selectedSegment = null,
                segmentCoords = null,
                editing = false,
                anchorsMoveable = params.params.anchorsMoveable,
                sgn = function(p1, p2) {
                    if (p1[0] == p2[0])
                        return p1[1] < p2[1]  ? 1 : -1;
                    else
                        return p1[0] < p2[0]  ? 1 : -1;
                },
                // collapses currentSegments by joining subsequent segments that are in the
                // same axis. we do this because it doesn't matter about stubs any longer once a user
                // is editing a connector. so it is best to reduce the number of segments to the 
                // minimum.
                _collapseSegments = function() {                       
                    var _last = null, _lastAxis = null, s = [];
                    for (var i = 0; i < currentSegments.length; i++) {
                        var seg = currentSegments[i], axis = seg[4], axisIndex = (axis == "v" ? 3 : 2);
                        if (_last != null && _lastAxis === axis) {
                            _last[axisIndex] = seg[axisIndex];                            
                        }
                        else {
                            s.push(seg);
                            _last = seg;
                            _lastAxis = seg[4];
                        }
                    }
                    currentSegments = s;                   
                },
                // attempt to shift anchor
                _shiftAnchor = function(endpoint, horizontal, value) {                    
                    var elementSize = jpcl.getSize(endpoint.element),
                        sizeValue = elementSize[horizontal ? 1 : 0],
                        ee = jpcl.getElementObject(endpoint.element),
                        off = jpcl.getOffset(ee), 
                        cc = jpcl.getElementObject(params.connector.canvas.parentNode),
                        co = jpcl.getOffset(cc),
                        offValue = off[horizontal ? "top" : "left"] - co[horizontal ? "top" : "left"], 
                        ap = endpoint.anchor.getCurrentLocation({element:endpoint}),
                        desiredLoc = horizontal ? params.connector.y + value : params.connector.x + value;
                    
                    if (anchorsMoveable) {                        
                        
                        if (offValue < desiredLoc && desiredLoc < offValue + sizeValue) {
                            // if still on the element, okay to move.
                            var udl = [ ap[0], ap[1] ];
                            ap[horizontal ? 1 : 0] = desiredLoc;
                            endpoint.anchor.setUserDefinedLocation(ap);
                            return value;
                        }
                        else {                        
                            // otherwise, clamp to element edge
                            var edgeVal = desiredLoc < offValue ? offValue : offValue + sizeValue;
                            return edgeVal - (horizontal ? params.connector.y: params.connector.x);                         
                        }                    
                    }
                    else {
                        // otherwise, return the current anchor point.
                        return ap[horizontal ? 1 : 0] - params.connector[horizontal ? "y" : "x"];
                    }
                },
                _updateSegmentOrientation = function(seg) {
                    if (seg[0] != seg[2]) seg[5] = (seg[0] < seg[2]) ? 1 : -1;
                    if (seg[1] != seg[3]) seg[6] = (seg[1] < seg[3]) ? 1 : -1;
                },
                documentMouseMove = function(e) {
                    if (selectedSegment != null) {
                        // suspend events on first move.
                        if (!editing) {
                            params.connection.setHover(true);
                            params.connector.setSuspendEvents(true);
                            params.connection.endpoints[0].setSuspendEvents(true);                
                            params.connection.endpoints[1].setSuspendEvents(true);
                        }
                        editing = true;
                        var m = selectedSegment.m, s = selectedSegment.s,
                            x = (e.pageX || e.page.x), y = (e.pageY || e.page.y),
                            dx = m == 0 ? 0 : x - downAt[0], dy = m == 0 ? y - downAt[1] : 0,
                            newX1 = segmentCoords[0] + dx,
                            newY1 = segmentCoords[1] + dy,
                            newX2 = segmentCoords[2] + dx,
                            newY2 = segmentCoords[3] + dy,
                            horizontal = s[4] == "h";
                        
                        // so here we know the new x,y values we would like to set for the start
                        // and end of this segment. but we may not be able to set these values: if this
                        // is the first segment, for example, then we are constrained by how far the anchor
                        // can move (before it slides off its element). same thing goes if this is the last
                        // segment. if this is not the first or last segment then there are other considerations.
                        // we know, from having run collapse segments, that there will never be two
                        // consecutive segments that are not at right angles to each other, so what we need to
                        // know is whether we can adjust the endpoint of the previous segment to the values we
                        // want, and the same question for the start values of the next segment.  the answer to
                        // that is whether or not the segment in question would be rendered too small by such
                        // a change. if that is the case (and the same goes for anchors) then we want to know
                        // what an agreeable value is, and we use that.
                        
                        if (selectedSegment.i == 0) {
                                                        
                            var anchorLoc = _shiftAnchor(params.connection.endpoints[0], horizontal, horizontal ? newY1 : newX1);                            
                            if (horizontal) 
                                newY1 = newY2 = anchorLoc; 
                            else
                                newX1 = newX2 = anchorLoc;
                        
                            currentSegments[1][0] = newX2;
                            currentSegments[1][1] = newY2;
                            _updateSegmentOrientation(currentSegments[1]);                                                                                            
                        }
                        else if (selectedSegment.i == currentSegments.length - 1) {
                            var anchorLoc = _shiftAnchor(params.connection.endpoints[1], horizontal, horizontal ? newY1 : newX1);                          
                            if (horizontal) 
                                newY1 = newY2 = anchorLoc; 
                            else
                                newX1 = newX2 = anchorLoc;
                            
                            currentSegments[currentSegments.length - 2][2] = newX1;
                            currentSegments[currentSegments.length - 2][3] = newY1;
                            _updateSegmentOrientation(currentSegments[currentSegments.length - 2]);
                        }
                        else {
                            if (!horizontal) {
                                currentSegments[selectedSegment.i - 1][2] = newX1;
                                currentSegments[selectedSegment.i + 1][0] = newX2;                                                                
                            }
                            else {
                                currentSegments[selectedSegment.i - 1][3] = newY1;                            
                                currentSegments[selectedSegment.i + 1][1] = newY2;
                            }
                            _updateSegmentOrientation(currentSegments[selectedSegment.i + 1]);
                            _updateSegmentOrientation(currentSegments[selectedSegment.i - 1]);                            
                        }
                                                                                                
                        s[0] = newX1;
                        s[1] = newY1;
                        s[2] = newX2;
                        s[3] = newY2;                                              
                        
                        params.connector.setSegments(currentSegments);
                        params.connection.repaint();                        
                        params.connection.endpoints[0].repaint();
                        params.connection.endpoints[1].repaint();
                        params.connector.setEdited(true);                        
                    }
                    else
                        editing = false;
                };
                        
            //bind to mousedown and mouseup, for editing
            params.connector.bind("mousedown", function(c, e) {
                var x = (e.pageX || e.page.x),
                    y = (e.pageY || e.page.y),
                    oe = jpcl.getElementObject(params.connection.getConnector().canvas),
                    o = jpcl.getOffset(oe),                    
                    minD = Infinity;
                
                currentSegments = params.connector.getOriginalSegments();
                _collapseSegments();
                for (var i = 0; i < currentSegments.length; i++) {                    
                    var _s = findClosestPointOnPath(currentSegments[i], (x - o.left) , (y - o.top), i, params.connector.bounds);
                    if (_s.d < minD) {
                        selectedSegment = _s;
                        segmentCoords = [ _s.s[0], _s.s[1], _s.s[2], _s.s[3] ]; // copy the coords at mousedown
                        minD = _s.d;
                    }
                }
                
                downAt = [ x, y ];
                
                if (selectedSegment != null) {                    
                    jpcl.bind(document, "mouseup", documentMouseUp);
                    jpcl.bind(document, "mousemove", documentMouseMove);                                      
                    jpcl.addClass(document.body, params.connection._jsPlumb.instance.dragSelectClass);
                    params.connection._jsPlumb.instance.setConnectionBeingDragged(true);
                    params.connection.editStarted();                
                    return false;
                }
            }, true);
        }
    };

    jsPlumb.Connectors.AbstractConnector.prototype.shouldFireEvent = function(type, value, originalEvent) {
        var out = !this.justEdited;
        if (type == "click") {            
            this.justEdited = false;
        }
        return out;
    };
        
})();