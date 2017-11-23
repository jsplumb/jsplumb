import {AbstractComponent} from "../component/abstract-component";
export abstract class AbstractEndpoint extends AbstractComponent {

    abstract _compute(anchorPoint:any, orientation:any, endpointStyle:any, connectorPaintStyle:any):any;

    compute(anchorPoint:any, orientation:any, endpointStyle:any, connectorPaintStyle:any) {
        let out = this._compute.apply(this, arguments);
        this.x = out[0];
        this.y = out[1];
        this.w = out[2];
        this.h = out[3];
        this.bounds.minX = this.x;
        this.bounds.minY = this.y;
        this.bounds.maxX = this.x + this.w;
        this.bounds.maxY = this.y + this.h;
        return out;
    }
}
