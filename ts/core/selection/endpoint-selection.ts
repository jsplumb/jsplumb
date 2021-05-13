import {SelectionBase} from './common'
import {AnchorSpec} from '../factory/anchor-record-factory'
import { Endpoint} from '../endpoint/endpoint'

export class EndpointSelection extends SelectionBase<Endpoint> {

    setEnabled(e:boolean):EndpointSelection {
        this.each((ep:Endpoint) => ep.enabled = e)
        return this
    }
    setAnchor(a:AnchorSpec):EndpointSelection {
        this.each((ep:Endpoint) => ep.setAnchor(a))
        return this
    }

    deleteEveryConnection():EndpointSelection {
        this.each((ep:Endpoint) => ep.deleteEveryConnection())
        return this
    }

    deleteAll():EndpointSelection {
        this.each((ep:Endpoint) => this.instance.deleteEndpoint(ep))
        this.clear()
        return this
    }
}
