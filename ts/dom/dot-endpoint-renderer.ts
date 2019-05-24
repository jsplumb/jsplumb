import {registerEndpointRenderer} from "./browser-renderer";
import {_attr, _node} from "../svg/svg-util";
import {PaintStyle} from "../styles";
import {SvgComponentOptions} from "../svg/svg-component";
import {ComputedDotEndpoint, DotEndpoint} from "../endpoint/dot-endpoint";
import {jsPlumbInstance} from "../core";
import {SvgEndpoint} from "./svg-element-endpoint";

/**
 * SVG DOM element Dot endpoint renderer.
 */
class SvgElementDotEndpointRenderer extends SvgEndpoint<ComputedDotEndpoint> {

    constructor(protected instance:jsPlumbInstance<HTMLElement>, public endpoint:DotEndpoint<HTMLElement>, options?:SvgComponentOptions) {
        super(instance, endpoint, options);
    }

    makeNode (style:PaintStyle) {
        return _node(this.instance, "circle", {
            "cx": this.endpoint.w / 2,
            "cy": this.endpoint.h / 2,
            "r": this.endpoint.radius
        });
    }

    updateNode (node:SVGElement) {
        _attr(node, {
            "cx": "" + (this.endpoint.w / 2),
            "cy": "" + (this.endpoint.h / 2),
            "r": "" + this.endpoint.radius
        });
    }
}

registerEndpointRenderer("Dot", SvgElementDotEndpointRenderer);