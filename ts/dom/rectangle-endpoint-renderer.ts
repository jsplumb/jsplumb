import {registerEndpointRenderer} from "./browser-jsplumb-instance"

import { _attr, _node } from './svg-util'

import {PaintStyle, RectangleEndpoint} from "@jsplumb/core"

export const register = () => {

    registerEndpointRenderer<RectangleEndpoint>("Rectangle", {
        makeNode: (ep: RectangleEndpoint, style: PaintStyle) => {
            return _node("rect", {
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
