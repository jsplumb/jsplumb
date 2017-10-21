import {addToList, log, remove, uuid} from "../util";
export abstract class EventGenerator<EventType> {

    listeners:Map<string, Array<Function>> = new Map();

    eventsSuspended:Boolean = false;

    tick:Boolean  = false;

    // this is a list of events that should re-throw any errors that occur during their dispatch. it is current private.
    eventsToDieOn:Map<string, Boolean> = new Map([
        ["ready", true]
    ]);

    queue:Array<any> = [];

    abstract shouldFireEvent(event:string, value:any, originalEvent?:EventType):Boolean

    constructor() {}

    bind(event:string|Array<string>, listener:Function, insertAtStart?:Boolean) {
        let _one = (evt:string) => {
            addToList(this.listeners, evt, listener, insertAtStart);
            (<any>listener).__jsPlumb = (<any>listener).__jsPlumb || {};
            (<any>listener).__jsPlumb[uuid()] = evt;
        };

        if (typeof event === "string") {
            _one(event);
        }
        else if (event.length != null) {
            for (let i = 0; i < event.length; i++) {
                _one(event[i]);
            }
        }

        return this;
    }

    fire (event:string, value?:any, originalEvent?:EventType):EventGenerator<EventType> {
        if (!this.tick) {
            this.tick = true;
            if (!this.eventsSuspended && this.listeners[event]) {
                let l = this.listeners[event].length, i = 0, _gone = false, ret = null;
                if (!this.shouldFireEvent || this.shouldFireEvent(event, value, originalEvent)) {
                    while (!_gone && i < l && ret !== false) {
                        // doing it this way rather than catching and then possibly re-throwing means that an error propagated by this
                        // method will have the whole call stack available in the debugger.
                        if (this.eventsToDieOn[event]) {
                            this.listeners[event][i].apply(this, [value, originalEvent]);
                        }
                        else {
                            try {
                                ret = this.listeners[event][i].apply(this, [value, originalEvent]);
                            } catch (e) {
                                log("jsPlumb: fire failed for event " + event + " : " + e);
                            }
                        }
                        i++;
                        if (this.listeners == null || this.listeners[event] == null) {
                            _gone = true;
                        }
                    }
                }
            }
            this.tick = false;
            this.drain();
        } else {
            this.queue.unshift(arguments);
        }
        return this;
    }

    private drain() {
        let n = this.queue.pop();
        if (n) {
            this.fire.apply(this, n);
        }
    }

    unbind (eventOrListener?:string|Function, listener?:Function) {

        if (arguments.length === 0) {
            this.listeners.clear();
        }
        else if (arguments.length === 1) {
            if (typeof eventOrListener === "string") {
                delete this.listeners[eventOrListener];
            }
            else if ((<any>eventOrListener).__jsPlumb) {
                let evt;
                for (let i in (<any>eventOrListener).__jsPlumb) {
                    evt = (<any>eventOrListener).__jsPlumb[i];
                    remove(this.listeners[evt] || [], eventOrListener);
                }
            }
        }
        else if (arguments.length === 2 && typeof eventOrListener === "string") {
            remove(this.listeners[(<string>eventOrListener)] || [], listener);
        }

        return this;
    }

    getListener(forEvent:string):Array<Function>|void {
        return this.listeners[forEvent];
    };

    setSuspendEvents (val:Boolean) {
        this.eventsSuspended = val;
    }

    isSuspendEvents() {
        return this.eventsSuspended;
    }

    silently(fn:Function) {
        this.setSuspendEvents(true);
        try {
            fn();
        }
        catch (e) {
            log("Cannot execute silent function " + e);
        }
        this.setSuspendEvents(false);
    }

    cleanupListeners() {
        for (let i in this.listeners) {
            this.listeners[i] = null;
        }
    }
}