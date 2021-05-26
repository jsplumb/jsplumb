
import {ABSOLUTE, AbstractConnector, NONE, PaintStyle} from "@jsplumb/core"
import {extend, Extents} from "@jsplumb/util"

import {SvgComponent} from "./svg-component"
import {_appendAtIndex, _applyStyles, _attr, _node, ELEMENT_PATH, ELEMENT_SVG} from './svg-util'
import {BrowserJsPlumbInstance} from "@jsplumb/browser-ui/browser-jsplumb-instance"


export function paintSvgConnector(instance:BrowserJsPlumbInstance, connector:AbstractConnector, paintStyle:PaintStyle, extents?:Extents) {

    getConnectorElement(instance, connector)

    SvgComponent.paint(connector, false, paintStyle, extents)

    let segments = connector.getSegments()

    let p = "", offset = [0, 0]
    if (extents.xmin < 0) {
        offset[0] = -extents.xmin
    }
    if (extents.ymin < 0) {
        offset[1] = -extents.ymin
    }

    if (segments.length > 0) {

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

        if ((connector as any).path == null) {
            (connector as any).path = _node(ELEMENT_PATH, a)
            _appendAtIndex((connector as any).canvas, (connector as any).path, paintStyle.outlineStroke ? 1 : 0)
        }
        else {
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
