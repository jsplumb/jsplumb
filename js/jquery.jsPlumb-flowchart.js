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
			
			lineWidth = lineWidth || 1;
			var offx = lineWidth / 2, offy = lineWidth / 2;
			var retVal = [];
			var w = Math.abs(sourcePos[0] - targetPos[0]) + lineWidth;
			var h = Math.abs(sourcePos[1] - targetPos[1]) + lineWidth;
            var so = sourceAnchor.orientation, to = targetAnchor.orientation;
            var x = Math.min(sourcePos[0], targetPos[0])- offx, y = Math.min(sourcePos[1], targetPos[1]) - offy;
            var sx = sourcePos[0] < targetPos[0] ? offx : w-offx;
            var sy = sourcePos[1] < targetPos[1] ? offy : h-offy;
            var tx = sourcePos[0] < targetPos[0] ? w-offx : offx;
            var ty = sourcePos[1] < targetPos[1] ? h-offy : offy;
            var points = [];
            if (so[0] == 0 && to[0] == 0) {
            	if (so[1] == 1 && to[1] == -1) {            		
            		
            		var ydiff = Math.abs(targetPos[1] - sourcePos[1]);
            		var stubLength = Math.max(ydiff/2, 30);
             		if (offy + stubLength <= h - offy -stubLength) {            			
            			
            			points.push(sx);
            			points.push(sy + stubLength);
            			points.push(tx);
            			points.push(ty-stubLength);
            		}
            		else {
            			
            			if (h < stubLength) {
            				y -= (stubLength - h);
            				sy += (stubLength - h);
            				h = stubLength * 2;            				
            			}
            			
            			points.push(sx);
            			points.push(sy + stubLength);
            			
            			points.push(w/2);
            			points.push(sy + stubLength);
            			
            			points.push(w/2);
            			points.push(ty -stubLength);
            			
            			points.push(tx);
            			points.push(ty -stubLength);
            			
            			
            		}
            	}
            	/*else if (so[1] == -1 && to[1] == 1) {
            		retVal = [sourcePos[0]-offx, sourcePos[1]-offy, w, h, sx,sy,tx,ty];
            		var ydiff = Math.abs(targetPos[1] - sourcePos[1]);
            		var stubLength = Math.max(ydiff/2, 30);
            		if (offy + stubLength < h - offy -stubLength) {            			                	
            			retVal.push(2);
            			retVal.push(offx);
            			retVal.push(offy + stubLength);
            			retVal.push(w-offx);
            			retVal.push(h - offy -stubLength);
            		}
            		else { alert("no"); retVal.push(0); }
            	}*/
            }
            
            retVal = [x, y, w, h, sx, sy, tx,ty];
            retVal.push(points.length / 2);
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
	
})();