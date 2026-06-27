import { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Statistic, Table, Tag, Spin, Tabs, Input, Button, message } from 'antd';
import { OrderedListOutlined, EnvironmentOutlined, CarOutlined, ScanOutlined, CompassOutlined, StarOutlined } from '@ant-design/icons';
import ScenicSpotManage from './ScenicSpotManage';
import RouteManage from './RouteManage';
import OrderManage from './OrderManage';
import TransportGuideManage from './TransportGuideManage';
import ReviewManage from './ReviewManage';
import api from '@/api';

const { Title } = Typography;

function QuickVerify() {
  const [code, setCode] = useState('');
  const [vLoading, setVLoading] = useState(false);
  const handleVerify = async () => {
    if (!code.trim()) return;
    setVLoading(true);
    try {
      const res = await api.post('/admin/travel/e-tickets/verify', { qrCode: code.trim() });
      if (res.data.code === 0) { message.success('核销成功'); setCode(''); }
      else message.error(res.data.message || '核销失败');
    } catch (err) { message.error('核销失败'); }
    finally { setVLoading(false); }
  };
  return (
    <Input.Search placeholder="输入电子票号" value={code} onChange={e => setCode(e.target.value)}
      onSearch={handleVerify} enterButton="核销" loading={vLoading} size="middle" />
  );
}

export default function AdminTravel() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ orders: 0, spots: 0, routes: 0, ticketsToday: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsRes, orderRes] = await Promise.all([
        api.get('/admin/travel/stats'),
        api.get('/admin/travel/orders', { params: { pageSize: 5 } }),
      ]);
      if (statsRes.data.code === 0) {
        setStats({
          orders: statsRes.data.data.orders || 0,
          spots: statsRes.data.data.spots || 0,
          routes: statsRes.data.data.routes || 0,
          ticketsToday: statsRes.data.data.tickets || 0,
        });
      }
      setRecentOrders(orderRes.data.data?.list || []);
    } catch (err) {
    } finally { setLoading(false); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Title level={3} style={{ marginBottom: 24 }}>线路订票 · 管理后台</Title>

      {/* 数据看板 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card size="small"><Statistic title="平台订单" value={stats.orders} prefix={<OrderedListOutlined />} suffix="笔" /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small"><Statistic title="景区" value={stats.spots} prefix={<EnvironmentOutlined />} suffix="个" /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small"><Statistic title="路线套餐" value={stats.routes} prefix={<CarOutlined />} suffix="条" /></Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small"><Statistic title="未核销票" value={stats.ticketsToday} prefix={<ScanOutlined />} suffix="张" /></Card>
        </Col>
      </Row>

      {/* 最近订单 + 快捷操作 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="最近订单" size="small">
            <Table dataSource={recentOrders} rowKey="id" pagination={false} size="small"
              columns={[
                { title: '单号', dataIndex: 'order_no', ellipsis: true },
                { title: '类型', dataIndex: 'order_type', render: (t: string) => <Tag>{t === 'ticket' ? '门票' : '路线'}</Tag> },
                { title: '金额', dataIndex: 'pay_amount', render: (v: number) => <span style={{ color: '#E85D2F' }}>¥{Number(v)}</span> },
                { title: '状态', dataIndex: 'status', render: (s: number) => {
                  const m: Record<number, any> = { 0: '待支付', 1: '已支付', 3: '已完成', 4: '已取消' };
                  return <Tag>{m[s] || s}</Tag>;
                }},
                { title: '时间', dataIndex: 'created_at', render: (v: string) => new Date(v).toLocaleString('zh-CN') },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="快捷核销" size="small" style={{ marginBottom: 16 }}>
            <QuickVerify />
          </Card>
        </Col>
      </Row>

      {/* 管理功能 */}
      <Card>
        <Tabs defaultActiveKey="scenic" items={[
          { key: 'scenic', label: <span><EnvironmentOutlined /> 景区管理</span>, children: <ScenicSpotManage /> },
          { key: 'routes', label: <span><CarOutlined /> 路线管理</span>, children: <RouteManage /> },
          { key: 'transport', label: <span><CompassOutlined /> 交通攻略</span>, children: <TransportGuideManage /> },
          { key: 'orders', label: <span><OrderedListOutlined /> 全部订单</span>, children: <OrderManage /> },
          { key: 'reviews', label: <span><StarOutlined /> 评价管理</span>, children: <ReviewManage /> },
        ]} />
      </Card>
    </div>
  );
}
