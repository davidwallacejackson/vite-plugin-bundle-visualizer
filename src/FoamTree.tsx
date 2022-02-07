import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FoamTree as FoamTreeLib } from '@carrotsearch/foamtree';

interface FoamTreeData {
  id?: string;
  label: string;
  weight?: number;
  groups?: FoamTreeData[];
}
interface FoamTreeProps {
  data: FoamTreeData;
}
const FoamTree: FC<FoamTreeProps> = ({ data }) => {
  const [dimensions, setDimensions] = useState<DOMRectReadOnly | null>();
  const divRef = useRef<HTMLDivElement | null>(null);
  const foamTree = useRef<any>();

  const resizeObserver = useRef<ResizeObserver>();

  useEffect(() => {
    foamTree.current?.resize();
  }, [dimensions]);

  useLayoutEffect(() => {
    if (!foamTree.current && divRef.current) {
      resizeObserver.current = new ResizeObserver((entries) => {
        setDimensions(entries[0].contentRect);
      });
      resizeObserver.current.observe(divRef.current);
      foamTree.current = new FoamTreeLib({
        element: divRef.current,
        layout: 'ordered',
        stacking: 'flattened',
      });
    }
  });

  useLayoutEffect(() => {
    foamTree.current.set({
      dataObject: data,
    });
  }, [data]);

  return <div style={{ width: '100%', height: '100%' }} ref={divRef} />;
};

export default FoamTree;
