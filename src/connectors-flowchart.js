/*
 * jsPlumb
 * 
 * Title:jsPlumb 1.6.4
 * 
 * Provides a way to visually connect elements on an HTML page, using SVG or VML.  
 * 
 * This file contains the 'flowchart' connectors, consisting of vertical and horizontal line segments.
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
   
    /**
     * Function: Constructor
     * 
     * Parameters:
     * 	stub - minimum length for the stub at each end of the connector. This can be an integer, giving a value for both ends of the connections, 
     * or an array of two integers, giving separate values for each end. The default is an integer with value 30 (pixels). 
     *  gap  - gap to leave between the end of the connector and the element on which the endpoint resides. if you make this larger than stub then you will see some odd looking behaviour.  
                Like stub, this can be an array or a single value. defaults to 0 pixels for each end.     
     * cornerRadius - optional, defines the radius of corners between segments. defaults to 0 (hard edged corners).
     * alwaysRespectStubs - defaults to false. whether or not the connectors should always draw the stub, or, if the two elements
                            are in close proximity to each other (closer than the sum of the two stubs), to adjust the stubs.
     */
    var Flowchart = function(params) {
        this.type = "Flowchart";
        params = params || {};
        params.stub = params.stub == null ? 30 : params.stub;
        var self = this,
            _super =  jsPlumb.Connectors.AbstractConnector.apply(this, arguments),		
            midpoint = params.midpoint == null ? 0.5 : params.midpoint,
            points = [], segments = [],
            grid = params.grid,
            alwaysRespectStubs = params.alwaysRespectStubs,
            userSuppliedSegments = null,
            lastx = null, lasty = null, lastOrientation,	
            cornerRadius = params.cornerRadius != null ? params.cornerRadius : 0,	
            sgn = function(n) { return n < 0 ? -1 : n === 0 ? 0 : 1; },            
            /**
             * helper method to add a segment.
             */
            addSegment = function(segments, x, y, paintInfo) {
                if (lastx == x && lasty == y) return;
                var lx = lastx == null ? paintInfo.sx : lastx,
                    ly = lasty == null ? paintInfo.sy : lasty,
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
            updateMinMax = function(a1) {
                self.bounds.minX = Math.min(self.bounds.minX, a1[2]);
                self.bounds.maxX = Math.max(self.bounds.maxX, a1[2]);
                self.bounds.minY = Math.min(self.bounds.minY, a1[3]);
                self.bounds.maxY = Math.max(self.bounds.maxY, a1[3]);    
            },
            writeSegments = function(conn, segments, paintInfo) {
                var current, next;                
                for (var i = 0; i < segments.length - 1; i++) {
                    
                    current = current || _cloneArray(segments[i]);
                    next = _cloneArray(segments[i + 1]);
                    if (cornerRadius > 0 && current[4] != next[4]) {
                        var radiusToUse = Math.min(cornerRadius, segLength(current), segLength(next));
                        // right angle. adjust current segment's end point, and next segment's start point.
                        current[2] -= current[5] * radiusToUse;
                        current[3] -= current[6] * radiusToUse;
                        next[0] += next[5] * radiusToUse;
                        next[1] += next[6] * radiusToUse;														                         			
                        var ac = (current[6] == next[5] && next[5] == 1) ||
                                 ((current[6] == next[5] && next[5] === 0) && current[5] != next[6]) ||
                                 (current[6] == next[5] && next[5] == -1),
                            sgny = next[1] > current[3] ? 1 : -1,
                            sgnx = next[0] > current[2] ? 1 : -1,
                            sgnEqual = sgny == sgnx,
                            cx = (sgnEqual && ac || (!sgnEqual && !ac)) ? next[0] : current[2],
                            cy = (sgnEqual && ac || (!sgnEqual && !ac)) ? current[3] : next[1];                                                        
                        
                        _super.addSegment(conn, "Straight", {
                            x1:current[0], y1:current[1], x2:current[2], y2:current[3]
                        });
                            
                        _super.addSegment(conn, "Arc", {
                            r:radiusToUse, 
                            x1:current[2], 
                            y1:current[3], 
                            x2:next[0], 
                            y2:next[1],
                            cx:cx,
                            cy:cy,
                            ac:ac
                        });	                                            
                    }
                    else {                 
                        // dx + dy are used to adjust for line width.
                        var dx = (current[2] == current[0]) ? 0 : (current[2] > current[0]) ? (paintInfo.lw / 2) : -(paintInfo.lw / 2),
                            dy = (current[3] == current[1]) ? 0 : (current[3] > current[1]) ? (paintInfo.lw / 2) : -(paintInfo.lw / 2);
                        _super.addSegment(conn, "Straight", {
                            x1:current[0]- dx, y1:current[1]-dy, x2:current[2] + dx, y2:current[3] + dy
                        });
                    }                    
                    current = next;
                }
                if (next != null) {
                    // last segment
                    _super.addSegment(conn, "Straight", {
                        x1:next[0], y1:next[1], x2:next[2], y2:next[3]
                    });                             
                }
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
                writeSegments(this, userSuppliedSegments, paintInfo);                
                return;
            }
            
            segments = [];
            lastx = null; lasty = null;
            lastOrientation = null;          
            
            var midx = paintInfo.startStubX + ((paintInfo.endStubX - paintInfo.startStubX) * midpoint),
                midy = paintInfo.startStubY + ((paintInfo.endStubY - paintInfo.startStubY) * midpoint);                                                                                                    
    
            var findClearedLine = function(start, mult, anchorPos, dimension) {
                    return start + (mult * (( 1 - anchorPos) * dimension) + _super.maxStub);
                },
                orientations = { x:[ 0, 1 ], y:[ 1, 0 ] },
                commonStubCalculator = function(axis) {
                    return [ paintInfo.startStubX, paintInfo.startStubY, paintInfo.endStubX, paintInfo.endStubY ];                    
                },
                stubCalculators = {
                    perpendicular:commonStubCalculator,
                    orthogonal:commonStubCalculator,
                    opposite:function(axis) {  
                        var pi = paintInfo,
                            idx = axis == "x" ? 0 : 1, 
                            areInProximity = {
                                "x":function() {                                    
                                    return ( (pi.so[idx] == 1 && ( 
                                        ( (pi.startStubX > pi.endStubX) && (pi.tx > pi.startStubX) ) ||
                                        ( (pi.sx > pi.endStubX) && (pi.tx > pi.sx))))) ||

                                        ( (pi.so[idx] == -1 && ( 
                                            ( (pi.startStubX < pi.endStubX) && (pi.tx < pi.startStubX) ) ||
                                            ( (pi.sx < pi.endStubX) && (pi.tx < pi.sx)))));
                                },
                                "y":function() {                                     
                                    return ( (pi.so[idx] == 1 && ( 
                                        ( (pi.startStubY > pi.endStubY) && (pi.ty > pi.startStubY) ) ||
                                        ( (pi.sy > pi.endStubY) && (pi.ty > pi.sy))))) ||

                                        ( (pi.so[idx] == -1 && ( 
                                        ( (pi.startStubY < pi.endStubY) && (pi.ty < pi.startStubY) ) ||
                                        ( (pi.sy < pi.endStubY) && (pi.ty < pi.sy)))));
                                }
                            };

                        if (!alwaysRespectStubs && areInProximity[axis]()) {                   
                            return {
                                "x":[(paintInfo.sx + paintInfo.tx) / 2, paintInfo.startStubY, (paintInfo.sx + paintInfo.tx) / 2, paintInfo.endStubY],
                                "y":[paintInfo.startStubX, (paintInfo.sy + paintInfo.ty) / 2, paintInfo.endStubX, (paintInfo.sy + paintInfo.ty) / 2]
                            }[axis];
                        }
                        else {
                            return [ paintInfo.startStubX, paintInfo.startStubY, paintInfo.endStubX, paintInfo.endStubY ];   
                        }
                    }
                },
                lineCalculators = {
                    perpendicular : function(axis, ss, oss, es, oes) {
                        var pi = paintInfo, 
                            sis = {
                                x:[ [ [ 1,2,3,4 ], null, [ 2,1,4,3 ] ], null, [ [ 4,3,2,1 ], null, [ 3,4,1,2 ] ] ],
                                y:[ [ [ 3,2,1,4 ], null, [ 2,3,4,1 ] ], null, [ [ 4,1,2,3 ], null, [ 1,4,3,2 ] ] ]
                            },
                            stubs = { 
                                x:[ [ pi.startStubX, pi.endStubX ] , null, [ pi.endStubX, pi.startStubX ] ],
                                y:[ [ pi.startStubY, pi.endStubY ] , null, [ pi.endStubY, pi.startStubY ] ]
                            },
                            midLines = {
                                x:[ [ midx, pi.startStubY ], [ midx, pi.endStubY ] ],
                                y:[ [ pi.startStubX, midy ], [ pi.endStubX, midy ] ]
                            },
                            linesToEnd = {
                                x:[ [ pi.endStubX, pi.startStubY ] ],
                                y:[ [ pi.startStubX, pi.endStubY ] ]
                            },
                            startToEnd = {
                                x:[ [ pi.startStubX, pi.endStubY ], [ pi.endStubX, pi.endStubY ] ],        
                                y:[ [ pi.endStubX, pi.startStubY ], [ pi.endStubX, pi.endStubY ] ]
                            },
                            startToMidToEnd = {
                                x:[ [ pi.startStubX, midy ], [ pi.endStubX, midy ], [ pi.endStubX, pi.endStubY ] ],
                                y:[ [ midx, pi.startStubY ], [ midx, pi.endStubY ], [ pi.endStubX, pi.endStubY ] ]
                            },
                            otherStubs = {
                                x:[ pi.startStubY, pi.endStubY ],
                                y:[ pi.startStubX, pi.endStubX ]                                    
                            },
                            soIdx = orientations[axis][0], toIdx = orientations[axis][1],
                            _so = pi.so[soIdx] + 1,
                            _to = pi.to[toIdx] + 1,
                            otherFlipped = (pi.to[toIdx] == -1 && (otherStubs[axis][1] < otherStubs[axis][0])) || (pi.to[toIdx] == 1 && (otherStubs[axis][1] > otherStubs[axis][0])),
                            stub1 = stubs[axis][_so][0],
                            stub2 = stubs[axis][_so][1],
                            segmentIndexes = sis[axis][_so][_to];

                        if (pi.segment == segmentIndexes[3] || (pi.segment == segmentIndexes[2] && otherFlipped)) {
                            return midLines[axis];       
                        }
                        else if (pi.segment == segmentIndexes[2] && stub2 < stub1) {
                            return linesToEnd[axis];
                        }
                        else if ((pi.segment == segmentIndexes[2] && stub2 >= stub1) || (pi.segment == segmentIndexes[1] && !otherFlipped)) {
                            return startToMidToEnd[axis];
                        }
                        else if (pi.segment == segmentIndexes[0] || (pi.segment == segmentIndexes[1] && otherFlipped)) {
                            return startToEnd[axis];  
                        }                                
                    },
                    orthogonal : function(axis, startStub, otherStartStub, endStub, otherEndStub) {                    
                        var pi = paintInfo,                                            
                            extent = {
                                "x":pi.so[0] == -1 ? Math.min(startStub, endStub) : Math.max(startStub, endStub),
                                "y":pi.so[1] == -1 ? Math.min(startStub, endStub) : Math.max(startStub, endStub)
                            }[axis];
                                                
                        return {
                            "x":[ [ extent, otherStartStub ],[ extent, otherEndStub ], [ endStub, otherEndStub ] ],
                            "y":[ [ otherStartStub, extent ], [ otherEndStub, extent ], [ otherEndStub, endStub ] ]
                        }[axis];                    
                    },
                    opposite : function(axis, ss, oss, es, oes) {                                                
                        var pi = paintInfo,
                            otherAxis = {"x":"y","y":"x"}[axis], 
                            dim = {"x":"height","y":"width"}[axis],
                            comparator = pi["is" + axis.toUpperCase() + "GreaterThanStubTimes2"];

                        if (params.sourceEndpoint.elementId == params.targetEndpoint.elementId) {
                            var _val = oss + ((1 - params.sourceEndpoint.anchor[otherAxis]) * params.sourceInfo[dim]) + _super.maxStub;
                            return {
                                "x":[ [ ss, _val ], [ es, _val ] ],
                                "y":[ [ _val, ss ], [ _val, es ] ]
                            }[axis];
                            
                        }                                                        
                        else if (!comparator || (pi.so[idx] == 1 && ss > es) || (pi.so[idx] == -1 && ss < es)) {                                            
                            return {
                                "x":[[ ss, midy ], [ es, midy ]],
                                "y":[[ midx, ss ], [ midx, es ]]
                            }[axis];
                        }
                        else if ((pi.so[idx] == 1 && ss < es) || (pi.so[idx] == -1 && ss > es)) {
                            return {
                                "x":[[ midx, pi.sy ], [ midx, pi.ty ]],
                                "y":[[ pi.sx, midy ], [ pi.tx, midy ]]
                            }[axis];
                        }                        
                    }
                };

            var stubs = stubCalculators[paintInfo.anchorOrientation](paintInfo.sourceAxis),
                idx = paintInfo.sourceAxis == "x" ? 0 : 1,
                oidx = paintInfo.sourceAxis == "x" ? 1 : 0,                            
                ss = stubs[idx],
                oss = stubs[oidx],
                es = stubs[idx + 2],
                oes = stubs[oidx + 2];

            // add the start stub segment.
            addSegment(segments, stubs[0], stubs[1], paintInfo);           

            // compute the rest of the line
            var p = lineCalculators[paintInfo.anchorOrientation](paintInfo.sourceAxis, ss, oss, es, oes);            
            if (p) {
                for (var i = 0; i < p.length; i++) {                	
                    addSegment(segments, p[i][0], p[i][1], paintInfo);
                }
            }          
            
            // line to end stub
            addSegment(segments, stubs[2], stubs[3], paintInfo);
    
            // end stub to end
            addSegment(segments, paintInfo.tx, paintInfo.ty, paintInfo);               
            
            writeSegments(this, segments, paintInfo);                            
        };	

        this.getPath = function() {
            var _last = null, _lastAxis = null, s = [], segs = userSuppliedSegments || segments;
            for (var i = 0; i < segs.length; i++) {
                var seg = segs[i], axis = seg[4], axisIndex = (axis == "v" ? 3 : 2);
                if (_last != null && _lastAxis === axis) {
                    _last[axisIndex] = seg[axisIndex];                            
                }
                else {
                    if (seg[0] != seg[2] || seg[1] != seg[3]) {
                        s.push({
                            start:[ seg[0], seg[1] ],
                            end:[ seg[2], seg[3] ]
                        });                    
                        _last = seg;
                        _lastAxis = seg[4];
                    }
                }
            }
            return s;
        };	

        this.setPath = function(path) {
            userSuppliedSegments = [];
            for (var i = 0; i < path.length; i++) {
                 var lx = path[i].start[0],
                    ly = path[i].start[1],
                    x = path[i].end[0],
                    y = path[i].end[1],
                    o = lx == x ? "v" : "h",
                    sgnx = sgn(x - lx),
                    sgny = sgn(y - ly);

                userSuppliedSegments.push([lx, ly, x, y, o, sgnx, sgny]);
            }
        };
    };

    jsPlumbUtil.extend(Flowchart, jsPlumb.Connectors.AbstractConnector);
    jsPlumb.registerConnectorType(Flowchart, "Flowchart");
})();