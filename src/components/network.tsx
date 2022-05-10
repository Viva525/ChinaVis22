import React, { Component, useEffect, useState } from "react";
import { getNetWorkByCommunity } from "../api/networkApi";
import ForceGraph, { GraphData } from "force-graph";
import ForceGraph3D from '3d-force-graph'

type NetworkState = {
  container: any
}

//React FC 写法 推荐写这种
const Network: React.FC<{}> = () => {

  const [NetworkState, setNetworkState] = useState<NetworkState>({
    container: React.createRef()
  });

  const getData = () => {
    let data = getNetWorkByCommunity(1937735);
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  }

  const linkColor = ['rgba(0,0,0,0.2)','rgba(255,255,255,0.5)'];
  useEffect(() => {
    console.log(1);
    getData().then((dataset)=> {
      console.log(dataset);
      const {container} = NetworkState;
      const myGraph = ForceGraph3D();
      if(container.current != null){
        //@ts-ignore
        myGraph(container.current ).graphData(dataset)
        // .backgroundColor('#101020')
        .backgroundColor('rgba(255,255,255,0.5)')
        .width(1300)
        .height(800)
        .nodeRelSize(6)
        // .zoom(1)
        //@ts-ignore
        // .nodeColor((node)=>node.color)
        .nodeAutoColorBy("weight")
        .linkColor(() => linkColor[0])
        .onNodeClick(node=>{
          console.log(node);
        });

      }
    });
  }, []);

  return (<div ref={NetworkState.container} style={{ width: "100%", height: "100%" }}></div>)
};

export default Network;
