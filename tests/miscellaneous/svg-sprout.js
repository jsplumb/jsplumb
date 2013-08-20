// http://jakearchibald.com/2013/animated-line-drawing-svg/?utm_source=html5weekly&utm_medium=email

jsPlumb.bind("click", function(c) {
	var paths = $(c.canvas).find("path"),
		l = paths[0].getTotalLength(),
		i = l, d = -10, s = 150,
		att = function(a, v) {
			for (var i = 0; i < paths.length; i++)
				paths[i].setAttribute(a, v);
		},
		tick = function() {
			if (i > 0) {
				i += d;
				att("stroke-dashoffset", i);
				window.setTimeout(tick, s);
			}
			else {
				att("stroke-dasharray", "");
				att("stroke-dashoffset", "");
				c.showOverlays();
			}
		};
	att("stroke-dasharray", l + " " + l);
	att("stroke-dashoffset", l);
	c.hideOverlays();
	tick();

	/*var _one = function(path) {
		var length = path.getTotalLength();
		// Clear any previous transition
		path.style.transition = path.style.WebkitTransition =
		  'none';
		// Set up the starting positions
		path.style.strokeDasharray = length + ' ' + length;
		path.style.strokeDashoffset = length;
		// Trigger a layout so styles are calculated & the browser
		// picks up the starting position before animating
		path.getBoundingClientRect();
		// Define our transition
		path.style.transition = path.style.WebkitTransition =
		  'stroke-dashoffset 5s ease-in-out';
		// Go!
		path.style.strokeDashoffset = '0';
	}

	for (var i = 0; i < paths.length; i++) {
		_one(paths[i])
	}*/

});