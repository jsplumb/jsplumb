;(function() {
	
	window.jsPlumbDemo = {
			
		init : function() {
			
			jsPlumb.importDefaults({
				Connector:"StateMachine",
				PaintStyle:{ lineWidth:3, strokeStyle:"#ffa500", "dashstyle":"2 4" },
				Endpoint:[ "Dot", { radius:5 } ],
				EndpointStyle:{ fillStyle:"#ffa500" }
			});
			  
			var shapes = $(".shape");
				
			// make everything draggable
			jsPlumb.draggable(shapes);
				
			// loop through them and connect each one to each other one.
			for (var i = 0; i < shapes.length; i++) {
				for (var j = i + 1; j < shapes.length; j++) {						
					jsPlumb.connect({
						source:shapes[i],  // just pass in the current node in the selector for source 
						target:shapes[j],
						// here we supply a different anchor for source and for target, and we get the element's "data-shape"
						// attribute to tell us what shape we should use, as well as, optionally, a rotation value.
						anchors:[
							[ "Perimeter", { shape:$(shapes[i]).attr("data-shape"), rotation:$(shapes[i]).attr("data-rotation") }],
							[ "Perimeter", { shape:$(shapes[j]).attr( "data-shape"), rotation:$(shapes[j]).attr("data-rotation") }]
						]
					});				
				}	
			}
    }    
  }
  
})();