;(function() {
	
	window.jsPlumbDemo = {
		init : function() {

			var exampleColor = '#00f';
			var exampleDropOptions = {
					tolerance:'touch',
					hoverClass:'dropHover',
					activeClass:'dragActive'
				};

			var anchors = [[0.2, 0, 0, -1], [1, 0.2, 1, 0], [0.8, 1, 0, 1], [0, 0.8, -1, 0] ];
			var aConnection = {	
				endpoint:["Rectangle", {width:5, height:5} ],				
				endpointStyle:{ width:25, height:21, fillStyle:exampleColor },
				paintStyle : {
					gradient:{stops:[[0, exampleColor], [0.5, '#09098e'], [1, exampleColor]]},
					lineWidth:5,
					strokeStyle:exampleColor
				},
				dynamicAnchors:anchors,
				overlays:[ ["Diamond", { fillStyle:'#09098e', width:15, length:15 } ] ]
			};
			jsPlumb.DefaultDragOptions = { cursor: 'pointer', zIndex:2000 };

			jsPlumb.connect({ source:"window1", target:"window3" }, aConnection);
			jsPlumb.connect({ source:"window3", target:"window5" }, aConnection);
			jsPlumb.connect({ source:"window2", target:"window5" }, aConnection);
			jsPlumb.connect({ source:"window5", target:"window6" }, aConnection);
			jsPlumb.connect({ source:"window1", target:"window4" }, aConnection);
			jsPlumb.connect({ source:"window4", target:"window2" }, aConnection);
		}
	};
	
})();