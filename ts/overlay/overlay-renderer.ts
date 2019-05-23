import {PaintStyle} from "../styles";

export interface OverlayRenderer<E> {

    setHover(h:boolean):void;
    cleanup(force?:boolean):void;
    destroy(force?:boolean):void;
    setVisible(v:boolean):void;

    setText(t:string):void;

    //compute(ap:ComputedAnchorPosition, orientation:Orientation, paintStyle:PaintStyle, connectorPaintStyle:PaintStyle):void;
    //paint(paintStyle:PaintStyle, anchor:Anchor<E>):void;

}
