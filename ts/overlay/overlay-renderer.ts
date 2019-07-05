import {PaintStyle} from "../styles";
import {PointArray} from "../core";
import {Component} from "../component/component";

export interface OverlayRenderer<E> {

    setHover(h:boolean):void;
    cleanup(force?:boolean):void;
    destroy(force?:boolean):void;
    setVisible(v:boolean):void;

    addClass(clazz:string):void;

    removeClass(clazz:string):void;



    draw(component:Component<HTMLElement>, currentConnectionPaintStyle:PaintStyle, absolutePosition?:PointArray):any;

    paint(params: any, extents?: any): void;

    //compute(ap:ComputedAnchorPosition, orientation:Orientation, paintStyle:PaintStyle, connectorPaintStyle:PaintStyle):void;
    //paint(paintStyle:PaintStyle, anchor:Anchor<E>):void;

}

export interface LabelOverlayRenderer<E> extends OverlayRenderer<E> {
    setText(t:string):void;
}
