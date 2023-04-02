import {AbstractConnector} from "./abstract-connector"
import {Connection} from "./connection-impl"
import {Constructable} from "../../util/util"

const connectorMap:Record<string, Constructable<AbstractConnector>> = {}

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



