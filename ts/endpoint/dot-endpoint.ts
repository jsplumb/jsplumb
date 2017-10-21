
import {AbstractEndpoint} from "./abstract-endpoint";
export class DotEndpoint extends AbstractEndpoint {

    radius:number;
    tipe:string = "Dot";
    defaultOffset:number;
    defaultInnerRadius:number;

    constructor(params:any) {
        super();
        params = params || {};
        this.radius = params.radius || 10;
        this.defaultOffset = 0.5 * this.radius;
        this.defaultInnerRadius = this.radius / 3;
    }

    _compute (anchorPoint:number[], orientation:string, endpointStyle:any, connectorPaintStyle:any):number[] {
        this.radius = endpointStyle.radius || this.radius;
        let x = anchorPoint[0] - this.radius,
            y = anchorPoint[1] - this.radius,
            w = this.radius * 2,
            h = this.radius * 2;

        if (endpointStyle.stroke) {
            let lw = endpointStyle.strokeWidth || 1;
            x -= lw;
            y -= lw;
            w += (lw * 2);
            h += (lw * 2);
        }
        return [ x, y, w, h, this.radius ];
    }
}
