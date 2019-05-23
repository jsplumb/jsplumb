import {BrowserJsPlumbDefaults, BrowserJsPlumbInstance} from "./dom/drag";
import {extend} from "./core";

export * from "./anchor/floating-anchor";

export * from "./component/component";
export * from "./component/overlay-capable-component";

export * from "./connector/abstract-bezier-connector";
export * from "./connector/abstract-connector";
export * from "./connector/abstract-segment";
export * from "./connector/arc-segment";
export * from "./connector/bezier-connector";
export * from "./connector/bezier-segment";
export * from "./connector/connection-impl";
export * from "./connector/connectors";
export * from "./connector/flowchart-connector";
export * from "./connector/statemachine-connector";
export * from "./connector/straight-connector";
export * from "./connector/straight-segment";

export * from "./dom/browser-renderer";
export * from "./dom/drag";

export * from "./endpoint/endpoint-impl";
export * from "./endpoint/endpoints";
export * from "./endpoint/dot-endpoint";
export * from "./endpoint/rectangle-endpoint";
export * from "./endpoint/blank-endpoint";

export * from "./overlay/label-overlay";

export * from "./svg/svg-component";
export * from "./svg/svg-util";
export * from "./svg/svg-endpoint";

export * from "./anchor/anchor";
export * from "./anchor/dynamic-anchor";
export * from "./anchor/anchors";
export * from "./anchor-manager";
export * from "./browser-util";
export * from "./connection";
export * from  "./connector";
export * from "./constants";
export * from "./continuous-anchor";
export * from "./core";
export * from "./defaults";

export * from "./endpoint";
export * from "./endpoint/endpoint-renderer";
export * from "./event-generator";

export * from "./overlay"


export * from "./renderer";
export * from "./styles";
export * from "./util";



let _jsPlumbInstanceIndex = 0;

function getInstanceIndex ():number {
    let i = _jsPlumbInstanceIndex + 1;
    _jsPlumbInstanceIndex++;
    return i;
}

/**
 *
 * Entry point.
 *
 *
 */
if(typeof window !== "undefined") {

    //let c:Connection<any> = new Connection(null, null);

    (<any>window).jsPlumb = {
        newInstance:(defaults?:BrowserJsPlumbDefaults):BrowserJsPlumbInstance => {
            return new BrowserJsPlumbInstance(getInstanceIndex(), defaults);
        },
        ready:(f:Function) => {
            const _do = function () {
                if (/complete|loaded|interactive/.test(document.readyState) && typeof(document.body) !== "undefined" && document.body != null) {
                    f();
                }
                else {
                    setTimeout(_do, 9);
                }
            };

            _do();
        },
        extend:extend
    };


    //ready(_jp.init);
}