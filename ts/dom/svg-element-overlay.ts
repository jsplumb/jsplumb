import {ArrowOverlayRenderer, LabelOverlayRenderer, OverlayRenderer} from "../overlay/overlay-renderer";
import {Overlay} from "../overlay/overlay";
import {jsPlumbInstance, PointArray} from "../core";
import {PaintStyle} from "../styles";
import {Component} from "../component/component";
import {_appendAtIndex, _attr, _node, Connection} from "..";
import {SvgElementConnector} from "./svg-element-connector";

export abstract class SVGElementOverlay implements OverlayRenderer<HTMLElement> {

    bgPath:SVGElement;
    path:SVGElement;

    constructor(public instance:jsPlumbInstance<HTMLElement>, public overlay: Overlay<HTMLElement>) {

    }


    setHover(h: boolean): void {
    }

    cleanup(force?: boolean): void {
    }

    destroy(force?: boolean): void {
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

        var clazz = "",//originalArgs && (originalArgs.length === 1) ? (originalArgs[0].cssClass || "") : "",
            offset = [0, 0];

        if (extents.xmin < 0) {
            offset[0] = -extents.xmin;
        }
        if (extents.ymin < 0) {
            offset[1] = -extents.ymin;
        }

        let a = {
            "d": this.makePath(params.d),
            "class": clazz,
            stroke: params.stroke ? params.stroke : null,
            fill: params.fill ? params.fill : null,
            transform: "translate(" + offset[0] + "," + offset[1] + ")",
            "pointer-events": "visibleStroke"
        };

        if (this.path == null) {
            this.path = _node(this.instance, "path", a);
            // here we're going to assume the overlay's component is a connection, rendered by this renderer.
            let connector = (this.overlay.component as Connection<HTMLElement>).getConnector().renderer as SvgElementConnector;
            _appendAtIndex(connector.svg, this.path, 1);//params.paintStyle.outlineStroke ? 1 : 0);
        }
        else {
            _attr(this.path, a);
        }
    }

    addClass(clazz: string):void {

    }

    removeClass(clazz: string):void {

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
