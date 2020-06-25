;(function() {

// add a few functions to the console.
    var times = {}, indent = 0, handleMap = {};
    console.cTimeStart = function(handle) {
        //var h = (new Array(indent).join("-")) + handle;
        var h = handle;
        //handleMap[handle] = h;
        times[h] = times[h] || {s:null, e:null, time_ms:0, time_sec:0, calls:0, avg:0};
        times[h].s = new Date().getTime();
        times[h].calls++;
        indent += 2;
    };

    console.cTimeEnd = function(handle) {
        //handle = handleMap[handle];
        times[handle].e = new Date().getTime();
        times[handle].time_ms += (times[handle].e - times[handle].s);
        // times[handle].time_sec = times[handle].time_ms / 1000;
        // times[handle].avg = times[handle].time_ms / times[handle].calls;
        indent -= 2;
    };

    console.cTimeSummary = function() {
        console.log("Cumulative");
        for (var handle in times) {
            times[handle].time_sec = times[handle].time_ms / 1000;
            times[handle].avg = times[handle].time_ms / times[handle].calls;
        }
        console.table(times, [ "time_ms", "time_sec", "calls", "avg" ]);
        //console.table(times);
    };

    console.cTimeSummaryClear = function() {
        times = {};
    };

})();








;(function() {
    var endpoints = {}, instance;

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
            paintStyle:{ fill:"#456", outlineStroke:"black", outlineWidth:2 },
            connectorPaintStyle:{strokeWidth:1, stroke:"red"},
            connectorHoverStyle:{stroke:"#943"},
            isSource:true,
            isTarget:true,
            maxConnections:-1
        },

        reset : function(thenRun) {
            console.cTimeSummaryClear();
            endpoints = {};
            var t = new Date().getTime();
            instance.reset();
            var t2 = new Date().getTime();

            empty(["numConnections", "createTime", "totalCreateTime", "averageCreateTime", "repaintTime", "averageRepaintTime", "demo", 'epCreateTime', 'averageEpCreateTime' ]);
            html("resetTime", (t2 - t) + "ms");

            if (thenRun !== false) window.setTimeout(jsPlumbLoadTest.run, 250);
        },

        run : function() {



            var numElements = val("#txtElements"),
                anchors = val("input[name='anchors']:checked"),
                suspend = val("input[name='chkSuspend']:checked") === "yes",
                setLabel = val("input[name='chkLabel']:checked") === "yes",
                actuallyPaint = val("input[name='chkPaint']:checked") === "yes";

            instance.importDefaults({
                container: "demo",
                overlays:[ "Arrow" ]
            });


            // for bulk drawing operations this is recommended.
            if (!actuallyPaint || suspend) instance.setSuspendDrawing(true);

            var st = (new Date()).getTime(),
                ww = window.offsetWidth,
                x = 0, y = 0;

            var et = 0, epCount = 0;

            var radialPadding = 60;
            var width = 30;
            var height = 30;

            var origin = [200,200];

            function pos(i) {
                var a = Math.log(i) / Math.log(2),
                    b = Math.floor(a),
                    c = Math.pow(2, b),
                    d = (i - c);

                var radius = b * radialPadding;
                var stepDegrees = (Math.PI * 2) / c;
                var rotation = d * stepDegrees;
                var y = radius * Math.sin(rotation);
                var x = radius * Math.cos(rotation);

                return [x, y];
            }

            var elements = [], endpoints = [], connections = [];

            //
            var t = (new Date()).getTime();
            for (var i = 0; i < numElements; i++) {
                var div = document.createElement("div");
                var p = pos(i + 1);

                div.style.left = (origin[0] + p[0]) + "px";
                div.style.top= (origin[1] + p[1]) + "px";

                div.style.width = width + "px";
                div.style.height = height + "px";

                div.style.zIndex = 100;
                div.className = "jspLoad";
                div.setAttribute("id", "div-" + i);

                div.style.backgroundColor = "#123";
                document.getElementById("demo").appendChild(div);

                instance.draggable(div);

                elements.push(div);
            }
            var t2 = (new Date()).getTime();
            var createElementTotal = t2 - t;

            t = new Date().getTime();
            for (var i = 0; i < elements.length; i++) {

                var ep = instance.addEndpoint( elements[i], { anchor:"Center" }, jsPlumbLoadTest.endpoint );
                endpoints.push(ep);
            }
            t2 = new Date().getTime();
            var addEndpointTotal = t2 - t;


            var connCount = 0;
            t = new Date().getTime();
            for (var i = 1; i < elements.length; i++) {
                connections.push(instance.connect({
                    source:endpoints[0],
                    target:endpoints[i],
                    paintStyle:{
                        strokeWidth:1, stroke:"red"
                    },
                    connector:"Bezier",
                    overlays:[
                        [ "Arrow", {location:0.7} ],
                        [ "Arrow", {location:0.3} ]
                    ]
                }));
            }
            t2 = new Date().getTime();
            var connectTotal = t2 - t;


            t = (new Date()).getTime();
            // instruct jsplumb to unsuspend drawing, and to do a repaint.
            if (actuallyPaint && suspend)
                instance.setSuspendDrawing(false, true);
            t2 = (new Date()).getTime();
            var repaintTotal = t2 - t;

            html("numElements", elements.length);

            html("numConnections", connections.length);
            html("totalCreateTime", (repaintTotal + addEndpointTotal + connectTotal + createElementTotal) + "ms");

            html("numEndpoints", endpoints.length);
            html("epCreateTime", (addEndpointTotal) + "ms");
            html("averageEpCreateTime", ((addEndpointTotal)/endpoints.length).toFixed(2) + "ms");

            html("elementCreateTime", (createElementTotal) + "ms");
            html("averageElementCreateTime", (createElementTotal / elements.length) + "ms");

            html("createTime", (connectTotal) + "ms");
            html("averageCreateTime", ((connectTotal)/connections.length).toFixed(2) + "ms");

            html("repaintTime", (repaintTotal) + "ms");
            html("averageRepaintTime", ((repaintTotal)/connections.length).toFixed(2) + "ms");

            console.cTimeSummary();

        }
    };


    jsPlumb.ready(function() {
        instance = jsPlumb.getInstance({Container:demo});

        instance.on(document.getElementById("btnTest"), "click", jsPlumbLoadTest.reset);

        instance.on(document.getElementById("btnReset"), "click", function() { jsPlumbLoadTest.reset(false); });
    });
})();
