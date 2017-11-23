import {Extents, SvgComponent} from "./svg-component";
import {ConnectorRenderer} from "../ConnectorRenderer";
import {Connector} from "../../connector/connector";
import {RawElement} from "../../dom/dom-adapter";
import {JsPlumb} from "../../core";
import {_applyStyles, _attr, _node, appendAtIndex} from "./svg-util";


export class SvgConnector<EventType> extends SvgComponent<EventType> implements ConnectorRenderer {

    connector:Connector<EventType, RawElement>;
    path:any;
    bgPath:any;

    constructor(params:any) {

        super({
            cssClass: params._jsPlumb.connectorClass,
            originalArgs: arguments,
            pointerEventsSpec: "none",
            _jsPlumb: params._jsPlumb
        });

        this.connector = params.connector;
        this.pointerEventsSpec = params["pointer-events"] || "visibleStroke";

    }

    paint(style:any, anchor:any, extents:Extents) {

        super.paint(style, anchor, extents);

        let segments = this.connector.getSegments(), p = "", offset = [0, 0];
        if (extents.xmin < 0) {
            offset[0] = -extents.xmin;
        }
        if (extents.ymin < 0) {
            offset[1] = -extents.ymin;
        }

        if (segments.length > 0) {

            p = this.connector.getPathData();

            let a = {
                    d: p,
                    transform: "translate(" + offset[0] + "," + offset[1] + ")",
                    "pointer-events": this.pointerEventsSpec
                },
                outlineStyle = null,
                d = [this.x, this.y, this.w, this.h];

            // outline style.  actually means drawing an svg object underneath the main one.
            if (style.outlineStroke) {
                let outlineWidth = style.outlineWidth || 1,
                    outlineStrokeWidth = style.strokeWidth + (2 * outlineWidth);
                outlineStyle = JsPlumb.extend({}, style);
                delete outlineStyle.gradient;
                outlineStyle.stroke = style.outlineStroke;
                outlineStyle.strokeWidth = outlineStrokeWidth;

                if (this.bgPath == null) {
                    this.bgPath = _node("path", a);
                    this.instance.addClass(this.bgPath, this.instance.connectorOutlineClass);
                    appendAtIndex(this.svg, this.bgPath, 0);
                }
                else {
                    _attr(this.bgPath, a);
                }

                _applyStyles(this.svg, this.bgPath, outlineStyle, d, self);
            }

            if (this.path == null) {
                this.path = _node("path", a);
                appendAtIndex(this.svg, this.path, style.outlineStroke ? 1 : 0);
            }
            else {
                _attr(this.path, a);
            }

            _applyStyles(this.svg, this.path, style, d, self);
        }
    }
}