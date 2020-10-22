import {BrowserJsPlumbInstance, jsPlumbDOMElement} from "./browser-jsplumb-instance"
import {Dictionary} from '../core/common'
import { extend } from '../core/util'
import { Anchor } from '../core/anchor/anchor'
import { AnchorSpec } from '../core/factory/anchor-factory'
import { Connection } from '../core/connector/connection-impl'
import { Endpoint } from '../core/endpoint/endpoint-impl'
import { EndpointSpec } from '../core/endpoint/endpoint'

export interface ListManagerOptions { }

export interface jsPlumbListOptions {
    anchor?:AnchorSpec
    deriveAnchor?:(edge:string, index:number, ep:Endpoint, conn:Connection) => Anchor
    endpoint?:EndpointSpec
    deriveEndpoint?:(edge:string, index:number, ep:Endpoint, conn:Connection) => Endpoint
}

const DEFAULT_LIST_OPTIONS = {
    deriveAnchor:(edge:string, index:number, ep:Endpoint, conn:Connection) => {
        return {
            top:["TopRight", "TopLeft"],
            bottom:["BottomRight", "BottomLeft"]
        }[edge][index]
    }
}

export class jsPlumbListManager {

    options:ListManagerOptions
    count: number
    lists: Dictionary<jsPlumbList>

    constructor(private instance:BrowserJsPlumbInstance, params?:ListManagerOptions) {
        this.count = 0
        this.lists = {}
        this.options = params || {}

        this.instance.bind("manageElement", (p:any) => {

            //look for [jtk-scrollable-list] elements and attach scroll listeners if necessary
            const scrollableLists = this.instance.getSelector(p.el, "[jtk-scrollable-list]")
            for (let i = 0; i < scrollableLists.length; i++) {
                this.addList(scrollableLists[i])
            }

        })

        this.instance.bind("unmanageElement", (p:any) => {
            this.removeList(p.el)
        })

        this.instance.bind("connection", (c:Connection, evt:MouseEvent) => {
            if (evt == null) {
                // not added by mouse. look for an ancestor of the source and/or target element that is a scrollable list, and run
                // its scroll method.
                this._maybeUpdateParentList(c.source)
                this._maybeUpdateParentList(c.target)
            }
        })
    }

    addList(el:jsPlumbDOMElement, options?:jsPlumbListOptions):jsPlumbList {
        const dp = extend({} as any, DEFAULT_LIST_OPTIONS)
        extend(dp, this.options)
        options = extend(dp,  options || {})
        const id = [this.instance._instanceIndex, this.count++].join("_")
        this.lists[id] = new jsPlumbList(this.instance, el, options, id)
        return this.lists[id]
    }

    removeList(el:jsPlumbDOMElement) {
        const list = this.lists[el._jsPlumbList]
        if (list) {
            list.destroy()
            delete this.lists[el._jsPlumbList]
        }
    }

    _maybeUpdateParentList(el:jsPlumbDOMElement) {
        let parent = el.parentNode, container = this.instance.getContainer()
        while(parent != null && parent !== container) {
            if (parent._jsPlumbList != null && this.lists[parent._jsPlumbList] != null) {
                parent._jsPlumbScrollHandler && parent._jsPlumbScrollHandler()
                return
            }
            parent = parent.parentNode
        }
    }
}


export class jsPlumbList {

    _scrollHandler:Function

    constructor(private instance:BrowserJsPlumbInstance, private el:jsPlumbDOMElement, private options:jsPlumbListOptions, id:string){
        el._jsPlumbList = id

        instance.setAttribute(el, "jtk-scrollable-list", "true")

        this._scrollHandler = this.scrollHandler.bind(this)

        el._jsPlumbScrollHandler = this._scrollHandler
        instance.on(el, "scroll", this._scrollHandler)

        this._scrollHandler(); // run it once; there may be connections already.

    }

    //
    // Derive an anchor to use for the current situation. In contrast to the way we derive an endpoint, here we use `anchor` from the options, if present, as
    // our first choice, and then `deriveAnchor` as our next choice. There is a default `deriveAnchor` implementation that uses TopRight/TopLeft for top and
    // BottomRight/BottomLeft for bottom.
    //
    // edge - "top" or "bottom"
    // index - 0 when endpoint is connection source, 1 when endpoint is connection target
    // ep - the endpoint that is being proxied
    // conn - the connection that is being proxied
    //
    private deriveAnchor(edge:string, index:number, ep:Endpoint, conn:Connection) {
        return this.options.anchor ? this.options.anchor : this.options.deriveAnchor(edge, index, ep, conn)
    }

    //
    // Derive an endpoint to use for the current situation. We'll use a `deriveEndpoint` function passed in to the options as our first choice,
    // followed by `endpoint` (an endpoint spec) from the options, and failing either of those we just use the `type` of the endpoint that is being proxied.
    //
    // edge - "top" or "bottom"
    // index - 0 when endpoint is connection source, 1 when endpoint is connection target
    // endpoint - the endpoint that is being proxied
    // connection - the connection that is being proxied
    //
    deriveEndpoint(edge:string, index:number, ep:Endpoint, conn:Connection) {
        return this.options.deriveEndpoint ? this.options.deriveEndpoint(edge, index, ep, conn) : this.options.endpoint ? this.options.endpoint : ep.endpoint.getType()
    }

    scrollHandler () {

        const children = this.instance.getSelector(this.el, "[jtk-managed]")
        const elId = this.instance.getId(this.el)

        for (let i = 0; i < children.length; i++) {

            if (children[i].offsetTop < this.el.scrollTop) {
                if (!children[i]._jsPlumbProxies) {
                    children[i]._jsPlumbProxies = children[i]._jsPlumbProxies || []
                    this.instance.select({source: children[i]}).each( (c) => {
                        this.instance.proxyConnection(c, 0, this.el, elId,  () => {
                            return this.deriveEndpoint("top", 0, c.endpoints[0], c)
                        },  () => {
                            return this.deriveAnchor("top", 0, c.endpoints[0], c)
                        })
                        children[i]._jsPlumbProxies.push([c, 0])
                    })

                    this.instance.select({target: children[i]}).each( (c) => {
                        this.instance.proxyConnection(c, 1, this.el, elId,  () => {
                            return this.deriveEndpoint("top", 1, c.endpoints[1], c)
                        },  () => {
                            return this.deriveAnchor("top", 1, c.endpoints[1], c)
                        })
                        children[i]._jsPlumbProxies.push([c, 1])
                    })
                }
            }
            //
            else if (children[i].offsetTop + children[i].offsetHeight > this.el.scrollTop + this.el.offsetHeight) {
                if (!children[i]._jsPlumbProxies) {
                    children[i]._jsPlumbProxies = children[i]._jsPlumbProxies || []

                    this.instance.select({source: children[i]}).each( (c:any) => {
                        this.instance.proxyConnection(c, 0, this.el, elId,  () => {
                            return this.deriveEndpoint("bottom", 0, c.endpoints[0], c)
                        },  () => {
                            return this.deriveAnchor("bottom", 0, c.endpoints[0], c)
                        })
                        children[i]._jsPlumbProxies.push([c, 0])
                    })

                    this.instance.select({target: children[i]}).each( (c:any) => {
                        this.instance.proxyConnection(c, 1, this.el, elId, () => {
                            return this.deriveEndpoint("bottom", 1, c.endpoints[1], c)
                        },  () => {
                            return this.deriveAnchor("bottom", 1, c.endpoints[1], c)
                        })
                        children[i]._jsPlumbProxies.push([c, 1])
                    })
                }
            } else if (children[i]._jsPlumbProxies) {
                for (let j = 0; j < children[i]._jsPlumbProxies.length; j++) {
                    this.instance.unproxyConnection(children[i]._jsPlumbProxies[j][0], children[i]._jsPlumbProxies[j][1], elId)
                }

                delete children[i]._jsPlumbProxies
            }

            this.instance.revalidate(children[i])
        }
    }

    destroy () {
        this.instance.off(this.el, "scroll", this._scrollHandler)
        delete this.el._jsPlumbScrollHandler

        const children = this.instance.getSelector(this.el, "[jtk-managed]")
        const elId = this.instance.getId(this.el)

        for (let i = 0; i < children.length; i++) {
            if (children[i]._jsPlumbProxies) {
                for (let j = 0; j < children[i]._jsPlumbProxies.length; j++) {
                    this.instance.unproxyConnection(children[i]._jsPlumbProxies[j][0], children[i]._jsPlumbProxies[j][1], elId)
                }

                delete children[i]._jsPlumbProxies
            }
        }
    }
}
