import React, { Component, useEffect, useState } from 'react';
import {
  getFilterNetworkByParams,
  getNetWorkByCommunity,
} from '../api/networkApi';
import ForceGraph, { GraphData } from 'force-graph';
import ForceGraph3D from '3d-force-graph';
import type { NetworkProps } from './types';

type NetworkState = {
  container: any;
};

//React FC 写法 推荐写这种
const Network: React.FC<NetworkProps> = (props) => {
  const { searchParams, filterNode, tagFilter } = props;
  const [NetworkState, setNetworkState] = useState<NetworkState>({
    container: React.createRef(),
  });

  const getData = (func: Function, ...params: any) => {
    let data = func(params);
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  };

  useEffect(() => {
    let data = getData(getFilterNetworkByParams, searchParams, filterNode);
    //调用绘图重载数据
    //。。。
  }, [filterNode]);

  const linkColor = ['rgba(0,0,0,0.2)', 'rgba(255,255,255,0.5)'];
  useEffect(() => {
    getData(getNetWorkByCommunity, 1910103).then((dataset) => {
      console.log(dataset);
      const { container } = NetworkState;
      const myGraph = ForceGraph3D();
      if (container.current != null) {
        //@ts-ignore
        myGraph(container.current)
          //@ts-ignore
          .graphData(dataset)
          // .backgroundColor('#101020')
          .backgroundColor('rgba(255,255,255,0.5)')
          .width(1300)
          .height(800)
          .nodeRelSize(6)
          // .zoom(1)
          //@ts-ignore
          // .nodeColor((node)=>node.color)
          .nodeAutoColorBy('weight')
          .linkColor(() => linkColor[0])
          .onNodeClick((node) => {
            console.log(node);
          });
      }
    });
  }, []);

  useEffect(() => {});

  return (
    <div
      ref={NetworkState.container}
      style={{ width: '100%', height: '100%' }}></div>
  );
};

export default Network;
