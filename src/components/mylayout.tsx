import 'golden-layout/dist/css/goldenlayout-base.css';
import 'golden-layout/dist/css/themes/goldenlayout-dark-theme.css';
import { Col, Layout, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import Box from './box';
import Network from './network';

const MyLayout: React.FC<{}> = () => {
    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <Layout>
                <Row style={{height:"65vh", overflow:"hidden"}}>
                    <Col span={6} style={{height:"100%"}}>
                        <Row style={{height:"20%"}}><Box title='SEARCH BAR'/></Row>
                        <Row style={{height:"80%"}}><Box title='COMMUNITY INFORMATION'/></Row>
                    </Col>
                    <Col span={12} style={{height:"100%"}}><Box title='NETWORK ASSETS GRAPH' component={<Network/>}/></Col>
                    <Col span={6} style={{height:"100%"}}><Box title='COMMUNITY LIST'/></Col>
                </Row>
                <Row style={{height:"35vh",overflow:"hidden"}}>
                    <Col span={12}><Box title='CORE ASSETS &amp; KEY PATH'/></Col>
                    <Col span={12}><Box title='UNKNOWN'/></Col>
                </Row>
            </Layout>
        </div>);
};

export default MyLayout