import {addToList, log, remove, uuid} from "./util";
import {Dictionary} from "./core";
export abstract class EventGenerator {

    private _listeners: Dictionary<Array<Function>> = {};
    private eventsSuspended: boolean = false;
    private tick: boolean = false;
    // this is a list of events that should re-throw any errors that occur during their dispatch.
    private eventsToDieOn: Dictionary<boolean> = {"ready": true};
    private queue: Array<any> = [];

    abstract shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;

    constructor() { }

    fire (event: string, value?: any, originalEvent?: Event): EventGenerator {
        if (!this.tick) {
            this.tick = true;
            if (!this.eventsSuspended && this._listeners[event]) {
                let l = this._listeners[event].length, i = 0, _gone = false, ret = null;
                if (!this.shouldFireEvent || this.shouldFireEvent(event, value, originalEvent)) {
                    while (!_gone && i < l && ret !== false) {
                        // doing it this way rather than catching and then possibly re-throwing means that an error propagated by this
                        // method will have the whole call stack available in the debugger.
                        if (this.eventsToDieOn[event]) {
                            this._listeners[event][i].apply(this, [value, originalEvent]);
                        }
                        else {
                            try {
                                ret = this._listeners[event][i].apply(this, [value, originalEvent]);
                            } catch (e) {
                                log("jsPlumb: fire failed for event " + event + " : " + e);
                            }
                        }
                        i++;
                        if (this._listeners == null || this._listeners[event] == null) {
                            _gone = true;
                        }
                    }
                }
            }
            this.tick = false;
            this._drain();
        } else {
            this.queue.unshift(arguments);
        }
        return this;
    }

    private _drain (): void {
        let n = this.queue.pop();
        if (n) {
            this.fire.apply(this, n);
        }
    }

    unbind (eventOrListener?: string | Function, listener?: Function): EventGenerator {

        if (arguments.length === 0) {
            this._listeners = {};
        }
        else if (arguments.length === 1) {
            if (typeof eventOrListener === "string") {
                delete this._listeners[eventOrListener];
            }
            else if ((<any>eventOrListener).__jsPlumb) {
                let evt;
                for (let i in (<any>eventOrListener).__jsPlumb) {
                    evt = (<any>eventOrListener).__jsPlumb[i];
                    remove(this._listeners[evt] || [], eventOrListener);
                }
            }
        }
        else if (arguments.length === 2) {
            remove(this._listeners[<string>eventOrListener] || [], listener);
        }

        return this;
    }

    getListener (forEvent: string): Array<any> {
        return this._listeners[forEvent];
    }

    isSuspendEvents(): boolean {
        return this.eventsSuspended;
    }

    setSuspendEvents (val: boolean) {
        this.eventsSuspended = val;
    }

    bind (event: string | Array<String>, listener: Function, insertAtStart?: boolean): EventGenerator {
        const _one = (evt: string) => {
            addToList(this._listeners, evt, listener, insertAtStart);
            (<any>listener).__jsPlumb = (<any>listener).__jsPlumb || {};
            (<any>listener).__jsPlumb[uuid()] = evt;
        };

        if (typeof event === "string") {
            _one(<string>event);
        }
        else if (event.length != null) {
            for (let i = 0; i < event.length; i++) {
                _one(<string>event[i]);
            }
        }

        return this;
    }

    cleanupListeners() {
        for (let i in this._listeners) {
            this._listeners[i] = null;
        }
    }

    silently (fn: Function) {
        this.setSuspendEvents(true);
        try {
            fn();
        }
        catch (e) {
            log("Cannot execute silent function " + e);
        }
        this.setSuspendEvents(false);
    }
}
