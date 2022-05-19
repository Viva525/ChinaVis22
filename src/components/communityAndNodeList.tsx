import React, { LegacyRef, useEffect, useState } from 'react';
import {
  asLineUp,
  buildCategoricalColumn,
  builder,
  buildNumberColumn,
  buildStringColumn,
} from 'lineupjs';
import 'lineupjs/build/LineUpJS.css';
import { DataState } from './types';

type CommunityAndNodeListProps = {
  data: DataState;
};
let lineUp: any = null;

const CommunityAndNodeList: React.FC<CommunityAndNodeListProps> = (props) => {
  const container: LegacyRef<HTMLDivElement> | undefined = React.createRef();
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
  const { data } = props;
  const [didMountState, setDidMountState] = useState(false);

  useEffect(() => {
    //本地数据
    const data = require('../assets/lineUp.json');
    let dataBuilder = builder(data)
      .column(buildStringColumn('id'))
      .column(buildStringColumn('key'))
      .column(buildNumberColumn('node_num', [0, NaN]))
      .column(buildNumberColumn('wrong_num', [0, NaN]))
      .column(buildStringColumn('neighbour'));

    category.forEach((item) => {
      dataBuilder = dataBuilder.column(
        buildNumberColumn('wrong_list', [0, NaN]).asArray(category)
      );
    });
    lineUp = dataBuilder
      .deriveColors()
      .buildTaggle(container.current as HTMLElement);
    setDidMountState(true);
  }, []);

  useEffect(() => {
    if (didMountState) {
      let array = [];
      for (let i = 0; i < data.nodes.length; i++) {
        let temp: any = {};
        temp.id = data.nodes[i].properties.id;
        temp.name = data.nodes[i].properties.name;
        temp.community = data.nodes[i].properties.community;
        switch (data.nodes[i].group) {
          case 'Domain':
            temp.email =
              data.nodes[i].properties.email_id != undefined
                ? data.nodes[i].properties.email_id
                : undefined;
            temp.phone =
              data.nodes[i].properties.phone_id != undefined
                ? data.nodes[i].properties.phone_id
                : undefined;
            temp.register =
              data.nodes[i].properties.register_id != undefined
                ? data.nodes[i].properties.register_id
                : undefined;
            temp.wrong_list = [
              data.nodes[i].properties.porn == 'True' ? 2 : 1,
              data.nodes[i].properties.gambling == 'True' ? 2 : 1,
              data.nodes[i].properties.fraud == 'True' ? 2 : 1,
              data.nodes[i].properties.drug == 'True' ? 2 : 1,
              data.nodes[i].properties.gun == 'True' ? 2 : 1,
              data.nodes[i].properties.hacker == 'True' ? 2 : 1,
              data.nodes[i].properties.trading == 'True' ? 2 : 1,
              data.nodes[i].properties.pay == 'True' ? 2 : 1,
              data.nodes[i].properties.other == 'True' ? 2 : 1,
            ];
            break;
          case 'IP':
            temp.asn =
              data.nodes[i].properties.asn_id != undefined
                ? data.nodes[i].properties.asn_id
                : undefined;
            temp.ipc =
              data.nodes[i].properties.ipc_id != undefined
                ? data.nodes[i].properties.ipc_id
                : undefined;
            break;
        }
        array.push(temp);
      }
      console.log(array);
      let nodeDataBuilder = builder(array)
        .column(buildStringColumn('id'))
        .column(buildStringColumn('name'))
        .column(buildStringColumn('community'))
        .column(buildStringColumn('email'))
        .column(buildStringColumn('phone'))
        .column(buildStringColumn('register'))
        .column(buildStringColumn('asn'))
        .column(buildStringColumn('ipc'));

      category.forEach((item) => {
        nodeDataBuilder = nodeDataBuilder.column(
          buildNumberColumn('wrong_list', [0, 2]).asArray(category)
        );
      });
      lineUp.destroy();
      lineUp = nodeDataBuilder
        .deriveColors()
        .buildTaggle(container.current as HTMLElement);
      document.oncontextmenu = function (e) {
        //点击右键后要执行的代码
        if (e.button == 2) {
          //@ts-ignore
          console.log(e.target.innerHTML);
        }
        //.......
        return false; //阻止浏览器的默认弹窗行为
      };
    }
  }, [data.nodes, data.links]);

  return <div ref={container} style={{ width: '100%', height: '100%' }}></div>;
};

export default CommunityAndNodeList;
