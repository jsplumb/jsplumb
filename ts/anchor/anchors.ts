import {Connection} from "../connector/connection-impl";
import {Endpoint} from "../endpoint/endpoint-impl";
import {Dictionary, jsPlumbInstance, PointArray} from "../core";

import {Anchor} from "./anchor";
import {DynamicAnchor} from "./dynamic-anchor";
import {IS, isArray, isNumber, isString} from "../util";
import {ContinuousAnchor} from "../continuous-anchor";

export type AnchorOrientationHint = -1 | 0 | 1;
export type Orientation = [ AnchorOrientationHint, AnchorOrientationHint ];

export type Face = "top" | "right" | "bottom" | "left";
export type Axis = [ Face, Face ];

export const X_AXIS_FACES:Axis = ["left", "right"];
export const Y_AXIS_FACES:Axis = ["top", "bottom"];

export type LocationParams<E> = {xy:PointArray, wh:PointArray, element:Endpoint<E>, timestamp?:string};

export type AnchorComputeParams<E> = {
    xy?: PointArray;
    wh?: PointArray;
    txy?:PointArray;
    twh?:PointArray;
    element?:Endpoint<E>;
    timestamp?: string;
    index?:number;
    tElement?:Endpoint<E>;
    connection?:Connection<E>;
    elementId?:string;
};

export type ComputedAnchorPosition = [ number, number, number, number ];

export interface AnchorOptions {
    cssClass?:string;
}

export type AnchorId =
    "Assign" |
    "AutoDefault" |
    "Bottom" |
    "BottomCenter" |
    "BottomLeft" |
    "BottomRight" |
    "Center" |
    "Continuous" |
    "ContinuousBottom" |
    "ContinuousLeft" |
    "ContinuousRight" |
    "ContinuousTop" |
    "ContinuousLeftRight" |
    "ContinuousTopBottom" |
    "Left" |
    "LeftMiddle" |
    "Perimeter" |
    "Right" |
    "RightMiddle" |
    "Top" |
    "TopCenter" |
    "TopLeft" |
    "TopRight";


export type AnchorSpec = AnchorId | [AnchorId, AnchorOptions]



const anchorMap:Dictionary<(instance:jsPlumbInstance<any>, args:any) => Anchor<any>> = {};
export const Anchors = {

    get:(instance:jsPlumbInstance<any>, name:string, args:any):Anchor<any> => {

        let con = anchorMap[name];
        if (!con) {
            throw {message:"jsPlumb: unknown anchor type '" + name + "'"};
        } else {
            return con(instance, args || {}) as Anchor<any>;
        }

    }
};

function _makeAnchor<E>(instance:jsPlumbInstance<E>, x:number, y:number, ox:AnchorOrientationHint, oy:AnchorOrientationHint, offsetX:number, offsetY:number, elementId?:string):Anchor<E> {
    let a = new Anchor(instance);
    a.x = x;
    a.y = y;
    a.orientation = [ ox, oy ];
    a.offsets = [ offsetX, offsetY ];
    if (elementId != null) {
        a.elementId = elementId;
    }
    return a;
}

function getNamedAnchor<E>(instance:jsPlumbInstance<E>, name:string, args?:any, elementId?:string):Anchor<E> {
    let a = Anchors.get(instance, name, args);
    a.elementId = elementId;
    return a
}

function getAnchorWithValues<E>(instance:jsPlumbInstance<E>, x:number, y:number, orientation:Orientation, offsets:[number, number], elementId?:string):Anchor<E> {
    let a = new Anchor<E>(instance);
    a.x = x;
    a.y = y;
    a.orientation = orientation;
    a.offsets = offsets;
    a.elementId = elementId;
    return a;
}

export function makeAnchorFromSpec<E>(instance:jsPlumbInstance<E>, spec:AnchorSpec, elementId?:string):Anchor<E> {

    // if already an Anchor, return it
    if ((<any>spec).compute && (<any>spec).getOrientation) {
        return (<unknown>spec) as Anchor<E>;
    }

    // if a string, its just a named anchor
    if (isString(spec)){
        return getNamedAnchor(instance, spec as string, null, elementId)

    } else if (isArray(spec)) {

        // if its an array then it can be either:
        // - a DynamicAnchor, which is a series of Anchor specs
        // - an Anchor with constructor args
        // - a set of values for a low level Anchor create

        let sa:Array<any> = (spec as Array<any>);

        // second arg is object, its a named anchor with constructor args
        if (IS.anObject(sa[1])) {
            return getNamedAnchor(instance, sa[0] as string, sa[1], elementId);
        } else {
            // if all values are numbers its a low level create
            if(sa.every(isNumber)) {
                return getAnchorWithValues(instance,
                    sa[0],
                    sa[1],
                    [ sa[2] as AnchorOrientationHint, sa[3] as AnchorOrientationHint ],
                    [ sa[4] || 0, sa[5] || 0],
                    elementId
                );
            } else {
                return new DynamicAnchor(instance, {anchors:sa, elementId:elementId});
            }
        }

    } else {
        throw { message: "jsPlumb cannot create anchor from " + spec };
    }
}

function _curryAnchor (x:number, y:number, ox:AnchorOrientationHint, oy:AnchorOrientationHint, type:AnchorId, fnInit?:Function) {
    let con = function<E>(instance:jsPlumbInstance<E>, params:any):Anchor<E> {
        let a = _makeAnchor(instance, x, y, ox, oy, 0, 0);
        a.type = type;
        if (fnInit) {
            fnInit(a, params);
        }
        return a;
    };

    anchorMap[type] = con;
}

_curryAnchor(0.5, 0, 0, -1, "TopCenter");
_curryAnchor(0.5, 1, 0, 1, "BottomCenter");
_curryAnchor(0, 0.5, -1, 0, "LeftMiddle");
_curryAnchor(1, 0.5, 1, 0, "RightMiddle");

_curryAnchor(0.5, 0, 0, -1, "Top");
_curryAnchor(0.5, 1, 0, 1, "Bottom");
_curryAnchor(0, 0.5, -1, 0, "Left");
_curryAnchor(1, 0.5, 1, 0, "Right");
_curryAnchor(0.5, 0.5, 0, 0, "Center");
_curryAnchor(1, 0, 0, -1, "TopRight");
_curryAnchor(1, 1, 0, 1, "BottomRight");
_curryAnchor(0, 0, 0, -1, "TopLeft");
_curryAnchor(0, 1, 0, 1, "BottomLeft");


// ------------- DYNAMIC ANCHOR DEFAULT ---------------------------

const DEFAULT_DYNAMIC_ANCHORS = [ "TopCenter", "RightMiddle", "BottomCenter", "LeftMiddle" ];
anchorMap["AutoDefault"] = function<E>(instance:jsPlumbInstance<E>, params:any):Anchor<E> {
    let a = new DynamicAnchor(instance, {anchors:DEFAULT_DYNAMIC_ANCHORS.map((da:string) => getNamedAnchor(instance, da, params))});
    a.type = "AutoDefault";
    return a;
};

// ------------------------- CONTINUOUS ANCHOR -------------------

function _curryContinuousAnchor (type:AnchorId, faces:Array<Face>) {
    anchorMap[type] = function<E>(instance:jsPlumbInstance<E>, params:any):Anchor<E> {
        let a = new ContinuousAnchor(instance, { faces: faces });
        a.type = type;
        return a;
    };
}

anchorMap["Continuous"] = function<E>(instance:jsPlumbInstance<E>, params:any):Anchor<E> {
    return instance.anchorManager.continuousAnchorFactory.get(instance, params);
};

_curryContinuousAnchor("ContinuousLeft", ["left"]);
_curryContinuousAnchor("ContinuousTop", ["top"]);
_curryContinuousAnchor("ContinuousBottom", ["bottom"]);
_curryContinuousAnchor("ContinuousRight", ["right"]);
_curryContinuousAnchor("ContinuousLeft", ["left"]);
_curryContinuousAnchor("ContinuousTop", ["top"]);
_curryContinuousAnchor("ContinuousBottom", ["bottom"]);
_curryContinuousAnchor("ContinuousLeftRight", ["left", "right"]);
_curryContinuousAnchor("ContinuousTopBottom", ["top", "bottom"]);

