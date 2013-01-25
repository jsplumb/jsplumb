// --------------------- anchors  -------------------------------------------		
;(function() {	
	var _curryAnchor = function(x, y, ox, oy, type, fnInit) {
		return function(params) {
			var a = params.jsPlumbInstance.makeAnchor([ x, y, ox, oy, 0, 0 ], params.elementId, params.jsPlumbInstance);
			a.type = type;
			if (fnInit) fnInit(a, params);
			return a;
		};
	};
	/*
	 * Property: Anchors.TopCenter
	 * An Anchor that is located at the top center of the element.
	 */
	jsPlumb.Anchors["TopCenter"] 		= _curryAnchor(0.5, 0, 0,-1, "TopCenter");
	/*
	 * Property: Anchors.BottomCenter
	 * An Anchor that is located at the bottom center of the element.
	 */
	jsPlumb.Anchors["BottomCenter"] 	= _curryAnchor(0.5, 1, 0, 1, "BottomCenter");
	/*
	 * Property: Anchors.LeftMiddle
	 * An Anchor that is located at the left middle of the element.
	 */
	jsPlumb.Anchors["LeftMiddle"] 		= _curryAnchor(0, 0.5, -1, 0, "LeftMiddle");
	/*
	 * Property: Anchors.RightMiddle
	 * An Anchor that is located at the right middle of the element.
	 */
	jsPlumb.Anchors["RightMiddle"] 		= _curryAnchor(1, 0.5, 1, 0, "RightMiddle");
	/*
	 * Property: Anchors.Center
	 * An Anchor that is located at the center of the element.
	 */
	jsPlumb.Anchors["Center"] 			= _curryAnchor(0.5, 0.5, 0, 0, "Center");
	/*
	 * Property: Anchors.TopRight
	 * An Anchor that is located at the top right corner of the element.
	 */
	jsPlumb.Anchors["TopRight"] 		= _curryAnchor(1, 0, 0,-1, "TopRight");
	/*
	 * Property: Anchors.BottomRight
	 * An Anchor that is located at the bottom right corner of the element.
	 */
	jsPlumb.Anchors["BottomRight"] 		= _curryAnchor(1, 1, 0, 1, "BottomRight");
	/*
	 * Property: Anchors.TopLeft
	 * An Anchor that is located at the top left corner of the element.
	 */
	jsPlumb.Anchors["TopLeft"] 			= _curryAnchor(0, 0, 0, -1, "TopLeft");
	/*
	 * Property: Anchors.BottomLeft
	 * An Anchor that is located at the bototm left corner of the element.
	 */
	jsPlumb.Anchors["BottomLeft"] 		= _curryAnchor(0, 1, 0, 1, "BottomLeft");
			
	jsPlumb.Defaults.DynamicAnchors = function(params) {
		return params.jsPlumbInstance.makeAnchors(["TopCenter", "RightMiddle", "BottomCenter", "LeftMiddle"], params.elementId, params.jsPlumbInstance);
	};
	/*
	 * Property: Anchors.AutoDefault
	 * Default DynamicAnchors - chooses from TopCenter, RightMiddle, BottomCenter, LeftMiddle.
	 */
	jsPlumb.Anchors["AutoDefault"]  = function(params) { 
		var a = params.jsPlumbInstance.makeDynamicAnchor(jsPlumb.Defaults.DynamicAnchors(params));
		a.type = "AutoDefault";
		return a;
	};
	
	/*
	 * Property: Anchors.Assign
	 * An Anchor whose location is assigned at connection time, through an AnchorPositionFinder. Used in conjunction
	 * with the 'makeTarget' function. jsPlumb has two of these - 'Fixed' and 'Grid', and you can also write your own.
	 */
	jsPlumb.Anchors["Assign"] = _curryAnchor(0,0,0,0,"Assign", function(anchor, params) {
		// find what to use as the "position finder". the user may have supplied a String which represents
		// the id of a position finder in jsPlumb.AnchorPositionFinders, or the user may have supplied the
		// position finder as a function.  we find out what to use and then set it on the anchor.
		var pf = params.position || "Fixed";
		anchor.positionFinder = pf.constructor == String ? params.jsPlumbInstance.AnchorPositionFinders[pf] : pf;
		// always set the constructor params; the position finder might need them later (the Grid one does,
		// for example)
		anchor.constructorParams = params;
	});

	// Continuous anchor is just curried through to the 'get' method of the continuous anchor
	// factory.
	/*
	 * Property: Anchors.Continuous
	 * An Anchor that tracks the other element in the connection, choosing the closest face.
	 */
	jsPlumb.Anchors["Continuous"] = function(params) {
		return params.jsPlumbInstance.continuousAnchorFactory.get(params);
	};

    // these are the default anchor positions finders, which are used by the makeTarget function.  supplying
    // a position finder argument to that function allows you to specify where the resulting anchor will
    // be located
	jsPlumb.AnchorPositionFinders = {
		"Fixed": function(dp, ep, es, params) {
			return [ (dp.left - ep.left) / es[0], (dp.top - ep.top) / es[1] ];	
		},
		"Grid":function(dp, ep, es, params) {
			var dx = dp.left - ep.left, dy = dp.top - ep.top,
				gx = es[0] / (params.grid[0]), gy = es[1] / (params.grid[1]),
				mx = Math.floor(dx / gx), my = Math.floor(dy / gy);
			return [ ((mx * gx) + (gx / 2)) / es[0], ((my * gy) + (gy / 2)) / es[1] ];
		}
	};
	
	/*
	 * Property: Anchors.Perimeter
	 * An Anchor that tracks the perimeter of some shape, approximating it with a given number of dynamically
	 * positioned locations.
	 *
	 * Parameters:
	 *
	 * anchorCount  -   optional number of anchors to use to approximate the perimeter. default is 60.
	 * shape        -   required. the name of the shape. valid values are 'rectangle', 'square', 'ellipse', 'circle', 'triangle' and 'diamond'
	 * rotation     -   optional rotation, in degrees, to apply. 
	 */
	jsPlumb.Anchors["Perimeter"] = function(params) {
		params = params || {};
		var anchorCount = params.anchorCount || 60,
			shape = params.shape;
		
		if (!shape) throw new Error("no shape supplied to Perimeter Anchor type");		
		
		var _circle = function() {
                var r = 0.5, step = Math.PI * 2 / anchorCount, current = 0, a = [];
                for (var i = 0; i < anchorCount; i++) {
                    var x = r + (r * Math.sin(current)),
                        y = r + (r * Math.cos(current));                                
                    a.push( [ x, y, 0, 0 ] );
                    current += step;
                }
                return a;	
            },
            _path = function(segments) {
                var anchorsPerFace = anchorCount / segments.length, a = [],
                    _computeFace = function(x1, y1, x2, y2, fractionalLength) {
                        anchorsPerFace = anchorCount * fractionalLength;
                        var dx = (x2 - x1) / anchorsPerFace, dy = (y2 - y1) / anchorsPerFace;
                        for (var i = 0; i < anchorsPerFace; i++) {
                            a.push( [
                                x1 + (dx * i),
                                y1 + (dy * i),
                                0,
                                0
                            ]);
                        }
                    };
								
                for (var i = 0; i < segments.length; i++)
                    _computeFace.apply(null, segments[i]);
														
                return a;					
            },
			_shape = function(faces) {												
                var s = [];
                for (var i = 0; i < faces.length; i++) {
                    s.push([faces[i][0], faces[i][1], faces[i][2], faces[i][3], 1 / faces.length]);
                }
                return _path(s);
			},
			_rectangle = function() {
				return _shape([
					[ 0, 0, 1, 0 ], [ 1, 0, 1, 1 ], [ 1, 1, 0, 1 ], [ 0, 1, 0, 0 ]
				]);		
			};
		
		var _shapes = {
			"Circle":_circle,
			"Ellipse":_circle,
			"Diamond":function() {
				return _shape([
						[ 0.5, 0, 1, 0.5 ], [ 1, 0.5, 0.5, 1 ], [ 0.5, 1, 0, 0.5 ], [ 0, 0.5, 0.5, 0 ]
				]);
			},
			"Rectangle":_rectangle,
			"Square":_rectangle,
			"Triangle":function() {
				return _shape([
						[ 0.5, 0, 1, 1 ], [ 1, 1, 0, 1 ], [ 0, 1, 0.5, 0]
				]);	
			},
			"Path":function(params) {
                var points = params.points, p = [], tl = 0;
				for (var i = 0; i < points.length - 1; i++) {
                    var l = Math.sqrt(Math.pow(points[i][2] - points[i][0]) + Math.pow(points[i][3] - points[i][1]));
                    tl += l;
					p.push([points[i][0], points[i][1], points[i+1][0], points[i+1][1], l]);						
				}
                for (var i = 0; i < p.length; i++) {
                    p[i][4] = p[i][4] / tl;
                }
				return _path(p);
			}
		},
        _rotate = function(points, amountInDegrees) {
            var o = [], theta = amountInDegrees / 180 * Math.PI ;
            for (var i = 0; i < points.length; i++) {
                var _x = points[i][0] - 0.5,
                    _y = points[i][1] - 0.5;
                    
                o.push([
                    0.5 + ((_x * Math.cos(theta)) - (_y * Math.sin(theta))),
                    0.5 + ((_x * Math.sin(theta)) + (_y * Math.cos(theta))),
                    points[i][2],
                    points[i][3]
                ]);
            }
            return o;
        };
		
		if (!_shapes[shape]) throw new Error("Shape [" + shape + "] is unknown by Perimeter Anchor type");
		
		var da = _shapes[shape](params);
        if (params.rotation) da = _rotate(da, params.rotation);
        var a = params.jsPlumbInstance.makeDynamicAnchor(da);
		a.type = "Perimeter";
		return a;
	};
})();