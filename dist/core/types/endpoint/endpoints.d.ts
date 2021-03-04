import { JsPlumbInstance } from "../core";
import { Orientation } from "../factory/anchor-factory";
import { SegmentBounds } from "../connector/abstract-segment";
import { Endpoint } from "./endpoint";
import { AnchorPlacement } from "../router/router";
/**
 * Superclass for all types of Endpoint. This class is renderer
 * agnostic, as are any subclasses of it.
 */
export declare abstract class EndpointRepresentation<C> {
    endpoint: Endpoint;
    typeId: string;
    x: number;
    y: number;
    w: number;
    h: number;
    computedValue: C;
    bounds: SegmentBounds;
    classes: Array<string>;
    instance: JsPlumbInstance;
    abstract getType(): string;
    abstract _compute(anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any): C;
    /**
     * Subclasses must implement this for the clone functionality: they return an object containing the type specific
     * constructor values for the given endpoint.
     */
    abstract getParams(): Record<string, any>;
    protected constructor(endpoint: Endpoint);
    addClass(c: string): void;
    removeClass(c: string): void;
    compute(anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any): void;
    setVisible(v: boolean): void;
}
