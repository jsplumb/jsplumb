
import {AbstractEndpoint} from "./abstract-endpoint";
export class RectangleEndpoint extends AbstractEndpoint {

    tipe:string = "Rectangle";
    width:number;
    height:number;

    constructor(params:any) {
        super();
        params = params || {};
        this.width = params.width || 20;
        this.height = params.height || 20;
    }

    _compute (anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
        let width = endpointStyle.width || this.width,
            height = endpointStyle.height || this.height,
            x = anchorPoint[0] - (width / 2),
            y = anchorPoint[1] - (height / 2);

        return [ x, y, width, height];
    }
}