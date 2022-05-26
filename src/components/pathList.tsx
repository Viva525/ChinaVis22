import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import { SetState } from './types';

type PathListProps = {
  pathList: Set<any>;
  selectKeyNode: Set<any>;
  setPathList: SetState<Set<any>>;
};

const PathList: React.FC<PathListProps> = (props) => {
  const { pathList} = props;
  const [didMountState, setDidMountState] = useState(false);
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
		}
	];
	
  const drawPathList = () =>{
		const rectList = Array.from(pathList);
		const width: number = 600;
		const rectWidth: number = width/5-10;
		const rectHeight: number = 40;
		const margin: number = 10;
		const paddingTop: number = 25;
		const paddingLeft: number = 5;
    const height: number = rectList.length*(rectHeight+margin);

		d3.select("#svg-pathList").remove();
    const svg = d3.select("#pathList")
      .append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("id", "svg-pathList");
		
		svg.selectAll("g")
			.data(rectList)
			.enter()
			.append("g")
			.attr("id",(_, i:number)=>{
				return `pathList-${i}`;
			})
			.attr("transform",(d: any, i: number)=>{
				return `translate(0,${i*(rectHeight+margin)})`;
			});
			rectList.forEach((path, index)=>{
				const pathGroup = d3.select(`#pathList-${index}`);
			// 添加节点
			pathGroup
			.selectAll("rect")
			.data(path.nodes)
			.enter()
			.append("rect")
			.attr("width", rectWidth)
			.attr("height", rectHeight)
			//@ts-ignore
			.attr("fill", (d: any)=>{
				switch (d.group) {
					case 'Domain':
						return group[0].color;
					case 'IP':
						return group[1].color;
					case 'Cert':
						return group[2].color;
				}
			})
			.attr("rx",6)
			.attr("ry",6)
			.attr("transform",(d: any, i: number)=>{
				return `translate(${i*(rectWidth+margin)},0)`;
			});
			//添加文字
			pathGroup
			.selectAll("text")
			.data(path.nodes)
			.enter()
			.append("text")
			.text((d: any)=>{
				return d.properties.name;
			})
			.attr("transform",(d: any, i: number)=>{
				return `translate(${i*(rectWidth+margin)+paddingLeft},${paddingTop})`;
			});
			//添加三角形
			pathGroup
			.selectAll("polygon")
			.data(path.links)
			.enter()
			.append("polygon")
			.attr("points", (d: any)=>{
				if(d.direction === 0){
					return "0,0,10,5,0,10";
				}else{
					return "0,5,10,0,10,10";
				}
				
			})
			.style("fill","#607D8B")
			.attr("transform",(d: any, i: number)=>{
				return `translate(${rectWidth+i*(rectWidth+margin)},${rectHeight/2-6})`;
			});
		});
  }

  useEffect(() => {
		if(didMountState){
			drawPathList();
		}
  }, [pathList.size]);

  useEffect(() => {
		setDidMountState(true);
      drawPathList();
  }, []);

  return (
    <div id='pathList' style={{ width: '100%', height: '100%', overflowY:"scroll"}}></div>
  );
};

export default PathList;
