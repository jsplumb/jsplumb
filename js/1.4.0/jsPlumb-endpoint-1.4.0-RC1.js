;(function() {
        
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
    
    //
    // creates a placeholder div for dragging purposes, adds it to the DOM, and pre-computes its offset.
    //
    var _makeDraggablePlaceholder = function(placeholder, parent, _jsPlumb) {
        var n = document.createElement("div");
        n.style.position = "absolute";
        var placeholderDragElement = jsPlumb.CurrentLibrary.getElementObject(n);
        jsPlumb.CurrentLibrary.appendElement(n, parent);
        var id = _jsPlumb.getId(placeholderDragElement);
        _jsPlumb.updateOffset( { elId : id });
        // create and assign an id, and initialize the offset.
        placeholder.id = id;
        placeholder.element = placeholderDragElement;
    };
    
    var _makeFloatingEndpoint = function(paintStyle, referenceAnchor, endpoint, referenceCanvas, sourceElement, _jsPlumb, _newEndpoint) {			
        var floatingAnchor = new jsPlumb.FloatingAnchor( { reference : referenceAnchor, referenceCanvas : referenceCanvas, jsPlumbInstance:_jsPlumb });
        //setting the scope here should not be the way to fix that mootools issue.  it should be fixed by not
        // adding the floating endpoint as a droppable.  that makes more sense anyway!
        return _newEndpoint({ paintStyle : paintStyle, endpoint : endpoint, anchor : floatingAnchor, source : sourceElement, scope:"__floating" });
    };

    jsPlumb.Endpoint = function(params) {
        var self = this, 
            _jsPlumb = params["_jsPlumb"],
            jpcl = jsPlumb.CurrentLibrary,
            _att = jpcl.getAttribute,
            _gel = jpcl.getElementObject,
            _ju = jsPlumbUtil,
            _getOffset = jpcl.getOffset,
            _newConnection = params.newConnection,
            _newEndpoint = params.newEndpoint,
            _finaliseConnection = params.finaliseConnection,
            _fireDetachEvent = params.fireDetachEvent,
            floatingConnections = params.floatingConnections;
        
        self.idPrefix = "_jsplumb_e_";			
        self.defaultLabelLocation = [ 0.5, 0.5 ];
        self.defaultOverlayKeys = ["Overlays", "EndpointOverlays"];
        this.parent = params.parent;
        overlayCapableJsPlumbUIComponent.apply(this, arguments);
        params = params || {};
        
// TYPE		
        
        this.getTypeDescriptor = function() { return "endpoint"; };
        this.getDefaultType = function() {								
            return {
                parameters:{},
                scope:null,
                maxConnections:self._jsPlumb.Defaults.MaxConnections,
                paintStyle:self._jsPlumb.Defaults.EndpointStyle || jsPlumb.Defaults.EndpointStyle,
                endpoint:self._jsPlumb.Defaults.Endpoint || jsPlumb.Defaults.Endpoint,
                hoverPaintStyle:self._jsPlumb.Defaults.EndpointHoverStyle || jsPlumb.Defaults.EndpointHoverStyle,				
                overlays:self._jsPlumb.Defaults.EndpointOverlays || jsPlumb.Defaults.EndpointOverlays,
                connectorStyle:params.connectorStyle,				
                connectorHoverStyle:params.connectorHoverStyle,
                connectorClass:params.connectorClass,
                connectorHoverClass:params.connectorHoverClass,
                connectorOverlays:params.connectorOverlays,
                connector:params.connector,
                connectorTooltip:params.connectorTooltip
            };
        };
        var superAt = this.applyType;
        this.applyType = function(t, doNotRepaint) {
            superAt(t, doNotRepaint);
            if (t.maxConnections != null) _maxConnections = t.maxConnections;
            if (t.scope) self.scope = t.scope;
            self.connectorStyle = t.connectorStyle;
            self.connectorHoverStyle = t.connectorHoverStyle;
            self.connectorOverlays = t.connectorOverlays;
            self.connector = t.connector;
            self.connectorTooltip = t.connectorTooltip;
            self.connectionType = t.connectionType;
            self.connectorClass = t.connectorClass;
            self.connectorHoverClass = t.connectorHoverClass;
        };			
// END TYPE
    
        var visible = true, __enabled = !(params.enabled === false);
        
        this.isVisible = function() { return visible; };        
        this.setVisible = function(v, doNotChangeConnections, doNotNotifyOtherEndpoint) {
            visible = v;
            if (self.canvas) self.canvas.style.display = v ? "block" : "none";
            self[v ? "showOverlays" : "hideOverlays"]();
            if (!doNotChangeConnections) {
                for (var i = 0; i < self.connections.length; i++) {
                    self.connections[i].setVisible(v);
                    if (!doNotNotifyOtherEndpoint) {
                        var oIdx = self === self.connections[i].endpoints[0] ? 1 : 0;
                        // only change the other endpoint if this is its only connection.
                        if (self.connections[i].endpoints[oIdx].connections.length == 1) self.connections[i].endpoints[oIdx].setVisible(v, true, true);
                    }
                }
            }
        };			

        /*
            Function: isEnabled
            Returns whether or not the Endpoint is enabled for drag/drop connections.
        */
        this.isEnabled = function() { return __enabled; };

        /*
            Function: setEnabled
            Sets whether or not the Endpoint is enabled for drag/drop connections.
            
            Parameters:
                enabled - whether or not the Endpoint is enabled.			
        */
        this.setEnabled = function(e) { __enabled = e; };

        var _element = params.source,  _uuid = params.uuid, floatingEndpoint = null,  inPlaceCopy = null;
        if (_uuid) params.endpointsByUUID[_uuid] = self;
        var _elementId = _att(_element, "id");
        this.elementId = _elementId;
        this.element = _element;
        
        self.setElementId = function(_elId) {
            _elementId = _elId;
            self.elementId = _elId;
            self.anchor.elementId = _elId
        };
        
        self.setReferenceElement = function(_el) {
            _element = _el;
            self.element = _el;
        };
        
        var _connectionCost = params.connectionCost;
        this.getConnectionCost = function() { return _connectionCost; };
        this.setConnectionCost = function(c) {
            _connectionCost = c; 
        };
        
        var _connectionsDirected = params.connectionsDirected;
        this.areConnectionsDirected = function() { return _connectionsDirected; };
        this.setConnectionsDirected = function(b) { _connectionsDirected = b; };
                    
        self.anchor = params.anchor ? _jsPlumb.makeAnchor(params.anchor, _elementId, _jsPlumb) : params.anchors ? _jsPlumb.makeAnchor(params.anchors, _elementId, _jsPlumb) : _jsPlumb.makeAnchor(_jsPlumb.Defaults.Anchor || "TopCenter", _elementId, _jsPlumb);
            
        // ANCHOR MANAGER
        if (!params._transient) // in place copies, for example, are transient.  they will never need to be retrieved during a paint cycle, because they dont move, and then they are deleted.
            _jsPlumb.anchorManager.add(self, _elementId);

        var _endpoint = null, originalEndpoint = null;
        this.setEndpoint = function(ep) {
            var endpointArgs = {
                _jsPlumb:self._jsPlumb,
                cssClass:params.cssClass,
                parent:params.parent,
                container:params.container,
                tooltip:params.tooltip,
                connectorTooltip:params.connectorTooltip,
                endpoint:self
            };
            if (_ju.isString(ep)) 
                _endpoint = new jsPlumb.Endpoints[_jsPlumb.getRenderMode()][ep](endpointArgs);
            else if (_ju.isArray(ep)) {
                endpointArgs = _ju.merge(ep[1], endpointArgs);
                _endpoint = new jsPlumb.Endpoints[_jsPlumb.getRenderMode()][ep[0]](endpointArgs);
            }
            else {
                _endpoint = ep.clone();
            }

            // assign a clone function using a copy of endpointArgs. this is used when a drag starts: the endpoint that was dragged is cloned,
            // and the clone is left in its place while the original one goes off on a magical journey. 
            // the copy is to get around a closure problem, in which endpointArgs ends up getting shared by
            // the whole world.
            var argsForClone = jsPlumb.extend({}, endpointArgs);						
            _endpoint.clone = function() {
                var o = new Object();
                _endpoint.constructor.apply(o, [argsForClone]);
                return o;
            };

            self.endpoint = _endpoint;
            self.type = self.endpoint.type;
        };
         
        this.setEndpoint(params.endpoint || _jsPlumb.Defaults.Endpoint || jsPlumb.Defaults.Endpoint || "Dot");							
        originalEndpoint = _endpoint;

        // override setHover to pass it down to the underlying endpoint
        var _sh = self.setHover;
        self.setHover = function() {
            self.endpoint.setHover.apply(self.endpoint, arguments);
            _sh.apply(self, arguments);
        };
        // endpoint delegates to first connection for hover, if there is one.
        var internalHover = function(state) {
          if (self.connections.length > 0)
            self.connections[0].setHover(state, false);
          else
            self.setHover(state);
        };
        
        // bind listeners from endpoint to self, with the internal hover function defined above.
        self.bindListeners(self.endpoint, self, internalHover);
                                
        this.setPaintStyle(params.paintStyle || 
                           params.style || 
                           _jsPlumb.Defaults.EndpointStyle || 
                           jsPlumb.Defaults.EndpointStyle, true);
        this.setHoverPaintStyle(params.hoverPaintStyle || 
                                _jsPlumb.Defaults.EndpointHoverStyle || 
                                jsPlumb.Defaults.EndpointHoverStyle, true);
        this.paintStyleInUse = this.getPaintStyle();
        var originalPaintStyle = this.getPaintStyle();
        this.connectorStyle = params.connectorStyle;
        this.connectorHoverStyle = params.connectorHoverStyle;
        this.connectorOverlays = params.connectorOverlays;
        this.connector = params.connector;
        this.connectorTooltip = params.connectorTooltip;
        this.connectorClass = params.connectorClass;
        this.connectorHoverClass = params.connectorHoverClass;	
        this.isSource = params.isSource || false;
        this.isTarget = params.isTarget || false;
        
        var _maxConnections = params.maxConnections || _jsPlumb.Defaults.MaxConnections; // maximum number of connections this endpoint can be the source of.
                    
        this.getAttachedElements = function() {
            return self.connections;
        };
                    
        this.canvas = this.endpoint.canvas;			
        this.connections = params.connections || [];
        this.connectorPointerEvents = params["connector-pointer-events"];
        
        this.scope = params.scope || _jsPlumb.getDefaultScope();
        this.connectionType = params.connectionType;
        this.timestamp = null;
        self.reattachConnections = params.reattach || _jsPlumb.Defaults.ReattachConnections;
        self.connectionsDetachable = _jsPlumb.Defaults.ConnectionsDetachable;
        if (params.connectionsDetachable === false || params.detachable === false)
            self.connectionsDetachable = false;
        var dragAllowedWhenFull = params.dragAllowedWhenFull || true;
        
        if (params.onMaxConnections)
            self.bind("maxConnections", params.onMaxConnections);

        this.computeAnchor = function(params) {
            return self.anchor.compute(params);
        };
        
        this.addConnection = function(connection) {
            self.connections.push(connection);
        };		        
        this.detach = function(connection, ignoreTarget, forceDetach, fireEvent, originalEvent) {
            var idx = _ju.findWithFunction(self.connections, function(c) { return c.id == connection.id}), 
                actuallyDetached = false;
            fireEvent = (fireEvent !== false);
            if (idx >= 0) {		
                // 1. does the connection have a before detach (note this also checks jsPlumb's bound
                // detach handlers; but then Endpoint's check will, too, hmm.)
                if (forceDetach || connection._forceDetach || connection.isDetachable() || connection.isDetachAllowed(connection)) {
                    // get the target endpoint
                    var t = connection.endpoints[0] == self ? connection.endpoints[1] : connection.endpoints[0];
                    // it would be nice to check with both endpoints that it is ok to detach. but 
                    // for this we'll have to get a bit fancier: right now if you use the same beforeDetach
                    // interceptor for two endpoints (which is kind of common, because it's part of the
                    // endpoint definition), then it gets fired twice.  so in fact we need to loop through
                    // each beforeDetach and see if it returns false, at which point we exit.  but if it
                    // returns true, we have to check the next one.  however we need to track which ones
                    // have already been run, and not run them again.
                    if (forceDetach || connection._forceDetach || (self.isDetachAllowed(connection) /*&& t.isDetachAllowed(connection)*/)) {
                
                        self.connections.splice(idx, 1);										
                
                        // this avoids a circular loop
                        if (!ignoreTarget) {
                        
                            t.detach(connection, true, forceDetach);
                            // check connection to see if we want to delete the endpoints associated with it.
                            // we only detach those that have just this connection; this scenario is most
                            // likely if we got to this bit of code because it is set by the methods that
                            // create their own endpoints, like .connect or .makeTarget. the user is
                            // not likely to have interacted with those endpoints.
                            if (connection.endpointsToDeleteOnDetach){
                                for (var i = 0; i < connection.endpointsToDeleteOnDetach.length; i++) {
                                    var cde = connection.endpointsToDeleteOnDetach[i];
                                    if (cde && cde.connections.length == 0) 
                                        _jsPlumb.deleteEndpoint(cde);							
                                }
                            }
                        }
                        _ju.removeElements(connection.connector.getDisplayElements(), connection.parent);
                        _ju.removeWithFunction(params.connectionsByScope[connection.scope], function(c) {
                            return c.id == connection.id;
                        });
                        actuallyDetached = true;
                        var doFireEvent = (!ignoreTarget && fireEvent)
                        _fireDetachEvent(connection, doFireEvent, originalEvent);
                    }
                }
            }
            return actuallyDetached;
        };			
        
        this.detachAll = function(fireEvent, originalEvent) {
            while (self.connections.length > 0) {
                self.detach(self.connections[0], false, true, fireEvent, originalEvent);
            }
        };
            
        this.detachFrom = function(targetEndpoint, fireEvent, originalEvent) {
            var c = [];
            for ( var i = 0; i < self.connections.length; i++) {
                if (self.connections[i].endpoints[1] == targetEndpoint
                        || self.connections[i].endpoints[0] == targetEndpoint) {
                    c.push(self.connections[i]);
                }
            }
            for ( var i = 0; i < c.length; i++) {
                if (self.detach(c[i], false, true, fireEvent, originalEvent))
                    c[i].setHover(false, false);					
            }
        };	
        
        this.detachFromConnection = function(connection) {
            var idx =  _ju.findWithFunction(self.connections, function(c) { return c.id == connection.id});
            if (idx >= 0) {
                self.connections.splice(idx, 1);
            }
        };
        
        this.getElement = function() {
            return _element;
        };		
                 
        this.setElement = function(el, container) {

            // TODO possibly have this object take charge of moving the UI components into the appropriate
            // parent.  this is used only by makeSource right now, and that function takes care of
            // moving the UI bits and pieces.  however it would s			
            var parentId = _jsPlumb.getId(el);
            // remove the endpoint from the list for the current endpoint's element
            _ju.removeWithFunction(params.endpointsByElement[self.elementId], function(e) {
                return e.id == self.id;
            });
            _element = _gel(el);
            _elementId = _jsPlumb.getId(_element);
            self.elementId = _elementId;
            // need to get the new parent now
            var newParentElement = params.getParentFromParams({source:parentId, container:container}),
            curParent = jpcl.getParent(self.canvas);
            jpcl.removeElement(self.canvas, curParent);
            jpcl.appendElement(self.canvas, newParentElement);								
            
            // now move connection(s)...i would expect there to be only one but we will iterate.
            for (var i = 0; i < self.connections.length; i++) {
                self.connections[i].moveParent(newParentElement);
                self.connections[i].sourceId = _elementId;
                self.connections[i].source = _element;					
            }	
            _ju.addToList(params.endpointsByElement, parentId, self);
            //_jsPlumb.repaint(parentId);			
        
        };

        
        this.getUuid = function() {
            return _uuid;
        };
        /**
         * private but must be exposed.
         */
        this.makeInPlaceCopy = function() {
            var loc = self.anchor.getCurrentLocation(self),
                o = self.anchor.getOrientation(self),
                inPlaceAnchor = {
                    compute:function() { return [ loc[0], loc[1] ]},
                    getCurrentLocation : function() { return [ loc[0], loc[1] ]},
                    getOrientation:function() { return o; }
                };

            return _newEndpoint( { 
                anchor : inPlaceAnchor, 
                source : _element, 
                paintStyle : this.getPaintStyle(), 
                endpoint : params.hideOnDrag ? "Blank" : _endpoint,
                _transient:true,
                scope:self.scope
            });
        };
        
        this.isConnectedTo = function(endpoint) {
            var found = false;
            if (endpoint) {
                for ( var i = 0; i < self.connections.length; i++) {
                    if (self.connections[i].endpoints[1] == endpoint) {
                        found = true;
                        break;
                    }
                }
            }
            return found;
        };

        /**
         * private but needs to be exposed.
         */
        this.isFloating = function() {
            return floatingEndpoint != null;
        };
        
        /**
         * returns a connection from the pool; used when dragging starts.  just gets the head of the array if it can.
         */
        this.connectorSelector = function() {
            var candidate = self.connections[0];
            if (self.isTarget && candidate) return candidate;
            else {
                return (self.connections.length < _maxConnections) || _maxConnections == -1 ? null : candidate;
            }
        };
        
        this.isFull = function() {
            return !(self.isFloating() || _maxConnections < 1 || self.connections.length < _maxConnections);				
        };
                    
        this.setDragAllowedWhenFull = function(allowed) {
            dragAllowedWhenFull = allowed;
        };
            
        
        this.setStyle = self.setPaintStyle;

        /**
         * a deep equals check. everything must match, including the anchor,
         * styles, everything. TODO: finish Endpoint.equals
         */
        this.equals = function(endpoint) {
            return this.anchor.equals(endpoint.anchor);
        };
        
        // a helper function that tries to find a connection to the given element, and returns it if so. if elementWithPrecedence is null,
        // or no connection to it is found, we return the first connection in our list.
        var findConnectionToUseForDynamicAnchor = function(elementWithPrecedence) {
            var idx = 0;
            if (elementWithPrecedence != null) {
                for (var i = 0; i < self.connections.length; i++) {
                    if (self.connections[i].sourceId == elementWithPrecedence || self.connections[i].targetId == elementWithPrecedence) {
                        idx = i;
                        break;
                    }
                }
            }
            
            return self.connections[idx];
        };
        
        this.paint = function(params) {
            params = params || {};
            var timestamp = params.timestamp, recalc = !(params.recalc === false);								
            if (!timestamp || self.timestamp !== timestamp) {						
                var info = _jsPlumb.updateOffset({ elId:_elementId, timestamp:timestamp, recalc:recalc });
                var xy = params.offset ? params.offset.o : info.o;
                if(xy) {
                    var ap = params.anchorPoint,connectorPaintStyle = params.connectorPaintStyle;
                    if (ap == null) {
                        var wh = params.dimensions || info.s;
                        if (xy == null || wh == null) {
                            info = _jsPlumb.updateOffset( { elId : _elementId, timestamp : timestamp });
                            xy = info.o;
                            wh = info.s;
                        }
                        var anchorParams = { xy : [ xy.left, xy.top ], wh : wh, element : self, timestamp : timestamp };
                        if (recalc && self.anchor.isDynamic && self.connections.length > 0) {
                            var c = findConnectionToUseForDynamicAnchor(params.elementWithPrecedence),
                                oIdx = c.endpoints[0] == self ? 1 : 0,
                                oId = oIdx == 0 ? c.sourceId : c.targetId,
                                oInfo = _jsPlumb.getCachedData(oId),
                                oOffset = oInfo.o, oWH = oInfo.s;
                            anchorParams.txy = [ oOffset.left, oOffset.top ];
                            anchorParams.twh = oWH;
                            anchorParams.tElement = c.endpoints[oIdx];
                        }
                        ap = self.anchor.compute(anchorParams);
                    }
                                        
                    _endpoint.compute(ap, self.anchor.getOrientation(self), self.paintStyleInUse, connectorPaintStyle || self.paintStyleInUse);
                    _endpoint.paint(self.paintStyleInUse, self.anchor);					
                    self.timestamp = timestamp;

                    // paint overlays
                    for ( var i = 0; i < self.overlays.length; i++) {
                        var o = self.overlays[i];
                        if (o.isVisible) 
                            self.overlayPlacements[i] = o.draw(self.endpoint, self.paintStyleInUse);
                    }
                }
            }
        };

        this.repaint = this.paint;        

        // is this a connection source? we make it draggable and have the
        // drag listener maintain a connection with a floating endpoint.
        if (jpcl.isDragSupported(_element)) {
            var placeholderInfo = { id:null, element:null },
                jpc = null,
                existingJpc = false,
                existingJpcParams = null,
                _dragHandler = _makeConnectionDragHandler(placeholderInfo, _jsPlumb);

            var start = function() {	
            // drag might have started on an endpoint that is not actually a source, but which has
            // one or more connections.
                jpc = self.connectorSelector();
                var _continue = true;
                // if not enabled, return
                if (!self.isEnabled()) _continue = false;
                // if no connection and we're not a source, return.
                if (jpc == null && !params.isSource) _continue = false;
                // otherwise if we're full and not allowed to drag, also return false.
                if (params.isSource && self.isFull() && !dragAllowedWhenFull) _continue = false;
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

                // if we're not full but there was a connection, make it null. we'll create a new one.
                if (jpc && !self.isFull() && params.isSource) jpc = null;

                _jsPlumb.updateOffset( { elId : _elementId });
                inPlaceCopy = self.makeInPlaceCopy();
                inPlaceCopy.referenceEndpoint = self;
                inPlaceCopy.paint();																
                
                _makeDraggablePlaceholder(placeholderInfo, self.parent, _jsPlumb);
                
                // set the offset of this div to be where 'inPlaceCopy' is, to start with.
                // TODO merge this code with the code in both Anchor and FloatingAnchor, because it
                // does the same stuff.
                var ipcoel = _gel(inPlaceCopy.canvas),
                    ipco = _getOffset(ipcoel, _jsPlumb),
                    po = _jsPlumb.adjustForParentOffsetAndScroll([ipco.left, ipco.top], inPlaceCopy.canvas),
                    canvasElement = _gel(self.canvas);                               
                    
                jpcl.setOffset(placeholderInfo.element, {left:po[0], top:po[1]});															
                
                // when using makeSource and a parent, we first draw the source anchor on the source element, then
                // move it to the parent.  note that this happens after drawing the placeholder for the
                // first time.
                if (self.parentAnchor) self.anchor = _jsPlumb.makeAnchor(self.parentAnchor, self.elementId, _jsPlumb);
                
                // store the id of the dragging div and the source element. the drop function will pick these up.					
                jpcl.setAttribute(canvasElement, "dragId", placeholderInfo.id);
                jpcl.setAttribute(canvasElement, "elId", _elementId);

                // create a floating endpoint.
                // here we test to see if a dragProxy was specified in this endpoint's constructor params, and
                // if so, we create that endpoint instead of cloning ourselves.
                //if (params.proxy) {
            /*		var floatingAnchor = new jsPlumb.FloatingAnchor( { reference : self.anchor, referenceCanvas : self.canvas });

                    floatingEndpoint = _newEndpoint({ 
                        paintStyle : params.proxy.paintStyle,
                        endpoint : params.proxy.endpoint,
                        anchor : floatingAnchor, 
                        source : placeholderInfo.element, 
                        scope:"__floating" 
                    });		
                    
                    //$(self.canvas).hide();									
                    */
                    //self.setPaintStyle(params.proxy.paintStyle);
                    // if we do this, we have to cleanup the old one. like just remove its display parts												
                    //self.setEndpoint(params.proxy.endpoint);

                //}
            //	else {
                    floatingEndpoint = _makeFloatingEndpoint(self.getPaintStyle(), self.anchor, _endpoint, self.canvas, placeholderInfo.element, _jsPlumb, _newEndpoint);

                    self.canvas.style.visibility = "hidden";
            //	}
                
                if (jpc == null) {                                                                                                                                                         
                    self.anchor.locked = true;
                    self.setHover(false, false);                        
                    // create a connection. one end is this endpoint, the other is a floating endpoint.                    
                    jpc = _newConnection({
                        sourceEndpoint : self,
                        targetEndpoint : floatingEndpoint,
                        source : self.endpointWillMoveTo || _element,  // for makeSource with parent option.  ensure source element is represented correctly.
                        target : placeholderInfo.element,
                        anchors : [ self.anchor, floatingEndpoint.anchor ],
                        paintStyle : params.connectorStyle, // this can be null. Connection will use the default.
                        hoverPaintStyle:params.connectorHoverStyle,
                        connector : params.connector, // this can also be null. Connection will use the default.
                        overlays : params.connectorOverlays,
                        type:self.connectionType,
                        cssClass:self.connectorClass,
                        hoverClass:self.connectorHoverClass
                    });
                    // fire an event that informs that a connection is being dragged						
                    _jsPlumb.fire("connectionDrag", jpc);

                } else {
                    existingJpc = true;
                    jpc.setHover(false);						
                    // if existing connection, allow to be dropped back on the source endpoint (issue 51).
                    _initDropTarget(ipcoel, false, true);
                    // new anchor idx
                    var anchorIdx = jpc.endpoints[0].id == self.id ? 0 : 1;
                    jpc.floatingAnchorIndex = anchorIdx;					// save our anchor index as the connection's floating index.						
                    self.detachFromConnection(jpc);							// detach from the connection while dragging is occurring.
                    
                    // store the original scope (issue 57)
                    var dragScope = jsPlumb.CurrentLibrary.getDragScope(canvasElement);
                    jpcl.setAttribute(canvasElement, "originalScope", dragScope);
                    // now we want to get this endpoint's DROP scope, and set it for now: we can only be dropped on drop zones
                    // that have our drop scope (issue 57).
                    var dropScope = jpcl.getDropScope(canvasElement);
                    jpcl.setDragScope(canvasElement, dropScope);
            
                    // now we replace ourselves with the temporary div we created above:
                    if (anchorIdx == 0) {
                        existingJpcParams = [ jpc.source, jpc.sourceId, i, dragScope ];
                        jpc.source = placeholderInfo.element;
                        jpc.sourceId = placeholderInfo.id;
                    } else {
                        existingJpcParams = [ jpc.target, jpc.targetId, i, dragScope ];
                        jpc.target = placeholderInfo.element;
                        jpc.targetId = placeholderInfo.id;
                    }

                    // lock the other endpoint; if it is dynamic it will not move while the drag is occurring.
                    jpc.endpoints[anchorIdx == 0 ? 1 : 0].anchor.locked = true;
                    // store the original endpoint and assign the new floating endpoint for the drag.
                    jpc.suspendedEndpoint = jpc.endpoints[anchorIdx];
                    jpc.suspendedEndpoint.setHover(false);
                    floatingEndpoint.referenceEndpoint = jpc.suspendedEndpoint;
                    jpc.endpoints[anchorIdx] = floatingEndpoint;

                    // fire an event that informs that a connection is being dragged
                    _jsPlumb.fire("connectionDrag", jpc);

                }
                // register it and register connection on it.
                floatingConnections[placeholderInfo.id] = jpc;
                _jsPlumb.anchorManager.addFloatingConnection(placeholderInfo.id, jpc);
                floatingEndpoint.addConnection(jpc);
                // only register for the target endpoint; we will not be dragging the source at any time
                // before this connection is either discarded or made into a permanent connection.
                _ju.addToList(params.endpointsByElement, placeholderInfo.id, floatingEndpoint);
                // tell jsplumb about it
                _jsPlumb.currentlyDragging = true;
            };

            var dragOptions = params.dragOptions || {},
                defaultOpts = jsPlumb.extend( {}, jpcl.defaultDragOptions),
                startEvent = jpcl.dragEvents["start"],
                stopEvent = jpcl.dragEvents["stop"],
                dragEvent = jpcl.dragEvents["drag"];
            
            dragOptions = jsPlumb.extend(defaultOpts, dragOptions);
            dragOptions.scope = dragOptions.scope || self.scope;
            dragOptions[startEvent] = _jsPlumb.wrap(dragOptions[startEvent], start);
            // extracted drag handler function so can be used by makeSource
            dragOptions[dragEvent] = _jsPlumb.wrap(dragOptions[dragEvent], _dragHandler.drag);
            dragOptions[stopEvent] = _jsPlumb.wrap(dragOptions[stopEvent],
                function() {
                    var originalEvent = jpcl.getDropEvent(arguments);					
                    _ju.removeWithFunction(params.endpointsByElement[placeholderInfo.id], function(e) {
                        return e.id == floatingEndpoint.id;
                    });
                    _ju.removeElement(inPlaceCopy.canvas, _element);
                    _jsPlumb.anchorManager.clearFor(placeholderInfo.id);						
                    var idx = jpc.floatingAnchorIndex == null ? 1 : jpc.floatingAnchorIndex;
                    jpc.endpoints[idx == 0 ? 1 : 0].anchor.locked = false;
                
                // commented out pending decision on drag proxy stuff.
                //	self.setPaintStyle(originalPaintStyle); // reset to original; may have been changed by drag proxy.
                
                    if (jpc.endpoints[idx] == floatingEndpoint) {
                        // if the connection was an existing one:
                        if (existingJpc && jpc.suspendedEndpoint) {
                            // fix for issue35, thanks Sylvain Gizard: when firing the detach event make sure the
                            // floating endpoint has been replaced.
                            if (idx == 0) {
                                jpc.source = existingJpcParams[0];
                                jpc.sourceId = existingJpcParams[1];
                            } else {
                                jpc.target = existingJpcParams[0];
                                jpc.targetId = existingJpcParams[1];
                            }
                            
                            // restore the original scope (issue 57)
                            jpcl.setDragScope(existingJpcParams[2], existingJpcParams[3]);
                            jpc.endpoints[idx] = jpc.suspendedEndpoint;
                            if (jpc.isReattach() || jpc._forceReattach || jpc._forceDetach || !jpc.endpoints[idx == 0 ? 1 : 0].detach(jpc, false, false, true, originalEvent)) {									
                                jpc.setHover(false);
                                jpc.floatingAnchorIndex = null;
                                jpc.suspendedEndpoint.addConnection(jpc);
                                _jsPlumb.repaint(existingJpcParams[1]);
                            }
                            jpc._forceDetach = null;
                            jpc._forceReattach = null;
                        } else {
                            // TODO this looks suspiciously kind of like an Endpoint.detach call too.
                            // i wonder if this one should post an event though.  maybe this is good like this.
                            _ju.removeElements(jpc.connector.getDisplayElements(), self.parent);
                            self.detachFromConnection(jpc);								
                        }																
                    }
                    
                    // remove floating endpoint _after_ checking beforeDetach 
                    _ju.removeElements( [ placeholderInfo.element[0], floatingEndpoint.canvas ], _element); // TODO: clean up the connection canvas (if the user aborted)
                    self.canvas.style.visibility = "visible";
                    
                    self.anchor.locked = false;												
                    self.paint({recalc:false});

                    _jsPlumb.fire("connectionDragStop", jpc);

                    jpc = null;						
                    inPlaceCopy = null;							
                    delete params.endpointsByElement[floatingEndpoint.elementId];
                    floatingEndpoint.anchor = null;
                    floatingEndpoint = null;
                    _jsPlumb.currentlyDragging = false;

                });
            
            var i = _gel(self.canvas);				
            jpcl.initDraggable(i, dragOptions, true);
        }

        // pulled this out into a function so we can reuse it for the inPlaceCopy canvas; you can now drop detached connections
        // back onto the endpoint you detached it from.
        var _initDropTarget = function(canvas, forceInit, isTransient, endpoint) {
            if ((params.isTarget || forceInit) && jpcl.isDropSupported(_element)) {
                var dropOptions = params.dropOptions || _jsPlumb.Defaults.DropOptions || jsPlumb.Defaults.DropOptions;
                dropOptions = jsPlumb.extend( {}, dropOptions);
                dropOptions.scope = dropOptions.scope || self.scope;
                var dropEvent = jpcl.dragEvents['drop'],
                    overEvent = jpcl.dragEvents['over'],
                    outEvent = jpcl.dragEvents['out'],
                    drop = function() {
                                                    
                        var originalEvent = jpcl.getDropEvent(arguments),
                            draggable = _gel(jpcl.getDragObject(arguments)),
                            id = _att(draggable, "dragId"),
                            elId = _att(draggable, "elId"),						
                            scope = _att(draggable, "originalScope"),
                            jpc = floatingConnections[id];
                            
                        // if this is a drop back where the connection came from, mark it force rettach and
                        // return; the stop handler will reattach. without firing an event.
                        var redrop = jpc.suspendedEndpoint && (jpc.suspendedEndpoint.id == self.id ||
                                        self.referenceEndpoint && jpc.suspendedEndpoint.id == self.referenceEndpoint.id) ;							
                        if (redrop) {								
                            jpc._forceReattach = true;
                            return;
                        }

                        if (jpc != null) {
                            var idx = jpc.floatingAnchorIndex == null ? 1 : jpc.floatingAnchorIndex, oidx = idx == 0 ? 1 : 0;
                            
                            // restore the original scope if necessary (issue 57)						
                            if (scope) jsPlumb.CurrentLibrary.setDragScope(draggable, scope);							
                            
                            var endpointEnabled = endpoint != null ? endpoint.isEnabled() : true;
                            
                            if (self.isFull()) {
                                self.fire("maxConnections", { 
                                    endpoint:self, 
                                    connection:jpc, 
                                    maxConnections:_maxConnections 
                                }, originalEvent);
                            }
                                                            
                            if (!self.isFull() && !(idx == 0 && !self.isSource) && !(idx == 1 && !self.isTarget) && endpointEnabled) {
                                var _doContinue = true;

                                // the second check here is for the case that the user is dropping it back
                                // where it came from.
                                if (jpc.suspendedEndpoint && jpc.suspendedEndpoint.id != self.id) {
                                    if (idx == 0) {
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
                                if (idx == 0) {
                                    jpc.source = self.element;
                                    jpc.sourceId = self.elementId;
                                } else {
                                    jpc.target = self.element;
                                    jpc.targetId = self.elementId;
                                }
                                                            
// ------------ wrap the execution path in a function so we can support asynchronous beforeDrop																
                                    
                                // we want to execute this regardless.
                                var commonFunction = function() {
                                    jpc.floatingAnchorIndex = null;
                                };	
                                                                                                
                                var continueFunction = function() {
                                    // remove this jpc from the current endpoint
                                    jpc.endpoints[idx].detachFromConnection(jpc);
                                    if (jpc.suspendedEndpoint) jpc.suspendedEndpoint.detachFromConnection(jpc);
                                    jpc.endpoints[idx] = self;
                                    self.addConnection(jpc);
                                    
                                    // copy our parameters in to the connection:
                                    var params = self.getParameters();
                                    for (var aParam in params)
                                        jpc.setParameter(aParam, params[aParam]);

                                    if (!jpc.suspendedEndpoint) {  
                                        if (params.draggable)
                                            jsPlumb.CurrentLibrary.initDraggable(self.element, dragOptions, true);
                                    }
                                    else {
                                        var suspendedElement = jpc.suspendedEndpoint.getElement(), suspendedElementId = jpc.suspendedEndpoint.elementId;
                                        // fire a detach event
                                        _fireDetachEvent({
                                            source : idx == 0 ? suspendedElement : jpc.source, 
                                            target : idx == 1 ? suspendedElement : jpc.target,
                                            sourceId : idx == 0 ? suspendedElementId : jpc.sourceId, 
                                            targetId : idx == 1 ? suspendedElementId : jpc.targetId,
                                            sourceEndpoint : idx == 0 ? jpc.suspendedEndpoint : jpc.endpoints[0], 
                                            targetEndpoint : idx == 1 ? jpc.suspendedEndpoint : jpc.endpoints[1],
                                            connection : jpc
                                        }, true, originalEvent);
                                    }

                                    // finalise will inform the anchor manager and also add to
                                    // connectionsByScope if necessary.
                                    _finaliseConnection(jpc, null, originalEvent);
                                    
                                    commonFunction();
                                };
                                
                                var dontContinueFunction = function() {
                                    // otherwise just put it back on the endpoint it was on before the drag.
                                    if (jpc.suspendedEndpoint) {									
                                        jpc.endpoints[idx] = jpc.suspendedEndpoint;
                                        jpc.setHover(false);
                                        jpc._forceDetach = true;
                                        if (idx == 0) {
                                            jpc.source = jpc.suspendedEndpoint.element;
                                            jpc.sourceId = jpc.suspendedEndpoint.elementId;
                                        } else {
                                            jpc.target = jpc.suspendedEndpoint.element;
                                            jpc.targetId = jpc.suspendedEndpoint.elementId;;
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
                                _doContinue = _doContinue && self.isDropAllowed(jpc.sourceId, jpc.targetId, jpc.scope, jpc, self);
                                                                                                                    
                                if (_doContinue) {
                                    continueFunction();
                                }
                                else {
                                    dontContinueFunction();
                                }

                                //commonFunction();
                            }
                            _jsPlumb.currentlyDragging = false;
                            delete floatingConnections[id];		
                            _jsPlumb.anchorManager.removeFloatingConnection(id);
                        }
                    };
                
                dropOptions[dropEvent] = _jsPlumb.wrap(dropOptions[dropEvent], drop);
                dropOptions[overEvent] = _jsPlumb.wrap(dropOptions[overEvent], function() {					
                    var draggable = jpcl.getDragObject(arguments),
                        id = _att( _gel(draggable), "dragId"),
                        _jpc = floatingConnections[id];
                        
                    if (_jpc != null) {								
                        var idx = _jpc.floatingAnchorIndex == null ? 1 : _jpc.floatingAnchorIndex;
                        // here we should fire the 'over' event if we are a target and this is a new connection,
                        // or we are the same as the floating endpoint.								
                        var _cont = (self.isTarget && _jpc.floatingAnchorIndex != 0) || (_jpc.suspendedEndpoint && self.referenceEndpoint && self.referenceEndpoint.id == _jpc.suspendedEndpoint.id);
                        if (_cont)
                            _jpc.endpoints[idx].anchor.over(self.anchor);
                    }						
                });	
                dropOptions[outEvent] = _jsPlumb.wrap(dropOptions[outEvent], function() {					
                    var draggable = jpcl.getDragObject(arguments),
                        id = _att( _gel(draggable), "dragId"),
                        _jpc = floatingConnections[id];
                        
                    if (_jpc != null) {
                        var idx = _jpc.floatingAnchorIndex == null ? 1 : _jpc.floatingAnchorIndex;
                        var _cont = (self.isTarget && _jpc.floatingAnchorIndex != 0) || (_jpc.suspendedEndpoint && self.referenceEndpoint && self.referenceEndpoint.id == _jpc.suspendedEndpoint.id);
                        if (_cont)
                            _jpc.endpoints[idx].anchor.out();
                    }
                });
                jpcl.initDroppable(canvas, dropOptions, true, isTransient);
            }
        };
        
        // initialise the endpoint's canvas as a drop target.  this will be ignored if the endpoint is not a target or drag is not supported.
        _initDropTarget(_gel(self.canvas), true, !(params._transient || self.anchor.isFloating), self);
        
         // finally, set type if it was provided
         if (params.type)
            self.addType(params.type, params.data, _jsPlumb.isSuspendDrawing());

        return self;        					
    };	
})();