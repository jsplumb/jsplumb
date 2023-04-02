import { Endpoint } from "../endpoint/endpoint";
import { AnchorComputeParams, Face, Orientation, LightweightAnchor, LightweightContinuousAnchor, LightweightFloatingAnchor } from "../factory/anchor-record-factory";
import { RedrawResult, Router } from "./router";
import { Connection } from "../connector/connection-impl";
import { JsPlumbInstance } from "../core";
import { PointXY } from "../../util/util";
import { AnchorPlacement, AnchorSpec } from "../../common/anchor";
interface ConnectionFacade {
    endpoints: [Endpoint, Endpoint];
    placeholder?: boolean;
}
declare type AnchorListEntry = {
    theta: number;
    order: number;
    c: ConnectionFacade;
    b: boolean;
    elId: string;
    epId: string;
};
declare type AnchorLists = {
    top: Array<AnchorListEntry>;
    right: Array<AnchorListEntry>;
    bottom: Array<AnchorListEntry>;
    left: Array<AnchorListEntry>;
};
export declare function isContinuous(a: LightweightAnchor): a is LightweightContinuousAnchor;
export declare function isFloating(a: LightweightAnchor): a is LightweightFloatingAnchor;
export declare function isDynamic(a: LightweightAnchor): boolean;
export declare class LightweightRouter<T extends {
    E: unknown;
}> implements Router<T, LightweightAnchor> {
    instance: JsPlumbInstance;
    anchorLists: Map<string, AnchorLists>;
    anchorLocations: Map<string, AnchorPlacement>;
    constructor(instance: JsPlumbInstance);
    getAnchorOrientation(anchor: LightweightAnchor): Orientation;
    private _distance;
    private _anchorSelector;
    private _floatingAnchorCompute;
    private _setComputedPosition;
    private _computeSingleLocation;
    /**
     * Computes the position for an anchor that has only a single location. This is analogous to the
     * original `Anchor` class.
     * @param anchor
     * @param params
     * @internal
     */
    private _singleAnchorCompute;
    /**
     * Computes the position for an anchor that is neither floating nor continuous. This case covers what
     * was previously both DynamicAnchor and Anchor, since those concepts have now been folded into
     * a single concept - any given anchor has one or more locations.
     * @param anchor
     * @param params
     */
    private _defaultAnchorCompute;
    private _placeAnchors;
    private _updateAnchorList;
    private _removeEndpointFromAnchorLists;
    computeAnchorLocation(anchor: LightweightAnchor, params: AnchorComputeParams): AnchorPlacement;
    computePath(connection: Connection<any>, timestamp: string): void;
    getEndpointLocation(endpoint: Endpoint<any>, params: AnchorComputeParams): AnchorPlacement;
    getEndpointOrientation(ep: Endpoint<any>): Orientation;
    setAnchorOrientation(anchor: LightweightAnchor, orientation: Orientation): void;
    isDynamicAnchor(ep: Endpoint<any>): boolean;
    isFloating(ep: Endpoint<any>): boolean;
    prepareAnchor(params: AnchorSpec | Array<AnchorSpec>): LightweightAnchor;
    redraw(elementId: string, timestamp?: string, offsetToUI?: PointXY): RedrawResult;
    reset(): void;
    setAnchor(endpoint: Endpoint<any>, anchor: LightweightAnchor): void;
    setConnectionAnchors(conn: Connection<any>, anchors: [LightweightAnchor, LightweightAnchor]): void;
    private _calculateOrientation;
    /**
     * @internal
     * @param a
     * @param face
     * @param overrideLock
     */
    setCurrentFace(a: LightweightContinuousAnchor, face: Face, overrideLock?: boolean): void;
    /**
     * @internal
     * @param a
     */
    lock(a: LightweightAnchor): void;
    /**
     * @internal
     * @param a
     */
    unlock(a: LightweightAnchor): void;
    /**
     * Attempts to set the location in the given anchor whose x/y matches the coordinates given. An anchor may have more than
     * one declared location. This method provides a means for setting the active location based upon matching its x/y values.
     * @param a
     * @param coords
     * @returns true if a matching location was found and activated, false if not.
     * @internal
     */
    selectAnchorLocation(a: LightweightAnchor, coords: {
        x: number;
        y: number;
    }): boolean;
    /**
     * @internal
     * @param a
     */
    lockCurrentAxis(a: LightweightContinuousAnchor): void;
    /**
     * @internal
     * @param a
     */
    unlockCurrentAxis(a: LightweightContinuousAnchor): void;
    /**
     * Returns whether or not the two anchors represent the same location.
     * @param a1
     * @param a2
     * @internal
     */
    anchorsEqual(a1: LightweightAnchor, a2: LightweightAnchor): boolean;
}
export {};
//# sourceMappingURL=lightweight-router.d.ts.map