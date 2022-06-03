import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { getData } from '../utils/utils';
import { getCurrNeighbours } from '../api/networkApi';
import { type } from 'os';
import { CurrentNetworkState, currentNode, nodeType, SetState } from './types';



type NodeMatrixProps = {
  currentCommunitiesID: CurrentNetworkState;
  setCurrentCommunitiesID: SetState<CurrentNetworkState>;
}

const NodeMatrix: React.FC<NodeMatrixProps> = (props) => {
  const [currentNodeState, setCurrentNodeState] = useState<currentNode>({community:0,wrongList:[]});
  const {currentCommunitiesID, setCurrentCommunitiesID} = props;
  // "porn","gambling","fraud","drug","gun","hacker","trading","pay","other", "none"
  const color = [
    '#f49c84',
    '#f9c05d',
    '#41a7d6',
    '#673AB7',
    '#ec6352',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
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

  const drawMatrix = () => {
    const width: number = 390;
    const margin: number = 4;
    const rectHeight: number = 40;
    const rectWidth: number = 20;
    // const borderWidth: number = 3;
    const nums = 16;
    const height: number =
      (communitiesDataState.length / nums) * (rectHeight + margin) + 20;
    d3.select('#svg-nodeMatrix').remove();

    // 元素索引映射至位置
    const indexToPosition = (
      i: number,
      { x, y } = { x: 0, y: 0 }
    ): [number, number] => [
      (i % nums) * (rectWidth + margin) + x,
      Math.floor(i / nums) * (rectHeight + margin) + y,
    ];
    const svg = d3
      .select('#nodeMatrix')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('id', 'svg-nodeMatrix');

    const nodes = svg
      .selectAll('g')
      .data(communitiesDataState)
      .enter()
      .append('g')
      .attr('id', (d: any) => {
        return `community-${d.id}`;
      })
      .attr('transform', (_, i) => {
        return `translate(${indexToPosition(i).join(',')})`;
      });

    nodes
      .on('click', function (e:any, d:any) {
        console.log(d);
        let newSet = new Set(currentCommunitiesID.communities);
        if(newSet.has(d.id)){
          newSet.delete(d.id);
        }else{
          newSet.add(d.id);
        }
        setCurrentCommunitiesID({
          current: 'communities',
          communities: Array.from(newSet)
        });
        // svg
        //   .append('rect')
        //   .attr('id', 'border-rect')
        //   .attr('fill', 'rgba(0,0,0,0)')
        //   .attr('opacity', 0)
        //   .attr('stroke', 'red')
        //   .attr('stroke-width', borderWidth)
        //   .attr('width', rectWidth)
        //   .attr('height', rectHeight)
        //   .on('mouseover', function () {
        //     d3.select(this).attr('cursor', 'pointer');
        //   })
        //   .attr('transform', `translate(${indexToPosition(index).join(',')})`)
        //   .attr('opacity', 1)
        //   .on('click', function () {
        //     d3.select(this).remove();
        //   });
      })
      .on('mouseenter', function (event: any, d: any) {
        d3.select(this).attr('cursor', 'pointer');
        setCurrentNodeState({community:d.id,wrongList:d.wrong_list});
        d3.select('#toolTip')
          .style('display', 'block')
          .style('left',event.clientX-20+"px")
          .style('top', event.clientY+30+"px")
      })
      .on('mouseleave',function(){
        console.log('leave');
        d3.select('#toolTip')
          .style('display','none')
          // .style('left','-100px')
          // .style('top','-100px')
      });

    communitiesDataState.forEach((community: any, index: number) => {
      const communityGroup = d3.select(`#community-${community.id}`);
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
      communityGroup.append('rect');
    });
  };

  useEffect(()=>{
    if(didMountState){
      if(currentCommunitiesID.communities!= undefined){
        getData(getCurrNeighbours,[currentCommunitiesID.communities]).then((dataset: any)=>{
          setCommunitiesDataState(dataset);
        });
      }
    }
  }, [currentCommunitiesID]);


  //监听数据变化 绘制邻居矩阵图
  useEffect(() => {
    if (didMountState) {
      drawMatrix();
    }
  }, [communitiesDataState]);

  useEffect(() => {
    getData(getCurrNeighbours, [[1834615]]).then((dataset: any) => {
      setDidMountState(true);
      setCommunitiesDataState(dataset);
    });
  }, []);

  return (
    <div
      id='nodeMatrix'
      style={{ width: '100%', height: '100%', overflowY: 'scroll' }}
    >
      <div
        id='toolTip'
        style={{
          width: '180px',
          height: `${(currentNodeState.wrongList.length+1) * 30 }px`,
          background: '#fff',
          borderRadius: '4px',
          position: 'absolute',
          display: 'none',
          zIndex:999,
          boxShadow:'rgba(0,0,0,0.4) 1px 2px 5px',
        }}
      >
        <p style={{color:'#333', margin:`0 0 0 12px`}}>community : {currentNodeState.community}</p>
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

export default NodeMatrix;
