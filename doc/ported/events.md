---
category: Miscellaneous
title: Events
keywords: event, events, click, bind
---

( work in progress for 4.x )


### JsPlumbInstance

EVENT_ZOOM "zoom"  (currentZoom:number)

---

EVENT_CONTAINER_CHANGE "container:change" (container:T["E"])

---

EVENT_CONNECTION_MOVED  "connection:move" (params:ConnectionMovedParams)

export interface ConnectionMovedParams<E = any>  {
    connection:Connection<E>
    index:number
    originalSourceId:string
    newSourceId:string
    originalTargetId:string
    newTargetId:string
    originalEndpoint:Endpoint<E>
    newEndpoint:Endpoint<E>
}
---

EVENT_CONNECTION_DETACHED  "connection:detach" (params:ConnectionDetachedParams)

export interface ConnectionEstablishedParams<E = any> {
    connection:Connection<E>
    source:E
    sourceEndpoint:Endpoint<E>
    sourceId:string
    target:E
    targetEndpoint:Endpoint<E>
    targetId:string
}

export interface ConnectionDetachedParams<E = any> extends ConnectionEstablishedParams<E> {

}

---

EVENT_MANAGE_ELEMENT  "manageElement"  (params:{el:T["E"]})

---

EVENT_UNMANAGE_ELEMENT  "unmanageElement"  (params:{el:T["E"]})

---

EVENT_CONNECTION   "connection"  (params:ConnectionEstablishedParams)

---

EVENT_ENDPOINT_REPLACED  "endpoint:replaced"  (params:{previous:Endpoint, current:Endpoint})

---

EVENT_GROUP_ADDED "group:add"  (params:{group:UIGroup})

---

EVENT_GROUP_REMOVED "group:remove"  (params:{group:UIGroup})

---

EVENT_GROUP_COLLAPSE "group:collapse" (params:{group:UIGroup})

---

EVENT_GROUP_EXPAND "group:expand" (params:{group:UIGroup})

---

EVENT_GROUP_MEMBER_ADDED "group:addMember"  (params:{group:UIGroup, el:T["E"], pos:PointXY, sourceGroup?:UIGroup})

---

EVENT_GROUP_MEMBER_REMOVED "group:removeMember"  (params:{group:UIGroup, el:T["E"], targetGroup?:UIGroup})

---

EVENT_NESTED_GROUP_ADDED "nestedGroupAdded" (params:{parent:UIGroup, child:UIGroup})

--- 

EVENT_NESTED_GROUP_REMOVED "nestedGroupRemoved" (params:{parent:UIGroup, child:UIGroup})

---

### Connection

EVENT_CLICK, EVENT_DBL_CLICK, EVENT_TAP, EVENT_DBL_TAP  (connection:Connection)

### Overlays


EVENT_CLICK, EVENT_DBL_CLICK, EVENT_TAP, EVENT_DBL_TAP  (no args)


### Endpoint

EVENT_CLICK, EVENT_DBL_CLICK, EVENT_TAP, EVENT_DBL_TAP  (endpoint:Endpoint)
EVENT_ANCHOR_CHANGED "anchor:changed"  (params:{endpoint:Endpoint, anchor:Anchor})

---
