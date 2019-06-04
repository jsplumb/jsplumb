jsPlumb.ready(function () {

    var instance = jsPlumb.getInstance({
        Connector: "Straight",
        PaintStyle: { strokeWidth: 3, stroke: "#ffa500", "dashstyle": "2 4" },
        Endpoint: [ "Dot", { radius: 5 } ],
        EndpointStyle: { fill: "#ffa500" },
        Container: "canvas"
    });

    window.jsp = instance;

    // register the two elements that contain a list inside them
    var list1 = document.querySelector("#list-one"),
        list2 = document.querySelector("#list-two");

    instance.manage("list-one", list1);
    instance.manage("list-two", list2);

    instance.draggable(list1);
    instance.draggable(list2);

    // get uls
    var lists = jsPlumb.getSelector("ul");

    // suspend drawing and initialise.
    instance.batch(function () {
        for (var l = 0; l < lists.length; l++) {


            var isSource = lists[l].getAttribute("source") != null,
                isTarget = lists[l].getAttribute("target") != null;

            // configure items
            var items = lists[l].querySelectorAll("li");
            for (var i = 0; i < items.length; i++) {

                if (isSource) {
                    instance.makeSource(items[i], {
                        allowLoopback: false,
                        anchor: ["Left", "Right" ]
                    });
                }

                if (isTarget) {
                    instance.makeTarget(items[i], {
                        anchor: ["Left", "Right" ]
                    });
                }
            }
        }
    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);
});