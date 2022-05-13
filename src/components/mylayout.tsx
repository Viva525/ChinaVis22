import 'golden-layout/dist/css/goldenlayout-base.css';
import 'golden-layout/dist/css/themes/goldenlayout-dark-theme.css';
import { Col, Layout, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import Box from './box';
import Network from './network';
import ControlBar from './controlBar';
import type {
  ControlState,
  CurrentNetworkState,
  TagFilterState,
} from './types';

const MyLayout: React.FC<{}> = () => {
  const [currentGraphState, setCurrentGraphState] =
    useState<CurrentNetworkState>({
      current: 'communities',
      communities: [1910103],
    });

  const [searchParamsState, setSearchParamsState] =
    useState<ControlState['searchParams']>('');

  const [filterNodeState, setFilterNodeState] = useState<
    ControlState['filterNode']
  >(['IP', 'Cert', 'Domain']);

  const [tagFilterState, setTagFilterState] = useState<TagFilterState>({
    IP: 'Id',
    Cert: 'Id',
    Domain: 'Id',
    current: 'IP',
  });

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Layout>
        <Row style={{ height: '65vh', overflow: 'hidden' }}>
          <Col span={6} style={{ height: '100%' }}>
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
                  />
                }
              />
            </Row>
            <Row style={{ height: '75%' }}>
              <Box title='COMMUNITY INFORMATION' />
            </Row>
          </Col>
          <Col span={12} style={{ height: '100%' }}>
            <Box
              title='NETWORK ASSETS GRAPH'
              component={
                <Network
                  currentGragh={currentGraphState}
                  searchParams={searchParamsState}
                  filterNode={filterNodeState}
                  tagFilter={tagFilterState}
                />
              }
            />
          </Col>
          <Col span={6} style={{ height: '100%' }}>
            <Box title='COMMUNITY &amp; NODE LIST' />
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
