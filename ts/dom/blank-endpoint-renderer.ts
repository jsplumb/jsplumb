import {registerEndpointRenderer} from "./browser-renderer"
import { _attr, _node, ElementAttributes } from './svg-util'

import { JsPlumbInstance } from '../core/core'
import { PaintStyle } from '../core/styles'

const BLANK_ATTRIBUTES:ElementAttributes = {
    "width": 10,
    "height": 0,
    "fill":"transparent",
    "stroke":"transparent"
}

registerEndpointRenderer("Blank", {
    makeNode : (instance:JsPlumbInstance, ep:any, style:PaintStyle) => {
        return _node("rect", BLANK_ATTRIBUTES)
    },

    updateNode : (ep:any, node:SVGElement) => {
        _attr(node, BLANK_ATTRIBUTES)
    }
})
