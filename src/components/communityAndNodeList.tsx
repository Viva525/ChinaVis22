import React, { LegacyRef, useEffect } from 'react';
import {asLineUp} from 'lineupjs'
import 'lineupjs/build/LineUpJS.css'

const CommunityAndNodeList: React.FC<{}> = () => {
	const container: LegacyRef<HTMLDivElement>|undefined = React.createRef();

  useEffect(() => {
    //本地数据
    const arr = [];
    const cats = ['c1', 'c2', 'c3'];
    for (let i = 0; i < 100; ++i) {
      arr.push({
        a: Math.random() * 10,
        d: 'Row ' + i,
        cat: cats[Math.floor(Math.random() * 3)],
        cat2: cats[Math.floor(Math.random() * 3)],
      });
    }

    const lineUp = asLineUp(container.current as HTMLElement, arr);
  }, []);

  return <div ref={container} style={{ width: '100%', height: '100%' }}></div>;
};

export default CommunityAndNodeList;
