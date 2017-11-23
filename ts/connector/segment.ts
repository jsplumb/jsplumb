import {Bounds} from "../component/abstract-component";
import {Point} from "../component/ui-component";


declare const Biltong:any;

export class PointOnPath {
    distance:number = Infinity;
    x:number = 0;
    y:number = 0;
    location:number = 0;
    x1:number = 0;
    x2:number = 0;
    y1:number = 0;
    y2:number = 0;

    constructor(distance:number, x:number, y:number, location:number) {
        this.distance = distance;
        this.x = x;
        this.y = y;
        this.location = location;
    }
}

export abstract class Segment {

    params:any;
    abstract tipe:string;
    length:number = 0;

    constructor(params:any) {
        this.params = params;
    }

    findClosestPointOnPath(x:number, y:number):PointOnPath {
        return new PointOnPath(Infinity, null, null, null);
    }

    getLength():number {
        return this.length;
    }

    getBounds():Bounds {
        return {
            minX: Math.min(this.params.x1, this.params.x2),
            minY: Math.min(this.params.y1, this.params.y2),
            maxX: Math.max(this.params.x1, this.params.x2),
            maxY: Math.max(this.params.y1, this.params.y2)
        };
    }

    //abstract getCoordinates ():any;
    abstract pointOnPath(location:number, absolute?:Boolean):Point;
    abstract gradientAtPoint(location:number, absolute?:Boolean):number;
    abstract pointAlongPathFrom(location:number, distance:number, absolute?:Boolean):Point;
}



