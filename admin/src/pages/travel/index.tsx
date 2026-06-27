import { useState, useEffect } from 'react';
import { Tabs, Row, Col, Card, Statistic } from 'antd';
import { EnvironmentOutlined, CarOutlined, ScanOutlined, OrderedListOutlined, CompassOutlined, StarOutlined } from '@ant-design/icons';
import ScenicSpotManage from './ScenicSpotManage';
import RouteManage from './RouteManage';
import ETicketVerify from './ETicketVerify';
import OrderManage from './OrderManage';
import TransportGuideManage from './TransportGuideManage';
import ReviewManage from './ReviewManage';
import api from '@/api';

export default function AdminTravel() {
  const [stats, setStats] = useState({ orders: 0, spots: 0, routes: 0, tickets: 0 });

  useEffect(() => {
    api.get('/admin/travel/stats').then(res => {
      if (res.data.code === 0) setStats(res.data.data);
    }).catch(() => {});
  }, []);

  const tabItems = [
    { key: 'scenic', label: <span><EnvironmentOutlined /> 景区管理</span>, children: <ScenicSpotManage /> },
    { key: 'routes', label: <span><CarOutlined /> 路线管理</span>, children: <RouteManage /> },
    { key: 'transport', label: <span><CompassOutlined /> 交通攻略</span>, children: <TransportGuideManage /> },
    { key: 'verify', label: <span><ScanOutlined /> 电子票核销</span>, children: <ETicketVerify /> },
    { key: 'orders', label: <span><OrderedListOutlined /> 订单管理</span>, children: <OrderManage /> },
    { key: 'reviews', label: <span><StarOutlined /> 评价管理</span>, children: <ReviewManage /> },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}><Card size="small"><Statistic title="平台订单" value={stats.orders} prefix={<OrderedListOutlined />} suffix="笔" /></Card></Col>
        <Col xs={12} sm={6}><Card size="small"><Statistic title="景区" value={stats.spots} prefix={<EnvironmentOutlined />} suffix="个" /></Card></Col>
        <Col xs={12} sm={6}><Card size="small"><Statistic title="路线套餐" value={stats.routes} prefix={<CarOutlined />} suffix="条" /></Card></Col>
        <Col xs={12} sm={6}><Card size="small"><Statistic title="未核销票" value={stats.tickets} prefix={<ScanOutlined />} suffix="张" /></Card></Col>
      </Row>
      <Tabs defaultActiveKey="scenic" items={tabItems} />
    </div>
  );
}
