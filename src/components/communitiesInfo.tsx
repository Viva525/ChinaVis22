import * as d3 from 'd3';
import { stringify } from 'querystring';
import React, { LegacyRef, useEffect, useState } from 'react';
import { getAllCommunitiesInfo } from '../api/networkApi';
import { getData } from '../utils/utils';

type communitiesInfoProps = {
	currentCommunities: number[];
};

const CommunitiesInfo: React.FC<communitiesInfoProps> = (props) => {
	const [didMountState, setDidMountState] = useState(false);
	const { currentCommunities } = props;
	const [dataInit, setDataInit] = useState<any>([
		{ name: 'Community', children: [] },
	]);
	//假数据
	let circleData = {
		name: 'Community',
		children: [
			{
				name: '123456',
				children: [
					{
						name: 'domain',
						value: 4,
						children: [
							{
								name: 'gun',
								value: 4,
							},
							{
								name: 'porn',
								value: 5,
							},
							{
								name: 'illegal',
								value: 9,
							},
							{
								name: 'bet',
								value: 10,
							},
						],
					},
					{
						name: 'cert',
						value: 4,
					},
					{
						name: 'ip',
						value: 6,
					},
				],
			},
			{
				name: '2536',
				children: [
					{
						name: 'domain',
						value: 4,
					},
					{
						name: 'cert',
						value: 9,
					},
					{
						name: 'ip',
						value: 6,
					},
				],
			},
			{
				name: '25847',
				children: [
					{
						name: 'domain',
						value: 9,
					},
					{
						name: 'cert',
						value: 1,
					},
					{
						name: 'ip',
						value: 2,
					},
				],
			},
			{
				name: '85476',
				children: [
					{
						name: 'domain',
						value: 25,
					},
					{
						name: 'cert',
						value: 4,
					},
					{
						name: 'ip',
						value: 6,
					},
				],
			},
		],
	};

	//监听currentCommunities，绘制图表

	const drawCircle = () => {
		//数据初始化
		const width = 476;
		const height = 476;
		let color = d3
			.scaleOrdinal()
			.domain(['0', '5'])
			.range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)']);
		//.interpolate(d3.interpolateHcl)
		//debugger
		let root = d3.pack().size([width, height]).padding(3)(
			d3
				.hierarchy(circleData)
				.sum((d: any) => d.value)
				.sort((a: any, b: any) => b.value - a.value)
		);
		let focus = root;
		let view;
		//console.log(root)

		//初始化画布
		d3.select('#mainsvg').remove();
		d3.select('#circleSvg')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.style('margin', '0 auto')
			.attr('id', 'mainsvg');
		const svg = d3
			.select('#mainsvg')
			// .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
			.attr('viewBox', [0, 0, width, height])
			.style('display', 'block')
			// .style("margin", "0 -14px")
			//.style("background", color(0))
			.style('cursor', 'pointer')
			.on('click', (event) => zoom(event, root));

		const node = svg
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`)
			.selectAll('circle')
			.data(root.descendants().slice(1))
			.join('circle')
			.attr('fill', (d: any) =>
				d.children ? (color(d.depth.toString()) as string) : 'white'
			)
			.attr('pointer-events', (d) => (!d.children ? 'none' : null))
			.on('mouseover', function () {
				d3.select(this).attr('stroke', '#000');
			})
			.on('mouseout', function () {
				d3.select(this).attr('stroke', null);
			})
			.on('click', (event: any, d: any) => {
				event.stopPropagation();
				if (focus !== d) {
					zoom(event, d);
				}
			});
		//.on("click", (event, d) => { focus !== d && zoom(event, d) });

		const label = svg
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`)
			.style('font', '10px sans-serif')
			.attr('pointer-events', 'none')
			.attr('text-anchor', 'middle')
			.selectAll('text')
			.data(root.descendants())
			.join('text')
			.style('fill-opacity', (d) => (d.parent === root ? 1 : 0))
			.style('display', (d) => (d.parent === root ? 'inline' : 'none'))
			.text((d: any) => d.data.name);

		zoomTo([root.x, root.y, root.r * 2]);

		function zoomTo(v) {
			const k = width / v[2];
			view = v;
			label.attr(
				'transform',
				(d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
			);
			node.attr(
				'transform',
				(d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
			);
			//label.attr("transform", d => `translate(${width / 2}, ${height / 2})`);
			//node.attr("transform", d => `translate(${width / 2}, ${height / 2})`);
			node.attr('r', (d) => d.r * k);
		}

		function zoom(event, d) {
			const focus0 = focus;
			focus = d;
			//console.log(focus)
			const transition = svg
				.transition()
				//.duration(event.altKey ? 7500 : 750)
				.tween('zoom', (d) => {
					//console.log(focus)
					const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
					return (t) => zoomTo(i(t));
				});

			label
				.filter(function (d: any) {
					//@ts-ignore
					return d.parent === focus || this.style.display === 'inline';
				})
				.transition(transition)
				.style('fill-opacity', (d) => (d.parent === focus ? 1 : 0))
				.on('start', function (d) {

					//@ts-ignore
					if (d.parent === focus) this.style.display = 'inline';
				})
				.on('end', function (d) {
					//@ts-ignore
					if (d.parent !== focus) this.style.display = 'none';
				});
		}
		svg.node();
	};

	useEffect(() => {
		if (didMountState) {
			// if(currentCommunities.length!= 0){
			// 	getData(getAllCommunitiesInfo, [currentCommunities]).then((dataset: any) => {
			// 		console.log(dataset);
			// 		//数据初始化
			// 		var communityFinal = {
			// 			'name': "Community",
			// 			'children': []
			// 		};
			// 		var typeCrim = [];
			// 		//数据填充
			// 		for (let i: number = 0; i < currentCommunities.length; i++) {
			// 			//旭日图数据生成
			// 			var communityState = {
			// 				'name': String(currentCommunities[i]),
			// 				'children': [
			// 					{
			// 						'name': "Domain",
			// 						'weight': dataset.count_res.count_res[i][0],
			// 						'children': dataset.result[i].children[0].children
			// 					},
			// 					{
			// 						'name': "Cert",
			// 						'weight': dataset.count_res.count_res[i][1],
			// 						'children': dataset.result[i].children[1].children
			// 					},
			// 					{
			// 						'name': "Ip",
			// 						'weight': dataset.count_res.count_res[i][2],
			// 						'children': dataset.result[i].children[2].children
			// 					}
			// 				]
			// 			}
			// 			communityFinal.children.push(communityState)
			// 			//柱状图数据生成
			// 			var temp = []
			// 			let l = 0;
			// 			for (let key in dataset.count_res.industry_res[i]) {
			// 				//console.log((dataset.count_res.industry_res[0] as any)[key]);
			// 				temp[l] = (dataset.count_res.industry_res[i] as any)[key];
			// 				l++;
			// 			}
			// 			typeCrim[i] = temp
			// 		}
			// 		//更新初始数据
			// 		sunData = communityFinal;
			// 		typeNum = typeCrim;
			// 		console.log(typeNum);
			// 		drawSun();
			// 	})
			// }
		}
	}, [currentCommunities]);

	//初始化
	useEffect(() => {
		setDidMountState(true);
		drawCircle();
	}, []);

	return <div id='circleSvg' style={{ width: '100%', height: '100%' }}></div>;
};

export default CommunitiesInfo;
