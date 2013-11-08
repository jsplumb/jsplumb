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

	var libs = [
		[ "jquery", "jQuery"],
		[ "mootools", "MooTools" ],
		[ "yui", "YUI3" ]
	];

	jsPlumb.bind("ready", function() {
		var current = document.body.getAttribute("data-demo-id"),
			library = document.body.getAttribute("data-library");

		if (current && library) {
			var idx = jsPlumbUtil.findWithFunction(list, function(i) { return i[0] == current; }),
				prev = idx == 0 ? list.length - 1 : idx - 1,
				next = idx == list.length - 1 ? 0 : idx + 1,
				_d = function(t, c, p, h, a, atStart) {
					var d = document.createElement(t);
					d.className = c;
					if (p) {
						if (atStart && p.childNodes.length > 0)
							p.insertBefore(d, p.firstChild);
						else
							p.appendChild(d);
					}
					if (h) d.innerHTML = h;
					if (a) {
						for (var i in a)
							d.setAttribute(i, a[i]);
					}
					return d;
				};

			// next/previous links
			var d = _d("div",  "demo-links", document.body),
				dp = _d("div",  "", d, "<a href='" + list[prev][0] + "/" + library + ".html'>" + list[prev][1] + "<i class='fa fa-arrow-left'></i></a>"),
				dc = _d("div",  "", d, list[idx][1]),
				dn = _d("div",  "", d, "<a href='" + list[next][0] + "/" + library + ".html'><i class='fa fa-arrow-right'></i>" + list[next][1] + "</a>");

			if (typeof jQuery != "undefined") {
				// dropdown menu
				var m = document.getElementsByClassName("menu")[0],
					dd = _d("div", "dropdown", m, null, null, true),
					a = _d("a", "", dd, "DEMOS", {href:"#", "data-toggle":"dropdown"}),
					ul = _d("ul", "dropdown-menu", dd, null, { role:"menu" });

				for (var i = 0; i < list.length; i++) {
					var li = _d("li", "", ul, null, {role:"presentation"}),
						aa = _d("a", "", li, list[i][1], { role:"menuitem", tabindex:"-1", href:list[i][0] +"/" + library + ".html"});
				}

				$(a).dropdown();
			}
			else {
				// make a drop down.
			}

			// library links
			var lidx = jsPlumbUtil.findWithFunction(libs, function(l) { return l[0] == library; }),
				ld = _d("div", "library-links", document.body);

			for (var i = 0; i <libs.length; i++) {
				_d("a", libs[i][0] == library ? "current-library" : "", ld, libs[i][1], {href:current + "/" + libs[i][0] + ".html"});
			}


		}

			

	});
})();