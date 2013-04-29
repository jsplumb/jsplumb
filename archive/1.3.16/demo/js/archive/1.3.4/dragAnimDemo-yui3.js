/**
unavoidable separate file for jquery specific parts of the dragAnimDemo.
*/
;(function() {
	
	jsPlumbDemo.initClearButton = function() {
		Y.one("#clear").detach("click", jsPlumb.detachEveryConnection );
		Y.one("#clear").on("click", jsPlumb.detachEveryConnection );
	};
	
	jsPlumbDemo.initAddButton = function() {
		Y.one("#add").detach("click", jsPlumbDemo.addDisc );
		Y.one("#add").on("click", jsPlumbDemo.addDisc );
	};
	
	jsPlumbDemo.initHover = function(elId) {
		var el = Y.one("#" + elId); 
		el.on('mouseover', function(e) { 
			this.addClass("bigdot-hover"); 
		});		
		el.on('mouseout', function(e) { 
			this.removeClass("bigdot-hover"); 
		});
	};
	
	jsPlumbDemo.initAnimation = function(elId) {
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
	};
	
	jsPlumbDemo.createDisc = function() {
		var id = 'disc_' + ((new Date().getTime())),
		    w = screen.width - 162, h = screen.height - 162,
            x = (0.2 * w) + Math.floor(Math.random()*(0.5 * w)),
		    y = (0.2 * h) + Math.floor(Math.random()*(0.6 * h)),
		    style="top:" + y + "px;left:" + x + "px;";
		
		var d = Y.Node.create('<div id="' + id + '" style="' + style + '" class="bigdot"></div>');
		Y.one("#demo").append(d);
		return {d:d, id:id};
	};

})();