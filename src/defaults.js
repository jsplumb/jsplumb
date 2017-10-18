/*
 * jsPlumb Community Edition
 * 
 * Provides a way to visually connect elements on an HTML page, using SVG.
 * 
 * This file contains the default Connectors, Endpoint and Overlay definitions.
 *
 * Copyright (c) 2010 - 2017 jsPlumb (hello@jsplumbtoolkit.com)
 * 
 * https://jsplumbtoolkit.com
 * https://github.com/jsplumb/jsplumb
 * 
 * Dual licensed under the MIT and GPL2 licenses.
 */
;
(function () {

    "use strict";
    var root = this, _jp = root.jsPlumb, _ju = root.jsPlumbUtil, _jg = root.Biltong;

    _jp.Segments = {

        /*
         * Class: AbstractSegment
         * A Connector is made up of 1..N Segments, each of which has a Type, such as 'Straight', 'Arc',
         * 'Bezier'. This is new from 1.4.2, and gives us a lot more flexibility when drawing connections: things such
         * as rounded corners for flowchart connectors, for example, or a straight line stub for Bezier connections, are
         * much easier to do now.
         *
         * A Segment is responsible for providing coordinates for painting it, and also must be able to report its length.
         * 
         */
        AbstractSegment: function (params) {
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
            this.findClosestPointOnPath = function (x, y) {
                return {
                    d: Infinity,
                    x: null,
                    y: null,
                    l: null
                };
            };

            this.getBounds = function () {
                return {
                    minX: Math.min(params.x1, params.x2),
                    minY: Math.min(params.y1, params.y2),
                    maxX: Math.max(params.x1, params.x2),
                    maxY: Math.max(params.y1, params.y2)
                };
            };
        },
        Straight: function (params) {
            var _super = _jp.Segments.AbstractSegment.apply(this, arguments),
                length, m, m2, x1, x2, y1, y2,
                _recalc = function () {
                    length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                    m = _jg.gradient({x: x1, y: y1}, {x: x2, y: y2});
                    m2 = -1 / m;
                };

            this.type = "Straight";

            this.getLength = function () {
                return length;
            };
            this.getGradient = function () {
                return m;
            };

            this.getCoordinates = function () {
                return { x1: x1, y1: y1, x2: x2, y2: y2 };
            };
            this.setCoordinates = function (coords) {
                x1 = coords.x1;
                y1 = coords.y1;
                x2 = coords.x2;
                y2 = coords.y2;
                _recalc();
            };
            this.setCoordinates({x1: params.x1, y1: params.y1, x2: params.x2, y2: params.y2});

            this.getBounds = function () {
                return {
                    minX: Math.min(x1, x2),
                    minY: Math.min(y1, y2),
                    maxX: Math.max(x1, x2),
                    maxY: Math.max(y1, y2)
                };
            };

            /**
             * returns the point on the segment's path that is 'location' along the length of the path, where 'location' is a decimal from
             * 0 to 1 inclusive. for the straight line segment this is simple maths.
             */
            this.pointOnPath = function (location, absolute) {
                if (location === 0 && !absolute) {
                    return { x: x1, y: y1 };
                }
                else if (location === 1 && !absolute) {
                    return { x: x2, y: y2 };
                }
                else {
                    var l = absolute ? location > 0 ? location : length + location : location * length;
                    return _jg.pointOnLine({x: x1, y: y1}, {x: x2, y: y2}, l);
                }
            };

            /**
             * returns the gradient of the segment at the given point - which for us is constant.
             */
            this.gradientAtPoint = function (_) {
                return m;
            };

            /**
             * returns the point on the segment's path that is 'distance' along the length of the path from 'location', where
             * 'location' is a decimal from 0 to 1 inclusive, and 'distance' is a number of pixels.
             * this hands off to jsPlumbUtil to do the maths, supplying two points and the distance.
             */
            this.pointAlongPathFrom = function (location, distance, absolute) {
                var p = this.pointOnPath(location, absolute),
                    farAwayPoint = distance <= 0 ? {x: x1, y: y1} : {x: x2, y: y2 };

                /*
                 location == 1 ? {
                 x:x1 + ((x2 - x1) * 10),
                 y:y1 + ((y1 - y2) * 10)
                 } :
                 */

                if (distance <= 0 && Math.abs(distance) > 1) {
                    distance *= -1;
                }

                return _jg.pointOnLine(p, farAwayPoint, distance);
            };

            // is c between a and b?
            var within = function (a, b, c) {
                return c >= Math.min(a, b) && c <= Math.max(a, b);
            };
            // find which of a and b is closest to c
            var closest = function (a, b, c) {
                return Math.abs(c - a) < Math.abs(c - b) ? a : b;
            };

            /**
             Function: findClosestPointOnPath
             Finds the closest point on this segment to [x,y]. See
             notes on this method in AbstractSegment.
             */
            this.findClosestPointOnPath = function (x, y) {
                var out = {
                    d: Infinity,
                    x: null,
                    y: null,
                    l: null,
                    x1: x1,
                    x2: x2,
                    y1: y1,
                    y2: y2
                };

                if (m === 0) {
                    out.y = y1;
                    out.x = within(x1, x2, x) ? x : closest(x1, x2, x);
                }
                else if (m === Infinity || m === -Infinity) {
                    out.x = x1;
                    out.y = within(y1, y2, y) ? y : closest(y1, y2, y);
                }
                else {
                    // closest point lies on normal from given point to this line.  
                    var b = y1 - (m * x1),
                        b2 = y - (m2 * x),
                    // y1 = m.x1 + b and y1 = m2.x1 + b2
                    // so m.x1 + b = m2.x1 + b2
                    // x1(m - m2) = b2 - b
                    // x1 = (b2 - b) / (m - m2)
                        _x1 = (b2 - b) / (m - m2),
                        _y1 = (m * _x1) + b;

                    out.x = within(x1, x2, _x1) ? _x1 : closest(x1, x2, _x1);//_x1;
                    out.y = within(y1, y2, _y1) ? _y1 : closest(y1, y2, _y1);//_y1;
                }

                var fractionInSegment = _jg.lineLength([ out.x, out.y ], [ x1, y1 ]);
                out.d = _jg.lineLength([x, y], [out.x, out.y]);
                out.l = fractionInSegment / length;
                return out;
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
        Arc: function (params) {
            var _super = _jp.Segments.AbstractSegment.apply(this, arguments),
                _calcAngle = function (_x, _y) {
                    return _jg.theta([params.cx, params.cy], [_x, _y]);
                },
                _calcAngleForLocation = function (segment, location) {
                    if (segment.anticlockwise) {
                        var sa = segment.startAngle < segment.endAngle ? segment.startAngle + TWO_PI : segment.startAngle,
                            s = Math.abs(sa - segment.endAngle);
                        return sa - (s * location);
                    }
                    else {
                        var ea = segment.endAngle < segment.startAngle ? segment.endAngle + TWO_PI : segment.endAngle,
                            ss = Math.abs(ea - segment.startAngle);

                        return segment.startAngle + (ss * location);
                    }
                },
                TWO_PI = 2 * Math.PI;

            this.radius = params.r;
            this.anticlockwise = params.ac;
            this.type = "Arc";

            if (params.startAngle && params.endAngle) {
                this.startAngle = params.startAngle;
                this.endAngle = params.endAngle;
                this.x1 = params.cx + (this.radius * Math.cos(params.startAngle));
                this.y1 = params.cy + (this.radius * Math.sin(params.startAngle));
                this.x2 = params.cx + (this.radius * Math.cos(params.endAngle));
                this.y2 = params.cy + (this.radius * Math.sin(params.endAngle));
            }
            else {
                this.startAngle = _calcAngle(params.x1, params.y1);
                this.endAngle = _calcAngle(params.x2, params.y2);
                this.x1 = params.x1;
                this.y1 = params.y1;
                this.x2 = params.x2;
                this.y2 = params.y2;
            }

            if (this.endAngle < 0) {
                this.endAngle += TWO_PI;
            }
            if (this.startAngle < 0) {
                this.startAngle += TWO_PI;
            }

            // segment is used by vml     
            //this.segment = _jg.quadrant([this.x1, this.y1], [this.x2, this.y2]);

            // we now have startAngle and endAngle as positive numbers, meaning the
            // absolute difference (|d|) between them is the sweep (s) of this arc, unless the
            // arc is 'anticlockwise' in which case 's' is given by 2PI - |d|.

            var ea = this.endAngle < this.startAngle ? this.endAngle + TWO_PI : this.endAngle;
            this.sweep = Math.abs(ea - this.startAngle);
            if (this.anticlockwise) {
                this.sweep = TWO_PI - this.sweep;
            }
            var circumference = 2 * Math.PI * this.radius,
                frac = this.sweep / TWO_PI,
                length = circumference * frac;

            this.getLength = function () {
                return length;
            };

            this.getBounds = function () {
                return {
                    minX: params.cx - params.r,
                    maxX: params.cx + params.r,
                    minY: params.cy - params.r,
                    maxY: params.cy + params.r
                };
            };

            var VERY_SMALL_VALUE = 0.0000000001,
                gentleRound = function (n) {
                    var f = Math.floor(n), r = Math.ceil(n);
                    if (n - f < VERY_SMALL_VALUE) {
                        return f;
                    }
                    else if (r - n < VERY_SMALL_VALUE) {
                        return r;
                    }
                    return n;
                };

            /**
             * returns the point on the segment's path that is 'location' along the length of the path, where 'location' is a decimal from
             * 0 to 1 inclusive.
             */
            this.pointOnPath = function (location, absolute) {

                if (location === 0) {
                    return { x: this.x1, y: this.y1, theta: this.startAngle };
                }
                else if (location === 1) {
                    return { x: this.x2, y: this.y2, theta: this.endAngle };
                }

                if (absolute) {
                    location = location / length;
                }

                var angle = _calcAngleForLocation(this, location),
                    _x = params.cx + (params.r * Math.cos(angle)),
                    _y = params.cy + (params.r * Math.sin(angle));

                return { x: gentleRound(_x), y: gentleRound(_y), theta: angle };
            };

            /**
             * returns the gradient of the segment at the given point.
             */
            this.gradientAtPoint = function (location, absolute) {
                var p = this.pointOnPath(location, absolute);
                var m = _jg.normal([ params.cx, params.cy ], [p.x, p.y ]);
                if (!this.anticlockwise && (m === Infinity || m === -Infinity)) {
                    m *= -1;
                }
                return m;
            };

            this.pointAlongPathFrom = function (location, distance, absolute) {
                var p = this.pointOnPath(location, absolute),
                    arcSpan = distance / circumference * 2 * Math.PI,
                    dir = this.anticlockwise ? -1 : 1,
                    startAngle = p.theta + (dir * arcSpan),
                    startX = params.cx + (this.radius * Math.cos(startAngle)),
                    startY = params.cy + (this.radius * Math.sin(startAngle));

                return {x: startX, y: startY};
            };
        },

        Bezier: function (params) {
            this.curve = [
                { x: params.x1, y: params.y1},
                { x: params.cp1x, y: params.cp1y },
                { x: params.cp2x, y: params.cp2y },
                { x: params.x2, y: params.y2 }
            ];

            var _super = _jp.Segments.AbstractSegment.apply(this, arguments);
            // although this is not a strictly rigorous determination of bounds
            // of a bezier curve, it works for the types of curves that this segment
            // type produces.
            this.bounds = {
                minX: Math.min(params.x1, params.x2, params.cp1x, params.cp2x),
                minY: Math.min(params.y1, params.y2, params.cp1y, params.cp2y),
                maxX: Math.max(params.x1, params.x2, params.cp1x, params.cp2x),
                maxY: Math.max(params.y1, params.y2, params.cp1y, params.cp2y)
            };

            this.type = "Bezier";

            var _translateLocation = function (_curve, location, absolute) {
                if (absolute) {
                    location = root.jsBezier.locationAlongCurveFrom(_curve, location > 0 ? 0 : 1, location);
                }

                return location;
            };

            /**
             * returns the point on the segment's path that is 'location' along the length of the path, where 'location' is a decimal from
             * 0 to 1 inclusive.
             */
            this.pointOnPath = function (location, absolute) {
                location = _translateLocation(this.curve, location, absolute);
                return root.jsBezier.pointOnCurve(this.curve, location);
            };

            /**
             * returns the gradient of the segment at the given point.
             */
            this.gradientAtPoint = function (location, absolute) {
                location = _translateLocation(this.curve, location, absolute);
                return root.jsBezier.gradientAtPoint(this.curve, location);
            };

            this.pointAlongPathFrom = function (location, distance, absolute) {
                location = _translateLocation(this.curve, location, absolute);
                return root.jsBezier.pointAlongCurveFrom(this.curve, location, distance);
            };

            this.getLength = function () {
                return root.jsBezier.getLength(this.curve);
            };

            this.getBounds = function () {
                return this.bounds;
            };
        }
    };

    _jp.SegmentRenderer = {
        getPath: function (segment) {
            return ({
                "Straight": function () {
                    var d = segment.getCoordinates();
                    return "M " + d.x1 + " " + d.y1 + " L " + d.x2 + " " + d.y2;
                },
                "Bezier": function () {
                    var d = segment.params;
                    return "M " + d.x1 + " " + d.y1 +
                        " C " + d.cp1x + " " + d.cp1y + " " + d.cp2x + " " + d.cp2y + " " + d.x2 + " " + d.y2;
                },
                "Arc": function () {
                    var d = segment.params,
                        laf = segment.sweep > Math.PI ? 1 : 0,
                        sf = segment.anticlockwise ? 0 : 1;

                    return "M" + segment.x1 + " " + segment.y1 + " A " + segment.radius + " " + d.r + " 0 " + laf + "," + sf + " " + segment.x2 + " " + segment.y2;
                }
            })[segment.type]();
        }
    };

    /*
     Class: AbstractComponent
     Superclass for AbstractConnector and AbstractEndpoint.
     */
    var AbstractComponent = function () {
        this.resetBounds = function () {
            this.bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
        };
        this.resetBounds();
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
    _jp.Connectors.AbstractConnector = function (params) {

        AbstractComponent.apply(this, arguments);

        var segments = [],
            totalLength = 0,
            segmentProportions = [],
            segmentProportionalLengths = [],
            stub = params.stub || 0,
            sourceStub = _ju.isArray(stub) ? stub[0] : stub,
            targetStub = _ju.isArray(stub) ? stub[1] : stub,
            gap = params.gap || 0,
            sourceGap = _ju.isArray(gap) ? gap[0] : gap,
            targetGap = _ju.isArray(gap) ? gap[1] : gap,
            userProvidedSegments = null,
            edited = false,
            paintInfo = null,
            geometry = null,
            editable = params.editable !== false && _jp.ConnectorEditors != null && _jp.ConnectorEditors[this.type] != null;

        var _setGeometry = this.setGeometry = function(g, internallyComputed) {
            edited = (!internallyComputed);
            geometry = g;
        };
        var _getGeometry = this.getGeometry = function() {
            return geometry;
        };

        this.getPathData = function() {
            var p = "";
            for (var i = 0; i < segments.length; i++) {
                p += _jp.SegmentRenderer.getPath(segments[i]);
                p += " ";
            }
            return p;
        };

        this.hasBeenEdited = function() { return edited; };
        this.isEditing = function() { return this.editor != null && this.editor.isActive(); };
        this.setEditable = function(e) {
            // if this connector has an editor already, or
            // if an editor for this connector's type is available, or
            // if the child declares an overrideSetEditable and it does not return false, editable is true.
            if (e && _jp.ConnectorEditors != null && _jp.ConnectorEditors[this.type] != null && (this.overrideSetEditable == null || this.overrideSetEditable())) {
                editable = e;
            } else {
                editable = false;
            }
            return editable;
        };
        this.isEditable = function() { return editable; };

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
        this.findSegmentForPoint = function (x, y) {
            var out = { d: Infinity, s: null, x: null, y: null, l: null };
            for (var i = 0; i < segments.length; i++) {
                var _s = segments[i].findClosestPointOnPath(x, y);
                if (_s.d < out.d) {
                    out.d = _s.d;
                    out.l = _s.l;
                    out.x = _s.x;
                    out.y = _s.y;
                    out.s = segments[i];
                    out.x1 = _s.x1;
                    out.x2 = _s.x2;
                    out.y1 = _s.y1;
                    out.y2 = _s.y2;
                    out.index = i;
                }
            }

            return out;
        };

        var _updateSegmentProportions = function () {
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
            _findSegmentForLocation = function (location, absolute) {
                if (absolute) {
                    location = location > 0 ? location / totalLength : (totalLength + location) / totalLength;
                }
                var idx = segmentProportions.length - 1, inSegmentProportion = 1;
                for (var i = 0; i < segmentProportions.length; i++) {
                    if (segmentProportions[i][1] >= location) {
                        idx = i;
                        // todo is this correct for all connector path types?
                        inSegmentProportion = location === 1 ? 1 : location === 0 ? 0 : (location - segmentProportions[i][0]) / segmentProportionalLengths[i];
                        break;
                    }
                }
                return { segment: segments[idx], proportion: inSegmentProportion, index: idx };
            },
            _addSegment = function (conn, type, params) {
                if (params.x1 === params.x2 && params.y1 === params.y2) {
                    return;
                }
                var s = new _jp.Segments[type](params);
                segments.push(s);
                totalLength += s.getLength();
                conn.updateBounds(s);
            },
            _clearSegments = function () {
                totalLength = segments.length = segmentProportions.length = segmentProportionalLengths.length = 0;
            };

        this.setSegments = function (_segs) {
            userProvidedSegments = [];
            totalLength = 0;
            for (var i = 0; i < _segs.length; i++) {
                userProvidedSegments.push(_segs[i]);
                totalLength += _segs[i].getLength();
            }
        };

        this.getLength = function() {
            return totalLength;
        };

        var _prepareCompute = function (params) {
            this.strokeWidth = params.strokeWidth;
            var segment = _jg.quadrant(params.sourcePos, params.targetPos),
                swapX = params.targetPos[0] < params.sourcePos[0],
                swapY = params.targetPos[1] < params.sourcePos[1],
                lw = params.strokeWidth || 1,
                so = params.sourceEndpoint.anchor.getOrientation(params.sourceEndpoint),
                to = params.targetEndpoint.anchor.getOrientation(params.targetEndpoint),
                x = swapX ? params.targetPos[0] : params.sourcePos[0],
                y = swapY ? params.targetPos[1] : params.sourcePos[1],
                w = Math.abs(params.targetPos[0] - params.sourcePos[0]),
                h = Math.abs(params.targetPos[1] - params.sourcePos[1]);

            // if either anchor does not have an orientation set, we derive one from their relative
            // positions.  we fix the axis to be the one in which the two elements are further apart, and
            // point each anchor at the other element.  this is also used when dragging a new connection.
            if (so[0] === 0 && so[1] === 0 || to[0] === 0 && to[1] === 0) {
                var index = w > h ? 0 : 1, oIndex = [1, 0][index];
                so = [];
                to = [];
                so[index] = params.sourcePos[index] > params.targetPos[index] ? -1 : 1;
                to[index] = params.sourcePos[index] > params.targetPos[index] ? 1 : -1;
                so[oIndex] = 0;
                to[oIndex] = 0;
            }

            var sx = swapX ? w + (sourceGap * so[0]) : sourceGap * so[0],
                sy = swapY ? h + (sourceGap * so[1]) : sourceGap * so[1],
                tx = swapX ? targetGap * to[0] : w + (targetGap * to[0]),
                ty = swapY ? targetGap * to[1] : h + (targetGap * to[1]),
                oProduct = ((so[0] * to[0]) + (so[1] * to[1]));

            var result = {
                sx: sx, sy: sy, tx: tx, ty: ty, lw: lw,
                xSpan: Math.abs(tx - sx),
                ySpan: Math.abs(ty - sy),
                mx: (sx + tx) / 2,
                my: (sy + ty) / 2,
                so: so, to: to, x: x, y: y, w: w, h: h,
                segment: segment,
                startStubX: sx + (so[0] * sourceStub),
                startStubY: sy + (so[1] * sourceStub),
                endStubX: tx + (to[0] * targetStub),
                endStubY: ty + (to[1] * targetStub),
                isXGreaterThanStubTimes2: Math.abs(sx - tx) > (sourceStub + targetStub),
                isYGreaterThanStubTimes2: Math.abs(sy - ty) > (sourceStub + targetStub),
                opposite: oProduct === -1,
                perpendicular: oProduct === 0,
                orthogonal: oProduct === 1,
                sourceAxis: so[0] === 0 ? "y" : "x",
                points: [x, y, w, h, sx, sy, tx, ty ]
            };
            result.anchorOrientation = result.opposite ? "opposite" : result.orthogonal ? "orthogonal" : "perpendicular";
            return result;
        };

        this.getSegments = function () {
            return segments;
        };

        this.updateBounds = function (segment) {
            var segBounds = segment.getBounds();
            this.bounds.minX = Math.min(this.bounds.minX, segBounds.minX);
            this.bounds.maxX = Math.max(this.bounds.maxX, segBounds.maxX);
            this.bounds.minY = Math.min(this.bounds.minY, segBounds.minY);
            this.bounds.maxY = Math.max(this.bounds.maxY, segBounds.maxY);
        };

        var dumpSegmentsToConsole = function () {
            console.log("SEGMENTS:");
            for (var i = 0; i < segments.length; i++) {
                console.log(segments[i].type, segments[i].getLength(), segmentProportions[i]);
            }
        };

        this.pointOnPath = function (location, absolute) {
            var seg = _findSegmentForLocation(location, absolute);
            return seg.segment && seg.segment.pointOnPath(seg.proportion, false) || [0, 0];
        };

        this.gradientAtPoint = function (location, absolute) {
            var seg = _findSegmentForLocation(location, absolute);
            return seg.segment && seg.segment.gradientAtPoint(seg.proportion, false) || 0;
        };

        this.pointAlongPathFrom = function (location, distance, absolute) {
            var seg = _findSegmentForLocation(location, absolute);
            // TODO what happens if this crosses to the next segment?
            return seg.segment && seg.segment.pointAlongPathFrom(seg.proportion, distance, false) || [0, 0];
        };

        this.compute = function (params) {
            paintInfo = _prepareCompute.call(this, params);

            _clearSegments();
            this._compute(paintInfo, params);
            this.x = paintInfo.points[0];
            this.y = paintInfo.points[1];
            this.w = paintInfo.points[2];
            this.h = paintInfo.points[3];
            this.segment = paintInfo.segment;
            _updateSegmentProportions();
        };

        return {
            addSegment: _addSegment,
            prepareCompute: _prepareCompute,
            sourceStub: sourceStub,
            targetStub: targetStub,
            maxStub: Math.max(sourceStub, targetStub),
            sourceGap: sourceGap,
            targetGap: targetGap,
            maxGap: Math.max(sourceGap, targetGap),
            setGeometry:_setGeometry,
            getGeometry:_getGeometry
        };
    };
    _ju.extend(_jp.Connectors.AbstractConnector, AbstractComponent);


    // ********************************* END OF CONNECTOR TYPES *******************************************************************

    // ********************************* ENDPOINT TYPES *******************************************************************

    _jp.Endpoints.AbstractEndpoint = function (params) {
        AbstractComponent.apply(this, arguments);
        var compute = this.compute = function (anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
            var out = this._compute.apply(this, arguments);
            this.x = out[0];
            this.y = out[1];
            this.w = out[2];
            this.h = out[3];
            this.bounds.minX = this.x;
            this.bounds.minY = this.y;
            this.bounds.maxX = this.x + this.w;
            this.bounds.maxY = this.y + this.h;
            return out;
        };
        return {
            compute: compute,
            cssClass: params.cssClass
        };
    };
    _ju.extend(_jp.Endpoints.AbstractEndpoint, AbstractComponent);

    /**
     * Class: Endpoints.Dot
     * A round endpoint, with default radius 10 pixels.
     */

    /**
     * Function: Constructor
     *
     * Parameters:
     *
     *    radius    -    radius of the endpoint.  defaults to 10 pixels.
     */
    _jp.Endpoints.Dot = function (params) {
        this.type = "Dot";
        var _super = _jp.Endpoints.AbstractEndpoint.apply(this, arguments);
        params = params || {};
        this.radius = params.radius || 10;
        this.defaultOffset = 0.5 * this.radius;
        this.defaultInnerRadius = this.radius / 3;

        this._compute = function (anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
            this.radius = endpointStyle.radius || this.radius;
            var x = anchorPoint[0] - this.radius,
                y = anchorPoint[1] - this.radius,
                w = this.radius * 2,
                h = this.radius * 2;

            if (endpointStyle.stroke) {
                var lw = endpointStyle.strokeWidth || 1;
                x -= lw;
                y -= lw;
                w += (lw * 2);
                h += (lw * 2);
            }
            return [ x, y, w, h, this.radius ];
        };
    };
    _ju.extend(_jp.Endpoints.Dot, _jp.Endpoints.AbstractEndpoint);

    _jp.Endpoints.Rectangle = function (params) {
        this.type = "Rectangle";
        var _super = _jp.Endpoints.AbstractEndpoint.apply(this, arguments);
        params = params || {};
        this.width = params.width || 20;
        this.height = params.height || 20;

        this._compute = function (anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
            var width = endpointStyle.width || this.width,
                height = endpointStyle.height || this.height,
                x = anchorPoint[0] - (width / 2),
                y = anchorPoint[1] - (height / 2);

            return [ x, y, width, height];
        };
    };
    _ju.extend(_jp.Endpoints.Rectangle, _jp.Endpoints.AbstractEndpoint);

    var DOMElementEndpoint = function (params) {
        _jp.jsPlumbUIComponent.apply(this, arguments);
        this._jsPlumb.displayElements = [];
    };
    _ju.extend(DOMElementEndpoint, _jp.jsPlumbUIComponent, {
        getDisplayElements: function () {
            return this._jsPlumb.displayElements;
        },
        appendDisplayElement: function (el) {
            this._jsPlumb.displayElements.push(el);
        }
    });

    /**
     * Class: Endpoints.Image
     * Draws an image as the Endpoint.
     */
    /**
     * Function: Constructor
     *
     * Parameters:
     *
     *    src    -    location of the image to use.

     TODO: multiple references to self. not sure quite how to get rid of them entirely. perhaps self = null in the cleanup
     function will suffice

     TODO this class still might leak memory.

     */
    _jp.Endpoints.Image = function (params) {

        this.type = "Image";
        DOMElementEndpoint.apply(this, arguments);
        _jp.Endpoints.AbstractEndpoint.apply(this, arguments);

        var _onload = params.onload,
            src = params.src || params.url,
            clazz = params.cssClass ? " " + params.cssClass : "";

        this._jsPlumb.img = new Image();
        this._jsPlumb.ready = false;
        this._jsPlumb.initialized = false;
        this._jsPlumb.deleted = false;
        this._jsPlumb.widthToUse = params.width;
        this._jsPlumb.heightToUse = params.height;
        this._jsPlumb.endpoint = params.endpoint;

        this._jsPlumb.img.onload = function () {
            if (this._jsPlumb != null) {
                this._jsPlumb.ready = true;
                this._jsPlumb.widthToUse = this._jsPlumb.widthToUse || this._jsPlumb.img.width;
                this._jsPlumb.heightToUse = this._jsPlumb.heightToUse || this._jsPlumb.img.height;
                if (_onload) {
                    _onload(this);
                }
            }
        }.bind(this);

        /*
         Function: setImage
         Sets the Image to use in this Endpoint.

         Parameters:
         img         -   may be a URL or an Image object
         onload      -   optional; a callback to execute once the image has loaded.
         */
        this._jsPlumb.endpoint.setImage = function (_img, onload) {
            var s = _img.constructor === String ? _img : _img.src;
            _onload = onload;
            this._jsPlumb.img.src = s;

            if (this.canvas != null) {
                this.canvas.setAttribute("src", this._jsPlumb.img.src);
            }
        }.bind(this);

        this._jsPlumb.endpoint.setImage(src, _onload);
        this._compute = function (anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
            this.anchorPoint = anchorPoint;
            if (this._jsPlumb.ready) {
                return [anchorPoint[0] - this._jsPlumb.widthToUse / 2, anchorPoint[1] - this._jsPlumb.heightToUse / 2,
                    this._jsPlumb.widthToUse, this._jsPlumb.heightToUse];
            }
            else {
                return [0, 0, 0, 0];
            }
        };

        this.canvas = _jp.createElement("img", {
            position:"absolute",
            margin:0,
            padding:0,
            outline:0
        }, this._jsPlumb.instance.endpointClass + clazz);

        if (this._jsPlumb.widthToUse) {
            this.canvas.setAttribute("width", this._jsPlumb.widthToUse);
        }
        if (this._jsPlumb.heightToUse) {
            this.canvas.setAttribute("height", this._jsPlumb.heightToUse);
        }
        this._jsPlumb.instance.appendElement(this.canvas);

        this.actuallyPaint = function (d, style, anchor) {
            if (!this._jsPlumb.deleted) {
                if (!this._jsPlumb.initialized) {
                    this.canvas.setAttribute("src", this._jsPlumb.img.src);
                    this.appendDisplayElement(this.canvas);
                    this._jsPlumb.initialized = true;
                }
                var x = this.anchorPoint[0] - (this._jsPlumb.widthToUse / 2),
                    y = this.anchorPoint[1] - (this._jsPlumb.heightToUse / 2);
                _ju.sizeElement(this.canvas, x, y, this._jsPlumb.widthToUse, this._jsPlumb.heightToUse);
            }
        };

        this.paint = function (style, anchor) {
            if (this._jsPlumb != null) {  // may have been deleted
                if (this._jsPlumb.ready) {
                    this.actuallyPaint(style, anchor);
                }
                else {
                    root.setTimeout(function () {
                        this.paint(style, anchor);
                    }.bind(this), 200);
                }
            }
        };
    };
    _ju.extend(_jp.Endpoints.Image, [ DOMElementEndpoint, _jp.Endpoints.AbstractEndpoint ], {
        cleanup: function (force) {
            if (force) {
                this._jsPlumb.deleted = true;
                if (this.canvas) {
                    this.canvas.parentNode.removeChild(this.canvas);
                }
                this.canvas = null;
            }
        }
    });

    /*
     * Class: Endpoints.Blank
     * An Endpoint that paints nothing (visible) on the screen.  Supports cssClass and hoverClass parameters like all Endpoints.
     */
    _jp.Endpoints.Blank = function (params) {
        var _super = _jp.Endpoints.AbstractEndpoint.apply(this, arguments);
        this.type = "Blank";
        DOMElementEndpoint.apply(this, arguments);
        this._compute = function (anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
            return [anchorPoint[0], anchorPoint[1], 10, 0];
        };

        var clazz = params.cssClass ? " " + params.cssClass : "";

        this.canvas = _jp.createElement("div", {
            display: "block",
            width: "1px",
            height: "1px",
            background: "transparent",
            position: "absolute"
        }, this._jsPlumb.instance.endpointClass + clazz);

        this._jsPlumb.instance.appendElement(this.canvas);

        this.paint = function (style, anchor) {
            _ju.sizeElement(this.canvas, this.x, this.y, this.w, this.h);
        };
    };
    _ju.extend(_jp.Endpoints.Blank, [_jp.Endpoints.AbstractEndpoint, DOMElementEndpoint], {
        cleanup: function () {
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
        }
    });

    /*
     * Class: Endpoints.Triangle
     * A triangular Endpoint.
     */
    /*
     * Function: Constructor
     *
     * Parameters:
     *
     * width   width of the triangle's base.  defaults to 55 pixels.
     * height  height of the triangle from base to apex.  defaults to 55 pixels.
     */
    _jp.Endpoints.Triangle = function (params) {
        this.type = "Triangle";
        _jp.Endpoints.AbstractEndpoint.apply(this, arguments);
        var self = this;
        params = params || {  };
        params.width = params.width || 55;
        params.height = params.height || 55;
        this.width = params.width;
        this.height = params.height;
        this._compute = function (anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
            var width = endpointStyle.width || self.width,
                height = endpointStyle.height || self.height,
                x = anchorPoint[0] - (width / 2),
                y = anchorPoint[1] - (height / 2);
            return [ x, y, width, height ];
        };
    };
// ********************************* END OF ENDPOINT TYPES *******************************************************************


// ********************************* OVERLAY DEFINITIONS ***********************************************************************    

    var AbstractOverlay = _jp.Overlays.AbstractOverlay = function (params) {
        this.visible = true;
        this.isAppendedAtTopLevel = true;
        this.component = params.component;
        this.loc = params.location == null ? 0.5 : params.location;
        this.endpointLoc = params.endpointLocation == null ? [ 0.5, 0.5] : params.endpointLocation;
        this.visible = params.visible !== false;
    };
    AbstractOverlay.prototype = {
        cleanup: function (force) {
            if (force) {
                this.component = null;
                this.canvas = null;
                this.endpointLoc = null;
            }
        },
        reattach:function(instance, component) { },
        setVisible: function (val) {
            this.visible = val;
            this.component.repaint();
        },
        isVisible: function () {
            return this.visible;
        },
        hide: function () {
            this.setVisible(false);
        },
        show: function () {
            this.setVisible(true);
        },
        incrementLocation: function (amount) {
            this.loc += amount;
            this.component.repaint();
        },
        setLocation: function (l) {
            this.loc = l;
            this.component.repaint();
        },
        getLocation: function () {
            return this.loc;
        },
        updateFrom:function() { }
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
     * @constructor
     *
     * @param {Object} params Constructor params.
     * @param {Number} [params.length] Distance in pixels from head to tail baseline. default 20.
     * @param {Number} [params.width] Width in pixels of the tail baseline. default 20.
     * @param {String} [params.fill] Style to use when filling the arrow.  defaults to "black".
     * @param {String} [params.stroke] Style to use when stroking the arrow. defaults to null, which means the arrow is not stroked.
     * @param {Number} [params.stroke-width] Line width to use when stroking the arrow. defaults to 1, but only used if stroke is not null.
     * @param {Number} [params.foldback] Distance (as a decimal from 0 to 1 inclusive) along the length of the arrow marking the point the tail points should fold back to.  defaults to 0.623.
     * @param {Number} [params.location] Distance (as a decimal from 0 to 1 inclusive) marking where the arrow should sit on the connector. defaults to 0.5.
     * @param {NUmber} [params.direction] Indicates the direction the arrow points in. valid values are -1 and 1; 1 is default.
     */
    _jp.Overlays.Arrow = function (params) {
        this.type = "Arrow";
        AbstractOverlay.apply(this, arguments);
        this.isAppendedAtTopLevel = false;
        params = params || {};
        var self = this;

        this.length = params.length || 20;
        this.width = params.width || 20;
        this.id = params.id;
        var direction = (params.direction || 1) < 0 ? -1 : 1,
            paintStyle = params.paintStyle || { "stroke-width": 1 },
        // how far along the arrow the lines folding back in come to. default is 62.3%.
            foldback = params.foldback || 0.623;

        this.computeMaxSize = function () {
            return self.width * 1.5;
        };

        this.elementCreated = function(p, component) {
            this.path = p;
            if (params.events) {
                for (var i in params.events) {
                    _jp.on(p, i, params.events[i]);
                }
            }
        };

        this.draw = function (component, currentConnectionPaintStyle) {

            var hxy, mid, txy, tail, cxy;
            if (component.pointAlongPathFrom) {

                if (_ju.isString(this.loc) || this.loc > 1 || this.loc < 0) {
                    var l = parseInt(this.loc, 10),
                        fromLoc = this.loc < 0 ? 1 : 0;
                    hxy = component.pointAlongPathFrom(fromLoc, l, false);
                    mid = component.pointAlongPathFrom(fromLoc, l - (direction * this.length / 2), false);
                    txy = _jg.pointOnLine(hxy, mid, this.length);
                }
                else if (this.loc === 1) {
                    hxy = component.pointOnPath(this.loc);
                    mid = component.pointAlongPathFrom(this.loc, -(this.length));
                    txy = _jg.pointOnLine(hxy, mid, this.length);

                    if (direction === -1) {
                        var _ = txy;
                        txy = hxy;
                        hxy = _;
                    }
                }
                else if (this.loc === 0) {
                    txy = component.pointOnPath(this.loc);
                    mid = component.pointAlongPathFrom(this.loc, this.length);
                    hxy = _jg.pointOnLine(txy, mid, this.length);
                    if (direction === -1) {
                        var __ = txy;
                        txy = hxy;
                        hxy = __;
                    }
                }
                else {
                    hxy = component.pointAlongPathFrom(this.loc, direction * this.length / 2);
                    mid = component.pointOnPath(this.loc);
                    txy = _jg.pointOnLine(hxy, mid, this.length);
                }

                tail = _jg.perpendicularLineTo(hxy, txy, this.width);
                cxy = _jg.pointOnLine(hxy, txy, foldback * this.length);

                var d = { hxy: hxy, tail: tail, cxy: cxy },
                    stroke = paintStyle.stroke || currentConnectionPaintStyle.stroke,
                    fill = paintStyle.fill || currentConnectionPaintStyle.stroke,
                    lineWidth = paintStyle.strokeWidth || currentConnectionPaintStyle.strokeWidth;

                return {
                    component: component,
                    d: d,
                    "stroke-width": lineWidth,
                    stroke: stroke,
                    fill: fill,
                    minX: Math.min(hxy.x, tail[0].x, tail[1].x),
                    maxX: Math.max(hxy.x, tail[0].x, tail[1].x),
                    minY: Math.min(hxy.y, tail[0].y, tail[1].y),
                    maxY: Math.max(hxy.y, tail[0].y, tail[1].y)
                };
            }
            else {
                return {component: component, minX: 0, maxX: 0, minY: 0, maxY: 0};
            }
        };
    };
    _ju.extend(_jp.Overlays.Arrow, AbstractOverlay, {
        updateFrom:function(d) {
            this.length = d.length || this.length;
            this.width = d.width|| this.width;
            this.direction = d.direction != null ? d.direction : this.direction;
            this.foldback = d.foldback|| this.foldback;
        }
    });

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
    _jp.Overlays.PlainArrow = function (params) {
        params = params || {};
        var p = _jp.extend(params, {foldback: 1});
        _jp.Overlays.Arrow.call(this, p);
        this.type = "PlainArrow";
    };
    _ju.extend(_jp.Overlays.PlainArrow, _jp.Overlays.Arrow);

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
    _jp.Overlays.Diamond = function (params) {
        params = params || {};
        var l = params.length || 40,
            p = _jp.extend(params, {length: l / 2, foldback: 2});
        _jp.Overlays.Arrow.call(this, p);
        this.type = "Diamond";
    };
    _ju.extend(_jp.Overlays.Diamond, _jp.Overlays.Arrow);

    var _getDimensions = function (component, forceRefresh) {
        if (component._jsPlumb.cachedDimensions == null || forceRefresh) {
            component._jsPlumb.cachedDimensions = component.getDimensions();
        }
        return component._jsPlumb.cachedDimensions;
    };

    // abstract superclass for overlays that add an element to the DOM.
    var AbstractDOMOverlay = function (params) {
        _jp.jsPlumbUIComponent.apply(this, arguments);
        AbstractOverlay.apply(this, arguments);

        // hand off fired events to associated component.
        var _f = this.fire;
        this.fire = function () {
            _f.apply(this, arguments);
            if (this.component) {
                this.component.fire.apply(this.component, arguments);
            }
        };

        this.detached=false;
        this.id = params.id;
        this._jsPlumb.div = null;
        this._jsPlumb.initialised = false;
        this._jsPlumb.component = params.component;
        this._jsPlumb.cachedDimensions = null;
        this._jsPlumb.create = params.create;
        this._jsPlumb.initiallyInvisible = params.visible === false;

        this.getElement = function () {
            if (this._jsPlumb.div == null) {
                var div = this._jsPlumb.div = _jp.getElement(this._jsPlumb.create(this._jsPlumb.component));
                div.style.position = "absolute";
                div.className = this._jsPlumb.instance.overlayClass + " " +
                    (this.cssClass ? this.cssClass :
                        params.cssClass ? params.cssClass : "");
                this._jsPlumb.instance.appendElement(div);
                this._jsPlumb.instance.getId(div);
                this.canvas = div;

                // in IE the top left corner is what it placed at the desired location.  This will not
                // be fixed. IE8 is not going to be supported for much longer.
                var ts = "translate(-50%, -50%)";
                div.style.webkitTransform = ts;
                div.style.mozTransform = ts;
                div.style.msTransform = ts;
                div.style.oTransform = ts;
                div.style.transform = ts;

                // write the related component into the created element
                div._jsPlumb = this;

                if (params.visible === false) {
                    div.style.display = "none";
                }
            }
            return this._jsPlumb.div;
        };

        this.draw = function (component, currentConnectionPaintStyle, absolutePosition) {
            var td = _getDimensions(this);
            if (td != null && td.length === 2) {
                var cxy = { x: 0, y: 0 };

                // absolutePosition would have been set by a call to connection.setAbsoluteOverlayPosition.
                if (absolutePosition) {
                    cxy = { x: absolutePosition[0], y: absolutePosition[1] };
                }
                else if (component.pointOnPath) {
                    var loc = this.loc, absolute = false;
                    if (_ju.isString(this.loc) || this.loc < 0 || this.loc > 1) {
                        loc = parseInt(this.loc, 10);
                        absolute = true;
                    }
                    cxy = component.pointOnPath(loc, absolute);  // a connection
                }
                else {
                    var locToUse = this.loc.constructor === Array ? this.loc : this.endpointLoc;
                    cxy = { x: locToUse[0] * component.w,
                        y: locToUse[1] * component.h };
                }

                var minx = cxy.x - (td[0] / 2),
                    miny = cxy.y - (td[1] / 2);

                return {
                    component: component,
                    d: { minx: minx, miny: miny, td: td, cxy: cxy },
                    minX: minx,
                    maxX: minx + td[0],
                    minY: miny,
                    maxY: miny + td[1]
                };
            }
            else {
                return {minX: 0, maxX: 0, minY: 0, maxY: 0};
            }
        };
    };
    _ju.extend(AbstractDOMOverlay, [_jp.jsPlumbUIComponent, AbstractOverlay], {
        getDimensions: function () {
            return [1,1];
        },
        setVisible: function (state) {
            if (this._jsPlumb.div) {
                this._jsPlumb.div.style.display = state ? "block" : "none";
                // if initially invisible, dimensions are 0,0 and never get updated
                if (state && this._jsPlumb.initiallyInvisible) {
                    _getDimensions(this, true);
                    this.component.repaint();
                    this._jsPlumb.initiallyInvisible = false;
                }
            }
        },
        /*
         * Function: clearCachedDimensions
         * Clears the cached dimensions for the label. As a performance enhancement, label dimensions are
         * cached from 1.3.12 onwards. The cache is cleared when you change the label text, of course, but
         * there are other reasons why the text dimensions might change - if you make a change through CSS, for
         * example, you might change the font size.  in that case you should explicitly call this method.
         */
        clearCachedDimensions: function () {
            this._jsPlumb.cachedDimensions = null;
        },
        cleanup: function (force) {
            if (force) {
                if (this._jsPlumb.div != null) {
                    this._jsPlumb.div._jsPlumb = null;
                    this._jsPlumb.instance.removeElement(this._jsPlumb.div);
                }
            }
            else {
                // if not a forced cleanup, just detach child from parent for now.
                if (this._jsPlumb && this._jsPlumb.div && this._jsPlumb.div.parentNode) {
                    this._jsPlumb.div.parentNode.removeChild(this._jsPlumb.div);
                }
                this.detached = true;
            }

        },
        reattach:function(instance, component) {
            if (this._jsPlumb.div != null) {
                instance.getContainer().appendChild(this._jsPlumb.div);
            }
            this.detached = false;
        },
        computeMaxSize: function () {
            var td = _getDimensions(this);
            return Math.max(td[0], td[1]);
        },
        paint: function (p, containerExtents) {
            if (!this._jsPlumb.initialised) {
                this.getElement();
                p.component.appendDisplayElement(this._jsPlumb.div);
                this._jsPlumb.initialised = true;
                if (this.detached) {
                    this._jsPlumb.div.parentNode.removeChild(this._jsPlumb.div);
                }
            }
            this._jsPlumb.div.style.left = (p.component.x + p.d.minx) + "px";
            this._jsPlumb.div.style.top = (p.component.y + p.d.miny) + "px";
        }
    });

    /*
     * Class: Overlays.Custom
     * A Custom overlay. You supply a 'create' function which returns some DOM element, and jsPlumb positions it.
     * The 'create' function is passed a Connection or Endpoint.
     */
    /*
     * Function: Constructor
     * 
     * Parameters:
     * create - function for jsPlumb to call that returns a DOM element.
     * location - distance (as a decimal from 0 to 1 inclusive) marking where the label should sit on the connector. defaults to 0.5.
     * id - optional id to use for later retrieval of this overlay.
     *
     */
    _jp.Overlays.Custom = function (params) {
        this.type = "Custom";
        AbstractDOMOverlay.apply(this, arguments);
    };
    _ju.extend(_jp.Overlays.Custom, AbstractDOMOverlay);

    _jp.Overlays.GuideLines = function () {
        var self = this;
        self.length = 50;
        self.strokeWidth = 5;
        this.type = "GuideLines";
        AbstractOverlay.apply(this, arguments);
        _jp.jsPlumbUIComponent.apply(this, arguments);
        this.draw = function (connector, currentConnectionPaintStyle) {

            var head = connector.pointAlongPathFrom(self.loc, self.length / 2),
                mid = connector.pointOnPath(self.loc),
                tail = _jg.pointOnLine(head, mid, self.length),
                tailLine = _jg.perpendicularLineTo(head, tail, 40),
                headLine = _jg.perpendicularLineTo(tail, head, 20);

            return {
                connector: connector,
                head: head,
                tail: tail,
                headLine: headLine,
                tailLine: tailLine,
                minX: Math.min(head.x, tail.x, headLine[0].x, headLine[1].x),
                minY: Math.min(head.y, tail.y, headLine[0].y, headLine[1].y),
                maxX: Math.max(head.x, tail.x, headLine[0].x, headLine[1].x),
                maxY: Math.max(head.y, tail.y, headLine[0].y, headLine[1].y)
            };
        };

        // this.cleanup = function() { };  // nothing to clean up for GuideLines
    };

    /*
     * Class: Overlays.Label

     */
    /*
     * Function: Constructor
     * 
     * Parameters:
     * cssClass - optional css class string to append to css class. This string is appended "as-is", so you can of course have multiple classes
     *             defined.  This parameter is preferred to using labelStyle, borderWidth and borderStyle.
     * label - the label to paint.  May be a string or a function that returns a string.  Nothing will be painted if your label is null or your
     *         label function returns null.  empty strings _will_ be painted.
     * location - distance (as a decimal from 0 to 1 inclusive) marking where the label should sit on the connector. defaults to 0.5.
     * id - optional id to use for later retrieval of this overlay.
     * 
     *
     */
    _jp.Overlays.Label = function (params) {
        this.labelStyle = params.labelStyle;

        var labelWidth = null, labelHeight = null, labelText = null, labelPadding = null;
        this.cssClass = this.labelStyle != null ? this.labelStyle.cssClass : null;
        var p = _jp.extend({
            create: function () {
                return _jp.createElement("div");
            }}, params);
        _jp.Overlays.Custom.call(this, p);
        this.type = "Label";
        this.label = params.label || "";
        this.labelText = null;
        if (this.labelStyle) {
            var el = this.getElement();
            this.labelStyle.font = this.labelStyle.font || "12px sans-serif";
            el.style.font = this.labelStyle.font;
            el.style.color = this.labelStyle.color || "black";
            if (this.labelStyle.fill) {
                el.style.background = this.labelStyle.fill;
            }
            if (this.labelStyle.borderWidth > 0) {
                var dStyle = this.labelStyle.borderStyle ? this.labelStyle.borderStyle : "black";
                el.style.border = this.labelStyle.borderWidth + "px solid " + dStyle;
            }
            if (this.labelStyle.padding) {
                el.style.padding = this.labelStyle.padding;
            }
        }

    };
    _ju.extend(_jp.Overlays.Label, _jp.Overlays.Custom, {
        cleanup: function (force) {
            if (force) {
                this.div = null;
                this.label = null;
                this.labelText = null;
                this.cssClass = null;
                this.labelStyle = null;
            }
        },
        getLabel: function () {
            return this.label;
        },
        /*
         * Function: setLabel
         * sets the label's, um, label.  you would think i'd call this function
         * 'setText', but you can pass either a Function or a String to this, so
         * it makes more sense as 'setLabel'. This uses innerHTML on the label div, so keep
         * that in mind if you need escaped HTML.
         */
        setLabel: function (l) {
            this.label = l;
            this.labelText = null;
            this.clearCachedDimensions();
            this.update();
            this.component.repaint();
        },
        getDimensions: function () {
            this.update();
            return AbstractDOMOverlay.prototype.getDimensions.apply(this, arguments);
        },
        update: function () {
            if (typeof this.label === "function") {
                var lt = this.label(this);
                this.getElement().innerHTML = lt.replace(/\r\n/g, "<br/>");
            }
            else {
                if (this.labelText == null) {
                    this.labelText = this.label;
                    this.getElement().innerHTML = this.labelText.replace(/\r\n/g, "<br/>");
                }
            }
        },
        updateFrom:function(d) {
            if(d.label != null){
                this.setLabel(d.label);
            }
        }
    });

    // ********************************* END OF OVERLAY DEFINITIONS ***********************************************************************

}).call(typeof window !== 'undefined' ? window : this);
