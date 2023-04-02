import { Connection } from "../connector/connection-impl";
import { Endpoint } from "../endpoint/endpoint";
import { JsPlumbInstance } from "../core";
import { PointXY, Rotations, Size } from "../../util/util";
import { AnchorSpec, PerimeterAnchorShapes } from "../../common/anchor";
export declare type AnchorOrientationHint = -1 | 0 | 1;
export declare type Orientation = [AnchorOrientationHint, AnchorOrientationHint];
declare enum FaceValues {
    top = "top",
    left = "left",
    right = "right",
    bottom = "bottom"
}
export declare const TOP = FaceValues.top;
export declare const LEFT = FaceValues.left;
export declare const RIGHT = FaceValues.right;
export declare const BOTTOM = FaceValues.bottom;
export declare type Face = keyof typeof FaceValues;
export declare type Axis = [Face, Face];
export declare const X_AXIS_FACES: Axis;
export declare const Y_AXIS_FACES: Axis;
/**
 * @internal
 */
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
/**
 * @internal
 */
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
/**
 * @internal
 */
export interface ComputedPosition {
    curX: number;
    curY: number;
    ox: AnchorOrientationHint;
    oy: AnchorOrientationHint;
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
export interface LightweightPerimeterAnchor extends LightweightAnchor {
    shape: PerimeterAnchorShapes;
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
    element: Element;
    isFloating: boolean;
    isContinuous: false;
    isDynamic: false;
    locations: Array<AnchorRecord>;
    currentLocation: number;
    locked: boolean;
    cssClass: string;
    timestamp: string;
    type: string;
    id: string;
    orientation: Orientation;
    size: Size;
    constructor(instance: JsPlumbInstance, element: Element, elementId: string);
    private _updateOrientationInRouter;
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
 * @internal
 */
export declare function getDefaultFace(a: LightweightContinuousAnchor): Face;
/**
 *
 * @param a
 * @param edge
 * @internal
 */
export declare function isEdgeSupported(a: LightweightContinuousAnchor, edge: Face): boolean;
export declare function createFloatingAnchor(instance: JsPlumbInstance, element: Element, elementId: string): LightweightFloatingAnchor;
export declare function makeLightweightAnchorFromSpec(spec: AnchorSpec | Array<AnchorSpec>): LightweightAnchor;
export declare function _createPerimeterAnchor(params: Record<string, any>): LightweightPerimeterAnchor;
export {};
//# sourceMappingURL=anchor-record-factory.d.ts.map