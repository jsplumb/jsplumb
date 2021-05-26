import {SvgComponent} from "./svg-component"
import {ELEMENT_DIV, EndpointHelperFunctions} from "./browser-jsplumb-instance"
import { createElement } from './browser-util'

import {_node, _applyStyles, _size, ELEMENT_SVG} from './svg-util'
import {
    ABSOLUTE,
    ATTRIBUTE_SCOPE_PREFIX,
    BLOCK,
    EndpointRepresentation,
    NONE,
    PaintStyle,
    TRUE
} from "@jsplumb/core"

import { extend } from "@jsplumb/util"

/**
 * Superclass for endpoint renderers that use an `svg` element wrapped in a `div` in the DOM.
 * Type specific subclasses are expected to implement a `makeNode` and `updateNode` method,
 * which respectively create the type-specific elements, and update them at paint time.
 */
export abstract class SvgEndpoint<C> {

    static getEndpointElement<C>(ep:EndpointRepresentation<C>):HTMLElement {
        if ((ep as any).canvas != null) {
            return (ep as any).canvas
        } else {
            const svg = _node(ELEMENT_SVG, {
                "style": "",
                "width": "0",
                "height": "0",
                "pointer-events": NONE,
                "position": ABSOLUTE
            });
            (ep as any).svg = svg

            const canvas:any = createElement(ELEMENT_DIV, { position : ABSOLUTE });
            (ep as any).canvas = canvas

            const classes = ep.classes.join(" ")
            ep.instance.addClass(canvas, classes)

            const scopes = ep.endpoint.scope.split(/\s/)
            for (let i = 0; i < scopes.length; i++) {
                ep.instance.setAttribute(<any>canvas, ATTRIBUTE_SCOPE_PREFIX + scopes[i], TRUE)
            }

            if (!ep.instance._suspendDrawing) {
                _size(canvas, 0, 0, 1, 1)
            }

            ep.instance._appendElement(canvas, ep.instance.getContainer())
            canvas.appendChild(svg)

            if ((ep as any).cssClass != null) {
                ep.instance.addClass(canvas, (ep as any).cssClass)
            }
            ep.instance.addClass(canvas, ep.instance.endpointClass)

            canvas.jtk = canvas.jtk || { }
            canvas.jtk.endpoint = ep.endpoint

            canvas.style.display = ep.endpoint.visible !== false ? BLOCK : NONE

            return canvas as HTMLElement
        }
    }

    static paint<C>(ep:EndpointRepresentation<C>, handlers:EndpointHelperFunctions<any>,  paintStyle: PaintStyle): void {

        this.getEndpointElement(ep)

        SvgComponent.paint(ep, true, paintStyle)
        //
        let s:PaintStyle = extend({}, paintStyle)
        if (s.outlineStroke) {
            s.stroke = s.outlineStroke
        }
        //
        if ((ep as any).node == null) {
            (ep as any).node = handlers.makeNode(ep, s);
            (ep as any).svg.appendChild((ep as any).node)
        }
        else if (handlers.updateNode != null) {
            handlers.updateNode(ep, (ep as any).node)
        }

        _applyStyles((ep as any).canvas, (ep as any).node, s)
    }
}

