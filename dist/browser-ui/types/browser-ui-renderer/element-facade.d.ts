import { Drag } from "./collicat";
import { jsPlumbDOMInformation } from "./browser-jsplumb-instance";
import { jsPlumbElement } from "../core/core";
import { Endpoint } from "../core/endpoint/endpoint";
export interface jsPlumbDOMElement extends HTMLElement, jsPlumbElement<Element> {
    _isJsPlumbGroup: boolean;
    _jsPlumbOrphanedEndpoints: Array<Endpoint>;
    offsetParent: jsPlumbDOMElement;
    parentNode: jsPlumbDOMElement;
    jtk: jsPlumbDOMInformation;
    _jsPlumbScrollHandler?: Function;
    _katavorioDrag?: Drag;
    cloneNode: (deep?: boolean) => jsPlumbDOMElement;
}
//# sourceMappingURL=element-facade.d.ts.map