import 'golden-layout/dist/css/goldenlayout-base.css';
import 'golden-layout/dist/css/themes/goldenlayout-dark-theme.css';
import { Col, Layout, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import Box from './box';
import Network from './network';
import ControlBar from './controlBar';
import CommunityAndNodeList from './communityAndNodeList';

import {
  ControlState,
  CurrentNetworkState,
  currentNode,
  DataState,
  RangeState,
  TagFilterState,
} from './types';
import CommunitiesInfo from './communitiesInfo';
import DimReduct from './dimReduct';
import CorePath from './corePath';
import PathList from './pathList';
import NodeMatrix from './nodeMatrix';
import NodeMatrixself from './nodeMatrixself';

/**
 * 装所有box组件的布局
 * @returns
 */
const MyLayout: React.FC<{}> = () => {
  const [currentGraphState, setCurrentGraphState] =
    useState<CurrentNetworkState>({
      current: 'allCommunity',
      communities: [],
    });

  const [dataState, setDataState] = useState<DataState>({
    nodes: [],
    links: [],
  });

  const [selectNodeState, setSelectNodeState] = useState<string[]>([]);
  const [selectKeyNodeState, setSelectKeyNodeState] = useState<Set<any>>(
    new Set()
  );
  const [selectCurrentNodeState, setCurrentNodeState] = useState<string>("");
  const [selectCommunitiesState, setSelectCommunitiesState] = useState<number[]>([]);
  const [pathListState, setPathListState] = useState<Set<any>>(new Set());
  const [selectPathsState, setSelectPathState] = useState<Set<any>>(new Set());

  const [searchParamsState, setSearchParamsState] =
    useState<ControlState['searchParams']>('');

  const [filterNodeState, setFilterNodeState] = useState<
    ControlState['filterNode']
  >(['IP', 'Cert', 'Domain']);

  const [tagFilterState, setTagFilterState] = useState<TagFilterState>({
    IP: 'id',
    Cert: 'id',
    Domain: 'id',
    current: 'IP',
  });

  const [rangeState, setRangeState] = useState<RangeState>({
    select: 'Wrong_num',
    min: 0,
    max: 1443,
    currMin: 15,
    currMax: 1443,
  });

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Layout>
        <Row style={{ height: '60vh', overflow: 'hidden' }}>
          <Col span={4} style={{ height: '100%' }}>
            <Row style={{ height: '30%' }}>
              <Box
                title='CONTROL BAR'
                component={
                  <ControlBar
                    searchParams={searchParamsState}
                    setSearchParams={setSearchParamsState}
                    filterNode={filterNodeState}
                    setFilterNode={setFilterNodeState}
                    tagFilter={tagFilterState}
                    setTagFilter={setTagFilterState}
                    currentGraph={currentGraphState}
                    setCurrentGraph={setCurrentGraphState}
                    range={rangeState}
                    setRange={setRangeState}
                  />
                }
              />
            </Row>
            <Row style={{ height: '25%' }}>
              <Box
                title='Neighbour Heatmap'
                component={
                  <NodeMatrixself
                    currentNodeself={selectCurrentNodeState}
                    currentCommunities={currentGraphState}
                    setCurrentCommunities={setCurrentGraphState}
                  />
                }
              />
            </Row>
            <Row style={{ height: '45%' }}>
              <Box
                title='NODE MATRIX'
                component={
                  <NodeMatrix
                    currentCommunitiesID={currentGraphState}
                    setCurrentCommunitiesID={setCurrentGraphState}
                  />
                }
              />
            </Row>
          </Col>
          <Col span={12} style={{ height: '100%' }}>
            <Box
              title='NETWORK ASSETS GRAPH'
              component={
                <Network
                  currentGragh={currentGraphState}
                  setCurrentGraph={setCurrentGraphState}
                  searchParams={searchParamsState}
                  filterNode={filterNodeState}
                  tagFilter={tagFilterState}
                  data={dataState}
                  setData={setDataState}
                  selectNode={selectNodeState}
                  range={rangeState}
                  setSelectKeyNode={setSelectKeyNodeState}
                  selectKeyNode={selectKeyNodeState}
                  selectPaths={selectPathsState}
                  currentNode={selectCurrentNodeState}
                  setCurrentNode={setCurrentNodeState}
                  selectCommunities={selectCommunitiesState}
                />
              }
            />
          </Col>
          <Col span={8} style={{ height: '100%' }}>
            <Box
              title='COMMUNITY &amp; NODE LIST'
              component={
                <CommunityAndNodeList
                  currentGragh={currentGraphState}
                  setCurrentGraph={setCurrentGraphState}
                  data={dataState}
                  setSelectNode={setSelectNodeState}
                  selectCommunities={selectCommunitiesState}
                  setSelectCommunities={setSelectCommunitiesState}
                />
              }
            />
          </Col>
        </Row>
        <Row style={{ height: '40vh', overflow: 'hidden' }}>
          <Col span={6}>
            <Box
              title='DIMENSION REDUCTION'
              component={
                <DimReduct
                  currentGraph={currentGraphState}
                  setCurrentGraph={setCurrentGraphState}
                />
              }
            />
          </Col>
          <Col span={6}>
            <Box
              title='COMMUNITY INFORMATION'
              component={
                <CommunitiesInfo
                currentGraph={currentGraphState}
                />
              }
            />
          </Col>
          <Col span={6} style={{ height: '100%' }}>
            <Box
              title='CORE ASSETS &amp; KEY PATH'
              component={
                <CorePath
                  selectKeyNode={selectKeyNodeState}
                  setPathList={setPathListState}
                />
              }
            />
          </Col>
          <Col span={6} style={{ height: '100%' }}>
            <Box
              title='KEY PATH RESULTS'
              component={
                <PathList
                  pathList={pathListState}
                  setPathList={setPathListState}
                  selectKeyNode={selectKeyNodeState}
                  selectPaths={selectPathsState}
                  setSelectPaths={setSelectPathState}
                />
              }
            />
          </Col>
        </Row>
      </Layout>
    </div>
  );
};

export default MyLayout;
