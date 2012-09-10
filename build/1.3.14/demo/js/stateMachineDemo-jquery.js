;(function() {

   jsPlumbDemo.initEndpoints = function(nextColour) {
        $(".ep").each(function(i,e) {
			var p = $(e).parent();
			jsPlumb.makeSource($(e), {
				parent:p,
				//anchor:"BottomCenter",
				anchor:"Continuous",
				connector:[ "StateMachine", { curviness:20 } ],
				connectorStyle:{ strokeStyle:nextColour(), lineWidth:2 },
				maxConnections:5,
                onMaxConnections:function(info, e) {
                    alert("Maximum connections (" + info.maxConnections + ") reached");
                }
			});
		});		
    };
})();