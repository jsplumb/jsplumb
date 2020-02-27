import {registerEndpointRenderer} from "./browser-renderer";
import {_attr, _node, ElementAttributes} from "../svg/svg-util";
import {PaintStyle} from "../styles";
import {SvgComponentOptions} from "../svg/svg-component";
import {SvgEndpoint} from "./svg-element-endpoint";
import {BlankEndpoint, ComputedBlankEndpoint} from "../endpoint/blank-endpoint";
import {Endpoint} from "../endpoint/endpoint-impl";

const BLANK_ATTRIBUTES:ElementAttributes = {
    "width": 10,
    "height": 0,
    "fill":"transparent",
    "stroke":"transparent"
};

/**
 * SVG DOM element Dot endpoint renderer.
 */
class SvgElementBlankEndpointRenderer extends SvgEndpoint<ComputedBlankEndpoint> {

    constructor(protected endpoint:Endpoint<HTMLElement>, public ep:BlankEndpoint<HTMLElement>, options?:SvgComponentOptions) {
        super(endpoint, ep, options);
    }

    makeNode (style:PaintStyle) {
        return _node(this.instance, "rect", BLANK_ATTRIBUTES);
    }

    updateNode (node:SVGElement) {
        _attr(node, BLANK_ATTRIBUTES);
    }
}

registerEndpointRenderer("Blank", SvgElementBlankEndpointRenderer);
