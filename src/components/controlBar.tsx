import { Select, Segmented } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useState } from 'react';

type ControlBarState = {
    isLoading: boolean,
    nodeType: string[],
    tagOption: Array<string | { label: string, value: string, disabled: boolean }>
}

const ControlBar: React.FC<{}> = () => {

    const [ControlBarState, setControlBarState] = useState<ControlBarState>({
        isLoading: false,
        nodeType: ['IP', 'Cert', 'Domain'],
        tagOption: ['id', 'name', 'community']
    });

    const getResult = () => {
        setControlBarState(prevstate => ({ ...prevstate, isLoading: true }));
    }

    const handleChange = (nodes: string) => {
        console.log(`${nodes}`);
        
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Search placeholder='input node or link want to search' style={{ width: "100%" }} enterButton="Search" loading={ControlBarState.isLoading} onSearch={getResult} />
            <Select mode='multiple' allowClear placeholder='filter node' onChange={handleChange} style={{ width: "100%", marginTop: "8px" }}>
                {
                    ControlBarState.nodeType?.map(item => (
                        <Select.Option key={item} value={item}>
                            {item}
                        </Select.Option>
                    ))
                }
            </Select>
            <Segmented options={['IP', 'Cert', 'Domain']} block style={{ marginTop: '8px' }}></Segmented>
            <Segmented options={ControlBarState.tagOption} block style={{ marginTop: '8px' }}></Segmented>
        </div>);
};

export default ControlBar