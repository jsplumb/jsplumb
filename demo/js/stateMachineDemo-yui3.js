;(function() {

   jsPlumbDemo.initEndpoints = function(nextColour) {
        Y.all(".ep").each(function(e) {
			var p = e.get("parentNode");
			jsPlumb.makeSource(e, {
				parent:p,
				anchor:"Continuous",
				connector:[ "StateMachine", { curviness:20 } ],
				connectorStyle:{ strokeStyle:nextColour(),lineWidth:2 },
				maxConnections:5,
                onMaxConnections:function(info, e) {
                    alert("Maximum connections (" + info.maxConnections + ") reached");
                }
			});
		});
    };

})();