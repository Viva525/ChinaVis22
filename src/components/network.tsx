import React, { useEffect, useState } from 'react';
import {
  getAllCommunities,
  getFilterNetworkByCommunities,
  getNetWorkByCommunity,
  getNetWorkByParams,
} from '../api/networkApi';
import ForceGraph, { ForceGraphInstance, GraphData } from 'force-graph';
import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph';
import type { DataState, NetworkProps } from './types';
import * as THREE from 'three';

/**
 * 主图组件
 */
let graph: any = null;

//React FC 写法 推荐写这种
const Network: React.FC<NetworkProps> = (props) => {
  const container = React.useRef();
  const linkColor = ['rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)'];
  const [didMountState, setDidMountState] = useState(false);
  const {
    currentGragh,
    setCurrentGraph,
    searchParams,
    filterNode,
    tagFilter,
    data,
    setData,
  } = props;

  const getData = (func: Function, params: any) => {
    let data = func(...params);
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  };

  const drawGraph = () => {
    graph
      ?.graphData({ nodes: [], links: [] })
      .backgroundColor('#CFD8DC')
      .width(1240)
      .height(790)
      .onNodeClick((node: any) => {
        console.log(node);
      })
      .nodeLabel((node: any) => {
        const { IP, Cert, Domain } = tagFilter;
        switch (node.group) {
          case 'IP':
            return node.properties[IP];
          case 'Cert':
            return node.properties[Cert];
          case 'Domain':
            return node.properties[Domain];
        }
      })
      .linkColor(() => linkColor[0])
      .linkDirectionalParticles(1)
      .linkDirectionalParticleWidth(2)
      .nodeThreeObject((node: any) => {
        let shape = null;
        let geometry: any = null;
        let color;

        // if (node.properties.email_id !== undefined) {
        //   color = '#ff0000';
        // } else if (node.properties.phone_id !== undefined) {
        //   color = '#00ff00';
        // } else if (node.properties.register_id !== undefined) {
        //   color = '#0000ff';
        // }

        switch (node.group) {
          case 'Domain':
            color = '#dcd6c5';
            geometry = new THREE.SphereGeometry((node.weight + 1) * 3);
            break;
          case 'Cert':
            color = '#e87e5c';
            geometry = new THREE.SphereGeometry(10);
            break;
          case 'IP':
            color = '#335a71';
            geometry = new THREE.SphereGeometry(10);
            break;
          default:
        }

        let material = new THREE.MeshToonMaterial({
          color: color,
          transparent: true,
          opacity: 0.8,
        });
        shape = new THREE.Mesh(geometry, material);
        return shape;
      })

      .showNavInfo(false)
      .onNodeDragEnd((node: any) => {
        node.fx = node.x;
        node.fy = node.y;
        node.fz = node.z;
      });
    //@ts-ignore
    graph.d3Force('link').distance((link: any) => 50);
  };
  const initGraph = () => {
    graph
      ?.jsonUrl(
        'https://raw.githubusercontent.com/religiones/ChinaVis22/master/src/assets/allCommunity.json'
      )
      .backgroundColor('#CFD8DC')
      .width(1240)
      .height(790)
      .nodeLabel((node: any) => {
        return node.id;
      })
      .linkColor(() => linkColor[0])
      .nodeThreeObject((node: any) => {
        let shape = null;
        let geometry: any = null;
        let material = new THREE.MeshToonMaterial({
          color: '#173728',
          // transparent: true,
          // opacity: 0.75,
        });
        let r = 0;
        if (node.neighbour.length > 10) {
          r = node.neighbour.length / 15;
        } else {
          r = 1;
        }
        geometry = new THREE.SphereGeometry(node.wrong_num / 20);
        shape = new THREE.Mesh(geometry, material);
        return shape;
      })
      .showNavInfo(false);

    //@ts-ignore
    graph.d3Force('link').distance((link: any) => 50);
  };

  useEffect(() => {
    if (didMountState) {
      getData(getNetWorkByParams, [searchParams]).then((dataset: any) => {
        console.log(dataset);
        if (dataset.data.nodes) {
          if (dataset.type === 'communities') {
            const arr: any = searchParams.split(',').map((item) => {
              return Number.parseInt(item);
            });
            setCurrentGraph({
              current: 'searchStr',
              communities: arr,
            });
          } else {
            setCurrentGraph({
              current: 'searchStr',
            });
          }
          setData(dataset.data);
        } else {
          console.log(dataset);
        }
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (didMountState) {
      graph?.graphData(data);
    }
  }, [data.nodes, data.links]);

  useEffect(() => {
    if (didMountState) {
      const dist = {
        r_cname: ['Domain', 'Domain'],
        r_subdomain: ['Domain', 'Domain'],
        r_request_jump: ['Domain', 'Domain'],
        r_cert: ['Cert', 'Domain'],
        r_cert_chain: ['Cert', 'Cert'],
        r_dns_a: ['IP', 'Domain'],
      };
      const dataset: any = { nodes: [], links: [] };
      dataset.nodes = data.nodes.filter((item: any) => {
        return filterNode.includes(item.group);
      });
      dataset.links = data.links.filter((item: any) => {
        return (
          //@ts-ignore
          filterNode.includes(dist[item.type][0]) &&
          //@ts-ignore
          filterNode.includes(dist[item.type][1])
        );
      });
      graph?.graphData(dataset);
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
    if (didMountState) {
      if (currentGragh.current === 'searchStr') {
        // do nothing wait data change
        drawGraph();
      } else if (currentGragh.current === 'communities') {
        drawGraph();
        getData(getFilterNetworkByCommunities, [currentGragh.communities]).then(
          (dataset: any) => {
            setData(dataset);
          }
        );
      } else {
        // all communities connected graph
        initGraph();
      }
    }
  }, [currentGragh.current, currentGragh.communities]);

  useEffect(() => {
    //@ts-ignore
    graph = ForceGraph3D()(container.current);
    // all communities connected graph
    initGraph();
    setDidMountState(true);
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
