import {EndpointRepresentation} from "../endpoint/endpoints";
import {SvgComponent} from "../dom/svg-component";
import {PaintStyle} from "../styles";
import {_applyStyles, _node} from "../svg/svg-util";
import {EndpointHelperFunctions} from "./browser-renderer";
import {extend} from "../core";
import {createElement, sizeElement} from "..";

/**
 * Superclass for endpoint renderers that use an `svg` element wrapped in a `div` in the DOM.
 * Type specific subclasses are expected to implement a `makeNode` and `updateNode` method,
 * which respectively create the type-specific elements, and update them at paint time.
 */
export abstract class SvgEndpoint<C> {

    static getEndpointElement<C>(ep:EndpointRepresentation<C>):HTMLElement {
        if ((ep as any).canvas != null) {
            return (ep as any).canvas;
        } else {
            const svg:any = _node(ep.instance, "svg", {
                "style": "",
                "width": "0",
                "height": "0",
                "pointer-events": "none",
                "position": "absolute"
            });
            (ep as any).svg = svg;


            const canvas:any = createElement("div", { position : "absolute" });
            (ep as any).canvas = canvas;

            const classes = ep.classes.join(" ");
            ep.instance.addClass(canvas, classes);

            const scopes = ep.endpoint.scope.split(/\s/);
            for (let i = 0; i < scopes.length; i++) {
                ep.instance.setAttribute(<any>canvas, "jtk-scope-" + scopes[i], "true");
            }

            if (!ep.instance._suspendDrawing) {
                sizeElement(canvas, 0, 0, 1, 1);
            }

            //(ep as any).canvas = svg;
            ep.instance.appendElement(canvas, ep.instance.getContainer());
            canvas.appendChild(svg);

            // TODO BG CANVAS! does it even need to be a canvas? i suppose not.

            if ((ep as any).cssClass != null) {
                ep.instance.addClass(canvas, (ep as any).cssClass);
            }
            ep.instance.addClass(canvas, ep.instance.endpointClass);

            canvas.jtk = canvas.jtk || { };
            canvas.jtk.endpoint = ep.endpoint;

            return canvas as HTMLElement;
        }
    }

    static paint<C>(ep:EndpointRepresentation<C>, handlers:EndpointHelperFunctions,  paintStyle: PaintStyle): void {

        this.getEndpointElement(ep);

        SvgComponent.paint(ep, true, paintStyle);
        //
        let s:PaintStyle = extend({}, paintStyle);
        if (s.outlineStroke) {
            s.stroke = s.outlineStroke;
        }
        //
        if ((ep as any).node == null) {
            (ep as any).node = handlers.makeNode(ep.instance, ep, s);
            (ep as any).svg.appendChild((ep as any).node);
        }
        else if (handlers.updateNode != null) {
            handlers.updateNode(ep, (ep as any).node);
        }

        _applyStyles((ep as any).canvas, (ep as any).node, s, [ ep.x, ep.y, ep.w, ep.h], null);
    }
}

