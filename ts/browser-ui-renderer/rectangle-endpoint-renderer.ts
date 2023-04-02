import {registerEndpointRenderer} from "./browser-jsplumb-instance"

import { _attr, _node } from './svg-util'
import {RectangleEndpoint} from "../core/endpoint/rectangle-endpoint"
import {PaintStyle} from "../common/paint-style"

const RECT = "rect"

export const register = () => {

    registerEndpointRenderer<RectangleEndpoint>(RectangleEndpoint.type, {
        makeNode: (ep: RectangleEndpoint, style: PaintStyle) => {
            return _node(RECT, {
                "width": ep.w,
                "height": ep.h
            })
        },

        updateNode: (ep: RectangleEndpoint, node: SVGElement) => {
            _attr(node, {
                "width": ep.w,
                "height": ep.h
            })
        }
    })

}
