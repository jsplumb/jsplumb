jsPlumb.Connectors.ExampleConnector = function() {

	jsPlumb.Connectors.Straight.apply(this);
	var self = this;	    	
    
    var _p = self.paint;
    this.paint = function(dimensions, ctx)
    {
    	_p(dimensions,ctx);
        
    	new jsPlumb.Overlays.PlainArrow({location:0.25}).draw(self, ctx);
    	new jsPlumb.Overlays.Arrow({location:0.5}).draw(self, ctx);
    	new jsPlumb.Overlays.Diamond({location:0.75}).draw(self, ctx);
    	new jsPlumb.Overlays.Label({label:"SIMON",location:0.75}).draw(self, ctx);
                    
    };       
};