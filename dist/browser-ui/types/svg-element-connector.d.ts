import { AbstractConnector, PaintStyle } from "@jsplumb/core";
import { Extents } from "@jsplumb/util";
/**
 * Renderer for a connector that uses an `svg` element in the DOM.
 */
export declare class SvgElementConnector {
    static paint(connector: AbstractConnector, paintStyle: PaintStyle, extents?: Extents): void;
    static getConnectorElement(c: AbstractConnector): SVGElement;
}
