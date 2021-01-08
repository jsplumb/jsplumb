import {registerEndpointRenderer} from "./browser-jsplumb-instance"
import { _attr, _node } from './svg-util'
import {JsPlumbInstance} from '../core/core'
import { PaintStyle } from '../core/styles'
import { DotEndpoint} from '../core/endpoint/dot-endpoint'

export const register = () => {

    registerEndpointRenderer<DotEndpoint>("Dot", {
        // TODO `instance` not needed here
        makeNode: (instance: JsPlumbInstance, ep: any, style: PaintStyle) => {
            return _node("circle", {
                "cx": ep.w / 2,
                "cy": ep.h / 2,
                "r": ep.radius
            })
        },

        updateNode: (ep: any, node: SVGElement) => {
            _attr(node, {
                "cx": "" + (ep.w / 2),
                "cy": "" + (ep.h / 2),
                "r": "" + ep.radius
            })
        }
    })
}
