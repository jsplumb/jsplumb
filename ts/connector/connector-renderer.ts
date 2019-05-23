import {PaintStyle} from "../styles";

export interface ConnectorRenderer<E> {
    paint(paintStyle:PaintStyle, extents?:any):void;
}
