import {Bounds, Point} from "../abstract-component";

declare const Biltong;

export class PointOnPath {
    distance:number = Infinity;
    x:number = 0;
    y:number = 0;
    location:number = 0;

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

    abstract pointOnPath(location:number, absolute:boolean):Point;
    abstract gradientAtPoint(location:number, absolute:boolean):number;
    abstract pointAlongPathFrom(location:number, distance:number, absolute:boolean):Point;
}

export class StraightSegment extends Segment {
    tipe:string = "Straight";

    m:number;
    m2:number;
    x1:number;
    x2:number;
    y1:number;
    y2:number;

    constructor(params:any) {
        super(params);
        this.setCoordinates({x1: params.x1, y1: params.y1, x2: params.x2, y2: params.y2});
    }

    getGradient():number {
        return this.m;
    }

    getCoordinates ():any {
        return { x1: this.x1, y1: this.y1, x2: this.x2, y2: this.y2 };
    }

    setCoordinates (coords) :any{
        this.x1 = coords.x1;
        this.y1 = coords.y1;
        this.x2 = coords.x2;
        this.y2 = coords.y2;
        this._recalc();
    };

    getBounds():Bounds {
        return {
            minX: Math.min(this.x1, this.x2),
            minY: Math.min(this.y1, this.y2),
            maxX: Math.max(this.x1, this.x2),
            maxY: Math.max(this.y1, this.y2)
        };
    }

    /**
     * returns the gradient of the segment at the given point - which for us is constant.
     */
    gradientAtPoint (_) {
        return this.m;
    }

    pointOnPath(location:number, absolute:boolean):Point {
        if (location === 0 && !absolute) {
            return { x: this.x1, y: this.y1 };
        }
        else if (location === 1 && !absolute) {
            return { x: this.x2, y: this.y2 };
        }
        else {
            let l = absolute ? location > 0 ? location : this.length + location : location * this.length;
            return Biltong.pointOnLine({x: this.x1, y: this.y1}, {x: this.x2, y: this.y2}, l);
        }
    }

    pointAlongPathFrom(location:number, distance:number, absolute:boolean) {
        let p = this.pointOnPath(location, absolute),
            farAwayPoint = distance <= 0 ? {x: this.x1, y: this.y1} : {x: this.x2, y: this.y2 };


        if (distance <= 0 && Math.abs(distance) > 1) {
            distance *= -1;
        }

        return Biltong.pointOnLine(p, farAwayPoint, distance);
    }

    findClosestPointOnPath (x:number, y:number):any {
        let out = {
            d: Infinity,
            x: null,
            y: null,
            l: null,
            x1: this.x1,
            x2: this.x2,
            y1: this.y1,
            y2: this.y2
        };

        if (this.m === 0) {
            out.y = this.y1;
            out.x = this._within(this.x1, this.x2, x) ? x : this._closest(this.x1, this.x2, x);
        }
        else if (this.m === Infinity || this.m === -Infinity) {
            out.x = this.x1;
            out.y = this._within(this.y1, this.y2, y) ? y : this._closest(this.y1, this.y2, y);
        }
        else {
            // closest point lies on normal from given point to this line.
            let b = this.y1 - (this.m * this.x1),
                b2 = y - (this.m2 * x),
                // y1 = m.x1 + b and y1 = m2.x1 + b2
                // so m.x1 + b = m2.x1 + b2
                // x1(m - m2) = b2 - b
                // x1 = (b2 - b) / (m - m2)
                _x1 = (b2 - b) / (this.m - this.m2),
                _y1 = (this.m * _x1) + b;

            out.x = this._within(this.x1, this.x2, _x1) ? _x1 : this._closest(this.x1, this.x2, _x1);//_x1;
            out.y = this._within(this.y1, this.y2, _y1) ? _y1 : this._closest(this.y1, this.y2, _y1);//_y1;
        }

        let fractionInSegment = Biltong.lineLength([ out.x, out.y ], [ this.x1, this.y1 ]);
        out.d = Biltong.lineLength([x, y], [out.x, out.y]);
        out.l = fractionInSegment / this.length;
        return out;
    }

    private _recalc():void {
        this.length = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2));
        this.m = Biltong.gradient({x: this.x1, y: this.y1}, {x: this.x2, y: this.y2});
        this.m2 = -1 / this.m;
    }

    private _within (a:number, b:number, c:number):boolean {
        return c >= Math.min(a, b) && c <= Math.max(a, b);
    }

    // find which of a and b is closest to c
    private _closest (a:number, b:number, c:number):number {
        return Math.abs(c - a) < Math.abs(c - b) ? a : b;
    }
}