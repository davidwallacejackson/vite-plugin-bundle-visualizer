import * as prettyBytes from 'pretty-bytes';
import { Data, FoamTreeData, TreeAssetNode, TreeNode } from './types';

let loadedData: Data;
let moduleSizeCache: { [id: string]: number } = {};

export function loadData(newData: Data) {
  moduleSizeCache = {};
  loadedData = newData;
  return loadedData;
}

export function getFoamTree(
  tree: TreeNode | TreeAssetNode,
  type: 'gzip' | 'uncompressed',
  depth = Infinity
): FoamTreeData {
  const weight = getTreeSize(tree, type);
  return {
    id: 'uid' in tree ? tree.uid : tree.name,
    label: `${tree.name}\n${prettyBytes(weight)}`,
    groups:
      depth > 0 && 'children' in tree && tree.children.length > 0
        ? tree.children.map((child: TreeNode | TreeAssetNode) =>
            getFoamTree(child, type, depth - 1)
          )
        : undefined,
    weight,
  };
}

function getModuleSize(id: string, type: 'gzip' | 'uncompressed') {
  const key = type === 'gzip' ? 'gzipLength' : 'renderedLength';
  if (moduleSizeCache[id] === undefined) {
    if (loadedData.nodeMetas[id]) {
      const imported = loadedData.nodeMetas[id].imported;
      moduleSizeCache[id] = imported.reduce(
        (prev, imported) => prev + loadedData.nodeParts[imported.uid][key],
        0
      );
    } else {
      moduleSizeCache[id] = 0;
    }

    moduleSizeCache[id] += loadedData.nodeParts[id][key];
  }

  return moduleSizeCache[id];
}

function getTreeSize(
  tree: TreeNode | TreeAssetNode,
  type: 'gzip' | 'uncompressed'
): number {
  if ('uid' in tree) {
    return getModuleSize(tree.uid, type);
  }

  return tree.children.reduce(
    (prev, child) => prev + getTreeSize(child, type),
    0
  );
}
