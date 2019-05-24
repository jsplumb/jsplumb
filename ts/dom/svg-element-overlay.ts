import {OverlayRenderer} from "../overlay/overlay-renderer";
import {Overlay} from "../overlay/overlay";
import {jsPlumbInstance, PointArray} from "../core";
import {PaintStyle} from "../styles";
import {Component} from "../component/component";

export class SVGElementOverlay implements OverlayRenderer<HTMLElement> {

    renderer:OverlayRenderer<HTMLElement>;

    constructor(private instance:jsPlumbInstance<HTMLElement>, public overlay: Overlay<HTMLElement>) {

    }


    setHover(h: boolean): void {
    }

    cleanup(force?: boolean): void {
    }

    destroy(force?: boolean): void {
    }

    setVisible(v: boolean): void {
    }

    setText(t: string): void {
    }


    draw(component: Component<HTMLElement>, currentConnectionPaintStyle: PaintStyle, absolutePosition?: PointArray): any {
        return this.renderer.draw(component, currentConnectionPaintStyle, absolutePosition);
    }

    paint(params: any, extents?: any): void {
        return this.renderer.paint(params, extents);
    }
}
