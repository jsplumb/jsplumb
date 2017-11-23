export interface ConnectorRenderer {
    paint(style:any, anchor:any, extents:any):void;

    canvas:any;
    bgCanvas:any;
}