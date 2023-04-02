import {registerEndpointRenderer} from "./browser-jsplumb-instance"
import { _attr, _node } from './svg-util'
import {DotEndpoint} from "../core/endpoint/dot-endpoint"
import {PaintStyle} from "../common/paint-style"

const CIRCLE = "circle"

export const register = () => {

    registerEndpointRenderer<DotEndpoint>(DotEndpoint.type, {
        // TODO `instance` not needed here
        makeNode: (ep: DotEndpoint, style: PaintStyle) => {
            return _node(CIRCLE, {
                "cx": ep.w / 2,
                "cy": ep.h / 2,
                "r": ep.radius
            })
        },

        updateNode: (ep: DotEndpoint, node: SVGElement) => {
            _attr(node, {
                "cx": "" + (ep.w / 2),
                "cy": "" + (ep.h / 2),
                "r": "" + ep.radius
            })
        }
    })
}
