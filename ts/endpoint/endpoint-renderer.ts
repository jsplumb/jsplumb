import {PaintStyle} from "../styles";

/**
 * Models a renderer for Endpoints. We currently have one implementation of this, using SVG elements
 * in the browser. The intention is to support a server-side implementation, as well as, possibly,
 * a canvas renderer, and also perhaps a single SVG element renderer for the entire dataset.
 */
export interface EndpointRenderer<E> {

    setHover(h:boolean):void;
    cleanup(force?:boolean):void;
    destroy(force?:boolean):void;

    paint(paintStyle:PaintStyle):void;

}
