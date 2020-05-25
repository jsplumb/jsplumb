import {AbstractSegment} from "./abstract-segment";
import {jsPlumbInstance, PointXY} from "../core";
import {normal, theta, TWO_PI} from "../geom";

const VERY_SMALL_VALUE = 0.0000000001;

function gentleRound (n:number):number {
    let f = Math.floor(n), r = Math.ceil(n);
    if (n - f < VERY_SMALL_VALUE) {
        return f;
    }
    else if (r - n < VERY_SMALL_VALUE) {
        return r;
    }
    return n;
}

export class ArcSegment extends AbstractSegment {

    type = "Arc";

    cx:number;
    cy:number;

    radius:number;
    anticlockwise:boolean;
    startAngle:number;
    endAngle:number;

    sweep:number;
    length:number;
    circumference:number;
    frac:number;

    constructor(instance:jsPlumbInstance<any>, params:any) {

        super(params);

        this.cx = params.cx;
        this.cy = params.cy;
        this.radius = params.r;
        this.anticlockwise = params.ac;

        if (params.startAngle && params.endAngle) {

            this.startAngle = params.startAngle;
            this.endAngle = params.endAngle;

            this.x1 = this.cx + (this.radius * Math.cos(this.startAngle));
            this.y1 = this.cy + (this.radius * Math.sin(this.startAngle));
            this.x2 = this.cx + (this.radius * Math.cos(this.endAngle));
            this.y2 = this.cy + (this.radius * Math.sin(this.endAngle));
        }
        else {
            this.startAngle = this._calcAngle(this.x1, this.y1);
            this.endAngle = this._calcAngle(this.x2, this.y2);
        }

        if (this.endAngle < 0) {
            this.endAngle += TWO_PI;
        }
        if (this.startAngle < 0) {
            this.startAngle += TWO_PI;
        }

        let ea = this.endAngle < this.startAngle ? this.endAngle + TWO_PI : this.endAngle;
        this.sweep = Math.abs(ea - this.startAngle);
        if (this.anticlockwise) {
            this.sweep = TWO_PI - this.sweep;
        }

        this.circumference = 2 * Math.PI * this.radius;
        this.frac = this.sweep / TWO_PI;
        this.length = this.circumference * this.frac;

        this.bounds = {
            minX: this.cx - this.radius,
            maxX: this.cx + this.radius,
            minY: this.cy - this.radius,
            maxY: this.cy + this.radius
        }
    }


    private _calcAngle (_x:number, _y:number):number {
        return theta({x:this.cx, y:this.cy}, {x:_x, y:_y});
    }

    private _calcAngleForLocation (segment:ArcSegment, location:number):number {
        if (segment.anticlockwise) {
            let sa = segment.startAngle < segment.endAngle ? segment.startAngle + TWO_PI : segment.startAngle,
                s = Math.abs(sa - segment.endAngle);
            return sa - (s * location);
        }
        else {
            let ea = segment.endAngle < segment.startAngle ? segment.endAngle + TWO_PI : segment.endAngle,
                ss = Math.abs(ea - segment.startAngle);

            return segment.startAngle + (ss * location);
        }
    }

    getLength ():number {
        return this.length;
    }

    /**
     * returns the point on the segment's path that is 'location' along the length of the path, where 'location' is a decimal from
     * 0 to 1 inclusive.
     */
    pointOnPath(location:number, absolute?:boolean):PointXY {

        if (location === 0) {
            return { x: this.x1, y: this.y1, theta: this.startAngle };
        }
        else if (location === 1) {
            return { x: this.x2, y: this.y2, theta: this.endAngle };
        }

        if (absolute) {
            location = location / length;
        }

        let angle = this._calcAngleForLocation(this, location),
            _x = this.cx + (this.radius * Math.cos(angle)),
            _y = this.cy + (this.radius * Math.sin(angle));

        return { x: gentleRound(_x), y: gentleRound(_y), theta: angle };
    };

    /**
     * returns the gradient of the segment at the given point.
     */
    gradientAtPoint (location:number, absolute?:boolean):number {
        let p = this.pointOnPath(location, absolute);
        let m = normal({x:this.cx, y:this.cy }, p);
        if (!this.anticlockwise && (m === Infinity || m === -Infinity)) {
            m *= -1;
        }
        return m;
    }

    pointAlongPathFrom (location:number, distance:number, absolute?:boolean):PointXY {
        let p = this.pointOnPath(location, absolute),
            arcSpan = distance / this.circumference * 2 * Math.PI,
            dir = this.anticlockwise ? -1 : 1,
            startAngle = p.theta + (dir * arcSpan),
            startX = this.cx + (this.radius * Math.cos(startAngle)),
            startY = this.cy + (this.radius * Math.sin(startAngle));

        return {x: startX, y: startY};
    };

    // TODO: lineIntersection
}
