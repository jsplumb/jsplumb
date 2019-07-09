import {
    BlankEndpoint,
    BrowserJsPlumbInstance,
    ComputedImageEndpoint,
    Endpoint,
    EndpointRenderer,
    PaintStyle,
    TypeDescriptor
} from "..";
import {ImageEndpoint} from "../endpoint/image-endpoint";

export class DOMImageEndpointRenderer implements EndpointRenderer<HTMLElement> {

    canvas:HTMLElement;
    instance:BrowserJsPlumbInstance;
    _initialized:boolean = false;

    img:any;

    constructor(protected endpoint: Endpoint<HTMLElement>, public ep: ImageEndpoint<HTMLElement>, options?: any) {

        this.instance = endpoint.instance as BrowserJsPlumbInstance;
        this.canvas = endpoint.instance.createElement("img", {
            position:"absolute",
            margin:0,
            padding:0,
            outline:0
        }, this.instance.endpointClass + " " + ep.cssClass);

        this.instance.appendElement(this.canvas);

        this.img = new Image();

        this.img.onload = function () {
            //this._jsPlumb.ready = true;
            this.ep._imageLoaded = true;
            this.ep._imageWidth = this.ep._imageWidth || this.img.width;
            this.ep._imageHeight = this.ep._imageHeight || this.img.height;
            if (this.ep.onload) {
                this.ep.onload(this);
            }
        }.bind(this);

        (<any>this.endpoint).setImage = (_img:any, onload?:Function) => {
            var s = _img.constructor === String ? _img : _img.src;
            this.ep.onload = onload;
            this.img.src = s;

            if (this.canvas != null) {
                this.canvas.setAttribute("src", this.img.src);
            }
        };

        setTimeout(function() {
            (<any>this.endpoint).setImage(this.ep.src, onload);
        }.bind(this), 0)

    }

    applyType(t: TypeDescriptor): void { }

    cleanup(force?: boolean): void { }

    destroy(force?: boolean): void {
        this.instance.removeElement(this.canvas);
    }

    getElement(): HTMLElement {
        return this.canvas;
    }

    private actuallyPaint(paintStyle:PaintStyle):void {
        if (this.ep._imageLoaded) {
            if (!this._initialized) {
                this.canvas.setAttribute("src", this.img.src);
                this.instance.appendElement(this.canvas);
                this._initialized = true;
            }
            var x = this.ep.anchorPoint[0] - (this.ep._imageWidth / 2),
                y = this.ep.anchorPoint[1] - (this.ep._imageHeight / 2);

            this.canvas.style.left = x + "px";
            this.canvas.style.top = y + "px";
            this.canvas.style.width = this.ep._imageWidth + "px";
            this.canvas.style.height = this.ep._imageHeight + "px";
        }
    }

    paint(paintStyle: PaintStyle): void {

        if (this.ep._imageLoaded) {
            this.actuallyPaint(paintStyle);
        }
        else {
            setTimeout(function () {
                this.paint(paintStyle);
            }.bind(this), 200);
        }
    }

    setHover(h: boolean): void {
        this.instance[h ? "addClass" : "removeClass"](this.canvas, this.instance.hoverClass);
    }

    setVisible(v: boolean): void {
        this.canvas.style.display = v ? "block" : "none";
    }




}