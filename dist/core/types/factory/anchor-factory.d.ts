import { Connection } from "../connector/connection-impl";
import { Endpoint } from "../endpoint/endpoint";
import { PointXY, Rotations, Size } from "../common";
import { JsPlumbInstance } from "../core";
import { Anchor } from "../anchor/anchor";
import { AnchorPlacement } from "../router/router";
export declare type AnchorOrientationHint = -1 | 0 | 1;
export declare type Orientation = [number, number];
export declare type Face = "top" | "right" | "bottom" | "left";
export declare type Axis = [Face, Face];
export declare const X_AXIS_FACES: Axis;
export declare const Y_AXIS_FACES: Axis;
export declare type AnchorComputeParams = {
    xy?: PointXY;
    wh?: Size;
    txy?: PointXY;
    twh?: Size;
    element?: Endpoint;
    timestamp?: string;
    index?: number;
    tElement?: Endpoint;
    connection?: Connection;
    elementId?: string;
    rotation?: Rotations;
    tRotation?: Rotations;
};
export interface AnchorOptions extends Record<string, any> {
    cssClass?: string;
}
export declare enum AnchorLocations {
    Assign = "Assign",
    AutoDefault = "AutoDefault",
    Bottom = "Bottom",
    BottomLeft = "BottomLeft",
    BottomRight = "BottomRight",
    Center = "Center",
    Continuous = "Continuous",
    ContinuousBottom = "ContinuousBottom",
    ContinuousLeft = "ContinuousLeft",
    ContinuousRight = "ContinuousRight",
    ContinuousTop = "ContinuousTop",
    ContinuousLeftRight = "ContinuousLeftRight",
    ContinuousTopBottom = "ContinuousTopBottom",
    Left = "Left",
    Perimeter = "Perimeter",
    Right = "Right",
    Top = "Top",
    TopLeft = "TopLeft",
    TopRight = "TopRight"
}
export declare type AnchorId = keyof typeof AnchorLocations;
export declare type FullAnchorSpec = {
    type: AnchorId;
    options: AnchorOptions;
};
export declare type SingleAnchorSpec = AnchorId | FullAnchorSpec | AnchorPlacement | Array<AnchorPlacement>;
export declare type AnchorSpec = SingleAnchorSpec | Array<SingleAnchorSpec>;
export declare const Anchors: {
    get: (instance: JsPlumbInstance<any>, name: string, args: any) => Anchor;
};
export declare function makeAnchorFromSpec(instance: JsPlumbInstance, spec: AnchorSpec | Array<AnchorSpec>, elementId?: string): Anchor;
export declare type ShapeFunction = (anchorCount: number, p?: any) => Array<any>;
