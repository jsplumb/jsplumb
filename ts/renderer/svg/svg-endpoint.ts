
import {SvgComponent} from "./svg-component";
import {_node, applyStyles, pos} from "./svg-util";
import {JsPlumb} from "../../core";

export class SvgEndpoint<EventType> extends SvgComponent<EventType> {

    node:any;

    constructor(params:any) {
        super({
            cssClass: params._jsPlumb.endpointClass,
            originalArgs: [params],
            pointerEventsSpec: "all",
            useDivWrapper: true,
            _jsPlumb: params._jsPlumb
        });

    }

    _paint(style:any) {
        let s = JsPlumb.extend({}, style);
        if (s.outlineStroke) {
            s.stroke = s.outlineStroke;
        }

        if (this.node == null) {
            this.node = _node(s);
            this.svg.appendChild(this.node);
        }

        // SP: what is this for? i noticed it while converting to typecript.
        // else if (this.updateNode != null) {
        //     this.updateNode(this.node);
        // }
        applyStyles(this.svg, this.node, s, [ this.x, this.y, this.w, this.h ], this);



        // a bug found by migrating to typescript: 'pos' only takes one argument, the array, and returns a string.
        // it does not set the absolute position of some element.  given that that is the case, it seems that this
        // line of cofe does nothing, and can be removed.
        //pos(this.node, [ this.x, this.y ]);

    }


}