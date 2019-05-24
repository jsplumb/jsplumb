import {registerEndpointRenderer} from "./browser-renderer";
import {_attr, _node} from "../svg/svg-util";
import {PaintStyle} from "../styles";
import {SvgComponentOptions} from "../svg/svg-component";
import {ComputedRectangleEndpoint, RectangleEndpoint} from "../endpoint/rectangle-endpoint";
import {jsPlumbInstance} from "../core";
import {SvgEndpoint} from "./svg-element-endpoint";

/**
 * SVG DOM element Dot endpoint renderer.
 */
class SvgElementRectangleEndpointRenderer extends SvgEndpoint<ComputedRectangleEndpoint> {

    constructor(protected instance:jsPlumbInstance<HTMLElement>, public endpoint:RectangleEndpoint<HTMLElement>, options?:SvgComponentOptions) {
        super(instance, endpoint, options);
    }

    makeNode (style:PaintStyle) {
        return _node(this.instance, "rect", {
            "width": this.endpoint.w,
            "height": this.endpoint.h
        });
    }

    updateNode (node:SVGElement) {
        _attr(node, {
            "width": this.endpoint.w,
            "height": this.endpoint.h
        });
    }
}

registerEndpointRenderer("Rectangle", SvgElementRectangleEndpointRenderer);
