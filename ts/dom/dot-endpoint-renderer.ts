import {registerEndpointRenderer} from "./browser-jsplumb-instance"
import { _attr, _node } from './svg-util'
import { PaintStyle, DotEndpoint } from '@jsplumb/community-core'

export const register = () => {

    registerEndpointRenderer<DotEndpoint>("Dot", {
        // TODO `instance` not needed here
        makeNode: (ep: DotEndpoint, style: PaintStyle) => {
            return _node("circle", {
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
