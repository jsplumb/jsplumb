export function matchesSelector (el:HTMLElement, selector:string, ctx?:HTMLElement) {
    ctx = (ctx || el.parentNode) as HTMLElement;
    let possibles = ctx.querySelectorAll(selector);
    for (let i = 0; i < possibles.length; i++) {
        if (possibles[i] === el) {
            return true;
        }
    }
    return false;
}

export function consume (e:Event, doNotPreventDefault?:boolean) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    else {
        (<any>e).returnValue = false;
    }

    if (!doNotPreventDefault && e.preventDefault){
        e.preventDefault();
    }
}

/*
 * Function: sizeElement
 * Helper to size and position an element. You would typically use
 * this when writing your own Connector or Endpoint implementation.
 *
 * Parameters:
 *  x - [int] x position for the element origin
 *  y - [int] y position for the element origin
 *  w - [int] width of the element
 *  h - [int] height of the element
 *
 */
export function sizeElement (el:HTMLElement, x:number, y:number, w:number, h:number) {
    if (el) {
        el.style.height = h + "px";
        (<any>el).height = h;
        el.style.width = w + "px";
        (<any>el).width = w;
        el.style.left = x + "px";
        el.style.top = y + "px";
    }
}

