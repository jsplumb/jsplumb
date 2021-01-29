import { SelectionBase } from './common';
import { AnchorSpec } from '../factory/anchor-factory';
import { Endpoint } from '../endpoint/endpoint';
export declare class EndpointSelection extends SelectionBase<Endpoint> {
    setEnabled(e: boolean): EndpointSelection;
    setAnchor(a: AnchorSpec): EndpointSelection;
    deleteEveryConnection(): EndpointSelection;
    deleteAll(): EndpointSelection;
}
