/**

a flowchart connector for jsPlumb.

*/

(function() {
		
	
	var inPhase = function (o1, o2) {
	    var r = [o1[0] + o2[0], o1[1] + o2[1]];
	    return r[0] == 0 && r[1] == 0;
	};
	
	/**
	 * Returns whether or not either of 'o' or 'o2' have an orientation that is defined in
	 * more than one direction. in that case we just draw a straight line.
	 */
	var notSuitableOrientations = function(o, o2) {
		var _nso = function(o) {
			return Math.abs(o[0]) == Math.abs(o[1]);
		};
		return _nso(o) || _nso(o2);
	};
	
	jsPlumb.Connectors.Flowchart = function(params) {
		params = params || {};
		var minStubLength = params.minStubLength || 30;
		this.compute = function(sourcePos, targetPos, sourceAnchor, targetAnchor, lineWidth) {
			// setup default for linewidth
			lineWidth = lineWidth || 1;
			// and make offsets
			var offx = lineWidth / 2, offy = lineWidth / 2;
			// get points list ready
            var points = [];
            // short vars for access to orientation	
            var so = sourceAnchor.orientation, to = targetAnchor.orientation;
            var swapX = targetPos[0] < sourcePos[0];
            var swapY = targetPos[1] < sourcePos[1];
            var x = swapX ? targetPos[0] : sourcePos[0], y = swapY ? targetPos[1] : sourcePos[1];
            var w = Math.abs(targetPos[0] - sourcePos[0]);
            var h = Math.abs(targetPos[1] - sourcePos[1]);
            //var sx = swapX ? w : 0, sy = 0, tx = swapX ? 0 : w, ty = h;
            var sx = swapX ? w : 0, sy = swapY ? h : 0, tx = swapX ? 0 : w, ty = swapY ? 0 : h;
                        
            var stubLength = h / 2, stubWidth = w / 2;
            if (so[0] == 0 && so[1] == 1 && to[0] == 0 && to[1] == -1) {
            	sy = 0; ty = h;
            	if (sourcePos[1] < targetPos[1]) {
            		// a three line connection
	            	points.push(sx);points.push(sy + stubLength);
	            	points.push(tx);points.push(ty - stubLength);
            	}
            	else {
            		// a five line connection
            		h = minStubLength * 2 + (sourcePos[1] - targetPos[1]);
            		y = targetPos[1] - minStubLength;
            		sy = sourcePos[1] - y;
            		ty = minStubLength;
            		points.push(sx);points.push(sy + minStubLength);
            		points.push(w/2);points.push(sy + minStubLength);
            		points.push(w/2);points.push(0);
            		points.push(tx);points.push(0);
            	}
            }
            else if (so[0] == 0 && so[1] == -1 && to[0] == 0 && to[1] == 1) {
            	sy = h; ty = 0; y = targetPos[1]; 
            	if (sourcePos[1] > targetPos[1]) {
            		// a three line connection
	            	points.push(sx);points.push(sy - stubLength);
	            	points.push(tx);points.push(ty + stubLength);
            	}
            	else {
            		// a five line connection
            		h = minStubLength * 2 + (targetPos[1] - sourcePos[1]);
            		y = sourcePos[1] - minStubLength;
            		sy = minStubLength;
            		ty = h - minStubLength;
            		points.push(sx);points.push(sy - minStubLength);
            		points.push(w/2);points.push(sy - minStubLength);
            		points.push(w/2);points.push(h);
            		points.push(tx);points.push(h);
            	}
            }
            
            // X
            else if (so[0] == 1 && so[1] == 0 && to[0] == -1 && to[1] == 0) {
            	sx = 0; tx = w;
            	if (sourcePos[0] < targetPos[0]) {
            		// a three line connection
	            	points.push(sx+stubWidth);points.push(sy);
	            	points.push(tx-stubWidth);points.push(ty);
            	}
            	else {
            		// a five line connection
            		w = minStubLength * 2 + (sourcePos[0] - targetPos[0]);
            		x = targetPos[0] - minStubLength;
            		sx = sourcePos[0] - x;
            		tx = minStubLength;
            		points.push(sx + minStubLength);points.push(sy);
            		points.push(sx + minStubLength);points.push(h/2);
            		points.push(0);points.push(h/2);
            		points.push(0);points.push(ty);
            	}
            }
            else if (so[0] == -1 && so[1] == 0 && to[0] == 1 && to[1] == 0) {
            	sx = w; tx = 0; x = targetPos[0]; 
            	if (sourcePos[0] > targetPos[0]) {
            		// a three line connection
	            	points.push(sx-stubWidth);points.push(sy);
	            	points.push(tx+stubWidth);points.push(ty);
            	}
            	else {
            		// a five line connection
            		w = minStubLength * 2 + (targetPos[0] - sourcePos[0]);
            		x = sourcePos[0] - minStubLength;
            		sx = minStubLength;
            		tx = w - minStubLength;
            		points.push(sx - minStubLength);points.push(sy);
            		points.push(sx - minStubLength);points.push(h/2);
            		points.push(w);points.push(h/2);
            		points.push(w);points.push(ty);
            	}
            }
            
            
            // first define the basic points - location, width, height, and start/end points.            
            var retVal = [x, y, w, h,sx,sy,tx,ty];
            // then store how many intermediate points we calculated
            retVal.push(points.length / 2);
            // add the intermediate points at the end.
            for (var i = 0; i < points.length; i++)
            	retVal.push(points[i]);
            return retVal;	
		};
		
		this.paint = function(dimensions, ctx) { 
			ctx.beginPath();
            ctx.moveTo(dimensions[4], dimensions[5]);
            // loop through extra points
            for (var i = 0; i < dimensions[8]; i++) {
	            ctx.lineTo(dimensions[9 + (i*2)], dimensions[10 + (i*2)]);
            }
            // finally draw a line to the end
            ctx.lineTo(dimensions[6], dimensions[7]);
            ctx.stroke();
		};
			
	};
	
	/**
	 * Set of Endpoints for Flowcharts.  Currently has one - an arrow, which takes the anchor orientation into account when painting.
	 */
	jsPlumb.Endpoints.Flowchart = {
		
		Arrow : function(params) {
			var width = params.width || 15;
			var length = params.length || 15;
			this.paint = function(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle) { 
				// use the orientation array to determine the rotation of the endpoint.
			};		
		}				
	};
	
})();