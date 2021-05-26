import { PointXY, Rotations, Size } from "@jsplumb/util";
import { AnchorPlacement } from "../router/router";
import { Connection } from "../connector/connection-impl";
import { Endpoint } from "../endpoint/endpoint";
import { JsPlumbInstance } from "../core";
export declare type AnchorOrientationHint = -1 | 0 | 1;
export declare type Orientation = [number, number];
export declare type Face = "top" | "right" | "bottom" | "left";
export declare type Axis = [Face, Face];
export declare const X_AXIS_FACES: Axis;
export declare const Y_AXIS_FACES: Axis;
export interface AnchorOptions extends Record<string, any> {
    cssClass?: string;
}
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
/**
 * Constructor options for a Perimeter Anchor.
 */
export interface PerimeterAnchorOptions extends AnchorOptions {
    shape: string;
    rotation?: number;
    anchorCount?: number;
}
export interface AnchorRecord {
    x: number;
    y: number;
    ox: AnchorOrientationHint;
    oy: AnchorOrientationHint;
    offx: number;
    offy: number;
    iox: AnchorOrientationHint;
    ioy: AnchorOrientationHint;
    cls: string;
}
export interface ComputedPosition {
    curX: number;
    curY: number;
    ox: number;
    oy: number;
    x: number;
    y: number;
}
export interface LightweightAnchor {
    locations: Array<AnchorRecord>;
    currentLocation: number;
    locked: boolean;
    id: string;
    cssClass: string;
    isContinuous: boolean;
    isFloating: boolean;
    isDynamic: boolean;
    timestamp: string;
    type: string;
    computedPosition?: ComputedPosition;
}
export interface LightweightContinuousAnchor extends LightweightAnchor {
    faces: Array<Face>;
    lockedFace: Face;
    isContinuous: true;
    isDynamic: false;
    currentFace: Face;
    lockedAxis: Axis;
    clockwise: boolean;
}
export declare class LightweightFloatingAnchor implements LightweightAnchor {
    instance: JsPlumbInstance;
    element: any;
    isFloating: boolean;
    isContinuous: false;
    isDynamic: false;
    locations: any[];
    currentLocation: number;
    locked: boolean;
    cssClass: string;
    timestamp: string;
    type: string;
    id: string;
    orientation: Orientation;
    size: Size;
    constructor(instance: JsPlumbInstance, element: any);
    /**
     * notification the endpoint associated with this anchor is hovering
     * over another anchor; we want to assume that anchor's orientation
     * for the duration of the hover.
     */
    over(endpoint: Endpoint): void;
    /**
     * notification the endpoint associated with this anchor is no
     * longer hovering over another anchor; we should resume calculating
     * orientation as we normally do.
     */
    out(): void;
}
/**
 *
 * @param a
 * @private
 */
export declare function getDefaultFace(a: LightweightContinuousAnchor): Face;
/**
 *
 * @param a
 * @param edge
 * @private
 */
export declare function isEdgeSupported(a: LightweightContinuousAnchor, edge: Face): boolean;
export declare const TOP = "top";
export declare const BOTTOM = "bottom";
export declare const LEFT = "left";
export declare const RIGHT = "right";
export declare function createFloatingAnchor(instance: JsPlumbInstance, element: any): LightweightFloatingAnchor;
export declare function makeLightweightAnchorFromSpec(spec: AnchorSpec | Array<AnchorSpec>): LightweightAnchor;
