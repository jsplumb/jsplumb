;(function() {

    var makeConnector = function(_jsPlumb, renderMode, connectorName, connectorArgs) {
    //        var c = function() { };
            if (!_jsPlumb.Defaults.DoNotThrowErrors && jsPlumb.Connectors[renderMode][connectorName] == null)
                    throw { msg:"jsPlumb: unknown connector type '" + connectorName + "'" };

            /*jsPlumb.Connectors[connectorName].apply(c, [connectorArgs]);
            jsPlumb.ConnectorRenderers[renderMode].apply(c, [connectorArgs]);  
            jsPlumbUtil.extend(c, [jsPlumb.Connectors[connectorName], jsPlumb.ConnectorRenderers[renderMode]]) ;*/

            return new jsPlumb.Connectors[renderMode][connectorName](connectorArgs);  
        },
        _makeAnchor = function(anchorParams, elementId, _jsPlumb) {
            return (anchorParams) ? _jsPlumb.makeAnchor(anchorParams, elementId, _jsPlumb) : null;
        };
    
    jsPlumb.Connection = function(params) {
        var _newConnection = params.newConnection,
            _newEndpoint = params.newEndpoint,

            jpcl = jsPlumb.CurrentLibrary,
            _att = jpcl.getAttribute,
            _gel = jpcl.getElementObject,
            _ju = jsPlumbUtil,
            _getOffset = jpcl.getOffset;

        this.connector = null;                        
        this.idPrefix = "_jsplumb_c_";
        this.defaultLabelLocation = 0.5;
        this.defaultOverlayKeys = ["Overlays", "ConnectionOverlays"];
        this.parent = params.parent;
        // if a new connection is the result of moving some existing connection, params.previousConnection
        // will have that Connection in it. listeners for the jsPlumbConnection event can look for that
        // member and take action if they need to.
        this.previousConnection = params.previousConnection;
        this.source = _gel(params.source);
        this.target = _gel(params.target);
        // sourceEndpoint and targetEndpoint override source/target, if they are present. but 
        // source is not overridden if the Endpoint has declared it is not the final target of a connection;
        // instead we use the source that the Endpoint declares will be the final source element.
        if (params.sourceEndpoint) this.source = params.sourceEndpoint.endpointWillMoveTo || params.sourceEndpoint.getElement();            
        if (params.targetEndpoint) this.target = params.targetEndpoint.getElement();        

        this.sourceId = _att(this.source, "id");
        this.targetId = _att(this.target, "id");
        this.scope = params.scope; // scope may have been passed in to the connect call. if it wasn't, we will pull it from the source endpoint, after having initialised the endpoints.            
        this.endpoints = [];
        this.endpointStyles = [];

        OverlayCapableJsPlumbUIComponent.apply(this, arguments);    
        var _jsPlumb = this._jsPlumb.instance;    
        this._jsPlumb.visible = true;
        this._jsPlumb.editable = params.editable === true;    
        this._jsPlumb.params = params;          
        this._jsPlumb.lastPaintedAt = null;              
        this.getDefaultType = function() {
            return {
                parameters:{},
                scope:null,
                detachable:this._jsPlumb.instance.Defaults.ConnectionsDetachable,
                rettach:this._jsPlumb.instance.Defaults.ReattachConnections,
                paintStyle:this._jsPlumb.instance.Defaults.PaintStyle || jsPlumb.Defaults.PaintStyle,
                connector:this._jsPlumb.instance.Defaults.Connector || jsPlumb.Defaults.Connector,
                hoverPaintStyle:this._jsPlumb.instance.Defaults.HoverPaintStyle || jsPlumb.Defaults.HoverPaintStyle,				
                overlays:this._jsPlumb.instance.Defaults.ConnectorOverlays || jsPlumb.Defaults.ConnectorOverlays
            };
        };
        
// INITIALISATION CODE			
                    
        
        // wrapped the main function to return null if no input given. this lets us cascade defaults properly.
        var prepareEndpoint = function(existing, index, params, element, elementId, connectorPaintStyle, connectorHoverPaintStyle) {
            var e;
            if (existing) {
                this.endpoints[index] = existing;
                existing.addConnection(this);					
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
                        _makeAnchor(_jsPlumb.Defaults.Anchors[index], elementId, _jsPlumb) || 
                        _makeAnchor(jsPlumb.Defaults.Anchors[index], elementId,_jsPlumb) || 
                        _makeAnchor(_jsPlumb.Defaults.Anchor, elementId,_jsPlumb) || 
                        _makeAnchor(jsPlumb.Defaults.Anchor, elementId, _jsPlumb),					
                    u = params.uuids ? params.uuids[index] : null;
                    e = _newEndpoint({ 
                        paintStyle : es,  hoverPaintStyle:ehs,  endpoint : ep,  connections : [ this ], 
                        uuid : u,  anchor : a,  source : element, scope  : params.scope, container:params.container,
                        reattach:params.reattach || _jsPlumb.Defaults.ReattachConnections,
                        detachable:params.detachable || _jsPlumb.Defaults.ConnectionsDetachable
                    });
                this.endpoints[index] = e;
                
                if (params.drawEndpoints === false) e.setVisible(false, true, true);
                                    
            }
            return e;
        }.bind(this);					

        var eS = prepareEndpoint(params.sourceEndpoint, 0, params, this.source, this.sourceId, params.paintStyle, params.hoverPaintStyle);			
        if (eS) _ju.addToList(params.endpointsByElement, this.sourceId, eS);						
        var eT = prepareEndpoint(params.targetEndpoint, 1, params, this.target, this.targetId, params.paintStyle, params.hoverPaintStyle);
        if (eT) _ju.addToList(params.endpointsByElement, this.targetId, eT);
        // if scope not set, set it to be the scope for the source endpoint.
        if (!this.scope) this.scope = this.endpoints[0].scope;		
        
        // if delete endpoints on detach, keep a record of just exactly which endpoints they are.
        this.endpointsToDeleteOnDetach = [null, null];
        if (params.deleteEndpointsOnDetach) {
            if (params.sourceIsNew) this.endpointsToDeleteOnDetach[0] = this.endpoints[0];
            if (params.targetIsNew) this.endpointsToDeleteOnDetach[1] = this.endpoints[1];
        }
        // or if the endpoints were supplied, use them.
        if (params.endpointsToDeleteOnDetach)
            this.endpointsToDeleteOnDetach = params.endpointsToDeleteOnDetach;
                    
        // TODO these could surely be refactored into some method that tries them one at a time until something exists
        this.setConnector(this.endpoints[0].connector || 
                          this.endpoints[1].connector || 
                          params.connector || 
                          _jsPlumb.Defaults.Connector || 
                          jsPlumb.Defaults.Connector, true);

        if (params.path)
            this.connector.setPath(params.path);
        
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
        
        this._jsPlumb.paintStyleInUse = this.getPaintStyle();
        
        var _suspendedAt = _jsPlumb.getSuspendedAt();
        _jsPlumb.updateOffset( { elId : this.sourceId, timestamp:_suspendedAt });
        _jsPlumb.updateOffset( { elId : this.targetId, timestamp:_suspendedAt });

//*
        if(!_jsPlumb.isSuspendDrawing()) {                    
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
        }
        //*/
                                
// END INITIALISATION CODE			
        
// DETACHABLE 				
        this._jsPlumb.detachable = _jsPlumb.Defaults.ConnectionsDetachable;
        if (params.detachable === false) this._jsPlumb.detachable = false;
        if(this.endpoints[0].connectionsDetachable === false) this._jsPlumb.detachable = false;
        if(this.endpoints[1].connectionsDetachable === false) this._jsPlumb.detachable = false;                
// REATTACH
        this._jsPlumb.reattach = params.reattach || this.endpoints[0].reattachConnections || this.endpoints[1].reattachConnections || _jsPlumb.Defaults.ReattachConnections;
// COST + DIRECTIONALITY
        // if cost not supplied, try to inherit from source endpoint
        this._jsPlumb.cost = params.cost || this.endpoints[0].getConnectionCost();			        
        this._jsPlumb.directed = params.directed;
        // inherit directed flag if set no source endpoint
        if (params.directed == null) this._jsPlumb.directed = this.endpoints[0].areConnectionsDirected();        
// END COST + DIRECTIONALITY
                    
// PARAMETERS						
        // merge all the parameters objects into the connection.  parameters set
        // on the connection take precedence; then target endpoint params, then
        // finally source endpoint params.
        // TODO jsPlumb.extend could be made to take more than two args, and it would
        // apply the second through nth args in order.
        var _p = jsPlumb.extend({}, this.endpoints[0].getParameters());
        jsPlumb.extend(_p, this.endpoints[1].getParameters());
        jsPlumb.extend(_p, this.getParameters());
        this.setParameters(_p);
// END PARAMETERS

// PAINTING
            
        /*
         * Paints the Connection.  Not exposed for public usage. 
         * 
         * Parameters:
         * 	elId - Id of the element that is in motion.
         * 	ui - current library's event system ui object (present if we came from a drag to get here).
         *  recalc - whether or not to recalculate all anchors etc before painting. 
         *  timestamp - timestamp of this paint.  If the Connection was last painted with the same timestamp, it does not paint again.
         *
        this.paint = function(params) {
            
            if (!_jsPlumb.isSuspendDrawing() && this._jsPlumb.visible) {
                    
                params = params || {};
                var elId = params.elId, ui = params.ui, recalc = params.recalc, timestamp = params.timestamp,
                    // if the moving object is not the source we must transpose the two references.
                    swap = false,
                    tId = swap ? this.sourceId : this.targetId, sId = swap ? this.targetId : this.sourceId,                    
                    tIdx = swap ? 0 : 1, sIdx = swap ? 1 : 0;

                if (timestamp == null || timestamp != this._jsPlumb.lastPaintedAt) {                        
                    var sourceInfo = _jsPlumb.updateOffset( { elId : sId, offset : ui, recalc : recalc, timestamp : timestamp }).o,
                        targetInfo = _jsPlumb.updateOffset( { elId : tId, timestamp : timestamp }).o, // update the target if this is a forced repaint. otherwise, only the source has been moved.
                        sE = this.endpoints[sIdx], tE = this.endpoints[tIdx];

                    if (params.clearEdits) {
                        sE.anchor.clearUserDefinedLocation();
                        tE.anchor.clearUserDefinedLocation();
                        this.connector.setEdited(false);
                    }
                    
                    var sAnchorP = sE.anchor.getCurrentLocation({xy:[sourceInfo.left,sourceInfo.top], wh:[sourceInfo.width, sourceInfo.height], element:sE, timestamp:timestamp}),				
                        tAnchorP = tE.anchor.getCurrentLocation({xy:[targetInfo.left,targetInfo.top], wh:[targetInfo.width, targetInfo.height], element:tE, timestamp:timestamp});                                                 
                        
                    this.connector.resetBounds();

                    this.connector.compute({
                        sourcePos:sAnchorP,
                        targetPos:tAnchorP, 
                        sourceEndpoint:this.endpoints[sIdx],
                        targetEndpoint:this.endpoints[tIdx],
                        lineWidth:this._jsPlumb.paintStyleInUse.lineWidth,                        					
                        sourceInfo:sourceInfo,
                        targetInfo:targetInfo,
                        clearEdits:params.clearEdits === true
                    });                                                                                        

                    var overlayExtents = {
                        minX:Infinity,
                        minY:Infinity,
                        maxX:-Infinity,
                        maxY:-Infinity
                    };                    
                    // compute overlays. we do this first so we can get their placements, and adjust the
                    // container if needs be (if an overlay would be clipped)
                    for ( var i = 0; i < this._jsPlumb.overlays.length; i++) {
                        var o = this._jsPlumb.overlays[i];
                        if (o.isVisible()) {
                            this._jsPlumb.overlayPlacements[i] = o.draw(this.connector, this._jsPlumb.paintStyleInUse);
                            overlayExtents.minX = Math.min(overlayExtents.minX, this._jsPlumb.overlayPlacements[i].minX);
                            overlayExtents.maxX = Math.max(overlayExtents.maxX, this._jsPlumb.overlayPlacements[i].maxX);
                            overlayExtents.minY = Math.min(overlayExtents.minY, this._jsPlumb.overlayPlacements[i].minY);
                            overlayExtents.maxY = Math.max(overlayExtents.maxY, this._jsPlumb.overlayPlacements[i].maxY);
                        }
                    }

                    var lineWidth = parseFloat(this._jsPlumb.paintStyleInUse.lineWidth || 1) / 2,
                        outlineWidth = parseFloat(this._jsPlumb.paintStyleInUse.lineWidth || 0),
                        extents = {
                            xmin : Math.min(this.connector.bounds.minX - (lineWidth + outlineWidth), overlayExtents.minX),
                            ymin : Math.min(this.connector.bounds.minY - (lineWidth + outlineWidth), overlayExtents.minY),
                            xmax : Math.max(this.connector.bounds.maxX + (lineWidth + outlineWidth), overlayExtents.maxX),
                            ymax : Math.max(this.connector.bounds.maxY + (lineWidth + outlineWidth), overlayExtents.maxY)
                        };

                    // paint the connector.
                    this.connector.paint(this._jsPlumb.paintStyleInUse, null, extents);  
                    // and then the overlays
                    for ( var i = 0; i < this._jsPlumb.overlays.length; i++) {
                        var o = this._jsPlumb.overlays[i];
                        if (o.isVisible()) {
                            o.paint(this._jsPlumb.overlayPlacements[i], extents);    
                        }
                    }                  
                                                            
                }
                this._jsPlumb.lastPaintedAt = timestamp;						
            }		
        };			*/

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
        var _type = params.type || this.endpoints[0].connectionType || this.endpoints[1].connectionType;
        if (_type)
            this.addType(_type, params.data, _jsPlumb.isSuspendDrawing());
        
// END PAINTING    
    };

    jsPlumbUtil.extend(jsPlumb.Connection, OverlayCapableJsPlumbUIComponent, {
        applyType : function(t, doNotRepaint) {            
            if (t.detachable != null) this.setDetachable(t.detachable);
            if (t.reattach != null) this.setReattach(t.reattach);
            if (t.scope) this.scope = t.scope;
            //editable = t.editable;  // TODO
            this.setConnector(t.connector, doNotRepaint);
        },
        getTypeDescriptor : function() { return "connection"; },
        getAttachedElements : function() {
            return this.endpoints;
        },
        addClass : function(c, informEndpoints) {        
            if (informEndpoints) {
                this.endpoints[0].addClass(c);
                this.endpoints[1].addClass(c);                    
            }
        },
        removeClass : function(c, informEndpoints) {            
            if (informEndpoints) {
                this.endpoints[0].removeClass(c);
                this.endpoints[1].removeClass(c);                    
            }
        },
        isVisible : function() { return this._jsPlumb.visible; },
        setVisible : function(v) {
            this._jsPlumb.visible = v;
            this[v ? "showOverlays" : "hideOverlays"]();
            if (this.connector && this.connector.canvas) this.connector.canvas.style.display = v ? "block" : "none";
            this.repaint();
        },
        setEditable : function(e) {
            if (this.connector && this.connector.isEditable())
                this._jsPlumb.editable = e;
            
            return this._jsPlumb.editable;
        },
        isEditable : function() { return this._jsPlumb.editable; },
        editStarted : function() {            
            this.fire("editStarted", {
                path:this.connector.getPath()
            });            
            this._jsPlumb.instance.setHoverSuspended(true);
        },
        editCompleted : function() {            
            this.fire("editCompleted", {
                path:this.connector.getPath()
            });       
            this.setHover(false);     
            this._jsPlumb.instance.setHoverSuspended(false);
        },
        editCanceled : function() {
            this.fire("editCanceled", {
                path:this.connector.getPath()
            });
            this.setHover(false);
            this._jsPlumb.instance.setHoverSuspended(false);
        },
        cleanup:function() {
            this._jsPlumb.instance.remove(this.connector.getDisplayElements());
            this.connector.cleanup();
            //this.connector.cleanupListeners();
            this.connector.destroy();
            this.connector = null;
        },
        isDetachable : function() {
            return this._jsPlumb.detachable === true;
        },
        setDetachable : function(detachable) {
          this._jsPlumb.detachable = detachable === true;
        },
        isReattach : function() {
            return this._jsPlumb.reattach === true;
        },        
        setReattach : function(reattach) {
          this._jsPlumb.reattach = reattach === true;
        },
        setHover : function(state) {
            this.connector.setHover(state);                       
        },
        getCost : function() { return this._jsPlumb.cost; },
        setCost : function(c) { this._jsPlumb.cost = c; },
        isDirected : function() { return this._jsPlumb.directed === true; },
        //
        // changes the parent element of this connection to newParent.  not exposed for the public API.
        //
        // TODO ensure moveParent method still works (the overlay stuff in particular)
        moveParent : function(newParent) {
            var jpcl = jsPlumb.CurrentLibrary, curParent = jpcl.getParent(this.connector.canvas);               
            if (this.connector.bgCanvas) {
                jpcl.removeElement(this.connector.bgCanvas);
                jpcl.appendElement(this.connector.bgCanvas, newParent);
            }
            jpcl.removeElement(this.connector.canvas);
            jpcl.appendElement(this.connector.canvas, newParent);                
            // this only applies for DOMOverlays
            for (var i = 0; i < this._jsPlumb.overlays.length; i++) {
                if (this._jsPlumb.overlays[i].isAppendedAtTopLevel) {
                    jpcl.removeElement(this._jsPlumb.overlays[i].canvas);
                    jpcl.appendElement(this._jsPlumb.overlays[i].canvas, newParent);
                    if (this._jsPlumb.overlays[i].reattachListeners) 
                        this._jsPlumb.overlays[i].reattachListeners(this.connector);
                }
            }
            if (this.connector.reattachListeners)       // this is for SVG/VML; change an element's parent and you have to reinit its listeners.
                this.connector.reattachListeners();     // the Canvas implementation doesn't have to care about this
        },
        getConnector : function() { return this.connector; },
        setConnector : function(connectorSpec, doNotRepaint) {
            var _ju = jsPlumbUtil;
            if (this.connector != null) _ju.removeElements(this.connector.getDisplayElements());
            // TODO connector cleanup

            var connectorArgs = { 
                    _jsPlumb:this._jsPlumb.instance, 
                    parent:this._jsPlumb.params.parent, 
                    cssClass:this._jsPlumb.params.cssClass, 
                    container:this._jsPlumb.params.container,                 
                    "pointer-events":this._jsPlumb.params["pointer-events"]
                },
                renderMode = this._jsPlumb.instance.getRenderMode();
            
            if (_ju.isString(connectorSpec)) 
                this.connector = makeConnector(this._jsPlumb.instance, renderMode, connectorSpec, connectorArgs); // lets you use a string as shorthand.
            else if (_ju.isArray(connectorSpec)) {
                if (connectorSpec.length == 1)
                    this.connector = makeConnector(this._jsPlumb.instance, renderMode, connectorSpec[0], connectorArgs);
                else
                    this.connector = makeConnector(this._jsPlumb.instance, renderMode, connectorSpec[0], _ju.merge(connectorSpec[1], connectorArgs));
            }
            // binds mouse listeners to the current connector.
            this.bindListeners(this.connector, this, function(state) {
                if (!this._jsPlumb.instance.isConnectionBeingDragged()) {
                    this.setHover(state, false);
                }
            }.bind(this));
            
            this.canvas = this.connector.canvas;

            if (this._jsPlumb.editable && jsPlumb.ConnectorEditors != null && jsPlumb.ConnectorEditors[this.connector.type] && this.connector.isEditable()) {
                new jsPlumb.ConnectorEditors[this.connector.type]({
                    connector:this.connector,
                    connection:this,
                    params:this._jsPlumb.params.editorParams || { }
                });
            }
            else {                    
                editable = false;
            }                
                
            if (!doNotRepaint) this.repaint();
        },
        paint : function(params) {
                    
            if (!this._jsPlumb.instance.isSuspendDrawing() && this._jsPlumb.visible) {
                    
                params = params || {};
                var elId = params.elId, ui = params.ui, recalc = params.recalc, timestamp = params.timestamp,
                    // if the moving object is not the source we must transpose the two references.
                    swap = false,
                    tId = swap ? this.sourceId : this.targetId, sId = swap ? this.targetId : this.sourceId,                    
                    tIdx = swap ? 0 : 1, sIdx = swap ? 1 : 0;

                if (timestamp == null || timestamp != this._jsPlumb.lastPaintedAt) {                        
                    var sourceInfo = this._jsPlumb.instance.updateOffset( { elId : sId, offset : ui, recalc : recalc, timestamp : timestamp }).o,
                        targetInfo = this._jsPlumb.instance.updateOffset( { elId : tId, timestamp : timestamp }).o, // update the target if this is a forced repaint. otherwise, only the source has been moved.
                        sE = this.endpoints[sIdx], tE = this.endpoints[tIdx];

                    if (params.clearEdits) {
                        sE.anchor.clearUserDefinedLocation();
                        tE.anchor.clearUserDefinedLocation();
                        this.connector.setEdited(false);
                    }
                    
                    var sAnchorP = sE.anchor.getCurrentLocation({xy:[sourceInfo.left,sourceInfo.top], wh:[sourceInfo.width, sourceInfo.height], element:sE, timestamp:timestamp}),              
                        tAnchorP = tE.anchor.getCurrentLocation({xy:[targetInfo.left,targetInfo.top], wh:[targetInfo.width, targetInfo.height], element:tE, timestamp:timestamp});                                                 
                        
                    this.connector.resetBounds();

                    this.connector.compute({
                        sourcePos:sAnchorP,
                        targetPos:tAnchorP, 
                        sourceEndpoint:this.endpoints[sIdx],
                        targetEndpoint:this.endpoints[tIdx],
                        lineWidth:this._jsPlumb.paintStyleInUse.lineWidth,                                          
                        sourceInfo:sourceInfo,
                        targetInfo:targetInfo,
                        clearEdits:params.clearEdits === true
                    });                                                                                        

                    var overlayExtents = { minX:Infinity, minY:Infinity, maxX:-Infinity, maxY:-Infinity };
                                        
                    // compute overlays. we do this first so we can get their placements, and adjust the
                    // container if needs be (if an overlay would be clipped)
                    for ( var i = 0; i < this._jsPlumb.overlays.length; i++) {
                        var o = this._jsPlumb.overlays[i];
                        if (o.isVisible()) {
                            this._jsPlumb.overlayPlacements[i] = o.draw(this.connector, this._jsPlumb.paintStyleInUse);
                            overlayExtents.minX = Math.min(overlayExtents.minX, this._jsPlumb.overlayPlacements[i].minX);
                            overlayExtents.maxX = Math.max(overlayExtents.maxX, this._jsPlumb.overlayPlacements[i].maxX);
                            overlayExtents.minY = Math.min(overlayExtents.minY, this._jsPlumb.overlayPlacements[i].minY);
                            overlayExtents.maxY = Math.max(overlayExtents.maxY, this._jsPlumb.overlayPlacements[i].maxY);
                        }
                    }

                    var lineWidth = parseFloat(this._jsPlumb.paintStyleInUse.lineWidth || 1) / 2,
                        outlineWidth = parseFloat(this._jsPlumb.paintStyleInUse.lineWidth || 0),
                        extents = {
                            xmin : Math.min(this.connector.bounds.minX - (lineWidth + outlineWidth), overlayExtents.minX),
                            ymin : Math.min(this.connector.bounds.minY - (lineWidth + outlineWidth), overlayExtents.minY),
                            xmax : Math.max(this.connector.bounds.maxX + (lineWidth + outlineWidth), overlayExtents.maxX),
                            ymax : Math.max(this.connector.bounds.maxY + (lineWidth + outlineWidth), overlayExtents.maxY)
                        };

                    // paint the connector.
                    this.connector.paint(this._jsPlumb.paintStyleInUse, null, extents);  
                    // and then the overlays
                    for ( var i = 0; i < this._jsPlumb.overlays.length; i++) {
                        var o = this._jsPlumb.overlays[i];
                        if (o.isVisible()) {
                            o.paint(this._jsPlumb.overlayPlacements[i], extents);    
                        }
                    }                  
                                                            
                }
                this._jsPlumb.lastPaintedAt = timestamp;                        
            }       
        }
        
    }); // END Connection class            
})();