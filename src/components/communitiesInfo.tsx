import * as d3 from 'd3';
import { stringify } from 'querystring';
import React, { LegacyRef, useEffect, useState } from 'react';
import { getAllCommunitiesInfo } from '../api/networkApi';
import { getData } from '../utils/utils';
import { CurrentNetworkState } from './types';

type communitiesInfoProps = {
	currentGraph: CurrentNetworkState
};

const CommunitiesInfo: React.FC<communitiesInfoProps> = (props) => {
	const [didMountState, setDidMountState] = useState(false);
	const { currentGraph } = props;
	const [dataInit, setDataInit] = useState<any>([
		{ name: 'Community', children: [] },
	]);
	// 假数据
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
								children: [
									{
										name: 'bet',
										value: 10,
									},
									{
										name: 'xxx',
										value: 5,
									}
								]
							}

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

	//监听currentGraph，绘制图表
	const drawCircle = () => {
		//数据初始化
		const width = 476;
		const height = 476;
		let multicolor = true;
		let bold = true;
		let black = false;
		let shadow = true;
		let hexcolor = "#0099cc";
		let root = d3.pack().size([width, height]).padding(3)(
			d3
				.hierarchy(circleData)
				.sum((d: any) => d.value)
				.sort((a: any, b: any) => b.value - a.value)
		);
		let focus = root;
		let view;
		//console.log(root)

		let fontsize = d3.scaleOrdinal()
			.domain(['1', '3'])
			.range([24, 16])


		//新增颜色函数
		function setColorScheme(multi) {
			if (multi) {
				let color = d3.scaleOrdinal()
					.range(d3.schemeCategory10)
				return color;
			}
		}

		let color = setColorScheme(multicolor);

		function setCircleColor(obj) {
			let depth = obj.depth;
			while (obj.depth > 1) {
				obj = obj.parent;
			}
			//@ts-ignore
			let newcolor = multicolor ? d3.hsl(color(obj.data.name)) : d3.hsl(hexcolor);
			newcolor.l += depth == 1 ? 0 : depth * .1;
			return newcolor;
		}

		function setStrokeColor(obj) {
			//let depth = obj.depth;
			while (obj.depth > 1) {
				obj = obj.parent;
			}
			//@ts-ignore
			let strokecolor = multicolor ? d3.hsl(color(obj.data.name)) : d3.hsl(hexcolor);
			return strokecolor;
		}
		//新增颜色函数

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
			.attr('viewBox', [0, 0, width, height])
			.style('display', 'block')
			.style('cursor', 'pointer')
			.on('click', (event) => zoom(event, root));

		const node = svg
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`)
			.selectAll('circle')
			.data(root.descendants().slice(1))
			.join('circle')
			//@ts-ignore
			.attr("fill", setCircleColor)
			//@ts-ignore
			.attr("stroke", setStrokeColor)
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

		// const label = svg
		// 	.append('g')
		// 	.attr('transform', `translate(${width / 2},${height / 2})`)
		// 	.style('font', '10px sans-serif')
		// 	.attr('pointer-events', 'none')
		// 	.attr('text-anchor', 'middle')
		// 	.selectAll('text')
		// 	.data(root.descendants())
		// 	.join('text')
		// 	.style('fill-opacity', (d) => (d.parent === root ? 1 : 0))
		// 	.style('display', (d) => (d.parent === root ? 'inline' : 'none'))
		// 	.text((d: any) => d.data.name);

		const label = svg.append("g")
			.attr('transform', `translate(${width / 2},${height / 2})`)
			.style("fill", function () {
				return black ? "black" : "white";
			})
			.style("text-shadow", function () {
				if (shadow) {
					return black ? "2px 2px 0px white" : "2px 2px 0px black";
				} else {
					return "none";
				}
			})
			.attr("pointer-events", "none")
			.attr("text-anchor", "middle")
			.selectAll("text")
			.data(root.descendants())
			.enter().append("text")
			.style("fill-opacity", d => d.parent === root ? 1 : 0)
			.style("display", d => d.parent === root ? "inline" : "none")
			.style("font", (d: any) => fontsize(d.depth) + "px sans-serif")
			.style("font-weight", function () {
				return bold ? "bold" : "normal";
			})
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
		if (didMountState && currentGraph.current==='communities') {
			const currentCommunities = currentGraph.communities;
			if (currentCommunities.length !== 0) {
				getData(getAllCommunitiesInfo, [currentCommunities]).then((dataset: any) => {
					console.log(dataset);
					//数据初始化
					var communityFinal = {
						'name': "Community",
						'children': []
					};
					var typeCrim = Object.getOwnPropertyNames((dataset.count_res.industry_res[0] as any));
					function isEmpty(value, vect) {
						if (value.weight !== 0) {
							var numObj = {
								'name': value.name,
								'value': value.weight,
							}
							vect.children.push(numObj)
						}
					}
					//数据填充
					for (let i: number = 0; i < currentCommunities.length; i++) {
						//主数据生成
						var communityState = {
							'name': String(currentCommunities[i]),
							'children': []
						}
						//数据判断 对应domain,ip,cert数量层生成
						if (dataset.count_res.count_res[i][0] !== 0) {
							var domainNum = {
								'name': "Domain",
								'value': dataset.count_res.count_res[i][0],
								'children': [
									{
										'name': "Crime Type",
										children: []
									},
								]
							}
							isEmpty(dataset.result[i].children[0].children[0], domainNum)
							isEmpty(dataset.result[i].children[0].children[1], domainNum)
							isEmpty(dataset.result[i].children[0].children[2], domainNum)
							communityState.children.push(domainNum)
						}
						if (dataset.count_res.count_res[i][1]) {
							var certNum = {
								'name': "Cert",
								'value': dataset.count_res.count_res[i][1],
								// 'children': [
								// 	isEmpty(dataset.result[i].children[1].children[0]),
								// 	isEmpty(dataset.result[i].children[1].children[1]),
								// 	isEmpty(dataset.result[i].children[1].children[2]),
								// ]
							}
							communityState.children.push(certNum)
						}
						if (dataset.count_res.count_res[i][2]) {
							var ipNum = {
								'name': "Ip",
								'value': dataset.count_res.count_res[i][2],
								// 'children': [
								// 	isEmpty(dataset.result[i].children[2].children[0]),
								// 	isEmpty(dataset.result[i].children[2].children[1]),
								// 	isEmpty(dataset.result[i].children[2].children[2]),
								// ]
							}
							communityState.children.push(ipNum)

						}

						//犯罪数据生成	
						var num = 0;
						for (let key in dataset.count_res.industry_res[i]) {
							let v = (dataset.count_res.industry_res[i] as any)[key];
							if (v !== 0) {
								var temp = {
									'name': typeCrim[num],
									'value': v
								}
								communityState.children[0].children[0].children.push(temp)
							}
							num++;
						}

						communityFinal.children.push(communityState)
					}
					//更新初始数据
					console.log(communityFinal)
					circleData = communityFinal;
					//typeNum = typeCrim;
					//console.log(typeNum);
					drawCircle();
				})
			}
		}
	}, [currentGraph.communities]);

	//初始化
	useEffect(() => {
		setDidMountState(true);
		drawCircle();
	}, []);

	return <div id='circleSvg' style={{ width: '100%', height: '100%' }}></div>;
};

export default CommunitiesInfo;
