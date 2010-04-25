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
		
		this.compute = function(sourcePos, targetPos, sourceAnchor, targetAnchor, lineWidth) { 
			var w = Math.abs(sourcePos[0] - targetPos[0]);
            var h = Math.abs(sourcePos[1] - targetPos[1]);
            // these are padding to ensure the whole connector line appears
            var xo = 0.45 * w, yo = 0.45 * h;
            // these are padding to ensure the whole connector line appears
            w *= 1.9; h *=1.9;
            
            var x = Math.min(sourcePos[0], targetPos[0]) - xo;
            var y = Math.min(sourcePos[1], targetPos[1]) - yo;
            
            if (w < 2 * lineWidth) { 
        		// minimum size is 2 * line Width
        		w = 2 * lineWidth; 
        		// if we set this then we also have to place the canvas
        		x = sourcePos[0]  + ((targetPos[0] - sourcePos[0]) / 2) - lineWidth;
        		xo = (w - Math.abs(sourcePos[0]-targetPos[0])) / 2;;
        	}
            if (h < 2 * lineWidth) { 
        		// minimum size is 2 * line Width
        		h = 2 * lineWidth; 
        		// if we set this then we also have to place the canvas
        		y = sourcePos[1]  + ((targetPos[1] - sourcePos[1]) / 2) - lineWidth;
        		yo = (h - Math.abs(sourcePos[1]-targetPos[1])) / 2;;
        	}
                           
            var sx = sourcePos[0] < targetPos[0] ? w-xo : xo;
            var sy = sourcePos[1] < targetPos[1] ? h-yo : yo;
            var tx = sourcePos[0] < targetPos[0] ? xo : w-xo;
            var ty = sourcePos[1] < targetPos[1] ? yo : h-yo;
            var retVal = [ x, y, w, h, sx, sy, tx, ty ];
                            
            // return [canvasX, canvasY, canvasWidth, canvasHeight, 
            //         sourceX, sourceY, targetX, targetY] 
            
            // but really this should return, after all that:
            // [number_of segments, seg1, seg2, ..., segx]
            // and the paint function should just do a pathTo(..) for each of these.
            
            // here's a test - a line in the direction of the source anchor's orientation.
            var o = sourceAnchor.orientation;
            var o2 = targetAnchor.orientation;
            
            var DEFAULT_STUB_LENGTH = 30;
            
            // flowchart paints a direct line when orientation of one or more anchors is defined
            // in more than one direction.
            if (notSuitableOrientations(o, o2)) {
            	retVal.push(0);
            }
            else if(inPhase(o, o2)) {
	            
            	// 
            	
		            var stubLengthX = Math.max(DEFAULT_STUB_LENGTH, Math.abs(sx-tx) / 2);
		            var stubLengthY = Math.max(DEFAULT_STUB_LENGTH, Math.abs(sy-ty) / 2);
		            retVal.push(2);  // two points between start and end points.
		            retVal.push(sx + o2[0] * stubLengthX);
		            retVal.push(sy + o2[1] * stubLengthY);
		            retVal.push(tx + o[0] * stubLengthX);
		            retVal.push(ty + o[1] * stubLengthY);
		            
		            var ymax = Math.max(retVal[10], retVal[12], retVal[5], retVal[7]);
		            retVal[3] = ymax;
            	
            }
            else {
            	retVal.push(2);  // two points between start and end points.
            	retVal.push(sx + o2[0] * DEFAULT_STUB_LENGTH);
	            retVal.push(sy + o2[1] * DEFAULT_STUB_LENGTH);
	            retVal.push(tx + o[0] * DEFAULT_STUB_LENGTH);
	            retVal.push(ty + o[1] * DEFAULT_STUB_LENGTH);	
            }
            
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
	
})();