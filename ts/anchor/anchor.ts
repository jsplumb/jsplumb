import {Dictionary, jsPlumbInstance, PointArray} from "../core";
import {isArray, isString, IS, isNumber} from "../util";
import {EventGenerator} from "../event-generator";
import {Endpoint} from "../endpoint/endpoint-impl";
import {Connection} from "../connector/connection-impl";


import {
    AnchorComputeParams, AnchorId, AnchorOptions, AnchorOrientationHint, ComputedAnchorPosition,
    Orientation
} from "./anchors";



export class Anchor<E> extends EventGenerator {

    type: AnchorId;
    isDynamic: boolean = false;
    isContinuous: boolean = false;
    isFloating:boolean = false;
    cssClass: string = "";
    elementId: string;
    id: string;
    locked: boolean;
    offsets: [number, number];
    orientation: Orientation;
    x: number;
    y: number;
    timestamp:string;
    lastReturnValue: ComputedAnchorPosition;

    clone:() => Anchor<E>;

    constructor(public instance:jsPlumbInstance<E>,  params?:AnchorOptions) {
        super();
        params = params || {};
        this.cssClass = params.cssClass || "";
    }

    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean {
        return true;
    }


    getOrientation(endpoint?: Endpoint<E>): Orientation {
        return this.orientation;
    }

    getCurrentLocation(params:AnchorComputeParams<E>):ComputedAnchorPosition {
        params = params || {};
        return (this.lastReturnValue == null || (params.timestamp != null && this.timestamp !== params.timestamp)) ? this.compute(params) : this.lastReturnValue;
    }

    setPosition (x:number, y:number, ox:AnchorOrientationHint, oy:AnchorOrientationHint, overrideLock?:boolean):void {
        if (!this.locked || overrideLock) {
            this.x = x;
            this.y = y;
            this.orientation = [ ox, oy ];
            this.lastReturnValue = null;
        }
    }

    compute (params:AnchorComputeParams<E>):ComputedAnchorPosition {

        let xy = params.xy, wh = params.wh, timestamp = params.timestamp;

        if (timestamp && timestamp === this.timestamp) {
            return this.lastReturnValue;
        }

        this.lastReturnValue = [ xy[0] + (this.x * wh[0]) + this.offsets[0], xy[1] + (this.y * wh[1]) + this.offsets[1], this.x, this.y ];

        this.timestamp = timestamp;
        return this.lastReturnValue;
    }

    equals(anchor:Anchor<E>):boolean {
        if (!anchor) {
            return false;
        }
        let ao = anchor.getOrientation(),
            o = this.getOrientation();
        return this.x === anchor.x && this.y === anchor.y && this.offsets[0] === anchor.offsets[0] && this.offsets[1] === anchor.offsets[1] && o[0] === ao[0] && o[1] === ao[1];
    }


    getCssClass():string {
        return this.cssClass;
    }

    lock ():void { this.locked = true; };
    unlock ():void { this.locked = false; };
    isLocked ():boolean { return this.locked; };

    over (anchor:Anchor<E>, endpoint:Endpoint<E>):void { }

    out ():void { }
}
