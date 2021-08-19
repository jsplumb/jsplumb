import {Dictionary, addToDictionary, log, remove, uuid} from "./util"


/**
 * Base class for classes that wish to support binding and firing of events. You need to implement the `shouldFireEvent` method
 * in your concrete subclasses of this class.
 */
export abstract class EventGenerator {

    private _listeners: Dictionary<Array<Function>> = {}
    private eventsSuspended: boolean = false
    private tick: boolean = false
    // this is a list of events that should re-throw any errors that occur during their dispatch.
    private eventsToDieOn: Dictionary<boolean> = {"ready": true}
    private queue: Array<any> = []

    protected abstract shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean

    constructor() { }

    /**
     * Fire the named event
     * @param event Event to fire
     * @param value Value to pass to event handlers
     * @param originalEvent Optional original event that caused this event to be fired.
     */
    fire<T>(event: string, value?: T, originalEvent?: Event): any {
        let ret = null
        if (!this.tick) {
            this.tick = true
            if (!this.eventsSuspended && this._listeners[event]) {
                let l = this._listeners[event].length, i = 0, _gone = false
                if (!this.shouldFireEvent || this.shouldFireEvent(event, value, originalEvent)) {
                    while (!_gone && i < l && ret !== false) {
                        // doing it this way rather than catching and then possibly re-throwing means that an error propagated by this
                        // method will have the whole call stack available in the debugger.
                        if (this.eventsToDieOn[event]) {
                            this._listeners[event][i].apply(this, [value, originalEvent])
                        }
                        else {
                            try {
                                ret = this._listeners[event][i].apply(this, [value, originalEvent])
                            } catch (e) {
                                log("jsPlumb: fire failed for event " + event + " : " + (e.message || e))
                            }
                        }
                        i++
                        if (this._listeners == null || this._listeners[event] == null) {
                            _gone = true
                        }
                    }
                }
            }
            this.tick = false
            this._drain()
        } else {
            this.queue.unshift(arguments)
        }
        return ret
    }

    /**
     * Drain the queue of pending event notifications
     * @private
     */
    private _drain (): void {
        let n = this.queue.pop()
        if (n) {
            this.fire.apply(this, n)
        }
    }

    /**
     * Unbind the given event listener, or all listeners. If you call this method with no arguments then all event
     * listeners are unbound.
     * @param eventOrListener Either an event name, or an event handler function
     * @param listener If `eventOrListener` is defined, this is the event handler to unbind.
     */
    unbind (eventOrListener?: string | Function, listener?: Function): EventGenerator {

        if (arguments.length === 0) {
            this._listeners = {}
        }
        else if (arguments.length === 1) {
            if (typeof eventOrListener === "string") {
                delete this._listeners[eventOrListener]
            }
            else if ((<any>eventOrListener).__jsPlumb) {
                let evt
                for (let i in (<any>eventOrListener).__jsPlumb) {
                    evt = (<any>eventOrListener).__jsPlumb[i]
                    remove(this._listeners[evt] || [], eventOrListener)
                }
            }
        }
        else if (arguments.length === 2) {
            remove(this._listeners[<string>eventOrListener] || [], listener)
        }

        return this
    }

    /**
     * gets all listeners for the given named event.
     * @param forEvent
     */
    getListener (forEvent: string): Array<any> {
        return this._listeners[forEvent] || []
    }

    /**
     * Returns whether not event firing is currently suspended
     */
    isSuspendEvents(): boolean {
        return this.eventsSuspended
    }

    /**
     * Sets whether not event firing is currently suspended
     */
    setSuspendEvents (val: boolean) {
        this.eventsSuspended = val
    }

    /**
     * Bind an event listener. This method can be used with a type parameter by call sites; although it's not necessary it can be
     * helpful to use this to ensure you've thought about what the payload to your event handler is going to be.
     * @param event Name of the event(s) to bind to.
     * @param listener Function to bind to the given event(s)
     * @param insertAtStart Whether or not to insert this listener at the head of the listener queue. Defaults to false.
     */
    bind<T=any>(event: string | Array<String>, listener: (a:T, e?:any) => any, insertAtStart?: boolean): EventGenerator {
        const _one = (evt: string) => {
            addToDictionary(this._listeners, evt, listener, insertAtStart)
            ;(<any>listener).__jsPlumb = (<any>listener).__jsPlumb || {}
            ;(<any>listener).__jsPlumb[uuid()] = evt
        }

        if (typeof event === "string") {
            _one(<string>event)
        }
        else if (event.length != null) {
            for (let i = 0; i < event.length; i++) {
                _one(<string>event[i])
            }
        }

        return this
    }

    /**
     * Run the given function without firing any events.
     * @param fn
     */
    silently (fn: Function) {
        this.setSuspendEvents(true)
        try {
            fn()
        }
        catch (e) {
            log("Cannot execute silent function " + e)
        }
        this.setSuspendEvents(false)
    }
}

/**
 * Subclass of EventGenerator with a default implementation of `shouldFireEvent`, which returns true always.
 */
export class OptimisticEventGenerator extends EventGenerator {
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean {
        return true
    }
}
