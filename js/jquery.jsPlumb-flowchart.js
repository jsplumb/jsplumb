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
            if (so[0] == 0 && to[0] == 0) {
            	if (so[1] == 1 && to[1] == -1) {            		
            		retVal = [sourcePos[0]-offx, sourcePos[1]-offy, w, h, offx, offy, w-offx,h-offy];
            		var ydiff = Math.abs(targetPos[1] - sourcePos[1]);
            		var stubLength = Math.max(ydiff/2, 30);
            		if (offy + stubLength <= h - offy -stubLength) {            			
            			retVal.push(2);
            			retVal.push(offx);
            			retVal.push(offy + stubLength);
            			retVal.push(w-offx);
            			retVal.push(h - offy -stubLength);
            		}
            		else {
            			retVal.push(4);
            			
            			retVal.push(offx);
            			retVal.push(offy + stubLength);
            			
            			retVal.push(w/2);
            			retVal.push(offy + stubLength);
            			
            			retVal.push(w/2);
            			retVal.push(h - offy -stubLength);
            			
            			retVal.push(w-offx);
            			retVal.push(h - offy -stubLength);
            		}
            	}
            	else if (so[1] == -1 && to[1] == 1) {
            		retVal = [sourcePos[0]-offx, sourcePos[1]-offy, w, h, offx, offy, w-offx,h-offy];
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
            	}
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