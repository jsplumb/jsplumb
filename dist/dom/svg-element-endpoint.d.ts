import { EndpointRepresentation } from "../endpoint/endpoints";
import { PaintStyle } from "../styles";
import { EndpointHelperFunctions } from "./browser-renderer";
/**
 * Superclass for endpoint renderers that use an `svg` element wrapped in a `div` in the DOM.
 * Type specific subclasses are expected to implement a `makeNode` and `updateNode` method,
 * which respectively create the type-specific elements, and update them at paint time.
 */
export declare abstract class SvgEndpoint<C> {
    static getEndpointElement<C>(ep: EndpointRepresentation<C>): HTMLElement;
    static paint<C>(ep: EndpointRepresentation<C>, handlers: EndpointHelperFunctions, paintStyle: PaintStyle): void;
}
