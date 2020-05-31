import { AnchorComputeParams, AnchorOptions, ComputedAnchorPosition, Orientation } from "../factory/anchor-factory";
import { Anchor } from "./anchor";
import { jsPlumbInstance, Size } from "../core";
import { Endpoint } from "../endpoint/endpoint-impl";
export interface FloatingAnchorOptions<E> extends AnchorOptions {
    reference: Anchor;
    referenceCanvas: E;
}
export declare class FloatingAnchor<E> extends Anchor {
    instance: jsPlumbInstance<E>;
    ref: Anchor;
    refCanvas: E;
    size: Size;
    xDir: number;
    yDir: number;
    _lastResult: ComputedAnchorPosition;
    constructor(instance: jsPlumbInstance<E>, params: FloatingAnchorOptions<E>);
    compute(params: AnchorComputeParams): ComputedAnchorPosition;
    getOrientation(_endpoint: Endpoint<E>): Orientation;
    /**
     * notification the endpoint associated with this anchor is hovering
     * over another anchor; we want to assume that anchor's orientation
     * for the duration of the hover.
     */
    over(anchor: Anchor, endpoint: Endpoint<E>): void;
    /**
     * notification the endpoint associated with this anchor is no
     * longer hovering over another anchor; we should resume calculating
     * orientation as we normally do.
     */
    out(): void;
    getCurrentLocation(params: AnchorComputeParams): ComputedAnchorPosition;
}
