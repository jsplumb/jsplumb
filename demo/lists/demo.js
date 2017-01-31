jsPlumb.ready(function () {

    var instance = jsPlumb.getInstance({
        Connector: "StateMachine",
        PaintStyle: { strokeWidth: 3, stroke: "#ffa500", "dashstyle": "2 4" },
        Endpoint: [ "Dot", { radius: 5 } ],
        EndpointStyle: { fill: "#ffa500" },
        Container: "perimeter-demo"
    });

    window.jsp = instance;

    // attach scroll listeners to uls
    var lists = jsPlumb.getSelector("ul");

    // suspend drawing and initialise.
    instance.batch(function () {
        for (var l = 0; l < lists.length; l++) {

            // configure items
            var items = lists[l].querySelectorAll("li");
            for (var i = 0; i < items.length; i++) {
                instance.makeSource(items[i], {
                    allowLoopback: false,
                    anchor: "Right"
                });

                instance.makeTarget(items[i], {
                    anchor: "Left"
                });
            }

            // configure scroll listener
            instance.on(lists[l], "scroll", function () {
                console.log("i will repaint");
            });
        }
    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);
});