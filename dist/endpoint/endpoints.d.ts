import { jsPlumbInstance } from "../core";
import { ComputedAnchorPosition, Orientation } from "../factory/anchor-factory";
import { PaintStyle } from "../styles";
import { SegmentBounds } from "../connector/abstract-segment";
import { Endpoint } from "./endpoint-impl";
/**
 * Superclass for all types of Endpoint. This class is renderer
 * agnostic, as are any subclasses of it.
 */
export declare abstract class EndpointRepresentation<E, C> {
    endpoint: Endpoint<E>;
    typeId: string;
    x: number;
    y: number;
    w: number;
    h: number;
    computedValue: C;
    bounds: SegmentBounds;
    classes: Array<string>;
    instance: jsPlumbInstance<E>;
    abstract getType(): string;
    abstract _compute(anchorPoint: ComputedAnchorPosition, orientation: Orientation, endpointStyle: any): C;
    constructor(endpoint: Endpoint<E>);
    addClass(c: string): void;
    removeClass(c: string): void;
    paint(paintStyle: PaintStyle): void;
    clone(): EndpointRepresentation<E, C>;
    compute(anchorPoint: ComputedAnchorPosition, orientation: Orientation, endpointStyle: any): void;
    setVisible(v: boolean): void;
}
