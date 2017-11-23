
import {Connector} from "../../connector/connector";
import {FlowchartConnector} from "../../connector/flowchart-connector";
import {SvgConnector} from "./svg-connector";
import {Extents} from "./svg-component";

export class SvgFlowchartConnector<EventType, ElementType> extends FlowchartConnector<EventType, ElementType> {

    svgConnector:SvgConnector<EventType>;

    constructor(params:any) {
        super(params);

        this.svgConnector = new SvgConnector(params)
    }

    paint(style:any, anchor:any, extents:Extents) {

        // TODO temporary - use extents
        this.svgConnector.x = this.x;
        this.svgConnector.y = this.y;
        this.svgConnector.w = this.w;
        this.svgConnector.h = this.h;

        this.svgConnector.paint(style, anchor, extents);
    }

}

Connector.map["Flowchart"] = SvgFlowchartConnector;

