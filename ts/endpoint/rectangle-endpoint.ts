
import {Endpoint} from "../endpoint";
export class RectangleEndpoint<EventType, ElementType> extends Endpoint<EventType, ElementType> {

    tipe:string = "Rectangle";
    width:number;
    height:number;

    constructor(params:any) {
        super(params);
        params = params || {};
        this.width = params.width || 20;
        this.height = params.height || 20;
    }

    _compute (anchorPoint:[number, number], orientation:any, endpointStyle:any, connectorPaintStyle:any) {
        let width = endpointStyle.width || this.width,
            height = endpointStyle.height || this.height,
            x = anchorPoint[0] - (width / 2),
            y = anchorPoint[1] - (height / 2);

        return [ x, y, width, height];
    }
}

Endpoint.map["Rectangle"] = RectangleEndpoint;