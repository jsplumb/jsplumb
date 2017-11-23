import {EventGenerator} from "../event/event-generator";
import {Endpoint} from "../endpoint";
import {JsPlumbInstance} from "../core";
import {AnchorComputeParams, AnchorOffsets, AnchorOrientation} from "./anchors";

export class Anchor<EventType, ElementType> extends EventGenerator<EventType> {

    isDynamic:Boolean = false;
    isContinuous:Boolean = false;
    isFloating:Boolean = false;

    x:number;
    y:number;
    elementId:string;
    cssClass:string;
    userDefinedLocation:AnchorOrientation;
    orientation:Array<number>;
    lastReturnValue:any;
    offsets:AnchorOffsets;
    timestamp:number;
    jsPlumbInstance:JsPlumbInstance<EventType, ElementType>;


    constructor(params:any) {
        super();

        this.x = params.x || 0;
        this.y = params.y || 0;
        this.elementId = params.elementId;
        this.cssClass = params.cssClass || "";
        this.userDefinedLocation = null;
        this.orientation = params.orientation || [ 0, 0 ];
        this.lastReturnValue = null;
        this.offsets = params.offsets || [ 0, 0 ];
        this.timestamp = null;
        this.jsPlumbInstance = params.jsPlumbInstance;
    }

    anchorType:string = "Anchor";

    compute(params:AnchorComputeParams) {

        let xy = params.xy, wh = params.wh, timestamp = params.timestamp;

        if (params.clearUserDefinedLocation) {
            this.userDefinedLocation = null;
        }

        if (timestamp && timestamp === this.timestamp) {
            return this.lastReturnValue;
        }

        if (this.userDefinedLocation != null) {
            this.lastReturnValue = this.userDefinedLocation;
        }
        else {
            this.lastReturnValue = [ xy[0] + (this.x * wh[0]) + this.offsets[0], xy[1] + (this.y * wh[1]) + this.offsets[1] ];
        }

        this.timestamp = timestamp;
        return this.lastReturnValue;
    }

    getCurrentLocation(params:any) {
        params = params || {};
        return (this.lastReturnValue == null || (params.timestamp != null && this.timestamp !== params.timestamp)) ? this.compute(params) : this.lastReturnValue;
    }

    equals(anchor:Anchor<any,any>) {
        if (!anchor) {
            return false;
        }
        let ao = anchor.getOrientation(),
            o = this.getOrientation();
        return this.x === anchor.x && this.y === anchor.y && this.offsets[0] === anchor.offsets[0] && this.offsets[1] === anchor.offsets[1] && o[0] === ao[0] && o[1] === ao[1];
    }

    getUserDefinedLocation() {
        return this.userDefinedLocation;
    }

    setUserDefinedLocation(l:any) {
        this.userDefinedLocation = l;
    }

    clearUserDefinedLocation() {
        this.userDefinedLocation = null;
    }

    getOrientation(_endpoint?:Endpoint<EventType, ElementType>) {
        return this.orientation;
    }

    getCssClass() {
        return this.cssClass;
    }

    /**
     * @override
     * @param event
     * @param value
     * @param originalEvent
     * @returns {boolean}
     */
    shouldFireEvent(event: string, value: any, originalEvent?: EventType): Boolean {
        return true;
    }

    over(anchor:any, endpoint:any) {}

    out() {}
}
