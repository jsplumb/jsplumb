import {registerEndpointRenderer} from "./browser-renderer";
import {_attr, _node} from "../svg/svg-util";
import {PaintStyle} from "../styles";
import {jsPlumbInstance} from "../core";

registerEndpointRenderer("Rectangle", {
    makeNode :(instance:jsPlumbInstance, ep:any, style:PaintStyle) => {
        return _node(instance, "rect", {
            "width": ep.w,
            "height": ep.h
        });
    },

    updateNode :(ep:any, node:SVGElement) => {
        _attr(node, {
            "width": ep.w,
            "height": ep.h
        });
    }
});
