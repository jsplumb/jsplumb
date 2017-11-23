
import {Overlay} from "./overlay";
import {OverlayCapableComponent} from "./overlay-capable-component";
import {isString} from "../util/_is";
import {isPathBasedComponent} from "../component/path-based-component";


declare var Biltong:any;

export class ArrowOverlay<EventType, ElementType> extends Overlay<EventType, ElementType> {

    id:string;
    length:number;
    width:number;
    foldback:number;
    direction:number;
    path:any;
    events:Map<string, Function>;
    paintStyle:any;

    overlayType = "Arrow";

    constructor(params:any) {
        super(params);

        this.isAppendedAtRootLevel = false;
        this.length = params.length || 20;
        this.width = params.width || 20;
        this.id = params.id;
        this.events = params.events || new Map();

        this.direction = (params.direction || 1) < 0 ? -1 : 1;
        this.paintStyle = params.paintStyle || { "stroke-width": 1 };
        // how far along the arrow the lines folding back in come to. default is 62.3%.
        this.foldback = params.foldback || 0.623;
    }

    draw(component:OverlayCapableComponent<EventType, ElementType>, currentConnectionPaintStyle:any):any {

        let hxy, mid, txy, tail, cxy;
       if (isPathBasedComponent(component)) {

            if (isString(this.loc) || this.loc > 1 || this.loc < 0) {
                let fromLoc = this.loc < 0 ? 1 : 0;
                hxy = component.pointAlongPathFrom(fromLoc, this.loc, false);
                mid = component.pointAlongPathFrom(fromLoc, this.loc - (this.direction * this.length / 2), false);
                txy = Biltong.pointOnLine(hxy, mid, this.length);
            }
            else if (this.loc === 1) {
                hxy = component.pointOnPath(this.loc);
                mid = component.pointAlongPathFrom(this.loc, -(this.length));
                txy = Biltong.pointOnLine(hxy, mid, this.length);

                if (this.direction === -1) {
                    let _ = txy;
                    txy = hxy;
                    hxy = _;
                }
            }
            else if (this.loc === 0) {
                txy = component.pointOnPath(this.loc);
                mid = component.pointAlongPathFrom(this.loc, this.length);
                hxy = Biltong.pointOnLine(txy, mid, this.length);
                if (this.direction === -1) {
                    let __ = txy;
                    txy = hxy;
                    hxy = __;
                }
            }
            else {
                hxy = component.pointAlongPathFrom(this.loc, this.direction * this.length / 2);
                mid = component.pointOnPath(this.loc);
                txy = Biltong.pointOnLine(hxy, mid, this.length);
            }

            tail = Biltong.perpendicularLineTo(hxy, txy, this.width);
            cxy = Biltong.pointOnLine(hxy, txy, this.foldback * this.length);

            let d = { hxy: hxy, tail: tail, cxy: cxy },
                stroke = this.paintStyle.stroke || currentConnectionPaintStyle.stroke,
                fill = this.paintStyle.fill || currentConnectionPaintStyle.stroke,
                lineWidth = this.paintStyle.strokeWidth || currentConnectionPaintStyle.strokeWidth;

            return {
                component: component,
                d: d,
                "stroke-width": lineWidth,
                stroke: stroke,
                fill: fill,
                minX: Math.min(hxy.x, tail[0].x, tail[1].x),
                maxX: Math.max(hxy.x, tail[0].x, tail[1].x),
                minY: Math.min(hxy.y, tail[0].y, tail[1].y),
                maxY: Math.max(hxy.y, tail[0].y, tail[1].y)
            };
        }
        // endpoints are not "path based"
        else {
           return {component: component, minX: 0, maxX: 0, minY: 0, maxY: 0};
        }
    }

    updateFrom(d:any) {
        super.updateFrom(d);

        this.length = d.length || this.length;
        this.width = d.width|| this.width;
        this.direction = d.direction != null ? d.direction : this.direction;
        this.foldback = d.foldback|| this.foldback;
    }

    computeMaxSize() {
        return this.width * 1.5;
    }

    elementCreated(p:any, component?:any) {
        this.path = p;
        if (this.events) {
            for (let i in this.events) {
                this.instance.on(p, i, this.events[i]);
            }
        }
    }
}

Overlay.map["Arrow"] = ArrowOverlay;
