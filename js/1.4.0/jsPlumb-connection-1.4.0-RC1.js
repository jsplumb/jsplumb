;(function() {
    
    jsPlumb.Connection = function(params) {
        var self = this, visible = true, _internalHover, _superClassHover,
            _jsPlumb = params["_jsPlumb"],
            jpcl = jsPlumb.CurrentLibrary,
            _att = jpcl.getAttribute,
            _gel = jpcl.getElementObject,
            _ju = jsPlumbUtil,
            _getOffset = jpcl.getOffset,
            _newConnection = params.newConnection,
            _newEndpoint = params.newEndpoint;
        
        self.idPrefix = "_jsplumb_c_";
        self.defaultLabelLocation = 0.5;
        self.defaultOverlayKeys = ["Overlays", "ConnectionOverlays"];
        this.parent = params.parent;
        overlayCapableJsPlumbUIComponent.apply(this, arguments);
        // ************** get the source and target and register the connection. *******************
        
// VISIBILITY						
        
        this.isVisible = function() { return visible; };
        
        this.setVisible = function(v) {
            visible = v;
            self[v ? "showOverlays" : "hideOverlays"]();
            if (self.connector && self.connector.canvas) self.connector.canvas.style.display = v ? "block" : "none";
            self.repaint();
        };
// END VISIBILITY	
                    
// EDITABLE
        
        var editable = params.editable === true;        
        this.setEditable = function(e) {
            if (this.connector && this.connector.isEditable())
                editable = e;
            
            return editable;
        };        
        this.isEditable = function() { return editable; };
       
// END EDITABLE            
        
// ADD CLASS/REMOVE CLASS - override to support adding/removing to/from endpoints
        var _ac = this.addClass, _rc = this.removeClass;
        this.addClass = function(c, informEndpoints) {
            _ac(c);
            if (informEndpoints) {
                self.endpoints[0].addClass(c);
                self.endpoints[1].addClass(c);                    
            }
        };
        this.removeClass = function(c, informEndpoints) {
            _rc(c);
            if (informEndpoints) {
                self.endpoints[0].removeClass(c);
                self.endpoints[1].removeClass(c);                    
            }
        };            
        
// TYPE		
        
        this.getTypeDescriptor = function() { return "connection"; };
        this.getDefaultType = function() {
            return {
                parameters:{},
                scope:null,
                detachable:self._jsPlumb.Defaults.ConnectionsDetachable,
                rettach:self._jsPlumb.Defaults.ReattachConnections,
                paintStyle:self._jsPlumb.Defaults.PaintStyle || jsPlumb.Defaults.PaintStyle,
                connector:self._jsPlumb.Defaults.Connector || jsPlumb.Defaults.Connector,
                hoverPaintStyle:self._jsPlumb.Defaults.HoverPaintStyle || jsPlumb.Defaults.HoverPaintStyle,				
                overlays:self._jsPlumb.Defaults.ConnectorOverlays || jsPlumb.Defaults.ConnectorOverlays
            };
        };
        var superAt = this.applyType;
        this.applyType = function(t, doNotRepaint) {
            superAt(t, doNotRepaint);
            if (t.detachable != null) self.setDetachable(t.detachable);
            if (t.reattach != null) self.setReattach(t.reattach);
            if (t.scope) self.scope = t.scope;
            editable = t.editable;
            self.setConnector(t.connector, doNotRepaint);
        };			
// END TYPE

// HOVER			
        // override setHover to pass it down to the underlying connector
        _superClassHover = self.setHover;
        self.setHover = function(state) {
            self.connector.setHover.apply(self.connector, arguments);				
            _superClassHover.apply(self, arguments);
        };
        
        _internalHover = function(state) {
            if (!_jsPlumb.isConnectionBeingDragged()) {
                self.setHover(state, false);
            }
        };
// END HOVER

        var makeConnector = function(renderMode, connector, connectorArgs) {
            var c = new Object();
            jsPlumb.Connectors[connector].apply(c, [connectorArgs]);
            jsPlumb.ConnectorRenderers[renderMode].apply(c, [connectorArgs]);	
            return c;
        };                        
                
        this.setConnector = function(connector, doNotRepaint) {
            if (self.connector != null) jsPlumbUtil.removeElements(self.connector.getDisplayElements(), self.parent);
            var connectorArgs = { 
                _jsPlumb:self._jsPlumb, 
                parent:params.parent, 
                cssClass:params.cssClass, 
                container:params.container, 
                tooltip:self.tooltip,
                "pointer-events":params["pointer-events"]
            },
            renderMode = _jsPlumb.getRenderMode();
            
            if (_ju.isString(connector)) 
                this.connector = makeConnector(renderMode, connector, connectorArgs); // lets you use a string as shorthand.
            else if (_ju.isArray(connector)) {
                if (connector.length == 1)
                    this.connector = makeConnector(renderMode, connector[0], connectorArgs);
                else
                    this.connector = makeConnector(renderMode, connector[0], jsPlumbUtil.merge(connector[1], connectorArgs));
            }
            self.canvas = self.connector.canvas;                
            // binds mouse listeners to the current connector.
            self.bindListeners(self.connector, self, _internalHover);
            
            if (editable && jsPlumb.ConnectorEditors != null && jsPlumb.ConnectorEditors[self.connector.type] && self.connector.isEditable()) {
                new jsPlumb.ConnectorEditors[self.connector.type]({
                    connector:self.connector,
                    connection:self,
                    params:params.editorParams || { }
                });
            }
            else {                    
                editable = false;
            }                
                
            if (!doNotRepaint) self.repaint();
        };
        
// INITIALISATION CODE			
                    
        this.source = _gel(params.source);
        this.target = _gel(params.target);
        // sourceEndpoint and targetEndpoint override source/target, if they are present. but 
        // source is not overridden if the Endpoint has declared it is not the final target of a connection;
        // instead we use the source that the Endpoint declares will be the final source element.
        if (params.sourceEndpoint) this.source = params.sourceEndpoint.endpointWillMoveTo || params.sourceEndpoint.getElement();			
        if (params.targetEndpoint) this.target = params.targetEndpoint.getElement();
        
        // if a new connection is the result of moving some existing connection, params.previousConnection
        // will have that Connection in it. listeners for the jsPlumbConnection event can look for that
        // member and take action if they need to.
        self.previousConnection = params.previousConnection;
                    
        this.sourceId = _att(this.source, "id");
        this.targetId = _att(this.target, "id");
        this.scope = params.scope; // scope may have been passed in to the connect call. if it wasn't, we will pull it from the source endpoint, after having initialised the endpoints.			
        this.endpoints = [];
        this.endpointStyles = [];
        // wrapped the main function to return null if no input given. this lets us cascade defaults properly.
        var _makeAnchor = function(anchorParams, elementId) {
            return (anchorParams) ? _jsPlumb.makeAnchor(anchorParams, elementId, _jsPlumb) : null;
        },
        prepareEndpoint = function(existing, index, params, element, elementId, connectorPaintStyle, connectorHoverPaintStyle) {
            var e;
            if (existing) {
                self.endpoints[index] = existing;
                existing.addConnection(self);					
            } else {
                if (!params.endpoints) params.endpoints = [ null, null ];
                var ep = params.endpoints[index] 
                        || params.endpoint
                        || _jsPlumb.Defaults.Endpoints[index]
                        || jsPlumb.Defaults.Endpoints[index]
                        || _jsPlumb.Defaults.Endpoint
                        || jsPlumb.Defaults.Endpoint;

                if (!params.endpointStyles) params.endpointStyles = [ null, null ];
                if (!params.endpointHoverStyles) params.endpointHoverStyles = [ null, null ];
                var es = params.endpointStyles[index] || params.endpointStyle || _jsPlumb.Defaults.EndpointStyles[index] || jsPlumb.Defaults.EndpointStyles[index] || _jsPlumb.Defaults.EndpointStyle || jsPlumb.Defaults.EndpointStyle;
                // Endpoints derive their fillStyle from the connector's strokeStyle, if no fillStyle was specified.
                if (es.fillStyle == null && connectorPaintStyle != null)
                    es.fillStyle = connectorPaintStyle.strokeStyle;
                
                // TODO: decide if the endpoint should derive the connection's outline width and color.  currently it does:
                //*
                if (es.outlineColor == null && connectorPaintStyle != null) 
                    es.outlineColor = connectorPaintStyle.outlineColor;
                if (es.outlineWidth == null && connectorPaintStyle != null) 
                    es.outlineWidth = connectorPaintStyle.outlineWidth;
                //*/
                
                var ehs = params.endpointHoverStyles[index] || params.endpointHoverStyle || _jsPlumb.Defaults.EndpointHoverStyles[index] || jsPlumb.Defaults.EndpointHoverStyles[index] || _jsPlumb.Defaults.EndpointHoverStyle || jsPlumb.Defaults.EndpointHoverStyle;
                // endpoint hover fill style is derived from connector's hover stroke style.  TODO: do we want to do this by default? for sure?
                if (connectorHoverPaintStyle != null) {
                    if (ehs == null) ehs = {};
                    if (ehs.fillStyle == null) {
                        ehs.fillStyle = connectorHoverPaintStyle.strokeStyle;
                    }
                }
                var a = params.anchors ? params.anchors[index] : 
                    params.anchor ? params.anchor :
                    _makeAnchor(_jsPlumb.Defaults.Anchors[index], elementId) || 
                    _makeAnchor(jsPlumb.Defaults.Anchors[index], elementId) || 
                    _makeAnchor(_jsPlumb.Defaults.Anchor, elementId) || 
                    _makeAnchor(jsPlumb.Defaults.Anchor, elementId),					
                u = params.uuids ? params.uuids[index] : null;
                e = _newEndpoint({ 
                    paintStyle : es,  hoverPaintStyle:ehs,  endpoint : ep,  connections : [ self ], 
                    uuid : u,  anchor : a,  source : element, scope  : params.scope, container:params.container,
                    reattach:params.reattach || _jsPlumb.Defaults.ReattachConnections,
                    detachable:params.detachable || _jsPlumb.Defaults.ConnectionsDetachable
                });
                self.endpoints[index] = e;
                
                if (params.drawEndpoints === false) e.setVisible(false, true, true);
                                    
            }
            return e;
        };					

        var eS = prepareEndpoint(params.sourceEndpoint, 0, params, self.source,
                                 self.sourceId, params.paintStyle, params.hoverPaintStyle);			
        if (eS) _ju.addToList(params.endpointsByElement, this.sourceId, eS);						
        var eT = prepareEndpoint(params.targetEndpoint, 1, params, self.target, 
                                 self.targetId, params.paintStyle, params.hoverPaintStyle);
        if (eT) _ju.addToList(params.endpointsByElement, this.targetId, eT);
        // if scope not set, set it to be the scope for the source endpoint.
        if (!this.scope) this.scope = this.endpoints[0].scope;		
        
        // if delete endpoints on detach, keep a record of just exactly which endpoints they are.
        self.endpointsToDeleteOnDetach = [null, null];
        if (params.deleteEndpointsOnDetach) {
            if (params.sourceIsNew) self.endpointsToDeleteOnDetach[0] = self.endpoints[0];
            if (params.targetIsNew) self.endpointsToDeleteOnDetach[1] = self.endpoints[1];
        }
        // or if the endpoints were supplied, use them.
        if (params.endpointsToDeleteOnDetach)
            self.endpointsToDeleteOnDetach = params.endpointsToDeleteOnDetach;
                    
        // TODO these could surely be refactored into some method that tries them one at a time until something exists
        self.setConnector(this.endpoints[0].connector || 
                          this.endpoints[1].connector || 
                          params.connector || 
                          _jsPlumb.Defaults.Connector || 
                          jsPlumb.Defaults.Connector, true);							  							  		
        
        this.setPaintStyle(this.endpoints[0].connectorStyle || 
                           this.endpoints[1].connectorStyle || 
                           params.paintStyle || 
                           _jsPlumb.Defaults.PaintStyle || 
                           jsPlumb.Defaults.PaintStyle, true);
                    
        this.setHoverPaintStyle(this.endpoints[0].connectorHoverStyle || 
                                this.endpoints[1].connectorHoverStyle || 
                                params.hoverPaintStyle || 
                                _jsPlumb.Defaults.HoverPaintStyle || 
                                jsPlumb.Defaults.HoverPaintStyle, true);
        
        this.paintStyleInUse = this.getPaintStyle();
        
        var _suspendedAt = _jsPlumb.getSuspendedAt();
        _jsPlumb.updateOffset( { elId : this.sourceId, timestamp:_suspendedAt });
        _jsPlumb.updateOffset( { elId : this.targetId, timestamp:_suspendedAt });
        
        // paint the endpoints
        var myInfo = _jsPlumb.getCachedData(this.sourceId),
            myOffset = myInfo.o, myWH = myInfo.s,
            otherInfo = _jsPlumb.getCachedData(this.targetId),
            otherOffset = otherInfo.o,
            otherWH = otherInfo.s,
            initialTimestamp = _suspendedAt || _jsPlumb.timestamp(),
            anchorLoc = this.endpoints[0].anchor.compute( {
                xy : [ myOffset.left, myOffset.top ], wh : myWH, element : this.endpoints[0],
                elementId:this.endpoints[0].elementId,
                txy : [ otherOffset.left, otherOffset.top ], twh : otherWH, tElement : this.endpoints[1],
                timestamp:initialTimestamp
            });

        this.endpoints[0].paint( { anchorLoc : anchorLoc, timestamp:initialTimestamp });

        anchorLoc = this.endpoints[1].anchor.compute( {
            xy : [ otherOffset.left, otherOffset.top ], wh : otherWH, element : this.endpoints[1],
            elementId:this.endpoints[1].elementId,				
            txy : [ myOffset.left, myOffset.top ], twh : myWH, tElement : this.endpoints[0],
            timestamp:initialTimestamp				
        });
        this.endpoints[1].paint({ anchorLoc : anchorLoc, timestamp:initialTimestamp });
                                
// END INITIALISATION CODE			
        
// DETACHABLE 				
        var _detachable = _jsPlumb.Defaults.ConnectionsDetachable;
        if (params.detachable === false) _detachable = false;
        if(self.endpoints[0].connectionsDetachable === false) _detachable = false;
        if(self.endpoints[1].connectionsDetachable === false) _detachable = false;        
        this.isDetachable = function() {
            return _detachable === true;
        };        
        this.setDetachable = function(detachable) {
          _detachable = detachable === true;
        };
// END DETACHABLE

// REATTACH
        var _reattach = params.reattach ||
            self.endpoints[0].reattachConnections ||
            self.endpoints[1].reattachConnections ||
            _jsPlumb.Defaults.ReattachConnections;        
        this.isReattach = function() {
            return _reattach === true;
        };        
        this.setReattach = function(reattach) {
          _reattach = reattach === true;
        };

// END REATTACH
        
// COST + DIRECTIONALITY
        // if cost not supplied, try to inherit from source endpoint
        var _cost = params.cost || self.endpoints[0].getConnectionCost();			
        self.getCost = function() { return _cost; };
        self.setCost = function(c) { _cost = c; };			
        var directed = params.directed;
        // inherit directed flag if set no source endpoint
        if (params.directed == null) directed = self.endpoints[0].areConnectionsDirected();
        self.isDirected = function() { return directed === true; };
// END COST + DIRECTIONALITY
                    
// PARAMETERS						
        // merge all the parameters objects into the connection.  parameters set
        // on the connection take precedence; then target endpoint params, then
        // finally source endpoint params.
        // TODO jsPlumb.extend could be made to take more than two args, and it would
        // apply the second through nth args in order.
        var _p = jsPlumb.extend({}, this.endpoints[0].getParameters());
        jsPlumb.extend(_p, this.endpoints[1].getParameters());
        jsPlumb.extend(_p, self.getParameters());
        self.setParameters(_p);
// END PARAMETERS
                    
// MISCELLANEOUS	
        
        this.getAttachedElements = function() {
            return self.endpoints;
        };
        
        //
        // changes the parent element of this connection to newParent.  not exposed for the public API.
        //
        this.moveParent = function(newParent) {
            var jpcl = jsPlumb.CurrentLibrary, curParent = jpcl.getParent(self.connector.canvas);				
            if (self.connector.bgCanvas) {
                jpcl.removeElement(self.connector.bgCanvas, curParent);
                jpcl.appendElement(self.connector.bgCanvas, newParent);
            }
            jpcl.removeElement(self.connector.canvas, curParent);
            jpcl.appendElement(self.connector.canvas, newParent);                
            // this only applies for DOMOverlays
            for (var i = 0; i < self.overlays.length; i++) {
                if (self.overlays[i].isAppendedAtTopLevel) {
                    jpcl.removeElement(self.overlays[i].canvas, curParent);
                    jpcl.appendElement(self.overlays[i].canvas, newParent);
                    if (self.overlays[i].reattachListeners) 
                        self.overlays[i].reattachListeners(self.connector);
                }
            }
            if (self.connector.reattachListeners)		// this is for SVG/VML; change an element's parent and you have to reinit its listeners.
                self.connector.reattachListeners();     // the Canvas implementation doesn't have to care about this
        };
        
// END MISCELLANEOUS

// PAINTING
            
        /*
         * Paints the Connection.  Not exposed for public usage. 
         * 
         * Parameters:
         * 	elId - Id of the element that is in motion.
         * 	ui - current library's event system ui object (present if we came from a drag to get here).
         *  recalc - whether or not to recalculate all anchors etc before painting. 
         *  timestamp - timestamp of this paint.  If the Connection was last painted with the same timestamp, it does not paint again.
         */
        var lastPaintedAt = null;			
        this.paint = function(params) {
            
            if (visible) {
                    
                params = params || {};
                var elId = params.elId, ui = params.ui, recalc = params.recalc, timestamp = params.timestamp,
                    // if the moving object is not the source we must transpose the two references.
                    swap = false,
                    tId = swap ? this.sourceId : this.targetId, sId = swap ? this.targetId : this.sourceId,
                    tIdx = swap ? 0 : 1, sIdx = swap ? 1 : 0;

                if (timestamp == null || timestamp != lastPaintedAt) {                        
                    var sourceInfo = _jsPlumb.updateOffset( { elId : elId, offset : ui, recalc : recalc, timestamp : timestamp }).o,
                        targetInfo = _jsPlumb.updateOffset( { elId : tId, timestamp : timestamp }).o; // update the target if this is a forced repaint. otherwise, only the source has been moved.
                    
                    var sE = this.endpoints[sIdx], tE = this.endpoints[tIdx];
                    if (params.clearEdits) {
                        sE.anchor.clearUserDefinedLocation();
                        tE.anchor.clearUserDefinedLocation();
                        self.connector.setEdited(false);
                    }
                    
                    var sAnchorP = sE.anchor.getCurrentLocation(sE),				
                        tAnchorP = tE.anchor.getCurrentLocation(tE);
                                
                    // find largest overlay; we use it to ensure sufficient padding in the connector canvas.
                    var maxSize = 0;
                    for ( var i = 0; i < self.overlays.length; i++) {
                        var o = self.overlays[i];
                        if (o.isVisible()) maxSize = Math.max(maxSize, o.computeMaxSize());
                    }						
                        
                    self.connector.compute({
                        sourcePos:sAnchorP,
                        targetPos:tAnchorP, 
                        sourceEndpoint:this.endpoints[sIdx],
                        targetEndpoint:this.endpoints[tIdx],
                        sourceAnchor:this.endpoints[sIdx].anchor,
                        targetAnchor:this.endpoints[tIdx].anchor, 
                        lineWidth:self.paintStyleInUse.lineWidth,
                        minWidth:maxSize,							
                        sourceInfo:sourceInfo,
                        targetInfo:targetInfo,
                        clearEdits:params.clearEdits === true
                    });
                    
                    self.connector.paint(self.paintStyleInUse);
                                                                    
                    // paint overlays
                    for ( var i = 0; i < self.overlays.length; i++) {
                        var o = self.overlays[i];
                        if (o.isVisible) {
                            self.overlayPlacements[i] = o.draw(self.connector, self.paintStyleInUse);								
                        }
                    }
                                                                
                }
                lastPaintedAt = timestamp;						
            }		
        };			

        /*
         * Function: repaint
         * Repaints the Connection. No parameters exposed to public API.
         */
        this.repaint = function(params) {
            params = params || {};
            var recalc = !(params.recalc === false);
            this.paint({ elId : this.sourceId, recalc : recalc, timestamp:params.timestamp, clearEdits:params.clearEdits });
        };
        
        // the very last thing we do is check to see if a 'type' was supplied in the params
        var _type = params.type || self.endpoints[0].connectionType || self.endpoints[1].connectionType;
        if (_type)
            self.addType(_type, params.data, _jsPlumb.isSuspendDrawing());
        
// END PAINTING    
    }; // END Connection class            
})();