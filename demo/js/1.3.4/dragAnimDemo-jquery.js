/**
unavoidable separate file for jquery specific parts of the dragAnimDemo.
*/
;(function() {
	
	jsPlumbDemo.initClearButton = function() {
		$("#clear").unbind("click", jsPlumb.detachEveryConnection);
		$("#clear").bind("click", jsPlumb.detachEveryConnection );
	};
	
	jsPlumbDemo.initAddButton = function() {
		$("#add").unbind("click", jsPlumbDemo.addDisc );
		$("#add").bind('click', jsPlumbDemo.addDisc );
	};	
	
	jsPlumbDemo.initHover = function(elId) {
		$("#" + elId).hover(
			function() { $(this).addClass("bigdot-hover"); },
			function() { $(this).removeClass("bigdot-hover"); }
		);
	};
	
	jsPlumbDemo.initAnimation = function(elId) {
		$("#" + elId).bind('click', function(e, ui) {
			if ($(this).hasClass("jsPlumb_dragged")) {
				$(this).removeClass("jsPlumb_dragged");
				return;
			}
			var o = $(this).offset(),
			w = $(this).outerWidth(),
			h = $(this).outerHeight(),
			c = [o.left + (w/2) - e.pageX, o.top + (h/2) - e.pageY],
			oo = [c[0] / w, c[1] / h],
			l = oo[0] < 0 ? '+=' : '-=', t = oo[1] < 0 ? "+=" : '-=',
			DIST = 450,
			l = l + Math.abs(oo[0] * DIST);

			t = t + Math.abs(oo[1] * DIST);
			// notice the easing here.  you can pass any args into this animate call; they
			// are passed through to jquery as-is by jsPlumb.
			var id = $(this).attr("id");
			jsPlumb.animate(id, {left:l, top:t}, { duration:1400, easing:'easeOutBack' });
		});
	};	
})();