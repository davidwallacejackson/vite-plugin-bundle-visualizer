import { WorkerRequestEvent, WorkerResponseEvent } from '.';
import Worker from './index?worker';

const worker = new Worker();

worker.onmessage = function (e) {
  const resp = e.data as WorkerResponseEvent;

  for (const listener of listeners) {
    listener(resp);
  }
};

type Listener = (resp: WorkerResponseEvent) => void;
const listeners = new Set<Listener>();

export function registerListener(l: Listener) {
  listeners.add(l);
}

export function unregisterListener(l: Listener) {
  listeners.delete(l);
}

export function dispatch(e: WorkerRequestEvent) {
  const transfers: any[] = [];

  if (e.type === 'loadData') {
    transfers.push(e.data);
  }

  worker.postMessage(e, transfers);
}
