;(function() {
	
	window.jsPlumbDemo = {
			
		init : function() {
			
			jsPlumb.importDefaults({
				Connector:"StateMachine",
				PaintStyle:{ lineWidth:3, strokeStyle:"#ffa500", "dashstyle":"2 4" },
				Endpoint:[ "Dot", { radius:5 } ],
				EndpointStyle:{ fillStyle:"#ffa500" }
			});
			  
			var shapes = Y.all(".shape");
				
			// make everything draggable
			jsPlumb.draggable(shapes);
				
			// loop through them and connect each one to each other one.
			shapes.each(function(i, s) {
				shapes.each(function(j, ss) {
					if (i != j) {
						jsPlumb.connect({
							source:i,  // just pass in the current node in the selector for source 
							target:j,
							// here we supply a different anchor for source and for target, and we get the element's "data-shape"
							// attribute to tell us what shape we should use, and "data-rotation" for optional rotation.
							anchors:[
								[ "Perimeter", { shape:i.getAttribute("data-shape"), rotation:i.getAttribute("data-rotation") }],
								[ "Perimeter", { shape:j.getAttribute( "data-shape"), rotation:j.getAttribute("data-rotation") }]
							]
						});				
					}
				});
			});			
    	}    
  }
  
})();