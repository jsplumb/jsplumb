import {OverlayRenderer} from "../overlay/overlay-renderer";
import {Overlay} from "../overlay/overlay";
import {jsPlumbInstance} from "../core";

export class SVGElementOverlay implements OverlayRenderer<HTMLElement> {

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
}
