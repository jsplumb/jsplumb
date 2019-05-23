import {extend, jsPlumbInstance} from "../core";
import {ConnectorRenderer} from "../connector/connector-renderer";
import {PaintStyle} from "../styles";
import {SvgComponent} from "../svg/svg-component";
import {AbstractConnector} from "../connector/abstract-connector";
import {_appendAtIndex, _applyStyles, _attr, _node} from "../svg/svg-util";
import * as jsPlumb from "../../index";

export class SvgElementConnector extends SvgComponent implements ConnectorRenderer<HTMLElement> {

    bgPath:SVGElement;
    path:SVGElement;

    constructor(public instance:jsPlumbInstance<HTMLElement>, public connector:AbstractConnector<HTMLElement>) {
        super(instance, connector, null);

        // this.path = _node(this.instance, "path", {
        //     "d": ""
        // });

        // this.svg.appendChild(this.path);
    }


    paint(paintStyle: PaintStyle, extents?:any): void {

        super.paint(paintStyle, extents);

        let segments = this.connector.segments;

        console.log("PAINTING", this.connector, paintStyle, extents);

        let p = "", offset = [0, 0];
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
                    "pointer-events": /*params["pointer-events"] ||*/ "visibleStroke"
                },
                outlineStyle:PaintStyle = null,
                d = [this.connector.x, this.connector.y, this.connector.w, this.connector.h];

            // outline style.  actually means drawing an svg object underneath the main one.
            if (paintStyle.outlineStroke) {
                let outlineWidth = paintStyle.outlineWidth || 1,
                    outlineStrokeWidth = paintStyle.strokeWidth + (2 * outlineWidth);
                outlineStyle = extend({}, paintStyle);
                delete outlineStyle.gradient;
                outlineStyle.stroke = paintStyle.outlineStroke;
                outlineStyle.strokeWidth = outlineStrokeWidth;

                if (this.bgPath == null) {
                    this.bgPath = _node(this.instance, "path", a);
                    this.instance.addClass(this.bgPath as any, this.instance.connectorOutlineClass);
                    _appendAtIndex(this.svg, this.bgPath, 0);
                }
                else {
                    _attr(this.bgPath, a);
                }

                _applyStyles(this.svg, this.bgPath, outlineStyle, d, null);
            }

            if (this.path == null) {
                this.path = _node(this.instance, "path", a);
                _appendAtIndex(this.svg, this.path, paintStyle.outlineStroke ? 1 : 0);
            }
            else {
                _attr(this.path, a);
            }

            _applyStyles(this.svg, this.path, paintStyle, d, null);
        }
    }


    destroy(force?: boolean): any {
        super.destroy(force);
        this.instance.removeElement(this.path as any);
    }
}
