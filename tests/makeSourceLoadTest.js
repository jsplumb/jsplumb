;(function() {
    var elements = [], hasRun = false;

    window.jsPlumbLoadTest = {
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
            $("#numConnections").html("");
            $("#totalCreateTime").html("");
            $("#averageCreateTime").html("");
            $("#repaintTime").html("");
            var t = new Date().getTime();
            jsPlumb.reset();
            var t2 = new Date().getTime();
            $("#resetTime").html(t2 - t);
            $("#demo").empty();

            if (thenRun !== false) window.setTimeout(jsPlumbLoadTest.run, 250);
        },        

        run : function() {
            hasRun = true;

            var numElements = $("#txtElements").val(),
                makeSource = $("#chkMakeSource")[0].checked,
                makeTarget = $("#chkMakeTarget")[0].checked,
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
                elements.push(div);
                if (makeSource) jsPlumb.makeSource(div);
                if (makeTarget) jsPlumb.makeTarget(div);
            }


            var connCount = 0, time = 0;
/*            for (var i = 0; i < numElements; i++) {
                for (var j = 0; j < numElements; j++) {
                    if (i != j) {                       
                        jsPlumb.connect({source:elements[i], target:elements[j]});
                        connCount++;
                    }
                }
            }
*/            

            var t = (new Date()).getTime();

            jsPlumb.draggable($(".jspLoad"));

            var st2 = (new Date()).getTime();
            // instruct jsplumb to unsuspend drawing, and to do a repaint.
            if (suspend) jsPlumb.setSuspendDrawing(false, true);
            var t2 = (new Date()).getTime();

            $("#numConnections").html(connCount);
            $("#totalCreateTime").html((t-st) + (t2-st2));
            $("#createTime").html(t-st);
            $("#averageCreateTime").html((t-st)/connCount);
            $("#repaintTime").html(t2-st2);
            $("#averageRepaintTime").html((t2-st2)/connCount);
            
        }        
    };

    window.connect = function(startIdx, endIdx, suspendDrawing) {
        if (!hasRun) {
            console.log("run test first"); return;
        }
        console.time("connect");
        jsPlumb.connect({source:"div-" + startIdx, target:"div-" + endIdx});
        console.timeEnd("connect");
    };

    window.bulkconnect = function(startIdx, endIdx, suspendDrawing) {
        if (!hasRun) {
            console.log("run test first"); return;
        }
        if (suspendDrawing)
            jsPlumb.setSuspendDrawing(true);

        console.time("connect");
        var c = 0, _t = [];
        for (var i = startIdx; i <= endIdx; i++) {
            for (var j = startIdx; j <= endIdx; j++) {
                if (i != j) {
                    var st = new Date().getTime();
                    jsPlumb.connect({source:"div-" + i, target:"div-" + j});
                    _t.push((new Date().getTime()) - st);
                    c++;
                }
            }
        }        

        if (suspendDrawing)
            jsPlumb.setSuspendDrawing(false, true);

        console.timeEnd("connect");
        console.log(c + " connections established");
        console.log(_t);
    };


    $(function() {
        $("#btnTest").bind("click", jsPlumbLoadTest.reset);
    });
})();