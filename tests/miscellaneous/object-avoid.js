

/*

 From the state machine connectors:

 // a possible rudimentary avoidance scheme, old now, perhaps not useful.
 //      if (avoidSelector) {
 //		    var testLine = new Line(sourcePos[0] + _sx,sourcePos[1] + _sy,sourcePos[0] + _tx,sourcePos[1] + _ty);
 //		    var sel = jsPlumb.getSelector(avoidSelector);
 //		    for (var i = 0; i < sel.length; i++) {
 //			    var id = jsPlumb.getId(sel[i]);
 //			    if (id != sourceEndpoint.elementId && id != targetEndpoint.elementId) {
 //				    o = jsPlumb.getOffset(id), s = jsPlumb.getSize(id);
 //
 //						    if (o && s) {
 //							    var collision = testLine.rectIntersect(o.left,o.top,s[0],s[1]);
 //							    if (collision) {
 // set the control point to be a certain distance from the midpoint of the two points that
 // the line crosses on the rectangle.
 // TODO where will this 75 number come from?
 //			    _controlX = collision[2][0] + (75 * collision[3][0]);
 //	/			    _controlY = collision[2][1] + (75 * collision[3][1]);
 //							    }
 //						    }
 //  }
 //			    }
 //}
 */


/*
 Line = function(x1, y1, x2, y2) {

 this.m = (y2 - y1) / (x2 - x1);
 this.b = -1 * ((this.m * x1) - y1);

 this.rectIntersect = function(x,y,w,h) {
 var results = [], xInt, yInt;

 // 	try top face
 // 	the equation of the top face is y = (0 * x) + b; y = b.
 xInt = (y - this.b) / this.m;
 // test that the X value is in the line's range.
 if (xInt >= x && xInt <= (x + w)) results.push([ xInt, (this.m * xInt) + this.b ]);

 // try right face
 yInt = (this.m * (x + w)) + this.b;
 if (yInt >= y && yInt <= (y + h)) results.push([ (yInt - this.b) / this.m, yInt ]);

 // 	bottom face
 xInt = ((y + h) - this.b) / this.m;
 // test that the X value is in the line's range.
 if (xInt >= x && xInt <= (x + w)) results.push([ xInt, (this.m * xInt) + this.b ]);

 // try left face
 yInt = (this.m * x) + this.b;
 if (yInt >= y && yInt <= (y + h)) results.push([ (yInt - this.b) / this.m, yInt ]);

 if (results.length == 2) {
 var midx = (results[0][0] + results[1][0]) / 2, midy = (results[0][1] + results[1][1]) / 2;
 results.push([ midx,midy ]);
 // now calculate the segment inside the rectangle where the midpoint lies.
 var xseg = midx <= x + (w / 2) ? -1 : 1,
 yseg = midy <= y + (h / 2) ? -1 : 1;
 results.push([xseg, yseg]);
 return results;
 }

 return null;

 };
 }
 */