import { AbstractConnector } from "./abstract-connector";
import { Constructable } from "@jsplumb/util";
import { Connection } from "./connection-impl";
export declare const Connectors: {
    get: (connection: Connection<any>, name: string, params: any) => AbstractConnector;
    register: (name: string, conn: Constructable<AbstractConnector>) => void;
};
