import { JsPlumbInstance } from "../core";
import { Orientation } from "../factory/anchor-record-factory";
import { Endpoint } from "./endpoint";
import { Extents } from '@jsplumb/util';
import { AnchorPlacement } from "@jsplumb/common";
export interface EndpointRepresentationParams {
    cssClass?: string;
}
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
    bounds: Extents;
    classes: Array<string>;
    instance: JsPlumbInstance;
    abstract type: string;
    protected constructor(endpoint: Endpoint, params?: EndpointRepresentationParams);
    addClass(c: string): void;
    removeClass(c: string): void;
    compute(anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any): void;
    setVisible(v: boolean): void;
}
