import {EndpointRepresentation} from "./endpoints";
import {AnchorOrientationHint, ComputedAnchorPosition, DotEndpoint, Endpoint, EndpointFactory} from "..";

export type ComputedImageEndpoint = [ number, number, number, number ];

export class ImageEndpoint<E> extends EndpointRepresentation<E, ComputedImageEndpoint> {

    onload:Function;
    src:string;
    cssClass:string;
    anchorPoint:ComputedAnchorPosition;

    _imageLoaded:boolean = false;
    _imageWidth:number;
    _imageHeight:number;

    constructor(endpoint:Endpoint<E>, params?:any) {

        super(endpoint);

        params = params || {};
        this.src = params.src || params.url;
        this.onload = params.onload;
        this.cssClass  = params.cssClass || "";
    }

    _compute(anchorPoint: [number, number, number, number], orientation: [AnchorOrientationHint, AnchorOrientationHint], endpointStyle: any): [number, number, number, number] {
        this.anchorPoint = anchorPoint;

        if (this._imageLoaded) {
            return [anchorPoint[0] - this._imageWidth / 2, anchorPoint[1] - this._imageHeight / 2,
                this._imageWidth, this._imageHeight];
        }
        else {
            return [0, 0, 0, 0];
        }
    }

    getType(): string {
        return "Image";
    }

}

EndpointFactory.register("Image", ImageEndpoint);
