;(function() {					
	
	jsPlumb.Connectors.Flowchart = function(params) {
		params = params || {};
		var self = this, 
		minStubLength = params.minStubLength || 30, 
		segments = [], 
		segmentGradients = [], 
		segmentProportions = [], 
		segmentLengths = [],
		segmentProportionalLengths = [],
		points = [],
		swapX, 
		swapY,
		/**
		 * recalculates the gradients of each segment, and the points at which the segments begin, proportional to the total length travelled 
		 * by all the segments that constitute the connector.   
		 */
		updateSegmentGradientsAndProportions = function(startX, startY, endX, endY) {
			var total = 0;
			for (var i = 0; i < segments.length; i++) {
				var sx = i == 0 ? startX : segments[i][2], 
					sy = i == 0 ? startY : segments[i][3],
					ex = segments[i][0], 
					ey = segments[i][1];
				
				segmentGradients[i] = sx == ex ? Infinity : 0;
				segmentLengths[i] = Math.abs(sx == ex ? ey - sy : ex - sx); 
				total += segmentLengths[i];
			}
			var curLoc = 0;
			for (var i = 0; i < segments.length; i++) {
				segmentProportionalLengths[i] = segmentLengths[i] / total;
				segmentProportions[i] = [curLoc, (curLoc += (segmentLengths[i] / total)) ];
			}
		},
		appendSegmentsToPoints = function() {
			points.push(segments.length);
			for (var i = 0; i < segments.length; i++) {
				points.push(segments[i][0]);
				points.push(segments[i][1]);
			}
		},		
		/**
		 * helper method to add a segment.
		 */
		addSegment = function(x, y, sx, sy, tx, ty) {
			var lx = segments.length == 0 ? sx : segments[segments.length - 1][0];
			var ly = segments.length == 0 ? sy : segments[segments.length - 1][1];
			segments.push([x, y, lx, ly]);
		},
		/**
		 * returns [segment, proportion of travel in segment, segment index] for the segment that contains the point which is 'location' distance along the entire path, where 'location' is
		 * a decimal between 0 and 1 inclusive. in this connector type paths are made up of a list of segments, each of which contributes some fraction to
		 * the total length.  
		 */
		findSegmentForLocation = function(location) {
			var idx = segmentProportions.length - 1, inSegmentProportion = 0;
			for (var i = 0; i < segmentProportions.length; i++) {
				if (segmentProportions[i][1] >= location) {
					idx = i;
					inSegmentProportion = (location - segmentProportions[i][0]) / segmentProportionalLengths[i];
 					break;
				}
			}
			return { segment:segments[idx], proportion:inSegmentProportion, index:idx };
		};
		
		this.compute = function(sourcePos, targetPos, sourceAnchor, targetAnchor, lineWidth, minWidth) {
    	
			segments = [];
			segmentGradients = [];
			segmentProportionalLengths = [];
			segmentLengths = [];
			segmentProportionals = [];
			
            swapX = targetPos[0] < sourcePos[0]; 
            swapY = targetPos[1] < sourcePos[1];
			
			var lw = lineWidth || 1,
            offx = (lw / 2) + (minStubLength * 2), 
            offy = (lw / 2) + (minStubLength * 2),
            so = sourceAnchor.orientation || sourceAnchor.getOrientation(), 
            to = targetAnchor.orientation || targetAnchor.getOrientation(),
            x = swapX ? targetPos[0] : sourcePos[0], 
            y = swapY ? targetPos[1] : sourcePos[1],
            w = Math.abs(targetPos[0] - sourcePos[0]) + 2*offx, 
            h = Math.abs(targetPos[1] - sourcePos[1]) + 2*offy;
            if (w < minWidth) {      
            	offx += (minWidth - w) / 2;
            	w = minWidth;
            }
            if (h < minWidth) {            	
            	offy += (minWidth - h) / 2;
            	h = minWidth;
            }
            sx = swapX ? w-offx  : offx, 
            sy = swapY ? h-offy  : offy, 
            tx = swapX ? offx : w-offx ,
            ty = swapY ? offy : h-offy,
            startStubX = sx + (so[0] * minStubLength), 
            startStubY = sy + (so[1] * minStubLength),
            endStubX = tx + (to[0] * minStubLength), 
            endStubY = ty + (to[1] * minStubLength),
            midx = startStubX + ((endStubX - startStubX) / 2),
            midy = startStubY + ((endStubY - startStubY) / 2);
            
            x -= offx; y -= offy;
            points = [x, y, w, h, sx, sy, tx, ty], extraPoints = [];            
      
            addSegment(startStubX, startStubY, sx, sy, tx, ty);                        
            
            if (so[0] == 0) {        		
        		var startStubIsBeforeEndStub = startStubY < endStubY;             		        	
        		// when start point's stub is less than endpoint's stub
        		if (startStubIsBeforeEndStub) {
        			addSegment(startStubX, midy, sx, sy, tx, ty);
        			addSegment(midx, midy, sx, sy, tx, ty);
        			addSegment(endStubX, midy, sx, sy, tx, ty);
        		} else {
        			// when start point's stub is greater than endpoint's stub
        			addSegment(midx, startStubY, sx, sy, tx, ty);
        			addSegment(midx, endStubY, sx, sy, tx, ty);
        		}
        	}
        	else {
        		var startStubIsBeforeEndStub = startStubX < endStubX;
        		// when start point's stub is less than endpoint's stub
        		if (startStubIsBeforeEndStub) { 
        			addSegment(midx, startStubY, sx, sy, tx, ty);
        			addSegment(midx, midy, sx, sy, tx, ty);
        			addSegment(midx, endStubY, sx, sy, tx, ty);
        		} else {
        			// when start point's stub is greater than endpoint's stub        			
        			addSegment(startStubX, midy, sx, sy, tx, ty);
        			addSegment(endStubX, midy, sx, sy, tx, ty);
        		}
        	}            
            
            addSegment(endStubX, endStubY, sx, sy, tx, ty);
            addSegment(tx, ty, sx, sy, tx, ty);
            
            appendSegmentsToPoints();
            updateSegmentGradientsAndProportions(sx, sy, tx, ty);
            
			return points;
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
	    
	    /**
         * returns the point on the connector's path that is 'location' along the length of the path, where 'location' is a decimal from
         * 0 to 1 inclusive. for this connector we must first figure out which segment the given point lies in, and then compute the x,y position
         * from our knowledge of the segment's start and end points.
         */
        this.pointOnPath = function(location) {
        	return self.pointAlongPathFrom(location, 0);
        };
        
        /**
         * returns the gradient of the connector at the given point; the gradient will be either 0 or Infinity, depending on the direction of the
         * segment the point falls in. segment gradients are calculated in the compute method.  
         */
        this.gradientAtPoint = function(location) { 
        	return segmentGradients[findSegmentForLocation(location)["index"]];
        };
        
        /**
         * returns the point on the connector's path that is 'distance' along the length of the path from 'location', where 
         * 'location' is a decimal from 0 to 1 inclusive, and 'distance' is a number of pixels.  when you consider this concept from the point of view
         * of this connector, it starts to become clear that there's a problem with the overlay paint code: given that this connector makes several
         * 90 degree turns, it's entirely possible that an arrow overlay could be forced to paint itself around a corner, which would look stupid. this is
         * because jsPlumb uses this method (and pointOnPath) so determine the locations of the various points that go to make up an overlay.  a better
         * solution would probably be to just use pointOnPath along with gradientAtPoint, and draw the overlay so that its axis ran along
         * a tangent to the connector.  for straight line connectors this would obviously mean the overlay was painted directly on the connector, since a 
         * tangent to a straight line is the line itself, which is what we want; for this connector, and for beziers, the results would probably be better.  an additional
         * advantage is, of course, that there's less computation involved doing it that way. 
         */
        this.pointAlongPathFrom = function(location, distance) {
        	var s = findSegmentForLocation(location), seg = s.segment, p = s.proportion, sl = segmentLengths[s.index], m = segmentGradients[s.index];        	
        	var e = { 
        		//x 	: m == Infinity ? seg[2] : /*swapX ? seg[2] - (p * sl) - distance : */seg[2] + (p * sl) + distance,
        		
        		x 	: m == Infinity ? seg[2] : seg[2] > seg[0] ? seg[0] + ((1 - p) * sl) - distance : seg[2] + (p * sl) + distance,
        			
        			
        		//y 	: m == 0 ? seg[3] : /*swapY ? seg[3] - (p * sl) - distance : */seg[3] + (p * sl) + distance,
        				y 	: m == 0 ? seg[3] : seg[3] > seg[1] ? seg[1] + ((1 - p) * sl) - distance  : seg[3] + (p * sl) + distance,
        		segmentInfo : s
        	};
        	
        	//console.log("pointalongpath, swapX =" + swapX + ",swapY=" + swapY, "loc", location, "travel", (p * sl), "dist", distance, e.x, e.y, "seg", seg, "len", sl, "prop.", p);
        	
        	return e;
        };
        
        /**
         * calculates a line that is perpendicular to, and centered on, the path at 'distance' pixels from the given location.
         * the line is 'length' pixels long.
         */
        this.perpendicularToPathAt = function(location, length, distance) {
        	var p = self.pointAlongPathFrom(location, distance);
        	var m = segmentGradients[p.segmentInfo.index];
        	var _theta2 = Math.atan(-1 / m);
        	var y =  length / 2 * Math.sin(_theta2);
			var x =  length / 2 * Math.cos(_theta2);
			return [{x:p.x + x, y:p.y + y}, {x:p.x - x, y:p.y - y}];
        	
        };
	};
})();