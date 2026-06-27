import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Typography, Tag, Button, Spin, Descriptions, InputNumber, Space, Divider, message, Modal, Form, Input, List, Rate } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { travelAPI } from '@/api';
import { scenicSpotCovers, defaultCover } from './covers';

const { Title, Text, Paragraph } = Typography;

export default function ScenicSpotDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [spot, setSpot] = useState<any>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [purchasing, setPurchasing] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [orderModal, setOrderModal] = useState(false);
  const [visitorForm] = Form.useForm();

  useEffect(() => {
    loadSpot();
  }, [id]);

  const loadSpot = async () => {
    setLoading(true);
    try {
      if (!id) return;
      const res = await travelAPI.getScenicSpot(Number(id));
      if (res.code === 0) {
        setSpot(res.data);
        const qty: Record<number, number> = {};
        res.data.tickets?.forEach((t: any) => { qty[t.id] = 0; });
        setQuantities(qty);
      } else {
        message.error(res.message);
      }
      // 加载评价
      const reviewRes = await travelAPI.listReviews('scenic_spot', Number(id));
      if (reviewRes.code === 0) setReviews(reviewRes.data);
    } catch (err) {
      message.error('加载景区信息失败');
    } finally {
      setLoading(false);
    }
  };

  const token = sessionStorage.getItem('token');

  const handleQuantityChange = (ticketId: number, value: number | null) => {
    setQuantities(prev => ({ ...prev, [ticketId]: value || 0 }));
  };

  const totalAmount = spot?.tickets?.reduce((sum: number, t: any) => {
    return sum + (quantities[t.id] || 0) * Number(t.price);
  }, 0) || 0;

  const hasSelection = Object.values(quantities).some(q => q > 0);

  const handleBuy = () => {
    if (!token) { message.warning('请先登录'); navigate('/login'); return; }
    if (!hasSelection) { message.warning('请选择票种和数量'); return; }
    setOrderModal(true);
  };

  const handlePlaceOrder = async (values: any) => {
    setPurchasing(true);
    try {
      const items = spot.tickets
        ?.filter((t: any) => (quantities[t.id] || 0) > 0)
        .map((t: any) => ({
          ticketTypeId: t.id,
          quantity: quantities[t.id],
          price: Number(t.price),
        })) || [];

      const res = await travelAPI.createTravelOrder({
        merchantId: 1,
        orderType: 'ticket',
        items,
        totalAmount,
        visitorNames: values.visitorNames?.split('\n') || [],
        visitorIds: values.visitorIds?.split('\n') || [],
        travelDate: values.travelDate || new Date().toISOString().split('T')[0],
        remark: values.remark,
      });

      if (res.code === 0) {
        message.success('下单成功！请在15分钟内完成支付');
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
  if (!spot) return <div style={{ textAlign: 'center', padding: 80 }}><Text>景区不存在</Text></div>;

  const cov = scenicSpotCovers[spot.id] || defaultCover;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/travel')} style={{ marginBottom: 16, padding: 0 }}>
        返回出行首页
      </Button>

      <Row gutter={32}>
        <Col xs={24} md={10}>
          <div style={{
            height: 350, borderRadius: 12,
            background: cov.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 100, opacity: 0.4 }}>{cov.icon}</span>
          </div>
        </Col>
        <Col xs={24} md={14}>
          <Title level={3}>{spot.name}</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text><EnvironmentOutlined /> {spot.address || '贵州·乌东苗寨'}</Text>
            {spot.open_time && <Text><ClockCircleOutlined /> 开放时间: {spot.open_time}</Text>}
            <Paragraph style={{ marginTop: 16 }}>{spot.intro}</Paragraph>
          </Space>

          <Divider />
          <Title level={5}>选择票种</Title>

          {spot.tickets?.length === 0 ? (
            <Text type="secondary">暂无票种信息</Text>
          ) : (
            <List
              dataSource={spot.tickets || []}
              renderItem={(ticket: any) => (
                <List.Item
                  extra={
                    <Space>
                      <InputNumber
                        min={0}
                        max={ticket.stock || 99}
                        value={quantities[ticket.id] || 0}
                        onChange={v => handleQuantityChange(ticket.id, v)}
                        style={{ width: 70 }}
                      />
                    </Space>
                  }
                >
                  <List.Item.Meta
                    title={<span>{ticket.name} <Text type="danger" style={{ fontSize: 18 }}>¥{ticket.price}</Text></span>}
                    description={ticket.valid_days ? `有效期: ${ticket.valid_days}天` : ''}
                  />
                </List.Item>
              )}
            />
          )}

          <Divider />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong style={{ fontSize: 16 }}>合计: </Text>
              <Text type="danger" style={{ fontSize: 24, fontWeight: 600 }}>¥{totalAmount}</Text>
            </div>
            <Button type="primary" size="large" icon={<ShoppingCartOutlined />} disabled={!hasSelection} onClick={handleBuy}>
              立即购买
            </Button>
          </div>
        </Col>
      </Row>

      {/* 评价区域 */}
      <Divider />
      <Title level={5}>用户评价</Title>
      {reviews.length === 0 ? (
        <Text type="secondary">暂无评价</Text>
      ) : (
        <List
          dataSource={reviews}
          renderItem={(review: any) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Rate disabled value={review.rating} />}
                description={<Text>{review.content}</Text>}
              />
            </List.Item>
          )}
        />
      )}

      {/* 下单弹窗 */}
      <Modal
        title="确认订单"
        open={orderModal}
        onCancel={() => setOrderModal(false)}
        footer={null}
        width={500}
      >
        <Form form={visitorForm} layout="vertical" onFinish={handlePlaceOrder}>
          <div style={{ marginBottom: 16 }}>
            <Text strong>购买明细</Text>
            {spot.tickets?.filter((t: any) => (quantities[t.id] || 0) > 0).map((t: any) => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <Text>{t.name} x {quantities[t.id]}</Text>
                <Text type="danger">¥{Number(t.price) * quantities[t.id]}</Text>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', paddingTop: 8, marginTop: 8 }}>
              <Text strong>合计</Text>
              <Text type="danger" style={{ fontSize: 18, fontWeight: 600 }}>¥{totalAmount}</Text>
            </div>
          </div>

          <Divider />

          <Form.Item label="游览日期" name="travelDate" rules={[{ required: true, message: '请选择游览日期' }]}>
            <Input type="date" />
          </Form.Item>

          <Form.Item label="游客姓名（每行一个）" name="visitorNames" rules={[{ required: true, message: '请填写游客姓名' }]}>
            <Input.TextArea rows={3} placeholder="张三&#10;李四" />
          </Form.Item>

          <Form.Item label="游客身份证号（每行一个）" name="visitorIds" rules={[{ required: true, message: '请填写身份证号' }]}>
            <Input.TextArea rows={3} placeholder="每行一个身份证号" />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input placeholder="选填" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large" loading={purchasing}>
            确认支付 ¥{totalAmount}
          </Button>
          <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 8, fontSize: 12 }}>
            支付方式：模拟支付（开发阶段）
          </Text>
        </Form>
      </Modal>
    </div>
  );
}
