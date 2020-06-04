import {registerEndpointRenderer} from "./browser-renderer";
import {_attr, _node, ElementAttributes} from "../svg/svg-util";
import {PaintStyle} from "../styles";
import {jsPlumbInstance} from "../core";

const BLANK_ATTRIBUTES:ElementAttributes = {
    "width": 10,
    "height": 0,
    "fill":"transparent",
    "stroke":"transparent"
};

registerEndpointRenderer("Blank", {
    makeNode : (instance:jsPlumbInstance, ep:any, style:PaintStyle) => {
        return _node(instance, "rect", BLANK_ATTRIBUTES);
    },

    updateNode : (ep:any, node:SVGElement) => {
        _attr(node, BLANK_ATTRIBUTES);
    }
});
