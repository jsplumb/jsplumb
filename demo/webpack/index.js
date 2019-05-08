var j = require("./node_modules/jsplumb/dist/js/jsplumb.js").jsPlumb.getInstance({
    Connector: "Flowchart",
    anchor: "Bottom",
    Endpoint: [ "Dot", { radius: 2 }],
    ConnectionOverlays: [
        [ "Arrow", { location: 0, width: 10, length: 7, foldbackPoint: 0.62, direction:-1 }]
    ],
    container:document.body
});

j.connect({source: "one", target: "two" });

j.on(window, "resize", j.repaintEverything);