import React, { ReactElement } from 'react';
import './css/box.css'

type BoxProps = {
    component?: ReactElement<any, any>,
    title: string
}

const Box: React.FC<BoxProps> = (props) => {

    return (
        <div style={{width:'100%', height:'100%'}} className="boxWrapper">
            <div style={{height:"30px"}} className="boxTitle">{props.title}</div>
            <div className='boxContent'>
                {props.component}
            </div>
       </div>);
};

export default Box