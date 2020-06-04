import { PaintStyle } from "../styles";
import { AbstractConnector } from "../connector/abstract-connector";
/**
 * Renderer for a connector that uses an `svg` element in the DOM.
 */
export declare class SvgElementConnector {
    static paint(connector: AbstractConnector, paintStyle: PaintStyle, extents?: any): void;
    static getConnectorElement(c: AbstractConnector): SVGElement;
}
