import {AbstractConnector} from "./abstract-connector";
import {Constructable, Dictionary, jsPlumbInstance} from "../core";

const connectorMap:Dictionary<Constructable<AbstractConnector<any>>> = {};

export const Connectors = {
    get:(instance:jsPlumbInstance<any>, name:string, params:any):AbstractConnector<any> => {

        let c:Constructable<AbstractConnector<any>> = connectorMap[name];
        if (!c) {
            throw {message:"jsPlumb: unknown connector type '" + name + "'"};
        } else {
            return new c(instance, params) as AbstractConnector<any>;
        }
    },

    register:(name:string, conn:Constructable<AbstractConnector<any>>) => {
        connectorMap[name] = conn;
    }
};



