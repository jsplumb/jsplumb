/**
unavoidable separate file for jquery specific parts of the dragAnimDemo.
*/
;(function() {
	
	jsPlumbDemo.initClearButton = function() {
		$("clear").removeEvent("click", jsPlumb.detachEverything);
		$("clear").addEvent("click", jsPlumb.detachEverything );
	};
	
	jsPlumbDemo.initAddButton = function() {
		$("add").removeEvent("click", jsPlumbDemo.addDisc);
		$("add").addEvent("click", jsPlumbDemo.addDisc);
	};	
	
	jsPlumbDemo.initHover = function(elId) {
		$(elId).addEvents({
			'mouseenter' : function() { $(this).addClass("bigdot-hover"); },
			'mouseleave' : function() { $(this).removeClass("bigdot-hover"); }
		});
	};
	
	jsPlumbDemo.initAnimation = function(elId) {
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
	};

})();