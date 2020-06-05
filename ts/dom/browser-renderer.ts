import {Renderer} from "../renderer";
import {Segment} from "../connector/abstract-segment";
import {BezierSegment} from "../connector/bezier-segment";
import {ArcSegment} from "../connector/arc-segment";
import {Component, RepaintOptions} from "../component/component";
import {EndpointRepresentation} from "../endpoint/endpoints";
import {SvgEndpoint} from "./svg-element-endpoint";
import {Dictionary, jsPlumbInstance, TypeDescriptor} from "../core";
import {Overlay} from "../overlay/overlay";
import {HTMLElementOverlay} from "./html-element-overlay";
import {SVGElementOverlay} from "./svg-element-overlay";
import {SvgElementConnector} from "./svg-element-connector";
import {AbstractConnector} from "../connector/abstract-connector";
import {LabelOverlay} from "../overlay/label-overlay";
import {
    addClass,
    BrowserJsPlumbInstance,
    Connection,
    Endpoint,
    IS,
    isFunction,
    OverlayCapableComponent,
    PaintStyle, removeClass
} from "..";
import {CustomOverlay} from "../overlay/custom-overlay";

export type EndpointHelperFunctions = {
    makeNode:(instance:jsPlumbInstance, ep:any, paintStyle:PaintStyle) => void,
    updateNode: (ep:any, node:SVGElement) => void
};

const endpointMap:Dictionary<EndpointHelperFunctions> = {};
export function registerEndpointRenderer<C>(name:string, fns:EndpointHelperFunctions) {
    endpointMap[name] = fns;
}

export interface UIComponent {
    canvas: HTMLElement;
    svg:SVGElement;
}

export class BrowserRenderer implements Renderer {

    // this isnt the cleanest - the instance has to set this after creation, as this is created in the instance's constructor, so it
    // cant be passed in at the time.
    instance: BrowserJsPlumbInstance;

    getPath(segment:Segment, isFirstSegment:boolean):string {
        return ({
            "Straight": (isFirstSegment:boolean) => {
                return (isFirstSegment ? "M " + segment.x1 + " " + segment.y1 + " " : "") + "L " + segment.x2 + " " + segment.y2;
            },
            "Bezier": (isFirstSegment:boolean) => {
                let b = segment as BezierSegment;
                return (isFirstSegment ? "M " + b.x2 + " " + b.y2 + " " : "") +
                    "C " + b.cp2x + " " + b.cp2y + " " + b.cp1x + " " + b.cp1y + " " + b.x1 + " " + b.y1;
            },
            "Arc": (isFirstSegment:boolean) => {
                let a = segment as ArcSegment;
                let laf = a.sweep > Math.PI ? 1 : 0,
                    sf = a.anticlockwise ? 0 : 1;

                return  (isFirstSegment ? "M" + a.x1 + " " + a.y1  + " " : "")  + "A " + a.radius + " " + a.radius + " 0 " + laf + "," + sf + " " + a.x2 + " " + a.y2;
            }
        })[segment.type](isFirstSegment);
    }


    repaint(component: Component, typeDescriptor: string, options?: RepaintOptions): void {
        component.paint();
    }

    private static getLabelElement(o:LabelOverlay):HTMLElement {
        return HTMLElementOverlay.getElement(o as any);
    }

    private static getCustomElement(o:CustomOverlay):HTMLElement {
        return HTMLElementOverlay.getElement(o as any, o.component, (c:Component) => {
            const el = o.create(c);
            o.instance.addClass(el, o.instance.overlayClass);
            return el;
        });
    }

    private static cleanup(component: UIComponent) {
        if (component.canvas) {
            component.canvas.parentNode.removeChild(component.canvas);
        }

        delete component.canvas;
        delete component.svg;
    }

    private static setVisible(component: UIComponent, v:boolean) {
        if (component.canvas) {
            component.canvas.style.display = v ? "block" : "none";
        }
    }

    addOverlayClass(o: Overlay, clazz: string): void {

        if (o.type === "Label") {
            o.instance.addClass(BrowserRenderer.getLabelElement(o as LabelOverlay), clazz);
        } else if (o.type === "Arrow") {
            o.instance.addClass(SVGElementOverlay.ensurePath(o), clazz);
        } else if (o.type === "Custom") {
            o.instance.addClass(BrowserRenderer.getCustomElement(o as CustomOverlay), clazz);
        } else {
            throw "Could not add class to overlay of type [" + o.type + "]";
        }
     }

    //
    removeOverlayClass(o: Overlay, clazz: string): void {
        if (o.type === "Label") {
            o.instance.removeClass(BrowserRenderer.getLabelElement(o as LabelOverlay), clazz);
        } else if (o.type === "Arrow") {
            o.instance.removeClass(SVGElementOverlay.ensurePath(o), clazz);
        } else if (o.type === "Custom") {
            o.instance.removeClass(BrowserRenderer.getCustomElement(o as CustomOverlay), clazz);
        } else {
            throw "Could not remove class from overlay of type [" + o.type + "]";
        }
    }

    paintOverlay(o: Overlay, params:any, extents:any):void {

        //
        if (o.type === "Label") {

            BrowserRenderer.getLabelElement(o as LabelOverlay);

            const XY = o.component.getXY(); // this.canvas.style.left = XY.x +  params.d.minx + "px";  // wont work for endpoint. abstracts
            // this.canvas.style.top = XY.y + params.d.miny + "px";

            (o as any).canvas.style.left = XY.x + params.d.minx + "px"; // wont work for endpoint. abstracts
            (o as any).canvas.style.top = XY.y + params.d.miny + "px";

        } else if (o.type === "Arrow") {

            const path = (isNaN(params.d.cxy.x) || isNaN(params.d.cxy.y)) ? "M 0 0" : "M" + params.d.hxy.x + "," + params.d.hxy.y +
                " L" + params.d.tail[0].x + "," + params.d.tail[0].y +
                " L" + params.d.cxy.x + "," + params.d.cxy.y +
                " L" + params.d.tail[1].x + "," + params.d.tail[1].y +
                " L" + params.d.hxy.x + "," + params.d.hxy.y;

            SVGElementOverlay.paint(o, path, params, extents);

        } else if (o.type === "Custom") {
            BrowserRenderer.getCustomElement(o as CustomOverlay);

            const XY = o.component.getXY(); // this.canvas.style.left = XY.x +  params.d.minx + "px";  // wont work for endpoint. abstracts
            // this.canvas.style.top = XY.y + params.d.miny + "px";

            (o as any).canvas.style.left = XY.x + params.d.minx + "px"; // wont work for endpoint. abstracts
            (o as any).canvas.style.top = XY.y + params.d.miny + "px";
        } else {
            throw "Could not paint overlay of type [" + o.type + "]";
        }
    }

    setOverlayVisible(o: Overlay, visible:boolean):void {

        if (o.type === "Label") {
            BrowserRenderer.getLabelElement(o as LabelOverlay).style.display = visible ? "block" : "none";
        }
        else if (o.type === "Custom") {
            BrowserRenderer.getCustomElement(o as CustomOverlay).style.display = visible ? "block" : "none";
        } else if (o.type === "Arrow") {
            (o as any).path.style.display = visible ? "block" : "none";
        }
    }

    moveOverlayParent(o: Overlay, newParent: HTMLElement): void {
        if (o.type === "Label") {
            o.instance.appendElement(BrowserRenderer.getLabelElement(o as any), this.instance.getContainer());
        } else if (o.type === "Custom") {
            o.instance.appendElement(BrowserRenderer.getCustomElement(o as any), this.instance.getContainer());
        }
        else if (o.type === "Arrow"){
            // dont need to do anything with other types. seemingly. but why not.
        }
    }

    reattachOverlay(o: Overlay, c: OverlayCapableComponent): any {
        if (o.type === "Label") {
            o.instance.appendElement(BrowserRenderer.getLabelElement(o as any), this.instance.getContainer());
        }
        else if (o.type === "Custom") {
            o.instance.appendElement(BrowserRenderer.getCustomElement(o as any), this.instance.getContainer());
        }
        else if (o.type === "Arrow") {
            this.instance.appendElement(SVGElementOverlay.ensurePath(o), (c as any).connector.canvas);
        }
    }

    setOverlayHover(o: Overlay, hover: boolean): any {

        const method = hover ? "addClass" : "removeClass";
        let canvas;

        if (o.type === "Label") {
            canvas = BrowserRenderer.getLabelElement(o as any);
        }
        else if (o.type === "Custom") {
            canvas = BrowserRenderer.getCustomElement(o as any)
        }
        else if (o.type === "Arrow") {
            canvas = SVGElementOverlay.ensurePath(o);
        }

        if (canvas != null) {
            if (this.instance.hoverClass != null) {
                this.instance[method](canvas, this.instance.hoverClass);
            }

            this.setHover(o.component, hover);
        }
    }

    destroyOverlay(o: Overlay):void {
        if (o.type === "Label") {
            const el = BrowserRenderer.getLabelElement(o as LabelOverlay);
            el.parentNode.removeChild(el);
            delete (o as any).canvas;
            delete (o as any).cachedDimensions;
        } else if (o.type === "Arrow") {
            SVGElementOverlay.destroy(o);
        } else if (o.type === "Custom") {
            const el = BrowserRenderer.getCustomElement(o as CustomOverlay);
            el.parentNode.removeChild(el);
            delete (o as any).canvas;
            delete (o as any).cachedDimensions;
        }
    }

    drawOverlay(o: Overlay, component: any, paintStyle: PaintStyle, absolutePosition?: [number, number]): any {
        if (o.type === "Label"|| o.type === "Custom") {

            //  TO DO - move to a static method, or a shared method, etc.  (? future me doesnt know what that means.)

            let td = HTMLElementOverlay._getDimensions(o as any);//._getDimensions();
            if (td != null && td.length === 2) {

                let cxy = {x: 0, y: 0};
                if (absolutePosition) {
                    cxy = {x: absolutePosition[0], y: absolutePosition[1]};
                } else if (component instanceof EndpointRepresentation) {
                    let locToUse: [number, number] = o.location.constructor === Array ? ((<unknown>o.location) as [number, number]) : o.endpointLocation || [o.location, o.location];
                    cxy = {
                        x: locToUse[0] * component.w,
                        y: locToUse[1] * component.h
                    };
                } else {
                    let loc = o.location, absolute = false;
                    if (IS.aString(o.location) || o.location < 0 || o.location > 1) {
                        loc = parseInt("" + o.location, 10);
                        absolute = true;
                    }
                    cxy = (<any>component).pointOnPath(loc as number, absolute);  // a connection
                }

                let minx = cxy.x - (td[0] / 2),
                    miny = cxy.y - (td[1] / 2);

                return {
                    component: o,
                    d: {minx: minx, miny: miny, td: td, cxy: cxy},
                    minX: minx,
                    maxX: minx + td[0],
                    minY: miny,
                    maxY: miny + td[1]
                };
            }
            else {
                return {minX: 0, maxX: 0, minY: 0, maxY: 0};
            }

        } else if (o.type === "Arrow") {
            return (o as any).draw(component, paintStyle, absolutePosition);
        } else {
            throw "Could not draw overlay of type [" + o.type + "]";
        }
    }

    updateLabel(o: LabelOverlay): void {

        if (isFunction(o.label)) {
            let lt = (o.label as Function)(this);
            if (lt != null) {
                BrowserRenderer.getLabelElement(o).innerHTML = lt.replace(/\r\n/g, "<br/>");
            } else {
                BrowserRenderer.getLabelElement(o).innerHTML = "";
            }
        }
        else {
            if (o.labelText == null) {
                o.labelText = o.label as string;
                if (o.labelText != null) {
                    BrowserRenderer.getLabelElement(o).innerHTML = o.labelText.replace(/\r\n/g, "<br/>");
                } else {
                    BrowserRenderer.getLabelElement(o).innerHTML = "";
                }
            }
        }
    }

    setHover(component: Component, hover: boolean): void {
        component._jsPlumb.hover = hover;
        if (component instanceof Endpoint && (component as Endpoint).endpoint != null) {
            this.setEndpointHover((component as Endpoint).endpoint, hover);
        } else if (component instanceof Connection && (component as Connection).connector != null) {
            this.setConnectorHover((component as Connection).connector, hover);
        }
    }

    // ------------------------------- connectors ---------------------------------------------------------

    paintConnector(connector:AbstractConnector, paintStyle:PaintStyle, extents?:any):void {
        SvgElementConnector.paint(connector, paintStyle, extents);
    }

    setConnectorHover(connector:AbstractConnector, h:boolean, doNotCascade?:boolean):void {
        if (h === false || (!this.instance.currentlyDragging && !this.instance.isHoverSuspended())) {

            const method = h ? "addClass" : "removeClass";
            const canvas = (connector as any).canvas;

            if (canvas != null) {
                if (this.instance.hoverClass != null) {
                    this.instance[method](canvas, this.instance.hoverClass);
                }
            }
            if (connector.connection.hoverPaintStyle != null) {
                connector.connection.paintStyleInUse = h ? connector.connection.hoverPaintStyle : connector.connection.paintStyle;
                if (!this.instance._suspendDrawing) {
                    connector.connection.paint(connector.connection.paintStyleInUse);
                }
            }

            if (!doNotCascade) {

                this.setEndpointHover(connector.connection.endpoints[0].endpoint, h, true);
                this.setEndpointHover(connector.connection.endpoints[1].endpoint, h, true);
            }
        }
    }

    destroyConnection(connection:Connection):void {
        if (connection.connector != null) {
            BrowserRenderer.cleanup(connection.connector as any);
        }
    }

    addConnectorClass(connector:AbstractConnector, clazz:string):void {
        if ((connector as any).canvas) {
            this.instance.addClass((connector as any).canvas, clazz);
        }
    }

    removeConnectorClass(connector:AbstractConnector, clazz:string):void {
        if ((connector as any).canvas) {
            this.instance.removeClass((connector as any).canvas, clazz);
        }
    }

    getConnectorClass(connector: AbstractConnector): string {
        if ((connector as any).canvas) {
            return (connector as any).canvas.className.baseVal;
        } else {
            return "";
        }
    }

    setConnectorVisible(connector:AbstractConnector, v:boolean):void {
        BrowserRenderer.setVisible(connector as any, v);
    }

    applyConnectorType(connector:AbstractConnector, t:TypeDescriptor):void {
        if ((connector as any).canvas && t.cssClass) {
            const classes = Array.isArray(t.cssClass) ? t.cssClass as Array<string> : [ t.cssClass ];
            this.instance.addClass((connector as any).canvas, classes.join(" "));
        }
    }

    addEndpointClass<C>(ep: EndpointRepresentation<C>, c: string): void {
        if ((ep as any).canvas) {
            this.instance.addClass((ep as any).canvas, c);
        }
    }

    applyEndpointType<C>(ep: EndpointRepresentation<C>, t: TypeDescriptor): void {
        if ((ep as any).canvas && t.cssClass) {
            const classes = Array.isArray(t.cssClass) ? t.cssClass as Array<string> : [ t.cssClass ];
            this.instance.addClass((ep as any).canvas, classes.join(" "));
        }
    }

    destroyEndpoint(ep: Endpoint): void {
        BrowserRenderer.cleanup(ep.endpoint as any);
    }

    paintEndpoint<C>(ep: EndpointRepresentation<C>, paintStyle: PaintStyle): void {
        const renderer = endpointMap[ep.getType()];
        if (renderer != null) {
            SvgEndpoint.paint(ep, renderer, paintStyle);
        } else {
            console.log("JSPLUMB: no endpoint renderer found for type [" + ep.typeId  + "]");
        }
    }

    removeEndpointClass<C>(ep: EndpointRepresentation<C>, c: string): void {
        if ((ep as any).canvas) {
            this.instance.removeClass((ep as any).canvas, c);
        }
    }

    getEndpointClass<C>(ep: EndpointRepresentation<C>): string {
        if ((ep as any).canvas) {
            return (ep as any).canvas.className;
        } else {
            return "";
        }
    }

    private static getEndpointCanvas<C>(ep:EndpointRepresentation<C>):any {
        return (ep as any).canvas;
    }

    refreshEndpoint(endpoint: Endpoint): void {
        if (endpoint.endpoint != null) {
            const c = BrowserRenderer.getEndpointCanvas(endpoint.endpoint);
            if (c != null) {

                if (endpoint.connections.length > 0) {
                    addClass(c, this.instance.endpointConnectedClass);
                } else {
                    removeClass(c, this.instance.endpointConnectedClass);
                }

                if (endpoint.isFull()) {
                    addClass(c, this.instance.endpointFullClass);
                } else {
                    removeClass(c, this.instance.endpointFullClass);
                }
            }
        }
    }

    setEndpointHover<C>(endpoint: EndpointRepresentation<C>, h: boolean, doNotCascade?:boolean): void {

        if (endpoint != null && (h === false || (!this.instance.currentlyDragging && !this.instance.isHoverSuspended()))) {

            const method = h ? "addClass" : "removeClass";
            const canvas = (endpoint as any).canvas;

            if (canvas != null) {
                if (this.instance.hoverClass != null) {
                    this.instance[method](canvas, this.instance.hoverClass);
                }
            }
            if (endpoint.endpoint.hoverPaintStyle != null) {
                endpoint.endpoint.paintStyleInUse = h ? endpoint.endpoint.hoverPaintStyle : endpoint.endpoint.paintStyle;
                if (!this.instance._suspendDrawing) {
                    endpoint.paint(endpoint.endpoint.paintStyleInUse);
                }
            }

            if (!doNotCascade) {
                // instruct attached connections to set hover, unless doNotCascade was true.
                for(let i = 0; i < endpoint.endpoint.connections.length; i++) {
                    this.setConnectorHover(endpoint.endpoint.connections[i].connector, h, true);
                }
            }
        }
    }

    setEndpointVisible<C>(ep: EndpointRepresentation<C>, v: boolean): void {
        BrowserRenderer.setVisible(ep as any, v);
    }

// -------------------------------------------------- endpoints -------------------------------------


}

