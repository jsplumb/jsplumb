;(function() {

	var version = "1.3.5",
	entries = [
		{ id:"demo", name:"jsPlumb Home", about:"Main jsPlumb demo page.  Contains a bit of everything" },
		{ id:"flowchartConnectorsDemo", name:"Flowchart Connectors", about:"Demonstration of the Flowchart connectors" },
		{ id:"draggableConnectorsDemo", name:"Draggable Connections", about:"Demonstration of drag and drop connections" },
		{ id:"chartDemo", name:"Chart Demonstration", about:"Simple Chart Demo" },
		{ id:"anchorDemo", name:"Sources and Targets", about:"Demonstration of how to make whole elements Connection sources and targets" },
		{ id:"stateMachineDemo", name:"State Machine", about:"Demonstration of the State Machine Connectors and Continuous Anchors" },
		{ id:"dynamicAnchorsDemo", name:"Dynamic Anchors", about:"Demonstration of Dynamic Anchors" },
		{ id:"dragAnimDemo", name:"Animation", about:"Drag/drop demo with animation" }
	],
	libraries = [
		{id:"jquery", name:"jQuery"},
		{id:"mootools", name:"MooTools"},
		{id:"yui3", name:"YUI3"}
	],
	prepareOtherLibraryString = function(demoId, library) {
		var s = "", demoInfo = jsPlumb.DemoList.find(demoId);
		for (var i = 0; i < libraries.length; i++) {
			var c = libraries[i].id == library ? "selected" : "";
			s += '<a class="' + c + '" href="../' + libraries[i].id + '/' + demoId + '.html">' + libraries[i].name + '</a>&nbsp;&nbsp;';
		}
		return s;
	},
	demoSelectorString = (function() {
		var s = '<h5>Select Demo:</h5><select id="demoSelector" class="demoSelector">';
		for (var i = 0; i < entries.length; i++) {
			s += '<option value="' + entries[i].id + '.html">' + entries[i].name + '</option>';
		}
		s += '</select>';
		return s;
	})();
	
	
	jsPlumb.DemoList = {
		find:function(id) {
			for (var i = 0; i < entries.length; i++) {
				if (entries[i].id === id) {
					var next = i < entries.length - 1 ? i + 1 : 0,
						prev = i > 0 ? i - 1 : entries.length - 1;
						
					return {
						current:entries[i],
						prev:entries[prev],
						next:entries[next],
						idx:i
					};
				}
			}
		},
		init : function() {
			var bod = document.body,
				demoId = bod.getAttribute("data-demo-id"),
				library = bod.getAttribute("data-library"),
				renderModeString = '<h5>Render Mode:</h5><a href="#" class="rmode" mode="svg">SVG</a>&nbsp;|&nbsp;<a href="#" class="selected rmode" mode="canvas">Canvas</a>&nbsp;|&nbsp;<a href="#" class="rmode" mode="vml">VML</a>',
				libraryString = '<h5>Library:</h5><div class="otherLibraries"></div>' + prepareOtherLibraryString(demoId, library),
				demoInfo = jsPlumb.DemoList.find(demoId);
				
			if (demoInfo) {
				var prevString = '<h5>Previous:</h5><a href="' + demoInfo.prev.id + '">' + demoInfo.prev.name + '</a>',
					nextString = '<h5>Next:</h5><a href="' + demoInfo.next.id + '">' + demoInfo.next.name + '</a>',
					menuString = '<div class="menu"><a href="../../doc/' + version + '/usage.html" class="mplink">view documentation</a>' +
							 '&nbsp;|&nbsp;<a href="../../apidocs">view api docs</a>' +
							 '&nbsp;|&nbsp;<a href="mailto:simon.porritt@gmail.com" class="mplink">contact me</a>' +
                             '&nbsp;|&nbsp;<a href="http://github.com/sporritt/jsplumb/" class="mplink">jsPlumb on GitHub</a>' +
							 '&nbsp;|&nbsp;<a href="http://code.google.com/p/jsplumb/" class="mplink">jsPlumb on Google code</a>' +			
							 '&nbsp;|&nbsp;<a href="http://jsplumb.tumblr.com" class="mplink">jsPlumb on Tumblr</a>';			
			
				var d = document.createElement("div");
				d.className = "renderMode";
				d.innerHTML = renderModeString + libraryString + prevString + "<br/>" + nextString + demoSelectorString;
				bod.appendChild(d);
			
				var m = document.createElement("div");
				m.className = "menu";
				m.innerHTML = menuString;
				bod.appendChild(m);
			
				var ds = document.getElementById("demoSelector");
				ds.selectedIndex = demoInfo.idx;
				ds.onchange = function() {
					window.location.href = ds.options[ds.selectedIndex].value;
				};
			}	
		}
	};
})();