jsPlumb.ready(function () {

    var instance = jsPlumb.getInstance({
        Connector: "Straight",
        PaintStyle: { strokeWidth: 3, stroke: "#ffa500", "dashstyle": "2 4" },
        Endpoint: [ "Dot", { radius: 5 } ],
        EndpointStyle: { fill: "#ffa500" },
        Container: "canvas",
        ListStyle:{
            endpoint:[ "Rectangle", { width:30, height:30 }]
        }
    });

    window.jsp = instance;

    // get the two elements that contain a list inside them
    var list1El = document.querySelector("#list-one"),
        list2El = document.querySelector("#list-two"),
        list1Ul = list1El.querySelector("ul"),
        list2Ul = list2El.querySelector("ul");

    instance.draggable(list1El);
    instance.draggable(list2El);

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

    // configure list1Ul manually, as it does not have a `jtk-scrollable-list` attribute, whereas list2Ul does, and is therefore
    // configured automatically.
    instance.addList(list1Ul, {
        endpoint:["Rectangle", {width:20, height:20}]
    });


    instance.bind("click", function(c) { instance.deleteConnection(c); });

    jsPlumb.on(document, "change", "[type='checkbox']", function(e) {
        instance[e.srcElement.checked ? "addList" : "removeList"](e.srcElement.value === "list1" ? list1Ul : list2Ul);
    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);
});
