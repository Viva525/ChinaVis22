import React, { Component, useEffect, useRef, useState } from 'react';
import {
  // getFilterNetworkByParams,
  getNetWorkByCommunity,
  getNetWorkByParams,
} from '../api/networkApi';
import ForceGraph, { GraphData } from 'force-graph';
import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph';
import type { DataState, NetworkProps } from './types';
import { resolve } from 'node:path/win32';

//React FC 写法 推荐写这种
const Network: React.FC<NetworkProps> = (props) => {
  const container: React.RefObject<HTMLDivElement> = React.createRef();
  const graph: ForceGraph3DInstance = ForceGraph3D();
  const linkColor = ['rgba(0,0,0,0.2)', 'rgba(255,255,255,0.5)'];

  const [didMountState, setDidMountState] = useState(false);

  const { searchParams, filterNode, tagFilter } = props;
  const [dataState, setDataState] = useState<DataState>({
    nodes: [],
    links: [],
  });

  const getData = (func: Function, params: any) => {
    let data = func(...params);
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  };

  useEffect(() => {
    if (didMountState) {
      getData(getNetWorkByParams, [searchParams]).then((data: any) => {
        if (data.nodes) {
          setDataState(data);
        } else {
          console.log(data);
        }
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (didMountState) {
      console.log(dataState);
      //@ts-ignore
      graph(container.current)
        //@ts-ignore
        .graphData(dataState)
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
  }, [dataState.nodes, dataState.links]);

  useEffect(() => {
    if (didMountState) {
      // let data = getData(getFilterNetworkByParams, [searchParams, filterNode]);
      let data: { nodes: any; links: any } = { nodes: [], links: [] };
      const dist = {
        r_cname: ['Domain', 'Domain'],
        r_subdomain: ['Domain', 'Domain'],
        r_request_jump: ['Domain', 'Domain'],
        r_cert: ['Cert', 'Domain'],
        r_cert_chain: ['Cert', 'Cert'],
        r_dns_a: ['IP', 'Domain'],
      };
      data.nodes = dataState.nodes.filter((item: any) => {
        return filterNode.includes(item.group);
      });
      data.links = dataState.links.filter((item: any) => {
        return (
          //@ts-ignore
          filterNode.includes(dist[item.type][0]) &&
          //@ts-ignore
          filterNode.includes(dist[item.type][1])
        );
      });
      setDataState(data);
    }
  }, [filterNode]);

  useEffect(() => {
    getData(getNetWorkByCommunity, [1910103]).then((dataset: any) => {
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

        setDataState(dataset);
        setDidMountState(true);
      }
      return dataset;
    });
  }, []);

  return <div ref={container} style={{ width: '100%', height: '100%' }}></div>;
};

export default Network;
