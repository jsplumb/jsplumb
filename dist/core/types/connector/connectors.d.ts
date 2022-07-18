import { AbstractConnector } from "./abstract-connector";
import { Constructable } from "@jsplumb/util";
import { Connection } from "./connection-impl";
export declare const Connectors: {
    get: (connection: Connection, name: string, params: any) => AbstractConnector;
    register: (name: string, conn: Constructable<AbstractConnector>) => void;
};
//# sourceMappingURL=connectors.d.ts.map