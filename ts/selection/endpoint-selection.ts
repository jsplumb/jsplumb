import {SelectionBase} from "./common"
import {AnchorSpec, Endpoint} from ".."

export class EndpointSelection extends SelectionBase<Endpoint> {

    setEnabled(e:boolean) {
        this.each((ep:Endpoint) => ep.enabled = e)
    }
    setAnchor(a:AnchorSpec) {
        this.each((ep:Endpoint) => ep.setAnchor(a))
    }

    deleteEveryConnection() {
        this.each((ep:Endpoint) => ep.deleteEveryConnection())
    }

    deleteAll() {
        this.each((ep:Endpoint) => this.instance.deleteEndpoint(ep))
        this.clear()
    }

}
