"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const runEventLooper = (queueVariables) => __awaiter(void 0, void 0, void 0, function* () {
    if (!queueVariables.queue.length) {
        queueVariables.isRunning = false;
        return;
    }
    const event = queueVariables.queue[queueVariables.queue.length - 1];
    yield event();
    queueVariables.queue.pop();
    setTimeout(() => runEventLooper(queueVariables), 0);
});
exports.createAsyncQueue = () => {
    const queueVariables = {
        isRunning: false,
        queue: [],
    };
    const run = () => {
        if (queueVariables.isRunning) {
            return;
        }
        queueVariables.isRunning = true;
        runEventLooper(queueVariables);
    };
    return {
        push(asyncFunction, triggerRun = true) {
            queueVariables.queue.unshift(asyncFunction);
            if (triggerRun) {
                run();
            }
        },
        run,
    };
};
