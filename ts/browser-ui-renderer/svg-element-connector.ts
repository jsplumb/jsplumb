
import {extend, Extents} from "../util/util"

import {SvgComponent} from "./svg-component"
import {_appendAtIndex, _applyStyles, _attr, _node, ELEMENT_PATH, ELEMENT_SVG} from './svg-util'
import {BrowserJsPlumbInstance} from "./browser-jsplumb-instance"
import {PaintStyle} from "../common/paint-style"
import {AbstractConnector} from "../core/connector/abstract-connector"
import {ABSOLUTE, NONE} from "../core/constants"


export function paintSvgConnector(instance:BrowserJsPlumbInstance, connector:AbstractConnector, paintStyle:PaintStyle, extents?:Extents) {

    getConnectorElement(instance, connector)

    SvgComponent.paint(connector, instance, paintStyle, extents)

    let p = "", offset = [0, 0]
    if (extents.xmin < 0) {
        offset[0] = -extents.xmin
    }
    if (extents.ymin < 0) {
        offset[1] = -extents.ymin
    }

    if (connector.segments.length > 0) {

        p = instance.getPathData(connector)

        let a = {
                d: p,
                transform: "translate(" + offset[0] + "," + offset[1] + ")",
                "pointer-events": "visibleStroke"
            },
            outlineStyle:PaintStyle = null

        // outline style.  actually means drawing an svg object underneath the main one.
        if (paintStyle.outlineStroke) {
            let outlineWidth = paintStyle.outlineWidth || 1,
                outlineStrokeWidth = paintStyle.strokeWidth + (2 * outlineWidth)
            outlineStyle = extend({}, paintStyle)
            outlineStyle.stroke = paintStyle.outlineStroke
            outlineStyle.strokeWidth = outlineStrokeWidth

            if ((connector as any).bgPath == null) {
                (connector as any).bgPath = _node(ELEMENT_PATH, a)
                instance.addClass((connector as any).bgPath as any, instance.connectorOutlineClass)
                _appendAtIndex((connector as any).canvas, (connector as any).bgPath, 0)
            }
            else {
                _attr((connector as any).bgPath, a)
            }

            _applyStyles((connector as any).canvas, (connector as any).bgPath, outlineStyle)
        }

        const cany = connector as any

        if (cany.path == null) {
            cany.path = _node(ELEMENT_PATH, a)
            _appendAtIndex(cany.canvas, cany.path, paintStyle.outlineStroke ? 1 : 0)
        }
        else {
            // this can occur when a type is added and then removed: the path is a child of a previous svg container element
            if (cany.path.parentNode !== cany.canvas) {
                _appendAtIndex(cany.canvas, cany.path, paintStyle.outlineStroke ? 1 : 0);
            }
            _attr((connector as any).path, a)
        }

        _applyStyles((connector as any).canvas, (connector as any).path, paintStyle, )
    }
}

export function getConnectorElement(instance:BrowserJsPlumbInstance, c:AbstractConnector):SVGElement {
    if ((c as any).canvas != null) {
        return (c as any).canvas
    } else {
        const svg:any = _node(ELEMENT_SVG, {
            "style": "",
            "width": "0",
            "height": "0",
            "pointer-events": NONE,
            "position": ABSOLUTE
        });
        (c as any).canvas = svg
        instance._appendElement((c as any).canvas, instance.getContainer())

        // TODO BG CANVAS! does it even need to be a canvas? i suppose not.

        if (c.cssClass != null) {
            instance.addClass(svg, c.cssClass)
        }
        instance.addClass(svg, instance.connectorClass)

        svg.jtk = svg.jtk || { }
        svg.jtk.connector = c

        return svg as SVGElement
    }
}
