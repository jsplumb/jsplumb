import {registerEndpointRenderer} from "./browser-renderer";
import {_attr, _node} from "../svg/svg-util";
import {PaintStyle} from "../styles";
import {SvgComponentOptions} from "../svg/svg-component";
import {ComputedDotEndpoint, DotEndpoint} from "../endpoint/dot-endpoint";
import {jsPlumbInstance} from "../core";
import {SvgEndpoint} from "./svg-element-endpoint";
import {Endpoint} from "../endpoint/endpoint-impl";

/**
 * SVG DOM element Dot endpoint renderer.
 */
class SvgElementDotEndpointRenderer extends SvgEndpoint<ComputedDotEndpoint> {

    constructor(protected endpoint:Endpoint<HTMLElement>, public ep:DotEndpoint<HTMLElement>, options?:SvgComponentOptions) {
        super(endpoint, ep, options);
    }

    makeNode (style:PaintStyle) {
        return _node(this.instance, "circle", {
            "cx": this.ep.w / 2,
            "cy": this.ep.h / 2,
            "r": this.ep.radius
        });
    }

    updateNode (node:SVGElement) {
        _attr(node, {
            "cx": "" + (this.ep.w / 2),
            "cy": "" + (this.ep.h / 2),
            "r": "" + this.ep.radius
        });
    }
}

registerEndpointRenderer("Dot", SvgElementDotEndpointRenderer);