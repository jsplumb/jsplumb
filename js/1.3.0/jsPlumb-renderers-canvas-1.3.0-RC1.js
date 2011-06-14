;(function() {
	
// ********************************* CANVAS RENDERERS FOR CONNECTORS AND ENDPOINTS *******************************************************************
	
	/*
	 * Class:CanvasMouseAdapter
	 * Mixin that provides support for mouse events on canvases/vml.  When the renderMode is set to SVG, modern browsers will render
	 * SVG and jsPlumb will use the SVGMouseAdapter class instead.  Of course IE<9 cannot use SVG, and in that case we use VML, as if the
	 * renderMode had been set to canvas (what jsPlumb actually does right now is set the renderMode to canvas if it detects old IE; what it
	 * will do in the future is actually render its own VML. there are many reasons to do this internally and not rely on excanvas).  
	 */
	var _connectionBeingDragged = null;
	var _getAttribute = function(el, attName) { return jsPlumb.CurrentLibrary.getAttribute(_getElementObject(el), attName); };
	var _setAttribute = function(el, attName, attValue) { jsPlumb.CurrentLibrary.setAttribute(_getElementObject(el), attName, attValue); };
	var _addClass = function(el, clazz) { jsPlumb.CurrentLibrary.addClass(_getElementObject(el), clazz); };
	var _hasClass = function(el, clazz) { return jsPlumb.CurrentLibrary.hasClass(_getElementObject(el), clazz); };
	var _removeClass = function(el, clazz) { jsPlumb.CurrentLibrary.removeClass(_getElementObject(el), clazz); };
	var _getElementObject = function(el) { return jsPlumb.CurrentLibrary.getElementObject(el); };
	var _getOffset = function(el) { return jsPlumb.CurrentLibrary.getOffset(_getElementObject(el)); };
	var _getSize = function(el) { return jsPlumb.CurrentLibrary.getSize(_getElementObject(el)); };		

	var CanvasMouseAdapter = function() {
		var self = this;
		jsPlumb.jsPlumbUIComponent.apply(this, arguments);
		/**
		 * returns whether or not the given event is over a painted area of the canvas. 
		 */
	    this._over = function(e) {		    			  		    	
	    	var o = _getOffset(_getElementObject(self.canvas));
	    	var pageXY = jsPlumb.CurrentLibrary.getPageXY(e);
	    	var x = pageXY[0] - o.left, y = pageXY[1] - o.top;
	    	if (x > 0 && y > 0 && x < self.canvas.width && y < self.canvas.height) {
		    	// first check overlays
		    	for ( var i = 0; i < self.overlayPlacements.length; i++) {
		    		var p = self.overlayPlacements[i];
		    		if (p && (p[0] <= x && p[1] >= x && p[2] <= y && p[3] >= y))
		    			return true;
		    	}
		    	
		    	if (!ie) {
			    	// then the canvas
			    	var d = self.canvas.getContext("2d").getImageData(parseInt(x), parseInt(y), 1, 1);
			    	return d.data[0] != 0 || d.data[1] != 0 || d.data[2] != 0 || d.data[3] != 0;
		    	}
		    	else {
		    		// we would need to get fancy with the vml.
		    	}
	    	}
	    	return false;
	    };
	    
	    var _mouseover = false;
	    var _mouseDown = false, /*_mouseDownAt = null, */_posWhenMouseDown = null, _mouseWasDown = false;
	    this.mousemove = function(e) {	
	    	
	    	var jpcl = jsPlumb.CurrentLibrary;
	    	var pageXY = jpcl.getPageXY(e);
			var ee = document.elementFromPoint(pageXY[0], pageXY[1]);
			var _continue = _connectionBeingDragged == null && (_hasClass(ee, "_jsPlumb_endpoint") || _hasClass(ee, "_jsPlumb_connector"));
			
			/*if (_mouseDown) {
				_mouseWasDown = true;
				_connectionBeingDragged = self;				
				var mouseNow = jpcl.getPageXY(e);
				var dx = mouseNow[0] - _mouseDownAt[0];
				var dy = mouseNow[1] - _mouseDownAt[1];
				
				if (self.movePositionBy) self.movePositionBy(dx, dy);										
			}*/				
			//else 
				if (!_mouseover && _continue && self._over(e)) {
				_mouseover = true;
			//	self.setHover(_mouseover);
				self.fire("mouseenter", self, e);				
			}
			else if (_mouseover && (!self._over(e) || !_continue)) {
				_mouseover = false;
				//self.setHover(_mouseover);
				self.fire("mouseexit", self, e);				
			}
			self.fire("mousemove", self, e);
	    };
	    		    		    
	    this.click = function(e) {
	    	if (_mouseover && self._over(e) && !_mouseWasDown) 
	    		self.fire("click", self, e);		    	
	    	_mouseWasDown = false;
	    };
	    
	    this.dblclick = function(e) {
	    	if (_mouseover && self._over(e) && !_mouseWasDown) 
	    		self.fire("dblclick", self, e);		    	
	    	_mouseWasDown = false;
	    };
	    
	    this.mousedown = function(e) {
	    	if(self._over(e) && !_mouseDown) {
	    		_mouseDown = true;
	    		
	    		_posWhenMouseDown = jsPlumb.CurrentLibrary.getOffset(jsPlumb.CurrentLibrary.getElementObject(self.canvas));
	    			
	    		self.fire("mousedown", self, e);
	    	}
	    };
	    
	    this.mouseup = function(e) {
	    	//if (self == _connectionBeingDragged) _connectionBeingDragged = null;
	    	_mouseDown = false;
	    	self.fire("mouseup", self, e);
	    };					    
	};
	
	var ie = !!!document.createElement('canvas').getContext;
	var _newCanvas = function(params) {
		var canvas = document.createElement("canvas");
		jsPlumb.appendElement(canvas, params.container);
		canvas.style.position = "absolute";
		if (params["class"]) canvas.className = params["class"];
		// set an id. if no id on the element and if uuid was supplied it
		// will be used, otherwise we'll create one.
		jsPlumb.getId(canvas, params.uuid);
		if (ie) {
			// for IE we have to set a big canvas size. actually you can
			// override this, too, if 1200 pixels
			// is not big enough for the biggest connector/endpoint canvas
			// you have at startup.
			jsPlumb.sizeCanvas(canvas, 0, 0, 1200,1200);
			canvas = G_vmlCanvasManager.initElement(canvas);
		}

		return canvas;
	};	
	
	var CanvasConnector = jsPlumb.CanvasConnector = function(params) {
		
		CanvasMouseAdapter.apply(this, arguments);
		
		var _paintOneStyle = function(dim, aStyle) {
			self.ctx.save();
			jsPlumb.extend(self.ctx, aStyle);
			if (aStyle.gradient && !ie) {
				var g = self.createGradient(dim, self.ctx/*, false/*(elId == this.sourceId)*/);
				for ( var i = 0; i < aStyle.gradient.stops.length; i++)
					g.addColorStop(aStyle.gradient.stops[i][0], aStyle.gradient.stops[i][1]);
				self.ctx.strokeStyle = g;
			}
			self._paint(dim);
			self.ctx.restore();
		};

		var self = this;
		//TODO change jsPlumb ref to _currentInstance; fix container.
		self.canvas = _newCanvas({"class":jsPlumb.connectorClass, container:self.container});	
		self.ctx = self.canvas.getContext("2d");
		
		self.paint = function(dim, style) {						
			if (style != null) {
				jsPlumb.sizeCanvas(self.canvas, dim[0], dim[1], dim[2], dim[3])
				_paintOneStyle(dim, style);
			}
		};
	};		
	
	var CanvasEndpoint = function(params) {
		var self = this;				
		CanvasMouseAdapter.apply(this, arguments);		
		//TODO change jsPlumb ref to _currentInstance; fix container.
		self.canvas = _newCanvas({"class":jsPlumb.endpointClass, container:self.container});	
		self.ctx = self.canvas.getContext("2d");
		
		this.paint = function(d, style, anchor) {
			jsPlumb.sizeCanvas(self.canvas, d[0], d[1], d[2], d[3]);
			this._paint.apply(this, arguments);
		};
	};
	
	jsPlumb.Endpoints.canvas.Dot = function(params) {
		var self = this;		
		jsPlumb.Endpoints.Dot.apply(this, arguments);
		CanvasEndpoint.apply(this, arguments);
		var parseValue = function(value) {
			try {
				return parseInt(value); 
			}
			catch(e) {
				if (value.substring(value.length - 1) == '%')
					return parseInt(value.substring(0, value - 1));
			}
		};					    	
		var calculateAdjustments = function(gradient) {
			var offsetAdjustment = self.defaultOffset, innerRadius = self.defaultInnerRadius;
			gradient.offset && (offsetAdjustment = parseValue(gradient.offset));
        	gradient.innerRadius && (innerRadius = parseValue(gradient.innerRadius));
        	return [offsetAdjustment, innerRadius];
		};
		this._paint = function(d, style, anchor) {
			if (style != null) {			
				var ctx = self.canvas.getContext('2d'), orientation = anchor.getOrientation();
				jsPlumb.extend(ctx, style);						
	            if (style.gradient && !ie) {            	
	            	var adjustments = calculateAdjustments(style.gradient); 
	            	var yAdjust = orientation[1] == 1 ? adjustments[0] * -1 : adjustments[0];
	            	var xAdjust = orientation[0] == 1 ? adjustments[0] * -1:  adjustments[0];
	            	var g = ctx.createRadialGradient(d[4], d[4], d[4], d[4] + xAdjust, d[4] + yAdjust, adjustments[1]);
		            for (var i = 0; i < style.gradient.stops.length; i++)
		            	g.addColorStop(style.gradient.stops[i][0], style.gradient.stops[i][1]);
		            ctx.fillStyle = g;
	            }				
				ctx.beginPath();    		
				ctx.arc(d[4], d[4], d[4], 0, Math.PI*2, true);
				ctx.closePath();				
				if (style.fillStyle || (style.gradient && !ie)) ctx.fill();
				if (style.strokeStyle) ctx.stroke();
			}
    	};
	};	
		
	jsPlumb.Endpoints.canvas.Rectangle = function(params) {
		
		var self = this;
		jsPlumb.Endpoints.Rectangle.apply(this, arguments);
		CanvasEndpoint.apply(this, arguments);				
		
    	this._paint = function(d, style, anchor) {
				
			// canvas specific 
			var ctx = self.canvas.getContext("2d"), orientation = anchor.getOrientation();
			jsPlumb.extend(ctx, style);
			
			/* canvas gradient */
			var ie = (/MSIE/.test(navigator.userAgent) && !window.opera);
		    if (style.gradient && !ie) {
		    	// first figure out which direction to run the gradient in (it depends on the orientation of the anchors)
		    	var y1 = orientation[1] == 1 ? d[3] : orientation[1] == 0 ? d[3] / 2 : 0;
				var y2 = orientation[1] == -1 ? d[3] : orientation[1] == 0 ? d[3] / 2 : 0;
				var x1 = orientation[0] == 1 ? d[2] : orientation[0] == 0 ? d[2] / 2 : 0;
				var x2 = orientation[0] == -1 ? d[2] : orientation[0] == 0 ? d[2] / 2 : 0;
			    var g = ctx.createLinearGradient(x1,y1,x2,y2);
			    for (var i = 0; i < style.gradient.stops.length; i++)
	            	g.addColorStop(style.gradient.stops[i][0], style.gradient.stops[i][1]);
	            ctx.fillStyle = g;
		    }
			
			ctx.beginPath();
			ctx.rect(0, 0, d[2], d[3]);
			ctx.closePath();				
			if (style.fillStyle || (style.gradient && !ie)) ctx.fill();
			if (style.strokeStyle) ctx.stroke();
    	};
	};		
	
	jsPlumb.Endpoints.canvas.Triangle = function(params) {
	        			
		var self = this;
		jsPlumb.Endpoints.Triangle.apply(this, arguments);
		CanvasEndpoint.apply(this, arguments);			
		
    	this._paint = function(d, style, anchor)
		{    		
			var width = d[2], height = d[3], x = d[0], y = d[1];
			
			var ctx = self.canvas.getContext('2d');
			var offsetX = 0, offsetY = 0, angle = 0;
			
			if( orientation[0] == 1 )
			{
				offsetX = width;
				offsetY = height;
				angle = 180;
			}
			if( orientation[1] == -1 )
			{
				offsetX = width;
				angle = 90;
			}
			if( orientation[1] == 1 )
			{
				offsetY = height;
				angle = -90;
			}
			
			ctx.fillStyle = style.fillStyle;
			
			ctx.translate(offsetX, offsetY);
			ctx.rotate(angle * Math.PI/180);

			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(width/2, height/2);
			ctx.lineTo(0, height);
			ctx.closePath();
			if (style.fillStyle || (style.gradient && !ie)) ctx.fill();
			if (style.strokeStyle) ctx.stroke();				
    	};
	};	
	
	/*
	 * Canvas Image Endpoint.  Draws the image into a Canvas element.
	 */
	jsPlumb.Endpoints.canvas.Image = function(params) {
		
		var self = this;
		jsPlumb.Endpoints.Image.apply(this, arguments);
		CanvasEndpoint.apply(this, arguments);				
		
		var actuallyPaint = function(d, style, anchor) {
			var width = self.img.width;
			var height = self.img.height;
			var x = self.anchorPoint[0] - (width/2);
			var y = self.anchorPoint[1] - (height/2);
			jsPlumb.sizeCanvas(self.canvas, x, y, width, height);
			var ctx = self.canvas.getContext('2d');
			ctx.drawImage(self.img,0,0);
		};
		
		this._paint = function(d, style) {
			if (self.ready) {
    			actuallyPaint(d, style);
			}
			else { 
				window.setTimeout(function() {    					
					self._paint(d, style);
				}, 200);
			}
		};    		
	};
	
	/*
     * Canvas Bezier Connector. Draws a Bezier curve onto a Canvas element.
     */
    jsPlumb.Connectors.canvas.Bezier = function() {
    	var self = this;
    	jsPlumb.Connectors.Bezier.apply(this, arguments); 
    	CanvasConnector.apply(this, arguments);
    	this._paint = function(dimensions) {
        	self.ctx.beginPath();
        	self.ctx.moveTo(dimensions[4], dimensions[5]);
        	self.ctx.bezierCurveTo(dimensions[8], dimensions[9], dimensions[10], dimensions[11], dimensions[6], dimensions[7]);	            
        	self.ctx.stroke();            
        };
    };
    
    /*
     * Canvas straight line Connector. Draws a straight line onto a Canvas element.
     */
    jsPlumb.Connectors.canvas.Straight = function() {   	 
		var self = this;
		jsPlumb.Connectors.Straight.apply(this, arguments);
		CanvasConnector.apply(this, arguments);
		this._paint = function(dimensions) {
	        self.ctx.beginPath();
	        self.ctx.moveTo(dimensions[4], dimensions[5]);
	        self.ctx.lineTo(dimensions[6], dimensions[7]);
	        self.ctx.stroke();            
	    };
    };
    
// ********************************* END OF CANVAS RENDERERS *******************************************************************
    
    jsPlumb.Overlays.canvas.Image = function(params) {
    	var self = this, imgDiv = null;
    	jsPlumb.Overlays.Image.apply(this, arguments);
    	this.init = function() {
    		imgDiv = document.createElement("img");
			imgDiv.src = self.img.src;
			imgDiv.style.position = "absolute";
			imgDiv.style.display="none";
			imgDiv.className = "_jsPlumb_overlay";
			document.body.appendChild(imgDiv);// HMM
    	};
    	this.paint = function(connector, d){
    		var ctx = connector.ctx;
    		var cxy = connector.pointOnPath(self.location);
    		var canvas = jsPlumb.CurrentLibrary.getElementObject(ctx.canvas);
    		var canvasOffset = jsPlumb.CurrentLibrary.getOffset(canvas);
    		var minx = cxy.x - (self.img.width/2);
    		var miny = cxy.y - (self.img.height/2);
    		var o = {left:canvasOffset.left + minx, top:canvasOffset.top + miny};
    		jsPlumb.CurrentLibrary.setOffset(imgDiv, o);
    		imgDiv.style.display = "block";
    		return [minx,minx + self.img.width, miny, miny+self.img.height];
    	};
    };
    
    jsPlumb.Overlays.canvas.Label = function(params) {
    	var self = this;
    	jsPlumb.Overlays.Label.apply(this, arguments);
    	var _widestLine = function(lines, ctx) {
    		var max = 0;
    		for (var i = 0; i < lines.length; i++) {
    			var t = ctx.measureText(lines[i]).width;
    			if (t > max) max = t;
    		}
    		return max;
    	};
    	this.getTextDimensions = function(connector) {
    		var ctx = connector.ctx;
    		if (self.cachedDimensions) return self.cachedDimensions;   // return cached copy if we can.  if we add a setLabel function remember to clear the cache. 
    		labelText = typeof self.label == 'function' ? self.label(self) : self.label;
    		var d = {};
    		if (labelText) {
    			var lines = labelText.split(/\n|\r\n/);
    			ctx.save();
	            if (self.labelStyle.font) ctx.font = self.labelStyle.font;
	            var t = _widestLine(lines, ctx);
				// a fake text height measurement: use the width of upper case M
				var h = ctx.measureText("M").width;					
				labelPadding = self.labelStyle.padding || 0.25;
				labelWidth = t + (2 * t * labelPadding);
				labelHeight = (lines.length * h) + (2 * h * labelPadding);
				var textHeight = lines.length * h;
				ctx.restore();
				d = {width:labelWidth, height:labelHeight, lines:lines, oneLine:h, padding:labelPadding, textHeight:textHeight};
    		}
    		if (typeof self.label != 'function') self.cachedDimensions = d;  // cache it if we can. 
    		return d;
    	};
    	this.paint = function(connector, d) {
    		var ctx = connector.ctx;
    		if (self.labelStyle.font) ctx.font = self.labelStyle.font;		            		            		           
			if (self.labelStyle.fillStyle) 
				ctx.fillStyle = self.labelStyle.fillStyle;
			else 
				ctx.fillStyle = "rgba(0,0,0,0)";
			ctx.fillRect(d.minx, d.miny , d.td.width , d.td.height );
			
			if (self.labelStyle.color) ctx.fillStyle = self.labelStyle.color;					
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			for (i = 0; i < d.td.lines.length; i++) { 
				ctx.fillText(d.td.lines[i],d.cxy.x, d.cxy.y - (d.td.textHeight / 2) + (d.td.oneLine/2) + (i*d.td.oneLine));
			}
			
			// border
			if (self.labelStyle.borderWidth > 0) {
				ctx.strokeStyle = self.labelStyle.borderStyle || "black";
				ctx.strokeRect(d.minx, d.miny, d.td.width , d.td.height );
			}
    	};    	
    };
    
    var CanvasOverlay = function() {
    	
    };
    
    var AbstractCanvasArrowOverlay = function(superclass, originalArgs) {
    	superclass.apply(this, originalArgs);
    	CanvasOverlay.apply(this, arguments);
    	this.paint = function(connector, d, lineWidth, strokeStyle, fillStyle) {
    		var ctx = connector.ctx;
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.moveTo(d.hxy.x, d.hxy.y);
			ctx.lineTo(d.tail[0].x, d.tail[0].y);
			ctx.lineTo(d.cxy.x, d.cxy.y);
			ctx.lineTo(d.tail[1].x, d.tail[1].y);
			ctx.lineTo(d.hxy.x, d.hxy.y);
			ctx.closePath();						
						
			if (strokeStyle) {
				ctx.strokeStyle = strokeStyle;
				ctx.stroke();
			}
			if (fillStyle) {
				ctx.fillStyle = fillStyle;			
				ctx.fill();
			}
    	};
    }; 
    
    jsPlumb.Overlays.canvas.Arrow = function() {
    	AbstractCanvasArrowOverlay.apply(this, [jsPlumb.Overlays.Arrow, arguments]);    	
    };
    
    jsPlumb.Overlays.canvas.PlainArrow = function() {
    	AbstractCanvasArrowOverlay.apply(this, [jsPlumb.Overlays.PlainArrow, arguments]);    	
    };
    
    jsPlumb.Overlays.canvas.Diamond = function() {
    	AbstractCanvasArrowOverlay.apply(this, [jsPlumb.Overlays.Diamond, arguments]);    	
    };
	
	
})();