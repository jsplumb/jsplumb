import { SelectionBase } from "./common";
import { AnchorSpec, Endpoint } from "..";
export declare class EndpointSelection extends SelectionBase<Endpoint> {
    setEnabled(e: boolean): void;
    setAnchor(a: AnchorSpec): void;
    deleteEveryConnection(): void;
    deleteAll(): void;
}
