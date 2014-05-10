jsPlumb.ready(function() {	

	var instance, 
		discs = [],

		addDisc = function(evt) {
			var info = createDisc();
			var e = prepare(info.id);	
			instance.draggable(info.id);
			discs.push(info.id);
			evt.stopPropagation();
			evt.preventDefault();
		},
		
		reset = function(e) {
			for (var i = 0; i < discs.length; i++) {
				var d = document.getElementById(discs[i]);
				if (d) d.parentNode.removeChild(d);
			}
			discs = [];
			e.stopPropagation();
			e.preventDefault();
		},	
	
		initAnimation = function(elId) {
			var el = document.getElementById(elId),
				_el = jsPlumb.getElementObject(el);

			instance.on(el, 'click', function(e, ui) {
				if (el.className.indexOf("jsPlumb_dragged") > -1) {
					jsPlumb.removeClass(elId, "jsPlumb_dragged");
					return;
				}
				e =jsPlumb.getOriginalEvent(e);
				var o = jsPlumbAdapter.getOffset(_el, instance, true),
					o2 = jsPlumbAdapter.getOffset(_el, instance),
					s = jsPlumb.getSize(el),
					pxy = [e.pageX || e.clientX, e.pageY || e.clientY],
					c = [pxy[0] - (o.left + (s[0]/2)), pxy[1] - (o.top + (s[1]/2))],
					oo = [c[0] / s[0], c[1] / s[1]],
					DIST = 350,
					l = o2.left + (oo[0] * DIST),
					t = o2.top + (oo[1] * DIST);
				
				var id = el.getAttribute("id");
				instance.animate(el, {left:l, top:t}, { duration:350, easing:'easeOutBack' });
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
			initAnimation(elId);
			
			return instance.addEndpoint(elId, endpoint);
		},
		
		// this is overridden by the YUI demo.
		createDisc = function() {
			var d = document.createElement("div");
			d.className = "bigdot";
			document.getElementById("animation-demo").appendChild(d);
			var id = '' + ((new Date().getTime()));
			d.setAttribute("id", id);
			var w = screen.width - 162, h = screen.height - 162;
			var x = (0.2 * w) + Math.floor(Math.random()*(0.5 * w));
			var y = (0.2 * h) + Math.floor(Math.random()*(0.6 * h));
			d.style.top= y + 'px';
			d.style.left= x + 'px';
			return {d:d, id:id};
		};

	// get a jsPlumb instance, setting some appropriate defaults and a Container.
	instance = jsPlumb.getInstance({
		DragOptions : { cursor: 'wait', zIndex:20 },
		Endpoint : [ "Image", { url:"../../img/littledot.png" } ],
		Connector : [ "Bezier", { curviness: 90 } ],
		Container:"animation-demo"
	});				
		
	// suspend drawing and initialise.
	instance.doWhileSuspended(function() {
		var e1 = prepare("bd1"),
			e2 = prepare("bd2"),
			e3 = prepare("bd3"),
			e4 = prepare("bd4"),
			clearBtn = jsPlumb.getSelector("#anim-clear"),
			addBtn = jsPlumb.getSelector("#add");

		instance.on(clearBtn, "click", function(e) {
			e.preventDefault();
			e.stopPropagation();
			instance.detachEveryConnection(); 
		});

		instance.connect({ source:e1, target:e2 });
		instance.connect({ source:e1, target:e3 });
		instance.connect({ source:e1, target:e4 });

		instance.on(addBtn, 'click', addDisc );							
	});

	jsPlumb.fire("jsPlumbDemoLoaded", instance);
});