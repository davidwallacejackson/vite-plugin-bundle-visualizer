import { ChangeEventHandler, useEffect, useState } from 'react';
import './App.css';
import FoamTree from './FoamTree';

import * as S from './App.styles';
import { FoamTreeData } from './worker/types';
import {
  dispatch,
  registerListener,
  unregisterListener,
} from './worker/client';
import { WorkerResponseEvent } from './worker';

function App() {
  const [foamTree, setFoamTree] = useState<FoamTreeData>();

  const handleFile: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const stream = file.stream();
      dispatch({ type: 'loadData', sourceType: 'gzip', data: stream });
    }
  };

  useEffect(() => {
    const listener = (resp: WorkerResponseEvent) => {
      console.log('receiving');
      if (resp.type === 'loadFoamTree') {
        setFoamTree(resp.data);
      }
    };
    registerListener(listener);

    return () => unregisterListener(listener);
  }, []);

  return (
    <S.Wrapper>
      <S.Controls>
        <input type="file" onChange={handleFile} />
      </S.Controls>
      <S.TreeContainer>
        {foamTree && <FoamTree data={foamTree} />}
      </S.TreeContainer>
    </S.Wrapper>
  );
}

export default App;
