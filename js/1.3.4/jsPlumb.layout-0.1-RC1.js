;(function() {

	var AbstractLayout = function(params) {
		var self = this;
		params = params || {};
		self.animate = params.animate;
	};

	// TODO turn these into functions.
	jsPlumb.Layout = function(layoutType, params) {
		new layouts[layoutType](params);
		
	};
	
	var layouts = {
		/**
			Fruchterman-Reingold layout.  Parameters are:
			
				nodeSelector	-	required.  a selector, using whatever library you're using, containing the nodes to layout.
				width			-	optional, but you'll probably want to supply this.
				height			-	optional, but you'll probably want to supply this.
				margins			-	optional.  dictates margins of the target layout area.  defaults to [0,0].
				attractionMultipler - optional.  defaults to 0.75.  you might wish to google what this parameter is for.
				repulsionMultipler - optional.  defaults to 0.75.  you might wish to google what this parameter is for.
				iterations		-	optional.  number of times to iterate in the quest for the perfect layout.  defaults to 50.
		*/
		"Fruchterman-Reingold" : function(params) {
			AbstractLayout.apply(this, arguments);
			var self = this,
				w = params.width || 500,
				h = params.height || 500,
				margins = params.margins || [0,0],
				nodeSelector = params.nodeSelector,
				maxDimension = Math.max(w, h),
				attractionMultiplier = params.attractionMultiplier || 0.75,
				repulsionMultiplier = params.repulsionMultiplier || 0.75,
				forceConstant = Math.sqrt(w * h / nodeSelector.length),
				temperature = w / 10,
				attractionConstant = attractionMultiplier * forceConstant,
				repulsionConstant = repulsionMultiplier * forceConstant,
				EPSILON = 0.000001,
				locations = {},
				getLocation = function(id) {
					var l = locations[id];
					if (!l) {
						l = [0,0];
						locations[id] = l;
					}
					return l;
				},
				positions = {},
				getPosition = function(id) {
					var p = positions[id];
					if (!p) {
						p = [Math.floor(Math.random()*(w+1)), Math.floor(Math.random()*(h+1))];
						positions[id] = p;
					}
					return p;
				},
				iterations = params.iterations || 50,
				currentIteration = 0,
				cool = function() { temperature *= (1.0 - currentIteration / iterations); },
				done = function() {
					return currentIteration > iterations || temperature < 1.0 /  maxDimension;
				},
				getComputedBoundingBox = function() {
					var xmin = ymin = Infinity, xmax = ymax = -Infinity;
					for (var i in positions) {
						xmin = Math.min(xmin, positions[i][0]);
						xmax = Math.max(xmax, positions[i][0]);
						ymin = Math.min(ymin, positions[i][1]);
						ymax = Math.max(ymax, positions[i][1]);								
					}
					return [ [ xmin, ymin ], [ xmax, ymax ], Math.abs(xmin - xmax), Math.abs(ymin - ymax) ];
				},
				updateUIPosition = function(fromEl, boundingBox, margins) {
					boundingBox = boundingBox || getComputedBoundingBox();
					margins = margins || [0,0];
					var id = jsPlumb.getId(fromEl),
						el = jsPlumb.CurrentLibrary.getElementObject(fromEl),
						s = jsPlumb.CurrentLibrary.getSize(el), p = getPosition(id),
						clampedX = ( (p[0] - boundingBox[0][0]) / boundingBox[2]) * (w - (2 * margins[0])),
						clampedY = ( (p[1] - boundingBox[0][1]) / boundingBox[3]) * (h - (2 * margins[1])),
						newPos = {
							left:margins[0] + clampedX - (s[0] / 2), 
							top:margins[1] + clampedY - (s[1] / 2)
						};
					if (self.animate) 
						jsPlumb.animate(el, newPos);
					else
						jsPlumb.CurrentLibrary.setOffset(el, newPos);
				},
				step = function() {
					currentIteration++;
					// repulsion
					for (var i = 0; i < nodeSelector.length; i++) {
						var n1 = nodeSelector[i], id = jsPlumb.getId(n1), v1 = getLocation(id);
						v1[0] = 0; v1[1] = 0;
						for (var j = 0; j < nodeSelector.length; j++) {
							var n2 = nodeSelector[j], id2 = jsPlumb.getId(n2),
								p1 = getPosition(id), p2 = getPosition(id2),
								xd = p1[0] - p2[0],
								yd = p1[1] - p2[1],
								d = Math.max(EPSILON, Math.sqrt((xd * xd) + (yd * yd))),
								force = (repulsionConstant * repulsionConstant) / d;
							v1[0] += (xd / d * force);
							v1[1] += (yd / d * force);									
						}
					}			
					// attraction
					var conns = jsPlumb.getConnections();
					for (var i = 0; i < conns.length; i++) {
						var p1 = getPosition(conns[i].sourceId), p2 = getPosition(conns[i].targetId),
							v1 = getLocation(conns[i].sourceId), v2 = getLocation(conns[i].targetId),
							xd = p1[0] - p2[0], yd = p1[1] - p2[1],
							d = Math.max(EPSILON, Math.sqrt((xd * xd) + (yd * yd))),
							force = (d * d) / attractionConstant;
						v1[0] -= (xd / d * force);
						v1[1] -= (yd / d * force);
						v2[0] += (xd / d * force);
						v2[1] += (yd / d * force);
					}			
					// positions
					for (var i = 0; i < nodeSelector.length; i++) {
						var id = jsPlumb.getId(nodeSelector[i]),
							v = getLocation(id), p = getPosition(id),
							d = Math.max(EPSILON, Math.sqrt((v[0] * v[0]) + (v[1] * v[1]))),
							xd = v[0] / d * Math.min(d, temperature),
							yd = v[1] / d * Math.min(d, temperature);
					
						p[0] += xd;
						p[1] += yd;				

						// we could paint here, if we wanted to do a step-animate type thing.
					}
				};
					
				// step through and calculate layout
				while (!done()) step();							
				// position ui components
				var computedBoundingBox = getComputedBoundingBox();
				
				for (var i = 0; i < nodeSelector.length; i++) 
					updateUIPosition(nodeSelector[i], computedBoundingBox, margins);
				// repaint jsPlumb
				jsPlumb.repaintEverything();						
			},
			
			"Kamada-Kawai":function(params) {
				var iterations = params.iterations || 200,
					w = params.width || 500,
					h = params.height || 500,
					currentIteration = 0,
					adjustForGravity = (params.adjustForGravity != null) ? params.adjustForGravity : true,
					exchangeVertices = (params.exchangeVertices != null) ? params.exchangeVertices : true,
					lengthFactor = params.lengthFactor || 0.9,
					disconnectedMultiplier = params.disconnectedMultiplier || 0.5,
					done = function() { return currentIteration > iterations; },
					step = function() {
						currentIteration++;
					};
					
				// assign IDs (we probably dont need to do that; we have div ids)
				// assign initial distances etc
				//
				while(!done()) step();
					
				throw "kamada kawai is not implemented yet";
			},
				
			"Tree":function(params) {
				throw "tree is not implemented yet";
			}
		};

})();