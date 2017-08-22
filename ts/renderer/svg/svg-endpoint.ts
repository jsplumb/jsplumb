
import {jsPlumb} from "../../jsplumb";
import {SvgComponent} from "./svg-component";
import { applyStyles, pos } from "./svg-util";
import {RawElement} from "../../dom/dom-adapter";

export abstract class SvgEndpoint extends SvgComponent {

    abstract makeNode(style:any):RawElement;
    abstract updateNode(el:RawElement):void;

    constructor(params:any) {
        super({
            cssClass: params._jsPlumb.endpointClass,
            originalArgs: [params],
            pointerEventsSpec: "all",
            useDivWrapper: true,
            _jsPlumb: params._jsPlumb
        });

        this.renderer.paint = function (style) {
            let s = jsPlumb.extend({}, style);
            if (s.outlineStroke) {
                s.stroke = s.outlineStroke;
            }

            if (this.node == null) {
                this.node = this.makeNode(s);
                this.svg.appendChild(this.node);
            }
            else if (this.updateNode != null) {
                this.updateNode(this.node);
            }
            applyStyles(this.svg, this.node, s, [ this.x, this.y, this.w, this.h ], this);



            // a bug found by migrating to typescript: 'pos' only takes one argument, the array, and returns a string.
            // it does not set the absolute position of some element.  given that that is the case, it seems that this
            // line of cofe does nothing, and can be removed.
            //pos(this.node, [ this.x, this.y ]);

        };

    }

}