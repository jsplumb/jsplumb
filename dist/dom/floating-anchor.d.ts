import { AnchorComputeParams, AnchorOptions, Orientation } from "../factory/anchor-factory";
import { Anchor } from "../anchor/anchor";
import { jsPlumbInstance, Size } from "../core";
import { Endpoint } from "../endpoint/endpoint-impl";
import { AnchorPlacement } from "../anchor-manager";
export interface FloatingAnchorOptions extends AnchorOptions {
    reference: Anchor;
    referenceCanvas: HTMLElement;
}
export declare class FloatingAnchor extends Anchor {
    instance: jsPlumbInstance;
    ref: Anchor;
    refCanvas: HTMLElement;
    size: Size;
    xDir: number;
    yDir: number;
    _lastResult: AnchorPlacement;
    constructor(instance: jsPlumbInstance, params: FloatingAnchorOptions);
    compute(params: AnchorComputeParams): AnchorPlacement;
    getOrientation(_endpoint: Endpoint): Orientation;
    /**
     * notification the endpoint associated with this anchor is hovering
     * over another anchor; we want to assume that anchor's orientation
     * for the duration of the hover.
     */
    over(anchor: Anchor, endpoint: Endpoint): void;
    /**
     * notification the endpoint associated with this anchor is no
     * longer hovering over another anchor; we should resume calculating
     * orientation as we normally do.
     */
    out(): void;
    getCurrentLocation(params: AnchorComputeParams): AnchorPlacement;
}
