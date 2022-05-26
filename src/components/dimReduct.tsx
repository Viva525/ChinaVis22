import React, { SetStateAction, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { ComposeOption } from 'echarts/core';
import { CurrentNetworkState, SetState } from './types';
import { getData } from '../utils/utils';
import { getAllCommuntiesScatter } from '../api/nodeApi';
import type { EChartsOption, ECharts, SetOptionOpts } from 'echarts';

type Props = {
  currentGraph: CurrentNetworkState;
  setCurrentGraph: SetState<CurrentNetworkState>;
};
let chart: ECharts | undefined;
const option: any = {
  xAxis: {
    type: 'value',
    scale: true,
    splitLine: {
      show: true,
    },
  },
  yAxis: {
    type: 'value',
    scale: true,
    splitLine: {
      show: true,
    },
  },
  dataZoom: [
    {
      id: 'dataZoomX',
      type: 'inside',
      xAxisIndex: 0,
    },
    {
      id: 'dataZoomY',
      type: 'inside',
      yAxisIndex: 0,
    },
  ],
  tooltip: {
    show: true,
    formatter: (params: any) => {
      return 'community:' + params.data[2];
    },
  },
  series: [
    {
      type: 'scatter',
      data: [],
    },
    {
      type: 'effectScatter',
      symbolSize: 20,
      data: [],
    },
  ],
};
const DimReduct: React.FC<Props> = (props: Props) => {
  const { currentGraph, setCurrentGraph } = props;
  const [didMountState, setDidMountState] = useState(false);
  const [dataState, setDataState] = useState<any[]>([]);
  const chartRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (didMountState) {
      if (chart !== undefined) {
        const effect = dataState.filter((d: number[], i: number) => {
          if (currentGraph.communities?.includes(d[2])) {
            // const [sel] = dataState.splice(i--, 1);
            // dataState.push(sel);
            return true;
          }
          return false;
        });
        option.series[1].data = effect;
        chart.setOption(option);
      }
    }
  }, [currentGraph.communities]);

  useEffect(() => {
    getData(getAllCommuntiesScatter, []).then((dataset: any) => {
      option.series[0].data = dataset.data;
      if (chartRef.current !== null) {
        chart = echarts.init(chartRef.current);
        chart.setOption(option);
        chart.on('click', (e: any) => {
          setCurrentGraph((prevState) => {
            if (prevState.communities?.includes(e.data[2])) {
              const afterDel = prevState.communities.filter((d: number) => {
                return d != e.data[2];
              });
              return {
                current: 'communities',
                communities: afterDel,
              };
            }
            return {
              current: 'communities',
              communities: [...(prevState.communities as number[]), e.data[2]],
            };
          });
        });
      }
      setDidMountState(true);
      setDataState(dataset.data);
    });
  }, []);
  return <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default DimReduct;
