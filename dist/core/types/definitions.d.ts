import { UIGroup } from "./group/group";
import { Connection } from "./connector/declarations";
import { Endpoint } from "./endpoint/endpoint";
export interface jsPlumbElement<E> {
    _jsPlumbGroup: UIGroup<E>;
    _jsPlumbParentGroup: UIGroup<E>;
    _jsPlumbProxies: Array<[Connection, number]>;
    _isJsPlumbGroup: boolean;
    parentNode: jsPlumbElement<E>;
}
export declare type ManagedElement<E> = {
    id: string;
    el: jsPlumbElement<E>;
    endpoints: Array<Endpoint>;
    connections: Array<Connection>;
    rotation?: number;
    group?: string;
    data: Record<string, Record<string, any>>;
};
//# sourceMappingURL=definitions.d.ts.map