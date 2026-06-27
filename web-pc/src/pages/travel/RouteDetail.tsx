import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Spin, Tag, Steps, Divider, Space, message, Modal, Form, Input, InputNumber, List, Rate } from 'antd';
import { CalendarOutlined, ArrowLeftOutlined, CheckCircleOutlined, ScheduleOutlined } from '@ant-design/icons';
import { travelAPI } from '@/api';
import { routeCovers, defaultCover } from './covers';

const { Title, Text, Paragraph } = Typography;

export default function RouteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [orderModal, setOrderModal] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadRoute();
  }, [id]);

  const loadRoute = async () => {
    setLoading(true);
    try {
      if (!id) return;
      const res = await travelAPI.getRoute(Number(id));
      if (res.code === 0) setRoute(res.data);
      else message.error(res.message);
      // 加载评价
      const reviewRes = await travelAPI.listReviews('tour_route', Number(id));
      if (reviewRes.code === 0) setReviews(reviewRes.data);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = () => {
    const token = sessionStorage.getItem('token');
    if (!token) { message.warning('请先登录'); navigate('/login'); return; }
    setOrderModal(true);
  };

  const handlePlaceOrder = async (values: any) => {
    setPurchasing(true);
    try {
      const res = await travelAPI.createTravelOrder({
        merchantId: 1,
        orderType: 'route',
        items: [{
          routeId: route.id,
          quantity: values.quantity || 1,
          price: Number(route.price),
        }],
        totalAmount: Number(route.price) * (values.quantity || 1),
        visitorNames: values.visitorNames?.split('\n') || [],
        visitorIds: values.visitorIds?.split('\n') || [],
        travelDate: values.travelDate,
        remark: values.remark,
      });
      if (res.code === 0) {
        message.success('下单成功！');
        setOrderModal(false);
        navigate('/travel/orders');
      } else {
        message.error(res.message);
      }
    } catch (err) {
      message.error('下单失败');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" tip="加载中..." /></div>;
  if (!route) return <div style={{ textAlign: 'center', padding: 80 }}><Text>路线不存在</Text></div>;

  const cov = routeCovers[route.id] || defaultCover;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/travel')} style={{ marginBottom: 16, padding: 0 }}>
        返回出行首页
      </Button>

      {/* 封面 */}
      <div style={{
        height: 300, borderRadius: 12, marginBottom: 24,
        background: cov.gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 100, opacity: 0.35 }}>{cov.icon}</span>
      </div>

      <Title level={3}>{route.title}</Title>
      <Space style={{ marginBottom: 16 }}>
        <Tag icon={<CalendarOutlined />} color="blue">
          {route.duration === 'one_day' ? '一日游' : route.duration === 'two_day' ? '两日游' : '多日游'}
        </Tag>
        {route.start_city && <Tag>{route.start_city}出发</Tag>}
      </Space>

      <div style={{ fontSize: 32, color: '#ff4d4f', fontWeight: 600, marginBottom: 24 }}>
        ¥{route.price}<Text style={{ fontSize: 14, fontWeight: 400, color: '#999' }}>/人</Text>
      </div>

      <Button type="primary" size="large" onClick={handleBuy} style={{ marginBottom: 24 }}>
        立即预订
      </Button>

      <Divider />

      {route.notice && (
        <Card size="small" style={{ marginBottom: 16, background: '#fffbe6' }}>
          <Text type="warning">⚠️ 注意事项: {route.notice}</Text>
        </Card>
      )}

      {/* 行程安排 */}
      <Title level={5}><ScheduleOutlined /> 行程安排</Title>
      {route.schedules?.length > 0 ? (
        <Steps
          direction="vertical"
          current={-1}
          items={route.schedules.map((s: any, idx: number) => ({
            title: `第${s.day_number}天`,
            description: (
              <div>
                {s.description && <Paragraph>{s.description}</Paragraph>}
                {s.attractions && <Text><Tag color="green">{s.attractions}</Tag></Text>}
                <div style={{ marginTop: 4 }}>
                  {s.meals && <Text type="secondary">🍽 {s.meals}</Text>}
                  {s.accommodation && <Text type="secondary" style={{ marginLeft: 12 }}>🏠 {s.accommodation}</Text>}
                  {s.transport && <Text type="secondary" style={{ marginLeft: 12 }}>🚌 {s.transport}</Text>}
                </div>
              </div>
            ),
          }))}
        />
      ) : (
        <Paragraph type="secondary">{route.schedule || route.detail || '暂无详细行程安排'}</Paragraph>
      )}

      <Divider />
      <Title level={5}>包含项目</Title>
      <Paragraph>{route.includes || '详见行程'}</Paragraph>

      <Divider />
      <Title level={5}>用户评价</Title>
      {reviews.length === 0 ? (
        <Text type="secondary">暂无评价</Text>
      ) : (
        <List dataSource={reviews} renderItem={(review: any) => (
          <List.Item>
            <List.Item.Meta avatar={<Rate disabled value={review.rating} />}
              description={<Text>{review.content || '（无文字）'}</Text>} />
          </List.Item>
        )} />
      )}

      {/* 下单弹窗 */}
      <Modal title="预订路线" open={orderModal} onCancel={() => setOrderModal(false)} footer={null} width={480}>
        <Form form={form} layout="vertical" onFinish={handlePlaceOrder}>
          <div style={{ marginBottom: 16 }}>
            <Text strong>{route.title}</Text>
            <div style={{ fontSize: 20, color: '#ff4d4f', fontWeight: 600, marginTop: 8 }}>¥{route.price}/人</div>
          </div>

          <Form.Item label="出行日期" name="travelDate" rules={[{ required: true, message: '请选择日期' }]}>
            <Input type="date" />
          </Form.Item>

          <Form.Item label="人数" name="quantity" initialValue={1} rules={[{ required: true }]}>
            <InputNumber min={1} max={20} style={{ width: 120 }} />
          </Form.Item>

          <Form.Item label="游客姓名（每行一个）" name="visitorNames" rules={[{ required: true, message: '请填写游客姓名' }]}>
            <Input.TextArea rows={3} placeholder="请填写全部游客姓名" />
          </Form.Item>

          <Form.Item label="身份证号（每行一个）" name="visitorIds" rules={[{ required: true, message: '请填写身份证号' }]}>
            <Input.TextArea rows={3} placeholder="用于景区实名制入园" />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input placeholder="选填" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large" loading={purchasing}>确认预订</Button>
        </Form>
      </Modal>
    </div>
  );
}
