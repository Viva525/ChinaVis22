import React, { useEffect } from 'react';
import * as d3 from 'd3';

const NodeMatrix: React.FC<{}> = () => {
    // "porn","gambling","fraud","drug","gun","hacker","trading","pay","other"
    const color = ['#F44336','#E91E63','#9C27B0',
                '#673AB7','#3F51B5','#2196F3',
                '#03A9F4','#00BCD4','#009688']

    const data = [
        {
            id:123,
            all: 5,
            wrongTypes: [
                {
                    type: 'pron',
                    num: 2
                },{
                    type: 'gambling',
                    num: 3
                }
            ]
        },
        {
            id:124,
            all: 8,
            wrongTypes: [
                {
                    type: 'pron',
                    num: 4
                },{
                    type: 'gambling',
                    num: 4
                }
            ]
        },
        {
            id:125,
            all: 9,
            wrongTypes: [
                {
                    type: 'pron',
                    num: 5
                },{
                    type: 'gambling',
                    num: 4
                }
            ]
        }
    ]

    const drawMatrix = () => {
        const width: number= 410;
        const height: number = 300;
        const rectHeight: number = 12;
        const rectWidth: number = 6;
        const nums = 10;
        const margin: number = 2;

        d3.select('#svg-nodeMatrix').remove();
        const svg = d3.select('#nodeMatrix')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('id', 'svg-nodeMatrix');
        const g = svg.selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('id',(d: any)=>{
                return d.id;
            })
            .attr('transform',(_,i)=>{
                return `translate(${i*(rectWidth+margin)},${Math.floor(i/nums)+margin})`
            });

        data.forEach((community: any, index: number)=>{
            const communityGroup = d3.select(`#${community.id}`);
            //  绘制矩形
            communityGroup.selectAll('rect')
                .data(community.wrongTypes)
                .enter()
                .append('rect')
                .attr('width', rectWidth)
                .attr('height', ((d:any)=>{
                    return (d.num/community.all)*rectHeight;
                })
                // .attr('fill',(d: any)=>{
                //     // "porn","gambling","fraud","drug","gun","hacker","trading","pay","other"
                //     switch(d.type){
                //         case 'porn':
                //             return color[0];
                //         case 'gambling':
                //             return color[1];
                //         case 'fraud':
                //             return color[2];
                //         case 'drug':
                //             return color[3];
                //         case 'gun':
                //             return color[4];
                //         case 'hacker':
                //             return color[5];
                //         case 'trading':
                //             return color[6];
                //         case 'pay':
                //             return color[7];
                //         case 'other':
                //             return color[8];
                //     }
                // })
        })
        
    }
            

    

    useEffect(()=>{
        //drawMatrix();
    },[]);

    return (
        <div id='nodeMatrix' style={{width:'100%', height:'100%'}}>
       </div>);
};

export default NodeMatrix