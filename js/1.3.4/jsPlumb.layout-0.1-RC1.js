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
				attractionMultiplier = params.attractionMultiplier || 1000,
				repulsionMultiplier = params.repulsionMultiplier || 50000,
				forceConstant = Math.sqrt(w * h / nodeSelector.length),
				temperature = w / 10,
				attractionConstant = attractionMultiplier * forceConstant,
				repulsionConstant = repulsionMultiplier * forceConstant,
				EPSILON = 0.000001,
				locations = {},
				step = params.step || false,
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
				//cool = function() { temperature *= 0.75; },
				done = function() {
					return currentIteration > iterations;// || temperature < 1.0 /  maxDimension;
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
				updateUIPosition = function(params) {
					boundingBox = params.boundingBox || getComputedBoundingBox();
					margins = params.margins || [0,0];
					var id = jsPlumb.getId(params.fromEl),
						el = jsPlumb.CurrentLibrary.getElementObject(params.fromEl),
						s = jsPlumb.CurrentLibrary.getSize(el), p = getPosition(id),
						clampedX = ( (p[0] - boundingBox[0][0]) / boundingBox[2]) * (w - (2 * margins[0])),
						clampedY = ( (p[1] - boundingBox[0][1]) / boundingBox[3]) * (h - (2 * margins[1])),
						newPos = {
							left:margins[0] + clampedX - (s[0] / 2), 
							top:margins[1] + clampedY - (s[1] / 2)
						};
					if (self.animate && !params.doNotAnimate) 
						jsPlumb.animate(el, newPos);
					else
						jsPlumb.CurrentLibrary.setOffset(el, newPos);
				},
				_step = function() {
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
						if (step) {
							updateUIPosition({fromEl:nodeSelector[i], boundingBox:computedBoundingBox, margins:margins, doNotAnimate:true});
						}
					}
				};
					
				// step through and calculate layout
				while (!done()) {
					_step();						
					//if (step) sleep(1);
				}
				// position ui components
				var computedBoundingBox = getComputedBoundingBox();
				
				//for (var i = 0; i < nodeSelector.length; i++) 
					//updateUIPosition({fromEl:nodeSelector[i], boundingBox:computedBoundingBox, margins:margins});
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
					nodeSelector = params.nodeSelector,
					disconnectedMultiplier = params.disconnectedMultiplier || 0.5,
					done = function() { return currentIteration > iterations; },
					step = function() {
						currentIteration++;
					};
					
				// create a graph and populate it
				var graph = new Graph();
				// first, vertices
				for (var i = 0; i < nodeSelector.length; i++) {
					var vertex = graph.addVertex(jsPlumb.getId(nodeSelector[i]));
				}
				// next, edges. Graph should be fixed to honour the bidirectional parameter.
				var conns = jsPlumb.getConnections();
				for (var i = 0; i < conns.length; i++) {
					graph.addEdge(new Edge(conns[i].sourceId, conns[i].targetId), true); // bidirectional is ignored!
					graph.addEdge(new Edge(conns[i].targetId, conns[i].sourceId), true); // bidirectional is ignored!					
				}
				// now get the graph's diameter
				var diameter = graph.diameter(),
					L0 = Math.min(w, h),
    				L = (L0 / diameter) * lengthFactor;

					
				// assign IDs (we probably dont need to do that; we have div ids)
				// assign initial distances etc
				for (var i = 0; i < nodeSelector.length - 2; i++) {
    				for (var j = i + 1; j < nodeSelector.length; j++) {
	    	/*			var d_ij = distance.getDistance(vertices[i], vertices[j]),
    						d_ji = distance.getDistance(vertices[j], vertices[i]),
    						dist = diameter * disconnectedMultiplier;
    					if (d_ij != null)
    						dist = Math.min(d_ij, dist);
    					if (d_ji != null)
    						dist = Math.min(d_ji, dist);
	    				dm[i][j] = dm[j][i] = dist;*/
    				}
    			}
				
				//
				while(!done()) step();
					
				throw "kamada kawai is not implemented yet";
			},
				
			"Tree":function(params) {
				throw "tree is not implemented yet";
			}
		};

})();

/**
	This is a Javascript implementation of a directed graph, with Djikstra shortest path algorithm. Taken from
	the Automatic Traffic project.
*/
;(function() {
	/**
		This is a node in the graph. each Vertex can have a single Edge to each other Vertex.
	*/
	var Vertex = window.Vertex = function(id) {
		this.id = id;
		this.edges = [];
	},
	/**
		This is an edge in the graph.  There can be one or zero of these for every pair of Vertices in the Graph.  Each Edge has an associated "cost".  This implementation has a static
		cost; that is it doesn't do any computation when asked what its cost is.  but in a dynamic
		system it is more likely an Edge's cost will change over time.
	*/
	Edge = window.Edge = function(source, target, cost) {
		this.source = source;
		this.target = target;
		var self = this;
		var _cost = cost || 1;
		var _active = true;
		this.getCost = function() { return _cost; };
		this.getId = function() { return self.source.id + "_" + self.target.id; };
	},
	/**
		The Graph itself.  Contains a list of Vertex objects and a list of Edge objects.
	*/
	Graph = window.Graph = function() {
		this.vertices = [];
		var _vertexMap = {};
		this.edges = [];
		var self = this;

		var _getVertex = function(e) {
			return (typeof e == "string") ? _vertexMap[e] : e;	
		};
		
		// -------------------------               public API               -----------------------
		
		this.addEdge = function(e, bidirectional) {
			e.source = _getVertex(e.source); e.target = _getVertex(e.target);
			var v1 = _vertexMap[e.source.id], v2 = _vertexMap[e.target.id];
			v1.edges.push(e);
			self.edges.push(e);
		};
		this.addEdges = function(e) {
			for (var i = 0; i < e.length; i++)
				self.addEdge(e[i]);
		};
		this.addVertex = function(vertexId) {
			var v = new Vertex(vertexId);
			self.vertices.push(v);
			_vertexMap[v.id] = v;
			return v;
		};
		this.addVertices = function(v) {
			for (var i = 0; i < v.length; i++)
				self.addVertex(v[i]);
		};		
		/**
		 * finds the shortest path from source to target.
		 * @param source source Vertex
		 * @param target target Vertex
		 * @param edgeSelector optional yes/no function to filter active edges.
		 * @param vertexSelector optional yes/no function to filter active vertices.
		 * @return array like [ {vertex, cost, edge}, {vertex,cost,edge} ... ] when successful; when unsuccessful the three compiled
		 * tables are returned - distances to nodes, each node's previous node, and the associated edge.  so you can call this method with
		 * no target set and get the entire table populated.
		 */
		this.findPath = function(source, target, edgeSelector, vertexSelector) {
			source = _getVertex(source);
			target = _getVertex(target);
			return Djikstra.compute({graph:self, source:source, target:target, edgeSelector:edgeSelector, vertexSelector:vertexSelector});
		};
		this.getVertex = _getVertex;		
		this.printPath = function(source, target) {
			source = _getVertex(source);
			target = _getVertex(target);
			var path =  self.findPath(source, target);
			var s ="[" + source.id + " - " + target.id + "] : ";
			for (var i = 0; i < path.length; i++)
				s = s + "{ vertex:" + path[i].vertex.id + ", cost:" + path[i].cost + ", edge: " + path[i].edge.getId() + " } ";
			return s;
		};
		
		this.diameter = function(dontUseMax) {
			var diameter = 0;
       	
        	for (var i = 0; i < self.vertices.length; i++) {
	        	for (var j = 0; j < self.vertices.length; j++) {

	                if (j != i) // don't include self-distances
    	            {
        	            var info = Djikstra.compute({graph:self, source:self.vertices[i], target:self.vertices[j]});
            	        if (info.path == null) {
                    	    if (!dontUseMax)
                        	    return Infinity;
                    	}
                    	else
                        	diameter = Math.max(diameter, info.pathDistance);
                	}
            	}
        	}
        	return diameter;
        };
	},

	/**
		finds the Vertex in the 'dist' table that has not yet been computed and has the smallest cost so far.
	*/
	_findSmallestDist = function(vertices, usedVertices, dist) {
		var idx = -1, node = null, smallest = Infinity;
		for (var i = 0; i < vertices.length; i++) {
			if (!usedVertices[i]) {
				if (dist[vertices[i].id] < smallest) {
					smallest = dist[vertices[i].id];
					idx = i;
					node = vertices[i];
				}
			}
		}
		return {node:node, index:idx};
	},

	/**
		assembles a path to the given target, using data from the 'dist' and 'previous' tables.  the source of the path is the source that was most recently passed in to the
		Djikstra.compute method.
	*/
	_findPath = function(dist, previous, edges, target) {
		var path = [], u = target;
		while(previous[u.id] != null) {
			path.splice(0,0,{vertex:u, cost:dist[u.id], edge:edges[u.id]});
			u = previous[u.id];
		}
		// insert start vertex.
		path.splice(0,0,{vertex:u, cost:0, edge:null});
		return path;
	},

	Djikstra = {
		compute : function(params) {
			var graph = params.graph, source = params.source, target = params.target,
			edgeSelector = params.edgeSelector || function() { return true; },
			vertexSelector = params.vertexSelector || function() { return true; },
			dist = {}, previous = {}, edges = {}, retVal = { dist:dist, previous:previous, edges:edges };
			for (var i = 0; i < graph.vertices.length; i++) {
				dist[graph.vertices[i].id] = Infinity;				
			}
			if (source == null) source = graph.getVertex(params.sourceId);
			if (target == null) target = graph.getVertex(params.targetId);			
			dist[source.id] = 0;
			var completedNodes = new Array(graph.vertices.length), completed = 0;
			while (completed < graph.vertices.length) {
				var curNodeInfo = _findSmallestDist(graph.vertices, completedNodes, dist);
				if (!curNodeInfo.node || dist[curNodeInfo.node.id] == Infinity) break;
				if (target && curNodeInfo.node.id == target.id) {
					 retVal.path = _findPath(dist, previous, edges, target);
					 retVal.pathDistance = retVal.path[retVal.path.length - 1].cost;
					 break;
				}
				completedNodes[curNodeInfo.index] = true;
				completed = completed + 1;
				for (var i = 0; i < curNodeInfo.node.edges.length; i++) {
					var edge = curNodeInfo.node.edges[i]; 
					if (edgeSelector(edge)) {                                 
						neighbour = edge.target;
						var alt = dist[curNodeInfo.node.id] + edge.getCost();
						if (alt < dist[neighbour.id]) {
							dist[neighbour.id] = alt;
							previous[neighbour.id] = curNodeInfo.node;
							edges[neighbour.id] = edge;
						}
					}
				}
			}
			// the shortcut exit does not get here; this function returns two different types of value!
			return retVal;
		}
	};	
})();