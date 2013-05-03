//
// 
require(["jsplumb"], function(_jsPlumb) {
    _jsPlumb.ready(function() {        
        _jsPlumb.connect({
            source:"one",
            target:"two",
            paintStyle:{lineWidth:3, strokeStyle:"orange"},
            endpoint:["Dot", {radius:5}],
            endpointStyle:{fillStyle:"orange"},
            anchors:["RightMiddle", "LeftMiddle"]
        });
    })
});

//define("main", function(){});
