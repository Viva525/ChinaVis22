import React, { LegacyRef, useEffect } from 'react';
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
    const lineup = dataBuilder
      .deriveColors()
      .buildTaggle(container.current as HTMLElement);
  }, []);

  useEffect(() => {
    let array = [];
    for (let i = 0; i < data.nodes.length; i++) {
      let temp: any = {};
      switch (data.nodes[i].group) {
        case 'Domain':
          temp.id = data.nodes[i].properties.id;
          temp.name = data.nodes[i].properties.name;
          temp.community = data.nodes[i].properties.community;
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
          temp.wrongList = [
            data.nodes[i].properties.porn,
            data.nodes[i].properties.gambling,
            data.nodes[i].properties.fraud,
            data.nodes[i].properties.drug,
            data.nodes[i].properties.gun,
            data.nodes[i].properties.hacker,
            data.nodes[i].properties.trading,
            data.nodes[i].properties.pay,
            data.nodes[i].properties.other,
          ];
          break;
        case 'Cert':
          
      }
    }
  }, [data.nodes, data.links]);

  return <div ref={container} style={{ width: '100%', height: '100%' }}></div>;
};

export default CommunityAndNodeList;
