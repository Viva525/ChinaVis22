import { Select, Segmented } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useState } from 'react';

type searchBarState = {
    isLoading: boolean,
    nodeType: string[],
    tagOption: Array<string | { label: string, value: string, disabled: boolean }>
}

const SearchBar: React.FC<{}> = () => {

    const [searchBarState, setSearchBarState] = useState<searchBarState>({
        isLoading: false,
        nodeType: ['IP', 'Cert', 'Domain'],
        tagOption: ['id', 'name', 'community']
    });

    const getResult = () => {
        setSearchBarState(prevstate => ({ ...prevstate, isLoading: true }));
    }

    const handleChange = (nodes: string) => {
        console.log(`${nodes}`);
        
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Search placeholder='input node or link want to search' style={{ width: "100%" }} enterButton="Search" loading={searchBarState.isLoading} onSearch={getResult} />
            <Select mode='multiple' allowClear placeholder='filter node' onChange={handleChange} style={{ width: "100%", marginTop: "8px" }}>
                {
                    searchBarState.nodeType?.map(item => (
                        <Select.Option key={item} value={item}>
                            {item}
                        </Select.Option>
                    ))
                }
            </Select>
            <Segmented options={['IP', 'Cert', 'Domain']} block style={{ marginTop: '8px' }}></Segmented>
            <Segmented options={searchBarState.tagOption} block style={{ marginTop: '8px' }}></Segmented>
        </div>);
};

export default SearchBar