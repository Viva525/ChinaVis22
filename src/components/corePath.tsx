import React, { LegacyRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

import { getData } from '../utils/utils';
import { getLinksBT2Nodes } from '../api/nodeApi';
import { Color } from 'three';
import { SetState } from './types';

type CorePathProps = {
  selectKeyNode: Set<any>;
  setPathList: SetState<Set<any>>;
};

const CorePath: React.FC<CorePathProps> = (props) => {
  const [didMountState, setDidMountState] = useState(false);
  const [dataState, setDataState] = useState<any>([{ nodes: [], links: [] }]);
  const { selectKeyNode, setPathList } = props;
  let startNode: null = null;
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
        color: '#5d85cf',
      },
      {
        name: 'IP',
        color: '#da7847',
      },
      {
        name: 'Cert',
        color: '#6fb971',
      },
      {
        name: 'Start',
        color: '#FF0000',
      },
      {
        name: 'End',
        color: '#795548',
      },
    ];
    let startNodeColor = '#5d85cf';
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

    d3.select('#svg').remove();
    d3.select('#sunBurst')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('id', 'svg')
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
        let pathData: any = d3.select(this).data()[0];
        setPathList((prevState: Set<any>) => {
          const newSet = new Set(Array.from(prevState));
          if (!newSet.has(pathData)) {
            pathData.nodes.unshift(startNode);
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
      .select('#svg')
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
      });

    //  利用defs绘制箭头
    //  添加定义
    const defs = d3.select('#svg').append('defs');
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
    marker.append('path').attr('d', arrow_path).attr('fill', 'rgb(0,0,0,1)');
    //为每个组添加箭头和节点
    //@ts-ignore
    dataState.forEach((path, index) => {
      const pathGroup = d3.select(`#path-${index}`);
      startNode = path.nodes.shift();
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
        .attr('stroke', (d: any, i: number) => {
          if (i === path.nodes.length - 1) {
            return group[4].color;
          } else {
            return null;
          }
        })
        .attr('stroke-width', (d: any, i: number) => {
          if (i === path.nodes.length - 1) {
            return 2;
          } else {
            return null;
          }
        })
        .attr('transform', (_, i: any) => {
          return `translate(0,${(i + 1) * (arrowLength + nodeSize * 2)})`;
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
        .attr('stroke', 'black')
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

  /**
   * 监听dataset，绘制图表
   */
  useEffect(() => {
    if (didMountState) {
      drawSunburst();
    }
  }, [dataState]);
  useEffect(() => {
    if (didMountState && selectKeyNode.size === 2) {
      const nodes = Array.from(selectKeyNode);
      getData(getLinksBT2Nodes, [
        nodes[0].properties.id,
        nodes[1].properties.id,
      ]).then((dataset: any) => {
        setDataState(dataset);
      });
    }
  }, [selectKeyNode]);
  /**
   * 初始化
   */
  useEffect(() => {
    getData(getLinksBT2Nodes, [
      'Domain_638f7385e9f207463212486e14e3220f9159dd4b2587cd5299883b91d3f65450',
      'Domain_aef319dbcd7caa2483b3677fe8eced662419728d591a9615beba2b7e0df7b9dd',
    ]).then((dataset: any) => {
      setDidMountState(true);
      setDataState(dataset);
    });
  }, []);
  return <div id='sunBurst' style={{ width: '100%', height: '100%' }}></div>;
};

export default CorePath;
