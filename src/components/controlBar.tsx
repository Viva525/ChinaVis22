import { Select, Segmented, Slider } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useState } from 'react';
import type { ControlBarProps, NodeType, Node, Tag } from './types';

/**
 * 系统左上角的控制面板
 * 搜索框语法：xxxxxx / xxxxxx>xxxxxx / Domain?email:xxxx / 1231245
 * @param props
 * @returns
 */
const ControlBar: React.FC<ControlBarProps> = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [node, setNode] = useState<Node>(['IP', 'Cert', 'Domain']);
  const [tag, setTag] = useState<Tag>(['id', 'name', 'community']);
  const { searchParams, setSearchParams } = props;
  const { filterNode, setFilterNode } = props;
  const { tagFilter, setTagFilter } = props;
  const { currentGraph, setCurrentGraph } = props;
  const { current } = tagFilter;

  const getResult = (value: string) => {
    // setIsLoading(true);
    setSearchParams(value);
  };

  const handleChange = (nodes: Node) => {
    setFilterNode(nodes);
  };

  const onAfterChange = (nodes: any) => {};

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Search
        placeholder='input node or link want to search'
        style={{ width: '100%' }}
        enterButton='Search'
        loading={isLoading}
        onSearch={getResult}
      />
      <Select
        mode='multiple'
        allowClear
        placeholder='filter node'
        //@ts-ignore
        defaultValue={filterNode}
        onChange={handleChange}
        style={{ width: '100%', marginTop: '8px' }}>
        {node.map((item) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
      <Segmented
        options={node}
        block
        onChange={(value) => {
          setTagFilter((prevState) => ({
            ...prevState,
            current: value as NodeType,
          }));
        }}
        value={current}
        style={{ marginTop: '8px' }}></Segmented>
      <Segmented
        options={tag}
        block
        onChange={(value) => {
          setTagFilter((prevState) => ({ ...prevState, [current]: value }));
        }}
        value={tagFilter[current]}
        style={{ marginTop: '8px' }}></Segmented>
      <Slider
        range
        step={10}
        defaultValue={[20, 50]}
        onAfterChange={onAfterChange}
      />
    </div>
  );
};

export default ControlBar;
