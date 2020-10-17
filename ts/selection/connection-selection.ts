import {SelectionBase} from "./common"
import {Connection, ConnectorSpec} from ".."

export class ConnectionSelection extends SelectionBase<Connection> {

    setDetachable(d:boolean):ConnectionSelection {
        this.each((c:Connection) => c.setDetachable(d))
        return this
    }

    setReattach(d:boolean):ConnectionSelection {
        this.each((c:Connection) => c.setReattach(d))
        return this
    }

    setConnector(spec:ConnectorSpec):ConnectionSelection {
        this.each((c:Connection) => c.setConnector(spec))
        return this
    }

    deleteAll() {
        this.each((c:Connection) => this.instance.deleteConnection(c))
        this.clear()
    }

    repaint():ConnectionSelection {
        this.each((c:Connection) => c.paint())
        return this
    }
}
