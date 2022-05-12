import React, { Component, useEffect, useState } from 'react';
import {
  getFilterNetworkByParams,
  getNetWorkByCommunity,
  getNetWorkByParams,
} from '../api/networkApi';
import ForceGraph, { GraphData } from 'force-graph';
import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph';
import type { DataState, NetworkProps } from './types';

//React FC 写法 推荐写这种
const Network: React.FC<NetworkProps> = (props) => {
  const container:React.RefObject<HTMLDivElement> = React.createRef();
  const graph: ForceGraph3DInstance = ForceGraph3D();

  const { searchParams, filterNode, tagFilter } = props;
  const [dataState, setDataState]=useState<DataState>({
    nodes:[],
    links:[]
  });
  
  const getData = (func: Function, params: any) => {
    let data = func(...params);
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  };

  useEffect(() => {
    getData(getNetWorkByParams, [searchParams]).then((data: any)=>{
      if(data.nodes){
        setDataState(data);
      }else{
        console.log(data);
      }
    });
  }, [searchParams]);

  useEffect(()=>{
    console.log(dataState);
    //@ts-ignore
    graph.graphData(dataState);
  }, [dataState]);

  useEffect(() => {
    let data = getData(getFilterNetworkByParams, [searchParams, filterNode]);
    //调用绘图重载数据
    //。。。
  }, [filterNode]);

  const linkColor = ['rgba(0,0,0,0.2)', 'rgba(255,255,255,0.5)'];
  useEffect(() => {
    getData(getNetWorkByCommunity, [1910103]).then((dataset) => {
      if (container.current != null) {
        graph(container.current)
          //@ts-ignore
          .graphData(dataset)
          // .backgroundColor('#101020')
          .backgroundColor('rgba(255,255,255,0.5)')
          .width(1300)
          .height(800)
          .nodeRelSize(6)
          //@ts-ignore
          .nodeLabel((node) => node.properties.name)
          // .zoom(1)
          //@ts-ignore
          // .nodeColor((node)=>node.color)
          .nodeAutoColorBy('weight')
          .linkColor(() => linkColor[0])
          .onNodeClick((node: any) => {
            console.log(node);
          });
      }
    });
  }, []);

  return (
    <div
      ref={container}
      style={{ width: '100%', height: '100%' }}></div>
  );
};

export default Network;
