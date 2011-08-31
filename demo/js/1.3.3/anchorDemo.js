;(function() {
	
	window.jsPlumbDemo = {
			
		init : function() {
			jsPlumb.setMouseEventsEnabled(true);
			jsPlumb.Defaults.DragOptions = { cursor: 'pointer', zIndex:2000 };
			// default to blue at one end and green at the other
			jsPlumb.Defaults.EndpointStyles = [{ fillStyle:'#225588' }, { fillStyle:'#558822' }];
			// blue endpoints 7 px; green endpoints 11.
			jsPlumb.Defaults.Endpoints = [ ["Dot", {radius:7} ], [ "Dot", {radius:11} ] ];
			// default to a gradient stroke from blue to green.  for IE provide all green fallback.
			jsPlumb.Defaults.PaintStyle = { gradient:{stops:[[0,'#225588'], [1, '#558822']] }, strokeStyle:'#558822', lineWidth:10 };
			
			jsPlumb.connect({source:'window1', target:'window3', anchors:[[ 0.05, 1, 0, 1 ], "TopCenter"], connector:"Straight"});
			jsPlumb.connect({source:'window1', target:'window4', anchors:["BottomCenter", "TopCenter"]});
			var c6 = jsPlumb.connect({source:'window1', target:'window6', anchors:[[ 0.95, 1, 0, 1 ], "TopCenter"]});
			jsPlumb.connect({source:'window1', target:'window5', anchors:[[ 0.275, 1, 0, 1 ], "TopCenter"]});
			jsPlumb.connect({source:'window1', target:'window2', anchors:[[0.725, 1, 0, 1 ], "TopCenter"]});
	
			var idx = 0, steps = 50;
			c6.bind("click", function(c, e) {
				var step = function() {
					var loc = idx/steps;
					
					c.setPaintStyle({ gradient:{stops:[[0, '#225588'], [Math.max(loc-0.05,0), "#558822"], [loc,"white"], [Math.min(loc+0.05,1), "#558822"], [1, '#558822']] }, strokeStyle:'#558822', lineWidth:10 });
					idx++;
					if (idx == steps) {
						window.clearInterval(i);
						idx = 0;
						c.setPaintStyle(jsPlumb.Defaults.PaintStyle);
					}
				};
				var i = window.setInterval(step, 20);
			});
		}
	};	
})();