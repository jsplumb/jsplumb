;(function() {
	
	window.jsPlumbDemo = {
			
		init : function() {
			
			jsPlumb.importDefaults({
				Connector:"StateMachine",
				PaintStyle:{ lineWidth:3, strokeStyle:"orange", "dashstyle":"2 4" },
				Endpoint:[ "Dot", { radius:5 } ],
				EndpointStyle:{ fillStyle:"orange" }
			});
			  
			// NOTE here we are just using getSelector so we don't have to rewrite the code for each of the supported libraries.
			// you can just use the approriate selector from the library you're using, if you want to. like $(".shape) on jquery, for example.
			var shapes = jsPlumb.getSelector(".shape");
				
				// make everything draggable
				jsPlumb.draggable(shapes);
				
				// loop through them and connect each one to each other one.
				for (var i = 0; i < shapes.length; i++) {
					for (var j = i + 1; j < shapes.length; j++) {						
						jsPlumb.connect({
							source:shapes[i],  // just pass in the current node in the selector for source 
							target:shapes[j],
							// here we supply a different anchor for source and for target, and we get the element's "data-id"
							// attribute to tell us what shape we should use. Note again that this call to the jsPlumb.CurrentLibrary
							// is only required because this demo is library-agnostic: you can use, for instance $(shapes[i]).attr("data-id),
							// or, of course, if you like pretending that DOM elements should actually be data stores,
							// $(shapes[i]).data("id").								
							anchors:[
								[ "Perimeter", { shape:$(shapes[i]).attr("data-shape") }],
								[ "Perimeter", { shape:$(shapes[j]).attr( "data-shape") }]
							]
						});				
					}	
				}
				
				
				
    }
    
  }
  
})();