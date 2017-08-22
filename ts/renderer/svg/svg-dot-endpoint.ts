
import {SvgEndpoint} from "./svg-endpoint";
import {RawElement} from "../../dom/dom-adapter";
import { node, attr } from "./svg-util";
import { DotEndpoint } from "../../endpoint/dot-endpoint";
import {applyMixins} from "../../util/mixin-util";

export class SvgDotEndpoint extends SvgEndpoint implements DotEndpoint {

    radius:number = 0;

    // NEED TO ALSO INHERIT FROM generic Dot endpoint. so i think that means the Dot endpoint needs to be a mixin.

    makeNode(style:any):RawElement {
        return node("circle", {
            "cx": this.w / 2,
            "cy": this.h / 2,
            "r": this.radius
        });
    }

    updateNode (node:RawElement) {
        attr(node, {
            "cx": this.w / 2,
            "cy": this.h / 2,
            "r": this.radius
        });
    }
}


applyMixins(SvgDotEndpoint, [ DotEndpoint] );