import React, { useEffect, useState } from 'react';
import {
  getAllCommunities,
  getFilterNetworkByCommunities,
  getNetWorkByCommunity,
  getNetWorkByParams,
} from '../api/networkApi';
import ForceGraph, { GraphData } from 'force-graph';
import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph';
import type { DataState, NetworkProps } from './types';
import { thresholdFreedmanDiaconis } from 'd3';
import * as THREE from 'three';
/**
 * 主图组件
 */
let graph: ForceGraph3DInstance | null = null;

//React FC 写法 推荐写这种
const Network: React.FC<NetworkProps> = (props) => {
  const container = React.useRef();
  const linkColor = ['rgba(0,0,0,0.2)', 'rgba(255,255,255,0.5)'];
  const [didMountState, setDidMountState] = useState(false);
  const { currentGragh, searchParams, filterNode, tagFilter } = props;
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

  const initGraph = () => {
    graph?.jsonUrl(
      'https://raw.githubusercontent.com/religiones/ChinaVis22/master/public/allCommunity.json'
    );
    // ?.graphData({ nodes: [], links: [] })
    // .backgroundColor('rgba(255,255,255,0.5)')
    // .width(1300)
    // .height(800)
    // .nodeRelSize(6)
    // .onNodeClick((node: any) => {
    //   console.log(node);
    // })
    // .nodeLabel((node: any) => {
    //   const { IP, Cert, Domain } = tagFilter;
    //   switch (node.group) {
    //     case 'IP':
    //       return node.properties[IP];
    //     case 'Cert':
    //       return node.properties[Cert];
    //     case 'Domain':
    //       return node.properties[Domain];
    //   }
    // })
    // .nodeAutoColorBy('weight')
    // .linkColor(() => linkColor[0])
    // .linkDirectionalParticles(1)
    // .linkDirectionalParticleWidth(4)
    // .nodeThreeObject((node: any) => {
    //   let shape = null;
    //   let geometry: any = null;
    //   let material = new THREE.MeshLambertMaterial({
    //     color: node.color || Math.round(Math.random() * Math.pow(2, 24)),
    //     transparent: true,
    //     opacity: 0.75,
    //   });
    //   switch (node.group) {
    //     case 'Domain':
    //       geometry = new THREE.TetrahedronGeometry((node.weight + 1) * 5);
    //       break;
    //     case 'Cert':
    //       geometry = new THREE.SphereGeometry(8);
    //       break;
    //     case 'IP':
    //       geometry = new THREE.OctahedronGeometry(8);
    //       break;
    //     default:
    //   }
    //   shape = new THREE.Mesh(geometry, material);
    //   return shape;
    // })
    // .showNavInfo(false);
    // .onNodeDragEnd((node: any) => {
    //   node.fx = node.x;
    //   node.fy = node.y;
    //   node.fz = node.z;
    // });
    //@ts-ignore
    // graph.d3Force('link').distance((link: any) => link.weight * 20);
  };

  // const drawGraph = () => {
  //   if (didMountState) {
  //     //@ts-ignore
  //     graph.graphData(dataState)
  //       .backgroundColor('rgba(255,255,255,0.5)')
  //       .width(1300)
  //       .height(800)
  //       .nodeRelSize(6)
  //       .nodeLabel((node: any) => {
  //         const { IP, Cert, Domain } = tagFilter;
  //         switch (node.group) {
  //           case 'IP':
  //             return node.properties[IP];
  //           case 'Cert':
  //             return node.properties[Cert];
  //           case 'Domain':
  //             return node.properties[Domain];
  //         }
  //       })
  //       .nodeAutoColorBy('weight')
  //       .linkColor(() => linkColor[0])
  //       .linkDirectionalParticles(1)
  //       .linkDirectionalParticleWidth(4)
  //       .nodeThreeObject((node: any) => {
  //         let shape = null;
  //         let geometry: any = null;
  //         let material = new THREE.MeshLambertMaterial({
  //           color: node.color || Math.round(Math.random() * Math.pow(2, 24)),
  //           transparent: true,
  //           opacity: 0.75,
  //         });
  //         switch (node.group) {
  //           case 'Domain':
  //             geometry = new THREE.TetrahedronGeometry((node.weight + 1) * 5);
  //             break;
  //           case 'Cert':
  //             geometry = new THREE.SphereGeometry(8);
  //             break;
  //           case 'IP':
  //             geometry = new THREE.OctahedronGeometry(8);
  //             break;
  //           default:
  //         }
  //         shape = new THREE.Mesh(geometry, material);
  //         return shape;
  //       })
  //       .showNavInfo(false)
  //       .onNodeClick((node: any) => {
  //         console.log(node);
  //       })
  //       .onNodeDragEnd((node: any) => {
  //         node.fx = node.x;
  //         node.fy = node.y;
  //         node.fz = node.z;
  //       });
  //       //@ts-ignore
  //       graph.d3Force('link').distance((link: any) => link.weight * 20);
  //   }
  // };

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
      graph?.graphData(dataState);
    }
  }, [dataState.nodes, dataState.links]);

  useEffect(() => {
    if (didMountState) {
      getData(getFilterNetworkByCommunities, [currentGragh.communities]).then(
        (data: any) => {
          const dist = {
            r_cname: ['Domain', 'Domain'],
            r_subdomain: ['Domain', 'Domain'],
            r_request_jump: ['Domain', 'Domain'],
            r_cert: ['Cert', 'Domain'],
            r_cert_chain: ['Cert', 'Cert'],
            r_dns_a: ['IP', 'Domain'],
          };
          data.nodes = data.nodes.filter((item: any) => {
            return filterNode.includes(item.group);
          });
          data.links = data.links.filter((item: any) => {
            return (
              //@ts-ignore
              filterNode.includes(dist[item.type][0]) &&
              //@ts-ignore
              filterNode.includes(dist[item.type][1])
            );
          });
          setDataState(data);
        }
      );
    }
  }, [filterNode]);

  useEffect(() => {
    if (didMountState) {
      //@ts-ignore
      graph.nodeLabel((node: any) => {
        const { IP, Cert, Domain } = tagFilter;
        switch (node.group) {
          case 'IP':
            return node.properties[IP];
          case 'Cert':
            return node.properties[Cert];
          case 'Domain':
            return node.properties[Domain];
        }
      });
    }
  }, [tagFilter.IP, tagFilter.Cert, tagFilter.Domain]);

  useEffect(() => {
    //@ts-ignore
    graph = ForceGraph3D()(container.current);
    initGraph();
    // const { current, communities } = currentGragh;
    // if (current === 'searchStr') {
    //   // do nothing wait data change
    // } else if (current === 'communities') {
    //   getData(getNetWorkByCommunity, communities).then((dataset: any) => {
    //     setDidMountState(true);
    //     setDataState(dataset);
    //   });
    // } else {
    //   // all communities connected graph
    //   getData(getAllCommunities, []).then((dataset: any) => {
    //     setDidMountState(true);
    //     // setDataState(dataset);
    //   });
    // }
  }, []);

  return (
    <div
      //@ts-ignore
      ref={container}
      id='network'
      style={{ width: '100%', height: '100%' }}></div>
  );
};

export default Network;
