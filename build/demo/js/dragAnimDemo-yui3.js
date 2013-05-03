
;(function() {
	
	var initClearButton = function() {
			Y.one("#clear").detach("click", jsPlumb.detachEveryConnection );
			Y.one("#clear").on("click", jsPlumb.detachEveryConnection );
		},
	
		initAddButton = function() {
			Y.one("#add").detach("click", jsPlumbDemo.addDisc );
			Y.one("#add").on("click", jsPlumbDemo.addDisc );
		},
	
		initHover = function(elId) {
			var el = Y.one("#" + elId); 
			el.on('mouseover', function(e) { 
				this.addClass("bigdot-hover"); 
			});		
			el.on('mouseout', function(e) { 
				this.removeClass("bigdot-hover"); 
			});
		},
	
		initAnimation = function(elId) {
			var el = Y.one("#" + elId); 
			el.on('click', function(e) {
				if (this.hasClass("jsPlumb_dragged")) {
					this.removeClass("jsPlumb_dragged");
					return;
				}
				var o = this._node.getBoundingClientRect(),
					w = o.right - o.left,
					h = o.bottom - o.top,
					c = [o.left + (w/2) - e.pageX, o.top + (h/2) - e.pageY],
					oo = [c[0] / w, c[1] / h],
					DIST = 450,
					l = o.left - (oo[0] * DIST),
					t = o.top - (oo[1] * DIST);
				
				jsPlumb.animate(elId, {left:l, top:t}, {duration:0.9});
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
			var id = 'disc_' + ((new Date().getTime())),
				w = screen.width - 162, h = screen.height - 162,
				x = (0.2 * w) + Math.floor(Math.random()*(0.5 * w)),
				y = (0.2 * h) + Math.floor(Math.random()*(0.6 * h)),
				style="top:" + y + "px;left:" + x + "px;";
			
			var d = Y.Node.create('<div id="' + id + '" style="' + style + '" class="bigdot"></div>');
			Y.one("#main").append(d);
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