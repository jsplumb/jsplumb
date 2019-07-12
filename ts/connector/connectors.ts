import {AbstractConnector} from "./abstract-connector";
import {Constructable, Dictionary, jsPlumbInstance} from "../core";
import {Connection} from "./connection-impl";

const connectorMap:Dictionary<Constructable<AbstractConnector<any>>> = {};

export const Connectors = {
    get:(instance:jsPlumbInstance<any>, connection:Connection<any>, name:string, params:any):AbstractConnector<any> => {

        let c:Constructable<AbstractConnector<any>> = connectorMap[name];
        if (!c) {
            throw {message:"jsPlumb: unknown connector type '" + name + "'"};
        } else {
            return new c(instance, connection, params) as AbstractConnector<any>;
        }
    },

    register:(name:string, conn:Constructable<AbstractConnector<any>>) => {
        connectorMap[name] = conn;
    }
};



