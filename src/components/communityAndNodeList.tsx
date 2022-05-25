import React, { LegacyRef, useEffect, useState } from 'react';
import { builder, buildNumberColumn, buildStringColumn } from 'lineupjs';
import 'lineupjs/build/LineUpJS.css';
import { CurrentNetworkState, DataState, SetState } from './types';

type CommunityAndNodeListProps = {
  data: DataState;
  currentGragh: CurrentNetworkState;
  setCurrentGraph: SetState<CurrentNetworkState>;
  setSelectNode: SetState<string[]>;
};
let lineUp: any = null;

const CommunityAndNodeList: React.FC<CommunityAndNodeListProps> = (props) => {
  const container: LegacyRef<HTMLDivElement> = React.createRef();
  const category = [
    'porn',
    'gambling',
    'fraud',
    'drug',
    'gun',
    'hacker',
    'trading',
    'pay',
    'other',
  ];
  const { data, currentGragh, setCurrentGraph, setSelectNode } = props;
  const [didMountState, setDidMountState] = useState(false);

  document.oncontextmenu = function (e: any) {
    //点击右键后要执行的代码
    if (e.button === 2) {
      if (e.target !== null) {
        navigator.clipboard.writeText(e.target.textContent);
      }
    }
    //.......
    return false; //阻止浏览器的默认弹窗行为
  };

  const initList = () => {
    //本地数据
    const data = require('../assets/lineUp.json');
    let dataBuilder = builder(data)
      .column(buildStringColumn('id').width(80))
      .column(buildNumberColumn('node_num', [0, NaN]).width(100))
      .column(buildNumberColumn('wrong_num', [0, NaN]).width(100));
    category.forEach((item) => {
      dataBuilder = dataBuilder.column(
        buildNumberColumn('wrong_list', [-1, 100]).asArray(category)
      );
    });
    dataBuilder
      .column(buildStringColumn('key').width(100))

      .column(buildStringColumn('neighbour').width(100));

    lineUp = dataBuilder
      .deriveColors()
      .buildTaggle(container.current as HTMLElement);

    lineUp.on('selectionChanged', (id: any) => {
      setCurrentGraph({
        current: 'communities',
        communities: [lineUp._data._data[id].id],
      });
    });
  };

  const drawList = () => {
    let array = [];
    for (let i = 0; i < data.nodes.length; i++) {
      let temp: any = {};
      temp.id = data.nodes[i].properties.id;
      temp.name = data.nodes[i].properties.name;
      temp.community = data.nodes[i].properties.community;
      switch (data.nodes[i].group) {
        case 'Domain':
          temp.email =
            data.nodes[i].properties.email_id !== undefined
              ? data.nodes[i].properties.email_id
              : undefined;
          temp.phone =
            data.nodes[i].properties.phone_id !== undefined
              ? data.nodes[i].properties.phone_id
              : undefined;
          temp.register =
            data.nodes[i].properties.register_id !== undefined
              ? data.nodes[i].properties.register_id
              : undefined;
          temp.wrong_list = [
            data.nodes[i].properties.porn === 'True' ? 1 : 0,
            data.nodes[i].properties.gambling === 'True' ? 1 : 0,
            data.nodes[i].properties.fraud === 'True' ? 1 : 0,
            data.nodes[i].properties.drug === 'True' ? 1 : 0,
            data.nodes[i].properties.gun === 'True' ? 1 : 0,
            data.nodes[i].properties.hacker === 'True' ? 1 : 0,
            data.nodes[i].properties.trading === 'True' ? 1 : 0,
            data.nodes[i].properties.pay === 'True' ? 1 : 0,
            data.nodes[i].properties.other === 'True' ? 1 : 0,
          ];
          break;
        case 'IP':
          temp.asn =
            data.nodes[i].properties.asn_id !== undefined
              ? data.nodes[i].properties.asn_id
              : undefined;
          temp.ipc =
            data.nodes[i].properties.ipc_id !== undefined
              ? data.nodes[i].properties.ipc_id
              : undefined;
          break;
      }
      array.push(temp);
    }
    let nodeDataBuilder = builder(array);
    category.forEach((item) => {
      nodeDataBuilder = nodeDataBuilder.column(
        buildNumberColumn('wrong_list', [-1, 4]).asArray(category)
      );
    });
    nodeDataBuilder
      .column(buildStringColumn('id').width(100))
      .column(buildStringColumn('name').width(100))
      .column(buildStringColumn('community').width(80))
      .column(buildStringColumn('email').width(100))
      .column(buildStringColumn('phone').width(100))
      .column(buildStringColumn('register').width(100))
      .column(buildStringColumn('asn').width(100))
      .column(buildStringColumn('ipc').width(100));
    lineUp = nodeDataBuilder
      .deriveColors()
      .buildTaggle(container.current as HTMLElement);
    lineUp.on('selectionChanged', (idArray: number[]) => {
      console.log(lineUp);
      let arr = [];
      for (let i = 0; i < idArray.length; i++) {
        arr.push(lineUp._data._data[idArray[i]].id);
      }
      setSelectNode(arr);
    });
  };

  useEffect(() => {
    initList();
    setDidMountState(true);
  }, []);

  useEffect(() => {
    if (didMountState) {
      lineUp.destroy();
      if (currentGragh.current === 'allCommunity') {
        initList();
      } else if (currentGragh.current === 'communities') {
        drawList();
      } else {
        drawList();
      }
    }
  }, [data.nodes, data.links]);

  return <div ref={container} style={{ width: '100%', height: '100%' }}></div>;
};

export default CommunityAndNodeList;
