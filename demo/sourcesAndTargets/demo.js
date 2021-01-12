jsPlumb.ready(function () {

    // list of possible anchor locations for the blue source element
    var sourceAnchors = [
        [ 0, 1, 0, 1 ],
        [ 0.25, 1, 0, 1 ],
        [ 0.5, 1, 0, 1 ],
        [ 0.75, 1, 0, 1 ],
        [ 1, 1, 0, 1 ]
    ];

    var instance = window.instance = jsPlumb.newInstance({
        // drag options
        dragOptions: { cursor: "pointer", zIndex: 2000 },
        // default to a gradient stroke from blue to green.
        paintStyle: {
            gradient: { stops: [
                [ 0, "#0d78bc" ],
                [ 1, "#558822" ]
            ] },
            stroke: "#558822",
            strokeWidth: 10
        },
        container: "canvas"
    });

    // click listener for the enable/disable link in the source box (the blue one).
    instance.on(document.getElementById("enableDisableSource"), "click", function (e) {
        var sourceDiv = (e.target|| e.srcElement).parentNode;
        var state = instance.toggleSourceEnabled(sourceDiv);
        this.innerHTML = (state ? "disable" : "enable");
        instance[state ? "removeClass" : "addClass"](sourceDiv, "element-disabled");
        instance.consume(e);
    });

    // click listener for enable/disable in the small green boxes
    instance.on(document.getElementById("canvas"), "click", ".enableDisableTarget", function (e) {
        var targetDiv = (e.target || e.srcElement).parentNode;
        var state = instance.toggleTargetEnabled(targetDiv);
        this.innerHTML = (state ? "disable" : "enable");
        instance[state ? "removeClass" : "addClass"](targetDiv, "element-disabled");
        instance.consume(e);
    });

    // bind to a connection event, just for the purposes of pointing out that it can be done.
    instance.bind("connection", function (i, c) {
        if (typeof console !== "undefined")
            console.log("connection", i.connection);
    });

    // get the list of ".smallWindow" elements.            
    var smallWindows = document.querySelectorAll(".smallWindow");

    smallWindows.forEach(function(el) { instance.manage(el); });

    // suspend drawing and initialise.
    instance.batch(function () {

        // make 'window1' a connection source. notice the filter and filterExclude parameters: they tell jsPlumb to ignore drags
        // that started on the 'enable/disable' link on the blue window.
        instance.makeSource(document.getElementById("sourceWindow1"), {
            filter:"a",
            filterExclude:true,
            maxConnections: -1,
            endpoint:[ "Dot", { radius: 7, cssClass:"small-blue" } ],
            anchor:sourceAnchors
        });

        // configure the .smallWindows as targets.
        smallWindows.forEach(function(el) {
            instance.makeTarget(el, {
                dropOptions: { hoverClass: "hover" },
                anchor:"Top",
                endpoint:[ "Dot", { radius: 11, cssClass:"large-green" } ]
            });
        });

        // and finally connect a couple of small windows, just so its obvious what's going on when this demo loads.           
        instance.connect({ source: document.getElementById("sourceWindow1"), target: document.getElementById("targetWindow5") });
        instance.connect({ source: document.getElementById("sourceWindow1"), target: document.getElementById("targetWindow2") });
    });

   // jsPlumb.fire("jsPlumbDemoLoaded", instance);
});	
