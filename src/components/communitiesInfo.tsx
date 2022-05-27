import * as d3 from 'd3';
import React from 'react';

const CommunitiesInfo: React.FC<{}> = () => {
    const svg = d3.select('#mainsvg');
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    svg.attr("viewBox", [0, 0, width, height]);
    const g = svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    let root;

    //画一段圆弧

    const arc = d3.arc()
        .startAngle((d: any) => d.x0)
        .endAngle((d: any) => d.x1)
        .innerRadius((d: any) => d.y0)
        .outerRadius((d: any) => d.y1)

    let maxR = 500 //关系的最大量
    const marc = d3.arc()
        .startAngle((d: any) => d.x0)
        .endAngle((d: any) => d.x1)
        .innerRadius((d: any) => d.y0)
        .outerRadius((d: any) => (d.y1 - d.y0) * (d.data.weight / maxR) + d.y0)//
    //.padAngle(30)

    const sarc = d3.arc()
        .startAngle((d: any) => d.x0)
        .endAngle((d: any) => d.x1)
        .innerRadius((d: any) => d.y1)
        .outerRadius((d: any) => (d.y1 + 10))

    const smarc = d3.arc()
        .startAngle((d: any) => d.x0)
        .endAngle((d: any) => d.x1)
        .innerRadius((d: any) => d.y1 + 120)
        .outerRadius((d: any) => (d.y1 + 130))

    //const darc=d3.arc().startAngle(d=>(d.x0+d.x1*i/9)).endAngle(d=>(d.x0+d.x1*(i+1)/9)).innerRadius(d=>d.y1+240).outerRadius(d=>(d.y1+240+i*20));
    const darc = d3.arc().startAngle((d: any) => (d.x0 + d.x1 * 6 / 9)).endAngle((d: any) => (d.x0 + d.x1 * (6 + 1) / 9)).innerRadius((d: any) => d.y1 + 240).outerRadius((d: any) => (d.y1 + 240 + 1 * 20));
    const fill = (d: any) => {
        return color(d.data.name)
    }

    const render = function (data) {

        let relations = data.descendants().filter(d => d.depth == 3)
        let All_r = []
        relations.forEach(element => {
            All_r.push(element.data.weight)
        });
        let Max_r = Math.max.apply(null, All_r)

        g.selectAll('.datapath1').data(data.descendants().filter(d => d.depth == 2 || d.depth == 1)).join('path') //去掉根节点
            .attr('class', 'datapath1')
            .attr('d', d3.arc().startAngle((d: any) => d.x0).endAngle((d: any) => d.x1).innerRadius((d: any) => d.y0).outerRadius((d: any) => d.y1))
            .attr('fill', fill)

        g.selectAll('.datapath2').data(data.descendants().filter(d => d.depth == 3)).join('path')
            .attr('class', 'datapath2')
            .attr('d', d3.arc().startAngle((d: any) => d.x0).endAngle((d: any) => d.x1).innerRadius((d: any) => d.y0).outerRadius((d: any) => (d.y1 - d.y0) * (d.data.weight / Max_r) + d.y0))
            .attr('fill', fill)
            .attr('opacity', 0.5)

        g.selectAll('.datapath3').data(data.descendants().filter((d: any) => d.depth == 3)).join('path') //去掉根节点
            .attr('class', 'datapath3')
            .attr('d', d3.arc().startAngle((d: any) => d.x0).endAngle((d: any) => d.x1).innerRadius((d: any) => d.y1).outerRadius((d: any) => (d.y1 + 10)))
            .attr('fill', fill)

        g.selectAll('.datapath4').data(data.descendants().filter(d => (d.depth == 2 && d.data.name == 'Domain'))).join('path') //去掉根节点
            .attr('class', 'datapath4')
            .attr('d', d3.arc().startAngle((d: any) => d.x0).endAngle((d: any) => d.x1).innerRadius((d: any) => d.y1 + 90).outerRadius((d: any) => (d.y1 + 100))).attr('fill', fill);

        g.selectAll('.datatext').data(data.descendants().filter(d => d.depth == 2))
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

        g.selectAll('.datatext_center').data(data.descendants().filter(d => d.depth == 1))
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



    }


    const bar = function (data, typeNum, j) {
        let maxNum = Math.max.apply(null, typeNum)
        console.log(data)
        for (let i = 0; i < 9; i++) {
            g.selectAll('.darc' + j.toString() + i.toString()).data(data).join('path') //去掉根节点
                .attr('class', 'darc' + j.toString() + i.toString())
                .attr('d', d3.arc().startAngle((d: any) => (d.x0 + (d.x1 - d.x0) * i / 9)).endAngle((d: any) => (d.x0 + (d.x1 - d.x0) * (i + 1) / 9)).innerRadius((d: any) => d.y1 + 100).outerRadius((d: any) => (d.y1 + 100 + typeNum[i] * 160 / maxNum)))
                .attr('fill', fill);
        }
    }


    let data = {
        "name": "Community",
        "children": [
            {
                "name": "211345",
                "children": [
                    {
                        "name": "Domain",
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

        ]
    }
    let d1 = [{
        "name": "211346",
        "children": [
            {
                "name": "Domain",
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

    }]

    let l = 0
    let typeNum = [[1, 4, 3, 5, 7, 8, 6, 9, 10]]
    let t1 = [[2, 3, 3, 7, 7, 8, 6, 9, 10], [3, 3, 3, 7, 7, 8, 6, 9, 10], [4, 3, 3, 7, 7, 8, 6, 9, 10]]
    function insert() {
        for (l = 0; l < t1.length; l++) {
            data.children.push(d1[l])
            typeNum.push(t1[l])
        }

        root = d3.partition().size([2 * Math.PI, height / 1.6 / 1.8])//height变成圆周的一圈，width要变成sunburst最长的半径（自己调）
            (d3.hierarchy(data).sum((d: any) => d.popularity)
                .sort((a: any, b: any) => b.popularity - a.popularity));
        //console.log(root)
        render(root);
        data = root.descendants().filter(d => (d.depth == 2 && d.data.name == 'Domain'));
        console.log(data)


        for (let m = 0; m < typeNum.length; m++) {
            console.log(m);
            let d = []
            d.push(data[m])
            bar(d, typeNum[m], m);
        }
    }
    return (
        <div style={{ width: '100%', height: '100%' }}>
            show Communities Info
        </div>);
};

export default CommunitiesInfo