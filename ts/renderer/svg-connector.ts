import { jsPlumb } from "../jsplumb";
import {SvgComponent} from "./svg-component";


export class SvgConnector extends SvgComponent {


    constructor(params:any) {

        super({
            cssClass: params._jsPlumb.connectorClass + (this.isEditable() ? " " + params._jsPlumb.editableConnectorClass : ""),
            originalArgs: arguments,
            pointerEventsSpec: "none",
            _jsPlumb: params._jsPlumb
        });


        this.renderer.paint = function (style, anchor, extents) {

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

    }

    setEditable (e:boolean) {
    if (super.setEditable(e)) {
        jsPlumb.addClass(this.canvas, this._jsPlumb.instance.editableConnectorClass)
    } else {
        jsPlumb.removeClass(this.canvas, this._jsPlumb.instance.editableConnectorClass)
    }
};
}