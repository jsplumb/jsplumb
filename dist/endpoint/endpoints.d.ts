import { jsPlumbInstance } from "../core";
import { Orientation } from "../factory/anchor-factory";
import { SegmentBounds } from "../connector/abstract-segment";
import { Endpoint } from "./endpoint-impl";
import { AnchorPlacement } from "../anchor-manager";
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
    instance: jsPlumbInstance;
    abstract getType(): string;
    abstract _compute(anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any): C;
    constructor(endpoint: Endpoint);
    addClass(c: string): void;
    removeClass(c: string): void;
    clone(): EndpointRepresentation<C>;
    compute(anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any): void;
    setVisible(v: boolean): void;
}
