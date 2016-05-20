;(function() {

// add a few functions to the console.
    var times = {};
    console.cTimeStart = function(handle) {
        var h = handle;
        times[h] = times[h] || {s:null, e:null, time_ms:0, time_sec:0, calls:0, avg:0};
        times[h].s = new Date().getTime();
        times[h].calls++;
    };

    console.cTimeEnd = function(handle) {
        times[handle].e = new Date().getTime();
        times[handle].time_ms += (times[handle].e - times[handle].s);
        times[handle].time_sec = times[handle].time_ms / 1000;
        times[handle].avg = times[handle].time_ms / times[handle].calls;
    };

    console.cTimeSummary = function() {
        console.log("Cumulative");
        console.table(times, [ "time_ms", "time_sec", "calls", "avg" ]);
    };

    console.cTimeSummaryClear = function() {
        times = {};
    };

})();



;(function() {
    var endpoints = {}, elements = [];

    var html = function(els, val) {
            _each(els, function(id) {
                document.getElementById(id).innerHTML = val;
            });
        },
        _each = function(els, fn) {
            els = typeof els == "string" ? [ els ] : els;
            for (var i = 0; i < els.length; i++)
                fn(els[i]);
        },
        empty = function(els) {
            html(els, "");
        },
        val = function(sel) {
            return document.querySelectorAll(sel)[0].value;
        };

    window.jsPlumbLoadTest = {
        anchors:{
            "normal":[ "TopCenter", "BottomCenter" ],
            "dynamic":[ "AutoDefault", "AutoDefault" ],
            "continuous":[ "Continuous", "Continuous" ]
        },
        spacing:100,
        endpoint:{
            endpoint: [ "Dot", { radius:10 } ],
            paintStyle:{ fill:"#456", outlineColor:"black", outlineWidth:2 },
            connectorPaintStyle:{strokeWidth:1, stroke:"red"},
            connectorHoverStyle:{stroke:"#943"},
            isSource:true,
            isTarget:true,
            maxConnections:-1
        },

        reset : function(thenRun) {
            console.cTimeSummaryClear();
            endpoints = {};
            elements = [];
            var t = new Date().getTime();
            jsPlumb.reset();
            var t2 = new Date().getTime();

            empty(["numEndpoints", "createTime", "totalCreateTime", "averageCreateTime", "repaintTime", "averageRepaintTime", "demo" ]);
            html("resetTime", (t2 - t) + "ms");

            if (thenRun !== false) window.setTimeout(jsPlumbLoadTest.run, 250);
        },

        run : function() {

            var numElements = val("#txtElements"),
                numEndpoints = val("#txtEndpoints"),
                anchors = val("input[name='anchors']:checked"),
                suspend = val("input[name='chkSuspend']:checked") === "yes",
                setLabel = val("input[name='chkLabel']:checked") === "yes",
                actuallyPaint = val("input[name='chkPaint']:checked") === "yes";

            jsPlumb.importDefaults({
                Container: "demo",
                Overlays:[ "Arrow" ]
            });


            // for bulk drawing operations this is recommended.
            if (!actuallyPaint || suspend) jsPlumb.setSuspendDrawing(true);

            var ww = window.offsetWidth,
                x = 0, y = 0;

            for (var i = 0; i < numElements; i++) {
                var div = document.createElement("div");
                div.style.left = x + "px";
                div.style.top = y + "px";
                div.style.zIndex = 100;
                div.className = "jspLoad";
                div.setAttribute("id", "div-" + i);
                x += jsPlumbLoadTest.spacing;
                if (x > ww) {
                    x = 0;
                    y += jsPlumbLoadTest.spacing;
                }
                div.style.backgroundColor = "#123";
                document.getElementById("demo").appendChild(div);
                elements.push(div);
            }

            var st = (new Date()).getTime();
            for (var i = 0; i < elements.length; i++) {
                for (var j = 0; j < numEndpoints; j++) {
                    jsPlumb.addEndpoint(elements[i], jsPlumbLoadTest.endpoint);
                }

            }

            var t = (new Date()).getTime();

            //jsPlumb.draggable($(".jspLoad"));

            var st2 = (new Date()).getTime();
            // instruct jsplumb to unsuspend drawing, and to do a repaint.
            if (actuallyPaint && suspend)
                jsPlumb.setSuspendDrawing(false, true);
            var t2 = (new Date()).getTime();

            var endpointCount = numElements * numEndpoints;

            html("numEndpoints", endpointCount);
            html("totalCreateTime", (t-st) + (t2-st2) + "ms");
            html("createTime", (t-st) + "ms");
            html("averageCreateTime", ((t-st)/endpointCount).toFixed(2) + "ms");
            html("repaintTime", (t2-st2) + "ms");
            html("averageRepaintTime", ((t2-st2)/endpointCount).toFixed(2) + "ms");

            console.cTimeSummary();

        }
    };


    jsPlumb.ready(function() {
        jsPlumb.on(document.getElementById("btnTest"), "click", jsPlumbLoadTest.reset);

        jsPlumb.on(document.getElementById("btnReset"), "click", function() { jsPlumbLoadTest.reset(false); });
    });
})();