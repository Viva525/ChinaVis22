import React, { LegacyRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

import { getData } from '../utils/utils';
import { getLinksBT2Nodes } from '../api/nodeApi';
import { Color } from 'three';
import { SetState } from './types';
import { Button } from 'antd';

type CorePathProps = {
  selectKeyNode: Set<any>;
  setPathList: SetState<Set<any>>;
};

const CorePath: React.FC<CorePathProps> = (props) => {
  const [didMountState, setDidMountState] = useState(false);
  const [dataState, setDataState] = useState<any>([{ nodes: [], links: [] }]);
  const { selectKeyNode, setPathList } = props;
  /**
   * 绘制Sankey图 表达关键路径
   */
  const drawSunburst = () => {
    const keyNode = Array.from(selectKeyNode);
    const width: number = 626;
    const height: number = 412;
    const nodeSize: number = 8;
    const arrowLength: number = 30;
    const group = [
      {
        name: 'Domain',
        color: '#78a58c',
      },
      {
        name: 'IP',
        color: '#a57878',
      },
      {
        name: 'Cert',
        color: '#a0a87a',
      },
      {
        name: 'Start',
        color: '#BAABDA',
      },
      {
        name: 'End',
        color: '#DCFFCC',
      },
    ];
    let startNodeColor = '#78a58c';
    if (keyNode.length === 2) {
      switch (keyNode[0].group) {
        case 'Domain':
          startNodeColor = group[0].color;
          break;
        case 'IP':
          startNodeColor = group[1].color;
          break;
        case 'Cert':
          startNodeColor = group[2].color;
          break;
      }
    }

    d3.select('#svg-corePath').remove();
    d3.select('#corePath')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('id', 'svg-corePath')
      .append('g')
      .attr('id', 'container');
    const container = d3
      .select('#container')
      .attr('transform', `translate(${width / 2 + 20}, ${height / 2})`);
    container
      .append('circle')
      .attr('r', nodeSize)
      .attr('fill', startNodeColor)
      .attr('stroke', group[3].color)
      .attr('stroke-width', 2);

    container
      .selectAll('g')
      .data(dataState)
      .enter()
      .append('g')
      .attr('id', (_, i) => {
        return `path-${i}`;
      })
      .on('click', function (e: any,d: any) {
        console.log(e);
        let pathData: any = d3.select(this).data()[0];
        setPathList((prevState: Set<any>) => {
          const newSet = new Set(Array.from(prevState));
          if (!newSet.has(pathData)) {
            newSet.add(pathData);
          }else{
            newSet.delete(pathData);
          }
          return newSet;
        });
      })
      .attr('class', 'path')
      .on('mouseenter', function (d: any) {
        d3.selectAll('.path').style('opacity', 0.3);
        d3.select(this).style('opacity', 1).style('cursor', 'pointer');
      })
      .on('mouseleave', function (d: any) {
        d3.selectAll('.path').style('opacity', 1);
      });

    // 绘制图例
    const legend = d3
      .select('#svg-corePath')
      .selectAll('.legend')
      .data(group)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d: any, i: any) => {
        if (d.name === 'Start' || d.name === 'End') {
          return `translate(0,${i * 20 + 280})`;
        } else {
          return `translate(0,${i * 20 + 30})`;
        }
      });

    legend
      .append('rect')
      .attr('x', 10)
      .attr('y', 8)
      .attr('width', 20)
      .attr('height', 10)
      .style('fill', function (d) {
        if (d.name === 'Start' || d.name === 'End') {
          return 'rgba(0,0,0,0)';
        } else {
          return d.color;
        }
      })
      .style('stroke', (d: any) => {
        if (d.name === 'Start' || d.name === 'End') {
          return d.color;
        } else {
          return null;
        }
      })
      .style('stroke-width', (d: any) => {
        if (d.name === 'Start' || d.name === 'End') {
          return 2;
        } else {
          return null;
        }
      });
    //绘制图例文字
    legend
      .append('text')
      .attr('x', 35)
      .attr('y', 18)
      .style('text-anchor', 'start') //样式对齐
      .text(function (d) {
        if (d.name === 'Start') {
          return (
            d.name +
            ' : ' +
            (keyNode.length == 0
              ? '638f7385e9.com'
              : keyNode[0].properties.name)
          );
        } else if (d.name === 'End') {
          return (
            d.name +
            ' : ' +
            (keyNode.length == 0
              ? 'aef319dbcd.com'
              : keyNode[1].properties.name)
          );
        } else {
          return d.name;
        }
      })
      .style('fill','#eee');

    //  利用defs绘制箭头
    //  添加定义
    const defs = d3.select('#svg-corePath').append('defs');
    // 绘制箭头
    const marker = defs
      .append('marker')
      .attr('id', 'arrow')
      .attr('markerUnits', 'strokeWidth')
      .attr('markerWidth', '12')
      .attr('markerHeight', '12')
      .attr('viewBox', '0 0 12 12')
      .attr('refX', '9')
      .attr('refY', '6')
      .attr('orient', 'auto');
    const arrow_path = 'M2,2 L10,6 L2,10 L6,6 L2,2';
    marker.append('path').attr('d', arrow_path).attr('fill', '#eee');
    //为每个组添加箭头和节点
    //@ts-ignore
    dataState.forEach((path, index) => {
      const pathGroup = d3.select(`#path-${index}`);
      pathGroup
        .selectAll('circle')
        .data(path.nodes)
        .enter()
        .append('circle')
        .attr('r', nodeSize)
        //@ts-ignore
        .attr('fill', (d: any) => {
          switch (d.group) {
            case 'Domain':
              return group[0].color;
            case 'IP':
              return group[1].color;
            case 'Cert':
              return group[2].color;
          }
        })
        .attr('opacity',(d: any, i: number)=>{
          if(i>=1){
            return 1;
          }else{
            return 0;
          }
        })
        .attr('stroke', (d: any, i: number) => {
          if (i === path.nodes.length - 1) {
            return group[4].color;
          } else {
            return null;
          }
        })
        .attr('stroke-width', (d: any, i: number) => {
          if (i === path.nodes.length - 1) {
            return 3;
          } else {
            return null;
          }
        })
        .attr('transform', (_, i: any) => {
          return `translate(0,${i * (arrowLength + nodeSize * 2)})`;
        });
      pathGroup
        .selectAll('line')
        .data(path.links)
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('y1', (d: any) => {
          return d.direction != 0 ? arrowLength + nodeSize : nodeSize;
        })
        .attr('x2', 0)
        .attr('y2', (d: any) => {
          return d.direction == 0 ? arrowLength + nodeSize : nodeSize;
        })
        // .attr("tansform","translate(0,15)")
        .attr('stroke', '#eee')
        .attr('stroke-width', '1px')
        .attr('marker-end', 'url(#arrow)')
        .attr('transform', (_, i: any) => {
          return `translate(0,${i * (arrowLength + nodeSize * 2)})`;
        });

      pathGroup.attr(
        'transform',
        `rotate(${index * (360 / dataState.length)})`
      );
    });
  };

  const searchPath = () => {
    if(selectKeyNode.size === 2){
      const nodes = Array.from(selectKeyNode);
      getData(getLinksBT2Nodes, [
        nodes[0].properties.id,
        nodes[1].properties.id,
      ]).then((dataset: any) => {
        setDataState(dataset);
      });
    }
  }

  /**
   * 监听dataset，绘制图表
   */
  useEffect(() => {
    if (didMountState) {
      drawSunburst();
    }
  }, [dataState]);

  // useEffect(() => {
  //   if (didMountState && selectKeyNode.size === 2) {
  //     const nodes = Array.from(selectKeyNode);
  //     getData(getLinksBT2Nodes, [
  //       nodes[0].properties.id,
  //       nodes[1].properties.id,
  //     ]).then((dataset: any) => {
  //       setDataState(dataset);
  //     });
  //   }
  // }, [selectKeyNode]);


  /**
   * 初始化
   */
  useEffect(() => {
    getData(getLinksBT2Nodes, [
      'Domain_04d5c6e4382c3b31090ba7860012444949f8287ea8fe2d192bca306c1e00d4b1',
      'Domain_91ff7d24432dcee0df1e7127e4a1a06226fe26bd09d30a51bc8b9b2656ee3f33',
    ]).then((dataset: any) => {
      setDidMountState(true);
      setDataState(dataset);
    });
  }, []);
  return (<><div id='corePath' style={{ width: '100%', height: '100%' }}></div>
  <Button
        type='primary'
        style={{ position: 'absolute', right: 20, top: 50 }}
        shape='round'
        size={'small'}
        onClick={searchPath}
      >
        Search Path
  </Button></>);
};

export default CorePath;
