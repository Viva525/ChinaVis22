import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { getData } from '../utils/utils';
import { recommand } from '../api/nodeApi';
import { CurrentNetworkState, currentNodeself, nodeType, SetState } from './types';



type NodeMatrixselfProps = {
  currentNodeself: string
  currentCommunities: CurrentNetworkState;
  setCurrentCommunities: SetState<CurrentNetworkState>;
  setIsFinish: SetState<boolean>;
}

const NodeMatrixself: React.FC<NodeMatrixselfProps> = (props) => {
  const [currentNodeState, setCurrentNodeState] = useState<currentNodeself>({community:0, node_num: 0,step:0,wrongList:[]});
  const {currentNodeself, currentCommunities, setCurrentCommunities, setIsFinish} = props;
  // "porn","gambling","fraud","drug","gun","hacker","trading","pay","other", "none"
  const color = [
    '#f49c84',
    '#099EDA',
    '#FEE301',
    '#ABB7BD',
    '#F4801F',
    '#D6C223',
    '#D75D73',
    '#E0592B',
    '#58B7B3',
    '#68bb8c',
  ];

  const [communitiesDataState, setCommunitiesDataState] = useState<any[]>([]);
  const [didMountState, setDidMountState] = useState(false);

  // "porn","gambling","fraud","drug","gun","hacker","trading","pay","other"
  const colorMapping = (name: string) => {
    switch (name) {
      case 'porn':
        return color[0];
      case 'gambling':
        return color[1];
      case 'fraud':
        return color[2];
      case 'drug':
        return color[3];
      case 'gun':
        return color[4];
      case 'hacker':
        return color[5];
      case 'trading':
        return color[6];
      case 'pay':
        return color[7];
      case 'other':
        return color[8];
      case 'none':
        return color[9];
    }
  };

  const onClick =(d:any)=>{
    setCurrentCommunities({
      current: 'communities',
      communities: [...currentCommunities.communities,d.id]
    });
    
    setCommunitiesDataState((prev)=>{
      return prev.filter((item: any)=>{
        return item.id!==d.id;
      });
    })
  }

  const drawMatrix = () => {
    const width: number = 390;
    const margin: number = 4;
    const rectHeight: number = 40;
    const rectWidth: number = 20;
    // const borderWidth: number = 3;
    const nums = 16;
    const height: number =
      (communitiesDataState.length / nums) * (rectHeight + margin) + 40;
    d3.select('#svg-nodeMatrixself').remove();

    // 元素索引映射至位置
    const indexToPosition = (
      i: number,
      { x, y } = { x: 0, y: 0 }
    ): [number, number] => [
      (i % nums) * (rectWidth + margin) + x,
      Math.floor(i / nums) * (rectHeight + margin) + y,
    ];
    const svg = d3
      .select('#nodeMatrixself')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('id', 'svg-nodeMatrixself');

    const nodes = svg
      .selectAll('g')
      .data(communitiesDataState)
      .enter()
      .append('g')
      .attr('id', (d: any) => {
        return `selfCommunity-${d.id}`;
      })
      .attr('transform', (_, i) => {
        return `translate(${indexToPosition(i).join(',')})`;
      });

    nodes
      .on('click', function (e:any, d:any) {
        onClick(d);
      })
      .on('mouseenter', function (event: any, d: any) {
        d3.select(this).attr('cursor', 'pointer');
        setCurrentNodeState({community:d.id, node_num:d.node_num, step:d.step,wrongList:d.wrong_list});
        d3.select('#toolTipSelf')
          .style('display', 'block')
          .style('left',event.clientX-20+"px")
          .style('top', event.clientY+30+"px")
      })
      .on('mouseleave',function(){
        d3.select('#toolTipSelf')
          .style('display','none')
          // .style('left','-100px')
          // .style('top','-100px')
      });

    communitiesDataState.forEach((community: any, index: number) => {
      const communityGroup = d3.select(`#selfCommunity-${community.id}`);
      // 绘制矩形
      if (community.wrong_list.length === 0) {
        communityGroup
          .append('rect')
          .attr('height', rectHeight)
          .attr('width', rectWidth)
          .attr('fill', color[9]);
      } else {
        communityGroup
          .selectAll('rect')
          .data(community.wrong_list)
          .enter()
          .append('rect')
          .attr('width', rectWidth)
          .attr('height', (d: any) => {
            return (d.num / community.wrong_sum) * rectHeight;
          })
          .attr('fill', (d: any) => {
            return colorMapping(d.type);
          })
          .attr('transform', (d: any, i: number) => {
            if (i > 0) {
              // 计算上一块的高度
              let lastRectHeight = 0;
              while (i > 0) {
                lastRectHeight += community.wrong_list[i - 1].num;
                i--;
              }
              lastRectHeight =
                (lastRectHeight / community.wrong_sum) * rectHeight;
              return `translate(0,${lastRectHeight})`;
            }
          });
      }
      // communityGroup.append('rect');
    });
  };

  useEffect(()=>{
    if(didMountState){
        getData(recommand,[currentNodeself, currentCommunities.communities]).then((dataset: any)=>{
          dataset.sort((a: any,b:any)=>{
            return (a.step-b.step);
          })
          console.log(dataset);
            setCommunitiesDataState(dataset);
        });
    }
  }, [currentNodeself]);


  //监听数据变化 绘制邻居矩阵图
  useEffect(() => {
    if (didMountState) {
      drawMatrix();
      setIsFinish(true);
    }
  }, [communitiesDataState]);

  useEffect(() => {
    getData(recommand, ["Domain_5596b89a2184f2ef5870afaccf4eecede432175ab1da8621b2718fbc03783e6a"]).then((dataset: any) => {
      setDidMountState(true);
      setCommunitiesDataState(dataset);
    });
  }, []);

  return (
    <div
      id='nodeMatrixself'
      style={{ width: '100%', height: '100%', overflowY: 'scroll' }}
    >
      <div
        id='toolTipSelf'
        style={{
          width: '180px',
          height: `${(currentNodeState.wrongList.length+3) * 30 }px`,
          background: '#fff',
          borderRadius: '4px',
          position: 'absolute',
          display: 'none',
          zIndex:999,
          boxShadow:'rgba(0,0,0,0.4) 1px 2px 5px',
        }}
      >
        <p style={{color:'#333', margin:`0 0 0 12px`}}>community : {currentNodeState.community}</p>
        <p style={{color:'#333', margin:`0 0 0 12px`}}>nodeNum : {currentNodeState.node_num}</p>
        <p style={{color:'#333', margin:`0 0 0 12px`}}>step : {currentNodeState.step}</p>
        {currentNodeState.wrongList.map((node: nodeType, i: number) => {
          return (
            <div key={i} style={{width:'100%', height:'30px',
            display: 'flex',
            flexDirection: 'row',
            paddingLeft:'10px'}}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginTop:'10px',
                  background: `${colorMapping(node.type)}`,
                }}
              ></div>
              <p style={{color:'#333', margin:`0 0 0 10px`}}>
                &nbsp;{node.type} : {node.num}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NodeMatrixself;
