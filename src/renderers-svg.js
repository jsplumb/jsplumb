/*
 * jsPlumb Community Edition
 * 
 * Provides a way to visually connect elements on an HTML page, using SVG.
 * 
 * This file contains the SVG renderers.
 *
 * Copyright (c) 2010 - 2017 jsPlumb (hello@jsplumbtoolkit.com)
 * 
 * https://jsplumbtoolkit.com
 * https://github.com/jsplumb/jsplumb
 * 
 * Dual licensed under the MIT and GPL2 licenses.
 */
;
(function () {

// ************************** SVG utility methods ********************************************	

    "use strict";
    var root = this, _jp = root.jsPlumb, _ju = root.jsPlumbUtil;

    var svgAttributeMap = {
            "stroke-linejoin": "stroke-linejoin",
            "stroke-dashoffset": "stroke-dashoffset",
            "stroke-linecap": "stroke-linecap"
        },
        STROKE_DASHARRAY = "stroke-dasharray",
        DASHSTYLE = "dashstyle",
        LINEAR_GRADIENT = "linearGradient",
        RADIAL_GRADIENT = "radialGradient",
        DEFS = "defs",
        FILL = "fill",
        STOP = "stop",
        STROKE = "stroke",
        STROKE_WIDTH = "stroke-width",
        STYLE = "style",
        NONE = "none",
        JSPLUMB_GRADIENT = "jsplumb_gradient_",
        LINE_WIDTH = "strokeWidth",
        ns = {
            svg: "http://www.w3.org/2000/svg"
        },
        _attr = function (node, attributes) {
            for (var i in attributes) {
                node.setAttribute(i, "" + attributes[i]);
            }
        },
        _node = function (name, attributes) {
            attributes = attributes || {};
            attributes.version = "1.1";
            attributes.xmlns = ns.svg;
            return _jp.createElementNS(ns.svg, name, null, null, attributes);
        },
        _pos = function (d) {
            return "position:absolute;left:" + d[0] + "px;top:" + d[1] + "px";
        },
        _clearGradient = function (parent) {
            var els = parent.querySelectorAll(" defs,linearGradient,radialGradient");
            for (var i = 0; i < els.length; i++) {
                els[i].parentNode.removeChild(els[i]);
            }
        },
        _updateGradient = function (parent, node, style, dimensions, uiComponent) {
            var id = JSPLUMB_GRADIENT + uiComponent._jsPlumb.instance.idstamp();
            // first clear out any existing gradient
            _clearGradient(parent);
            // this checks for an 'offset' property in the gradient, and in the absence of it, assumes
            // we want a linear gradient. if it's there, we create a radial gradient.
            // it is possible that a more explicit means of defining the gradient type would be
            // better. relying on 'offset' means that we can never have a radial gradient that uses
            // some default offset, for instance.
            // issue 244 suggested the 'gradientUnits' attribute; without this, straight/flowchart connectors with gradients would
            // not show gradients when the line was perfectly horizontal or vertical.
            var g;
            if (!style.gradient.offset) {
                g = _node(LINEAR_GRADIENT, {id: id, gradientUnits: "userSpaceOnUse"});
            }
            else {
                g = _node(RADIAL_GRADIENT, { id: id });
            }

            var defs = _node(DEFS);
            parent.appendChild(defs);
            defs.appendChild(g);

            // the svg radial gradient seems to treat stops in the reverse
            // order to how canvas does it.  so we want to keep all the maths the same, but
            // iterate the actual style declarations in reverse order, if the x indexes are not in order.
            for (var i = 0; i < style.gradient.stops.length; i++) {
                var styleToUse = uiComponent.segment === 1 || uiComponent.segment === 2 ? i : style.gradient.stops.length - 1 - i,
                    stopColor = style.gradient.stops[styleToUse][1],
                    s = _node(STOP, {"offset": Math.floor(style.gradient.stops[i][0] * 100) + "%", "stop-color": stopColor});

                g.appendChild(s);
            }
            var applyGradientTo = style.stroke ? STROKE : FILL;
            node.setAttribute(applyGradientTo, "url(#" + id + ")");
        },
        _applyStyles = function (parent, node, style, dimensions, uiComponent) {

            node.setAttribute(FILL, style.fill ? style.fill : NONE);
            node.setAttribute(STROKE, style.stroke ? style.stroke : NONE);

            if (style.gradient) {
                _updateGradient(parent, node, style, dimensions, uiComponent);
            }
            else {
                // make sure we clear any existing gradient
                _clearGradient(parent);
                node.setAttribute(STYLE, "");
            }

            if (style.strokeWidth) {
                node.setAttribute(STROKE_WIDTH, style.strokeWidth);
            }

            // in SVG there is a stroke-dasharray attribute we can set, and its syntax looks like
            // the syntax in VML but is actually kind of nasty: values are given in the pixel
            // coordinate space, whereas in VML they are multiples of the width of the stroked
            // line, which makes a lot more sense.  for that reason, jsPlumb is supporting both
            // the native svg 'stroke-dasharray' attribute, and also the 'dashstyle' concept from
            // VML, which will be the preferred method.  the code below this converts a dashstyle
            // attribute given in terms of stroke width into a pixel representation, by using the
            // stroke's lineWidth.
            if (style[DASHSTYLE] && style[LINE_WIDTH] && !style[STROKE_DASHARRAY]) {
                var sep = style[DASHSTYLE].indexOf(",") === -1 ? " " : ",",
                    parts = style[DASHSTYLE].split(sep),
                    styleToUse = "";
                parts.forEach(function (p) {
                    styleToUse += (Math.floor(p * style.strokeWidth) + sep);
                });
                node.setAttribute(STROKE_DASHARRAY, styleToUse);
            }
            else if (style[STROKE_DASHARRAY]) {
                node.setAttribute(STROKE_DASHARRAY, style[STROKE_DASHARRAY]);
            }

            // extra attributes such as join type, dash offset.
            for (var i in svgAttributeMap) {
                if (style[i]) {
                    node.setAttribute(svgAttributeMap[i], style[i]);
                }
            }
        },
        _appendAtIndex = function (svg, path, idx) {
            if (svg.childNodes.length > idx) {
                svg.insertBefore(path, svg.childNodes[idx]);
            }
            else {
                svg.appendChild(path);
            }
        };

    /**
     utility methods for other objects to use.
     */
    _ju.svg = {
        node: _node,
        attr: _attr,
        pos: _pos
    };

    // ************************** / SVG utility methods ********************************************

    /*
     * Base class for SVG components.
     */
    var SvgComponent = function (params) {
        var pointerEventsSpec = params.pointerEventsSpec || "all", renderer = {};

        _jp.jsPlumbUIComponent.apply(this, params.originalArgs);
        this.canvas = null;
        this.path = null;
        this.svg = null;
        this.bgCanvas = null;

        var clazz = params.cssClass + " " + (params.originalArgs[0].cssClass || ""),
            svgParams = {
                "style": "",
                "width": 0,
                "height": 0,
                "pointer-events": pointerEventsSpec,
                "position": "absolute"
            };

        this.svg = _node("svg", svgParams);

        if (params.useDivWrapper) {
            this.canvas = _jp.createElement("div", { position : "absolute" });
            _ju.sizeElement(this.canvas, 0, 0, 1, 1);
            this.canvas.className = clazz;
        }
        else {
            _attr(this.svg, { "class": clazz });
            this.canvas = this.svg;
        }

        params._jsPlumb.appendElement(this.canvas, params.originalArgs[0].parent);
        if (params.useDivWrapper) {
            this.canvas.appendChild(this.svg);
        }

        var displayElements = [ this.canvas ];
        this.getDisplayElements = function () {
            return displayElements;
        };

        this.appendDisplayElement = function (el) {
            displayElements.push(el);
        };

        this.paint = function (style, anchor, extents) {
            if (style != null) {

                var xy = [ this.x, this.y ], wh = [ this.w, this.h ], p;
                if (extents != null) {
                    if (extents.xmin < 0) {
                        xy[0] += extents.xmin;
                    }
                    if (extents.ymin < 0) {
                        xy[1] += extents.ymin;
                    }
                    wh[0] = extents.xmax + ((extents.xmin < 0) ? -extents.xmin : 0);
                    wh[1] = extents.ymax + ((extents.ymin < 0) ? -extents.ymin : 0);
                }

                if (params.useDivWrapper) {
                    _ju.sizeElement(this.canvas, xy[0], xy[1], wh[0], wh[1]);
                    xy[0] = 0;
                    xy[1] = 0;
                    p = _pos([ 0, 0 ]);
                }
                else {
                    p = _pos([ xy[0], xy[1] ]);
                }

                renderer.paint.apply(this, arguments);

                _attr(this.svg, {
                    "style": p,
                    "width": wh[0] || 0,
                    "height": wh[1] || 0
                });
            }
        };

        return {
            renderer: renderer
        };
    };

    _ju.extend(SvgComponent, _jp.jsPlumbUIComponent, {
        cleanup: function (force) {
            if (force || this.typeId == null) {
                if (this.canvas) {
                    this.canvas._jsPlumb = null;
                }
                if (this.svg) {
                    this.svg._jsPlumb = null;
                }
                if (this.bgCanvas) {
                    this.bgCanvas._jsPlumb = null;
                }

                if (this.canvas && this.canvas.parentNode) {
                    this.canvas.parentNode.removeChild(this.canvas);
                }
                if (this.bgCanvas && this.bgCanvas.parentNode) {
                    this.canvas.parentNode.removeChild(this.canvas);
                }

                this.svg = null;
                this.canvas = null;
                this.path = null;
                this.group = null;
            }
            else {
                // if not a forced cleanup, just detach from DOM for now.
                if (this.canvas && this.canvas.parentNode) {
                    this.canvas.parentNode.removeChild(this.canvas);
                }
                if (this.bgCanvas && this.bgCanvas.parentNode) {
                    this.bgCanvas.parentNode.removeChild(this.bgCanvas);
                }
            }
        },
        reattach:function(instance) {
            var c = instance.getContainer();
            if (this.canvas && this.canvas.parentNode == null) {
                c.appendChild(this.canvas);
            }
            if (this.bgCanvas && this.bgCanvas.parentNode == null) {
                c.appendChild(this.bgCanvas);
            }
        },
        setVisible: function (v) {
            if (this.canvas) {
                this.canvas.style.display = v ? "block" : "none";
            }
        }
    });

    /*
     * Base class for SVG connectors.
     */
    _jp.ConnectorRenderers.svg = function (params) {
        var self = this,
            _super = SvgComponent.apply(this, [
                {
                    cssClass: params._jsPlumb.connectorClass + (this.isEditable() ? " " + params._jsPlumb.editableConnectorClass : ""),
                    originalArgs: arguments,
                    pointerEventsSpec: "none",
                    _jsPlumb: params._jsPlumb
                }
            ]);

        var _superSetEditable = this.setEditable;
        this.setEditable = function(e) {
            var result = _superSetEditable.apply(this, [e]);
            _jp[result ? "addClass" : "removeClass"](this.canvas, this._jsPlumb.instance.editableConnectorClass);
        };

        _super.renderer.paint = function (style, anchor, extents) {

            var segments = self.getSegments(), p = "", offset = [0, 0];
            if (extents.xmin < 0) {
                offset[0] = -extents.xmin;
            }
            if (extents.ymin < 0) {
                offset[1] = -extents.ymin;
            }

            if (segments.length > 0) {

                p = self.getPathData();

                var a = {
                        d: p,
                        transform: "translate(" + offset[0] + "," + offset[1] + ")",
                        "pointer-events": params["pointer-events"] || "visibleStroke"
                    },
                    outlineStyle = null,
                    d = [self.x, self.y, self.w, self.h];

                // outline style.  actually means drawing an svg object underneath the main one.
                if (style.outlineStroke) {
                    var outlineWidth = style.outlineWidth || 1,
                        outlineStrokeWidth = style.strokeWidth + (2 * outlineWidth);
                    outlineStyle = _jp.extend({}, style);
                    delete outlineStyle.gradient;
                    outlineStyle.stroke = style.outlineStroke;
                    outlineStyle.strokeWidth = outlineStrokeWidth;

                    if (self.bgPath == null) {
                        self.bgPath = _node("path", a);
                        _jp.addClass(self.bgPath, _jp.connectorOutlineClass);
                        _appendAtIndex(self.svg, self.bgPath, 0);
                    }
                    else {
                        _attr(self.bgPath, a);
                    }

                    _applyStyles(self.svg, self.bgPath, outlineStyle, d, self);
                }

                if (self.path == null) {
                    self.path = _node("path", a);
                    _appendAtIndex(self.svg, self.path, style.outlineStroke ? 1 : 0);
                }
                else {
                    _attr(self.path, a);
                }

                _applyStyles(self.svg, self.path, style, d, self);
            }
        };
    };
    _ju.extend(_jp.ConnectorRenderers.svg, SvgComponent);

// ******************************* svg segment renderer *****************************************************	


// ******************************* /svg segments *****************************************************

    /*
     * Base class for SVG endpoints.
     */
    var SvgEndpoint = _jp.SvgEndpoint = function (params) {
        var _super = SvgComponent.apply(this, [
            {
                cssClass: params._jsPlumb.endpointClass,
                originalArgs: arguments,
                pointerEventsSpec: "all",
                useDivWrapper: true,
                _jsPlumb: params._jsPlumb
            }
        ]);

        _super.renderer.paint = function (style) {
            var s = _jp.extend({}, style);
            if (s.outlineStroke) {
                s.stroke = s.outlineStroke;
            }

            if (this.node == null) {
                this.node = this.makeNode(s);
                this.svg.appendChild(this.node);
            }
            else if (this.updateNode != null) {
                this.updateNode(this.node);
            }
            _applyStyles(this.svg, this.node, s, [ this.x, this.y, this.w, this.h ], this);
            _pos(this.node, [ this.x, this.y ]);
        }.bind(this);

    };
    _ju.extend(SvgEndpoint, SvgComponent);

    /*
     * SVG Dot Endpoint
     */
    _jp.Endpoints.svg.Dot = function () {
        _jp.Endpoints.Dot.apply(this, arguments);
        SvgEndpoint.apply(this, arguments);
        this.makeNode = function (style) {
            return _node("circle", {
                "cx": this.w / 2,
                "cy": this.h / 2,
                "r": this.radius
            });
        };
        this.updateNode = function (node) {
            _attr(node, {
                "cx": this.w / 2,
                "cy": this.h / 2,
                "r": this.radius
            });
        };
    };
    _ju.extend(_jp.Endpoints.svg.Dot, [_jp.Endpoints.Dot, SvgEndpoint]);

    /*
     * SVG Rectangle Endpoint
     */
    _jp.Endpoints.svg.Rectangle = function () {
        _jp.Endpoints.Rectangle.apply(this, arguments);
        SvgEndpoint.apply(this, arguments);
        this.makeNode = function (style) {
            return _node("rect", {
                "width": this.w,
                "height": this.h
            });
        };
        this.updateNode = function (node) {
            _attr(node, {
                "width": this.w,
                "height": this.h
            });
        };
    };
    _ju.extend(_jp.Endpoints.svg.Rectangle, [_jp.Endpoints.Rectangle, SvgEndpoint]);

    /*
     * SVG Image Endpoint is the default image endpoint.
     */
    _jp.Endpoints.svg.Image = _jp.Endpoints.Image;
    /*
     * Blank endpoint in svg renderer is the default Blank endpoint.
     */
    _jp.Endpoints.svg.Blank = _jp.Endpoints.Blank;
    /*
     * Label overlay in svg renderer is the default Label overlay.
     */
    _jp.Overlays.svg.Label = _jp.Overlays.Label;
    /*
     * Custom overlay in svg renderer is the default Custom overlay.
     */
    _jp.Overlays.svg.Custom = _jp.Overlays.Custom;

    var AbstractSvgArrowOverlay = function (superclass, originalArgs) {
        superclass.apply(this, originalArgs);
        _jp.jsPlumbUIComponent.apply(this, originalArgs);
        this.isAppendedAtTopLevel = false;
        var self = this;
        this.path = null;
        this.paint = function (params, containerExtents) {
            // only draws on connections, not endpoints.
            if (params.component.svg && containerExtents) {
                if (this.path == null) {
                    this.path = _node("path", {
                        "pointer-events": "all"
                    });
                    params.component.svg.appendChild(this.path);
                    if (this.elementCreated) {
                        this.elementCreated(this.path, params.component);
                    }

                    this.canvas = params.component.svg; // for the sake of completeness; this behaves the same as other overlays
                }
                var clazz = originalArgs && (originalArgs.length === 1) ? (originalArgs[0].cssClass || "") : "",
                    offset = [0, 0];

                if (containerExtents.xmin < 0) {
                    offset[0] = -containerExtents.xmin;
                }
                if (containerExtents.ymin < 0) {
                    offset[1] = -containerExtents.ymin;
                }

                _attr(this.path, {
                    "d": makePath(params.d),
                    "class": clazz,
                    stroke: params.stroke ? params.stroke : null,
                    fill: params.fill ? params.fill : null,
                    transform: "translate(" + offset[0] + "," + offset[1] + ")"
                });
            }
        };
        var makePath = function (d) {
            return (isNaN(d.cxy.x) || isNaN(d.cxy.y)) ? "" : "M" + d.hxy.x + "," + d.hxy.y +
                " L" + d.tail[0].x + "," + d.tail[0].y +
                " L" + d.cxy.x + "," + d.cxy.y +
                " L" + d.tail[1].x + "," + d.tail[1].y +
                " L" + d.hxy.x + "," + d.hxy.y;
        };
        this.transfer = function(target) {
            if (target.canvas && this.path && this.path.parentNode) {
                this.path.parentNode.removeChild(this.path);
                target.canvas.appendChild(this.path);
            }
        };
    };
    _ju.extend(AbstractSvgArrowOverlay, [_jp.jsPlumbUIComponent, _jp.Overlays.AbstractOverlay], {
        cleanup: function (force) {
            if (this.path != null) {
                if (force) {
                    this._jsPlumb.instance.removeElement(this.path);
                }
                else {
                    if (this.path.parentNode) {
                        this.path.parentNode.removeChild(this.path);
                    }
                }
            }
        },
        reattach:function(instance, component) {
            if (this.path && component.canvas) {
                component.canvas.appendChild(this.path);
            }
        },
        setVisible: function (v) {
            if (this.path != null) {
                (this.path.style.display = (v ? "block" : "none"));
            }
        }
    });

    _jp.Overlays.svg.Arrow = function () {
        AbstractSvgArrowOverlay.apply(this, [_jp.Overlays.Arrow, arguments]);
    };
    _ju.extend(_jp.Overlays.svg.Arrow, [ _jp.Overlays.Arrow, AbstractSvgArrowOverlay ]);

    _jp.Overlays.svg.PlainArrow = function () {
        AbstractSvgArrowOverlay.apply(this, [_jp.Overlays.PlainArrow, arguments]);
    };
    _ju.extend(_jp.Overlays.svg.PlainArrow, [ _jp.Overlays.PlainArrow, AbstractSvgArrowOverlay ]);

    _jp.Overlays.svg.Diamond = function () {
        AbstractSvgArrowOverlay.apply(this, [_jp.Overlays.Diamond, arguments]);
    };
    _ju.extend(_jp.Overlays.svg.Diamond, [ _jp.Overlays.Diamond, AbstractSvgArrowOverlay ]);

    // a test
    _jp.Overlays.svg.GuideLines = function () {
        var path = null, self = this, p1_1, p1_2;
        _jp.Overlays.GuideLines.apply(this, arguments);
        this.paint = function (params, containerExtents) {
            if (path == null) {
                path = _node("path");
                params.connector.svg.appendChild(path);
                self.attachListeners(path, params.connector);
                self.attachListeners(path, self);

                p1_1 = _node("path");
                params.connector.svg.appendChild(p1_1);
                self.attachListeners(p1_1, params.connector);
                self.attachListeners(p1_1, self);

                p1_2 = _node("path");
                params.connector.svg.appendChild(p1_2);
                self.attachListeners(p1_2, params.connector);
                self.attachListeners(p1_2, self);
            }

            var offset = [0, 0];
            if (containerExtents.xmin < 0) {
                offset[0] = -containerExtents.xmin;
            }
            if (containerExtents.ymin < 0) {
                offset[1] = -containerExtents.ymin;
            }

            _attr(path, {
                "d": makePath(params.head, params.tail),
                stroke: "red",
                fill: null,
                transform: "translate(" + offset[0] + "," + offset[1] + ")"
            });

            _attr(p1_1, {
                "d": makePath(params.tailLine[0], params.tailLine[1]),
                stroke: "blue",
                fill: null,
                transform: "translate(" + offset[0] + "," + offset[1] + ")"
            });

            _attr(p1_2, {
                "d": makePath(params.headLine[0], params.headLine[1]),
                stroke: "green",
                fill: null,
                transform: "translate(" + offset[0] + "," + offset[1] + ")"
            });
        };

        var makePath = function (d1, d2) {
            return "M " + d1.x + "," + d1.y +
                " L" + d2.x + "," + d2.y;
        };
    };
    _ju.extend(_jp.Overlays.svg.GuideLines, _jp.Overlays.GuideLines);
}).call(typeof window !== 'undefined' ? window : this);
