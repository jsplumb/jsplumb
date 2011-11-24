/*
state machine connectors

thanks to Brainstorm Mobile Solutions for supporting the development of these.

*/
;(function() {

	/*
		Function: StateMachine constructor
		
		Allowed parameters:
			curviness 		-	measure of how "curvy" the connectors will be.  this is translated as the distance that the
								Bezier curve's control point is from the midpoint of the straight line connecting the two
								endpoints, and does not mean that the connector is this wide.  The Bezier curve never reaches
								its control points; they act as gravitational masses. defaults to 50.
			margin			-	distance from element to start and end connectors, in pixels.  defaults to 5.
			proximityLimit  -   sets the distance beneath which the elements are consider too close together to bother with fancy
			                    curves. by default this is 70 pixels.
	*/
	jsPlumb.Connectors.StateMachine = function(params) {
		var self = this,
		currentPoints = null,
		_m, _m2, _b, _dx, _dy, _theta, _theta2, _sx, _sy, _tx, _ty, _controlX, _controlY,
		curviness = params.curviness || 50,
		margin = params.margin || 5,
		proximityLimit = params.proximityLimit || 70;

		this.type = "StateMachine";
		params = params || {};		
		
		this.compute = function(sourcePos, targetPos, sourceEndpoint, targetEndpoint, sourceAnchor, targetAnchor, lineWidth, minWidth) {
        	var w = Math.abs(sourcePos[0] - targetPos[0]),
            h = Math.abs(sourcePos[1] - targetPos[1]),
            // these are padding to ensure the whole connector line appears
            xo = 0.45 * w, yo = 0.45 * h;
            // these are padding to ensure the whole connector line appears
            w *= 1.9; h *=1.9;
            
            var x = Math.min(sourcePos[0], targetPos[0]) - xo;
            var y = Math.min(sourcePos[1], targetPos[1]) - yo;
            
            // minimum size is 2 * line Width if minWidth was not given.
            var calculatedMinWidth = Math.max(2 * lineWidth, minWidth);
            
            if (w < calculatedMinWidth) { 
        		w = calculatedMinWidth; 
        		x = sourcePos[0]  + ((targetPos[0] - sourcePos[0]) / 2) - (calculatedMinWidth / 2);
        		xo = (w - Math.abs(sourcePos[0]-targetPos[0])) / 2;
        	}
            if (h < calculatedMinWidth) {         
        		h = calculatedMinWidth; 
        		y = sourcePos[1]  + ((targetPos[1] - sourcePos[1]) / 2) - (calculatedMinWidth / 2);
        		yo = (h - Math.abs(sourcePos[1]-targetPos[1])) / 2;
        	}
                            
            _sx = sourcePos[0] < targetPos[0] ?  xo : w-xo;
            _sy = sourcePos[1] < targetPos[1] ? yo:h-yo;
            _tx = sourcePos[0] < targetPos[0] ? w-xo : xo;
            _ty = sourcePos[1] < targetPos[1] ? h-yo : yo;
            
            // now adjust for the margin
            if (sourcePos[2] == 0) _sx -= margin;
            if (sourcePos[2] == 1) _sx += margin;
            if (sourcePos[3] == 0) _sy -= margin;
            if (sourcePos[3] == 1) _sy += margin;
            if (targetPos[2] == 0) _tx -= margin;
            if (targetPos[2] == 1) _tx += margin;
            if (targetPos[3] == 0) _ty -= margin;
            if (targetPos[3] == 1) _ty += margin;

            //
            // these connectors are quadratic bezier curves, having a single control point. if both anchors 
            // are located at 0.5 on their respective faces, the control point is set to the midpoint and you
            // get a straight line.  this is also the case if the two anchors are within 'proximityLimit', since
            // it seems to make good aesthetic sense to do that. outside of that, the control point is positioned 
            // at 'curviness' pixels away along the normal to the straight line connecting the two anchors.
            // 
            // there may be two improvements to this.  firstly, we might actually support the notion of avoiding nodes
            // in the UI, or at least making a good effort at doing so.  if a connection would pass underneath some node,
            // for example, we might increase the distance the control point is away from the midpoint in a bid to
            // steer it around that node.  this will work within limits, but i think those limits would also be the likely
            // limits for, once again, aesthetic good sense in the layout of a chart using these connectors.
            //
            // the second possible change is actually two possible changes: firstly, it is possible we should gradually
            // decrease the 'curviness' as the distance between the anchors decreases; start tailing it off to 0 at some
            // point (which should be configurable).  secondly, we might slightly increase the 'curviness' for connectors
            // with respect to how far their anchor is from the center of its respective face. this could either look cool,
            // or stupid, and may indeed only work in a way that is so subtle as to have been a waste of time.
            //

			var _findMultipliers = function(anchorX, anchorY, otherAnchorX, otherAnchorY) {
				return [
					anchorX < 0.5 ? -1 : (anchorX == 0.5 && otherAnchorX == 0.5) ? 0 : 1,
					anchorY < 0.5 ? -1 : (anchorY == 0.5 && otherAnchorY == 0.5) ? 0 : 1
				];					
			},
            _midx = (_sx + _tx) / 2, _midy = (_sy + _ty) / 2, 
            m2 = (-1 * _midx) / _midy, theta2 = Math.atan(m2),            
            dy =  Math.abs(curviness / 2 * Math.sin(m2)),
			dx =  Math.abs(curviness / 2 * Math.cos(m2)),
			multz = _findMultipliers(sourcePos[2], sourcePos[3], targetPos[2], targetPos[3]),
			distance = Math.sqrt(Math.pow(_tx - _sx, 2) + Math.pow(_ty - _sy, 2));

            // TODO reinstate this code, which should alter the curviness based on the anchor's distance from the center of the edge
            // on which it is located.  also
            /*if (sourcePos[2] > 0 && sourcePos[2] < 1)
            	_midx += (sourcePos[2] - 0.5) * maxControlChange;
            if (sourcePos[3] > 0 && sourcePos[3] < 1)
            	_midy += (sourcePos[3] - 0.5) * maxControlChange;*/
            	            	
            // calculate the control point.  this code will be where we'll put in a rudimentary element avoidance scheme; it
            // will work by extending the control point to force the curve to be, um, curvier.
            _controlX = _midx + ((distance > proximityLimit) ? (multz[0] * dx) : 0);
			_controlY = _midy + ((distance > proximityLimit) ? (multz[1] * dy) : 0) ;
            
            currentPoints = [ x, y, w, h, _sx, _sy, _tx, _ty, _controlX, _controlY ];                        
                             
            return currentPoints;
        };
        
        var _makeCurve = function() {
        	return [	
	        	{ x:_tx, y:_ty },
	        	{ x:_controlX, y:_controlY },
	        	{ x:_controlX + 1, y:_controlY + 1},	        	
	        	{ x:_sx, y:_sy }
         	];
        };     
        
        /**
         * returns the point on the connector's path that is 'location' along the length of the path, where 'location' is a decimal from
         * 0 to 1 inclusive. for the straight line connector this is simple maths.  for Bezier, not so much.
         */
        this.pointOnPath = function(location) {        	
        	return jsBezier.pointOnCurve(_makeCurve(), location);
        };
        
        /**
         * returns the gradient of the connector at the given point.
         */
        this.gradientAtPoint = function(location) {
        	return jsBezier.gradientAtPoint(_makeCurve(), location);        	
        };	
        
        /**
         * for Bezier curves this method is a little tricky, cos calculating path distance algebraically is notoriously difficult.
         * this method is iterative, jumping forward .05% of the path at a time and summing the distance between this point and the previous
         * one, until the sum reaches 'distance'. the method may turn out to be computationally expensive; we'll see.
         * another drawback of this method is that if the connector gets quite long, .05% of the length of it is not necessarily smaller
         * than the desired distance, in which case the loop returns immediately and the arrow is mis-shapen. so a better strategy might be to
         * calculate the step as a function of distance/distance between endpoints.  
         */
        this.pointAlongPathFrom = function(location, distance) {        	
        	return jsBezier.pointAlongCurveFrom(_makeCurve(), location, distance);
        };        
        
        /**
         * calculates a line that is perpendicular to, and centered on, the path at 'distance' pixels from the given location.
         * the line is 'length' pixels long.
         */
        this.perpendicularToPathAt = function(location, length, distance) {        	
        	return jsBezier.perpendicularToCurveAt(_makeCurve(), location, length, distance);
        };
	
	
	};
	
	/*
     * Canvas state machine renderer. 
     */
    jsPlumb.Connectors.canvas.StateMachine = function() {   	 
		var self = this;
		jsPlumb.Connectors.StateMachine.apply(this, arguments);
		jsPlumb.CanvasConnector.apply(this, arguments);
		this._paint = function(dimensions) {
		
	        self.ctx.beginPath();
			self.ctx.moveTo(dimensions[4], dimensions[5]);
			self.ctx.quadraticCurveTo(dimensions[8], dimensions[9], dimensions[6], dimensions[7]);
	        self.ctx.stroke();            
	    };	    
	    
	    this.createGradient = function(dim, ctx) {
        	return ctx.createLinearGradient(dim[4], dim[5], dim[6], dim[7]);
        };
    };
    
    /*
     * SVG State Machine renderer
     */
    jsPlumb.Connectors.svg.StateMachine = function() {   	 
		var self = this;
		jsPlumb.Connectors.StateMachine.apply(this, arguments);
		jsPlumb.SvgConnector.apply(this, arguments);
		this.getPath = function(d) { return "M " + d[4] + " " + d[5] + " C " + d[8] + " " + d[9] + " " + d[8] + " " + d[9] + " " + d[6] + " " + d[7]; };	    	    
    };
    
    /*
     * VML state macine renderer
     */
    jsPlumb.Connectors.vml.StateMachine = function() {
		jsPlumb.Connectors.StateMachine.apply(this, arguments);	
		jsPlumb.VmlConnector.apply(this, arguments);
		var _conv = jsPlumb.vml.convertValue;
		this.getPath = function(d) {			
			return "m" + _conv(d[4]) + "," + _conv(d[5]) + 
				   " c" + _conv(d[8]) + "," + _conv(d[9]) + "," + _conv(d[8]) + "," + _conv(d[9]) + "," + _conv(d[6]) + "," + _conv(d[7]) + " e";
		};
	};

})();