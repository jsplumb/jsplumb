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
import {BrowserJsPlumbInstance, IS, isFunction, OverlayCapableComponent, PaintStyle} from "..";
import {CustomOverlay} from "../overlay/custom-overlay";

export type EndpointHelperFunctions = {
    makeNode:(instance:jsPlumbInstance<any>, ep:any, paintStyle:PaintStyle) => void,
    updateNode: (ep:any, node:SVGElement) => void
};

const endpointMap:Dictionary<EndpointHelperFunctions> = {};
export function registerEndpointRenderer<C>(name:string, fns:EndpointHelperFunctions) {
    endpointMap[name] = fns;
}

export class BrowserRenderer implements Renderer<HTMLElement> {

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


    repaint(component: Component<HTMLElement>, typeDescriptor: string, options?: RepaintOptions): void {
        console.log("doing a repaint of " + typeDescriptor);
    }

    private getLabelElement(o:LabelOverlay<HTMLElement>):HTMLElement {
        return HTMLElementOverlay.getElement(o as any);
    }

    private getCustomElement(o:CustomOverlay<HTMLElement>):HTMLElement {
        return HTMLElementOverlay.getElement(o as any, o.component, (c:Component<HTMLElement>) => {
            const el = o.create(c);
            o.instance.addClass(el, o.instance.overlayClass);
            return el;
        });
    }

    addOverlayClass(o: Overlay<HTMLElement>, clazz: string): void {

        if (o.type === "Label") {
            o.instance.addClass(this.getLabelElement(o as LabelOverlay<HTMLElement>), clazz);
        } else if (o.type === "Arrow") {

        } else if (o.type === "Custom") {
            o.instance.addClass(this.getCustomElement(o as CustomOverlay<HTMLElement>), clazz);
        } else {
            throw "Could not add class to overlay of type [" + o.type + "]";
        }
     }

    //
    removeOverlayClass(o: Overlay<HTMLElement>, clazz: string): void {
        if (o.type === "Label") {
            o.instance.removeClass(this.getLabelElement(o as LabelOverlay<HTMLElement>), clazz);
        } else if (o.type === "Arrow") {

        } else if (o.type === "Custom") {
            o.instance.removeClass(this.getCustomElement(o as CustomOverlay<HTMLElement>), clazz);
        } else {
            throw "Could not remove class from overlay of type [" + o.type + "]";
        }
    }

    paintOverlay(o: Overlay<HTMLElement>, params:any, extents:any):void {

        //
        if (o.type === "Label") {

            this.getLabelElement(o as LabelOverlay<HTMLElement>);

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
            this.getCustomElement(o as CustomOverlay<HTMLElement>);

            const XY = o.component.getXY(); // this.canvas.style.left = XY.x +  params.d.minx + "px";  // wont work for endpoint. abstracts
            // this.canvas.style.top = XY.y + params.d.miny + "px";

            (o as any).canvas.style.left = XY.x + params.d.minx + "px"; // wont work for endpoint. abstracts
            (o as any).canvas.style.top = XY.y + params.d.miny + "px";
        } else {
            throw "Could not paint overlay of type [" + o.type + "]";
        }
    }

    setOverlayVisible(o: Overlay<HTMLElement>, visible:boolean):void {

        if (o.type === "Label") {
            this.getLabelElement(o as LabelOverlay<HTMLElement>).style.display = visible ? "block" : "none";
        }
        else if (o.type === "Custom") {
            this.getCustomElement(o as CustomOverlay<HTMLElement>).style.display = visible ? "block" : "none";
        }
    }

    moveOverlayParent(o: Overlay<HTMLElement>, newParent: HTMLElement): void {
        if (o.type === "Label" || o.type === "Custom") {
            o.instance.appendElement((o as any).canvas, this.instance.getContainer());
        } else {
            // dont need to do anything with other types. seemingly. but why not.
        }

    }

    reattachOverlay(o: Overlay<HTMLElement>, c: OverlayCapableComponent<HTMLElement>): any {
        if (o.type === "Label" || o.type === "Custom") {
            o.instance.appendElement((o as any).canvas, this.instance.getContainer());
        }
        else if (o.type === "Arrow") {
            this.instance.appendElement((o as any).path, (c as any).connector.canvas);
        }
    }

    destroyOverlay(o: Overlay<HTMLElement>):void {
        if (o.type === "Label") {
            const el = this.getLabelElement(o as LabelOverlay<HTMLElement>);
            el.parentNode.removeChild(el);
            delete (o as any).canvas;
            delete (o as any).cachedDimensions;
        } else if (o.type === "Arrow") {
            SVGElementOverlay.destroy(o as any);
        } else if (o.type === "Custom") {
            const el = this.getCustomElement(o as CustomOverlay<HTMLElement>);
            el.parentNode.removeChild(el);
            delete (o as any).canvas;
            delete (o as any).cachedDimensions;
        }
    }

    drawOverlay(o: Overlay<HTMLElement>, component: any, paintStyle: PaintStyle, absolutePosition?: [number, number]): any {
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
        } else if (o.type === "Custom") {
            console.log("draw custom");
        } else {
            throw "Could not draw overlay of type [" + o.type + "]";
        }
    }

    updateLabel(o: LabelOverlay<HTMLElement>): void {

        if (isFunction(o.label)) {
            let lt = (o.label as Function)(this);
            if (lt != null) {
                this.getLabelElement(o).innerHTML = lt.replace(/\r\n/g, "<br/>");
            } else {
                this.getLabelElement(o).innerHTML = "";
            }
        }
        else {
            if (o.labelText == null) {
                o.labelText = o.label as string;
                if (o.labelText != null) {
                    this.getLabelElement(o).innerHTML = o.labelText.replace(/\r\n/g, "<br/>");
                } else {
                    this.getLabelElement(o).innerHTML = "";
                }
            }
        }
    }

    // ------------------------------- connectors ---------------------------------------------------------


    paintConnector(connector:AbstractConnector<HTMLElement>, paintStyle:PaintStyle, extents?:any):void {
        //const el = SvgElementConnector.getConnectorElement(connector);
        //if (el != null) {

            //connectorRenderers[connector.type].paint(connector, el, paintStyle, extents);
            SvgElementConnector.paint(connector, paintStyle, extents);

        // } else {
        //     console.log("JSPLUMB: cannot paint connector of type [" + connector.type + "]; SVG element is null");
        // }
        //debugger;
    }

    setConnectorHover(connector:AbstractConnector<HTMLElement>, h:boolean):void {

    }

    private cleanup(component: any) {
        if (component.canvas) {
            component.canvas.parentNode.removeChild(component.canvas);
        }

        delete component.canvas;
        delete component.svg;
    }

    destroyConnector(connector:AbstractConnector<HTMLElement>):void {
        this.cleanup(connector);
    }

    addConnectorClass(connector:AbstractConnector<HTMLElement>, clazz:string):void {
        if ((connector as any).canvas) {
            this.instance.addClass((connector as any).canvas, clazz);
        }
    }

    removeConnectorClass(connector:AbstractConnector<HTMLElement>, clazz:string):void {
        if ((connector as any).canvas) {
            this.instance.removeClass((connector as any).canvas, clazz);
        }
    }

    private setVisible(component: any, v:boolean) {
        if (component.canvas) {
            component.canvas.style.display = v ? "block" : "none";
        }
    }

    setConnectorVisible(connector:AbstractConnector<HTMLElement>, v:boolean):void {
        this.setVisible(connector, v);
    }

    applyConnectorType(connector:AbstractConnector<HTMLElement>, t:TypeDescriptor):void {
        if ((connector as any).canvas && t.cssClass) {
            const classes = Array.isArray(t.cssClass) ? t.cssClass as Array<string> : [ t.cssClass ];
            this.instance.addClass((connector as any).canvas, classes.join(" "));
        }
    }

    moveConnectorParent(connector:AbstractConnector<HTMLElement>, newParent:HTMLElement):void {

    }

    addEndpointClass<C>(ep: EndpointRepresentation<HTMLElement, C>, c: string): void {
        if ((ep as any).canvas) {
            this.instance.addClass((ep as any).canvas, c);
        }
    }

    applyEndpointType<C>(ep: EndpointRepresentation<HTMLElement, C>, t: TypeDescriptor): void {
        if ((ep as any).canvas && t.cssClass) {
            const classes = Array.isArray(t.cssClass) ? t.cssClass as Array<string> : [ t.cssClass ];
            this.instance.addClass((ep as any).canvas, classes.join(" "));
        }
    }

    destroyEndpoint<C>(ep: EndpointRepresentation<HTMLElement, C>): void {
        this.cleanup(ep);
    }

    paintEndpoint<C>(ep: EndpointRepresentation<HTMLElement, C>, paintStyle: PaintStyle): void {
        const renderer = endpointMap[ep.getType()];
        if (renderer != null) {
            SvgEndpoint.paint(ep, renderer, paintStyle);
        } else {
            console.log("JSPLUMB: no endpoint renderer found for type [" + ep.typeId  + "]");
        }

    }

    moveEndpointParent<C>(endpoint:EndpointRepresentation<HTMLElement,C>, newParent:HTMLElement):void {

    }

    removeEndpointClass<C>(ep: EndpointRepresentation<HTMLElement, C>, c: string): void {
        if ((ep as any).canvas) {
            this.instance.removeClass((ep as any).canvas, c);
        }
    }

    setEndpointHover<C>(endpoint: EndpointRepresentation<HTMLElement, C>, h: boolean): void {
    }

    setEndpointVisible<C>(ep: EndpointRepresentation<HTMLElement, C>, v: boolean): void {
        this.setVisible(ep, v);
    }


    // TODO this isnt ideal, not pluggable. different representations should reguster t

// -------------------------------------------------- endpoints -------------------------------------


}

