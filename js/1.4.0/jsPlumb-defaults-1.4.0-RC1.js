/*
 * jsPlumb
 * 
 * Title:jsPlumb 1.4.0
 * 
 * Provides a way to visually connect elements on an HTML page, using either SVG, Canvas
 * elements, or VML.  
 * 
 * This file contains the default Connectors, Endpoint and Overlay definitions.
 *
 * Copyright (c) 2010 - 2013 Simon Porritt (http://jsplumb.org)
 * 
 * http://jsplumb.org
 * http://github.com/sporritt/jsplumb
 * http://code.google.com/p/jsplumb
 * 
 * Dual licensed under the MIT and GPL2 licenses.
 */

;(function() {	
				
	/**
	 * 
	 * Helper class to consume unused mouse events by components that are DOM elements and
	 * are used by all of the different rendering modes.
	 * 
	 */
	jsPlumb.DOMElementComponent = function(params) {
		jsPlumb.jsPlumbUIComponent.apply(this, arguments);
		// when render mode is canvas, these functions may be called by the canvas mouse handler.  
		// this component is safe to pipe this stuff to /dev/null.
		this.mousemove = 
		this.dblclick  = 
		this.click = 
		this.mousedown = 
		this.mouseup = function(e) { };					
	};
	
	jsPlumb.Segments = {
        	
        /*
         * Class: AbstractSegment
         * A Connector is made up of 1..N Segments, each of which has a Type, such as 'Straight', 'Arc',
         * 'Bezier'. This is new from 1.4.0, and gives us a lot more flexibility when drawing connections: things such
         * as rounded corners for flowchart connectors, for example, or a straight line stub for Bezier connections, are
         * much easier to do now.
         *
         * A Segment is responsible for providing coordinates for painting it, and also must be able to report its length.
         * 
         */ 
        AbstractSegment : function(params) { 
            this.params = params;
            
            /**
            * Function: findClosestPointOnPath
            * Finds the closest point on this segment to the given [x, y], 
            * returning both the x and y of the point plus its distance from
            * the supplied point, and its location along the length of the
            * path inscribed by the segment.  This implementation returns
            * Infinity for distance and null values for everything else;
            * subclasses are expected to override.
            */
            this.findClosestPointOnPath = function(x, y) {
                return {
                    d:Infinity,
                    x:null,
                    y:null,
                    l:null
                };
            };
        },
        Straight : function(params) {
            var self = this,
                _super = jsPlumb.Segments.AbstractSegment.apply(this, arguments),
                length, m, m2, x1, x2, y1, y2,
                _recalc = function() {
                    length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                    m = jsPlumbUtil.gradient({x:x1, y:y1}, {x:x2, y:y2});
                    m2 = -1 / m;                
                };
                
            this.type = "Straight";
            
            self.getLength = function() { return length; };
            self.getGradient = function() { return m; };
                
            this.getCoordinates = function() {
                return { x1:x1,y1:y1,x2:x2,y2:y2 };
            };
            this.setCoordinates = function(coords) {
                x1 = coords.x1; y1 = coords.y1; x2 = coords.x2; y2 = coords.y2;
                _recalc();
            };
            this.setCoordinates({x1:params.x1, y1:params.y1, x2:params.x2, y2:params.y2});
            
            /**
             * returns the point on the connector's path that is 'location' along the length of the path, where 'location' is a decimal from
             * 0 to 1 inclusive. for the straight line connector this is simple maths.  for Bezier, not so much.
             */
             this.pointOnPath = function(location, absolute) {
                if (location == 0 && !absolute)
                    return { x:x1, y:y1 };
                else if (location == 1 && !absolute)
                    return { x:x2, y:y2 };
                else {
                    var l = absolute ? location > 0 ? location : length + location : location * length;
                    return jsPlumbUtil.pointOnLine({x:x1, y:y1}, {x:x2, y:y2}, l);
                }
            };
            
            /**
             * returns the gradient of the connector at the given point - which for us is constant.
             */
            this.gradientAtPoint = function(_) {
                return m;
            };
            
            /**
             * returns the point on the connector's path that is 'distance' along the length of the path from 'location', where 
             * 'location' is a decimal from 0 to 1 inclusive, and 'distance' is a number of pixels.
             * this hands off to jsPlumbUtil to do the maths, supplying two points and the distance.
             */            
            this.pointAlongPathFrom = function(location, distance, absolute) {            
                var p = self.pointOnPath(location, absolute),
                    farAwayPoint = location == 1 ? {
                        x:x1 + ((x2 - x1) * 10),
                        y:y1 + ((y1 - y2) * 10)
                    } : distance <= 0 ? {x:x1, y:y1} : {x:x2, y:y2 };
    
                if (distance <= 0 && Math.abs(distance) > 1) distance *= -1;
    
                return jsPlumbUtil.pointOnLine(p, farAwayPoint, distance);
            };
            
            /**
                Function: findClosestPointOnPath
                Finds the closest point on this segment to [x,y]. See
                notes on this method in AbstractSegment.
            */
            this.findClosestPointOnPath = function(x, y) {
                if (m == 0) {
                    return {
                        x:x,
                        y:y1,
                        d:Math.abs(y - y1)
                    };
                }
                else if (m == Infinity || m == -Infinity) {
                    return {
                        x:x1,
                        y:y,
                        d:Math.abs(x - 1)
                    };
                }
                else {
                    // closest point lies on normal from given point to this line.  
                    var b = y1 - (m * x1),
                        b2 = y - (m2 * x),
                    // now we know that
                    // y1 = m.x1 + b
                    // and
                    // y1 = m2.x1 + b2
                    // so
                    // m.x1 + b = m2.x1 + b2
                    // x1(m - m2) = b2 - b
                    // x1 = (b2 - b) / (m - m2)
                        _x1 = (b2 -b) / (m - m2),
                        _y1 = (m * _x1) + b,
                        d = jsPlumbUtil.lineLength([ x, y ], [ _x1, _y1 ]),
                        fractionInSegment = jsPlumbUtil.lineLength([ _x1, _y1 ], [ x1, y1 ]);
                    
                    return {
                        d:d,
                        x:_x1,
                        y:_y1,
                        l:fractionInSegment / length
                    };            
                }
            };
        },
	
        /*
            Arc Segment. You need to supply:
    
            r   -   radius
            cx  -   center x for the arc
            cy  -   center y for the arc
            ac  -   whether the arc is anticlockwise or not. default is clockwise.
    
            and then either:
    
            startAngle  -   startAngle for the arc.
            endAngle    -   endAngle for the arc.
    
            or:
    
            x1          -   x for start point
            y1          -   y for start point
            x2          -   x for end point
            y2          -   y for end point
    
        */
        Arc : function(params) {
            var self = this,
                _super = jsPlumb.Segments.AbstractSegment.apply(this, arguments),
                _calcAngle = function(_x, _y) {
                    return jsPlumbUtil.theta([params.cx, params.cy], [_x, _y]);    
                },
                _calcAngleForLocation = function(location) {
                    if (self.anticlockwise) {
                        var sa = self.startAngle < self.endAngle ? self.startAngle + TWO_PI : self.startAngle,
                            s = Math.abs(sa - self.endAngle);
                        return sa - (s * location);                    
                    }
                    else {
                        var ea = self.endAngle < self.startAngle ? self.endAngle + TWO_PI : self.endAngle,
                            s = Math.abs (ea - self.startAngle);
                    
                        return self.startAngle + (s * location);
                    }
                },
                TWO_PI = 2 * Math.PI;
            
            this.radius = params.r;
            this.anticlockwise = params.ac;			
            this.type = "Arc";
                
            if (params.startAngle && params.endAngle) {
                this.startAngle = params.startAngle;
                this.endAngle = params.endAngle;            
                this.x1 = params.cx + (self.radius * Math.cos(params.startAngle));     
                this.y1 = params.cy + (self.radius * Math.sin(params.startAngle));            
                this.x2 = params.cx + (self.radius * Math.cos(params.endAngle));     
                this.y2 = params.cy + (self.radius * Math.sin(params.endAngle));                        
            }
            else {
                this.startAngle = _calcAngle(params.x1, params.y1);
                this.endAngle = _calcAngle(params.x2, params.y2);            
                this.x1 = params.x1;
                this.y1 = params.y1;
                this.x2 = params.x2;
                this.y2 = params.y2;            
            }
            
            if (this.endAngle < 0) this.endAngle += TWO_PI;
            if (this.startAngle < 0) this.startAngle += TWO_PI;        
            
            // we now have startAngle and endAngle as positive numbers, meaning the
            // absolute difference (|d|) between them is the sweep (s) of this arc, unless the
            // arc is 'anticlockwise' in which case 's' is given by 2PI - |d|.
            
            var ea = self.endAngle < self.startAngle ? self.endAngle + TWO_PI : self.endAngle;
            self.sweep = Math.abs (ea - self.startAngle);
            if (self.anticlockwise) self.sweep = TWO_PI - self.sweep;
            var circumference = 2 * Math.PI * self.radius,
                frac = self.sweep / TWO_PI,
                length = circumference * frac;
            
            this.getLength = function() {
                return length;
            };
            
            var VERY_SMALL_VALUE = 0.0000000001,
                gentleRound = function(n) {
                    var f = Math.floor(n), r = Math.ceil(n);
                    if (n - f < VERY_SMALL_VALUE) 
                        return f;    
                    else if (r - n < VERY_SMALL_VALUE)
                        return r;
                    return n;
                };
            
            /**
             * returns the point on the segment's path that is 'location' along the length of the path, where 'location' is a decimal from
             * 0 to 1 inclusive. 
             */
            this.pointOnPath = function(location, absolute) {            
                
                if (location == 0) {
                    return { x:self.x1, y:self.y1, theta:self.startAngle };    
                }
                else if (location == 1) {
                    return { x:self.x2, y:self.y2, theta:self.endAngle };                    
                }
                
                if (absolute) {
                    location = location / length;
                }
    
                var angle = _calcAngleForLocation(location),
                    _x = params.cx + (params.r * Math.cos(angle)),
                    _y  = params.cy + (params.r * Math.sin(angle));					
    
                return { x:gentleRound(_x), y:gentleRound(_y), theta:angle };
            };
            
            /**
             * returns the gradient of the segment at the given point.
             */
            this.gradientAtPoint = function(location, absolute) {
                var p = self.pointOnPath(location, absolute);
                var m = jsPlumbUtil.normal( [ params.cx, params.cy ], [p.x, p.y ] );
                if (!self.anticlockwise && (m == Infinity || m == -Infinity)) m *= -1;
                return m;
            };	              
                    
            this.pointAlongPathFrom = function(location, distance, absolute) {
                var p = self.pointOnPath(location, absolute),
                    arcSpan = distance / circumference * 2 * Math.PI,
                    startAngle = p.theta - arcSpan,				
                    startX = params.cx + (self.radius * Math.cos(startAngle)),
                    startY = params.cy + (self.radius * Math.sin(startAngle));	
    
                return {x:startX, y:startY};
            };		
        },
	
        Bezier : function(params) {
            var self = this,
                _super = jsPlumb.Segments.AbstractSegment.apply(this, arguments),
                curve = [	
                    { x:params.x1, y:params.y1},
                    { x:params.cp1x, y:params.cp1y },
                    { x:params.cp2x, y:params.cp2y },
                    { x:params.x2, y:params.y2 }
                ];
                
            this.type = "Bezier";            
            
            var _translateLocation = function(_curve, location, absolute) {
                if (absolute)
                    location = jsBezier.locationAlongCurveFrom(_curve, location > 0 ? 0 : 1, location);
    
                return location;
            };		
            
            /**
             * returns the point on the connector's path that is 'location' along the length of the path, where 'location' is a decimal from
             * 0 to 1 inclusive. 
             */
            this.pointOnPath = function(location, absolute) {
                location = _translateLocation(curve, location, absolute);
                return jsBezier.pointOnCurve(curve, location);
            };
            
            /**
             * returns the gradient of the connector at the given point.
             */
            this.gradientAtPoint = function(location, absolute) {
                location = _translateLocation(curve, location, absolute);
                return jsBezier.gradientAtPoint(curve, location);        	
            };	              
            
            this.pointAlongPathFrom = function(location, distance, absolute) {
                location = _translateLocation(curve, location, absolute);
                return jsBezier.pointAlongCurveFrom(curve, location, distance);
            };
            
            this.getLength = function() {
                return jsBezier.getLength(curve);				
            };
        }
    };
	
	/*
	 * Class: AbstractConnector
	 * Superclass for all Connectors; here is where Segments are managed.  This is exposed on jsPlumb just so it
	 * can be accessed from other files. You should not try to instantiate one of these directly.
	 *
	 * When this class is asked for a pointOnPath, or gradient etc, it must first figure out which segment to dispatch
	 * that request to. This is done by keeping track of the total connector length as segments are added, and also
	 * their cumulative ratios to the total length.  Then when the right segment is found it is a simple case of dispatching
	 * the request to it (and adjusting 'location' so that it is relative to the beginning of that segment.)
	 */ 
	jsPlumb.Connectors.AbstractConnector = function(params) {
		
		var self = this,
            segments = [],
            editing = false,
			totalLength = 0,
			segmentProportions = [],
			segmentProportionalLengths = [],        
            stub = params.stub || 0, 
            sourceStub = jsPlumbUtil.isArray(stub) ? stub[0] : stub,
            targetStub = jsPlumbUtil.isArray(stub) ? stub[1] : stub,
            gap = params.gap || 0,
            sourceGap = jsPlumbUtil.isArray(gap) ? gap[0] : gap,
            targetGap = jsPlumbUtil.isArray(gap) ? gap[1] : gap,
            userProvidedSegments = null,
            edited = false,
            paintInfo = null;
        
        // subclasses should override.
        this.isEditable = function() { return false; };                
        
        this.setEdited = function(ed) {
            edited = ed;
        };
        
        /**
        * Function: findSegmentForPoint
        * Returns the segment that is closest to the given [x,y],
        * null if nothing found.  This function returns a JS 
        * object with:
        *
        *   d   -   distance from segment
        *   l   -   proportional location in segment
        *   x   -   x point on the segment
        *   y   -   y point on the segment
        *   s   -   the segment itself.
        */ 
        this.findSegmentForPoint = function(x, y) {
            var out = { d:Infinity, s:null, x:null, y:null, l:null };
            for (var i = 0; i < segments.length; i++) {
                var _s = segments[i].findClosestPointOnPath(x, y);
                if (_s.d < out.d) {
                    out.d = _s.d; 
                    out.l = _s.l; 
                    out.x = _s.x;
                    out.y = _s.y; 
                    out.s = segments[i];
                }
            }
            
            return out;                
        };
			
		var _updateSegmentProportions = function() {
                var curLoc = 0;
                for (var i = 0; i < segments.length; i++) {
                    var sl = segments[i].getLength();
                    segmentProportionalLengths[i] = sl / totalLength;
                    segmentProportions[i] = [curLoc, (curLoc += (sl / totalLength)) ];
                }
            },
		
            /**
             * returns [segment, proportion of travel in segment, segment index] for the segment 
             * that contains the point which is 'location' distance along the entire path, where 
             * 'location' is a decimal between 0 and 1 inclusive. in this connector type, paths 
             * are made up of a list of segments, each of which contributes some fraction to
             * the total length. 
             * From 1.3.10 this also supports the 'absolute' property, which lets us specify a location
             * as the absolute distance in pixels, rather than a proportion of the total path. 
             */
            _findSegmentForLocation = function(location, absolute) {
                if (absolute) {
                    location = location > 0 ? location / totalLength : (totalLength + location) / totalLength;
                }
    
                var idx = segmentProportions.length - 1, inSegmentProportion = 1;
                //if (location < 1) {
                    for (var i = 0; i < segmentProportions.length; i++) {
                        if (segmentProportions[i][1] >= location) {
                            idx = i;
                            // todo is this correct for all connector path types?
                            inSegmentProportion = location == 1 ? 1 : location == 0 ? 0 : (location - segmentProportions[i][0]) / segmentProportionalLengths[i];                    
                            break;
                        }
                    }
                //}
                return { segment:segments[idx], proportion:inSegmentProportion, index:idx };
            },		
            _addSegment = function(type, params) {
                var s = new jsPlumb.Segments[type](params);
                segments.push(s);
                totalLength += s.getLength();			
            },					
            _clearSegments = function() {
                totalLength = 0;
                segments.splice(0, segments.length);
                segmentProportions.splice(0, segmentProportions.length);
                segmentProportionalLengths.splice(0, segmentProportionalLengths.length);
            };
        
        this.setSegments = function(_segs) {
            userProvidedSegments = [];
            totalLength = 0;
            for (var i = 0; i < _segs.length; i++) {      
                userProvidedSegments.push(_segs[i]);
                totalLength += _segs[i].getLength();			            
            }            
        };
        //if (params.segments) {
        //  this.setSegments(params.segments);
        //}        
        
        var _prepareCompute = function(params) {
            self.lineWidth = params.lineWidth;
            var segment = jsPlumbUtil.segment(params.sourcePos, params.targetPos),
                swapX = params.targetPos[0] < params.sourcePos[0],
                swapY = params.targetPos[1] < params.sourcePos[1],
                lw = params.lineWidth || 1,       
                sourceOffx = Math.max(params.minWidth, (lw / 2) + (sourceStub + targetStub)), 
                targetOffx = Math.max(params.minWidth, (lw / 2) + (targetStub + sourceStub)),                 
                sourceOffy = Math.max(params.minWidth, (lw / 2) + (sourceStub + targetStub)),
                targetOffy = Math.max(params.minWidth, (lw / 2) + (targetStub + sourceStub)),
                so = params.sourceAnchor.orientation || params.sourceAnchor.getOrientation(params.sourceEndpoint), 
                to = params.targetAnchor.orientation || params.targetAnchor.getOrientation(params.targetEndpoint),
                x = swapX ? params.targetPos[0] : params.sourcePos[0], 
                y = swapY ? params.targetPos[1] : params.sourcePos[1],
                w = Math.abs(params.targetPos[0] - params.sourcePos[0]) + sourceOffx + targetOffx, 
                h = Math.abs(params.targetPos[1] - params.sourcePos[1]) + sourceOffy + targetOffy;            
            
            // if either anchor does not have an orientation set, we derive one from their relative
            // positions.  we fix the axis to be the one in which the two elements are further apart, and
            // point each anchor at the other element.  this is also used when dragging a new connection.
            if (so[0] == 0 && so[1] == 0 || to[0] == 0 && to[1] == 0) {
                var index = w > h ? 0 : 1, oIndex = [1,0][index];
                so = []; to = [];
                so[index] = params.sourcePos[index] > params.targetPos[index] ? -1 : 1;
                to[index] = params.sourcePos[index] > params.targetPos[index] ? 1 : -1;
                so[oIndex] = 0; to[oIndex] = 0;
            }
            
            x -= sourceOffx; y -= sourceOffy;
            
            var sx = swapX ? (w - targetOffx) +(sourceGap * so[0])  : sourceOffx + (sourceGap * so[0]), 
                sy = swapY ? (h - targetOffy) + (sourceGap * so[1])  : sourceOffy + (sourceGap * so[1]), 
                tx = swapX ? sourceOffx + (targetGap * to[0]) : (w - targetOffx) + (targetGap * to[0]),
                ty = swapY ? sourceOffy + (targetGap * to[1]) : (h - targetOffy) + (targetGap * to[1]),
                oProduct = ((so[0] * to[0]) + (so[1] * to[1]));        
            
            var result = {
                sx:sx, sy:sy, tx:tx, ty:ty, lw:lw, 
                xSpan:Math.abs(tx - sx),
                ySpan:Math.abs(ty - sy),                
                mx:(sx + tx) / 2,
                my:(sy + ty) / 2,                
                so:so, to:to, x:x, y:y, w:w, h:h,
                segment : segment,
                sourceOffx:sourceOffx, sourceOffy:sourceOffy,
                targetOffx:targetOffx, targetOffy:targetOffy,
                startStubX : sx + (so[0] * sourceStub), 
                startStubY : sy + (so[1] * sourceStub),
                endStubX : tx + (to[0] * targetStub), 
                endStubY : ty + (to[1] * targetStub),
                isXGreaterThanStubTimes2 : Math.abs(sx - tx) > (sourceStub + targetStub),
                isYGreaterThanStubTimes2 : Math.abs(sy - ty) > (sourceStub + targetStub),
                opposite:oProduct == -1,
                perpendicular:oProduct == 0,
                orthogonal:oProduct == 1,
                sourceAxis : so[0] == 0 ? "y" : "x",
                points:[x, y, w, h, sx, sy, tx, ty ]
            };
            result.anchorOrientation = result.opposite ? "opposite" : result.orthogonal ? "orthogonal" : "perpendicular";
            return result;
        };
		
		this.getSegments = function() { return segments; };
        
        var dumpSegmentsToConsole = function() {
            console.log("SEGMENTS:");
            for (var i = 0; i < segments.length; i++) {
                console.log(segments[i].type, segments[i].getLength(), segmentProportions[i]);
            }
        };
		
		this.pointOnPath = function(location, absolute) {
			var seg = _findSegmentForLocation(location, absolute);			
			return seg.segment.pointOnPath(seg.proportion, absolute);
		};
		
		this.gradientAtPoint = function(location) {
			var seg = _findSegmentForLocation(location, absolute);			
			return seg.segment.gradientAtPoint(seg.proportion, absolute);
		};
		
		this.pointAlongPathFrom = function(location, distance, absolute) {
			var seg = _findSegmentForLocation(location, absolute);
			// TODO what happens if this crosses to the next segment?
			return seg.segment.pointAlongPathFrom(seg.proportion, distance, absolute);
		};
		
		this.compute = function(params)  {
            if (!edited)
                paintInfo = _prepareCompute(params);
            
            _clearSegments();
            var out = this._compute(paintInfo, params);
            self.x = out[0];
            self.y = out[1];
            self.w = out[2];
            self.h = out[3];   
            self.segment = paintInfo.segment;         
            _updateSegmentProportions();            
		};
		
		return {
			addSegment:_addSegment,
            prepareCompute:_prepareCompute,
            sourceStub:sourceStub,
            targetStub:targetStub,
            maxStub:Math.max(sourceStub, targetStub),
            //gap:gap
            sourceGap:sourceGap,
            targetGap:targetGap,
            maxGap:Math.max(sourceGap, targetGap)
		};		
	};
	
    /**
     * Class: Connectors.Straight
     * The Straight connector draws a simple straight line between the two anchor points.  It does not have any constructor parameters.
     */
    jsPlumb.Connectors.Straight = function() {
    	this.type = "Straight";
		var _super =  jsPlumb.Connectors.AbstractConnector.apply(this, arguments);		

        this._compute = function(paintInfo, params) {            
            
            _super.addSegment("Straight", {x1:paintInfo.sx, y1:paintInfo.sy, x2:paintInfo.startStubX, y2:paintInfo.startStubY});                                                
            _super.addSegment("Straight", {x1:paintInfo.startStubX, y1:paintInfo.startStubY, x2:paintInfo.endStubX, y2:paintInfo.endStubY});                        
            _super.addSegment("Straight", {x1:paintInfo.endStubX, y1:paintInfo.endStubY, x2:paintInfo.tx, y2:paintInfo.ty});                        
            
            return paintInfo.points;
        };                    
    };
                    
    /**
     * Class:Connectors.Bezier
     * This Connector draws a Bezier curve with two control points.  You can provide a 'curviness' value which gets applied to jsPlumb's
     * internal voodoo machine and ends up generating locations for the two control points.  See the constructor documentation below.
     */
    /**
     * Function:Constructor
     * 
     * Parameters:
     * 	curviness - How 'curvy' you want the curve to be! This is a directive for the placement of control points, not endpoints of the curve, so your curve does not 
     * actually touch the given point, but it has the tendency to lean towards it.  The larger this value, the greater the curve is pulled from a straight line.
     * Optional; defaults to 150.
     * stub - optional value for a distance to travel from the connector's endpoint before beginning the Bezier curve. defaults to 0.
     * 
     */
    jsPlumb.Connectors.Bezier = function(params) {
    	var self = this,
			_super =  jsPlumb.Connectors.AbstractConnector.apply(this, arguments),
			currentPoints = null;
			
    	params = params || {};
    	this.majorAnchor = params.curviness || 150;        
        this.minorAnchor = 10;        
        this.type = "Bezier";
		var stub = params.stub || 50;
        
        this._findControlPoint = function(point, sourceAnchorPosition, targetAnchorPosition, sourceEndpoint, targetEndpoint, sourceAnchor, targetAnchor) {
        	// determine if the two anchors are perpendicular to each other in their orientation.  we swap the control 
        	// points around if so (code could be tightened up)
        	var soo = sourceAnchor.getOrientation(sourceEndpoint), 
        		too = targetAnchor.getOrientation(targetEndpoint),
        		perpendicular = soo[0] != too[0] || soo[1] == too[1],
            	p = [],            
            	ma = self.majorAnchor, mi = self.minorAnchor;                
            	
            if (!perpendicular) {
                if (soo[0] == 0) // X
                    p.push(sourceAnchorPosition[0] < targetAnchorPosition[0] ? point[0] + mi : point[0] - mi);
                else p.push(point[0] - (ma * soo[0]));
                                 
                if (soo[1] == 0) // Y
                	p.push(sourceAnchorPosition[1] < targetAnchorPosition[1] ? point[1] + mi : point[1] - mi);
                else p.push(point[1] + (ma * too[1]));
            }
             else {
                if (too[0] == 0) // X
                	p.push(targetAnchorPosition[0] < sourceAnchorPosition[0] ? point[0] + mi : point[0] - mi);
                else p.push(point[0] + (ma * too[0]));
                
                if (too[1] == 0) // Y
                	p.push(targetAnchorPosition[1] < sourceAnchorPosition[1] ? point[1] + mi : point[1] - mi);
                else p.push(point[1] + (ma * soo[1]));
             }

            return p;                
        };        

        var _CP, _CP2, _sx, _tx, _ty, _sx, _sy, _canvasX, _canvasY, _w, _h, _sStubX, _sStubY, _tStubX, _tStubY;

        this._compute = function(paintInfo, p) {                        
            
        	// this calculation gives us what the minimum distance between either start or end
			// should be from the edge of the canvas.
			var sp = [p.sourcePos[0], p.sourcePos[1]],
				tp = [ p.targetPos[0], p.targetPos[1] ];

			// -----------------------------
			
			// STUB ?
			
			
			// ------------------
				
			var lineWidth = Math.max(p.minWidth, (p.lineWidth || 0));
            _w = Math.abs(sp[0] - tp[0]) + lineWidth; 
            _h = Math.abs(sp[1] - tp[1]) + lineWidth;
            
            _canvasX = Math.min(sp[0], tp[0])-(lineWidth/2);
            _canvasY = Math.min(sp[1], tp[1])-(lineWidth/2);
            _canvasX = Math.min(sp[0], tp[0])-(lineWidth/2);
            _canvasY = Math.min(sp[1], tp[1])-(lineWidth/2);            
      
            _sx = sp[0] < tp[0] ? _w - (lineWidth/2): (lineWidth/2);
            _sy = sp[1] < tp[1] ? _h - (lineWidth/2) : (lineWidth/2);
            _tx = sp[0] < tp[0] ? (lineWidth/2) : _w - (lineWidth/2);
            _ty = sp[1] < tp[1] ? (lineWidth/2) : _h - (lineWidth/2);
                        
            _CP = self._findControlPoint([_sx, _sy], sp, tp, p.sourceEndpoint, p.targetEndpoint, p.sourceAnchor, p.targetAnchor);
            _CP2 = self._findControlPoint([_tx, _ty], tp, sp, p.targetEndpoint, p.sourceEndpoint, p.targetAnchor, p.sourceAnchor);                
            var minx1 = Math.min(_sx,_tx), minx2 = Math.min(_CP[0], _CP2[0]), minx = Math.min(minx1,minx2),
            	maxx1 = Math.max(_sx,_tx), maxx2 = Math.max(_CP[0], _CP2[0]), maxx = Math.max(maxx1,maxx2);
            
            if (maxx > _w) _w = maxx;
            if (minx < 0) {
                _canvasX += minx; var ox = Math.abs(minx);
                _w += ox; _CP[0] += ox; _sx += ox; _tx +=ox; _CP2[0] += ox;                
            }                

            var miny1 = Math.min(_sy,_ty), miny2 = Math.min(_CP[1], _CP2[1]), miny = Math.min(miny1,miny2),
            	maxy1 = Math.max(_sy,_ty), maxy2 = Math.max(_CP[1], _CP2[1]), maxy = Math.max(maxy1,maxy2);
            	
            if (maxy > _h) _h = maxy;
            if (miny < 0) {
                _canvasY += miny; var oy = Math.abs(miny);
                _h += oy; _CP[1] += oy; _sy += oy; _ty +=oy; _CP2[1] += oy;                
            }
            
            if (p.minWidth && _w < p.minWidth) {
            	var posAdjust = (p.minWidth - _w) / 2;
        		_w = minWidth;        		
        		_canvasX -= posAdjust; _sx = _sx + posAdjust ; _tx = _tx + posAdjust; _CP[0] =  _CP[0] + posAdjust; _CP2[0] = _CP2[0] + posAdjust;
        	}
            
            if (p.minWidth && paintInfo.h < p.minWidth) {
            	var posAdjust = (p.minWidth - _h) / 2;
        		_h = p.minWidth;        		
        		_canvasY -= posAdjust; _sy = _sy + posAdjust ; _ty = _ty + posAdjust; _CP[1] =  _CP[1] + posAdjust; _CP2[1] = _CP2[1] + posAdjust;
        	}

            currentPoints = [_canvasX, _canvasY, _w, _h,
                             _sx, _sy, _tx, _ty,
                             _CP[0], _CP[1], _CP2[0], _CP2[1] ];
												
			_super.addSegment("Bezier", {
				x1:_sx, y1:_sy, x2:_tx, y2:_ty,
				cp1x:_CP[0], cp1y:_CP[1], cp2x:_CP2[0], cp2y:_CP2[1]
			});
            
            return currentPoints;            
        };               
    };        
    
 // ********************************* END OF CONNECTOR TYPES *******************************************************************
    
 // ********************************* ENDPOINT TYPES *******************************************************************
    
    jsPlumb.Endpoints.AbstractEndpoint = function(params) {
        var self = this;    
        this.compute = function(anchorPoint, orientation, endpointStyle, connectorPaintStyle) {    
            var out = self._compute(anchorPoint, orientation, endpointStyle, connectorPaintStyle);
            self.x = out[0];
            self.y = out[1];
            self.w = out[2];
            self.h = out[3];
            return out;
        };
        return {
            compute:self.compute,
            cssClass:params.cssClass
        };
    };
    
    /**
     * Class: Endpoints.Dot
     * A round endpoint, with default radius 10 pixels.
     */    	
    	
	/**
	 * Function: Constructor
	 * 
	 * Parameters:
	 * 
	 * 	radius	-	radius of the endpoint.  defaults to 10 pixels.
	 */
	jsPlumb.Endpoints.Dot = function(params) {        
		this.type = "Dot";
		var self = this,
            _super = jsPlumb.Endpoints.AbstractEndpoint.apply(this, arguments);
		params = params || {};				
		this.radius = params.radius || 10;
		this.defaultOffset = 0.5 * this.radius;
		this.defaultInnerRadius = this.radius / 3;			
		
		this._compute = function(anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
			var r = endpointStyle.radius || self.radius,
				x = anchorPoint[0] - r,
				y = anchorPoint[1] - r;
			return [ x, y, r * 2, r * 2, r ];
		};
	};
	
	/**
	 * Class: Endpoints.Rectangle
	 * A Rectangular Endpoint, with default size 20x20.
	 */
	/**
	 * Function: Constructor
	 * 
	 * Parameters:
	 * 
	 * 	width	- width of the endpoint. defaults to 20 pixels.
	 * 	height	- height of the endpoint. defaults to 20 pixels.	
	 */
	jsPlumb.Endpoints.Rectangle = function(params) {
		this.type = "Rectangle";
		var self = this,
            _super = jsPlumb.Endpoints.AbstractEndpoint.apply(this, arguments);
		params = params || {};
		this.width = params.width || 20;
		this.height = params.height || 20;
		
		this._compute = function(anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
			var width = endpointStyle.width || self.width,
				height = endpointStyle.height || self.height,
				x = anchorPoint[0] - (width/2),
				y = anchorPoint[1] - (height/2);
			return [ x, y, width, height];
		};
	};
	

    var DOMElementEndpoint = function(params) {
        jsPlumb.DOMElementComponent.apply(this, arguments);
        var self = this;

        var displayElements = [  ];
        this.getDisplayElements = function() { 
            return displayElements; 
        };
        
        this.appendDisplayElement = function(el) {
            displayElements.push(el);
        };            
    };
	/**
	 * Class: Endpoints.Image
	 * Draws an image as the Endpoint.
	 */
	/**
	 * Function: Constructor
	 * 
	 * Parameters:
	 * 
	 * 	src	-	location of the image to use.
	 */
	jsPlumb.Endpoints.Image = function(params) {
				
		this.type = "Image";
		DOMElementEndpoint.apply(this, arguments);
		
		var self = this,
            _super = jsPlumb.Endpoints.AbstractEndpoint.apply(this, arguments), 
			initialized = false,
			deleted = false,
			widthToUse = params.width,
			heightToUse = params.height,
            _onload = null,
            _endpoint = params.endpoint;
			
		this.img = new Image();
		self.ready = false;

		this.img.onload = function() {
			self.ready = true;
			widthToUse = widthToUse || self.img.width;
			heightToUse = heightToUse || self.img.height;
            if (_onload) {
                _onload(self);
            }
		};

        /*
            Function: setImage
            Sets the Image to use in this Endpoint.  

            Parameters:
            img         -   may be a URL or an Image object
            onload      -   optional; a callback to execute once the image has loaded.
        */
        _endpoint.setImage = function(img, onload) {
            var s = img.constructor == String ? img : img.src;
            _onload = onload;
            self.img.src = img;

            if (self.canvas != null)
                self.canvas.setAttribute("src", img);
        };

        _endpoint.setImage(params.src || params.url, params.onload);

		this._compute = function(anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
			self.anchorPoint = anchorPoint;
			if (self.ready) return [anchorPoint[0] - widthToUse / 2, anchorPoint[1] - heightToUse / 2, 
									widthToUse, heightToUse];
			else return [0,0,0,0];
		};
		
		self.canvas = document.createElement("img"), initialized = false;
		self.canvas.style["margin"] = 0;
		self.canvas.style["padding"] = 0;
		self.canvas.style["outline"] = 0;
		self.canvas.style["position"] = "absolute";
		var clazz = params.cssClass ? " " + params.cssClass : "";
		self.canvas.className = jsPlumb.endpointClass + clazz;
		if (widthToUse) self.canvas.setAttribute("width", widthToUse);
		if (heightToUse) self.canvas.setAttribute("height", heightToUse);		
		jsPlumb.appendElement(self.canvas, params.parent);
		self.attachListeners(self.canvas, self);
		
		self.cleanup = function() {
			deleted = true;
		};
		
		var actuallyPaint = function(d, style, anchor) {
			if (!deleted) {
				if (!initialized) {
					self.canvas.setAttribute("src", self.img.src);
					self.appendDisplayElement(self.canvas);
					initialized = true;
				}
				var x = self.anchorPoint[0] - (widthToUse / 2),
					y = self.anchorPoint[1] - (heightToUse / 2);
				jsPlumb.sizeCanvas(self.canvas, x, y, widthToUse, heightToUse);
			}
		};
		
		this.paint = function(style, anchor) {
			if (self.ready) {
    			actuallyPaint(style, anchor);
			}
			else { 
				window.setTimeout(function() {    					
					self.paint(style, anchor);
				}, 200);
			}
		};				
	};
	
	/*
	 * Class: Endpoints.Blank
	 * An Endpoint that paints nothing (visible) on the screen.  Supports cssClass and hoverClass parameters like all Endpoints.
	 */
	jsPlumb.Endpoints.Blank = function(params) {
		var self = this,
            _super = jsPlumb.Endpoints.AbstractEndpoint.apply(this, arguments);
		this.type = "Blank";
		DOMElementEndpoint.apply(this, arguments);		
		this._compute = function(anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
			return [anchorPoint[0], anchorPoint[1],10,0];
		};
		
		self.canvas = document.createElement("div");
		self.canvas.style.display = "block";
		self.canvas.style.width = "1px";
		self.canvas.style.height = "1px";
		self.canvas.style.background = "transparent";
		self.canvas.style.position = "absolute";
		self.canvas.className = self._jsPlumb.endpointClass;
		jsPlumb.appendElement(self.canvas, params.parent);
		
		this.paint = function(style, anchor) {
			jsPlumb.sizeCanvas(self.canvas, self.x, self.y, self.w, self.h);	
		};
	};
	
	/*
	 * Class: Endpoints.Triangle
	 * A triangular Endpoint.  
	 */
	/*
	 * Function: Constructor
	 * 
	 * Parameters:
	 * 
	 * 	width	-	width of the triangle's base.  defaults to 55 pixels.
	 * 	height	-	height of the triangle from base to apex.  defaults to 55 pixels.
	 */
	jsPlumb.Endpoints.Triangle = function(params) {        
		this.type = "Triangle";
        var self = this,
            _super = jsPlumb.Endpoints.AbstractEndpoint.apply(this, arguments);
		params = params || {  };
		params.width = params.width || 55;
		params.height = params.height || 55;
		this.width = params.width;
		this.height = params.height;
		this._compute = function(anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
			var width = endpointStyle.width || self.width,
			height = endpointStyle.height || self.height,
			x = anchorPoint[0] - (width/2),
			y = anchorPoint[1] - (height/2);
			return [ x, y, width, height ];
		};
	};
// ********************************* END OF ENDPOINT TYPES *******************************************************************
	

// ********************************* OVERLAY DEFINITIONS ***********************************************************************    

	var AbstractOverlay = function(params) {
		var visible = true, self = this;
        this.isAppendedAtTopLevel = true;
		this.component = params.component;
		this.loc = params.location == null ? 0.5 : params.location;
        this.endpointLoc = params.endpointLocation == null ? [ 0.5, 0.5] : params.endpointLocation;
		this.setVisible = function(val) { 
			visible = val;
			self.component.repaint();
		};
    	this.isVisible = function() { return visible; };
    	this.hide = function() { self.setVisible(false); };
    	this.show = function() { self.setVisible(true); };
    	
    	this.incrementLocation = function(amount) {
    		self.loc += amount;
    		self.component.repaint();
    	};
    	this.setLocation = function(l) {
    		self.loc = l;
    		self.component.repaint();
    	};
    	this.getLocation = function() {
    		return self.loc;
    	};
	};
	
	
	/*
	 * Class: Overlays.Arrow
	 * 
	 * An arrow overlay, defined by four points: the head, the two sides of the tail, and a 'foldback' point at some distance along the length
	 * of the arrow that lines from each tail point converge into.  The foldback point is defined using a decimal that indicates some fraction
	 * of the length of the arrow and has a default value of 0.623.  A foldback point value of 1 would mean that the arrow had a straight line
	 * across the tail.  
	 */
	/*
	 * Function: Constructor
	 * 
	 * Parameters:
	 * 
	 * 	length - distance in pixels from head to tail baseline. default 20.
	 * 	width - width in pixels of the tail baseline. default 20.
	 * 	fillStyle - style to use when filling the arrow.  defaults to "black".
	 * 	strokeStyle - style to use when stroking the arrow. defaults to null, which means the arrow is not stroked.
	 * 	lineWidth - line width to use when stroking the arrow. defaults to 1, but only used if strokeStyle is not null.
	 * 	foldback - distance (as a decimal from 0 to 1 inclusive) along the length of the arrow marking the point the tail points should fold back to.  defaults to 0.623.
	 * 	location - distance (as a decimal from 0 to 1 inclusive) marking where the arrow should sit on the connector. defaults to 0.5.
	 * 	direction - indicates the direction the arrow points in. valid values are -1 and 1; 1 is default.
	 */
	jsPlumb.Overlays.Arrow = function(params) {
		this.type = "Arrow";
		AbstractOverlay.apply(this, arguments);
        this.isAppendedAtTopLevel = false;
		params = params || {};
		var self = this;
		
    	this.length = params.length || 20;
    	this.width = params.width || 20;
    	this.id = params.id;
    	var direction = (params.direction || 1) < 0 ? -1 : 1,
    	    paintStyle = params.paintStyle || { lineWidth:1 },
    	    // how far along the arrow the lines folding back in come to. default is 62.3%.
    	    foldback = params.foldback || 0.623;

    	    	
    	this.computeMaxSize = function() { return self.width * 1.5; };
    	
    	this.cleanup = function() { };  // nothing to clean up for Arrows
    	
    	this.draw = function(connector, currentConnectionPaintStyle) {

            var hxy, mid, txy, tail, cxy;
            if (connector.pointAlongPathFrom) {

                if (jsPlumbUtil.isString(self.loc) || self.loc > 1 || self.loc < 0) {
                    var l = parseInt(self.loc);
                    hxy = connector.pointAlongPathFrom(l, direction * self.length / 2, true),
                    mid = connector.pointOnPath(l, true),
                    txy = jsPlumbUtil.pointOnLine(hxy, mid, self.length);
                }
                else if (self.loc == 1) {					
					hxy = connector.pointOnPath(self.loc);
					mid = connector.pointAlongPathFrom(self.loc, -1);                    
					txy = jsPlumbUtil.pointOnLine(hxy, mid, self.length);
					
					if (direction == -1) {
						var _ = txy;
						txy = hxy;
						hxy = _;
					}
                }
                else if (self.loc == 0) {					
					txy = connector.pointOnPath(self.loc);
					mid = connector.pointAlongPathFrom(self.loc, 1);
					hxy = jsPlumbUtil.pointOnLine(txy, mid, self.length);
					if (direction == -1) {
						var _ = txy;
						txy = hxy;
						hxy = _;
					}
                }
                else {
    			    hxy = connector.pointAlongPathFrom(self.loc, direction * self.length / 2),
                    mid = connector.pointOnPath(self.loc),
                    txy = jsPlumbUtil.pointOnLine(hxy, mid, self.length);
                }

                tail = jsPlumbUtil.perpendicularLineTo(hxy, txy, self.width);
                cxy = jsPlumbUtil.pointOnLine(hxy, txy, foldback * self.length);

    			var minx = Math.min(hxy.x, tail[0].x, tail[1].x),
    				maxx = Math.max(hxy.x, tail[0].x, tail[1].x),
    				miny = Math.min(hxy.y, tail[0].y, tail[1].y),
    				maxy = Math.max(hxy.y, tail[0].y, tail[1].y);
    			
    			var d = { hxy:hxy, tail:tail, cxy:cxy },
    			    strokeStyle = paintStyle.strokeStyle || currentConnectionPaintStyle.strokeStyle,
    			    fillStyle = paintStyle.fillStyle || currentConnectionPaintStyle.strokeStyle,
    			    lineWidth = paintStyle.lineWidth || currentConnectionPaintStyle.lineWidth;
    			
    			self.paint(connector, d, lineWidth, strokeStyle, fillStyle);							
			
			    return [ minx, maxx, miny, maxy]; 
            }
            else return [0,0,0,0];
    	};
    };          
    
    /*
     * Class: Overlays.PlainArrow
	 * 
	 * A basic arrow.  This is in fact just one instance of the more generic case in which the tail folds back on itself to some
	 * point along the length of the arrow: in this case, that foldback point is the full length of the arrow.  so it just does
	 * a 'call' to Arrow with foldback set appropriately.       
	 */
    /*
     * Function: Constructor
     * See <Overlays.Arrow> for allowed parameters for this overlay.
     */
    jsPlumb.Overlays.PlainArrow = function(params) {
    	params = params || {};    	
    	var p = jsPlumb.extend(params, {foldback:1});
    	jsPlumb.Overlays.Arrow.call(this, p);
    	this.type = "PlainArrow";
    };
        
    /*
     * Class: Overlays.Diamond
     * 
	 * A diamond. Like PlainArrow, this is a concrete case of the more generic case of the tail points converging on some point...it just
	 * happens that in this case, that point is greater than the length of the the arrow.    
	 * 
	 *      this could probably do with some help with positioning...due to the way it reuses the Arrow paint code, what Arrow thinks is the
	 *      center is actually 1/4 of the way along for this guy.  but we don't have any knowledge of pixels at this point, so we're kind of
	 *      stuck when it comes to helping out the Arrow class. possibly we could pass in a 'transpose' parameter or something. the value
	 *      would be -l/4 in this case - move along one quarter of the total length.
	 */
    /*
     * Function: Constructor
     * See <Overlays.Arrow> for allowed parameters for this overlay.
     */
    jsPlumb.Overlays.Diamond = function(params) {
    	params = params || {};    	
    	var l = params.length || 40,
    	    p = jsPlumb.extend(params, {length:l/2, foldback:2});
    	jsPlumb.Overlays.Arrow.call(this, p);
    	this.type = "Diamond";
    };
    
	
	// abstract superclass for overlays that add an element to the DOM.
    var AbstractDOMOverlay = function(params) {
		jsPlumb.DOMElementComponent.apply(this, arguments);
    	AbstractOverlay.apply(this, arguments);
		
		var self = this, initialised = false, jpcl = jsPlumb.CurrentLibrary;
		params = params || {};
		this.id = params.id;
		var div;
		
		var makeDiv = function() {
			div = params.create(params.component);
			div = jpcl.getDOMElement(div);
			div.style["position"] 	= 	"absolute";    	
			var clazz = params["_jsPlumb"].overlayClass + " " + 
				(self.cssClass ? self.cssClass : 
				params.cssClass ? params.cssClass : "");    	
			div.className =	clazz;
			params["_jsPlumb"].appendElement(div, params.component.parent);
			params["_jsPlumb"].getId(div);		
	    	self.attachListeners(div, self);
	    	self.canvas = div;
		};
		
		this.getElement = function() {
			if (div == null) {
				makeDiv();
			}
    		return div;
    	};
		
		this.getDimensions = function() {
    		return jpcl.getSize(jpcl.getElementObject(self.getElement()));
    	};
		
		var cachedDimensions = null,
			_getDimensions = function(component) {
				if (cachedDimensions == null)
					cachedDimensions = self.getDimensions();
				return cachedDimensions;
			};
		
		/*
		 * Function: clearCachedDimensions
		 * Clears the cached dimensions for the label. As a performance enhancement, label dimensions are
		 * cached from 1.3.12 onwards. The cache is cleared when you change the label text, of course, but
		 * there are other reasons why the text dimensions might change - if you make a change through CSS, for
		 * example, you might change the font size.  in that case you should explicitly call this method.
		 */
		this.clearCachedDimensions = function() {
			cachedDimensions = null;
		};
		
		this.computeMaxSize = function() {
    		var td = _getDimensions();
			return Math.max(td[0], td[1]);
    	}; 
		
		//override setVisible
    	var osv = self.setVisible;
    	self.setVisible = function(state) {
    		osv(state); // call superclass
    		div.style.display = state ? "block" : "none";
    	};
		
		this.cleanup = function() {
    		if (div != null) jpcl.removeElement(div);
    	};
		
		this.paint = function(component, d) {
			if (!initialised) {
				self.getElement();
				component.appendDisplayElement(div);
				self.attachListeners(div, component);
				initialised = true;
			}
			div.style.left = (component.x + d.minx) + "px";
			div.style.top = (component.y + d.miny) + "px";			
    	};
				
		this.draw = function(component, currentConnectionPaintStyle) {
	    	var td = _getDimensions();
	    	if (td != null && td.length == 2) {
				var cxy = {x:0,y:0};
                if (component.pointOnPath) {
                    var loc = self.loc, absolute = false;
                    if (jsPlumbUtil.isString(self.loc) || self.loc < 0 || self.loc > 1) {
                        loc = parseInt(self.loc);
                        absolute = true;
                    }
                    cxy = component.pointOnPath(loc, absolute);  // a connection
                }
                else {
                    var locToUse = self.loc.constructor == Array ? self.loc : self.endpointLoc;
                    cxy = { x:locToUse[0] * component.w,
                            y:locToUse[1] * component.h };      
                } 
                           
				minx = cxy.x - (td[0] / 2),
				miny = cxy.y - (td[1] / 2);				
				self.paint(component, { minx:minx, miny:miny, td:td, cxy:cxy });				
				return [minx, minx + td[0], miny, miny + td[1]];
        	}
	    	else return [0,0,0,0];
	    };
	    
	    this.reattachListeners = function(connector) {
	    	if (div) {
	    		self.reattachListenersForElement(div, self, connector);
	    	}
	    };
		
	};
	
	/*
     * Class: Overlays.Custom
     * A Custom overlay. You supply a 'create' function which returns some DOM element, and jsPlumb positions it.
     * The 'create' function is passed a Connection or Endpoint.
     */
    /*
     * Function: Constructor
     * 
     * Parameters:
     * 	create - function for jsPlumb to call that returns a DOM element.
     * 	location - distance (as a decimal from 0 to 1 inclusive) marking where the label should sit on the connector. defaults to 0.5.
     * 	id - optional id to use for later retrieval of this overlay.
     * 	
     */
    jsPlumb.Overlays.Custom = function(params) {
    	this.type = "Custom";    	
    	AbstractDOMOverlay.apply(this, arguments);		    	        		    	    		
    };
    
    /*
     * Class: Overlays.Label
     * A Label overlay. For all different renderer types (SVG/Canvas/VML), jsPlumb draws a Label overlay as a styled DIV.  Version 1.3.0 of jsPlumb
     * introduced the ability to set css classes on the label; this is now the preferred way for you to style a label.  The 'labelStyle' parameter
     * is still supported in 1.3.0 but its usage is deprecated.  Under the hood, jsPlumb just turns that object into a bunch of CSS directive that it 
     * puts on the Label's 'style' attribute, so the end result is the same. 
     */
    /*
     * Function: Constructor
     * 
     * Parameters:
     * 	cssClass - optional css class string to append to css class. This string is appended "as-is", so you can of course have multiple classes
     *             defined.  This parameter is preferred to using labelStyle, borderWidth and borderStyle.
     * 	label - the label to paint.  May be a string or a function that returns a string.  Nothing will be painted if your label is null or your
     *         label function returns null.  empty strings _will_ be painted.
     * 	location - distance (as a decimal from 0 to 1 inclusive) marking where the label should sit on the connector. defaults to 0.5.
     * 	id - optional id to use for later retrieval of this overlay.
     * 	
     */
    jsPlumb.Overlays.Label = function(params) {
		var self = this;    	
		this.labelStyle = params.labelStyle || jsPlumb.Defaults.LabelStyle;
		this.cssClass = this.labelStyle != null ? this.labelStyle.cssClass : null;
		params.create = function() {
			return document.createElement("div");
		};
    	jsPlumb.Overlays.Custom.apply(this, arguments);
		this.type = "Label";
    	
        var label = params.label || "",
            self = this,    	    
            labelText = null;
    	
    	/*
    	 * Function: setLabel
    	 * sets the label's, um, label.  you would think i'd call this function
    	 * 'setText', but you can pass either a Function or a String to this, so
    	 * it makes more sense as 'setLabel'. This uses innerHTML on the label div, so keep
         * that in mind if you need escaped HTML.
    	 */
    	this.setLabel = function(l) {
    		label = l;
    		labelText = null;
			self.clearCachedDimensions();
			_update();
    		self.component.repaint();
    	};
    	
		var _update = function() {
			if (typeof label == "function") {
    			var lt = label(self);
    			self.getElement().innerHTML = lt.replace(/\r\n/g, "<br/>");
    		}
    		else {
    			if (labelText == null) {
    				labelText = label;
    				self.getElement().innerHTML = labelText.replace(/\r\n/g, "<br/>");
    			}
    		}
		};
		
    	this.getLabel = function() {
    		return label;
    	};
    	
		var superGD = this.getDimensions;		
		this.getDimensions = function() {				
    		_update();
			return superGD();
    	};
		
    };
		

 // ********************************* END OF OVERLAY DEFINITIONS ***********************************************************************
    
})();