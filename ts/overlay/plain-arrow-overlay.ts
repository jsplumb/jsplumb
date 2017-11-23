import {ArrowOverlay} from "./arrow-overlay";
import {JsPlumb} from "../core";
import {Overlay} from "./overlay";
/**
 * Created by simon on 19/10/2017.
 */

export class PlainArrowOverlay<EventType, ElementType> extends ArrowOverlay<EventType, ElementType> {

    constructor(params:any) {
        super(JsPlumb.extend(params, {foldback: 1}));
    }

    overlayType = "PlainArrow";
}


Overlay.map["PlainArrow"] = PlainArrowOverlay;