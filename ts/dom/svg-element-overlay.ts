import {ArrowOverlayRenderer, LabelOverlayRenderer, OverlayRenderer} from "../overlay/overlay-renderer";
import {Overlay} from "../overlay/overlay";
import {jsPlumbInstance, PointArray} from "../core";
import {PaintStyle} from "../styles";
import {Component} from "../component/component";
import {_appendAtIndex, _attr, _node, Connection, Endpoint, SvgEndpoint} from "..";
import {SvgElementConnector} from "./svg-element-connector";
import * as Constants from "../constants";

export abstract class SVGElementOverlay implements OverlayRenderer<HTMLElement> {

    bgPath:SVGElement;
    path:SVGElement;

    constructor(public instance:jsPlumbInstance<HTMLElement>, public overlay: Overlay<HTMLElement>) {

        this.path = _node(this.instance, "path", {});
        let parent:SVGElement = null;

        if (this.overlay.component instanceof Connection) {
            let connector = (this.overlay.component as Connection<HTMLElement>).getConnector().renderer as SvgElementConnector;
            parent = connector.svg;
        } else if (this.overlay.component instanceof Endpoint) {
            let endpoint = (this.overlay.component as Endpoint<HTMLElement>).endpoint.renderer as SvgEndpoint<HTMLElement>;
            parent = endpoint.svg;
        }

        if (parent != null) {
            _appendAtIndex(parent, this.path, 1);//params.paintStyle.outlineStroke ? 1 : 0);
        }

        this.instance.addClass(<any>this.path, this.instance.overlayClass);

        (<any>this.path).jtk = { overlay:overlay };

    }


    setHover(h: boolean): void {
    }

    destroy(force?: boolean): void {

        if (this.path != null) {
            this.path.parentNode.removeChild(this.path);
        }

        if (this.bgPath != null) {
            this.bgPath.parentNode.removeChild(this.bgPath);
        }

        this.path = null;
        this.bgPath = null;
    }

    setVisible(v: boolean): void {
    }

    // setText(t: string): void {
    // }


    draw(component: Component<HTMLElement>, currentConnectionPaintStyle: PaintStyle, absolutePosition?: PointArray): any {
    //    return this.renderer.draw(component, currentConnectionPaintStyle, absolutePosition);
    }

    paint(params: any, extents: any): void {
        //return this.renderer.paint(params, extents);
        console.log("PAINt!");

        // let a = {
        //     d: "",
        //     //transform: "translate(" + offset[0] + "," + offset[1] + ")",
        //     "pointer-events": "visibleStroke"
        // };

        let offset = [0, 0];

        if (extents.xmin < 0) {
            offset[0] = -extents.xmin;
        }
        if (extents.ymin < 0) {
            offset[1] = -extents.ymin;
        }

        let a = {
            "d": this.makePath(params.d),
            stroke: params.stroke ? params.stroke : null,
            fill: params.fill ? params.fill : null,
            transform: "translate(" + offset[0] + "," + offset[1] + ")",
            "pointer-events": "visibleStroke"
        };

        // if (this.path == null) {
        //     this.path = _node(this.instance, "path", a);
        //     // here we're going to assume the overlay's component is a connection, rendered by this renderer.
        //     let connector = (this.overlay.component as Connection<HTMLElement>).getConnector().renderer as SvgElementConnector;
        //     _appendAtIndex(connector.svg, this.path, 1);//params.paintStyle.outlineStroke ? 1 : 0);
        // }
        // else {
            _attr(this.path, a);
        //}
    }

    addClass(clazz: string):void {

    }

    removeClass(clazz: string):void {

    }

    getElement(component:Component<HTMLElement>): HTMLElement {
        return <any>this.path;
    }

    moveParent(newParent: HTMLElement): void {
        // does nothing, as the DOM elements for this overlay type are children of the connector's dom element.
    }

    abstract makePath(d:any):string;
}

export class ArrowSVGElementOverlay extends SVGElementOverlay implements ArrowOverlayRenderer<HTMLElement> {

    makePath(d: any): string {
        return (isNaN(d.cxy.x) || isNaN(d.cxy.y)) ? "" : "M" + d.hxy.x + "," + d.hxy.y +
            " L" + d.tail[0].x + "," + d.tail[0].y +
            " L" + d.cxy.x + "," + d.cxy.y +
            " L" + d.tail[1].x + "," + d.tail[1].y +
            " L" + d.hxy.x + "," + d.hxy.y;
    }


}
