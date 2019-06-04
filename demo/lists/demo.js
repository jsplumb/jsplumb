jsPlumb.ready(function () {

    var instance = jsPlumb.getInstance({
        Connector: "Straight",
        PaintStyle: { strokeWidth: 3, stroke: "#ffa500", "dashstyle": "2 4" },
        Endpoint: [ "Dot", { radius: 5 } ],
        EndpointStyle: { fill: "#ffa500" },
        Container: "canvas"
    });

    window.jsp = instance;

    // get the two elements that contain a list inside them
    var list1 = document.querySelector("#list-one"),
        list2 = document.querySelector("#list-two");


    /*

    There are two ways of registering a list.

    1. by including a `jtk-scrollable-list` attribute on some element, and then calling `draggable` or `manage` on either that element
    or, as is the case here, on an ancestor of it.

    2. Add a list via the `addList(el, options)` method on a jsPlumb instance. The advantage of this approach is that you can provide endpoint and anchor specifications.

     */

    // approach #1: make draggable the ancestor of some element that has a `jtk-scrollable-group` attribute.
    instance.draggable(list1);
    instance.draggable(list2);

    // get uls
    var lists = jsPlumb.getSelector("ul");

    // suspend drawing and initialise.
    instance.batch(function () {

        var selectedSources = [], selectedTargets = [];

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

                    if (Math.random() < 0.2) {
                        selectedSources.push(items[i]);
                    }
                }

                if (isTarget) {
                    instance.makeTarget(items[i], {
                        anchor: ["Left", "Right" ]
                    });
                    if (Math.random() < 0.2) {
                        selectedTargets.push(items[i]);
                    }
                }
            }
        }

        var connCount = Math.min(selectedSources.length, selectedTargets.length);
        for (var i = 0; i < connCount; i++) {
            instance.connect({source:selectedSources[i], target:selectedTargets[i]});
        }
    });

    // approach #2: directly add a list, with options.
    instance.addList(list1.querySelector("ul"), {
        endpoint:["Rectangle", {width:20, height:20}]
    });



    instance.bind("click", function(c) { instance.deleteConnection(c); });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);
});