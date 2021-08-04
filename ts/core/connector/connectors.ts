import {AbstractConnector} from "./abstract-connector"
import {Constructable, Dictionary} from "@jsplumb/util"
import {Connection} from "./connection-impl"

const connectorMap:Dictionary<Constructable<AbstractConnector>> = {}

export const Connectors = {
    get:(connection:Connection, name:string, params:any):AbstractConnector => {

        let c:Constructable<AbstractConnector> = connectorMap[name]
        if (!c) {
            throw {message:"jsPlumb: unknown connector type '" + name + "'"}
        } else {
            return new c(connection, params) as AbstractConnector
        }
    },

    register:(name:string, conn:Constructable<AbstractConnector>) => {
        connectorMap[name] = conn
    }
}



