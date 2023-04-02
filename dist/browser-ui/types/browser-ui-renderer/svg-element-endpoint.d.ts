import { EndpointHelperFunctions } from "./browser-jsplumb-instance";
import { EndpointRepresentation } from "../core/endpoint/endpoints";
import { PaintStyle } from "../common/index";
/**
 * Superclass for endpoint renderers that use an `svg` element wrapped in a `div` in the DOM.
 * Type specific subclasses are expected to implement a `makeNode` and `updateNode` method,
 * which respectively create the type-specific elements, and update them at paint time.
 */
export declare abstract class SvgEndpoint<C> {
    static getEndpointElement<C>(ep: EndpointRepresentation<C>): SVGElement;
    static paint<C>(ep: EndpointRepresentation<C>, handlers: EndpointHelperFunctions<any>, paintStyle: PaintStyle): void;
}
//# sourceMappingURL=svg-element-endpoint.d.ts.map