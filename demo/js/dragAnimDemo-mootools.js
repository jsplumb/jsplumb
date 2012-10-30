

;(function() {
	
	var initClearButton = function() {
			$("clear").removeEvent("click", jsPlumb.detachEveryConnection);
			$("clear").addEvent("click", jsPlumb.detachEveryConnection );
		},
	
		initAddButton = function() {
			$("add").removeEvent("click", jsPlumbDemo.addDisc);
			$("add").addEvent("click", jsPlumbDemo.addDisc);
		},
	
		initHover = function(elId) {
		$(elId).addEvents({
				'mouseenter' : function() { $(this).addClass("bigdot-hover"); },
				'mouseleave' : function() { $(this).removeClass("bigdot-hover"); }
			});
		},
	
		initAnimation = function(elId) {
			$(elId).addEvent('click', function(e, ui) {
				if ($(this).hasClass("jsPlumb_dragged")) {
					$(this).removeClass("jsPlumb_dragged");
					return;
				}
				var o = $(this).getPosition();						
				var s = $(this).getSize();
				var w = s.x, h = s.y;
				var c = [o.x + (w/2) - e.page.x, o.y + (h/2) - e.page.y];
				var oo = [c[0] / w, c[1] / h];
				var DIST = 450;
				var dl = Math.abs(oo[0] * DIST);
				var dt = Math.abs(oo[1] * DIST);
				if (c[0] > 0) dl = dl * -1;
				if (c[1] > 0) dt = dt * -1;
				l = o.x + dl;
				t = o.y + dt;
				
				jsPlumb.animate($(this), {'left':'' + l, 'top':'' + t }, {duration:900});
			});
		},
	
	// notice there are no dragOptions specified here, which is different from the
	// draggableConnectors2 demo.  all connections on this page are therefore
	// implicitly in the default scope.
		endpoint = {
			anchor:[0.5,0.5,0,-1],
			connectorStyle:{ lineWidth:7,strokeStyle:"rgba(198,89,30,0.7)" },
			endpointsOnTop:true,
			isSource:true,
			maxConnections:10,
			isTarget:true,
			dropOptions:{ tolerance:"touch",hoverClass:"dropHover" }
		},
	
		prepare = function(elId) {
			initHover(elId);
			initAnimation(elId);
			
			return jsPlumb.addEndpoint(elId, endpoint);
		},
		
		// this is overridden by the YUI demo.
		createDisc = function() {
			var d = document.createElement("div");
			d.className = "bigdot";
			document.getElementById("main").appendChild(d);
			var id = '' + ((new Date().getTime())), _d = jsPlumb.CurrentLibrary.getElementObject(d);
			jsPlumb.CurrentLibrary.setAttribute(_d, "id", id);
			var w = screen.width - 162, h = screen.height - 162;
			var x = (0.2 * w) + Math.floor(Math.random()*(0.5 * w));
			var y = (0.2 * h) + Math.floor(Math.random()*(0.6 * h));
			d.style.top= y + 'px';
			d.style.left= x + 'px';
			return {d:d, id:id};
		},
		
		discs = [];
	

	window.jsPlumbDemo = {
		init : function() {

			jsPlumb.importDefaults({
				DragOptions : { cursor: 'wait', zIndex:20 },
				Endpoint : [ "Image", { url:"../img/littledot.png" } ],
				Connector : [ "Bezier", { curviness: 90 } ]
			});				
				
			var e1 = prepare("bd1"),
				e2 = prepare("bd2"),
				e3 = prepare("bd3"),
				e4 = prepare("bd4");
	
			initClearButton();
	
			jsPlumb.connect({ source:e1, target:e2 });
			jsPlumb.connect({ source:e1, target:e3 });
			jsPlumb.connect({ source:e1, target:e4 });
	
			initAddButton();
		},
				
		
		addDisc : function() {
			var info = createDisc();
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