;(function() {

	var AbstractLayout = function(params) {
		var self = this;
		params = params || {};
		self.animate = params.animate;
		self.width = params.width;
		self.height = params.height;
		self.updateUIPosition = function(params) {
			boundingBox = params.boundingBox || getComputedBoundingBox();
			margins = params.margins || [0,0];				
			var id = jsPlumb.getId(params.fromEl),
				el = jsPlumb.CurrentLibrary.getElementObject(params.fromEl),
				s = jsPlumb.CurrentLibrary.getSize(el), p = self.getPosition(id),
				clampedX = ( (p[0] - boundingBox[0][0]) / boundingBox[2]) * (self.width - (2 * margins[0])),
				clampedY = ( (p[1] - boundingBox[0][1]) / boundingBox[3]) * (self.height - (2 * margins[1])),
				newPos = {
					left:margins[0] + clampedX - (s[0] / 2), 
					top:margins[1] + clampedY - (s[1] / 2)
				};
				
			if (self.animate && !params.doNotAnimate) 
				jsPlumb.animate(el, newPos);
			else
				jsPlumb.CurrentLibrary.setOffset(el, newPos);
		};
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
			var self = this;
			// TODO pull up into AbstractLayout; make Kamada Kawai use this.
			self.getPosition = function(id) {
				var p = positions[id];
				if (!p) {
					p = [Math.floor(Math.random()*(self.width+1)), Math.floor(Math.random()*(self.height + 1))];
					positions[id] = p;
				}
				return p;
			};

			//	w = params.width || 500,
			//	h = params.height || 500,
			var	margins = params.margins || [0,0],
				nodeSelector = params.nodeSelector,
				maxDimension = Math.max(self.width, self.height),
				attractionMultiplier = params.attractionMultiplier || 1000,
				repulsionMultiplier = params.repulsionMultiplier || 50000,
				forceConstant = Math.sqrt(self.width * self.height / nodeSelector.length),
				temperature = self.width / 10,
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
				iterations = params.iterations || 50,
				currentIteration = 0,
				cool = function() { temperature *= (1.0 - currentIteration / iterations); },
				//cool = function() { temperature *= 0.75; },
				done = function() {
					return currentIteration > iterations;// || temperature < 1.0 /  maxDimension;
				},
				// TODO move to AbstractLayout; make KK use this.
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
				_step = function() {
					currentIteration++;
					// repulsion
					for (var i = 0; i < nodeSelector.length; i++) {
						var n1 = nodeSelector[i], id = jsPlumb.getId(n1), v1 = getLocation(id);
						v1[0] = 0; v1[1] = 0;
						for (var j = 0; j < nodeSelector.length; j++) {
							var n2 = nodeSelector[j], id2 = jsPlumb.getId(n2),
								p1 = self.getPosition(id), p2 = self.getPosition(id2),
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
						var p1 = self.getPosition(conns[i].sourceId), p2 = self.getPosition(conns[i].targetId),
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
							v = getLocation(id), p = self.getPosition(id),
							d = Math.max(EPSILON, Math.sqrt((v[0] * v[0]) + (v[1] * v[1]))),
							xd = v[0] / d * Math.min(d, temperature),
							yd = v[1] / d * Math.min(d, temperature);
					
						p[0] += xd;
						p[1] += yd;				

						// we could paint here, if we wanted to do a step-animate type thing.
						//if (step) {
						//	updateUIPosition({fromEl:nodeSelector[i], boundingBox:computedBoundingBox, margins:margins, doNotAnimate:true});
						//}
					}
				};
					
				// step through and calculate layout
				while (!done()) {
					_step();						
					//if (step) sleep(1);
				}		
				
				// position ui components
				var computedBoundingBox = getComputedBoundingBox();
				
				for (var i = 0; i < nodeSelector.length; i++) 
					self.updateUIPosition({fromEl:nodeSelector[i], boundingBox:computedBoundingBox, margins:margins});
					
				// repaint jsPlumb
				jsPlumb.repaintEverything();						
			},
			
			"Kamada-Kawai":function(params) {
				var self = this;
				AbstractLayout.apply(this, arguments);
				
				var iterations = params.iterations || 200,
					w = params.width || 500,
					h = params.height || 500,
					currentIteration = 0,
					adjustForGravity = (params.adjustForGravity != null) ? params.adjustForGravity : true,
					exchangeVertices = (params.exchangeVertices != null) ? params.exchangeVertices : true,
					lengthFactor = params.lengthFactor || 0.9,
					nodeSelector = params.nodeSelector,
					nodeCount = nodeSelector.length,
					disconnectedMultiplier = params.disconnectedMultiplier || 0.5,
					calcEnergy = function() {
						var energy = 0;
						for (var i = 0; i < nodeCount - 1; i++) {
							for (var j = i + 1; j < nodeCount; j++) {
                				var dist = distanceMap[i][j],
									l_ij = L * dist,
								 	k_ij = K / (dist * dist),
									dx = xyData[i].left - xyData[j].left,
									dy = xyData[i].top - xyData[j].top,
									d = Math.sqrt(dx * dx + dy * dy);

								energy += k_ij / 2 * (dx * dx + dy * dy + l_ij * l_ij - 2 * l_ij * d);
							}
						}
//						console.log(energy);
						return energy;
					},
					calcDeltaM = function(m) {
				 		var dEdxm = 0, dEdym = 0;
						for (var i = 0; i < nodeCount; i++) {
							if (i != m) {
				                var dist = distanceMap[m][i], 
				                	l_mi = L * dist, 
				                	k_mi = K / (dist * dist),
									dx = xyData[m].left - xyData[i].left,
				 					dy = xyData[m].top - xyData[i].top,
									d = Math.sqrt(dx * dx + dy * dy),
									common = k_mi * (1 - l_mi / d);
									
								dEdxm += common * dx;
								dEdym += common * dy;
							}
						}
						return Math.sqrt(dEdxm * dEdxm + dEdym * dEdym);
					},
					calcDeltaXY = function(m) {
						var dE_dxm = 0, dE_dym = 0, d2E_d2xm = 0, d2E_dxmdym = 0, d2E_dymdxm = 0, d2E_d2ym = 0;

						for (var i = 0; i < nodeCount; i++) {	
							if (i != m) {
                
                				var dist = distanceMap[m][i],
									l_mi = L * dist,
									k_mi = K / (dist * dist),
									dx = xyData[m].left - xyData[i].left,
									dy = xyData[m].top - xyData[i].top,
									d = Math.sqrt(dx * dx + dy * dy),
									ddd = d * d * d;

								dE_dxm += k_mi * (1 - l_mi / d) * dx;
								dE_dym += k_mi * (1 - l_mi / d) * dy;
								d2E_d2xm += k_mi * (1 - l_mi * dy * dy / ddd);
								d2E_dxmdym += k_mi * l_mi * dx * dy / ddd;
								d2E_d2ym += k_mi * (1 - l_mi * dx * dx / ddd);
							}
						}
						// d2E_dymdxm equals to d2E_dxmdym.
						d2E_dymdxm = d2E_dxmdym;

						var denomi = d2E_d2xm * d2E_d2ym - d2E_dxmdym * d2E_dymdxm,
							deltaX = (d2E_dxmdym * dE_dym - d2E_d2ym * dE_dxm) / denomi,
							deltaY = (d2E_dymdxm * dE_dxm - d2E_d2xm * dE_dym) / denomi;
						return [ deltaX, deltaY ];
					},
					calcEnergyIfExchanged = function(p, q) {
						if (p >= q)
							throw "p should be < q";
						var energy = 0;		// < 0
						for (var i = 0; i < nodeCount - 1; i++) {
							for (var j = i + 1; j < nodeCount; j++) {
								var ii = i, jj = j;
								if (i == p) ii = q;
								if (j == q) jj = p;

				                var dist = distanceMap[i][j],
									l_ij = L * dist,
									k_ij = K / (dist * dist),
									dx = xyData[ii].left - xyData[jj].left,
									dy = xyData[ii].top - xyData[jj].top,
									d = Math.sqrt(dx * dx + dy * dy);
				
								energy += k_ij / 2 * (dx * dx + dy * dy + l_ij * l_ij - 2 * l_ij * d);
							}
						}
						return energy;
					},
					adjustForGravity = function() {						
						var gx = 0, gy = 0;
						for (var i = 0; i < xyData.length; i++) {
							gx += xyData[i].left;
							gy += xyData[i].top;
						}
						gx /= xyData.length;
						gy /= xyData.length;
						var diffx = w / 2 - gx, diffy = h / 2 - gy;
						for (var i = 0; i < xyData.length; i++) {
            				xyData[i] = { left:xyData[i].left + diffx, top:xyData[i].top + diffy };
						}
					},
					// TODO move to AbstractLayout; change format from JS object to Array like Fruchterman uses.
					getComputedBoundingBox = function() {
						var xmin = ymin = Infinity, xmax = ymax = -Infinity;
						for (var i=0; i < xyData.length; i++) {
							xmin = Math.min(xmin, xyData[i].left);
							xmax = Math.max(xmax, xyData[i].left);
							ymin = Math.min(ymin, xyData[i].top);
							ymax = Math.max(ymax, xyData[i].top);								
						}
						return [ [ xmin, ymin ], [ xmax, ymax ], Math.abs(xmin - xmax), Math.abs(ymin - ymax) ];
					},
					updateUIPosition = function(params) {
						var boundingBox = params.boundingBox || getComputedBoundingBox(),
							margins = params.margins || [0,0],				
							id = jsPlumb.getId(params.fromEl),
							el = jsPlumb.CurrentLibrary.getElementObject(params.fromEl),
							s = jsPlumb.CurrentLibrary.getSize(el), p = xyData[params.idx],//p = self.getPosition(),
							clampedX = ( (p.left - boundingBox[0][0]) / boundingBox[2]) * (self.width - (2 * margins[0])),
							clampedY = ( (p.top - boundingBox[0][1]) / boundingBox[3]) * (self.height - (2 * margins[1])),
							newPos = {
								left:margins[0] + clampedX - (s[0] / 2), 
								top:margins[1] + clampedY - (s[1] / 2)
							};
				
						if (self.animate && !params.doNotAnimate) 
							jsPlumb.animate(el, newPos);
						else
							jsPlumb.CurrentLibrary.setOffset(el, newPos);
					},
	
					done = function() { return currentIteration > iterations; },
					_step = function() {
						currentIteration++;
						if (nodeCount == 0) return;						
						var energy = calcEnergy();
//			status = "Kamada-Kawai V=" + getGraph().getVertexCount()
//			+ "(" + getGraph().getVertexCount() + ")"
//			+ " IT: " + currentIteration
//			+ " E=" + energy
//			;

						var maxDeltaM = 0, 
							pm = -1;            // the node having max deltaM
						for (var i = 0; i < nodeCount; i++) {
//				if (isLocked(vertices[i]))
//					continue;
							var deltam = calcDeltaM(i);

							if (maxDeltaM < deltam) {
								maxDeltaM = deltam;
								pm = i;
							}
						}
						if (pm == -1) return;
						
						for (var i = 0; i < 100; i++) {
							var dxy = calcDeltaXY(pm);
							xyData[pm] = { left:xyData[pm].left+dxy[0], top:xyData[pm].top+dxy[1] };

							var deltam = calcDeltaM(pm);
							if (deltam < EPSILON)
								break;
						}
						
						if (adjustForGravity)
							adjustForGravity();
							
						if (exchangeVertices && maxDeltaM < EPSILON) {
							energy = calcEnergy();
							for (var i = 0; i < nodeCount - 1; i++) {
								//if (isLocked(vertices[i]))
									//continue;
								for (var j = i + 1; j < nodeCount; j++) {
									//if (isLocked(vertices[j]))
										//continue;
									var xenergy = calcEnergyIfExchanged(i, j);
									if (energy > xenergy) {
										var sx = xyData[i].left,
											sy = xyData[i].top;
										xyData[i] = xyData[j];
										xyData[j] = { left:sx, top:sy };
										return;
									}
								}
							}
						}
					},
					distanceMap = [],
					xyData = [];
					
				// create a graph and populate it
				var graph = new Graph();
				// first, vertices
				for (var i = 0; i < nodeSelector.length; i++) {
					var vertex = graph.addVertex(jsPlumb.getId(nodeSelector[i]));
					nodeSelector[i].vertex = vertex;
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
    				L = (L0 / diameter) * lengthFactor,
    				K = 1, 
    				EPSILON = 0.1;
					
				// assign initial distances etc
				for (var i = 0; i < nodeCount - 1; i++) {
					xyData[i] = {left:Math.floor(Math.random()*(w+1)), top:Math.floor(Math.random()*(h+1))};//jsPlumb.getOffset(jsPlumb.getId(nodeSelector[i]));
    				for (var j = i + 1; j < nodeCount; j++) {
    					var d_ij = graph.getDistance(nodeSelector[i].vertex, nodeSelector[j].vertex),
    						d_ji = graph.getDistance(nodeSelector[j].vertex, nodeSelector[i].vertex),
    						dist = diameter * disconnectedMultiplier;
    					if (d_ij != null)
    						dist = Math.min(d_ij, dist);
    					if (d_ji != null)
    						dist = Math.min(d_ji, dist);
    					if (!distanceMap[i]) distanceMap[i] = [];
    					if (!distanceMap[j]) distanceMap[j] = [];    					
	    				distanceMap[i][j] = distanceMap[j][i] = dist;
    				}
    			}
    			// the last entry's offset
    			//xyData[nodeCount - 1] = jsPlumb.getOffset(jsPlumb.getId(nodeSelector[nodeCount - 1]));
    			xyData[nodeCount - 1] = { left:Math.floor(Math.random()*(w+1)), top:Math.floor(Math.random()*(h+1)) };
				
				//
				while(!done()) _step();
					
//alert( "kamada kawai is not implemented yet");
				var bb = getComputedBoundingBox();
				for (var i = 0; i < nodeCount; i++)
					//jsPlumb.CurrentLibrary.setOffset(nodeSelector[i], xyData[i]);
					updateUIPosition({fromEl:nodeSelector[i],idx:i, boundingBox:bb });
					
				jsPlumb.repaintEverything();
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
		this.getDistance = function(source, target, edgeSelector, vertexSelector) {
			var info = self.findPath(source, target, edgeSelector, vertexSelector);
			return info.pathDistance;
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