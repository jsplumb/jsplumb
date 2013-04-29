(function() {

    jsPlumbDemo.initEndpoints = function(nextColour) {
        $$(".ep").each(function(e) {
			var p = e.getParent();
			jsPlumb.makeSource(e, {
				parent:p,
				endpoint:{
					anchor:"Continuous",
					connector:"StateMachine",
					connectorStyle:{ strokeStyle:nextColour(),lineWidth:2 },
					maxConnections:-1
				}
			});
		});

		jsPlumb.makeTarget($$(".w"), {
			dropOptions:{ hoverClass:"dragHover" },
			endpoint:{
				anchor:"Continuous"
			}
		});
    };

})();