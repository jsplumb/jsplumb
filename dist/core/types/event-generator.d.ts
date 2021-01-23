export declare abstract class EventGenerator {
    private _listeners;
    private eventsSuspended;
    private tick;
    private eventsToDieOn;
    private queue;
    abstract shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    constructor();
    fire<T>(event: string, value?: T, originalEvent?: Event): any;
    private _drain;
    unbind(eventOrListener?: string | Function, listener?: Function): EventGenerator;
    getListener(forEvent: string): Array<any>;
    isSuspendEvents(): boolean;
    setSuspendEvents(val: boolean): void;
    bind<T = any>(event: string | Array<String>, listener: (a: T, e?: any) => any, insertAtStart?: boolean): EventGenerator;
    cleanupListeners(): void;
    silently(fn: Function): void;
}
export declare class OptimisticEventGenerator extends EventGenerator {
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
}
