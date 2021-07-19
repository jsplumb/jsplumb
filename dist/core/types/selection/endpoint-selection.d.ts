import { SelectionBase } from './common';
import { Endpoint } from '../endpoint/endpoint';
import { AnchorSpec } from "@jsplumb/common";
export declare class EndpointSelection extends SelectionBase<Endpoint> {
    setEnabled(e: boolean): EndpointSelection;
    setAnchor(a: AnchorSpec): EndpointSelection;
    deleteEveryConnection(): EndpointSelection;
    deleteAll(): EndpointSelection;
}
