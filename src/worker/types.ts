export interface Data {
  version: 2;
  tree: TreeNode;
  nodeParts: { [id: string]: NodePart };
  nodeMetas: { [id: string]: NodeMeta };
  env: { rollup: string };
  options: {
    gzip: boolean;
    brotli: boolean;
    sourcemap: boolean;
  };
}

export interface TreeAssetNode {
  uid: string;
  name: string;
}

export interface TreeNode {
  name: string;
  children: Array<TreeNode | TreeAssetNode>;
}

export interface NodePart {
  renderedLength: number;
  gzipLength: number;
  brotliLength: number;
  mainUid: string;
}

export interface NodeMeta {
  id: string;
  moduleParts: { [name: string]: string };
  imported: { uid: string }[];
  importedBy: { uid: string }[];
}

export interface FoamTreeData {
  id?: string;
  label: string;
  weight?: number;
  groups?: FoamTreeData[];
}
