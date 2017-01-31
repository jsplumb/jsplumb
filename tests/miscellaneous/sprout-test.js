jsPlumb.bind("click", function(c) {
	var p = $(c.canvas).find("path"),
		l = p[0].getTotalLength(),
		i = l, d = -10, s = 150,
		att = function(a, v) {
			for (var i = 0; i < p.length; i++)
				p[i].setAttribute(a, v);
		},
		tick = function() {
			if (i > 0) {
				i += d;
				att("stroke-dashoffset", i);
				window.setTimeout(tick, s);
			}
		};
	att("stroke-dasharray", l + " " + l);
	tick();

});