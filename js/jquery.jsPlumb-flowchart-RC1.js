/**

a flowchart connector for jsPlumb.

this is NOT FINISHED.  it doesnt support all combinations of anchor orientations, and the code that is here can definitely be refactored.

*/

(function() {
		
	
    var perpendicular = function(o1, o2) {
		
    };
	
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
            var so = sourceAnchor.orientation || sourceAnchor.getOrientation(), to = targetAnchor.orientation || targetAnchor.getOrientation();
            var swapX = targetPos[0] < sourcePos[0];
            var swapY = targetPos[1] < sourcePos[1];
            var x = swapX ? targetPos[0] : sourcePos[0], y = swapY ? targetPos[1] : sourcePos[1];
            x -= offx;
            y -= offy;
            var w = Math.abs(targetPos[0] - sourcePos[0]) + 2*offx;
            var h = Math.abs(targetPos[1] - sourcePos[1]) + 2*offy;
            var sx = swapX ? w-offx  : offx, sy = swapY ? h-offy  : offy, tx = swapX ? offx : w-offx , ty = swapY ? offy : h-offy;
            params.offsetLine=[0,0,0];
            
            
            if (!notSuitableOrientations(so, to)) {                     
                if (perpendicular(so,to)) {
                }
                else {
            
                    var stubLength = h / 2, stubWidth = w / 2;
                    
                    if (so[0] == 0 && so[1] == 1 && to[0] == 0 && to[1] == -1) {
                        sy = 0;
                        ty = h;
                        if (sourcePos[1] < targetPos[1]) {
                            // a three line connection
                            points.push(sx);points.push(sy + stubLength);
                            points.push(tx);points.push(ty - stubLength);
                            
                        }
                        else {
                            // a five line connection
                            h = minStubLength * 2 + (sourcePos[1] - targetPos[1]) + 2*offy;
                            y = targetPos[1] - minStubLength;
                            sy = sourcePos[1] - y - offy;
                            ty = minStubLength + 2*offy;
                            points.push(sx);points.push(sy + minStubLength+params.offsetLine[0]);
                            points.push(w/2+params.offsetLine[1]);points.push(sy + minStubLength+params.offsetLine[0]);
                            points.push(w/2+params.offsetLine[1]);points.push(offy+params.offsetLine[2]);
                            points.push(tx);points.push(offy+params.offsetLine[2]);
                            
                        }
                    }
                    else if (so[0] == 0 && so[1] == -1 && to[0] == 0 && to[1] == 1) {
                        sy = h;
                        ty = 0;
                        y = targetPos[1];
                        if (sourcePos[1] > targetPos[1]) {
                            // a three line connection
                            points.push(sx);points.push(sy - stubLength);
                            points.push(tx);points.push(ty + stubLength);
                        }
                        else {
                            // a five line connection
                            h = minStubLength * 2 + (targetPos[1] - sourcePos[1]) + offy;
                            y = sourcePos[1] - minStubLength - offy;
                            sy = minStubLength + offy;
                            ty = h - minStubLength -  2*offy;
                            points.push(sx);points.push(sy - minStubLength + offy+params.offsetLine[0]);
                            points.push(w/2+params.offsetLine[1]);points.push(sy - minStubLength + offy+params.offsetLine[0]);
                            points.push(w/2+params.offsetLine[1]);points.push(h - offy+params.offsetLine[2]);
                            points.push(tx);points.push(h - offy+params.offsetLine[2]);
                        }
                    }

                    // X
                    else if (so[0] == 1 && so[1] == 0 && to[0] == -1 && to[1] == 0) {
                        sx = 0;
                        tx = w;
                        if (sourcePos[0] < targetPos[0]) {
                            points.push(sx+stubWidth);points.push(sy);
                            points.push(tx-stubWidth);points.push(ty);
                        }
                        else {
                            w = minStubLength * 2 + (sourcePos[0] - targetPos[0]) + 2*offx;
                            x = targetPos[0] - minStubLength - offx;
                            sx = sourcePos[0] - x;
                            tx = minStubLength + offx;
                            points.push(sx + minStubLength+params.offsetLine[0]);points.push(sy);
                            points.push(sx + minStubLength+params.offsetLine[0]);points.push(h/2+params.offsetLine[1]);
                            points.push(offx+params.offsetLine[2]);points.push(h/2+params.offsetLine[1]);
                            points.push(offx+params.offsetLine[2]);points.push(ty);
                        }
                    }
                    else if (so[0] == -1 && so[1] == 0 && to[0] == 1 && to[1] == 0) {
                        sx = w;
                        tx = 0;
                        x = targetPos[0];
                        if (sourcePos[0] > targetPos[0]) {
                            points.push(sx-stubWidth);points.push(sy);
                            points.push(tx+stubWidth);points.push(ty);
                        }
                        else {
                            w = minStubLength * 2 + (targetPos[0] - sourcePos[0]) + 2*offx;
                            x = sourcePos[0] - minStubLength - offx;
                            sx = minStubLength + offx;
                            tx = w - minStubLength  -  2*offx;
                            points.push(sx - minStubLength+params.offsetLine[0]);points.push(sy);
                            points.push(sx - minStubLength+params.offsetLine[0]);points.push(h/2+params.offsetLine[1]);
                            points.push(w-offx+params.offsetLine[2]);points.push(h/2+params.offsetLine[1]);
                            points.push(w-offx+params.offsetLine[2]);points.push(ty);
                        }
                    }else if(so[0] == 0 && so[1] == 1 && to[0]==1 && to[1]==0){

                        sy = 0;
                        ty = h;
                        if (sourcePos[1] < targetPos[1]) {
                            
                            // a three line connection
                            points.push(sx);points.push(sy + stubLength);
                            points.push(tx+20+params.offsetLine[0]);points.push(ty - stubLength);
                            points.push(tx+20+params.offsetLine[0]);points.push(ty);
                        }
                        else {
                            h = minStubLength * 2 + (sourcePos[1] - targetPos[1]) + 2*offy;
                            y = targetPos[1] - minStubLength;
                            sy = sourcePos[1] - y - offy;
                            ty = minStubLength + 2*offy;
                            //points.push(sx);points.push(sy + minStubLength+params.offsetLine[0]);
                            //points.push(w+20+params.offsetLine[1]);points.push(sy + minStubLength+params.offsetLine[0]);
                            //points.push(w+20+params.offsetLine[1]);points.push(offy+30);

                            points.push(sx);points.push(sy + 20+params.offsetLine[0]);
                            if(sx>tx){
                                
                                points.push((sx+tx)/2);points.push(sy+20);
                                points.push((sx+tx)/2);points.push(ty);
                                
                            }else{
                                points.push(tx+20);points.push(sy+20);
                            }
                            points.push(tx+20);points.push(ty);
                        }
                    }else if(so[0] == 0 && so[1] == -1 && to[0]==1 && to[1]==0){

                        sy = 0;
                        ty = h;
                        if (sourcePos[1] < targetPos[1]) {
                            sy+=20;
                            ty+=20;
                            h+=20;
                            y-=20;
                            points.push(sx);points.push(sy-20+params.offsetLine[0]);
                            points.push(tx+20+params.offsetLine[1]);points.push(sy-20+params.offsetLine[0]);
                            points.push(tx+20+params.offsetLine[1]);points.push(ty);

                        }
                        else {
                            h = minStubLength * 2 + (sourcePos[1] - targetPos[1]) + 2*offy;
                            y = targetPos[1] - minStubLength;
                            sy = sourcePos[1] - y - offy;
                            ty = minStubLength + 2*offy;
                            points.push(sx);points.push(sy -20+params.offsetLine[0]);
                            points.push(w+20+params.offsetLine[1]);points.push(sy -20+params.offsetLine[0]);
                            points.push(w+20+params.offsetLine[1]);points.push(offy+30);
                        }
                    }else if(so[0] == 1 && so[1] == 0 && to[0]==1 && to[1]==0){

                        sy = 0;
                        ty = h;
                        if (sourcePos[1] < targetPos[1]) {
                                points.push(sx+20+params.offsetLine[0]);points.push(sy);
                                points.push(sx+20+params.offsetLine[0]);points.push(ty);
                        }
                        else {
                            h = minStubLength * 2 + (sourcePos[1] - targetPos[1]) + 2*offy;
                            y = targetPos[1] - minStubLength;
                            sy = sourcePos[1] - y - offy;
                            ty = minStubLength + 2*offy;
                            points.push(w+20+params.offsetLine[0]);points.push(sy);
                            points.push(w+20+params.offsetLine[0]);points.push(offy+30);
                        }
                    }else if(so[0] == -1 && so[1] == 0 && to[0]==0 && to[1]==-1){

                        sy = 0;
                        ty = h;
                        if (sourcePos[1] < targetPos[1]) {
                            points.push(sx);points.push(sy+h/2+params.offsetLine[0]);
                            points.push(tx);points.push(sy+h/2+params.offsetLine[0]);
                        }
                        else {
                            h = minStubLength * 2 + (sourcePos[1] - targetPos[1]) + 2*offy;
                            y = targetPos[1] - minStubLength;
                            sy = sourcePos[1] - y - offy;
                            ty = minStubLength + 2*offy;

                            points.push(sx);points.push(ty-20+params.offsetLine[0]);
                            points.push(tx);points.push(ty-20+params.offsetLine[0]);

                        }
                    }else if(so[0] == 1 && so[1] == 0 && to[0]==0 && to[1]==-1){

                        sy = 0;
                        ty = h;
                        if (sourcePos[1] < targetPos[1]) {

                            points.push(sx+20+params.offsetLine[0]);points.push(sy);
                            points.push(sx+20+params.offsetLine[0]);points.push(sy+h/2+params.offsetLine[1]);
                            points.push(tx);points.push(sy+h/2+params.offsetLine[1]);
                        }
                        else {
                            h = minStubLength * 2 + (sourcePos[1] - targetPos[1]) + 2*offy;
                            y = targetPos[1] - minStubLength;
                            sy = sourcePos[1] - y - offy;
                            ty = minStubLength + 2*offy;

                            points.push(sx+20+params.offsetLine[0]);points.push(sy);
                            points.push(sx+20+params.offsetLine[0]);points.push(ty-20+params.offsetLine[1]);
                            points.push(tx);points.push(ty-20+params.offsetLine[1]);
                        }
                    }else if(so[0] == 0 && so[1] == -1 && to[0]==0 && to[1]==-1){

                        sy = 0;
                        ty = h;

                        if (sourcePos[1] < targetPos[1]) {


                            points.push(sx);points.push(sy+params.offsetLine[0]);
                            points.push(tx+params.offsetLine[1]);points.push(sy+params.offsetLine[0]);
                            points.push(tx+params.offsetLine[1]);points.push(sy+h/2);
                            sy+=20;
                            ty+=20;
                            h+=20;
                            y-=20;
                        }
                        else {

                            h = minStubLength * 2 + (sourcePos[1] - targetPos[1]) + 2*offy;
                            y = targetPos[1] - minStubLength;
                            sy = sourcePos[1] - y - offy;
                            ty = minStubLength + 2*offy;


                            points.push(sx);points.push(ty-20+params.offsetLine[0]);
                            points.push(tx);points.push(ty-20+params.offsetLine[0]);

                        }
                    }else if(so[0] == 0 && so[1] == -1 && to[0]==-1 && to[1]==0){

                        sy = 0;
                        ty = h;

                        if (sourcePos[1] < targetPos[1]) {
                            sy+=20;
                            ty+=20;
                            h+=20;
                            y-=20;
                            x-=20;
                            sx+=20;
                            tx+=20;
                            points.push(sx);points.push(sy-20+params.offsetLine[0]);
                            points.push(tx-20+params.offsetLine[1]);points.push(sy-20+params.offsetLine[0]);
                            points.push(tx-20+params.offsetLine[1]);points.push(ty);
                        }
                        else {

                            h = minStubLength * 2 + (sourcePos[1] - targetPos[1]) + 2*offy;
                            y = targetPos[1] - minStubLength;
                            sy = sourcePos[1] - y - offy;
                            ty = minStubLength + 2*offy;


                            x-=20;
                            sx+=20;
                            tx+=20;
                            points.push(sx);points.push(sy-20+params.offsetLine[0]);
                            points.push(tx-20+params.offsetLine[1]);points.push(sy-20+params.offsetLine[0]);
                            points.push(tx-20+params.offsetLine[1]);points.push(ty);
                        }
                    }




                    else {
                    }

                }
            }
            
            w+=20;
            // first define the basic points - location, width, height, and start/end points.            
            var retVal = [x, y, w, h, sx, sy, tx, ty];
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
