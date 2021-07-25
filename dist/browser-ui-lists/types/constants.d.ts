import { Connection, Endpoint } from "@jsplumb/core";
export declare enum SupportedEdge {
    top = 0,
    bottom = 1
}
export declare const DEFAULT_LIST_OPTIONS: {
    deriveAnchor: (edge: SupportedEdge, index: number, ep: Endpoint<any>, conn: Connection<any>) => string;
};
export declare const ATTR_SCROLLABLE_LIST = "jtk-scrollable-list";
export declare const SELECTOR_SCROLLABLE_LIST: string;
export declare const EVENT_SCROLL = "scroll";
