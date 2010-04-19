// Array.indexOf( value, begin, strict ) - Return index of the first element that matches value
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function( v, b, s ) {
		for( var i = +b || 0, l = this.length; i < l; i++ ) {
  			if( this[i]===v || s && this[i]==v ) { return i; }
 		}
 		return -1;
	};
}

(function() {
    var jsPlumb = window.jsPlumb = {
    		
    _connections : {},
	_offsets : [],
	_sizes : [],

	connectorClass : '_jsPlumb_connector',
	endpointClass : '_jsPlumb_endpoint',
	
    DEFAULT_PAINT_STYLE : {
        lineWidth : 10,
        strokeStyle : "red"
    },
    
    DEFAULT_ENDPOINT_STYLE : {
        fillStyle : null  // meaning it will be derived from the stroke style of the connector.
    },
    
    DEFAULT_DRAG_OPTIONS : { },
    
    DEFAULT_CONNECTOR : null,
    
    DEFAULT_ENDPOINT : null,
    
    // only used for IE; a canvas needs a size before the init call to excanvas (for some reason. no idea why.)
    DEFAULT_NEW_CANVAS_SIZE : 1200,

    /**
    * Places you can anchor a connection to.  You can write your own one of these; you
    * just need to provide a 'compute' method and an 'orientation'.  so you'd say something like this:
    * 
    * jsPlumb.Anchors.MY_ANCHOR = {
    * 	compute : function(xy, wh) { return some mathematics on those variables; },
    *   orientation : [ox, oy]
    * };
    *
    * compute takes the [x,y] position of the top left corner of the anchored element,
    * and the element's [width,height] (all in pixels), and returns where the anchor should
    * be located.
    *
    * the 'orientation' array (returned here as [ox,oy]) indicates the general direction a connection from the anchor
    * should go in, if possible.  it is an [x,y] matrix where a value of 0 means no preference,
    * -1 means go in a negative direction for the given axis, and 1 means go in a positive
    * direction.  so consider a TOP_CENTER anchor: the orientation matrix for it is [0,-1],
    * meaning connections naturally want to go upwards on screen.  in a bezier implementation, for example, 
    * the curve would start out going in that direction, before bending towards the target anchor.
    */
    Anchors :
	{
		TOP_CENTER : {
            compute : function(xy,wh, txy, twh) { return [ xy[0] + (wh[0]/2), xy[1] ]; },
            orientation:[0,-1]
        },
		BOTTOM_CENTER : {
            compute : function(xy,wh, txy, twh) { return [ xy[0] + (wh[0]/2), xy[1] + wh[1] ]; },
            orientation:[0,1]
        },
		LEFT_MIDDLE :  {
            compute : function(xy,wh, txy, twh) { return [ xy[0], xy[1] + (wh[1]/2) ]; },
            orientation:[-1,0]
        },
		RIGHT_MIDDLE :  {
            compute : function(xy,wh, txy, twh) { return [ xy[0] + wh[0], xy[1] + (wh[1]/2) ]; },
            orientation:[1,0]
        },
        CENTER :  {
            compute : function(xy, wh, txy, twh) { return [xy[0] + (wh[0] / 2), xy[1] + (wh[1]) / 2]; },
            orientation:[0,0]
        },
        TOP_RIGHT : {
            compute : function(xy,wh, txy, twh) { return [xy[0] + wh[0], xy[1]]; },
            orientation:[0,-1]
        },
        BOTTOM_RIGHT : {
            compute : function(xy,wh, txy, twh) { return [xy[0] + wh[0], xy[1] + wh[1]]; },
            orientation:[0,1]
        },
        TOP_LEFT : {
            compute : function(xy,wh, txy, twh) { return [xy[0], xy[1]]; },
            orientation:[0,-1]
        },
        BOTTOM_LEFT : {
            compute : function(xy,wh, txy, twh) { return [xy[0], xy[1] + wh[1]]; },
            orientation:[0,1]
        }
    },

    /**
     * Types of connectors, eg. Straight line, bezier.
     */
    Connectors :
    {
        /**
         * A Connector is given a Canvas context and a source xy and target xy.
         * those coordinates are relative to the canvas's position.
         * @param ctx
         * @param sourceXY
         * @param targetXY
         */
        STRAIGHT_LINE : {

            /**
             * Computes the new size and position of the canvas.
             * @param sourceAnchor Absolute position on screen of the source object's anchor.
             * @param targetAnchor Absolute position on screen of the target object's anchor.
             * @param positionMatrix  Indicates the relative positions of the left,top of the
             *  two plumbed objects.  so [0,0] indicates that the source is to the left of, and
             *  above, the target.  [1,0] means the source is to the right and above.  [0,1] means
             *  the source is to the left and below.  [1,1] means the source is to the right
             *  and below.  this is used to figure out which direction to draw the connector in.
             * @returns an array of positioning information.  the first two values are
             * the [left, top] absolute position the canvas should be placed on screen.  the
             * next two values are the [width,height] the canvas should be.  after that each
             * Connector can put whatever it likes into the array:it will be passed back in
             * to the paint call.  This particular function stores the origin and destination of
             * the line it is going to draw.  a more involved implementation, like a bezier curve,
             * would store the control point info in this array too.
             */
            compute : function(sourcePos, targetPos, sourceAnchor, targetAnchor) {
                var w = Math.abs(sourcePos[0] - targetPos[0]);
                var h = Math.abs(sourcePos[1] - targetPos[1]);
                var xo = 0.25 * w;
                var yo=0.25*h;
                w *= 1.5;
                h *=1.5;
                return [Math.min(sourcePos[0], targetPos[0]) - xo,
                        Math.min(sourcePos[1], targetPos[1]) - yo,
                        w,h,
                        sourcePos[0] < targetPos[0] ? w-xo : xo,
                        sourcePos[1] < targetPos[1] ? h-yo : yo,
                        sourcePos[0] < targetPos[0] ? xo : w-xo,
                        sourcePos[1] < targetPos[1] ? yo : h-yo
                    ];
            },

            paint : function(dimensions, ctx)
            {
                ctx.beginPath();
                ctx.moveTo(dimensions[4], dimensions[5]);
                ctx.lineTo(dimensions[6], dimensions[7]);
                ctx.stroke();
            }
        },
        
        ORG_CHART : {
        	
        	compute : function(sourcePos, targetPos, sourceAnchor, targetAnchor) {
                var w = Math.abs(sourcePos[0] - targetPos[0]);
                var h = Math.abs(sourcePos[1] - targetPos[1]);
                
                var xo = 0.25 * w;
                var yo=0.25*h;
                w *= 1.5;
                h *=1.5;
                return [Math.min(sourcePos[0], targetPos[0]) - xo,
                        Math.min(sourcePos[1], targetPos[1]) - yo,
                        w,h,
                        sourcePos[0] < targetPos[0] ? w-xo : xo,
                        sourcePos[1] < targetPos[1] ? h-yo : yo,
                        sourcePos[0] < targetPos[0] ? xo : w-xo,
                        sourcePos[1] < targetPos[1] ? yo : h-yo
                    ];
            },

            paint : function(dimensions, ctx)
            {
                ctx.beginPath();
                ctx.moveTo(dimensions[4], dimensions[5]);
                ctx.lineTo(dimensions[6], dimensions[7]);
                ctx.stroke();
            }
        },

        BEZIER : {

            _findControlPoint :function(point, anchor1Position, anchor2Position, anchor1, anchor2) {
                var p = [];
                // X
                if (anchor1.orientation[0] == 0) {
                    var diff = anchor1Position[0] < anchor2Position[0] ? point[0] + 10 : point[0] - 10;
                    p.push(diff);
                }
                else {
                	
                	p.push(point[0] - (150 * anchor1.orientation[0]));
                }

                // Y
                if (anchor1.orientation[1] == 0) {
                    var diff = anchor1Position[1] < anchor2Position[1] ? point[1] + 10 : point[1] - 10;
                    p.push(diff);
                }
                else p.push(point[1] + (150 * anchor2.orientation[1]));

                return p;
            },

            compute : function(sourcePos, targetPos, sourceAnchor, targetAnchor)
            {
                var w = Math.abs(sourcePos[0] - targetPos[0]);
                var h = Math.abs(sourcePos[1] - targetPos[1]);
                var canvasX = Math.min(sourcePos[0], targetPos[0]);
                var canvasY = Math.min(sourcePos[1], targetPos[1]);
                var sx = sourcePos[0] < targetPos[0] ? w : 0;
                var sy = sourcePos[1] < targetPos[1] ? h : 0;
                var tx = sourcePos[0] < targetPos[0] ? 0 : w;
                var ty = sourcePos[1] < targetPos[1] ? 0 : h;

                var CP = jsPlumb.Connectors.BEZIER._findControlPoint([sx,sy],
                		sourcePos, targetPos,
                        sourceAnchor, targetAnchor);
                var CP2 = jsPlumb.Connectors.BEZIER._findControlPoint([tx,ty],
                		targetPos, sourcePos,
                        targetAnchor, sourceAnchor);
                
                var minx1 = Math.min(sx,tx); var minx2 = Math.min(CP[0], CP2[0]); var minx = Math.min(minx1,minx2);
                var maxx1 = Math.max(sx,tx); var maxx2 = Math.max(CP[0], CP2[0]); var maxx = Math.max(maxx1,maxx2);
                
                if (maxx > w) w = maxx;
                if (minx < 0) {
                    canvasX += minx; var ox = Math.abs(minx);
                    w += ox; CP[0] += ox; sx += ox; tx +=ox; CP2[0] += ox;
                }                

                var miny1 = Math.min(sy,ty); var miny2 = Math.min(CP[1], CP2[1]); var miny = Math.min(miny1,miny2);
                var maxy1 = Math.max(sy,ty); var maxy2 = Math.max(CP[1], CP2[1]); var maxy = Math.max(maxy1,maxy2);
                if (maxy > h) h = maxy;
                if (miny < 0) {
                    canvasY += miny; var oy = Math.abs(miny);
                    h += oy; CP[1] += oy; sy += oy; ty +=oy; CP2[1] += oy;
                }

                return [canvasX,canvasY, w,h, sx,sy,tx,ty, CP[0],CP[1],CP2[0],CP2[1] ];
            },

            paint : function(d, ctx) {
	            ctx.beginPath();
	            ctx.moveTo(d[4],d[5]);
	            ctx.bezierCurveTo(d[8],d[9],d[10],d[11],d[6],d[7]);
	            
	            // gradient experiment.
	            /*var g = ctx.createLinearGradient(d[4],d[5],d[6], d[7]);
	            g.addColorStop(0,'white');  
	            g.addColorStop(1,'black');  
	            ctx.strokeStyle = g;*/
	            
	            ctx.stroke();
            }
        }
    },
    
    
    /**
     * Types of endpoint UIs.  we supply only one - a circle of radius 10px.  you can supply others of these if you want to.
     */
    Endpoints : {

    	DOT : {
    	
    		radius : 10,
    		
	    	paint : function(anchorPoint, canvas, endpointStyle, connectorPaintStyle) {
    			var radius = endpointStyle.radius || jsPlumb.Endpoints.DOT.radius;
    			var x = anchorPoint[0] - radius;
    			var y = anchorPoint[1] - radius;
    			jsPlumb.sizeCanvas(canvas, x, y, radius * 2, radius * 2);
    			var ctx = canvas.getContext('2d');
    			var style = {};    			
    			jsPlumb.applyPaintStyle(style, endpointStyle);
    			if (style.fillStyle ==  null) style.fillStyle = connectorPaintStyle.strokeStyle;
    			jsPlumb.applyPaintStyle(ctx, style);
    			ctx.beginPath();    			
    			ctx.arc(radius, radius, radius, 0, Math.PI*2, true);
    			ctx.closePath();
    			ctx.fill();
	    	}
    	},
    	
    	RECTANGLE : {
        	
    		width : 20,
    		height : 20,
    		
	    	paint : function(anchorPoint, canvas, endpointStyle, connectorPaintStyle) {    		
    			var width = endpointStyle.width || jsPlumb.Endpoints.RECTANGLE.width;
    			var height = endpointStyle.height || jsPlumb.Endpoints.RECTANGLE.height;
    			var x = anchorPoint[0] - (width/2);
    			var y = anchorPoint[1] - (height/2);
    			jsPlumb.sizeCanvas(canvas, x, y, width, height);
    			var ctx = canvas.getContext('2d');
    			var style = {};    			
    			jsPlumb.applyPaintStyle(style, endpointStyle);
    			if (style.fillStyle ==  null) style.fillStyle = connectorPaintStyle.strokeStyle;
    			jsPlumb.applyPaintStyle(ctx, style);
    			ctx.beginPath();
    			ctx.rect(0, 0, width, height);
    			ctx.closePath();
    			ctx.fill();
	    	}
    	}    	
    },
    
    connect : function(params) {
    	var jpc = new jsPlumbConnection(params);
    	var key = jpc.sourceId + "_" + jpc.targetId;
    	jsPlumb._connections[key] = jpc;
    	var addToList = function(elId, jpc) {
    		var l = jsPlumb._connections[elId];
    		if (l == null) {
    			l = [];
    			jsPlumb._connections[elId] = l; 
    		}
    		l.push(jpc);
    	};
    	
    	// register this connection.
    	addToList(jpc.sourceId, jpc);
    	addToList(jpc.targetId, jpc);
    },
    
    getConnections : function(elId) {
    	return jsPlumb._connections[elId];
    },
    
    drag : function(element, ui) {
    	var id = element.attr("id");
    	var l = jsPlumb.getConnections(id);
    	for (var i = 0; i < l.length; i++)
    		l[i].paint(id, ui);
    },
    
    detach : function(sourceId, targetId) {    	
    	var jpcs = jsPlumb._connections[sourceId];
    	var idx = -1;
    	for (var i = 0; i < jpcs.length; i++) {
    		if ((jpcs[i].sourceId == sourceId && jpcs[i].targetId == targetId) || (jpcs[i].targetId == sourceId && jpcs[i].sourceId == targetId)) {
    			jsPlumb.removeCanvas(jpcs[i].canvas);
    			if (jpcs[i].drawEndpoints) {
    				jsPlumb.removeCanvas(jpcs[i].targetEndpointCanvas);
    				jsPlumb.removeCanvas(jpcs[i].sourceEndpointCanvas);
    			}
    			idx = i;
    			break;
    		}
    	}
    	if (idx != -1)
    		jpcs.splice(idx, 1);
    	
    	// todo - dragging?  if no more connections for an object turn off dragging by default, but
    	// allow an override on it?
    },
    
    detachAll : function(elId) {
    	var jpcs = jsPlumb._connections[elId];
    	for (var i = 0; i < jpcs.length; i++) {
	    	jsPlumb.removeCanvas(jpcs[i].canvas);
			if (jpcs[i].drawEndpoints) {
				jsPlumb.removeCanvas(jpcs[i].targetEndpointCanvas);
				jsPlumb.removeCanvas(jpcs[i].sourceEndpointCanvas);
			}
    	}
    	jsPlumb._connections[elId] = [];
    },
    
    hide : function(elId) {
    	jsPlumb._setVisible(elId, "none");
    },
    
    show : function(elId) {
    	jsPlumb._setVisible(elId, "block");
    },
    
    toggle : function(elId) {
    	var jpcs = jsPlumb._connections[elId];
    	if (jpcs.length > 0)
    		jsPlumb._setVisible(elId, "none" == jpcs[0].canvas.style.display ? "block" : "none");
    },
    
    _setVisible : function(elId, state) {
    	var jpcs = jsPlumb._connections[elId];
    	for (var i = 0; i < jpcs.length; i++) {
    		jpcs[i].canvas.style.display=state;
    		if (jpcs[i].drawEndpoints) {
    			jpcs[i].sourceEndpointCanvas.style.display=state;
    			jpcs[i].targetEndpointCanvas.style.display=state;
    		}
    	}
    },
    
    /**
     * helper to create a canvas.
     * @param clazz optional class name for the canvas.
     */
    newCanvas : function(clazz) {
        var canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        canvas.style.position="absolute";
        if (clazz) { canvas.className=clazz; }
        
        if (/MSIE/.test(navigator.userAgent) && !window.opera) {
        	// for IE we have to set a big canvas size. actually you can override this, too, if 1200 pixels
        	// is not big enough for the biggest connector/endpoint canvas you have at startup.
        	jsPlumb.sizeCanvas(canvas, 0, 0, jsPlumb.DEFAULT_NEW_CANVAS_SIZE, jsPlumb.DEFAULT_NEW_CANVAS_SIZE);
        	canvas = G_vmlCanvasManager.initElement(canvas);          
        }
        
        return canvas;
    },
    
    /**
     * helper to remove a canvas from the DOM.
     */
    removeCanvas : function(canvas) {
    	if (canvas != null) document.body.removeChild(canvas);
    },

    /**
     * helper to size a canvas.
     */
    sizeCanvas : function(canvas, x, y, w, h) {
        canvas.style.height = h + "px"; canvas.height = h;
        canvas.style.width = w + "px"; canvas.width = w; 
        canvas.style.left = x + "px"; canvas.style.top = y + "px";
    },
    
    /**
     * applies all the styles to the given context.
     * @param canvas
     * @param styles
     */
    applyPaintStyle : function(context, styles) {
        for (var i in styles) {
            context[i] = styles[i];
        }
    }
};

// ************** connection
// ****************************************
/**
* allowed params:
* source:	source element (string or a jQuery element) (required)
* target:	target element (string or a jQuery element) (required)
* anchors: optional array of anchor placements. defaults to BOTTOM_CENTER for source
*          and TOP_CENTER for target.
*/
var jsPlumbConnection = window.jsPlumbConnection = function(params) {

// ************** get the source and target and register the connection. *******************
    var self = this;
    // get source and target as jQuery objects
    this.source = (typeof params.source == 'string') ? $("#" + params.source) : params.source;
    this.target = (typeof params.target == 'string') ? $("#" + params.target) : params.target;
    this.sourceId = $(this.source).attr("id");
    this.targetId = $(this.target).attr("id");
    this.drawEndpoints = params.drawEndpoints != null ? params.drawEndpoints : true;
    this.endpointsOnTop = params.endpointsOnTop != null ? params.endpointsOnTop : true;
    
 // get anchor
    this.anchors = params.anchors || jsPlumb.DEFAULT_ANCHORS || [jsPlumb.Anchors.BOTTOM_CENTER, jsPlumb.Anchors.TOP_CENTER];
    // make connector
    this.connector = params.connector || jsPlumb.DEFAULT_CONNECTOR || jsPlumb.Connectors.BEZIER;
    this.paintStyle = params.paintStyle || jsPlumb.DEFAULT_PAINT_STYLE;
    // init endpoints
    this.endpoint = params.endpoint || jsPlumb.DEFAULT_ENDPOINT || jsPlumb.Endpoints.DOT;
    this.endpointStyle = params.endpointStyle || jsPlumb.DEFAULT_ENDPOINT_STYLE;
    
    jsPlumb._offsets[this.sourceId] = this.source.offset(); 
    jsPlumb._sizes[this.sourceId] = [this.source.outerWidth(), this.source.outerHeight()]; 
    jsPlumb._offsets[this.targetId] = this.target.offset();
    jsPlumb._sizes[this.targetId] = [this.target.outerWidth(), this.target.outerHeight()];

// *************** create canvases on which the connection will be drawn ************
    var canvas = jsPlumb.newCanvas(jsPlumb.connectorClass);
    this.canvas = canvas;
    // create endpoint canvases
    if (this.drawEndpoints) {
	    this.sourceEndpointCanvas = jsPlumb.newCanvas(jsPlumb.endpointClass);	    
	    this.targetEndpointCanvas = jsPlumb.newCanvas(jsPlumb.endpointClass);
	    // sit them on top of the underlying element?
	    if (this.endpointsOnTop) {
		    $(this.sourceEndpointCanvas).css("zIndex", this.source.css("zIndex") + 1);
		    $(this.targetEndpointCanvas).css("zIndex", this.target.css("zIndex") + 1);
	    }
    }
// ************** store the anchors     
  
    this.paint = function(elId, ui) {    	
    	// if the moving object is not the source we must transpose the two references.
    	var swap = !(elId == this.sourceId);
    	var tId = swap ? this.sourceId : this.targetId, sId = swap ? this.targetId : this.sourceId;
    	var tIdx = swap ? 0 : 1, sIdx = swap ? 1 : 0;
    	
    	if (this.canvas.getContext) {
    		var myOffset = ui.absolutePosition;
    		jsPlumb._offsets[elId] = myOffset;
            var myWH = jsPlumb._sizes[elId];
            
    		var ctx = canvas.getContext('2d');
            var otherOffset = jsPlumb._offsets[tId];
            var otherWH = jsPlumb._sizes[tId];
            var sAnchorP = this.anchors[sIdx].compute([myOffset.left, myOffset.top], myWH, [otherOffset.left, otherOffset.top], otherWH);
            var tAnchorP = this.anchors[tIdx].compute([otherOffset.left, otherOffset.top], otherWH, [myOffset.left, myOffset.top], myWH);
            var dim = this.connector.compute(sAnchorP, tAnchorP, this.anchors[sIdx], this.anchors[tIdx]);
            jsPlumb.sizeCanvas(canvas, dim[0], dim[1], dim[2], dim[3]);
            jsPlumb.applyPaintStyle(ctx, this.paintStyle);
            this.connector.paint(dim, ctx);
                            
            if (this.drawEndpoints) {
            	var style = this.endpointStyle || this.paintStyle;
            	var sourceCanvas = swap ? this.targetEndpointCanvas : this.sourceEndpointCanvas;
            	var targetCanvas = swap ? this.sourceEndpointCanvas : this.targetEndpointCanvas;
            	this.endpoint.paint(sAnchorP, sourceCanvas, style, this.paintStyle);
            	this.endpoint.paint(tAnchorP, targetCanvas, style, this.paintStyle);
            }
    	}
    };

    var draggable = params.draggable == null ? true : params.draggable;
    if (draggable) {
    	
    	var dragOptions = params.dragOptions || jsPlumb.DEFAULT_DRAG_OPTIONS; 
    	var dragCascade = dragOptions.drag || function(e,u) {};
    	var initDrag = function(element, dragFunc) {
    		var opts = {};
        	for (var i in dragOptions) {
                opts[i] = dragOptions[i];
            }
        	opts.drag = dragFunc;
        	element.draggable(opts);
    	};
    	initDrag(this.source, function(event, ui) {
    		jsPlumb.drag(self.source, ui);
    		dragCascade(event, ui);
    	});
    	initDrag(this.target, function(event, ui) {
    		jsPlumb.drag(self.target, ui);
    		dragCascade(event, ui);
    	});
    }    
    var o = this.source.offset();
    this.paint(this.sourceId, {'absolutePosition': this.source.offset()});
};

})();

// jQuery plugin code
(function($){
    $.fn.plumb = function(options) {
        var defaults = { };
        var options = $.extend(defaults, options);

        return this.each(function()
        {
            var obj = $(this);
            var params = {};
            params.source = obj;
            for (var i in options) {
                params[i] = options[i];
            }
            jsPlumb.connect(params);
        });
  };
  
  $.fn.detach = function(options) {
	  return this.each(function() 
	  {
		 var id = $(this).attr("id");
		 if (typeof options == 'string') options = [options];
		 for (var i = 0; i < options.length; i++)
			 jsPlumb.detach(id, options[i]);
	  });	  
  };
  
  $.fn.detachAll = function(options) {
	  return this.each(function() 
	  {
		 var id = $(this).attr("id");		 
		 jsPlumb.detachAll(id);
	  });	  
  };
})(jQuery);