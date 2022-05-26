import React, { useEffect, useState} from 'react';
import {
  getAllCommunities,
  getFilterNetworkByCommunities,
  getNetWorkByParams,
} from '../api/networkApi';
import ForceGraph, { ForceGraphInstance, GraphData} from 'force-graph';
import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph';
import type { NetworkProps } from './types';
import * as THREE from 'three';
import { Descriptions, Switch } from 'antd';
import { getData } from '../utils/utils';

/**
 * 主图组件
 */
let graph: any = null;
let context: HTMLElement | null = null;
//React FC 写法 推荐写这种
const Network: React.FC<NetworkProps> = (props) => {
  const container = React.useRef();
  const linkColor = ['rgba(0,0,0,0.2)', 'rgba(255,255,255,0.1)'];
  const [didMountState, setDidMountState] = useState(false);
  const [currentListState, setCurrentListState] = useState<Boolean>(false);
  const [switch3DState, setSwith3DState] = useState<boolean>(false);
  const {
    currentGragh,
    setCurrentGraph,
    searchParams,
    filterNode,
    tagFilter,
    data,
    setData,
    selectNode,
    range,
    setSelectKeyNode,
    selectKeyNode
  } = props;

  const setSelectKeyState = (node:any) => {

    setSelectKeyNode((prevState:Set<any>)=>{
      const newSet = new Set(Array.from(prevState))
      if(newSet.has(node)){
        newSet.delete(node)
      }else if(newSet.size<2){
        newSet.add(node);
      }
      return newSet;
    });
  };
  /**
   * 绘制社区3D网络图
   */
  const drawGraph = () => {
    graph
      ?.graphData({ nodes: [], links: [] })
      .backgroundColor('#CFD8DC')
      
      .onNodeClick((node: any) => {
        setSelectKeyState(node)
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
      .linkVisibility(true)
      .linkColor(() => linkColor[0])
      .linkDirectionalParticles(1)
      .linkDirectionalParticleWidth(2)

      .onNodeDragEnd((node: any) => {
        node.fx = node.x;
        node.fy = node.y;
        node.fz = node.z;
      });
    if (!switch3DState) {
      graph
        .nodeThreeObject((node: any) => {
          let shape = null;
          let geometry: any = null;
          let color;
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
        .showNavInfo(false);
    } else {
      graph.nodeColor((node: any) => {
        switch (node.group) {
          case 'Domain':
            return '#dcd6c5';
          case 'Cert':
            return '#e87e5c';
          case 'IP':
            return '#335a71';
        }
      });
    }
    //@ts-ignore
    graph.d3Force('link').distance((link: any) => 50);
  };
  /**
   * 初始化绘制社区连接图
   */
  const initGraph = () => {
    graph
      ?.graphData({ nodes: [], links: [] })
      .backgroundColor('#CFD8DC')

      .nodeLabel((node: any) => {
        return node.id;
      })
      .linkColor(() => linkColor[0])
      .linkDirectionalParticles(0)
      .onNodeDragEnd((node: any) => {
        node.fx = node.x;
        node.fy = node.y;
        node.fz = node.z;
      })
      .onNodeClick((node: any) => {
        setCurrentGraph({
          current: 'communities',
          communities: [node.id],
        });
      });
    if (!switch3DState) {
      graph
        .nodeOpacity(0.95)
        .nodeThreeObject((node: any) => {
          let shape = null;
          let geometry: any = new THREE.SphereGeometry(node.wrong_num / 20);
          let color = '#335a71';

          let material = new THREE.MeshToonMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
          });
          shape = new THREE.Mesh(geometry, material);
          return shape;
        })
        .showNavInfo(false);
    } else {
      graph
        .nodeColor(() => {
          return '#335a71';
        })
        .nodeVal((node: any) => {
          return node.wrong_num / 10;
        });
    }
    //@ts-ignore
    graph.d3Force('link').distance((link: any) => 100);
  };
  /**
   * 切换视图显示
   */
  const switchViewChange = (item: boolean) => {
    if (!item) {
      setCurrentGraph((prevState) => ({
        ...prevState,
        current: 'allCommunity',
      }));
    }
    setCurrentListState(item);
  };
  /**
   * 切换3D/2D模式
   */
  const switch3DViewChange = (item: boolean) => {
    setSwith3DState(item);
  };
  /**
   * 监听searchParams,搜索框变化，查询对应数据
   * 调用setData,setCurrentGraph
   */
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
  /**
   * 监听data,数据变化,更改绘图数据并更新图
   * 无调用
   */
  useEffect(() => {
    if (didMountState) {
      if (currentGragh.current === 'allCommunity') {
        let links = data.links.filter((link: any) => {
          return (
            link?.sourceNode[0].wrong_num >= range.currMin &&
            link?.sourceNode[0].wrong_num <= range.currMax &&
            link?.targetNode[0].wrong_num >= range.currMin &&
            link?.targetNode[0].wrong_num <= range.currMax
          );
        });
        let nodes = data.nodes.filter((node: any) => {
          return (
            node.wrong_num >= range.currMin && node.wrong_num <= range.currMax
          );
        });
        graph
          .graphData({ nodes: nodes, links: links })
          .cooldownTicks(80)
          .onEngineStop(() => graph.zoomToFit(500));
      } else {
        graph
          ?.graphData(data)
          .cooldownTicks(80)
          .onEngineStop(() => graph.zoomToFit(500));
      }
    }
  }, [data.nodes, data.links]);
  /**
   * 监听filterNode,按类别过滤节点
   * 无调用
   */
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
  /**
   * 监听tagFilter,更改鼠标指向节点标签
   * 无调用
   */
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
  /**
   * 监听currentGragh,绘制不同场景的图，以及list更新
   * 调用setData,setCurrentListState
   */
  useEffect(() => {
    if (didMountState) {
      if (currentGragh.current === 'searchStr') {
        // do nothing wait data change
        drawGraph();
      } else if (currentGragh.current === 'communities') {
        getData(getFilterNetworkByCommunities, [currentGragh.communities]).then(
          (dataset: any) => {
            console.log(dataset);
            debugger;
            setData(dataset);
            drawGraph();
          }
        );
        setCurrentListState(true);
      } else {
        // all communities connected graph

        getData(getAllCommunities, []).then((dataset: any) => {
          setData(dataset);
          initGraph();
        });
        setCurrentListState(false);
      }
    }
  }, [currentGragh.current, currentGragh.communities]);
  /**
   * 监听selectNode,选取节点高亮显示
   * 无调用
   */
  useEffect(() => {
    if (didMountState) {
      if (!switch3DState) {
        graph.nodeThreeObject((node: any) => {
          let shape = null;
          let geometry: any = null;
          let color;
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
          if (selectNode.includes(node.properties.id)) {
            color = '#ff0000';
          }
          let material = new THREE.MeshToonMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
          });
          shape = new THREE.Mesh(geometry, material);
          return shape;
        });
      } else {
        graph.nodeColor((node: any) => {
          if (selectNode.includes(node.properties.id)) {
            return '#ff0000';
          } else {
            switch (node.group) {
              case 'Domain':
                return '#dcd6c5';
              case 'Cert':
                return '#e87e5c';
              case 'IP':
                return '#335a71';
            }
          }
        });
      }
    }
  }, [selectNode]);
  /**
   * 监听range，过滤初始视图的节点
   * 无调用
   */
  useEffect(() => {
    if (didMountState) {
      let links, nodes;
      if (range.select === 'Wrong_num') {
        links = data.links.filter((link: any) => {
          return (
            link.sourceNode[0].wrong_num >= range.currMin &&
            link.sourceNode[0].wrong_num <= range.currMax &&
            link.targetNode[0].wrong_num >= range.currMin &&
            link.targetNode[0].wrong_num <= range.currMax
          );
        });
        nodes = data.nodes.filter((node: any) => {
          return (
            node.wrong_num >= range.currMin && node.wrong_num <= range.currMax
          );
        });
      } else if (range.select === 'Node_num') {
        links = data.links.filter((link: any) => {
          return (
            link.sourceNode[0].node_num >= range.currMin &&
            link.sourceNode[0].node_num <= range.currMax &&
            link.targetNode[0].node_num >= range.currMin &&
            link.targetNode[0].node_num <= range.currMax
          );
        });
        nodes = data.nodes.filter((node: any) => {
          return (
            node.node_num >= range.currMin && node.node_num <= range.currMax
          );
        });
      } else {
        links = data.links.filter((link: any) => {
          return (
            link.sourceNode[0].neighbour.length >= range.currMin &&
            link.sourceNode[0].neighbour.length <= range.currMax &&
            link.targetNode[0].neighbour.length >= range.currMin &&
            link.targetNode[0].neighbour.length <= range.currMax
          );
        });
        nodes = data.nodes.filter((node: any) => {
          return (
            node.neighbour.length >= range.currMin &&
            node.neighbour.length <= range.currMax
          );
        });
      }
      graph.graphData({ nodes: nodes, links: links });
    }
  }, [range]);
  /**
   * 监听3DState，切换3D/2D模式
   * 无调用
   */
  useEffect(() => {
    if (context == null) return;
    const dataset = graph.graphData();
    if (switch3DState) {
      // 2D模式
      graph = ForceGraph()(context);
    } else {
      // 3D模式
      graph = ForceGraph3D()(context);
    }
    if (currentGragh.current == 'allCommunity') {
      initGraph();
    } else {
      drawGraph();
    }
    const { clientWidth, clientHeight }: any = container.current;
    graph.width(clientWidth).height(clientHeight);
    graph.graphData(dataset);
  }, [switch3DState]);
  /**
   * 监听selectKeyNode
   */
  useEffect(()=>{
    if(didMountState){
      graph.nodeThreeObject((node: any) => {
        let shape = null;
        let geometry: any = null;
        let color;
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
        if (new Set(selectKeyNode).has(node)) {
          color = '#ff0000';
        }
        let material = new THREE.MeshToonMaterial({
          color: color,
          transparent: true,
          opacity: 0.8,
        });
        shape = new THREE.Mesh(geometry, material);
        return shape;
      });
    }
  },[selectKeyNode])
  /**
   * 初始化，绑定元素
   */
  useEffect(() => {
    //@ts-ignore
    if (container.current != undefined) {
      context = container.current;
      graph = ForceGraph3D()(context);
    }
    initGraph();
    getData(getAllCommunities, []).then((dataset: any) => {
      setData(dataset);
    });
    setDidMountState(true);
    const { clientWidth, clientHeight }: any = container.current;
    graph.width(clientWidth).height(clientHeight);
  }, []);

  return (
    <>
      <div
        //@ts-ignore
        ref={container}
        id='network'
        style={{ width: '100%', height: '100%' }}></div>
      <Switch
        style={{
          position: 'absolute',
          right: 18,
          top: 50,
          zIndex: 999,
        }}
        disabled={currentGragh.current === 'allCommunity'}
        checked={currentListState as boolean}
        onChange={switchViewChange}
        checkedChildren='社区'
        unCheckedChildren='总览'
      />
      <Switch
        style={{
          position: 'absolute',
          right: 90,
          top: 50,
          zIndex: 999,
        }}
        checked={switch3DState as boolean}
        onChange={switch3DViewChange}
        checkedChildren='2D'
        unCheckedChildren='3D'
      />
      {/* <Descriptions title="nodeInfo" style={{ 
          position: 'absolute',
          right: 18,
          top: 50,
          zIndex: 999}}>
        <Descriptions.Item label="nodeName">1</Descriptions.Item>
        <Descriptions.Item label="nodeName">1</Descriptions.Item>
        <Descriptions.Item label="nodeName">1</Descriptions.Item>
        <Descriptions.Item label="nodeName">1</Descriptions.Item>
        <Descriptions.Item label="nodeName">1</Descriptions.Item>
        <Descriptions.Item label="nodeName">1</Descriptions.Item>
      </Descriptions> */}
    </>
  );
};

export default Network;
