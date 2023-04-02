import {SvgComponent} from "./svg-component"
import {BrowserJsPlumbInstance, EndpointHelperFunctions} from "./browser-jsplumb-instance"

import {_node, _applyStyles, ELEMENT_SVG} from './svg-util'
import {EndpointRepresentation} from "../core/endpoint/endpoints"
import {ABSOLUTE, ATTRIBUTE_SCOPE_PREFIX, BLOCK, NONE} from "../core/constants"
import {PaintStyle, TRUE} from "../common/index"
import {extend} from "../util/util"

/**
 * Superclass for endpoint renderers that use an `svg` element wrapped in a `div` in the DOM.
 * Type specific subclasses are expected to implement a `makeNode` and `updateNode` method,
 * which respectively create the type-specific elements, and update them at paint time.
 */
export abstract class SvgEndpoint<C> {

    static getEndpointElement<C>(ep:EndpointRepresentation<C>):SVGElement {
        if ((ep as any).canvas != null) {
            return (ep as any).canvas
        } else {
            const canvas = _node(ELEMENT_SVG, {
                "style": "",
                "width": "0",
                "height": "0",
                "pointer-events": "all",// NONE,
                "position": ABSOLUTE
            });

            (ep as any).canvas = canvas

            const classes = ep.classes.join(" ")
            ep.instance.addClass(canvas, classes)

            const scopes = ep.endpoint.scope.split(/\s/)
            for (let i = 0; i < scopes.length; i++) {
                ep.instance.setAttribute(<any>canvas, ATTRIBUTE_SCOPE_PREFIX + scopes[i], TRUE)
            }

            ep.instance._appendElementToContainer(canvas)

            if ((ep as any).cssClass != null) {
                ep.instance.addClass(canvas, (ep as any).cssClass)
            }
            ep.instance.addClass(canvas, ep.instance.endpointClass)

            ;(canvas as any).jtk = (canvas as any).jtk || { }
            ;(canvas as any).jtk.endpoint = ep.endpoint

            canvas.style.display = ep.endpoint.visible !== false ? BLOCK : NONE

            return canvas as SVGElement
        }
    }

    static paint<C>(ep:EndpointRepresentation<C>, handlers:EndpointHelperFunctions<any>,  paintStyle: PaintStyle): void {

        if (ep.endpoint.deleted !== true) {
            this.getEndpointElement(ep)

            SvgComponent.paint(ep, ep.instance as BrowserJsPlumbInstance, paintStyle)
            //
            let s: PaintStyle = extend({}, paintStyle)
            if (s.outlineStroke) {
                s.stroke = s.outlineStroke
            }
            //
            if ((ep as any).node == null) {
                (ep as any).node = handlers.makeNode(ep, s);
                (ep as any).canvas.appendChild((ep as any).node)
            } else if (handlers.updateNode != null) {
                handlers.updateNode(ep, (ep as any).node)
            }

            _applyStyles((ep as any).canvas, (ep as any).node, s)
        }
    }
}

