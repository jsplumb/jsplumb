import { Connection } from "../connector/connection-impl";
import { Endpoint } from "../endpoint/endpoint-impl";
import { PointArray } from "../common";
import { JsPlumbInstance } from "../core";
import { Anchor } from "../anchor/anchor";
import { AnchorPlacement } from "../anchor-manager";
export declare type AnchorOrientationHint = -1 | 0 | 1;
export declare type Orientation = [number, number];
export declare type Face = "top" | "right" | "bottom" | "left";
export declare type Axis = [Face, Face];
export declare const X_AXIS_FACES: Axis;
export declare const Y_AXIS_FACES: Axis;
export declare type AnchorComputeParams = {
    xy?: PointArray;
    wh?: PointArray;
    txy?: PointArray;
    twh?: PointArray;
    element?: Endpoint;
    timestamp?: string;
    index?: number;
    tElement?: Endpoint;
    connection?: Connection;
    elementId?: string;
    rotation?: number;
    tRotation?: number;
};
export interface AnchorOptions {
    cssClass?: string;
}
declare enum AnchorLocations {
    Assign = 0,
    AutoDefault = 1,
    Bottom = 2,
    BottomCenter = 3,
    BottomLeft = 4,
    BottomRight = 5,
    Center = 6,
    Continuous = 7,
    ContinuousBottom = 8,
    ContinuousLeft = 9,
    ContinuousRight = 10,
    ContinuousTop = 11,
    ContinuousLeftRight = 12,
    ContinuousTopBottom = 13,
    Left = 14,
    LeftMiddle = 15,
    Perimeter = 16,
    Right = 17,
    RightMiddle = 18,
    Top = 19,
    TopCenter = 20,
    TopLeft = 21,
    TopRight = 22
}
export declare type AnchorId = keyof typeof AnchorLocations;
export declare type AnchorSpec = AnchorId | [AnchorId, AnchorOptions] | AnchorPlacement;
export declare const Anchors: {
    get: (instance: JsPlumbInstance<any>, name: string, args: any) => Anchor;
};
export declare function makeAnchorFromSpec(instance: JsPlumbInstance, spec: AnchorSpec, elementId?: string): Anchor;
export declare type ShapeFunction = (anchorCount: number, p?: any) => Array<any>;
export {};
