import { Anchor, AnchorComputeParams, AnchorOptions, AnchorPlacement, Endpoint, JsPlumbInstance, Orientation, Size } from "@jsplumb/community-core";
export interface FloatingAnchorOptions extends AnchorOptions {
    reference: Anchor;
    referenceCanvas: Element;
}
export declare class FloatingAnchor extends Anchor {
    instance: JsPlumbInstance;
    ref: Anchor;
    refCanvas: Element;
    size: Size;
    xDir: number;
    yDir: number;
    _lastResult: AnchorPlacement;
    constructor(instance: JsPlumbInstance, params: FloatingAnchorOptions);
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
