export declare abstract class EventGenerator {
    private _listeners;
    private eventsSuspended;
    private tick;
    private eventsToDieOn;
    private queue;
    abstract shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    constructor();
    fire(event: string, value?: any, originalEvent?: Event): EventGenerator;
    private _drain;
    unbind(eventOrListener?: string | Function, listener?: Function): EventGenerator;
    getListener(forEvent: string): Array<any>;
    isSuspendEvents(): boolean;
    setSuspendEvents(val: boolean): void;
    bind(event: string | Array<String>, listener: Function, insertAtStart?: boolean): EventGenerator;
    cleanupListeners(): void;
    silently(fn: Function): void;
}
