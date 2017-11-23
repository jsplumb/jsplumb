import {JsPlumb, JsPlumbInstance} from "../core";
import {isArray, isObject, isString} from "../util/_is";
import {ParameterConfiguration} from "../jsplumb-defaults";
import {DynamicAnchor} from "./dynamic-anchor";
import {Anchor} from "./abstract-anchor";

export type AnchorOrientation = [ number, number ]
export type AnchorOffsets = [ number, number ]
export type AnchorLocation = [ number, number ]
export type AnchorSize = [ number, number ]

export type AnchorComputeParams = {
    xy:AnchorLocation,
    wh:AnchorSize,
    txy?:AnchorLocation,
    twh?:AnchorSize,
    timestamp:number,
    clearUserDefinedLocation?:Boolean
}

export class Anchors {

    static map:Map<string, Anchor<any, any>> = new Map();

    static AMBIVALENT_ORIENTATION:AnchorOrientation = [ 0, 0 ];

    static makeAnchor<EventType, ElementType>(params:any, elementId:string, _jsPlumb:JsPlumbInstance<EventType, ElementType>) {
        if (params == null) {
            return null;
        } else {
            let pp, _a = function (t:string, p:any) {
                if (Anchors.map[t]) {
                    return new Anchors.map[t](p);
                }
                if (!_jsPlumb.Defaults.DoNotThrowErrors) {
                    throw { msg: "jsPlumb: unknown anchor type '" + t + "'" };
                }
            };
            if (arguments.length === 0) {
                return null;
            }
            let specimen = arguments[0], el = arguments[1], newAnchor = null;
            // if it appears to be an anchor already...
            if (specimen.compute && specimen.getOrientation) {
                return specimen;
            }  //TODO hazy here about whether it should be added or is already added somehow.
            // is it the name of an anchor type?
            else if (isString(specimen)) {
                newAnchor = _a(arguments[0], {elementId: elementId, jsPlumbInstance: _jsPlumb});
            }
            // is it an array? it will be one of:
            // an array of [spec, params] - this defines a single anchor, which may be dynamic, but has parameters.
            // an array of arrays - this defines some dynamic anchors
            // an array of numbers - this defines a single anchor.
            else if (isArray(specimen)) {
                if (isArray(specimen[0]) || isString(specimen[0])) {
                    // if [spec, params] format
                    if (specimen.length === 2 && isObject(specimen[1])) {
                        // if first arg is a string, its a named anchor with params
                        if (isString(specimen[0])) {
                            pp = JsPlumb.extend({elementId: elementId, jsPlumbInstance: _jsPlumb}, specimen[1]);
                            newAnchor = _a(specimen[0], pp);
                        }
                        // otherwise first arg is array, second is params. we treat as a dynamic anchor, which is fine
                        // even if the first arg has only one entry. you could argue all anchors should be implicitly dynamic in fact.
                        else {
                            pp = JsPlumb.extend({elementId: elementId, jsPlumbInstance: _jsPlumb, anchors: specimen[0]}, specimen[1]);
                            newAnchor = new DynamicAnchor(pp);
                        }
                    }
                    else {
                        newAnchor = new DynamicAnchor({anchors: specimen, selector: null, elementId: elementId, jsPlumbInstance: _jsPlumb});
                    }

                }
                else {
                    let anchorParams = {
                        x: specimen[0], y: specimen[1],
                        orientation: (specimen.length >= 4) ? [ specimen[2], specimen[3] ] : [0, 0],
                        offsets: (specimen.length >= 6) ? [ specimen[4], specimen[5] ] : [ 0, 0 ],
                        elementId: elementId,
                        jsPlumbInstance: _jsPlumb,
                        cssClass: specimen.length === 7 ? specimen[6] : null
                    };
                    newAnchor = new Anchor(anchorParams);
                    (<any>newAnchor).clone = function () {
                        return new Anchor(anchorParams);
                    };
                }
            }

            if (!newAnchor.id) {
                newAnchor.id = "anchor_" + _jsPlumb._idstamp();
            }
            return newAnchor;
        }
    }

    static makeAnchors<EventType, ElementType>(types:Array<ParameterConfiguration>, elementId:string, jsPlumbInstance:JsPlumbInstance<EventType, ElementType>) {
        let r = [];
        for (let i = 0, ii = types.length; i < ii; i++) {
            if (typeof types[i] === "string") {
                r.push(Anchors.map[<string>types[i]]({elementId: elementId, jsPlumbInstance: jsPlumbInstance}));
            }
            else if (isArray(types[i])) {
                r.push(Anchors.makeAnchor(types[i], elementId, jsPlumbInstance));
            }
        }
        return r;
    };

    /**
     * Makes a dynamic anchor from the given list of anchors (which may be in shorthand notation as strings or dimension arrays, or Anchor
     * objects themselves) and the given, optional, anchorSelector function (jsPlumb uses a default if this is not provided; most people will
     * not need to provide this - i think).
     */
    static makeDynamicAnchor<EventType, ElementType>(anchors:any, anchorSelector:any, _jsPlumb:JsPlumbInstance<EventType, ElementType>) {
        return new DynamicAnchor({
            anchors: anchors,
            selector: anchorSelector,
            elementId: null,
            jsPlumbInstance: _jsPlumb
        });
    }

    static _curryAnchor(x:number, y:number, ox:number, oy:number, type:string, fnInit?:Function) {
        Anchors.map[type] = function (params:any) {
            let a = Anchors.makeAnchor([ x, y, ox, oy, 0, 0 ], params.elementId, params.jsPlumbInstance);
            a.type = type;
            if (fnInit) {
                fnInit(a, params);
            }
            return a;
        };
    }

    static _curryContinuousAnchor(type:string, faces:any) {
        Anchors.map[type] = function (params:any) {
            let a = Anchors.makeAnchor(["Continuous", { faces: faces }], params.elementId, params.jsPlumbInstance);
            a.type = type;
            return a;
        };
    }


}

Anchors._curryAnchor(0.5, 0, 0, -1, "TopCenter");
Anchors._curryAnchor(0.5, 1, 0, 1, "BottomCenter");
Anchors._curryAnchor(0, 0.5, -1, 0, "LeftMiddle");
Anchors._curryAnchor(1, 0.5, 1, 0, "RightMiddle");
Anchors._curryAnchor(0.5, 0, 0, -1, "Top");
Anchors._curryAnchor(0.5, 1, 0, 1, "Bottom");
Anchors._curryAnchor(0, 0.5, -1, 0, "Left");
Anchors._curryAnchor(1, 0.5, 1, 0, "Right");
Anchors._curryAnchor(0.5, 0.5, 0, 0, "Center");
Anchors._curryAnchor(1, 0, 0, -1, "TopRight");
Anchors._curryAnchor(1, 1, 0, 1, "BottomRight");
Anchors._curryAnchor(0, 0, 0, -1, "TopLeft");
Anchors._curryAnchor(0, 1, 0, 1, "BottomLeft");

Anchors._curryContinuousAnchor("ContinuousLeft", ["left"]);
Anchors._curryContinuousAnchor("ContinuousTop", ["top"]);
Anchors._curryContinuousAnchor("ContinuousBottom", ["bottom"]);
Anchors._curryContinuousAnchor("ContinuousRight", ["right"]);

// this anchor type lets you assign the position at connection time.
Anchors._curryAnchor(0, 0, 0, 0, "Assign", function (anchor:any, params:any) {
    // find what to use as the "position finder". the user may have supplied a String which represents
    // the id of a position finder in jsPlumb.AnchorPositionFinders, or the user may have supplied the
    // position finder as a function.  we find out what to use and then set it on the anchor.
    let pf = params.position || "Fixed";
    anchor.positionFinder = pf.constructor === String ? params.jsPlumbInstance.AnchorPositionFinders[pf] : pf;
    // always set the constructor params; the position finder might need them later (the Grid one does,
    // for example)
    anchor.constructorParams = params;
});

Anchors.map["Continuous"] = function (params:any) {
    return params.jsPlumbInstance.continuousAnchorFactory.get(params);
};

Anchors.map["AutoDefault"] = function (params:any) {
    let a = params.jsPlumbInstance.makeDynamicAnchor(params.jsPlumbInstance.makeAnchors(["TopCenter", "RightMiddle", "BottomCenter", "LeftMiddle"], params.elementId, params.jsPlumbInstance));
    a.type = "AutoDefault";
    return a;
};
