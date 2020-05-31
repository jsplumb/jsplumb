import { EndpointRepresentation } from "./endpoints";
import { AnchorOrientationHint, ComputedAnchorPosition, Endpoint } from "..";
export declare type ComputedImageEndpoint = [number, number, number, number];
export declare class ImageEndpoint<E> extends EndpointRepresentation<E, ComputedImageEndpoint> {
    onload: Function;
    src: string;
    cssClass: string;
    anchorPoint: ComputedAnchorPosition;
    _imageLoaded: boolean;
    _imageWidth: number;
    _imageHeight: number;
    constructor(endpoint: Endpoint<E>, params?: any);
    _compute(anchorPoint: [number, number, number, number], orientation: [AnchorOrientationHint, AnchorOrientationHint], endpointStyle: any): [number, number, number, number];
    getType(): string;
}
