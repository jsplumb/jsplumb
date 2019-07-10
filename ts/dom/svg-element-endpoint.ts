import {EndpointRepresentation} from "../endpoint/endpoints";
import {SvgComponent, SvgComponentOptions} from "../svg/svg-component";
import {EndpointRenderer} from "../endpoint/endpoint-renderer";
import {PaintStyle} from "../styles";
import {_applyStyles, _attr, _node} from "../svg/svg-util";
import {ComputedDotEndpoint, DotEndpoint} from "../endpoint/dot-endpoint";
import {registerEndpointRenderer} from "./browser-renderer";
import {extend, jsPlumbInstance, TypeDescriptor} from "../core";
import {Endpoint} from "../endpoint/endpoint-impl";

/**
 * Superclass for endpoint renderers that use an `svg` element wrapped in a `div` in the DOM.
 * Type specific subclasses are expected to implement a `makeNode` and `updateNode` method,
 * which respectively create the type-specific elements, and update them at paint time.
 */
export abstract class SvgEndpoint<C> extends SvgComponent implements EndpointRenderer<HTMLElement> {

    protected node:SVGElement;

    abstract makeNode(s:PaintStyle):SVGElement;
    abstract updateNode(s:SVGElement):void;

    instance:jsPlumbInstance<HTMLElement>;

    constructor(protected endpoint:Endpoint<HTMLElement>, protected ep:EndpointRepresentation<HTMLElement, C>, options?:SvgComponentOptions) {
        super(endpoint.instance, ep, extend(options || {}, { useDivWrapper:true }));
        this.instance = endpoint.instance;
        this.instance.addClass(<any>this.canvas, "jtk-endpoint");
        this.instance.setAttribute(<any>this.svg, "pointer-events", "all");
        (<any>this.canvas)._jsPlumb = {endpoint:endpoint, ep:ep};

        if (endpoint.cssClass != null) {
            this.instance.addClass(this.canvas, endpoint.cssClass);
        }

        const scopes = endpoint.scope.split(/\s/);
        for (let i = 0; i < scopes.length; i++) {
            this.instance.setAttribute(<any>this.canvas, "jtk-scope-" + scopes[i], "true");
        }
    }

    getElement(): HTMLElement {
        return <any>this.canvas;
    }

    paint(paintStyle: PaintStyle): void {

        super.paint(paintStyle);

        let s:PaintStyle = extend({}, paintStyle);
        if (s.outlineStroke) {
            s.stroke = s.outlineStroke;
        }

        if (this.node == null) {
            this.node = this.makeNode(s);
            this.svg.appendChild(this.node);
        }
        else if (this.updateNode != null) {
            this.updateNode(this.node);
        }

        _applyStyles(this.canvas, this.node, s, [ this.ep.x, this.ep.y, this.ep.w, this.ep.h], null);

    }

    applyType(t: TypeDescriptor): void {
        if (t.cssClass != null && this.svg) {
            this.instance.addClass(<any>this.canvas, t.cssClass);
        }
    }

}

