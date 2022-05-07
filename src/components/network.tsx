import React, { useEffect, useState } from "react";
import { getNetWorkByCommunity } from "../api/networkApi";
import ForceGraph from "force-graph";
import ForceGraph3D from '3d-force-graph'

type NetworkState = {
  container: any
}

//React FC 写法 推荐写这种
const Network: React.FC<{}>= () => {

  const [NetworkState, setNetworkState] = useState<NetworkState>({
    container: React.createRef()
  });

  const getData = () => {
    let data = getNetWorkByCommunity(2007622);
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  }

  useEffect(() => {
    getData().then((dataset)=> {
      console.log(dataset);
      const {container} = NetworkState;
      const myGraph = ForceGraph3D();
      if(container.current != null){
        //@ts-ignore
        myGraph(container.current ).graphData(dataset)
        .backgroundColor('#101020')
        .nodeRelSize(6)
        .nodeAutoColorBy('group')
        .linkColor(() => 'rgba(255,255,255,0.2)')
        .onNodeClick(node=>{
          console.log(node);
        });
        
      }
    });
  }, []);

  return (<div style={{ width: "100%", height: "100%" }}>
    <div ref={NetworkState.container} style={{ width: "100vw", height: "100vh" }}></div>
  </div>)
};

export default Network;
