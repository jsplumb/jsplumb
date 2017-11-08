/**
 * Created by simon on 19/10/2017.
 */

import {Anchor} from "./abstract-anchor";
import {AnchorManager} from "./anchor-manager";
import {Endpoint} from "../endpoint";

export class ContinuousAnchor<EventType, ElementType> extends Anchor<EventType, ElementType> {

    static opposites = { "top": "bottom", "right": "left", "left": "right", "bottom": "top" };
    static clockwiseOptions = { "top": "right", "right": "bottom", "left": "top", "bottom": "left" };
    static antiClockwiseOptions = { "top": "left", "right": "top", "left": "bottom", "bottom": "right" };

    /**
     * @override
     * @type {boolean}
     */
    isDynamic = true;

    /**
     * @override
     * @type {boolean}
     */
    isContinuous = true;

    /**
     * @override
     * @type {string}
     */
    anchorType = "Continuous";

    faces:Array<string>;
    clockwise:Boolean;
    availableFaces:Map<string, Boolean> = new Map();
    secondBest:any;
    lastChoice:any;
    cssClass:string;
    elementId:string;
    anchorManager:AnchorManager<EventType, ElementType>;


    constructor(params:any, anchorManager:AnchorManager<EventType, ElementType>) {
        super(params);
        this.anchorManager = anchorManager;
        this.faces = params.faces || ["top", "right", "bottom", "left"];
        this.clockwise = !(params.clockwise === false);
        this.secondBest = this.clockwise ? ContinuousAnchor.clockwiseOptions : ContinuousAnchor.antiClockwiseOptions;
        this.lastChoice = this.clockwise ? ContinuousAnchor.antiClockwiseOptions : ContinuousAnchor.clockwiseOptions;
        this.cssClass = params.cssClass || "";
        this.elementId = params.elementId;

        for (let i = 0; i < this.faces.length; i++) {
            this.availableFaces[this.faces[i]] = true;
        }
    }

    getDefaultFace = function () {
        return this.faces.length === 0 ? "top" : this.faces[0];
    };

    verifyEdge = function (edge:string) {
        if (this.availableFaces[edge]) {
            return edge;
        }
        else if (this.availableFaces[ContinuousAnchor.opposites[edge]]) {
            return ContinuousAnchor.opposites[edge];
        }
        else if (this.availableFaces[this.secondBest[edge]]) {
            return this.secondBest[edge];
        }
        else if (this.availableFaces[this.lastChoice[edge]]) {
            return this.lastChoice[edge];
        }
        return edge; // we have to give them something.
    };

    isEdgeSupported = function (edge:string) {
        return this.availableFaces[edge] === true;
    };

    compute(params:any) {
        return this.anchorManager.userDefinedContinuousAnchorLocations[params.element.id] || this.anchorManager.continuousAnchorLocations[params.element.id] || [0, 0];
    }

    getCurrentLocation(params:any) {
        return this.anchorManager.userDefinedContinuousAnchorLocations[params.element.id] || this.anchorManager.continuousAnchorLocations[params.element.id] || [0, 0];
    }

    getOrientation(endpoint:Endpoint<EventType, ElementType>) {
        return this.anchorManager.continuousAnchorOrientations[endpoint.id] || [0, 0];
    }

    clearUserDefinedLocation() {
        delete this.anchorManager.userDefinedContinuousAnchorLocations[this.elementId];
    }

    setUserDefinedLocation(loc:[number, number]) {
        this.anchorManager.userDefinedContinuousAnchorLocations[this.elementId] = loc;
    }

    getCssClass() {
        return this.cssClass;
    }

}
