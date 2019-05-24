import {registerEndpointRenderer} from "./browser-renderer";
import {_attr, _node, Attributes} from "../svg/svg-util";
import {PaintStyle} from "../styles";
import {SvgComponentOptions} from "../svg/svg-component";
import {jsPlumbInstance} from "../core";
import {SvgEndpoint} from "./svg-element-endpoint";
import {BlankEndpoint, ComputedBlankEndpoint} from "../endpoint/blank-endpoint";

const BLANK_ATTRIBUTES:Attributes = {
    "width": 10,
    "height": 0,
    "fill":"transparent",
    "stroke":"transparent"
};

/**
 * SVG DOM element Dot endpoint renderer.
 */
class SvgElementBlankEndpointRenderer extends SvgEndpoint<ComputedBlankEndpoint> {

    constructor(protected instance:jsPlumbInstance<HTMLElement>, public endpoint:BlankEndpoint<HTMLElement>, options?:SvgComponentOptions) {
        super(instance, endpoint, options);
    }

    makeNode (style:PaintStyle) {
        return _node(this.instance, "rect", BLANK_ATTRIBUTES);
    }

    updateNode (node:SVGElement) {
        _attr(node, BLANK_ATTRIBUTES);
    }
}

registerEndpointRenderer("Blank", SvgElementBlankEndpointRenderer);