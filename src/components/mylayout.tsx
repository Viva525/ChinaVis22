import 'golden-layout/dist/css/goldenlayout-base.css';
import 'golden-layout/dist/css/themes/goldenlayout-dark-theme.css';
import { Col, Layout, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import Box from './box';
import Network from './network';
import ControlBar from './controlBar';
import CommunityAndNodeList from './communityAndNodeList';

import type {
  ControlState,
  CurrentNetworkState,
  DataState,
  TagFilterState,
} from './types';
import CommunitiesInfo from './communitiesInfo';

/**
 * 装所有box组件的布局
 * @returns
 */
const MyLayout: React.FC<{}> = () => {
  const [currentGraphState, setCurrentGraphState] =
    useState<CurrentNetworkState>({
      current: 'allCommunity',
      communities: [1910103],
    });

  const [dataState, setDataState] = useState<DataState>({
    nodes: [],
    links: [],
  });

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

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Layout>
        <Row style={{ height: '65vh', overflow: 'hidden' }}>
          <Col span={4} style={{ height: '100%' }}>
            <Row style={{ height: '25%' }}>
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
                  />
                }
              />
            </Row>
            <Row style={{ height: '25%' }}>
              <Box title='Neighbour Heatmap' />
            </Row>
            <Row style={{ height: '50%' }}>
              <Box
                title='COMMUNITY INFORMATION'
                component={<CommunitiesInfo />}
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
                />
              }
            />
          </Col>
          <Col span={8} style={{ height: '100%' }}>
            <Box
              title='COMMUNITY &amp; NODE LIST'
              component={
                <CommunityAndNodeList
                  setCurrentGraph={setCurrentGraphState}
                  data={dataState}
                />
              }
            />
          </Col>
        </Row>
        <Row style={{ height: '35vh', overflow: 'hidden' }}>
          <Col span={12}>
            <Box title='NODE MATRIX' />
          </Col>
          <Col span={12}>
            <Box title='CORE ASSETS &amp; KEY PATH' />
          </Col>
        </Row>
      </Layout>
    </div>
  );
};

export default MyLayout;
