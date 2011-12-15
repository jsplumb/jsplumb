;(function() {

	var curColourIndex = 1, maxColourIndex = 24, nextColour = function() {
		var R,G,B;
		R = parseInt(128+Math.sin((curColourIndex*3+0)*1.3)*128);
		G = parseInt(128+Math.sin((curColourIndex*3+1)*1.3)*128);
		B = parseInt(128+Math.sin((curColourIndex*3+2)*1.3)*128);
		curColourIndex = curColourIndex + 1;
		if (curColourIndex > maxColourIndex) curColourIndex = 1;
		return "rgb(" + R + "," + G + "," + B + ")";
	};
		
	window.jsPlumbDemo = { 
	
		init :function() {
				
			jsPlumb.Defaults.Connector = [ "StateMachine", { avoidSelector:$(".w") } ];
			jsPlumb.Defaults.Endpoint = ["Dot", {radius:2}];				
			jsPlumb.Defaults.HoverPaintStyle = {strokeStyle:"yellow", lineWidth:2 };	
			jsPlumb.Defaults.Overlays = [
				[ "Arrow", { 
					location:1, 
						id:"arrow"
				} ]/*,
							[ "Arrow", { 
								location:0.5, 
								id:"arrow2"
							} ]	*/		
			];
				
			jsPlumb.draggable(jsPlumb.getSelector(".w"));
											
			jsPlumb.bind("click", function(c) { 
				jsPlumb.detach(c); 
			});
				
			// make each ".ep" div a source and give it some parameters to work with.  here we tell it
			// to use a Continuous anchor and the StateMachine connectors, and also we give it the
			// connector's paint style.  note that in this demo the strokeStyle is dynamically generated,
			// which prevents us from just setting a jsPlumb.Defaults.PaintStyle.  but that is what i 
			// would recommend you do.
			$(".ep").each(function(i,e) {
				var p = $(e).parent();
				jsPlumb.makeSource($(e), {
					parent:p,
					endpoint:{
						anchor:"Continuous",
						connector:"StateMachine",
						connectorStyle:{ strokeStyle:nextColour(),lineWidth:2 },
						maxConnections:-1
					}						
				});
			});
				
			jsPlumb.makeTarget($(".w"), {
				dropOptions:{ hoverClass:"dragHover" },
				endpoint:{
					anchor:"Continuous"
				}
			});
		}
	};
})();