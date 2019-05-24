import {Renderer} from "../renderer";
import {Segment} from "../connector/abstract-segment";
import {StraightSegment} from "../connector/straight-segment";
import {BezierSegment} from "../connector/bezier-segment";
import {ArcSegment} from "../connector/arc-segment";
import {Component, RepaintOptions} from "../component/component";

import {EndpointRenderer} from "../endpoint/endpoint-renderer";
import {EndpointRepresentation} from "../endpoint/endpoints";

import {OverlayRenderer} from "../overlay/overlay-renderer";

import {SvgEndpoint} from "./svg-element-endpoint";
import {Constructable, Dictionary, jsPlumbInstance} from "../core";
import {Overlay} from "../overlay/overlay";
import {HTMLElementOverlay, HTMLLabelElementOverlay} from "./html-element-overlay";
import {SVGElementOverlay} from "./svg-element-overlay";
import {ConnectorRenderer} from "../connector/connector-renderer";
import {SvgElementConnector} from "./svg-element-connector";
import {AbstractConnector} from "../connector/abstract-connector";
import {LabelOverlay} from "../overlay/label-overlay";

const endpointMap:Dictionary<Constructable<SvgEndpoint<any>>> = {};
export function registerEndpointRenderer<C>(name:string, ep:Constructable<SvgEndpoint<C>>) {
    endpointMap[name] = ep;
}


export class BrowserRenderer implements Renderer<HTMLElement> {

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


    assignRenderer<C>(instance:jsPlumbInstance<HTMLElement>,
                      ep: EndpointRepresentation<HTMLElement, C>,
                     options?:any): EndpointRenderer<HTMLElement> {

        let t = ep.getType();
        let c:Constructable<SvgEndpoint<C>> = endpointMap[t];
        if (!c) {
            throw {message:"jsPlumb: no render for endpoint of type '" + t + "'"};
        } else {
            return new c(instance, ep, options) as SvgEndpoint<C>;
        }
    }


    assignOverlayRenderer(instance: jsPlumbInstance<HTMLElement>, o: Overlay<HTMLElement>): OverlayRenderer<HTMLElement> {
        return o.type === "Label" ? new HTMLLabelElementOverlay(instance, o as LabelOverlay<HTMLElement>) : new SVGElementOverlay(instance, o);
    }


    assignConnectorRenderer(instance: jsPlumbInstance<HTMLElement>, c: AbstractConnector<HTMLElement>): ConnectorRenderer<HTMLElement> {
        return new SvgElementConnector(instance, c);
    }
}

