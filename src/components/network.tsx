import React, { useEffect, useState } from 'react';
import {
  getFilterNetworkByCommunities,
  getNetWorkByCommunity,
  getNetWorkByParams,
} from '../api/networkApi';
import ForceGraph, { GraphData } from 'force-graph';
import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph';
import type { DataState, NetworkProps } from './types';
import { thresholdFreedmanDiaconis } from 'd3';
import * as THREE from 'three';

//React FC 写法 推荐写这种
const Network: React.FC<NetworkProps> = (props) => {
  const container: React.RefObject<HTMLDivElement> = React.createRef();
  //@ts-ignore
  const graph: ForceGraph3DInstance = ForceGraph3D();
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

  function updateHighlight() {
    // trigger update of highlighted objects in scene
    graph
      .nodeColor(graph.nodeColor())
      .linkWidth(graph.linkWidth())
      .linkDirectionalParticles(graph.linkDirectionalParticles());
  }

  const drawGraph = () => {
    //@ts-ignore
    graph(container.current)
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

      .linkDirectionalParticles(1)
      .linkDirectionalParticleWidth(4)
      .nodeThreeObject((node: any) => {
        let shape = null;
        let geometry: any = null;
        let material = new THREE.MeshLambertMaterial({
          color: node.color || Math.round(Math.random() * Math.pow(2, 24)),
          transparent: true,
          opacity: 0.75,
        });
        switch (node.group) {
          case 'Domain':
            geometry = new THREE.TetrahedronGeometry((node.weight + 1) * 5);
            break;
          case 'Cert':
            geometry = new THREE.SphereGeometry(8);
            break;
          case 'IP':
            geometry = new THREE.OctahedronGeometry(8);
            break;
          default:
        }
        shape = new THREE.Mesh(geometry, material);
        return shape;
      })

      .showNavInfo(false)
      .onNodeClick((node: any) => {
        console.log(node);
      })
      .onNodeDragEnd((node: any) => {
        node.fx = node.x;
        node.fy = node.y;
        node.fz = node.z;
      });
    //@ts-ignore
    graph(container.current)
      .d3Force('link')
      .distance((link: any) => link.weight * 20);
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
    // Draw Graph Function
    if (didMountState) {
      drawGraph();
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
      graph(container.current).backgroundColor('#101020');
      console.log(tagFilter);
    }
  }, [tagFilter]);

  useEffect(() => {
    const { current, communities } = currentGragh;
    if (current === 'searchStr') {
      // do nothing wait data change
    } else if (current === 'communities') {
      getData(getNetWorkByCommunity, communities).then((dataset: any) => {
        if (container.current != null) {
          setDidMountState(true);
          setDataState(dataset);
        }
      });
    } else {
      // all communities connected graph
    }
  }, []);

  return <div ref={container} style={{ width: '100%', height: '100%' }}></div>;
};

export default Network;
