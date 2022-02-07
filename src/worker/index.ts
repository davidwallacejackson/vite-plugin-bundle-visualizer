import { getFoamTree, loadData } from './process';
import { FoamTreeData } from './types';

export type WorkerRequestEvent =
  | { type: 'getData' }
  | {
      type: 'loadData';
      sourceType: 'gzip' | 'uncompressed';
      data: ReadableStream;
    };

export type WorkerResponseEvent = {
  type: 'loadFoamTree';
  data: FoamTreeData;
};

onmessage = function (e) {
  console.log('loading');
  const workerEvent = e.data as WorkerRequestEvent;

  const { type } = workerEvent;

  switch (type) {
    case 'loadData':
      const { sourceType, data } = e.data;
      const resp = new Response(data);
      parseAndLoad(resp, sourceType);
      return;
    default:
      throw new Error('???');
  }
};

async function parseAndLoad(
  resp: Response,
  sourceType: 'gzip' | 'uncompressed'
) {
  const data = loadData(await resp.json());
  const foamTree = getFoamTree(data.tree, sourceType);

  console.log('responding');
  self.postMessage({
    type: 'loadFoamTree',
    data: foamTree,
  });
}
