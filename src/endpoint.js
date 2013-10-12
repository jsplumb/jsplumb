
;(function() {
        
    // create the drag handler for a connection
    var _makeConnectionDragHandler = function(placeholder, _jsPlumb) {
        var stopped = false;
        return {
            drag : function() {
                if (stopped) {
                    stopped = false;
                    return true;
                }
                var _ui = jsPlumb.CurrentLibrary.getUIPosition(arguments, _jsPlumb.getZoom());
        
                if (placeholder.element) {
                    jsPlumb.CurrentLibrary.setOffset(placeholder.element, _ui);                    
                    _jsPlumb.repaint(placeholder.element, _ui);
                }
            },
            stopDrag : function() {
                stopped = true;
            }
        };
    };
        
    // creates a placeholder div for dragging purposes, adds it to the DOM, and pre-computes its offset.    
    var _makeDraggablePlaceholder = function(placeholder, parent, _jsPlumb) {
        var n = document.createElement("div");
        n.style.position = "absolute";
        var placeholderDragElement = jsPlumb.CurrentLibrary.getElementObject(n);
        jsPlumb.CurrentLibrary.appendElement(n, parent);
        var id = _jsPlumb.getId(n);
        _jsPlumb.updateOffset( { elId : id });
        // create and assign an id, and initialize the offset.
        placeholder.id = id;
        placeholder.element = n;
    };
    
    // create a floating endpoint (for drag connections)
    var _makeFloatingEndpoint = function(paintStyle, referenceAnchor, endpoint, referenceCanvas, sourceElement, _jsPlumb, _newEndpoint) {			
        var floatingAnchor = new jsPlumb.FloatingAnchor( { reference : referenceAnchor, referenceCanvas : referenceCanvas, jsPlumbInstance:_jsPlumb });
        //setting the scope here should not be the way to fix that mootools issue.  it should be fixed by not
        // adding the floating endpoint as a droppable.  that makes more sense anyway!
        return _newEndpoint({ paintStyle : paintStyle, endpoint : endpoint, anchor : floatingAnchor, source : sourceElement, scope:"__floating" });
    };

    var typeParameters = [ "connectorStyle", "connectorHoverStyle", "connectorOverlays",
                "connector", "connectionType", "connectorClass", "connectorHoverClass" ];

    // a helper function that tries to find a connection to the given element, and returns it if so. if elementWithPrecedence is null,
    // or no connection to it is found, we return the first connection in our list.
    var findConnectionToUseForDynamicAnchor = function(ep, elementWithPrecedence) {
        var idx = 0;
        if (elementWithPrecedence != null) {
            for (var i = 0; i < ep.connections.length; i++) {
                if (ep.connections[i].sourceId == elementWithPrecedence || ep.connections[i].targetId == elementWithPrecedence) {
                    idx = i;
                    break;
                }
            }
        }
        
        return ep.connections[idx];
    };

    var findConnectionIndex = function(conn, ep) {
        return jsPlumbUtil.findWithFunction(ep.connections, function(c) { return c.id == conn.id; });
    };

    jsPlumb.Endpoint = function(params) {
        var _jsPlumb = params._jsPlumb,
            jpcl = jsPlumb.CurrentLibrary,
            _att = jsPlumbAdapter.getAttribute,
            _gel = jpcl.getElementObject,
            _dom = jpcl.getDOMElement,
            _ju = jsPlumbUtil,            
            _newConnection = params.newConnection,
            _newEndpoint = params.newEndpoint,
            _finaliseConnection = params.finaliseConnection,
            _fireDetachEvent = params.fireDetachEvent,
            _fireMoveEvent = params.fireMoveEvent,
            floatingConnections = params.floatingConnections;
        
        this.idPrefix = "_jsplumb_e_";			
        this.defaultLabelLocation = [ 0.5, 0.5 ];
        this.defaultOverlayKeys = ["Overlays", "EndpointOverlays"];
        this.parent = params.parent;
        OverlayCapableJsPlumbUIComponent.apply(this, arguments);        
        
// TYPE		
                
        this.getDefaultType = function() {								
            return {
                parameters:{},
                scope:null,
                maxConnections:this._jsPlumb.instance.Defaults.MaxConnections,
                paintStyle:this._jsPlumb.instance.Defaults.EndpointStyle || jsPlumb.Defaults.EndpointStyle,
                endpoint:this._jsPlumb.instance.Defaults.Endpoint || jsPlumb.Defaults.Endpoint,
                hoverPaintStyle:this._jsPlumb.instance.Defaults.EndpointHoverStyle || jsPlumb.Defaults.EndpointHoverStyle,				
                overlays:this._jsPlumb.instance.Defaults.EndpointOverlays || jsPlumb.Defaults.EndpointOverlays,
                connectorStyle:params.connectorStyle,				
                connectorHoverStyle:params.connectorHoverStyle,
                connectorClass:params.connectorClass,
                connectorHoverClass:params.connectorHoverClass,
                connectorOverlays:params.connectorOverlays,
                connector:params.connector,
                connectorTooltip:params.connectorTooltip
            };
        };
        			
// END TYPE
            
        this._jsPlumb.enabled = !(params.enabled === false);
        this._jsPlumb.visible = true;        
        this.element = _dom(params.source);  
        this._jsPlumb.uuid = params.uuid;
        this._jsPlumb.floatingEndpoint = null;  
        var inPlaceCopy = null;
        if (this._jsPlumb.uuid) params.endpointsByUUID[this._jsPlumb.uuid] = this;
        this.elementId = params.elementId;
        
        this._jsPlumb.connectionCost = params.connectionCost;
        this._jsPlumb.connectionsDirected = params.connectionsDirected;        
        this._jsPlumb.currentAnchorClass = "";
        this._jsPlumb.events = {};
            
        var  _updateAnchorClass = function() {
            jpcl.removeClass(this.element, _jsPlumb.endpointAnchorClassPrefix + "_" + this._jsPlumb.currentAnchorClass);
            this.removeClass(_jsPlumb.endpointAnchorClassPrefix + "_" + this._jsPlumb.currentAnchorClass);
            this._jsPlumb.currentAnchorClass = this.anchor.getCssClass();
            this.addClass(_jsPlumb.endpointAnchorClassPrefix + "_" + this._jsPlumb.currentAnchorClass);
            jpcl.addClass(this.element, _jsPlumb.endpointAnchorClassPrefix + "_" + this._jsPlumb.currentAnchorClass);
        }.bind(this);
        
        this.setAnchor = function(anchorParams, doNotRepaint) {
            this._jsPlumb.instance.continuousAnchorFactory.clear(this.elementId);
            this.anchor = this._jsPlumb.instance.makeAnchor(anchorParams, this.elementId, _jsPlumb);
            _updateAnchorClass();
            this.anchor.bind("anchorChanged", function(currentAnchor) {
                this.fire("anchorChanged", {endpoint:this, anchor:currentAnchor});
                _updateAnchorClass();
            }.bind(this));
            if (!doNotRepaint)
                this._jsPlumb.instance.repaint(this.elementId);
            return this;
        };

        var anchorParamsToUse = params.anchor ? params.anchor : params.anchors ? params.anchors : (_jsPlumb.Defaults.Anchor || "Top");
        this.setAnchor(anchorParamsToUse, true);

        // endpoint delegates to first connection for hover, if there is one.
        var internalHover = function(state) {
          if (this.connections.length > 0)
            this.connections[0].setHover(state, false);
          else
            this.setHover(state);
        }.bind(this);
            
        // ANCHOR MANAGER
        if (!params._transient) // in place copies, for example, are transient.  they will never need to be retrieved during a paint cycle, because they dont move, and then they are deleted.
            this._jsPlumb.instance.anchorManager.add(this, this.elementId);
        
        this.setEndpoint = function(ep) {

            if (this.endpoint != null) {
                this.endpoint.cleanup();
                this.endpoint.destroy();
            }

            var _e = function(t, p) {
                var rm = _jsPlumb.getRenderMode();
                if (jsPlumb.Endpoints[rm][t]) return new jsPlumb.Endpoints[rm][t](p);
                if (!_jsPlumb.Defaults.DoNotThrowErrors)
                    throw { msg:"jsPlumb: unknown endpoint type '" + t + "'" };
            };            

            var endpointArgs = {
                _jsPlumb:this._jsPlumb.instance,
                cssClass:params.cssClass,
                parent:params.parent,
                container:params.container,
                tooltip:params.tooltip,
                connectorTooltip:params.connectorTooltip,
                endpoint:this
            };
            if (_ju.isString(ep)) 
                this.endpoint = _e(ep, endpointArgs);
            else if (_ju.isArray(ep)) {
                endpointArgs = _ju.merge(ep[1], endpointArgs);
                this.endpoint = _e(ep[0], endpointArgs);
            }
            else {
                this.endpoint = ep.clone();
            }

            // assign a clone function using a copy of endpointArgs. this is used when a drag starts: the endpoint that was dragged is cloned,
            // and the clone is left in its place while the original one goes off on a magical journey. 
            // the copy is to get around a closure problem, in which endpointArgs ends up getting shared by
            // the whole world.
            var argsForClone = jsPlumb.extend({}, endpointArgs);						
            this.endpoint.clone = function() {
                // TODO this, and the code above, can be refactored to be more dry.
                if (_ju.isString(ep)) 
                    return _e(ep, endpointArgs);
                else if (_ju.isArray(ep)) {
                    endpointArgs = _ju.merge(ep[1], endpointArgs);
                    return _e(ep[0], endpointArgs);
                }
            }.bind(this);

            this.type = this.endpoint.type;
            // bind listeners from endpoint to self, with the internal hover function defined above.
            this.bindListeners(this.endpoint, this, internalHover);
        };
         
        this.setEndpoint(params.endpoint || _jsPlumb.Defaults.Endpoint || jsPlumb.Defaults.Endpoint || "Dot");							                    
        this.setPaintStyle(params.paintStyle || params.style || _jsPlumb.Defaults.EndpointStyle || jsPlumb.Defaults.EndpointStyle, true);
        this.setHoverPaintStyle(params.hoverPaintStyle || _jsPlumb.Defaults.EndpointHoverStyle || jsPlumb.Defaults.EndpointHoverStyle, true);
        this._jsPlumb.paintStyleInUse = this.getPaintStyle();

        _ju.copyValues(typeParameters, params, this);        

        this.isSource = params.isSource || false;
        this.isTarget = params.isTarget || false;        
        this._jsPlumb.maxConnections = params.maxConnections || _jsPlumb.Defaults.MaxConnections; // maximum number of connections this endpoint can be the source of.                
        this.canvas = this.endpoint.canvas;		
        // add anchor class (need to do this on construction because we set anchor first)
        this.addClass(_jsPlumb.endpointAnchorClassPrefix + "_" + this._jsPlumb.currentAnchorClass);	
        jpcl.addClass(this.element, _jsPlumb.endpointAnchorClassPrefix + "_" + this._jsPlumb.currentAnchorClass);
        this.connections = params.connections || [];
        this.connectorPointerEvents = params["connector-pointer-events"];
        
        this.scope = params.scope || _jsPlumb.getDefaultScope();        
        this.timestamp = null;
        this.reattachConnections = params.reattach || _jsPlumb.Defaults.ReattachConnections;
        this.connectionsDetachable = _jsPlumb.Defaults.ConnectionsDetachable;
        if (params.connectionsDetachable === false || params.detachable === false)
            this.connectionsDetachable = false;
        this.dragAllowedWhenFull = params.dragAllowedWhenFull || true;
        
        if (params.onMaxConnections)
            this.bind("maxConnections", params.onMaxConnections);        
        
        //
        // add a connection. not part of public API.
        //
        this.addConnection = function(connection) {
            this.connections.push(connection);                  
            this[(this.connections.length > 0 ? "add" : "remove") + "Class"](_jsPlumb.endpointConnectedClass);       
            this[(this.isFull() ? "add" : "remove") + "Class"](_jsPlumb.endpointFullClass); 
        };	
        
        this.detachFromConnection = function(connection, idx) {
            idx = idx == null ? findConnectionIndex(connection, this) : idx;
            if (idx >= 0) {
                this.connections.splice(idx, 1);
                this[(this.connections.length > 0 ? "add" : "remove") + "Class"](_jsPlumb.endpointConnectedClass);       
                this[(this.isFull() ? "add" : "remove") + "Class"](_jsPlumb.endpointFullClass);                 
            }
        };

        this.detach = function(connection, ignoreTarget, forceDetach, fireEvent, originalEvent, endpointBeingDeleted, connectionIndex) {

            var idx = connectionIndex == null ? findConnectionIndex(connection, this) : connectionIndex,
                actuallyDetached = false;
                fireEvent = (fireEvent !== false);

            if (idx >= 0) {		                
                if (forceDetach || connection._forceDetach || (connection.isDetachable() && connection.isDetachAllowed(connection) && this.isDetachAllowed(connection) )) {

                    //connection.setHover(false);

                    _jsPlumb.deleteObject({
                        connection:connection, 
                        fireEvent:(!ignoreTarget && fireEvent), 
                        originalEvent:originalEvent
                    });
                    actuallyDetached = true;                       
                }
            }
            return actuallyDetached;
        };	

        this.detachAll = function(fireEvent, originalEvent) {
            while (this.connections.length > 0) {
                // TODO this could pass the index in to the detach method to save some time (index will always be zero in this while loop)
                // TODO now it defaults to fireEvent true.  will that mess with things?
                this.detach(this.connections[0], false, true, fireEvent !== false, originalEvent, this, 0);
            }
            return this;
        };                
        this.detachFrom = function(targetEndpoint, fireEvent, originalEvent) {
            var c = [];
            for ( var i = 0; i < this.connections.length; i++) {
                if (this.connections[i].endpoints[1] == targetEndpoint || this.connections[i].endpoints[0] == targetEndpoint) {
                    c.push(this.connections[i]);
                }
            }
            for ( var j = 0; j < c.length; j++) {
                this.detach(c[j], false, true, fireEvent, originalEvent);				
            }
            return this;
        };	        
        
        this.getElement = function() {
            return this.element;
        };		
                 
        // container not supported in 1.5.3; you cannot change the container once it is set.
        // it might come back int a future release.
        this.setElement = function(el/*, container*/) {
            var parentId = this._jsPlumb.instance.getId(el),
                curId = this.elementId;
            // remove the endpoint from the list for the current endpoint's element
            _ju.removeWithFunction(params.endpointsByElement[this.elementId], function(e) {
                return e.id == this.id;
            }.bind(this));
            this.element = _dom(el);
            this.elementId = _jsPlumb.getId(this.element);                         
            _jsPlumb.anchorManager.rehomeEndpoint(this, curId, this.element);
            _jsPlumb.dragManager.endpointAdded(this.element);            
            _ju.addToList(params.endpointsByElement, parentId, this);            
            return this;
        };
                
        /**
         * private but must be exposed.
         */
        this.makeInPlaceCopy = function() {
            var loc = this.anchor.getCurrentLocation({element:this}),
                o = this.anchor.getOrientation(this),
                acc = this.anchor.getCssClass(),
                inPlaceAnchor = {
                    bind:function() { },
                    compute:function() { return [ loc[0], loc[1] ]; },
                    getCurrentLocation : function() { return [ loc[0], loc[1] ]; },
                    getOrientation:function() { return o; },
                    getCssClass:function() { return acc; }
                };

            return _newEndpoint( { 
                anchor : inPlaceAnchor, 
                source : this.element, 
                paintStyle : this.getPaintStyle(), 
                endpoint : params.hideOnDrag ? "Blank" : this.endpoint,
                _transient:true,
                scope:this.scope
            });
        };
                

        /**
         * private but needs to be exposed.
         */
        this.isFloating = function() {
            return this.anchor != null && this.anchor.isFloating;
        };
        
        /**
         * returns a connection from the pool; used when dragging starts.  just gets the head of the array if it can.
         */
        this.connectorSelector = function() {
            var candidate = this.connections[0];
            if (this.isTarget && candidate) return candidate;
            else {
                return (this.connections.length < this._jsPlumb.maxConnections) || this._jsPlumb.maxConnections == -1 ? null : candidate;
            }
        };        
        
        this.setStyle = this.setPaintStyle;        
        
        this.paint = function(params) {
            params = params || {};
            var timestamp = params.timestamp, recalc = !(params.recalc === false);								
            if (!timestamp || this.timestamp !== timestamp) {						
                
                // TODO check: is this is a safe performance enhancement?
                var info = _jsPlumb.updateOffset({ elId:this.elementId, timestamp:timestamp/*, recalc:recalc*/ });                

                var xy = params.offset ? params.offset.o : info.o;
                if(xy != null) {
                    var ap = params.anchorPoint,connectorPaintStyle = params.connectorPaintStyle;
                    if (ap == null) {
                        var wh = params.dimensions || info.s,                       
                            anchorParams = { xy : [ xy.left, xy.top ], wh : wh, element : this, timestamp : timestamp };
                        if (recalc && this.anchor.isDynamic && this.connections.length > 0) {
                            var c = findConnectionToUseForDynamicAnchor(this, params.elementWithPrecedence),
                                oIdx = c.endpoints[0] == this ? 1 : 0,
                                oId = oIdx === 0 ? c.sourceId : c.targetId,
                                oInfo = _jsPlumb.getCachedData(oId),
                                oOffset = oInfo.o, oWH = oInfo.s;
                            anchorParams.txy = [ oOffset.left, oOffset.top ];
                            anchorParams.twh = oWH;
                            anchorParams.tElement = c.endpoints[oIdx];
                        }
                        ap = this.anchor.compute(anchorParams);
                    }
                                        
                    this.endpoint.compute(ap, this.anchor.getOrientation(this), this._jsPlumb.paintStyleInUse, connectorPaintStyle || this.paintStyleInUse);
                    this.endpoint.paint(this._jsPlumb.paintStyleInUse, this.anchor);					
                    this.timestamp = timestamp;

                    // paint overlays
                    for ( var i = 0; i < this._jsPlumb.overlays.length; i++) {
                        var o = this._jsPlumb.overlays[i];
                        if (o.isVisible()) { 
                            this._jsPlumb.overlayPlacements[i] = o.draw(this.endpoint, this._jsPlumb.paintStyleInUse);
                            o.paint(this._jsPlumb.overlayPlacements[i]);    
                        }
                    }
                }
            }
        };

        this.repaint = this.paint; 

        var draggingInitialised = false;
        this.initDraggable = function() {
            // is this a connection source? we make it draggable and have the
            // drag listener maintain a connection with a floating endpoint.
            if (!draggingInitialised && jpcl.isDragSupported(this.element)) {
                var placeholderInfo = { id:null, element:null },
                    jpc = null,
                    existingJpc = false,
                    existingJpcParams = null,
                    _dragHandler = _makeConnectionDragHandler(placeholderInfo, _jsPlumb);

                var start = function() {    
                // drag might have started on an endpoint that is not actually a source, but which has
                // one or more connections.
                    jpc = this.connectorSelector();
                    var _continue = true;
                    // if not enabled, return
                    if (!this.isEnabled()) _continue = false;
                    // if no connection and we're not a source, return.
                    if (jpc == null && !this.isSource) _continue = false;
                    // otherwise if we're full and not allowed to drag, also return false.
                    if (this.isSource && this.isFull() && !this.dragAllowedWhenFull) _continue = false;
                    // if the connection was setup as not detachable or one of its endpoints
                    // was setup as connectionsDetachable = false, or Defaults.ConnectionsDetachable
                    // is set to false...
                    if (jpc != null && !jpc.isDetachable()) _continue = false;

                    if (_continue === false) {
                        // this is for mootools and yui. returning false from this causes jquery to stop drag.
                        // the events are wrapped in both mootools and yui anyway, but i don't think returning
                        // false from the start callback would stop a drag.
                        if (jpcl.stopDrag) jpcl.stopDrag();
                        _dragHandler.stopDrag();
                        return false;
                    }

                    // clear hover for all connections for this endpoint before continuing.
                    for (var i = 0; i < this.connections.length; i++)
                        this.connections[i].setHover(false);

                    this.addClass("endpointDrag");
                    _jsPlumb.setConnectionBeingDragged(true);

                    // if we're not full but there was a connection, make it null. we'll create a new one.
                    if (jpc && !this.isFull() && this.isSource) jpc = null;

                    _jsPlumb.updateOffset( { elId : this.elementId });
                    inPlaceCopy = this.makeInPlaceCopy();
                    inPlaceCopy.referenceEndpoint = this;
                    inPlaceCopy.paint();                                                                
                    
                    _makeDraggablePlaceholder(placeholderInfo, this.parent, _jsPlumb);
                    
                    // set the offset of this div to be where 'inPlaceCopy' is, to start with.
                    // TODO merge this code with the code in both Anchor and FloatingAnchor, because it
                    // does the same stuff.
                    var ipcoel = _gel(inPlaceCopy.canvas),
                        ipco = jsPlumb.CurrentLibrary.getOffset(ipcoel, _jsPlumb),
                        po = _jsPlumb.adjustForParentOffsetAndScroll([ipco.left, ipco.top], inPlaceCopy.canvas),
                        canvasElement = _gel(this.canvas);                               
                        
                    jpcl.setOffset(placeholderInfo.element, {left:po[0], top:po[1]});                                                           
                    
                    // when using makeSource and a parent, we first draw the source anchor on the source element, then
                    // move it to the parent.  note that this happens after drawing the placeholder for the
                    // first time.
                    if (this.parentAnchor) this.anchor = _jsPlumb.makeAnchor(this.parentAnchor, this.elementId, _jsPlumb);
                    
                    // store the id of the dragging div and the source element. the drop function will pick these up.                   
                    _jsPlumb.setAttribute(this.canvas, "dragId", placeholderInfo.id);
                    _jsPlumb.setAttribute(this.canvas, "elId", this.elementId);

                    this._jsPlumb.floatingEndpoint = _makeFloatingEndpoint(this.getPaintStyle(), this.anchor, this.endpoint, this.canvas, placeholderInfo.element, _jsPlumb, _newEndpoint);
                    // TODO we should not know about DOM here. make the library adapter do this (or the 
                        // dom adapter)
                    this.canvas.style.visibility = "hidden";            
                    
                    if (jpc == null) {                                                                                                                                                         
                        this.anchor.locked = true;
                        this.setHover(false, false);                        
                        // create a connection. one end is this endpoint, the other is a floating endpoint.                    
                        jpc = _newConnection({
                            sourceEndpoint : this,
                            targetEndpoint : this._jsPlumb.floatingEndpoint,
                            source : this.endpointWillMoveTo || this.element,  // for makeSource with parent option.  ensure source element is represented correctly.
                            target : placeholderInfo.element,
                            anchors : [ this.anchor, this._jsPlumb.floatingEndpoint.anchor ],
                            paintStyle : params.connectorStyle, // this can be null. Connection will use the default.
                            hoverPaintStyle:params.connectorHoverStyle,
                            connector : params.connector, // this can also be null. Connection will use the default.
                            overlays : params.connectorOverlays,
                            type:this.connectionType,
                            cssClass:this.connectorClass,
                            hoverClass:this.connectorHoverClass
                        });
                        jpc.pending = true; // mark this connection as not having been established.
                        jpc.addClass(_jsPlumb.draggingClass);
                        this._jsPlumb.floatingEndpoint.addClass(_jsPlumb.draggingClass);
                        // fire an event that informs that a connection is being dragged                        
                        _jsPlumb.fire("connectionDrag", jpc);

                    } else {
                        existingJpc = true;
                        jpc.setHover(false);                        
                        // if existing connection, allow to be dropped back on the source endpoint (issue 51).
                        _initDropTarget(ipcoel, false, true);
                        // new anchor idx
                        var anchorIdx = jpc.endpoints[0].id == this.id ? 0 : 1;
                        jpc.floatingAnchorIndex = anchorIdx;                    // save our anchor index as the connection's floating index.                        
                        this.detachFromConnection(jpc);                         // detach from the connection while dragging is occurring.
                        
                        // store the original scope (issue 57)
                        var dragScope = jsPlumb.CurrentLibrary.getDragScope(canvasElement);
                        _jsPlumb.setAttribute(this.canvas, "originalScope", dragScope);
                        // now we want to get this endpoint's DROP scope, and set it for now: we can only be dropped on drop zones
                        // that have our drop scope (issue 57).
                        var dropScope = jpcl.getDropScope(canvasElement);
                        jpcl.setDragScope(canvasElement, dropScope);

                        // fire an event that informs that a connection is being dragged. we do this before
                        // replacing the original target with the floating element info.
                        _jsPlumb.fire("connectionDrag", jpc);
                
                        // now we replace ourselves with the temporary div we created above:
                        if (anchorIdx === 0) {
                            existingJpcParams = [ jpc.source, jpc.sourceId, canvasElement, dragScope ];
                            jpc.source = placeholderInfo.element;
                            jpc.sourceId = placeholderInfo.id;
                        } else {
                            existingJpcParams = [ jpc.target, jpc.targetId, canvasElement, dragScope ];
                            jpc.target = placeholderInfo.element;
                            jpc.targetId = placeholderInfo.id;
                        }

                        // lock the other endpoint; if it is dynamic it will not move while the drag is occurring.
                        jpc.endpoints[anchorIdx === 0 ? 1 : 0].anchor.locked = true;
                        // store the original endpoint and assign the new floating endpoint for the drag.
                        jpc.suspendedEndpoint = jpc.endpoints[anchorIdx];
                        
                        // PROVIDE THE SUSPENDED ELEMENT, BE IT A SOURCE OR TARGET (ISSUE 39)
                        jpc.suspendedElement = jpc.endpoints[anchorIdx].getElement();
                        jpc.suspendedElementId = jpc.endpoints[anchorIdx].elementId;
                        jpc.suspendedElementType = anchorIdx === 0 ? "source" : "target";
                        
                        jpc.suspendedEndpoint.setHover(false);
                        this._jsPlumb.floatingEndpoint.referenceEndpoint = jpc.suspendedEndpoint;
                        jpc.endpoints[anchorIdx] = this._jsPlumb.floatingEndpoint;

                        jpc.addClass(_jsPlumb.draggingClass);
                        this._jsPlumb.floatingEndpoint.addClass(_jsPlumb.draggingClass);                    

                    }
                    // register it and register connection on it.
                    floatingConnections[placeholderInfo.id] = jpc;
                    _jsPlumb.anchorManager.addFloatingConnection(placeholderInfo.id, jpc);               
                    // only register for the target endpoint; we will not be dragging the source at any time
                    // before this connection is either discarded or made into a permanent connection.
                    _ju.addToList(params.endpointsByElement, placeholderInfo.id, this._jsPlumb.floatingEndpoint);
                    // tell jsplumb about it
                    _jsPlumb.currentlyDragging = true;
                }.bind(this);

                var dragOptions = params.dragOptions || {},
                    defaultOpts = jsPlumb.extend( {}, jpcl.defaultDragOptions),
                    startEvent = jpcl.dragEvents.start,
                    stopEvent = jpcl.dragEvents.stop,
                    dragEvent = jpcl.dragEvents.drag;
                
                dragOptions = jsPlumb.extend(defaultOpts, dragOptions);
                dragOptions.scope = dragOptions.scope || this.scope;
                dragOptions[startEvent] = _ju.wrap(dragOptions[startEvent], start, false);
                // extracted drag handler function so can be used by makeSource
                dragOptions[dragEvent] = _ju.wrap(dragOptions[dragEvent], _dragHandler.drag);
                dragOptions[stopEvent] = _ju.wrap(dragOptions[stopEvent],
                    function() {        

                        _jsPlumb.setConnectionBeingDragged(false);  
                        // if no endpoints, jpc already cleaned up.
                        if (jpc.endpoints != null) {          
                            // get the actual drop event (decode from library args to stop function)
                            var originalEvent = jpcl.getDropEvent(arguments);                                       
                            // unlock the other endpoint (if it is dynamic, it would have been locked at drag start)
                            var idx = jpc.floatingAnchorIndex == null ? 1 : jpc.floatingAnchorIndex;
                            jpc.endpoints[idx === 0 ? 1 : 0].anchor.locked = false;
                            // WHY does this need to happen?  i suppose because the connection might not get 
                            // deleted.  TODO: i dont want to know about css classes inside jsplumb, ideally.
                            jpc.removeClass(_jsPlumb.draggingClass);   
                        
                            // if we have the floating endpoint then the connection has not been dropped
                            // on another endpoint.  If it is a new connection we throw it away. If it is an 
                            // existing connection we check to see if we should reattach it, throwing it away 
                            // if not.
                            if (jpc.endpoints[idx] == this._jsPlumb.floatingEndpoint) {
                                // 6a. if the connection was an existing one...
                                if (existingJpc && jpc.suspendedEndpoint) {
                                    // fix for issue35, thanks Sylvain Gizard: when firing the detach event make sure the
                                    // floating endpoint has been replaced.
                                    if (idx === 0) {
                                        jpc.source = existingJpcParams[0];
                                        jpc.sourceId = existingJpcParams[1];
                                    } else {
                                        jpc.target = existingJpcParams[0];
                                        jpc.targetId = existingJpcParams[1];
                                    }
                                    
                                    // restore the original scope (issue 57)
                                    jpcl.setDragScope(existingJpcParams[2], existingJpcParams[3]);
                                    jpc.endpoints[idx] = jpc.suspendedEndpoint;
                                    // IF the connection should be reattached, or the other endpoint refuses detach, then
                                    // reset the connection to its original state
                                    if (jpc.isReattach() || jpc._forceReattach || jpc._forceDetach || !jpc.endpoints[idx === 0 ? 1 : 0].detach(jpc, false, false, true, originalEvent)) {                                   
                                        jpc.setHover(false);
                                        jpc.floatingAnchorIndex = null;
                                        jpc._forceDetach = null;
                                        jpc._forceReattach = null;
                                        this._jsPlumb.floatingEndpoint.detachFromConnection(jpc);
                                        jpc.suspendedEndpoint.addConnection(jpc);
                                        _jsPlumb.repaint(existingJpcParams[1]);
                                    }
                                }                                                               
                            }
                        }

                        // remove the element associated with the floating endpoint 
                        // (and its associated floating endpoint and visual artefacts)                                        
                        _jsPlumb.remove(placeholderInfo.element, false);
                        // remove the inplace copy
                        _jsPlumb.remove(inPlaceCopy.canvas, false);

                        // makeTargets sets this flag, to tell us we have been replaced and should delete ourself.
                        if (this.deleteAfterDragStop) {                        
                            _jsPlumb.deleteObject({endpoint:this});
                        }
                        else {
                            if (this._jsPlumb) {
                                this._jsPlumb.floatingEndpoint = null;
                                // repaint this endpoint.
                                // make our canvas visible (TODO: hand off to library; we should not know about DOM)
                                this.canvas.style.visibility = "visible";
                                // unlock our anchor
                                this.anchor.locked = false;
                                this.paint({recalc:false});                        
                            }
                        }                                                    

                        // TODO can this stay here? the connection is no longer valid.
                        _jsPlumb.fire("connectionDragStop", jpc);

                        // tell jsplumb that dragging is finished.
                        _jsPlumb.currentlyDragging = false;

                        jpc = null;

                    }.bind(this));
                
                var i = _gel(this.canvas);              
                jpcl.initDraggable(i, dragOptions, true, _jsPlumb);

                draggingInitialised = true;
            }
        };

        // if marked as source or target at create time, init the dragging.
        if (this.isSource || this.isTarget)
            this.initDraggable();        

        // pulled this out into a function so we can reuse it for the inPlaceCopy canvas; you can now drop detached connections
        // back onto the endpoint you detached it from.
        var _initDropTarget = function(canvas, forceInit, isTransient, endpoint) {
            if ((this.isTarget || forceInit) && jpcl.isDropSupported(this.element)) {
                var dropOptions = params.dropOptions || _jsPlumb.Defaults.DropOptions || jsPlumb.Defaults.DropOptions;
                dropOptions = jsPlumb.extend( {}, dropOptions);
                dropOptions.scope = dropOptions.scope || this.scope;
                var dropEvent = jpcl.dragEvents.drop,
                    overEvent = jpcl.dragEvents.over,
                    outEvent = jpcl.dragEvents.out,
                    drop = function() {                        

                        this.removeClass(_jsPlumb.endpointDropAllowedClass);
                        this.removeClass(_jsPlumb.endpointDropForbiddenClass);
                                                    
                        var originalEvent = jpcl.getDropEvent(arguments),
                            draggable = _gel(jpcl.getDragObject(arguments)),
                            id = _jsPlumb.getAttribute(draggable, "dragId"),
                            elId = _jsPlumb.getAttribute(draggable, "elId"),						
                            scope = _jsPlumb.getAttribute(draggable, "originalScope"),
                            jpc = floatingConnections[id];
                            
                        // if this is a drop back where the connection came from, mark it force rettach and
                        // return; the stop handler will reattach. without firing an event.
                        var redrop = jpc.suspendedEndpoint && (jpc.suspendedEndpoint.id == this.id ||
                                        this.referenceEndpoint && jpc.suspendedEndpoint.id == this.referenceEndpoint.id) ;							
                        if (redrop) {								
                            jpc._forceReattach = true;
                            return;
                        }

                        if (jpc != null) {
                            var idx = jpc.floatingAnchorIndex == null ? 1 : jpc.floatingAnchorIndex, oidx = idx === 0 ? 1 : 0;
                            
                            // restore the original scope if necessary (issue 57)						
                            if (scope) jsPlumb.CurrentLibrary.setDragScope(draggable, scope);							
                            
                            var endpointEnabled = endpoint != null ? endpoint.isEnabled() : true;
                            
                            if (this.isFull()) {
                                this.fire("maxConnections", { 
                                    endpoint:this, 
                                    connection:jpc, 
                                    maxConnections:this._jsPlumb.maxConnections 
                                }, originalEvent);
                            }
                                                            
                            if (!this.isFull() && !(idx === 0 && !this.isSource) && !(idx == 1 && !this.isTarget) && endpointEnabled) {
                                var _doContinue = true;

                                // the second check here is for the case that the user is dropping it back
                                // where it came from.
                                if (jpc.suspendedEndpoint && jpc.suspendedEndpoint.id != this.id) {
                                    if (idx === 0) {
                                        jpc.source = jpc.suspendedEndpoint.element;
                                        jpc.sourceId = jpc.suspendedEndpoint.elementId;
                                    } else {
                                        jpc.target = jpc.suspendedEndpoint.element;
                                        jpc.targetId = jpc.suspendedEndpoint.elementId;
                                    }

                                    if (!jpc.isDetachAllowed(jpc) || !jpc.endpoints[idx].isDetachAllowed(jpc) || !jpc.suspendedEndpoint.isDetachAllowed(jpc) || !_jsPlumb.checkCondition("beforeDetach", jpc))
                                        _doContinue = false;								
                                }
            
                                // these have to be set before testing for beforeDrop.
                                if (idx === 0) {
                                    jpc.source = this.element;
                                    jpc.sourceId = this.elementId;
                                } else {
                                    jpc.target = this.element;
                                    jpc.targetId = this.elementId;
                                }
                                                            
// ------------ wrap the execution path in a function so we can support asynchronous beforeDrop																
                                    
                                // we want to execute this regardless.
                                var commonFunction = function() {
                                    jpc.floatingAnchorIndex = null;
                                };	
                                                                                                
                                var continueFunction = function() {
                                    jpc.pending = false;

                                    // remove this jpc from the current endpoint
                                    jpc.endpoints[idx].detachFromConnection(jpc);
                                    if (jpc.suspendedEndpoint) jpc.suspendedEndpoint.detachFromConnection(jpc);
                                    jpc.endpoints[idx] = this;
                                    this.addConnection(jpc);
                                    
                                    // copy our parameters in to the connection:
                                    var params = this.getParameters();
                                    for (var aParam in params)
                                        jpc.setParameter(aParam, params[aParam]);

                                    if (!jpc.suspendedEndpoint) {  
                                        // if not an existing connection and
                                        if (params.draggable)
                                            jsPlumb.CurrentLibrary.initDraggable(this.element, dragOptions, true, _jsPlumb);
                                    }
                                    else {
                                        var suspendedElement = jpc.suspendedEndpoint.getElement(), suspendedElementId = jpc.suspendedEndpoint.elementId;
                                        _fireMoveEvent({
                                            index:idx,
                                            originalSourceId:idx === 0 ? suspendedElementId : jpc.sourceId,
                                            newSourceId:idx === 0 ? this.elementId : jpc.sourceId,
                                            originalTargetId:idx == 1 ? suspendedElementId : jpc.targetId,
                                            newTargetId:idx == 1 ? this.elementId : jpc.targetId,
                                            originalSourceEndpoint:idx === 0 ? jpc.suspendedEndpoint : jpc.endpoints[0],
                                            newSourceEndpoint:idx === 0 ? this : jpc.endpoints[0],
                                            originalTargetEndpoint:idx == 1 ? jpc.suspendedEndpoint : jpc.endpoints[1],
                                            newTargetEndpoint:idx == 1 ? this : jpc.endpoints[1],
                                            connection:jpc
                                        }, originalEvent);
                                       /* var suspendedElement = jpc.suspendedEndpoint.getElement(), suspendedElementId = jpc.suspendedEndpoint.elementId;
                                        // fire a detach event
                                        _fireDetachEvent({
                                            source : idx === 0 ? suspendedElement : jpc.source, 
                                            target : idx == 1 ? suspendedElement : jpc.target,
                                            sourceId : idx === 0 ? suspendedElementId : jpc.sourceId, 
                                            targetId : idx == 1 ? suspendedElementId : jpc.targetId,
                                            sourceEndpoint : idx === 0 ? jpc.suspendedEndpoint : jpc.endpoints[0], 
                                            targetEndpoint : idx == 1 ? jpc.suspendedEndpoint : jpc.endpoints[1],
                                            connection : jpc
                                        }, true, originalEvent);*/
                                    }

                                    // TODO this is like the makeTarget drop code.
                                    if (idx == 1)
                                        _jsPlumb.anchorManager.updateOtherEndpoint(jpc.sourceId, jpc.suspendedElementId, jpc.targetId, jpc);
                                    else                                    
                                        _jsPlumb.anchorManager.sourceChanged(jpc.suspendedEndpoint.elementId, jpc.sourceId, jpc);                                   

                                    // finalise will inform the anchor manager and also add to
                                    // connectionsByScope if necessary.
                                    // TODO if this is not set to true, then dragging a connection's target to a new
                                    // target causes the connection to be forgotten. however if it IS set to true, then
                                    // the opposite happens: dragging by source causes the connection to get forgotten
                                    // about and then if you delete it jsplumb breaks.
                                    _finaliseConnection(jpc, null, originalEvent/*, true*/);
                                    
                                    commonFunction();
                                }.bind(this);
                                
                                var dontContinueFunction = function() {
                                    // otherwise just put it back on the endpoint it was on before the drag.
                                    if (jpc.suspendedEndpoint) {									
                                        jpc.endpoints[idx] = jpc.suspendedEndpoint;
                                        jpc.setHover(false);
                                        jpc._forceDetach = true;
                                        if (idx === 0) {
                                            jpc.source = jpc.suspendedEndpoint.element;
                                            jpc.sourceId = jpc.suspendedEndpoint.elementId;
                                        } else {
                                            jpc.target = jpc.suspendedEndpoint.element;
                                            jpc.targetId = jpc.suspendedEndpoint.elementId;
                                        }
                                        jpc.suspendedEndpoint.addConnection(jpc);

                                        jpc.endpoints[0].repaint();
                                        jpc.repaint();
                                        _jsPlumb.repaint(jpc.sourceId);
                                        jpc._forceDetach = false;
                                    }
                                    
                                    commonFunction();
                                };
                                
// --------------------------------------
                                // now check beforeDrop.  this will be available only on Endpoints that are setup to
                                // have a beforeDrop condition (although, secretly, under the hood all Endpoints and 
                                // the Connection have them, because they are on jsPlumbUIComponent.  shhh!), because
                                // it only makes sense to have it on a target endpoint.
                                _doContinue = _doContinue && this.isDropAllowed(jpc.sourceId, jpc.targetId, jpc.scope, jpc, this);
                                                                                                                    
                                if (_doContinue) {
                                    continueFunction();
                                }
                                else {
                                    dontContinueFunction();
                                }
                            }
                            _jsPlumb.currentlyDragging = false;
                        }
                    }.bind(this);
                
                dropOptions[dropEvent] = _ju.wrap(dropOptions[dropEvent], drop);
                dropOptions[overEvent] = _ju.wrap(dropOptions[overEvent], function() {					
                    var draggable = jpcl.getDragObject(arguments),
                        id = _jsPlumb.getAttribute(draggable, "dragId"),
                        _jpc = floatingConnections[id];
                        
                    if (_jpc != null) {								
                        var idx = _jpc.floatingAnchorIndex == null ? 1 : _jpc.floatingAnchorIndex;
                        // here we should fire the 'over' event if we are a target and this is a new connection,
                        // or we are the same as the floating endpoint.								
                        var _cont = (this.isTarget && _jpc.floatingAnchorIndex !== 0) || (_jpc.suspendedEndpoint && this.referenceEndpoint && this.referenceEndpoint.id == _jpc.suspendedEndpoint.id);
                        if (_cont) {
                            var bb = _jsPlumb.checkCondition("checkDropAllowed", { 
                                sourceEndpoint:_jpc.endpoints[idx], 
                                targetEndpoint:this,
                                connection:_jpc
                            }); 
                            this[(bb ? "add" : "remove") + "Class"](_jsPlumb.endpointDropAllowedClass);
                            this[(bb ? "remove" : "add") + "Class"](_jsPlumb.endpointDropForbiddenClass);
                            _jpc.endpoints[idx].anchor.over(this.anchor, this);
                        }
                    }						
                }.bind(this));	

                dropOptions[outEvent] = _ju.wrap(dropOptions[outEvent], function() {					
                    var draggable = jpcl.getDragObject(arguments),
                        id = _jsPlumb.getAttribute( draggable, "dragId"),
                        _jpc = floatingConnections[id];
                        
                    if (_jpc != null) {
                        var idx = _jpc.floatingAnchorIndex == null ? 1 : _jpc.floatingAnchorIndex;
                        var _cont = (this.isTarget && _jpc.floatingAnchorIndex !== 0) || (_jpc.suspendedEndpoint && this.referenceEndpoint && this.referenceEndpoint.id == _jpc.suspendedEndpoint.id);
                        if (_cont) {
                            this.removeClass(_jsPlumb.endpointDropAllowedClass);
                            this.removeClass(_jsPlumb.endpointDropForbiddenClass);
                            _jpc.endpoints[idx].anchor.out();
                        }
                    }
                }.bind(this));
                jpcl.initDroppable(canvas, dropOptions, true, isTransient);
            }
        }.bind(this);
        
        // initialise the endpoint's canvas as a drop target.  this will be ignored if the endpoint is not a target or drag is not supported.
        _initDropTarget(_gel(this.canvas), true, !(params._transient || this.anchor.isFloating), this);
        
         // finally, set type if it was provided
         if (params.type)
            this.addType(params.type, params.data, _jsPlumb.isSuspendDrawing());

        return this;        					
    };

    jsPlumbUtil.extend(jsPlumb.Endpoint, OverlayCapableJsPlumbUIComponent, {
        getTypeDescriptor : function() { return "endpoint"; },        
        isVisible : function() { return this._jsPlumb.visible; },
        setVisible : function(v, doNotChangeConnections, doNotNotifyOtherEndpoint) {
            this._jsPlumb.visible = v;
            if (this.canvas) this.canvas.style.display = v ? "block" : "none";
            this[v ? "showOverlays" : "hideOverlays"]();
            if (!doNotChangeConnections) {
                for (var i = 0; i < this.connections.length; i++) {
                    this.connections[i].setVisible(v);
                    if (!doNotNotifyOtherEndpoint) {
                        var oIdx = this === this.connections[i].endpoints[0] ? 1 : 0;
                        // only change the other endpoint if this is its only connection.
                        if (this.connections[i].endpoints[oIdx].connections.length == 1) this.connections[i].endpoints[oIdx].setVisible(v, true, true);
                    }
                }
            }
        },
        getAttachedElements : function() {
            return this.connections;
        },
        applyType : function(t, doNotRepaint) {         
            if (t.maxConnections != null) this._jsPlumb.maxConnections = t.maxConnections;
            if (t.scope) this.scope = t.scope;
            jsPlumbUtil.copyValues(typeParameters, t, this);
            if (t.anchor) {
                this.anchor = this._jsPlumb.instance.makeAnchor(t.anchor);
            }
        },
        isEnabled : function() { return this._jsPlumb.enabled; },
        setEnabled : function(e) { this._jsPlumb.enabled = e; },
        cleanup : function() {            
            jsPlumb.CurrentLibrary.removeClass(this.element, this._jsPlumb.instance.endpointAnchorClassPrefix + "_" + this._jsPlumb.currentAnchorClass);            
            this.anchor = null;
            this.endpoint.cleanup();
            this.endpoint.destroy();
            this.endpoint = null;
            // drag/drop
            var i = jsPlumb.CurrentLibrary.getElementObject(this.canvas);              
            jsPlumb.CurrentLibrary.destroyDraggable(i);
            jsPlumb.CurrentLibrary.destroyDroppable(i);
        },
        setHover : function(h) {
            if (this.endpoint && this._jsPlumb && !this._jsPlumb.instance.isConnectionBeingDragged())
                this.endpoint.setHover(h);            
        },
        isFull : function() {
            return !(this.isFloating() || this._jsPlumb.maxConnections < 1 || this.connections.length < this._jsPlumb.maxConnections);              
        },
        getConnectionCost : function() { return this._jsPlumb.connectionCost; },
        setConnectionCost : function(c) {
            this._jsPlumb.connectionCost = c; 
        },
        areConnectionsDirected : function() { return this._jsPlumb.connectionsDirected; },
        setConnectionsDirected : function(b) { this._jsPlumb.connectionsDirected = b; },
        setElementId : function(_elId) {
            this.elementId = _elId;
            this.anchor.elementId = _elId;
        },        
        setReferenceElement : function(_el) {
            this.element = jsPlumb.CurrentLibrary.getDOMElement(_el);
        },
        setDragAllowedWhenFull : function(allowed) {
            this.dragAllowedWhenFull = allowed;
        },
        equals : function(endpoint) {
            return this.anchor.equals(endpoint.anchor);
        },
        getUuid : function() {
            return this._jsPlumb.uuid;
        },
        computeAnchor : function(params) {
            return this.anchor.compute(params);
        }
    });
})();