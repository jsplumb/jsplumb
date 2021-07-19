import {registerEndpointRenderer} from "./browser-jsplumb-instance"

import { _attr, _node } from './svg-util'

import {RectangleEndpoint} from "@jsplumb/core"
import { PaintStyle } from "@jsplumb/common"

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
