import {Segment} from "./segment";
import {ArcSegment} from "./arc-segment";
import {StraightSegment} from "./straight-segment";
import {BezierSegment} from "./bezier-segment";

export class SegmentRenderer {
    static getPath (segment:Segment) {
        return ({
            "Straight": function () {
                let d = (<StraightSegment>segment).getCoordinates();
                return "M " + d.x1 + " " + d.y1 + " L " + d.x2 + " " + d.y2;
            },
            "Bezier": function () {
                let d = segment.params;
                return "M " + d.x1 + " " + d.y1 +
                    " C " + d.cp1x + " " + d.cp1y + " " + d.cp2x + " " + d.cp2y + " " + d.x2 + " " + d.y2;
            },
            "Arc": function () {
                let d = segment.params,
                    laf = (<ArcSegment>segment).sweep > Math.PI ? 1 : 0,
                    sf = (<ArcSegment>segment).anticlockwise ? 0 : 1,
                    as = (<ArcSegment>segment);

                return "M" + as.x1 + " " + as.y1 + " A " + as.radius + " " + d.r + " 0 " + laf + "," + sf + " " + as.x2 + " " + as.y2;
            }
        })[segment.tipe]();
    }

    static createSegment(type:string, params:any) {
        switch (type) {
            case "Straight":
                return new StraightSegment(params);
            case "Bezier":
                return new BezierSegment(params);
            case "Arc":
                return new ArcSegment(params);
            default:
                throw new Error("Unknown segment type [" + type + "]")
        }
    }
}
