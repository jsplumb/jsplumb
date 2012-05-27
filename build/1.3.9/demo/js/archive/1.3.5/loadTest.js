;(function() {
    var endpoints = {};

    window.jsPlumbDemo = {
        anchors:[ "TopCenter", "BottomCenter" ],
        elements:10,
        spacing:400,
        endpoint:{
            endpoint: [ "Dot", { radius:15 } ],
            paintStyle:{ fillStyle:"#456", outlineColor:"black", outlineWidth:1 },
            connectorHoverStyle:{strokeStyle:"#943"},
            isSource:true,
            isTarget:true,
            maxConnections:-1
        },

        init : function() {
            // for bulk drawing operations this is recommended.
            jsPlumb.setSuspendDrawing(true);

            var st = (new Date()).getTime(),
                ww = $(window).width(),
                x = 0, y = 0;
            
            for (var i = 0; i < jsPlumbDemo.elements; i++) {
                var div = document.createElement("div");
                div.style.left = x + "px";
                div.style.top = y + "px";
                div.style.zIndex = 100;
                div.className = "jspLoad";
                div.setAttribute("id", "div-" + i);
                x += jsPlumbDemo.spacing;
                if (x > ww) {
                    x = 0;
                    y += jsPlumbDemo.spacing;
                }
                div.style.backgroundColor = "#123";
                document.body.appendChild(div);
                var _e = [];
                for (var j = 0; j < jsPlumbDemo.anchors.length; j++) {
                    _e.push(jsPlumb.addEndpoint( div, { anchor:jsPlumbDemo.anchors[j] }, jsPlumbDemo.endpoint ));
                }
                endpoints["div-" + i] = _e;
            }

            var connCount = 0;
            for (var i = 0; i < jsPlumbDemo.elements; i++) {
                for (var j = 0; j < jsPlumbDemo.elements; j++) {
                    if (i != j) {
                        var ep1 = endpoints["div-" + i],
                            ep2 = endpoints["div-" + j];

                        for (var k = 0; k < ep1.length; k++) {
                            for (var l = 0; l < ep2.length; l++) {
                                jsPlumb.connect({source:ep1[k], target:ep2[l]});
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
            jsPlumb.setSuspendDrawing(false, true);
            var t2 = (new Date()).getTime();

            $("#result").html("created " + connCount + " connections in " + (t-st) + " milliseconds<br/>repainted in " + (t2-st2) + " milliseconds");
        },
        reset : function() {
            $(".jspLoad").remove();
        }
    };
})();