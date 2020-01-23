
interface QueueVariables {
  isRunning: boolean;
  queue: (() => Promise<void>)[];
}

export interface AsyncQueue {
  push: (asyncFunction: () => Promise<void>, triggerRun?: boolean) => void;
  run: () => void;
}

const runEventLooper = async (queueVariables: QueueVariables): Promise<void> => {
  if (!queueVariables.queue.length) {
    // eslint-disable-next-line no-param-reassign
    queueVariables.isRunning = false;
    return;
  }

  const event = queueVariables.queue[queueVariables.queue.length - 1];
  await event();
  queueVariables.queue.pop();
  setTimeout(() => runEventLooper(queueVariables), 0);
};

export const createAsyncQueue = (): AsyncQueue => {
  const queueVariables: QueueVariables = {
    isRunning: false,
    queue: [],
  };
  const run = (): void => {
    if (queueVariables.isRunning) {
      return;
    }
    queueVariables.isRunning = true;
    runEventLooper(queueVariables);
  };

  return {
    push(asyncFunction: () => Promise<void>, triggerRun = true): void {
      queueVariables.queue.unshift(asyncFunction);

      if (triggerRun) {
        run();
      }
    },
    run,
  };
};
