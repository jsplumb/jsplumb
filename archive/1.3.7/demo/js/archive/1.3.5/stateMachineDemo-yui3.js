;(function() {

   jsPlumbDemo.initEndpoints = function(nextColour) {
        Y.all(".ep").each(function(e) {
			var p = e.get("parentNode");
			jsPlumb.makeSource(e, {
				parent:p,
				endpoint:{
					anchor:"Continuous",
					connector:[ "StateMachine", { curviness:20 } ],
					connectorStyle:{ strokeStyle:nextColour(),lineWidth:2 },
					maxConnections:-1
				}
			});
		});

		jsPlumb.makeTarget(Y.all(".w"), {
			dropOptions:{ hoverClass:"dragHover" },
			endpoint:{
				anchor:"Continuous"
			}
		});
    };

})();