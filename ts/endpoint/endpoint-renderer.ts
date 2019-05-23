import {ComputedAnchorPosition, Orientation} from "../anchor/anchors";
import { Anchor } from "../anchor/anchor";
import {PaintStyle} from "../styles";

export interface EndpointRenderer<E> {

    setHover(h:boolean):void;
    cleanup(force?:boolean):void;
    destroy():void;

    //compute(ap:ComputedAnchorPosition, orientation:Orientation, paintStyle:PaintStyle, connectorPaintStyle:PaintStyle):void;
    paint(paintStyle:PaintStyle, anchor:Anchor<E>):void;

}
