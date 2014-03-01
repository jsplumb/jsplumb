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
		[ "yui", "YUI3" ],
		[ "dom", "Vanilla"]
	];

	jsPlumb.bind("ready", function() {
		var current = document.body.getAttribute("data-demo-id"),
			library = document.body.getAttribute("data-library");

		if (current && library) {
			var idx = jsPlumbUtil.findWithFunction(list, function(i) { return i[0] == current; }),
				prev = idx == 0 ? list.length - 1 : idx - 1,
				next = idx == list.length - 1 ? 0 : idx + 1,
				_d = function(tag, clazz, parent, html, atts, atStart) {
					var d = document.createElement(tag);
					d.className = clazz;
					if (parent) {
						if (atStart && parent.childNodes.length > 0)
							parent.insertBefore(d, parent.firstChild);
						else
							parent.appendChild(d);
					}
					if (html) d.innerHTML = html;
					if (atts) {
						for (var i in atts)
							d.setAttribute(i, atts[i]);
					}
					return d;
				};

			// next/previous links
			var d = _d("div",  "demo-links", document.body),
				dp = _d("div",  "", d, "<a href='../" + list[prev][0] + "/" + library + ".html'>" + list[prev][1] + "<i class='fa fa-arrow-left'></i></a>"),
				dc = _d("div",  "current-library", d, list[idx][1]),
				dn = _d("div",  "", d, "<a href='../" + list[next][0] + "/" + library + ".html'><i class='fa fa-arrow-right'></i>" + list[next][1] + "</a>");

			// make a drop down.
			var m = document.querySelectorAll(".menu")[0],
				sel = _d("select", "", m, null, null, true);
			for (var i = 0; i < list.length; i++) {
				var opts = {"data-href":"../" + list[i][0] +"/" + library + ".html"};
				if (list[i][0] == current)
					opts["selected"] = true;
				_d("option", "", sel, list[i][1], opts, null);
			}
			jsPlumb.on(sel, "change", function() {
				document.location = sel.options[sel.selectedIndex].getAttribute("data-href");					
			});
			sel.style.marginRight = "20px";

			// library links
			var lidx = jsPlumbUtil.findWithFunction(libs, function(l) { return l[0] == library; }),
				ld = _d("div", "library-links", document.body);

			for (var i = 0; i <libs.length; i++) {
				_d("a", libs[i][0] == library ? "current-library" : "", ld, libs[i][1], {href:"../" + current + "/" + libs[i][0] + ".html"});
			}

			// explanation hide/show
			var expl = jsPlumb.getSelector(".explanation")[0];
			var iExpl = jsPlumb.getSelector(".explanation i")[0];
			jsPlumb.on(iExpl, "click", function() {
				var has = jsPlumbAdapter.hasClass(expl, "expanded");
				iExpl.className = "fa fa-" + (has ? "info" : "times") + "-circle";
				jsPlumbAdapter[has ? "removeClass" : "addClass"](expl, "expanded");
			});

		}

	});
})();