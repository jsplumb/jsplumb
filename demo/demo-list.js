//
// this file is just used to automate the process of adding links to the individual demos to their previous/next
// demo.  you don't need to concern yourself with what's going on in here.
//
;(function() {
	var list = [ 
		[ "home", "Kitchen Sink" ],
		[ "flowchart", "Flowchart" ],
		[ "statemachine", "State Machine" ], 
		[ "draggableConnectors", "Drag and Drop"],
		[ "perimeterAnchors", "Perimeter Anchors"],
		[ "chart", "Hierarchical Chart" ],
		[ "sourcesAndTargets", "Sources and Targets" ],
		[ "dynamicAnchors", "Dynamic Anchors" ],
		[ "animation", "Animation" ]
	];

	jsPlumb.bind("ready", function() {
		var current = document.body.getAttribute("data-demo-id"),
			library = document.body.getAttribute("data-library"),
			idx = jsPlumbUtil.findWithFunction(list, function(i) { return i[0] == current; }),
			prev = idx == 0 ? list.length - 1 : idx - 1,
			next = idx == list.length - 1 ? 0 : idx + 1,
			_d = function(c, p, h) {
				var d = document.createElement("div");
				d.className = c;
				if (p) p.appendChild(d);
				if (h) d.innerHTML = h;
				return d;
			};

		var d = _d("demo-links", document.body),
			dp = _d("", d, "<a href='" + list[prev][0] + "/" + library + ".html'>" + list[prev][1] + "<i class='fa fa-arrow-left'></i></a>"),
			dc = _d("", d, list[idx][1]),
			dn = _d("", d, "<a href='" + list[next][0] + "/" + library + ".html'><i class='fa fa-arrow-right'></i>" + list[next][1] + "</a>");

	});
})();