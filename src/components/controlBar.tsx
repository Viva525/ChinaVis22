import { Select, Segmented, Slider, Row, Col } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useEffect, useState } from 'react';
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
  const { range, setRange } = props;
  const { current } = tagFilter;

  const container = React.useRef(null);

  const getResult = (value: string) => {
    // setIsLoading(true);
    setSearchParams(value);
  };

  const filterChange = (nodes: Node) => {
    setFilterNode(nodes);
  };

  const filterNumChange = (CurrSelect: { value: string; label: string }) => {
    console.log(CurrSelect.value);
    const map: {
      Wrong_num: number[];
      Node_num: number[];
      Neighbour: number[];
    } = {
      Wrong_num: [0, 1443],
      Node_num: [0, 8903],
      Neighbour: [0, 1000],
    };
    if (CurrSelect.value === 'Wrong_num') {
      setRange({
        select: CurrSelect.value,
        min: 0,
        max: 1443,
        currMin: 15,
        currMax: 1443,
      });
    } else if (CurrSelect.value === 'Node_num') {
      setRange({
        select: CurrSelect.value,
        min: 0,
        max: 8903,
        currMin: 50,
        currMax: 8903,
      });
    } else {
      setRange({
        select: CurrSelect.value,
        min: 0,
        max: 1000,
        currMin: 15,
        currMax: 1000,
      });
    }
  };

  const onAfterChange = (Currange: number[]) => {
    setRange((prevState) => ({
      ...prevState,
      currMin: Currange[0],
      currMax: Currange[1],
    }));
  };

  return (
    <div ref={container} style={{ width: '100%', height: '100%' }}>
      <Row style={{ width: '100%' }} align='middle'>
        <Search
          placeholder='input node or link want to search'
          style={{ width: '100%' }}
          enterButton='Search'
          loading={isLoading}
          onSearch={getResult}
        />
      </Row>
      <Row style={{ width: '100%' }} align='middle'>
        <Select
          mode='multiple'
          allowClear
          placeholder='filter node'
          //@ts-ignore
          defaultValue={filterNode}
          onChange={filterChange}
          style={{ width: '100%', marginTop: '8px' }}>
          {node.map((item) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>
      </Row>
      <Row style={{ width: '100%' }} align='middle'>
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
          style={{ width: '100%', marginTop: '8px' }}></Segmented>
      </Row>
      <Row style={{ width: '100%' }} align='middle'>
        <Segmented
          options={tag}
          block
          onChange={(value) => {
            setTagFilter((prevState) => ({ ...prevState, [current]: value }));
          }}
          value={tagFilter[current]}
          style={{ width: '100%', marginTop: '8px' }}></Segmented>
      </Row>

      <Row align='middle'>
        <Col span={8}>
          <Select id='filterNode'
            style={{ width: '100%', marginLeft: '2px', marginTop: '10px' }}
            labelInValue
            defaultValue={{ value: 'Wrong_num', label: 'Wrong_num' }}
            onChange={filterNumChange}>
            <Select.Option value='Node_num'>Node_num</Select.Option>
            <Select.Option value='Wrong_num'>Wrong_num</Select.Option>
            <Select.Option value='Neighbour'>Neighbour_num</Select.Option>
          </Select>
        </Col>
        <Col span={16} push={1}>
          <Slider
            style={{ width: '85%', marginTop: '18px' }}
            min={range.min}
            max={range.max}
            disabled={currentGraph.current !== 'allCommunity'}
            range
            step={1}
            defaultValue={[range.currMin, range.currMax]}
            onAfterChange={onAfterChange}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ControlBar;
