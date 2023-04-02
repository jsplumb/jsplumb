
import { SupportedEdge, SELECTOR_SCROLLABLE_LIST, EVENT_SCROLL, DEFAULT_LIST_OPTIONS, ATTR_SCROLLABLE_LIST } from'./constants'
import {AnchorSpec} from "../common/anchor"
import {Endpoint} from "../core/endpoint/endpoint"
import {Connection} from "../core/connector/connection-impl"
import {EndpointSpec} from "../common/endpoint"
import {jsPlumbDOMElement} from "../browser-ui-renderer/element-facade"
import {
    BeforeDropParams,
    ConnectionEstablishedParams,
    ManageElementParams,
    UnmanageElementParams
} from "../core/callbacks"
import {
    EVENT_CONNECTION, EVENT_MANAGE_ELEMENT,
    EVENT_UNMANAGE_ELEMENT,
    INTERCEPT_BEFORE_DROP,
    SELECTOR_MANAGED_ELEMENT
} from "../core/constants"
import {extend} from "../util/util"
import {BrowserJsPlumbInstance} from "../browser-ui-renderer/browser-jsplumb-instance"

export interface ListManagerOptions { }

/**
 * Constructor options for a list.
 */
export interface JsPlumbListOptions {
    /**
     * Optional spec for the anchor to use when parking connections in response to a scroll.
     */
    anchor?:AnchorSpec
    /**
     * Optional function to use to get an anchor spec when parking a connection.
     * @param edge - The edge of the element on which the connection is to be parked - top or bottom.
     * @param index - Index of the endpoint that is being parked - 0 if source endpoint, 1 if target endpoint.
     * @param ep - The endpoint that is being parked
     * @param conn - The connection that is being parked
     */
    deriveAnchor?:(edge:SupportedEdge, index:number, ep:Endpoint, conn:Connection) => AnchorSpec
    /**
     * Optional spec for the endpoint to use when parking connections in response to a scroll.
     */
    endpoint?:EndpointSpec
    /**
     * Optional function to use to get an endpoint spec when parking a connection.
     * @param edge - The edge of the element on which the connection is to be parked - top or bottom.
     * @param index - Index of the endpoint that is being parked - 0 if source endpoint, 1 if target endpoint.
     * @param ep - The endpoint that is being parked
     * @param conn - The connection that is being parked
     */
    deriveEndpoint?:(edge:SupportedEdge, index:number, ep:Endpoint, conn:Connection) => EndpointSpec
}


/**
 * Provides methods to create/destroy scrollable lists.
 */
export class JsPlumbListManager {

    options:ListManagerOptions
    count: number
    lists: Record<string, JsPlumbList>

    constructor(private instance:BrowserJsPlumbInstance, params?:ListManagerOptions) {
        this.count = 0
        this.lists = {}
        this.options = params || {}

        this.instance.bind<ManageElementParams>(EVENT_MANAGE_ELEMENT, (p:ManageElementParams) => {

            //look for [jtk-scrollable-list] elements and attach scroll listeners if necessary
            const scrollableLists = this.instance.getSelector(p.el, SELECTOR_SCROLLABLE_LIST)
            for (let i = 0; i < scrollableLists.length; i++) {
                this.addList(scrollableLists[i])
            }

        })

        this.instance.bind<UnmanageElementParams>(EVENT_UNMANAGE_ELEMENT, (p:UnmanageElementParams) => {
            this.removeList(p.el)
        })

        this.instance.bind<ConnectionEstablishedParams>(EVENT_CONNECTION, (params:ConnectionEstablishedParams, evt:MouseEvent) => {
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
        this.instance.bind<BeforeDropParams>(INTERCEPT_BEFORE_DROP, (p:BeforeDropParams) => {
            const el = p.dropEndpoint.element as unknown as jsPlumbDOMElement
            const dropList = this.findParentList(el)
            return dropList == null || (el.offsetTop >= dropList.domElement.scrollTop && (el.offsetTop + el.offsetHeight <= dropList.domElement.scrollTop + dropList.domElement.offsetHeight))
        })
    }

    /**
     * Configure the given element as a scrollable list.
     * @param el - Element to configure as a list.
     * @param options - Options for the list.
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
     * Gets the list associated with the given element, if any.
     * @param el
     */
    getList(el:Element):JsPlumbList {
        const listId = this.instance.getAttribute(el, ATTR_SCROLLABLE_LIST)
        if (listId != null) {
            return this.lists[listId]
        }
    }

    /**
     * Destroy any scrollable list associated with the given element.
     * @param el
     */
    removeList(el:Element) {
        const list = this.getList(el)
        if (list) {
            list.destroy()
            delete this.lists[list.id]
        }
    }

    findParentList(el:jsPlumbDOMElement):JsPlumbList {
        let parent = el.parentNode, container = this.instance.getContainer(), parentList
        while(parent != null && parent !== container && (parent as any) !== document) {
            parentList = this.getList(parent)
            if (parentList != null) {
                return parentList
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
                private options:JsPlumbListOptions, public readonly id:string){
        this.domElement = el as unknown as jsPlumbDOMElement
        this.elId = this.instance.getId(el)

        instance.setAttribute(el, ATTR_SCROLLABLE_LIST, id)

        this._scrollHandler = this.scrollHandler.bind(this)

        this.domElement._jsPlumbScrollHandler = this._scrollHandler
        instance.on(el, EVENT_SCROLL, this._scrollHandler)

        this._scrollHandler() // run it once; there may be connections already.

    }

    /**
     * Derive an anchor to use for the current situation. In contrast to the way we derive an endpoint, here we use `anchor` from the options, if present, as
     * our first choice, and then `deriveAnchor` as our next choice. There is a default `deriveAnchor` implementation that uses TopRight/TopLeft for top and
     * BottomRight/BottomLeft for bottom.
     * @param edge - Edge to find an anchor for - top or bottom
     * @param index - 0 when endpoint is connection source, 1 when endpoint is connection target
     * @param ep - the endpoint that is being proxied
     * @param conn - the connection that is being proxied
     */
    private deriveAnchor(edge:SupportedEdge, index:number, ep:Endpoint, conn:Connection):AnchorSpec {
        return this.options.anchor ? this.options.anchor : this.options.deriveAnchor(edge, index, ep, conn)
    }

    /**
     * Derive an endpoint to use for the current situation. We'll use a `deriveEndpoint` function passed in to the options as our first choice,
     * followed by `endpoint` (an endpoint spec) from the options, and failing either of those we just use the `type` of the endpoint that is being proxied.
     * @param edge - Edge to find an endpoint for - top or bottom
     * @param index - 0 when endpoint is connection source, 1 when endpoint is connection target
     * @param ep - the endpoint that is being proxied
     * @param conn - the connection that is being proxied
     */
    private deriveEndpoint(edge:SupportedEdge, index:number, ep:Endpoint, conn:Connection):EndpointSpec {
        return this.options.deriveEndpoint ? this.options.deriveEndpoint(edge, index, ep, conn) : this.options.endpoint ? this.options.endpoint : ep.endpoint.type
    }

    /**
     * Notification that a new connection concerning this list has been added. This is not a method that should be
     * called as part of the public API; it is for the list manager to call.
     * @param c - New connection
     * @param el - The element which is either the source or target of the connection
     * @param index - 0 if the element is connection source, 1 if it is connection target.
     */
    newConnection(c:Connection, el:jsPlumbDOMElement, index:number) {

        if (el.offsetTop < this.el.scrollTop) {
            this._proxyConnection(el, c, index, SupportedEdge.top)
        }
        else if (el.offsetTop + el.offsetHeight > this.el.scrollTop + this.domElement.offsetHeight) {
            this._proxyConnection(el, c, index, SupportedEdge.bottom)
        }
    }

    /**
     * Update all connections in the list. Run at init time and then whenever a scroll event occurs.
     */
    private scrollHandler () {

        const children = this.instance.getSelector(this.el, SELECTOR_MANAGED_ELEMENT)

        for (let i = 0; i < children.length; i++) {

            // if child element is above the viewport, with no proxies, proxy any connections to/from it
            if (children[i].offsetTop < this.el.scrollTop) {
                children[i]._jsPlumbProxies = children[i]._jsPlumbProxies || []
                this.instance.select({source: children[i]}).each( (c) => {
                    this._proxyConnection(children[i], c, 0, SupportedEdge.top)
                })

                this.instance.select({target: children[i]}).each( (c) => {
                    this._proxyConnection(children[i], c, 1, SupportedEdge.top)
                })
            }
            // if child element is below the viewport, with no proxies, proxy any connections to/from it
            else if (children[i].offsetTop + children[i].offsetHeight > this.el.scrollTop + this.domElement.offsetHeight) {
                children[i]._jsPlumbProxies = children[i]._jsPlumbProxies || []

                this.instance.select({source: children[i]}).each( (c:any) => {
                    this._proxyConnection(children[i], c, 0, SupportedEdge.bottom)
                })

                this.instance.select({target: children[i]}).each( (c:any) => {
                    this._proxyConnection(children[i], c, 1, SupportedEdge.bottom)
                })
            // if child element is in the viewport, and has proxied connections, unproxy them.
            } else if (children[i]._jsPlumbProxies) {
                for (let j = 0; j < children[i]._jsPlumbProxies.length; j++) {
                    this.instance.unproxyConnection(children[i]._jsPlumbProxies[j][0], children[i]._jsPlumbProxies[j][1])
                }

                delete children[i]._jsPlumbProxies
            }

            this.instance.revalidate(children[i])
        }
    }

    /**
     * Configure a proxy for a connection.
     * @param el - The element the connection is attached to.
     * @param conn - The connection to proxy.
     * @param index - 0 if the element is connection source, 1 if it is connection target
     * @param edge - List edge to proxy the connection to - top or bottom.
     * @internal
     */
    private _proxyConnection(el:Element, conn:Connection, index:number, edge:SupportedEdge) {
        this.instance.proxyConnection(conn, index, this.domElement, (c:Connection, index:number) => {
            return this.deriveEndpoint(edge, index, conn.endpoints[index], conn)
        },  (c:Connection, index:number) => {
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
                    this.instance.unproxyConnection(children[i]._jsPlumbProxies[j][0], children[i]._jsPlumbProxies[j][1])
                }

                delete children[i]._jsPlumbProxies
            }
        }
    }
}
