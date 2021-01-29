import {BrowserJsPlumbInstance, jsPlumbDOMElement} from "./browser-jsplumb-instance"
import {
    EndpointSpec,
    Endpoint,
    Connection,
    AnchorSpec,
    Anchor,
    extend,
    Dictionary,
    EVENT_CONNECTION,
    EVENT_MANAGE_ELEMENT,
    EVENT_UNMANAGE_ELEMENT,
    SELECTOR_MANAGED_ELEMENT,
    TRUE,
    INTERCEPT_BEFORE_DROP
} from '@jsplumb/community-core'

export interface ListManagerOptions { }

export enum SupportedEdge {
    top, bottom
}

export interface JsPlumbListOptions {
    anchor?:AnchorSpec
    deriveAnchor?:(edge:SupportedEdge, index:number, ep:Endpoint, conn:Connection) => Anchor
    endpoint?:EndpointSpec
    deriveEndpoint?:(edge:SupportedEdge, index:number, ep:Endpoint, conn:Connection) => Endpoint
}

const DEFAULT_ANCHOR_LOCATIONS:Map<SupportedEdge, [string, string]> = new Map()
DEFAULT_ANCHOR_LOCATIONS.set(SupportedEdge.top, ["TopRight", "TopLeft"])
DEFAULT_ANCHOR_LOCATIONS.set(SupportedEdge.bottom, ["BottomRight", "BottomLeft"])

const DEFAULT_LIST_OPTIONS = {
    deriveAnchor:(edge:SupportedEdge, index:number, ep:Endpoint, conn:Connection) => {
        return DEFAULT_ANCHOR_LOCATIONS.get(edge)[index]
    }
}

export const ATTR_SCROLLABLE_LIST = "jtk-scrollable-list"
export const SELECTOR_SCROLLABLE_LIST = "[" + ATTR_SCROLLABLE_LIST + "]"
export const EVENT_SCROLL = "scroll"


/**
 * Provides methods to create/destroy scrollable lists.
 */
export class JsPlumbListManager {

    options:ListManagerOptions
    count: number
    lists: Dictionary<JsPlumbList>

    constructor(private instance:BrowserJsPlumbInstance, params?:ListManagerOptions) {
        this.count = 0
        this.lists = {}
        this.options = params || {}

        this.instance.bind(EVENT_MANAGE_ELEMENT, (p:any) => {

            //look for [jtk-scrollable-list] elements and attach scroll listeners if necessary
            const scrollableLists = this.instance.getSelector(p.el, SELECTOR_SCROLLABLE_LIST)
            for (let i = 0; i < scrollableLists.length; i++) {
                this.addList(scrollableLists[i])
            }

        })

        this.instance.bind(EVENT_UNMANAGE_ELEMENT, (p:any) => {
            this.removeList(p.el)
        })

        this.instance.bind(EVENT_CONNECTION, (params:{connection:Connection, source:Element, target:Element}, evt:MouseEvent) => {
            if (evt == null) {

                const targetParent = this.findParentList(params.target as unknown as jsPlumbDOMElement)
                if (targetParent != null) {
                    targetParent.newConnection(params.connection, params.target as unknown as jsPlumbDOMElement, 1)
                }

                const sourceParent = this.findParentList(params.source as unknown as jsPlumbDOMElement)
                if (sourceParent != null) {
                    sourceParent.newConnection(params.connection, params.source as unknown as jsPlumbDOMElement, 0)
                }

            }
        })

        //
        // intercept connection drops, and if the drop element belongs to a list, ensure that it is currently within the visible viewport of
        // the list. If it is not, reject the connection. This was reported in issue 944.
        //
        this.instance.bind(INTERCEPT_BEFORE_DROP, (p:any) => {
            const el = p.dropEndpoint.element as unknown as jsPlumbDOMElement
            const dropList = this.findParentList(el)
            return dropList == null || (el.offsetTop >= dropList.domElement.scrollTop && (el.offsetTop + el.offsetHeight < dropList.domElement.scrollTop + dropList.domElement.offsetHeight))
        })
    }

    /**
     * Configure the given element as a scrollable list.
     * @param el Element to configure as a list.
     * @param options Options for the list.
     */
    addList(el:Element, options?:JsPlumbListOptions):JsPlumbList {
        const dp = extend({} as any, DEFAULT_LIST_OPTIONS)
        extend(dp, this.options)
        options = extend(dp,  options || {})
        const id = [this.instance._instanceIndex, this.count++].join("_")
        this.lists[id] = new JsPlumbList(this.instance, el, options, id)
        return this.lists[id]
    }

    /**
     * Destroy any scrollable list associated with the given element.
     * @param el
     */
    removeList(el:Element) {
        const list = this.lists[(<jsPlumbDOMElement>el)._jsPlumbList]
        if (list) {
            list.destroy()
            delete this.lists[(<jsPlumbDOMElement>el)._jsPlumbList]
        }
    }

    findParentList(el:jsPlumbDOMElement):JsPlumbList {
        let parent = el.parentNode, container = this.instance.getContainer()
        while(parent != null && parent !== container) {
            if (parent._jsPlumbList != null && this.lists[parent._jsPlumbList] != null) {
                return this.lists[parent._jsPlumbList]
            }
            parent = parent.parentNode
        }
    }
}

/**
 * Models a list of elements that is scrollable, and connections to the elements contained in the list are proxied onto
 * the top of bottom edge of the list element whenever their source/target is not within the list element's current
 * viewport.
 */
export class JsPlumbList {

    _scrollHandler:Function
    readonly domElement:jsPlumbDOMElement
    private readonly elId:string

    constructor(private instance:BrowserJsPlumbInstance, private el:Element,
                private options:JsPlumbListOptions, id:string){
        this.domElement = el as unknown as jsPlumbDOMElement
        this.domElement._jsPlumbList = id
        this.elId = this.instance.getId(el)

        instance.setAttribute(el, ATTR_SCROLLABLE_LIST, TRUE)

        this._scrollHandler = this.scrollHandler.bind(this)

        this.domElement._jsPlumbScrollHandler = this._scrollHandler
        instance.on(el, EVENT_SCROLL, this._scrollHandler)

        this._scrollHandler() // run it once; there may be connections already.

    }

    /**
     * Derive an anchor to use for the current situation. In contrast to the way we derive an endpoint, here we use `anchor` from the options, if present, as
     * our first choice, and then `deriveAnchor` as our next choice. There is a default `deriveAnchor` implementation that uses TopRight/TopLeft for top and
     * BottomRight/BottomLeft for bottom.
     * @param edge Edge to find an anchor for - top or bottom
     * @param index 0 when endpoint is connection source, 1 when endpoint is connection target
     * @param ep the endpoint that is being proxied
     * @param conn the connection that is being proxied
     */
    private deriveAnchor(edge:SupportedEdge, index:number, ep:Endpoint, conn:Connection) {
        return this.options.anchor ? this.options.anchor : this.options.deriveAnchor(edge, index, ep, conn)
    }

    /**
     * Derive an endpoint to use for the current situation. We'll use a `deriveEndpoint` function passed in to the options as our first choice,
     * followed by `endpoint` (an endpoint spec) from the options, and failing either of those we just use the `type` of the endpoint that is being proxied.
     * @param edge Edge to find an endpoint for - top or bottom
     * @param index 0 when endpoint is connection source, 1 when endpoint is connection target
     * @param ep the endpoint that is being proxied
     * @param conn the connection that is being proxied
     */
    private deriveEndpoint(edge:SupportedEdge, index:number, ep:Endpoint, conn:Connection) {
        return this.options.deriveEndpoint ? this.options.deriveEndpoint(edge, index, ep, conn) : this.options.endpoint ? this.options.endpoint : ep.endpoint.getType()
    }

    /**
     * Notification that a new connection concerning this list has been added. This is not a method that should be
     * called as part of the public API; it is for the list manager to call.
     * @param c New connection
     * @param el The element which is either the source or target of the connection
     * @param index 0 if the element is connection source, 1 if it is connection target.
     */
    newConnection(c:Connection, el:jsPlumbDOMElement, index:number) {

        if (el.offsetTop < this.el.scrollTop) {
            if (!el._jsPlumbProxies) {
                this._proxyConnection(el, c, index, this.instance.getId(this.el), SupportedEdge.top)
            }
        }
        else if (el.offsetTop + el.offsetHeight > this.el.scrollTop + this.domElement.offsetHeight) {
            if (!el._jsPlumbProxies) {
                this._proxyConnection(el, c, index, this.instance.getId(this.el), SupportedEdge.bottom)
            }
        }
    }

    /**
     * Update all connections in the list. Run at init time and then whenever a scroll event occurs.
     */
    private scrollHandler () {

        const children = this.instance.getSelector(this.el, SELECTOR_MANAGED_ELEMENT)
        const elId = this.instance.getId(this.el)

        for (let i = 0; i < children.length; i++) {

            // if child element is above the viewport, with no proxies, proxy any connections to/from it
            if (children[i].offsetTop < this.el.scrollTop) {
                if (!children[i]._jsPlumbProxies) {
                    children[i]._jsPlumbProxies = children[i]._jsPlumbProxies || []
                    this.instance.select({source: children[i]}).each( (c) => {
                        this._proxyConnection(children[i], c, 0, elId, SupportedEdge.top)
                    })

                    this.instance.select({target: children[i]}).each( (c) => {
                        this._proxyConnection(children[i], c, 1, elId, SupportedEdge.top)
                    })
                }
            }
            // if child element is below the viewport, with no proxies, proxy any connections to/from it
            else if (children[i].offsetTop + children[i].offsetHeight > this.el.scrollTop + this.domElement.offsetHeight) {
                if (!children[i]._jsPlumbProxies) {
                    children[i]._jsPlumbProxies = children[i]._jsPlumbProxies || []

                    this.instance.select({source: children[i]}).each( (c:any) => {
                        this._proxyConnection(children[i], c, 0, elId, SupportedEdge.bottom)
                    })

                    this.instance.select({target: children[i]}).each( (c:any) => {
                        this._proxyConnection(children[i], c, 1, elId, SupportedEdge.bottom)
                    })
                }
            // if child element is in the viewport, and has proxied connections, unproxy them.
            } else if (children[i]._jsPlumbProxies) {
                for (let j = 0; j < children[i]._jsPlumbProxies.length; j++) {
                    this.instance.unproxyConnection(children[i]._jsPlumbProxies[j][0], children[i]._jsPlumbProxies[j][1], elId)
                }

                delete children[i]._jsPlumbProxies
            }

            this.instance.revalidate(children[i])
        }
    }

    /**
     * Configure a proxy for a connection.
     * @param el The element the connection is attached to.
     * @param conn The connection to proxy.
     * @param index 0 if the element is connection source, 1 if it is connection target
     * @param elId ID of the element the connection is attached to
     * @param edge List edge to proxy the connection to - top or bottom.
     * @private
     */
    private _proxyConnection(el:Element, conn:Connection, index:number, elId:string, edge:SupportedEdge) {
        this.instance.proxyConnection(conn, index, this.domElement, elId,  () => {
            return this.deriveEndpoint(edge, index, conn.endpoints[index], conn)
        },  () => {
            return this.deriveAnchor(edge, index, conn.endpoints[index], conn)
        });
        (el as any)._jsPlumbProxies = (el as any)._jsPlumbProxies || [];
        (el as any)._jsPlumbProxies.push([conn, index])
    }

    /**
     * Destroys the list, cleaning up the DOM.
     */
    destroy () {
        this.instance.off(this.el, EVENT_SCROLL, this._scrollHandler)
        delete this.domElement._jsPlumbScrollHandler

        const children = this.instance.getSelector(this.el, SELECTOR_MANAGED_ELEMENT)

        for (let i = 0; i < children.length; i++) {
            if (children[i]._jsPlumbProxies) {
                for (let j = 0; j < children[i]._jsPlumbProxies.length; j++) {
                    this.instance.unproxyConnection(children[i]._jsPlumbProxies[j][0], children[i]._jsPlumbProxies[j][1], this.elId)
                }

                delete children[i]._jsPlumbProxies
            }
        }
    }
}
