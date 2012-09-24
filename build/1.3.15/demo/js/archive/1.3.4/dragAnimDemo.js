;(function() {
	
	// notice there are no dragOptions specified here, which is different from the
	// draggableConnectors2 demo.  all connections on this page are therefore
	// implicitly in the default scope.
	var endpoint = {
			anchor:[0.5,0.5,0,-1],
			connectorStyle:{ lineWidth:7,strokeStyle:"rgba(198,89,30,0.7)" },
			endpointsOnTop:true,
			isSource:true,
			maxConnections:10,
			isTarget:true,
			dropOptions:{ tolerance:"touch",hoverClass:"dropHover" }
	},
	
	prepare = function(elId) {
		jsPlumbDemo.initHover(elId);
		jsPlumbDemo.initAnimation(elId);
		
		return jsPlumb.addEndpoint(elId, endpoint);
	},
	
	discs = [];
	

	window.jsPlumbDemo = {
		init : function() {

			jsPlumb.Defaults.DragOptions = { cursor: 'wait', zIndex:20 };
			jsPlumb.Defaults.Endpoint = [ "Image", { url:"../img/littledot.png" } ];
			jsPlumb.Defaults.Connector = [ "Bezier", { curviness: 90 } ];				
				
			var e1 = prepare("bd1");
			var e2 = prepare("bd2");
			var e3 = prepare("bd3");
			var e4 = prepare("bd4");
	
			jsPlumbDemo.initClearButton();
	
			jsPlumb.connect({ source:e1, target:e2 });
			jsPlumb.connect({ source:e1, target:e3 });
			jsPlumb.connect({ source:e1, target:e4 });
	
			jsPlumbDemo.initAddButton();
		},
		
		// this is overridden by the YUI demo.
		createDisc : function() {
			var d = document.createElement("div");
			d.className = "bigdot";
			document.getElementById("demo").appendChild(d);
			var id = '' + ((new Date().getTime())), _d = jsPlumb.CurrentLibrary.getElementObject(d);
			jsPlumb.CurrentLibrary.setAttribute(_d, "id", id);
			var w = screen.width - 162, h = screen.height - 162;
			var x = (0.2 * w) + Math.floor(Math.random()*(0.5 * w));
			var y = (0.2 * h) + Math.floor(Math.random()*(0.6 * h));
			d.style.top= y + 'px';
			d.style.left= x + 'px';
			return {d:d, id:id};
		},
		
		addDisc : function() {
			var info = jsPlumbDemo.createDisc();
			var e = prepare(info.id);	
			jsPlumb.draggable(info.id);
			discs.push(info.id);
		},
		
		reset : function() {
			for (var i = 0; i < discs.length; i++) {
				var d = document.getElementById(discs[i]);
				if (d) d.parentNode.removeChild(d);
			}
			discs = [];
		}
	};
	
})();
