export interface AsyncQueue {
    push: (asyncFunction: () => Promise<void>, triggerRun?: boolean) => void;
    run: () => void;
}
export declare const createAsyncQueue: () => AsyncQueue;
