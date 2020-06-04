import {registerEndpointRenderer} from "./browser-renderer";
import {_attr, _node} from "../svg/svg-util";
import {PaintStyle} from "../styles";
import {jsPlumbInstance} from "../core";

registerEndpointRenderer("Dot", {
    makeNode : (instance:jsPlumbInstance, ep:any, style:PaintStyle) => {
        return _node(instance, "circle", {
            "cx": ep.w / 2,
            "cy": ep.h / 2,
            "r": ep.radius
        });
    },

    updateNode : (ep:any, node:SVGElement) => {
        _attr(node, {
            "cx": "" + (ep.w / 2),
            "cy": "" + (ep.h / 2),
            "r": "" + ep.radius
        });
    }
});
