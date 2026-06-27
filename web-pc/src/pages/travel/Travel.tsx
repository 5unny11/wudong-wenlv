import { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Tabs, Tag, Button, Spin, Space, Input, Empty, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CalendarOutlined, EnvironmentOutlined, CarOutlined, DollarOutlined, SearchOutlined, ShopOutlined } from '@ant-design/icons';
import { travelAPI } from '@/api';

const { Title, Text, Paragraph } = Typography;

export default function TravelPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scenicSpots, setScenicSpots] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [transportGuides, setTransportGuides] = useState<any[]>([]);
  const [eTickets, setETickets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('routes');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    loadData();
  }, []);

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

      // 加载电子票（如果已登录）
      const token = localStorage.getItem('token');
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

  const handleSearch = () => {
    travelAPI.listScenicSpots(keyword || undefined).then(res => {
      if (res.code === 0) setScenicSpots(res.data);
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" tip="加载中..." /></div>;

  const tabItems = [
    {
      key: 'routes', label: <span><CarOutlined /> 游玩路线</span>,
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Space wrap>
              <Button type={!location.hash.includes('duration') ? 'primary' : 'default'} onClick={() => {
                travelAPI.listRoutes().then(r => r.code === 0 && setRoutes(r.data));
              }}>全部</Button>
              <Button onClick={() => {
                travelAPI.listRoutes('one_day').then(r => r.code === 0 && setRoutes(r.data));
              }}>一日游</Button>
              <Button onClick={() => {
                travelAPI.listRoutes('two_day').then(r => r.code === 0 && setRoutes(r.data));
              }}>两日游</Button>
            </Space>
          </div>

          {routes.length === 0 ? (
            <Empty description="暂无路线套餐" />
          ) : (
            <Row gutter={[16, 16]}>
              {routes.map(route => (
                <Col xs={24} sm={12} md={8} key={route.id}>
                  <Card
                    hoverable
                    onClick={() => navigate(`/travel/routes/${route.id}`)}
                    cover={
                      <div style={{
                        height: 200,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64,
                        color: '#fff',
                      }}>
                        🗺️
                      </div>
                    }
                  >
                    <Card.Meta
                      title={route.title}
                      description={
                        <div>
                          <Space size={4}>
                            <Tag icon={<CalendarOutlined />} color="blue">{route.duration === 'one_day' ? '1天' : route.duration === 'two_day' ? '2天1晚' : '多日'}</Tag>
                          </Space>
                          <div style={{ fontSize: 24, color: '#ff4d4f', fontWeight: 600, margin: '12px 0' }}>
                            ¥{route.price}
                            <Text style={{ fontSize: 12, fontWeight: 400, color: '#999' }}>/人</Text>
                          </div>
                          <Text type="secondary" ellipsis>{route.includes?.slice(0, 80) || '查看详情'}</Text>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      ),
    },
    {
      key: 'tickets', label: <span><DollarOutlined /> 景区门票</span>,
      children: (
        <div>
          <Space style={{ marginBottom: 24 }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="搜索景区..."
              style={{ width: 320 }}
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
            />
            <Button type="primary" onClick={handleSearch}>搜索</Button>
          </Space>

          {scenicSpots.length === 0 ? (
            <Empty description="暂无景区数据" />
          ) : (
            <Row gutter={[16, 16]}>
              {scenicSpots.map(spot => (
                <Col xs={24} sm={12} md={8} key={spot.id}>
                  <Card
                    hoverable
                    onClick={() => navigate(`/travel/scenic-spots/${spot.id}`)}
                    cover={
                      <div style={{
                        height: 180,
                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56,
                      }}>
                        🏔️
                      </div>
                    }
                  >
                    <Card.Meta
                      title={<><EnvironmentOutlined /> {spot.name}</>}
                      description={
                        <div>
                          <Text type="secondary" ellipsis>{spot.intro?.slice(0, 60) || spot.address || '乌东苗寨'}</Text>
                          <div style={{ marginTop: 12 }}>
                            <Button type="primary" size="small" ghost onClick={e => {
                              e.stopPropagation();
                              navigate(`/travel/scenic-spots/${spot.id}`);
                            }}>查看票种</Button>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      ),
    },
    {
      key: 'transport', label: <span><CarOutlined /> 交通攻略</span>,
      children: (
        <div>
          {transportGuides.length === 0 ? (
            <Empty description="暂无交通攻略" />
          ) : (
            <Row gutter={[16, 16]}>
              {transportGuides.map(guide => (
                <Col xs={24} sm={12} md={8} key={guide.id}>
                  <Card
                    hoverable
                    onClick={() => navigate(`/travel/transport-guides/${guide.id}`)}
                    cover={
                      <div style={{
                        height: 140,
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48,
                      }}>
                        🚌
                      </div>
                    }
                  >
                    <Card.Meta
                      title={guide.title}
                      description={
                        <Text type="secondary">
                          {guide.departure} → {guide.destination} · {guide.transport_mode}
                          {guide.duration ? ` · ${guide.duration}小时` : ''}
                          {guide.cost ? ` · ¥${guide.cost}` : ''}
                        </Text>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      ),
    },
    {
      key: 'etickets', label: <span><ShopOutlined /> 我的电子票</span>,
      children: (
        <div>
          {!localStorage.getItem('token') ? (
            <Empty description={<span>请先<a href="/login">登录</a>查看您的电子票</span>} />
          ) : eTickets.length === 0 ? (
            <Empty description="暂无电子票" />
          ) : (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {eTickets.map(ticket => (
                <Card key={ticket.id} size="small" hoverable onClick={() => navigate(`/travel/e-tickets/${ticket.id}`)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>电子票 #{ticket.id}</Text>
                      <br />
                      <Text type="secondary">有效期: {ticket.valid_from} ~ {ticket.valid_to}</Text>
                    </div>
                    <Tag color={ticket.status === 0 ? 'blue' : ticket.status === 1 ? 'green' : 'default'}>
                      {ticket.status === 0 ? '未使用' : ticket.status === 1 ? '已使用' : '已退款'}
                    </Tag>
                  </div>
                </Card>
              ))}
            </Space>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Title level={3}>出行·游玩</Title>
      <Paragraph type="secondary">探索乌东苗寨，从门票到路线一站式预订</Paragraph>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
    </div>
  );
}
