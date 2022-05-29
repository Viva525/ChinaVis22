import * as d3 from 'd3';
import React, { LegacyRef, useEffect, useState } from 'react';
import { getAllCommunitiesInfo } from '../api/networkApi';
import {getData} from '../utils/utils'

type communitiesInfoProps = {
	currentCommunities: number[]
}

const CommunitiesInfo: React.FC<communitiesInfoProps> = (props) => {
	const [didMountState, setDidMountState] = useState(false);
	const { currentCommunities } =props;
    //假数据
    let sunData = {
        "name": "Community",
        "children": [
            {
                "name": "211345",//社区id
                "children": [
                    {
                        "name": "Domain",
                        "weight": 5000,//Domain节点的数量
                        "children": [
                            {
                                "name": "Domain",
                                "popularity": 500,
                                "weight": 300 //两种节点之间的关系：Domain->Domain
                            },
                            {
                                "name": "Cert",
                                "popularity": 500,
                                "weight": 400//Domain->Cert
                            },
                            {
                                "name": "IP",
                                "popularity": 500,
                                "weight": 500
                            }
                        ]
                    },
                    {
                        "name": "IP",
                        "weight": 6000,//IP节点的数量
                        "children": [
                            {
                                "name": "Domain",
                                "popularity": 500,
                                "weight": 400
                            },
                            {
                                "name": "Cert",
                                "popularity": 500,
                                "weight": 500
                            },
                            {
                                "name": "IP",
                                "popularity": 500,
                                "weight": 200
                            }
                        ]
                    },
                    {
                        "name": "Cert",
                        "weight": 8000,//Cert节点数量
                        "children": [
                            {
                                "name": "Domain",
                                "popularity": 500,
                                "weight": 300

                            },
                            {
                                "name": "Cert",
                                "popularity": 500,
                                "weight": 350
                            },
                            {
                                "name": "IP",
                                "popularity": 500,
                                "weight": 450
                            }
                        ]
                    }

                ]

            },
						{
							"name": "211346",
							"children": [
									{
											"name": "Domain",
											"weight": 6000,//Domain节点的数量
											"children": [
													{
															"name": "Domain",
															"popularity": 500,
															"weight": 300
													},
													{
															"name": "Cert",
															"popularity": 500,
															"weight": 400
													},
													{
															"name": "IP",
															"popularity": 500,
															"weight": 500
													}
											]
									},
									{
											"name": "IP",
											"weight": 5000,//Domain节点的数量
											"children": [
													{
															"name": "Domain",
															"popularity": 500,
															"weight": 400
													},
													{
															"name": "Cert",
															"popularity": 500,
															"weight": 500
													},
													{
															"name": "IP",
															"popularity": 500,
															"weight": 200
													}
											]
									},
									{
											"name": "Cert",
											"weight": 8000,//Domain节点的数量
											"children": [
													{
															"name": "Domain",
															"popularity": 500,
															"weight": 300
			
													},
													{
															"name": "Cert",
															"popularity": 500,
															"weight": 350
													},
													{
															"name": "IP",
															"popularity": 500,
															"weight": 450
													}
											]
									}
			
							]
			
					},
					{
							"name": "211347",
							"children": [
									{
											"name": "Domain",
											"weight": 2000,//Domain节点的数量
											"children": [
													{
															"name": "Domain",
															"popularity": 500,
															"weight": 300
													},
													{
															"name": "Cert",
															"popularity": 500,
															"weight": 400
													},
													{
															"name": "IP",
															"popularity": 500,
															"weight": 500
													}
											]
									},
									{
											"name": "IP",
											"weight": 7000,//Domain节点的数量
											"children": [
													{
															"name": "Domain",
															"popularity": 500,
															"weight": 400
													},
													{
															"name": "Cert",
															"popularity": 500,
															"weight": 500
													},
													{
															"name": "IP",
															"popularity": 500,
															"weight": 200
													}
											]
									},
									{
											"name": "Cert",
											"weight": 9000,//Domain节点的数量
											"children": [
													{
															"name": "Domain",
															"popularity": 500,
															"weight": 300
			
													},
													{
															"name": "Cert",
															"popularity": 500,
															"weight": 350
													},
													{
															"name": "IP",
															"popularity": 500,
															"weight": 450
													}
											]
									}
			
							]
			
					},
					{
							"name": "211348",
							"children": [
									{
											"name": "Domain",
											"weight": 1000,//Domain节点的数量
											"children": [
													{
															"name": "Domain",
															"popularity": 500,
															"weight": 300
													},
													{
															"name": "Cert",
															"popularity": 500,
															"weight": 400
													},
													{
															"name": "IP",
															"popularity": 500,
															"weight": 500
													}
											]
									},
									{
											"name": "IP",
											"weight": 2000,//Domain节点的数量
											"children": [
													{
															"name": "Domain",
															"popularity": 500,
															"weight": 400
													},
													{
															"name": "Cert",
															"popularity": 500,
															"weight": 500
													},
													{
															"name": "IP",
															"weight": 200
													}
											]
									},
									{
											"name": "Cert",
											"weight": 3000,//Domain节点的数量
											"children": [
													{
															"name": "Domain",
															"popularity": 500,
															"weight": 300
			
													},
													{
															"name": "Cert",
															"popularity": 500,
															"weight": 350
													},
													{
															"name": "IP",
															"popularity": 500,
															"weight": 450
													}
											]
									}
			
							]
			
					}
        ]
    }


    const drawSun = () => {
        const width: number = 626
        const height: number = 477
				const innerRadiu: number = 50;
				const outerRadiu: number = 60;
				const rectHeight: number = 60;
        let l = 0
        let typeNum = [[1, 4, 3, 5, 7, 8, 6, 9, 10]]
        let t1 = [[2, 3, 3, 7, 7, 8, 6, 9, 10], [3, 3, 3, 7, 7, 8, 6, 9, 10], [4, 3, 3, 7, 7, 8, 6, 9, 10]]

        //初始化画布
        d3.select('#sunSvg')
            .append('svg')
            .attr('id', 'mainsvg')
        const svg = d3.select('#mainsvg')
            .attr('width', width).attr('height', height);

        svg.attr("viewBox", [0, 0, width, height]);
        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`)
        let color = d3.scaleOrdinal(d3.schemeCategory10);

        let maxR = 500 //关系的最大量
        d3.arc()
            .startAngle((d: any) => d.x0)
            .endAngle((d: any) => d.x1)
            .innerRadius((d: any) => d.y0)
            .outerRadius((d: any) => (d.y1 - d.y0) * (d.data.weight / maxR) + d.y0)//
        //.padAngle(30)
        d3.arc()
            .startAngle((d: any) => d.x0)
            .endAngle((d: any) => d.x1)
            .innerRadius((d: any) => d.y1)
            .outerRadius((d: any) => (d.y1 + 10))
        d3.arc()
            .startAngle((d: any) => d.x0)
            .endAngle((d: any) => d.x1)
            .innerRadius((d: any) => d.y1 + 120)
            .outerRadius((d: any) => (d.y1 + 130))
        d3.arc().startAngle((d: any) => (d.x0 + d.x1 * 6 / 9)).endAngle((d: any) => (d.x0 + d.x1 * (6 + 1) / 9)).innerRadius((d: any) => d.y1 + 240).outerRadius((d: any) => (d.y1 + 240 + 1 * 20));
        const fill = (d: any) => {
            return color(d.data.name)
        }

        //push
        for (l = 0; l < t1.length; l++) {
            //@ts-ignore
            // sunData.children.push(sunData[l])
            typeNum.push(t1[l])
        }

        //初始化root
        let root = d3.partition().size([2 * Math.PI, height / 1.6 / 1.8])//height变成圆周的一圈，width要变成sunburst最长的半径（自己调）
            (d3.hierarchy(sunData).sum((d: any) => d.popularity)
                .sort((a: any, b: any) => b.popularity - a.popularity));
        color = d3.scaleOrdinal(d3.schemeCategory10);
        let All_N = []
        let All_r = []
        let relations = root.descendants().filter(d => d.depth == 3)
            .forEach((element: any) => {
                All_r.push(element.data.weight)
            });
        let Nodes = root.descendants().filter(d => d.depth == 2)
            .forEach((element: any) => {
                All_N.push(element.data.weight)
            });

        let Max_r = Math.max.apply(null, All_r)
        let Max_N = Math.max.apply(null, All_N)

        g.selectAll('.datapath1').data(root.descendants().filter((d: any) => (d.depth == 1))).join('path') //去掉根节点
            .attr('class', 'datapath1')
            //@ts-ignore
            .attr('d', d3.arc().startAngle((d: any) => d.x0).endAngle((d: any) => d.x1).innerRadius((d: any) => d.y0).outerRadius((d: any) => d.y1))
            .attr('fill', fill)
        //debugger;
        //Domain、Cert、IP层
        g.selectAll('.datapath5').data(root.descendants().filter((d: any) => (d.depth == 2))).join('path') //去掉根节点
            .attr('class', 'datapath5')
            //@ts-ignore
            .attr('d', d3.arc().startAngle((d: any) => d.x0).endAngle((d: any) => d.x1).innerRadius((d: any) => (d.y1 - d.y0) * (d.data.weight / Max_N) + d.y0).outerRadius((d: any) => d.y1))
            .attr('fill', fill)

        //关系层
        g.selectAll('.datapath2').data(root.descendants().filter((d: any) => d.depth == 3)).join('path')
            .attr('class', 'datapath2')
            //@ts-ignore
            .attr('d', d3.arc().startAngle((d: any) => d.x0).endAngle((d: any) => d.x1).innerRadius((d: any) => d.y0).outerRadius((d: any) => (d.y1 - d.y0) * (d.data.weight / Max_r) + d.y0))
            .attr('fill', fill)
            .attr('opacity', 0.5)

        g.selectAll('.datapath3').data(root.descendants().filter(d => d.depth == 3)).join('path') //去掉根节点
            .attr('class', 'datapath3')
            //@ts-ignore
            .attr('d', d3.arc().startAngle((d: any) => d.x0).endAngle((d: any) => d.x1).innerRadius((d: any) => d.y1).outerRadius((d: any) => (d.y1 + 10)))
            .attr('fill', fill)

        g.selectAll('.datapath4').data(root.descendants().filter((d: any) => (d.depth == 2 && d.data.name == 'Domain'))).join('path') //去掉根节点
            .attr('class', 'datapath4')
            //@ts-ignore ///////////////////////90
            .attr('d', d3.arc().startAngle((d: any) => d.x0).endAngle((d: any) => d.x1).innerRadius((d: any) => d.y1 + innerRadiu).outerRadius((d: any) => (d.y1 + outerRadiu))).attr('fill', fill);


        g.selectAll('.datatext').data(root.descendants().filter((d: any) => d.depth == 2))
            .join('text')
            .attr('class', 'datatext')
            .attr('text-anchor', 'middle')
            .attr('transform', (d: any) => {//旋转的时候坐标轴也在一起旋转
                //算x坐标
                let x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
                let y = (d.y0 + d.y1) / 2;
                return `rotate(${x - 90}) translate(${y},${0}) rotate(${x < 180 ? 0 : 180})`; //-90:文本默认的0度是水平向右，d3.arc是朝上的

            })
            .text((d: any) => d.data.name)
        //dy属性
        g.selectAll('.datatext_center').data(root.descendants().filter((d: any) => d.depth == 1))
            .join('text')
            .attr('class', 'datatext_center')
            .attr('text-anchor', 'middle')
            .attr('transform', (d: any) => {//旋转的时候坐标轴也在一起旋转
                //算x坐标
                let x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
                let y = (d.y0 + d.y1) / 2;
                if (d.x1 == 2 * Math.PI) {
                    return;
                }
                return `rotate(${x - 90}) translate(${y},${0}) rotate(${x < 180 ? 0 : 180})`; //-90:文本默认的0度是水平向右，d3.arc是朝上的
            })
            .text((d: any) => d.data.name)
        //dy属性
        let data = root.descendants().filter((d: any) => (d.depth == 2 && d.data.name == 'Domain'));
        console.log(data)

        //画bar
        for (let m = 0; m < typeNum.length; m++) {
            console.log(m);
            let d = [];
            d.push(data[m]);
            let maxNum = Math.max.apply(null, typeNum[m]);
            console.log(d);
            for (let i = 0; i < 9; i++) {
                g.selectAll('.darc' + m.toString() + i.toString()).data(d).join('path') //去掉根节点
                    .attr('class', 'darc' + m.toString() + i.toString())
                    .attr('d', d3.arc().startAngle((d: any) => (d.x0 + (d.x1 - d.x0) * i / 9)).endAngle((d: any) => (d.x0 + (d.x1 - d.x0) * (i + 1) / 9)).innerRadius((d: any) => d.y1 + outerRadiu).outerRadius((d: any) => (d.y1 + outerRadiu + typeNum[m][i] * rectHeight / maxNum)))
                    .attr('fill', fill);
            };
        }
    }

		useEffect(()=>{
			if(didMountState){
				getData(getAllCommunitiesInfo, [currentCommunities]).then((dataset: any)=>{
					console.log(dataset);
				})
			}
		},[currentCommunities]);

    useEffect(() => {
				setDidMountState(true);
        drawSun();
    }, []);

    return (
        <div id='sunSvg' style={{ width: '100%', height: '100%' }}>
        </div>);
};

export default CommunitiesInfo;
