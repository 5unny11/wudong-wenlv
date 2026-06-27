import { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Tabs, Tag, Button, Spin, Space, Input, Empty, Statistic, Rate } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CalendarOutlined, EnvironmentOutlined, CarOutlined, DollarOutlined, ShopOutlined, CompassOutlined } from '@ant-design/icons';
import { travelAPI } from '@/api';
import { scenicSpotCovers, routeCovers, transportCovers, defaultCover } from './covers';

const { Title, Text, Paragraph } = Typography;

function CoverImage({ cov, h = 180 }: { cov: { gradient: string; icon: string }; h?: number }) {
  return (
    <div style={{
      height: h, background: cov.gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative' as const,
    }}>
      <span style={{ fontSize: h * 0.35, opacity: 0.35, userSelect: 'none' }}>{cov.icon}</span>
    </div>
  );
}

export default function TravelPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scenicSpots, setScenicSpots] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [transportGuides, setTransportGuides] = useState<any[]>([]);
  const [eTickets, setETickets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('routes');
  const [keyword, setKeyword] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [routesRes, spotsRes, guidesRes] = await Promise.all([
        travelAPI.listRoutes(),
        travelAPI.listScenicSpots(),
        travelAPI.listTransportGuides(),
      ]);
      if (routesRes.code === 0) setRoutes(routesRes.data);
      if (spotsRes.code === 0) setScenicSpots(spotsRes.data);
      if (guidesRes.code === 0) setTransportGuides(guidesRes.data);
      const token = sessionStorage.getItem('token');
      if (token) {
        const ticketsRes = await travelAPI.listMyETickets();
        if (ticketsRes.code === 0) setETickets(ticketsRes.data);
      }
    } catch (err) {
      console.error('加载数据失败', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 120 }}>
      <Spin size="large" />
      <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>探索乌东苗寨…</Text>
    </div>
  );

  const tabItems = [
    {
      key: 'routes', label: <span><CompassOutlined /> 游玩路线</span>,
      children: (
        <div>
          <Space wrap style={{ marginBottom: 24 }}>
            <Button type="primary" ghost onClick={() => travelAPI.listRoutes().then(r => r.code === 0 && setRoutes(r.data))}>全部</Button>
            <Button onClick={() => travelAPI.listRoutes('one_day').then(r => r.code === 0 && setRoutes(r.data))}>一日游</Button>
            <Button onClick={() => travelAPI.listRoutes('two_day').then(r => r.code === 0 && setRoutes(r.data))}>两日游</Button>
          </Space>

          {routes.length === 0 ? <Empty description="暂无路线套餐" /> : (
            <Row gutter={[20, 20]}>
              {routes.map(route => {
                const cov = routeCovers[route.id] || defaultCover;
                return (
                  <Col xs={24} sm={12} lg={8} key={route.id}>
                    <Card hoverable style={{ borderRadius: 12, overflow: 'hidden', height: '100%' }} bodyStyle={{ padding: 0 }}
                      onClick={() => navigate(`/travel/routes/${route.id}`)}>
                      <div style={{ height: 180, background: cov.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <span style={{ fontSize: 72, opacity: 0.3 }}>{cov.icon}</span>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px 12px', background: 'linear-gradient(transparent, rgba(0,0,0,0.55))' }}>
                          <Tag color="blue">{route.duration === 'one_day' ? '一日游' : route.duration === 'two_day' ? '两日游' : '多日游'}</Tag>
                        </div>
                      </div>
                      <div style={{ padding: '16px 20px' }}>
                        <Title level={5} style={{ margin: '0 0 8px' }}>{route.title}</Title>
                        <Text type="secondary" style={{ fontSize: 13 }} ellipsis={{ tooltip: route.includes }}>
                          {route.includes?.slice(0, 50) || '查看详情'}
                        </Text>
                        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Rate allowHalf disabled value={route.avgRating || 0} style={{ fontSize: 13 }} />
                          {route.reviewCount > 0 && <Text style={{ fontSize: 12, color: '#8C8C8C' }}>{route.avgRating?.toFixed(1)} ({route.reviewCount})</Text>}
                        </div>
                        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <Text strong style={{ fontSize: 20, color: '#E85D2F' }}>¥{route.price}<Text style={{ fontSize: 12, fontWeight: 400, color: '#999' }}>/人</Text></Text>
                          {route.start_city && <Text type="secondary" style={{ fontSize: 12 }}>{route.start_city}出发</Text>}
                        </div>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </div>
      ),
    },
    {
      key: 'tickets', label: <span><DollarOutlined /> 景区门票</span>,
      children: (
        <div>
          <Input.Search placeholder="搜索景区..." style={{ width: 320, marginBottom: 24 }} value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onSearch={() => travelAPI.listScenicSpots(keyword || undefined).then(res => res.code === 0 && setScenicSpots(res.data))}
            enterButton />
          {scenicSpots.length === 0 ? <Empty description="暂无景区数据" /> : (
            <Row gutter={[20, 20]}>
              {scenicSpots.map(spot => {
                const cov = scenicSpotCovers[spot.id] || defaultCover;
                return (
                  <Col xs={24} sm={12} lg={8} key={spot.id}>
                    <Card hoverable style={{ borderRadius: 12, overflow: 'hidden', height: '100%' }} bodyStyle={{ padding: 0 }}
                      onClick={() => navigate(`/travel/scenic-spots/${spot.id}`)}>
                      <div style={{ height: 160, background: cov.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <span style={{ fontSize: 56, opacity: 0.3 }}>{cov.icon}</span>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px 12px', background: 'linear-gradient(transparent, rgba(0,0,0,0.5))' }}>
                          <Title level={5} style={{ color: '#fff', margin: 0 }}>{spot.name}</Title>
                        </div>
                      </div>
                      <div style={{ padding: '14px 20px' }}>
                        <Text type="secondary" style={{ fontSize: 13 }} ellipsis>{spot.intro?.slice(0, 60) || spot.address || '贵州·乌东苗寨'}</Text>
                        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Rate allowHalf disabled value={spot.avgRating || 0} style={{ fontSize: 13 }} />
                          {spot.reviewCount > 0 && <Text style={{ fontSize: 12, color: '#8C8C8C' }}>{spot.avgRating?.toFixed(1) || '0'} ({spot.reviewCount})</Text>}
                        </div>
                        {spot.open_time && <div style={{ marginTop: 8 }}><Tag icon={<CalendarOutlined />} color="green">{spot.open_time}</Tag></div>}
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </div>
      ),
    },
    {
      key: 'transport', label: <span><CarOutlined /> 交通攻略</span>,
      children: (
        <div>
          {transportGuides.length === 0 ? <Empty description="暂无交通攻略" /> : (
            <Row gutter={[20, 20]}>
              {transportGuides.map(guide => {
                const cov = transportCovers[guide.id] || defaultCover;
                return (
                  <Col xs={24} sm={12} lg={6} key={guide.id}>
                    <Card hoverable style={{ borderRadius: 12, height: '100%', textAlign: 'center' }}
                      onClick={() => navigate(`/travel/transport-guides/${guide.id}`)}>
                      <div style={{ width: 60, height: 60, borderRadius: '50%', background: cov.gradient,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                        <span style={{ fontSize: 28 }}>{cov.icon}</span>
                      </div>
                      <Title level={5} style={{ marginBottom: 8 }}>{guide.title}</Title>
                      <Text type="secondary" style={{ fontSize: 13 }}>{guide.departure} → {guide.destination}</Text>
                      <div style={{ marginTop: 6 }}>
                        <Tag>{guide.transport_mode}</Tag>
                        {guide.duration && <span style={{ fontSize: 12, color: '#999' }}> · {guide.duration}h</span>}
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </div>
      ),
    },
    {
      key: 'etickets', label: <span><ShopOutlined /> 我的电子票</span>,
      children: (
        <div>
          {!sessionStorage.getItem('token') ? (
            <Empty description={<span>请先<a href="/login">登录</a>查看您的电子票</span>} />
          ) : eTickets.length === 0 ? (
            <Empty description="暂无电子票"><Button type="primary" onClick={() => setActiveTab('routes')}>去选购路线</Button></Empty>
          ) : (
            <Row gutter={[16, 16]}>
              {eTickets.map(ticket => (
                <Col xs={24} sm={12} md={8} key={ticket.id}>
                  <Card hoverable style={{ borderRadius: 12 }} onClick={() => navigate(`/travel/e-tickets/${ticket.id}`)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text strong style={{ fontSize: 16 }}>电子票 #{ticket.id}</Text><br />
                        <Text type="secondary" style={{ fontSize: 13 }}>{ticket.valid_from} ~ {ticket.valid_to}</Text>
                      </div>
                      <Tag color={ticket.status === 0 ? 'blue' : ticket.status === 1 ? 'green' : 'default'}>
                        {ticket.status === 0 ? '未使用' : ticket.status === 1 ? '已使用' : '已退款'}
                      </Tag>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 40px' }}>
      {/* 英雄横幅 */}
      <div style={{
        margin: '0 -24px 32px', padding: '60px 40px',
        background: 'linear-gradient(135deg, #0E3D75 0%, #1F5FA8 40%, #6B8E3D 100%)',
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -40, top: -30, opacity: 0.08, fontSize: 280, lineHeight: 1 }}>🏔️</div>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <Title level={1} style={{ color: '#fff', marginBottom: 8, fontSize: 36 }}>探索乌东苗寨</Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 24 }}>
            从门票到路线一站式预订，发现苗族文化的独特魅力
          </Paragraph>
          <Row gutter={40}>
            <Col><Statistic title={<span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>景区</span>} value={scenicSpots.length} suffix="个" valueStyle={{ color: '#fff' }} /></Col>
            <Col><Statistic title={<span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>路线套餐</span>} value={routes.length} suffix="条" valueStyle={{ color: '#fff' }} /></Col>
            <Col><Statistic title={<span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>交通攻略</span>} value={transportGuides.length} suffix="篇" valueStyle={{ color: '#fff' }} /></Col>
          </Row>
        </div>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large" items={tabItems} />
    </div>
  );
}
