import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { getData } from '../utils/utils';
import { getCurrNeighbours } from '../api/networkApi';

const NodeMatrix: React.FC<{}> = () => {
  // "porn","gambling","fraud","drug","gun","hacker","trading","pay","other, none"
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
  const legend = [
    'porn',
    'gambling',
    'fraud',
    'drug',
    'gun',
    'hacker',
    'trading',
    'pay',
    'other',
    'none',
  ];
  const [communitiesDataState, setCommunitiesDataState] = useState<any[]>([]);
  const [didMountState, setDidMountState] = useState(false);

  const drawMatrix = () => {
    const width: number = 390;
    const margin: number = 4;
    const rectHeight: number = 40;
    const rectWidth: number = 20;
    const borderWidth: number = 3;
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

    // const border = svg
    //   .append('rect')
    //   .attr('id', 'border-rect')
    //   .attr('fill', 'rgba(0,0,0,0)')
    //   .attr('opacity', 0)
    //   .attr('stroke', 'red')
    //   .attr('stroke-width', borderWidth)
    //   .attr('width', rectWidth)
    //   .attr('height', rectHeight)
    //   .on('click',function(){
    //       d3.select(this).attr('opacity',0)
    //       .attr('transform','translate(-100,-100)');
    //   })
    //   .on('mouseover', function () {
    //     d3.select(this).attr('cursor', 'pointer');
    //   });

    nodes
      .on('click', function (d, i) {
        const index = communitiesDataState.indexOf(i);
        svg
          .append('rect')
          .attr('id', 'border-rect')
          .attr('fill', 'rgba(0,0,0,0)')
          .attr('opacity', 0)
          .attr('stroke', 'red')
          .attr('stroke-width', borderWidth)
          .attr('width', rectWidth)
          .attr('height', rectHeight)
          .on('mouseover', function () {
            d3.select(this).attr('cursor', 'pointer');
          })
          .attr('transform', `translate(${indexToPosition(index).join(',')})`)
          .attr('opacity', 1)
          .on('click', function () {
            d3.select(this).remove();
          });
      })
      .on('mouseover', function () {
        d3.select(this).attr('cursor', 'pointer');
        
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
            // "porn","gambling","fraud","drug","gun","hacker","trading","pay","other"
            switch (d.type) {
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
    ></div>
  );
};

export default NodeMatrix;
