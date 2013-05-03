;(function() {
    var endpoints = {};

    window.jsPlumbLoadTest = {
        anchors:{
            "normal":[ "TopCenter", "BottomCenter" ],
            "dynamic":[ "AutoDefault", "AutoDefault" ],
            "continuous":[ "Continuous", "Continuous" ]
        },
        spacing:100,
        endpoint:{
            endpoint: [ "Dot", { radius:10 } ],
            paintStyle:{ fillStyle:"#456", outlineColor:"black", outlineWidth:2 },
            connectorPaintStyle:{lineWidth:1, strokeStyle:"red"},
            connectorHoverStyle:{strokeStyle:"#943"},
            isSource:true,
            isTarget:true,
            maxConnections:-1
        },

        reset : function(thenRun) {
            $("#numConnections").html("");
            $("#createTime").html("");
            $("#totalCreateTime").html("");
            $("#averageCreateTime").html("");
            $("#repaintTime").html("");
            $("#averageRepaintTime").html("");
            var t = new Date().getTime();
            jsPlumb.reset();
            var t2 = new Date().getTime();
            $("#resetTime").html((t2 - t) + "ms");
            $("#demo").empty();

            if (thenRun !== false) window.setTimeout(jsPlumbLoadTest.run, 250);
        },

        run : function() {

            var numElements = $("#txtElements").val(),
                anchors = $("input[name='anchors']:checked").val(),
                suspend = $("input[name='chkSuspend']:checked").val() === "yes",
                setLabel = $("input[name='chkLabel']:checked").val() === "yes";

            jsPlumb.importDefaults({
                Container: $("#demo"),
                Overlays:[ "Arrow" ]
            });
                    

            // for bulk drawing operations this is recommended.
            if (suspend) jsPlumb.setSuspendDrawing(true);

            var st = (new Date()).getTime(),
                ww = $(window).width(),
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
                $("#demo").append(div);
                var _e = [];
                for (var j = 0; j < jsPlumbLoadTest.anchors[anchors].length; j++) {
                    _e.push(jsPlumb.addEndpoint( div, { anchor:jsPlumbLoadTest.anchors[anchors][j] }, jsPlumbLoadTest.endpoint ));
                }
                endpoints["div-" + i] = _e;
            }

            var connCount = 0, time = 0;
            for (var i = 0; i < numElements; i++) {
                for (var j = 0; j < numElements; j++) {
                    if (i != j) {
                        var ep1 = endpoints["div-" + i],
                            ep2 = endpoints["div-" + j];

                        for (var k = 0; k < ep1.length; k++) {
                            for (var l = 0; l < ep2.length; l++) {
                                var ct = (new Date()).getTime();
                                var c = jsPlumb.connect({source:ep1[k], target:ep2[l], paintStyle:{lineWidth:1, strokeStyle:"red"}});
                                if (setLabel) c.setLabel("FOO");
                                var ctt = (new Date()).getTime();
                                time += (ctt - ct);
                                connCount ++;
                            }
                        }
                    }
                }
            }

            var t = (new Date()).getTime();

            jsPlumb.draggable($(".jspLoad"));

            var st2 = (new Date()).getTime();
            // instruct jsplumb to unsuspend drawing, and to do a repaint.
            if (suspend) jsPlumb.setSuspendDrawing(false, true);
            var t2 = (new Date()).getTime();

            $("#numConnections").html(connCount);
            $("#totalCreateTime").html((t-st) + (t2-st2) + "ms");
            $("#createTime").html((t-st) + "ms");
            $("#averageCreateTime").html(((t-st)/connCount).toFixed(2) + "ms");
            $("#repaintTime").html((t2-st2) + "ms");
            $("#averageRepaintTime").html(((t2-st2)/connCount).toFixed(2) + "ms");
            
        }
    };


    $(function() {
        $("#btnTest").bind("click", jsPlumbLoadTest.reset);
    });
})();