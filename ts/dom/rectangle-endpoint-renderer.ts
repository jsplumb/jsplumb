import {registerEndpointRenderer} from "./browser-renderer"

import { JsPlumbInstance} from '../core/core'
import { PaintStyle } from '../core/styles'
import { _attr, _node } from './svg-util'

registerEndpointRenderer("Rectangle", {
    makeNode :(instance:JsPlumbInstance, ep:any, style:PaintStyle) => {
        return _node("rect", {
            "width": ep.w,
            "height": ep.h
        })
    },

    updateNode :(ep:any, node:SVGElement) => {
        _attr(node, {
            "width": ep.w,
            "height": ep.h
        })
    }
})
