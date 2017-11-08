/*
 Arc Segment. You need to supply:

 r   -   radius
 cx  -   center x for the arc
 cy  -   center y for the arc
 ac  -   whether the arc is anticlockwise or not. default is clockwise.

 and then either:

 startAngle  -   startAngle for the arc.
 endAngle    -   endAngle for the arc.

 or:

 x1          -   x for start point
 y1          -   y for start point
 x2          -   x for end point
 y2          -   y for end point

 */
import { Segment } from "./segment";

declare const Biltong:any;

export class ArcSegment extends Segment {

    radius:number;
    anticlockwise:Boolean;
    tipe = "Arc";
    startAngle:number;
    endAngle:number;
    x1:number;
    x2:number;
    y1:number;
    y2:number;
    sweep:number;
    length:number;
    cx:number;
    cy:number;
    circumference:number;
    frac:number;

    private _calcAngle(_x:number, _y:number) {
        return Biltong.theta([this.cx, this.cy], [_x, _y]);
    }

    private _calcAngleForLocation(segment:ArcSegment, location:number) {
        if (segment.anticlockwise) {
            let sa = segment.startAngle < segment.endAngle ? segment.startAngle + this.TWO_PI : segment.startAngle,
                s = Math.abs(sa - segment.endAngle);
            return sa - (s * location);
        }
        else {
            let ea = segment.endAngle < segment.startAngle ? segment.endAngle + this.TWO_PI : segment.endAngle,
                ss = Math.abs(ea - segment.startAngle);

            return segment.startAngle + (ss * location);
        }
    }

    TWO_PI = 2 * Math.PI;

    VERY_SMALL_VALUE = 0.0000000001;

    gentleRound(n:number) {
        let f = Math.floor(n), r = Math.ceil(n);
        if (n - f < this.VERY_SMALL_VALUE) {
            return f;
        }
        else if (r - n < this.VERY_SMALL_VALUE) {
            return r;
        }
        return n;
    }

    constructor(params:any) {
        super(params);

        this.cx = params.cx;
        this.cy = params.cy;

        this.radius = params.r;
        this.anticlockwise = params.ac;

        if (params.startAngle && params.endAngle) {
            this.startAngle = params.startAngle;
            this.endAngle = params.endAngle;
            this.x1 = params.cx + (this.radius * Math.cos(params.startAngle));
            this.y1 = params.cy + (this.radius * Math.sin(params.startAngle));
            this.x2 = params.cx + (this.radius * Math.cos(params.endAngle));
            this.y2 = params.cy + (this.radius * Math.sin(params.endAngle));
        }
        else {
            this.startAngle = this._calcAngle(params.x1, params.y1);
            this.endAngle = this._calcAngle(params.x2, params.y2);
            this.x1 = params.x1;
            this.y1 = params.y1;
            this.x2 = params.x2;
            this.y2 = params.y2;
        }

        if (this.endAngle < 0) {
            this.endAngle += this.TWO_PI;
        }
        if (this.startAngle < 0) {
            this.startAngle += this.TWO_PI;
        }

        // segment is used by vml
        //this.segment = _jg.quadrant([this.x1, this.y1], [this.x2, this.y2]);

        // we now have startAngle and endAngle as positive numbers, meaning the
        // absolute difference (|d|) between them is the sweep (s) of this arc, unless the
        // arc is 'anticlockwise' in which case 's' is given by 2PI - |d|.

        let ea = this.endAngle < this.startAngle ? this.endAngle + this.TWO_PI : this.endAngle;
        this.sweep = Math.abs(ea - this.startAngle);
        if (this.anticlockwise) {
            this.sweep = this.TWO_PI - this.sweep;
        }
        this.circumference = 2 * Math.PI * this.radius;
        this.frac = this.sweep / this.TWO_PI;
        this.length = this.circumference * this.frac;
    }

    getBounds () {
        return {
            minX: this.cx - this.radius,
            maxX: this.cx + this.radius,
            minY: this.cy - this.radius,
            maxY: this.cy + this.radius
        };
    }

    getLength() {
        return length;
    }

    /**
     * returns the point on the segment's path that is 'location' along the length of the path, where 'location' is a decimal from
     * 0 to 1 inclusive.
     */
    pointOnPath(location:number, absolute?:Boolean) {

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

        return { x: this.gentleRound(_x), y: this.gentleRound(_y), theta: angle };
    }

    /**
     * returns the gradient of the segment at the given point.
     */
    gradientAtPoint(location:number, absolute?:Boolean) {
        let p = this.pointOnPath(location, absolute);
        let m = Biltong.normal([ this.cx, this.cy ], [p.x, p.y ]);
        if (!this.anticlockwise && (m === Infinity || m === -Infinity)) {
            m *= -1;
        }
        return m;
    }

    pointAlongPathFrom(location:number, distance:number, absolute?:Boolean) {
        let p = this.pointOnPath(location, absolute),
            arcSpan = distance / this.circumference * 2 * Math.PI,
            dir = this.anticlockwise ? -1 : 1,
            startAngle = p.theta + (dir * arcSpan),
            startX = this.cx + (this.radius * Math.cos(startAngle)),
            startY = this.cy + (this.radius * Math.sin(startAngle));

        return {x: startX, y: startY};
    }

}
