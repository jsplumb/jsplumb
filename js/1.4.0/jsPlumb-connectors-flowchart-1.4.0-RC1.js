/*
 * jsPlumb
 * 
 * Title:jsPlumb 1.4.0
 * 
 * Provides a way to visually connect elements on an HTML page, using either SVG, Canvas
 * elements, or VML.  
 * 
 * This file contains the 'flowchart' connectors, consisting of vertical and horizontal line segments.
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
   
    /**
     * Function: Constructor
     * 
     * Parameters:
     * 	stub - minimum length for the stub at each end of the connector. This can be an integer, giving a value for both ends of the connections, 
     * or an array of two integers, giving separate values for each end. The default is an integer with value 30 (pixels). 
     *  gap  - gap to leave between the end of the connector and the element on which the endpoint resides. if you make this larger than stub then you will see some odd looking behaviour.  
                Like stub, this can be an array or a single value. defaults to 0 pixels for each end.     
     * cornerRadius - optional, defines the radius of corners between segments. defaults to 0 (hard edged corners).
     */
    jsPlumb.Connectors.Flowchart = function(params) {
        this.type = "Flowchart";
        params = params || {};
        var self = this,
            _super =  jsPlumb.Connectors.AbstractConnector.apply(this, arguments),		
            midpoint = params.midpoint || 0.5,
            points = [], segments = [],
            grid = params.grid,
            userSuppliedSegments = null,
            lastx = -1, lasty = -1, lastOrientation,	
            cornerRadius = params.cornerRadius != null ? params.cornerRadius : 10,	
            sgn = function(n) { return n < 0 ? -1 : n == 0 ? 0 : 1; },
            minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity,
            /**
             * helper method to add a segment.
             */
            addSegment = function(segments, x, y, sx, sy) {
                // if segment would have length zero, dont add it.
                if (sx == lastx && sy == lasty) return;
                
                var lx = lastx == -1 ? sx : lastx,
                    ly = lasty == -1 ? sy : lasty,
                    o = lx == x ? "v" : "h",
                    sgnx = sgn(x - lx),
                    sgny = sgn(y - ly);
                    
                lastx = x;
                lasty = y;				    		                
                segments.push([lx, ly, x, y, o, sgnx, sgny]);				
            },
            segLength = function(s) {
                return Math.sqrt(Math.pow(s[0] - s[2], 2) + Math.pow(s[1] - s[3], 2));    
            },
            _cloneArray = function(a) { var _a = []; _a.push.apply(_a, a); return _a;},
            updateMinMax = function(a1, a2) {
                minX = Math.min(minX, a1[2], a2[0]);
                maxX = Math.max(maxX, a1[2], a2[0]);
                minY = Math.min(minY, a1[3], a2[1]);
                maxY = Math.max(maxY, a1[3], a2[1]);    
            },
            writeSegments = function(segments) {
                var current, next;
                minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                for (var i = 0; i < segments.length - 1; i++) {
                    current = current || _cloneArray(segments[i]);
                    next = _cloneArray(segments[i + 1]);
                    if (cornerRadius > 0 && current[4] != next[4]) {
                        var radiusToUse = Math.min(cornerRadius, segLength(current), segLength(next));
                        // right angle! adjust current segment's end point, and next segment's start point.
                        current[2] -= current[5] * radiusToUse;
                        current[3] -= current[6] * radiusToUse;
                        next[0] += next[5] * radiusToUse;
                        next[1] += next[6] * radiusToUse;														                         			
                        var ac = (current[6] == next[5] && next[5] == 1) ||
                                 ((current[6] == next[5] && next[5] == 0) && current[5] != next[6]) ||
                                 (current[6] == next[5] && next[5] == -1),
                            sgny = next[1] > current[3] ? 1 : -1,
                            sgnx = next[0] > current[2] ? 1 : -1,
                            sgnEqual = sgny == sgnx,
                            cx = (sgnEqual && ac || (!sgnEqual && !ac)) ? next[0] : current[2],
                            cy = (sgnEqual && ac || (!sgnEqual && !ac)) ? current[3] : next[1];                                                        
                        
                        _super.addSegment("Straight", {
                            x1:current[0], y1:current[1], x2:current[2], y2:current[3]
                        });
                            
                        _super.addSegment("Arc", {
                            r:radiusToUse, 
                            x1:current[2], 
                            y1:current[3], 
                            x2:next[0], 
                            y2:next[1],
                            cx:cx,
                            cy:cy,
                            ac:ac
                        });	
                        
                        updateMinMax(current, next);
                    }
                    else {
                        _super.addSegment("Straight", {
                            x1:current[0], y1:current[1], x2:current[2], y2:current[3]
                        });
                        
                        updateMinMax(current, current);
                    }
                    current = next;
                }
                // last segment
                _super.addSegment("Straight", {
                    x1:next[0], y1:next[1], x2:next[2], y2:next[3]
                });
                
                updateMinMax(next, next);
                
              //  console.log("MIN MAX FOR FLOWCHART", minX, minY, maxX, maxY);
            };
        
        this.setSegments = function(s) {
            userSuppliedSegments = s;
        };
        
        this.isEditable = function() { return true; };
        
        /*
            Function: getOriginalSegments
            Gets the segments before the addition of rounded corners. This is used by the flowchart
            connector editor, since it only wants to concern itself with the original segments.
        */
        this.getOriginalSegments = function() {
            return userSuppliedSegments || segments;
        };
        
        this._compute = function(paintInfo, params) {
            
            if (params.clearEdits)
                userSuppliedSegments = null;
            
            if (userSuppliedSegments != null) {
                writeSegments(userSuppliedSegments);
                return paintInfo.points;
            }
            
            segments = [];
            lastx = -1; lasty = -1;
            lastOrientation = null;          
            
            var midx = paintInfo.startStubX + ((paintInfo.endStubX - paintInfo.startStubX) * midpoint),
                midy = paintInfo.startStubY + ((paintInfo.endStubY - paintInfo.startStubY) * midpoint);
                                                                                         
            // add the start stub segment.
            addSegment(segments, paintInfo.startStubX, paintInfo.startStubY, paintInfo.sx, paintInfo.sy);			
    
            var findClearedLine = function(start, mult, anchorPos, dimension) {
                    return start + (mult * (( 1 - anchorPos) * dimension) + _super.maxStub);
                },
                orientations = { x:[ 0, 1 ], y:[ 1, 0 ] },
                perpendicular = function(axis) {
                    with (paintInfo) {
                        var sis = {
                            x:[ [ [ 1,2,3,4 ], null, [ 2,1,4,3 ] ], null, [ [ 4,3,2,1 ], null, [ 3,4,1,2 ] ] ],
                            y:[ [ [ 3,2,1,4 ], null, [ 2,3,4,1 ] ], null, [ [ 4,1,2,3 ], null, [ 1,4,3,2 ] ] ]
                        },
                        stubs = { 
                            x:[ [ startStubX, endStubX ] , null, [ endStubX, startStubX ] ],
                            y:[ [ startStubY, endStubY ] , null, [ endStubY, startStubY ] ]
                        },
                        midLines = {
                            x:[ [ midx, startStubY ], [ midx, endStubY ] ],
                            y:[ [ startStubX, midy ], [ endStubX, midy ] ]
                        },
                        linesToEnd = {
                            x:[ [ endStubX, startStubY ] ],
                            y:[ [ startStubX, endStubY ] ]
                        },
                        startToEnd = {
                            x:[ [ startStubX, endStubY ], [ endStubX, endStubY ] ],        
                            y:[ [ endStubX, startStubY ], [ endStubX, endStubY ] ]
                        },
                        startToMidToEnd = {
                            x:[ [ startStubX, midy ], [ endStubX, midy ], [ endStubX, endStubY ] ],
                            y:[ [ midx, startStubY ], [ midx, endStubY ], [ endStubX, endStubY ] ]
                        },
                        otherStubs = {
                            x:[ startStubY, endStubY ],
                            y:[ startStubX, endStubX ]                                    
                        },
                                    
                        soIdx = orientations[axis][0], toIdx = orientations[axis][1],
                        _so = so[soIdx] + 1,
                        _to = to[toIdx] + 1,
                        otherFlipped = (to[toIdx] == -1 && (otherStubs[axis][1] < otherStubs[axis][0])) || (to[toIdx] == 1 && (otherStubs[axis][1] > otherStubs[axis][0])),
                        stub1 = stubs[axis][_so][0],
                        stub2 = stubs[axis][_so][1],
                        segmentIndexes = sis[axis][_so][_to];
                        
                        if (segment == segmentIndexes[3] || (segment == segmentIndexes[2] && otherFlipped)) {
                            return midLines[axis];       
                        }
                        else if (segment == segmentIndexes[2] && stub2 < stub1) {
                            return linesToEnd[axis];
                        }
                        else if ((segment == segmentIndexes[2] && stub2 >= stub1) || (segment == segmentIndexes[1] && !otherFlipped)) {
                            return startToMidToEnd[axis];
                        }
                        else if (segment == segmentIndexes[0] || (segment == segmentIndexes[1] && otherFlipped)) {
                            return startToEnd[axis];  
                        }                                
                    }                                
                },
                orthogonal = function(axis) {                    
                    var pi = paintInfo,                                            
                        extent = {
                            "x":pi.so[0] == -1 ? Math.min(pi.startStubX, pi.endStubX) : Math.max(pi.startStubX, pi.endStubX),
                            "y":pi.so[1] == -1 ? Math.min(pi.startStubY, pi.endStubY) : Math.max(pi.startStubY, pi.endStubY)
                        }[axis];
                                            
                    return {
                        "x":[ [ extent, pi.startStubY ],[ extent, pi.endStubY ], [ pi.endStubX, pi.endStubY ] ],
                        "y":[ [ pi.startStubX, extent ], [ pi.endStubX, extent ],[ pi.endStubX, pi.endStubY ] ]
                    }[axis];                    
                },
                lineCalculators = {
                    oppositex : function() {
                        with (paintInfo) {        
                        // WORKS ALWAYS
                            if (params.sourceEndpoint.elementId == params.targetEndpoint.elementId) {
                                var _y = startStubY + ((1 - sourceAnchor.y) * sourceInfo.height) + _super.maxStub;
                                return [ [ startStubX, _y ], [ endStubX, _y ]];
                            }                                                        
                            else if (!isXGreaterThanStubTimes2 || (so[0] == 1 && startStubX > endStubX)
                               || (so[0] == -1 && startStubX < endStubX)) {
                                return [[ startStubX, midy ], [ endStubX, midy ]];                                            
                            }
                            else if ((so[0] == 1 && startStubX < endStubX) || (so[0] == -1 && startStubX > endStubX)) {
                                return [[ midx, sy ], [ midx, ty ]];
                            }
                        }
                    },
                    orthogonalx : function() {
                        return orthogonal("x");
                    },
                    perpendicularx : function() { 
                        return perpendicular("x");                                                   
                    },
                    oppositey : function() {
                        with (paintInfo) {
                            if (params.sourceEndpoint.elementId == params.targetEndpoint.elementId) {
                                var _x = startStubX + ((1 - sourceAnchor.x) * sourceInfo.width) + _super.maxStub;
                                return [ [ _x, startStubY ], [ _x, endStubY ]];
                            }
                            else if (!isYGreaterThanStubTimes2 || (so[1] == 1 && startStubY > endStubY)
                               || (so[1] == -1 && startStubY < endStubY)) {
                                return [[ midx, startStubY ], [ midx, endStubY ]];                                            
                            }
                            else if ((so[1] == 1 && startStubY < endStubY) || (so[1] == -1 && startStubY > endStubY)) {
                                return [[ sx, midy ], [ tx, midy ]];
                            }
                        }
                    },
                    orthogonaly : function() {
                        return orthogonal("y");
                    },
                    perpendiculary : function() {    
                        return perpendicular("y");
                    }
                };       
                       
            var p = lineCalculators[paintInfo.anchorOrientation + paintInfo.sourceAxis]();
            if (p) {
                for (var i = 0; i < p.length; i++) {                	
                    addSegment(segments, p[i][0], p[i][1]);
                }
            }          
            
            addSegment(segments, paintInfo.endStubX, paintInfo.endStubY);
    
            // end stub
            addSegment(segments, paintInfo.tx, paintInfo.ty);               
            
            writeSegments(segments);            
            
            return paintInfo.points;
        };		
    };
})();