import { Endpoint } from "../core/endpoint/endpoint";
import { Connection } from "../core/connector/connection-impl";
export declare enum SupportedEdge {
    top = 0,
    bottom = 1
}
export declare const DEFAULT_LIST_OPTIONS: {
    deriveAnchor: (edge: SupportedEdge, index: number, ep: Endpoint, conn: Connection) => string;
};
export declare const ATTR_SCROLLABLE_LIST = "jtk-scrollable-list";
export declare const SELECTOR_SCROLLABLE_LIST: string;
export declare const EVENT_SCROLL = "scroll";
//# sourceMappingURL=constants.d.ts.map