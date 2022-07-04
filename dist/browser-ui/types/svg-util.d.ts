export declare const STROKE_DASHARRAY = "stroke-dasharray";
export declare const DASHSTYLE = "dashstyle";
export declare const FILL = "fill";
export declare const STROKE = "stroke";
export declare const STROKE_WIDTH = "stroke-width";
export declare const LINE_WIDTH = "strokeWidth";
export declare const ELEMENT_SVG = "svg";
export declare const ELEMENT_PATH = "path";
export declare type ElementAttributes = Record<string, string | number>;
export declare function _attr(node: SVGElement, attributes: ElementAttributes): void;
export declare function _node(name: string, attributes?: ElementAttributes): SVGElement;
export declare function _pos(d: [number, number]): string;
export declare function _applyStyles(parent: any, node: SVGElement, style: any): void;
export declare function _appendAtIndex(svg: SVGElement, path: SVGElement, idx: number): void;
export declare function _size(svg: SVGElement, x: number, y: number, w: number, h: number): void;
export declare const svg: {
    attr: typeof _attr;
    node: typeof _node;
    ns: {
        svg: string;
    };
};
//# sourceMappingURL=svg-util.d.ts.map