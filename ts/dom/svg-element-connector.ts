import {extend, jsPlumbInstance, TypeDescriptor} from "../core";
import {ConnectorRenderer} from "../connector/connector-renderer";
import {PaintStyle} from "../styles";
import {SvgComponent} from "../svg/svg-component";
import {AbstractConnector} from "../connector/abstract-connector";
import {_appendAtIndex, _applyStyles, _attr, _node} from "../svg/svg-util";

/**
 * Renderer for a connector that uses an `svg` element in the DOM.
 */
export class SvgElementConnector extends SvgComponent implements ConnectorRenderer<HTMLElement> {

    bgPath:SVGElement;
    path:SVGElement;

    constructor(public instance:jsPlumbInstance<HTMLElement>,
                public connector:AbstractConnector<HTMLElement>) {

        super(instance, connector, null);
        if (connector.cssClass != null) {
            instance.addClass(this.canvas, connector.cssClass);
        }
        instance.addClass(this.canvas, instance.connectorClass);

        (<any>this.canvas).jtk = (<any>this.canvas).jtk || { };
        (<any>this.canvas).jtk.connector = connector;
    }

    paint(paintStyle: PaintStyle, extents?:any): void {

        super.paint(paintStyle, extents);

        let segments = this.connector.segments;

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
                    "pointer-events": "visibleStroke"
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

            _applyStyles(this.svg, this.path, paintStyle, d, <any>this);
        }
    }

    applyType(t: TypeDescriptor): void {
        if (t.cssClass != null && this.svg) {
            this.instance.addClass(<any>this.svg, t.cssClass);
        }
    }


}
