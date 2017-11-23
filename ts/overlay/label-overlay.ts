import {DOMOverlay} from "./dom-overlay";
import {ArrayLocation} from "../jsplumb-defaults";
import {Overlay} from "./overlay";
import {JsPlumb} from "../core";

export class LabelOverlay<EventType, ElementType> extends DOMOverlay<EventType, ElementType> {

    overlayType = "Label";
    labelStyle:any;
    cssClass:string;
    label:string|Function;
    labelText:any;
    div:any;

    constructor(params:any) {

        super(JsPlumb.extend(params, {
            create: () => {
                return this.instance.createElement("div");
            }
        }));

        this.labelStyle = params.labelStyle;

        let labelWidth = null, labelHeight = null, labelText = null, labelPadding = null;
        this.cssClass = this.labelStyle != null ? this.labelStyle.cssClass : null;
        let p = JsPlumb.extend({
            create: function () {
                return this.instance.createElement("div");
            }}, params);

        //_jp.Overlays.Custom.call(this, p);

        this.label = params.label || "";
        this.labelText = null;

        if (this.labelStyle) {
            let el = this.getElement();
            this.labelStyle.font = this.labelStyle.font || "12px sans-serif";
            el.style.font = this.labelStyle.font;
            el.style.color = this.labelStyle.color || "black";
            if (this.labelStyle.fill) {
                el.style.background = this.labelStyle.fill;
            }
            if (this.labelStyle.borderWidth > 0) {
                let dStyle = this.labelStyle.borderStyle ? this.labelStyle.borderStyle : "black";
                el.style.border = this.labelStyle.borderWidth + "px solid " + dStyle;
            }
            if (this.labelStyle.padding) {
                el.style.padding = this.labelStyle.padding;
            }
        }

    }

    cleanup(force?:Boolean) {

        if (force) {

            super.cleanup(force);

            this.div = null;
            this.label = null;
            this.labelText = null;
            this.cssClass = null;
            this.labelStyle = null;
        }
    }

    getLabel() {
        return this.label;
    }

    setLabel(l:string) {
        this.label = l;
        this.labelText = null;
        this.clearCachedDimensions();
        this.update();
        this.component.repaint();
    }

    getDimensions(): ArrayLocation  {
        this.update();
        return super.getDimensions();
    }

    update() {
        if (this.label instanceof Function) {
            let lt = this.label(this);
            this.getElement().innerHTML = lt.replace(/\r\n/g, "<br/>");
        }
        else {
            if (this.labelText == null) {
                this.labelText = this.label;
                this.getElement().innerHTML = this.labelText.replace(/\r\n/g, "<br/>");
            }
        }
    }

    updateFrom(d:any) {
        if(d.label != null){
            this.setLabel(d.label);
        }
    }
}

Overlay.map["Label"] = LabelOverlay;

