import {registerEndpointRenderer} from "./browser-renderer";
import {_attr, _node} from "../svg/svg-util";
import {PaintStyle} from "../styles";
import {SvgComponentOptions} from "../svg/svg-component";
import {ComputedRectangleEndpoint, RectangleEndpoint} from "../endpoint/rectangle-endpoint";
import {jsPlumbInstance} from "../core";
import {SvgEndpoint} from "./svg-element-endpoint";
import {Endpoint} from "../endpoint/endpoint-impl";

/**
 * SVG DOM element Dot endpoint renderer.
 */
class SvgElementRectangleEndpointRenderer extends SvgEndpoint<ComputedRectangleEndpoint> {

    constructor(protected endpoint:Endpoint<HTMLElement>, public ep:RectangleEndpoint<HTMLElement>, options?:SvgComponentOptions) {
        super(endpoint, ep, options);
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
