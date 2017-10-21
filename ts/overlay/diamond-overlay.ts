import {ArrowOverlay} from "./arrow-overlay";
import {JsPlumb} from "../core";
import {Overlays} from "./overlay-capable-component";

export class DiamondOverlay<EventType, ElementType> extends ArrowOverlay<EventType, ElementType> {

    overlayType = "Diamond";

    constructor(params:any) {
        super(JsPlumb.extend(params, {length: (params.length || 40) / 2, foldback: 2}));
    }

}

Overlays.map["Diamond"] = DiamondOverlay;