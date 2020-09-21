import {SelectionBase} from "./common"
import {Connection, ConnectorSpec} from ".."

export class ConnectionSelection extends SelectionBase<Connection> {

    setDetachable(d:boolean) {
        this.each((c:Connection) => c.setDetachable(d))
    }

    setReattach(d:boolean) {
        this.each((c:Connection) => c.setReattach(d))
    }

    setConnector(spec:ConnectorSpec) {
        this.each((c:Connection) => c.setConnector(spec))
    }

    deleteAll() {
        this.each((c:Connection) => this.instance.deleteConnection(c))
        this.clear()
    }
}
