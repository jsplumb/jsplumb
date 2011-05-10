jsPlumb.Connectors.SVGBezier = function(curviness)
{
	var paper = null;
	
	jsPlumb.Connectors.Bezier.apply(this, arguments);
    
    this.paint = function(d, ctx) {
    	if (paper) paper.remove();  			// not ideal. we want to just move it, really.
    	// this is just an experiment right now.  things will improve.
    	paper = Raphael(d[0], d[1], d[2], d[3]);
    	var path = "M " + d[4] + " " + d[5] + " C " + d[8] + " " + d[9] + " " + d[10] + " " + d[11] + " " + d[6] + " " + d[7];
    	
    	// todo the stroke style etc should be passed in here, not read out of the context.  
    	// it's only like this because the original implementation painted on canvas, and jsPlumb
    	// was taking care of paint styles etc.
    	
     	paper.path(path).attr({
     		stroke:ctx.strokeStyle,
     		"stroke-width":ctx.lineWidth     	
     	});            
    };
};