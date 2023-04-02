import { AbstractConnector } from "./abstract-connector";
import { Connection } from "./connection-impl";
import { Constructable } from "../../util/util";
export declare const Connectors: {
    get: (connection: Connection, name: string, params: any) => AbstractConnector;
    register: (name: string, conn: Constructable<AbstractConnector>) => void;
};
//# sourceMappingURL=connectors.d.ts.map