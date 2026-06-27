import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Spin, Tag, Descriptions, Table, Divider, message, Space, Modal, Rate, Input } from 'antd';
import { ArrowLeftOutlined, QrcodeOutlined, DollarOutlined, StarOutlined } from '@ant-design/icons';
import { travelAPI } from '@/api';

const { Title, Text } = Typography;

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: '待支付', color: 'orange' },
  1: { label: '已支付', color: 'blue' },
  2: { label: '已发货', color: 'processing' },
  3: { label: '已完成', color: 'green' },
  4: { label: '已取消', color: 'default' },
  5: { label: '退款中', color: 'red' },
  6: { label: '已退款', color: 'default' },
};

export default function TravelOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      if (!id) return;
      const res = await travelAPI.getTravelOrderDetail(Number(id));
      if (res.code === 0) setOrder(res.data);
      else message.error(res.message);
    } catch (err) {
      message.error('加载订单失败');
    } finally {
      setLoading(false);
    }
  };

  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const handleReview = async () => {
    if (!order?.reviewTarget) { message.error('暂无评价目标信息'); return; }
    setReviewSubmitting(true);
    try {
      const res = await travelAPI.createReview({
        orderId: order.id,
        targetType: order.reviewTarget.targetType,
        targetId: order.reviewTarget.targetId,
        rating: reviewRating,
        content: reviewContent || undefined,
      });
      if (res.code === 0) { message.success('评价成功'); setReviewOpen(false); loadOrder(); }
      else message.error(res.message);
    } catch (err) { message.error('评价失败'); }
    finally { setReviewSubmitting(false); }
  };

  const handlePay = async () => {
    if (!id) return;
    try {
      const res = await travelAPI.payTravelOrder(Number(id));
      if (res.code === 0) {
        message.success('支付成功（模拟）');
        loadOrder();
      } else {
        message.error(res.message);
      }
    } catch (err) {
      message.error('支付失败');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  if (!order) return <div style={{ textAlign: 'center', padding: 80 }}><Text>订单不存在</Text></div>;

  const ticketColumns = [
    { title: '电子票号', dataIndex: 'qr_code', key: 'qr_code', ellipsis: true },
    {
      title: '有效期', key: 'valid',
      render: (_: any, r: any) => `${r.valid_from} ~ ${r.valid_to}`,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (s: number) => (
        <Tag color={s === 0 ? 'blue' : s === 1 ? 'green' : 'default'}>
          {s === 0 ? '未使用' : s === 1 ? '已使用' : '已退款'}
        </Tag>
      ),
    },
    {
      title: '操作', key: 'action',
      render: (_: any, r: any) => (
        <Button type="link" size="small" icon={<QrcodeOutlined />} onClick={() => navigate(`/travel/e-tickets/${r.id}`)}>
          查看
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/travel/orders')} style={{ marginBottom: 16, padding: 0 }}>
        返回订单列表
      </Button>

      {order.status === 0 && (
        <Card size="small" style={{ marginBottom: 16, background: '#fff7e6', borderColor: '#ffa940' }}>
          <Space>
            <Text>此订单待支付</Text>
            <Button type="primary" size="small" icon={<DollarOutlined />} onClick={handlePay}>立即支付（模拟）</Button>
          </Space>
        </Card>
      )}

      {order.status === 1 && order.reviewTarget && (
        <Card size="small" style={{ marginBottom: 16, background: '#f6ffed', borderColor: '#b7eb8f' }}>
          <Space>
            <Text>已完成支付，可以对本次行程进行评价</Text>
            <Button type="primary" size="small" icon={<StarOutlined />} onClick={() => { setReviewRating(5); setReviewContent(''); setReviewOpen(true); }}>评价</Button>
          </Space>
        </Card>
      )}

      <Card>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="订单号">{order.order_no}</Descriptions.Item>
          <Descriptions.Item label="订单类型">
            <Tag>{order.order_type === 'ticket' ? '门票' : '路线'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="订单金额">¥{Number(order.total_amount).toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="实付金额">
            <Text type="danger" strong>¥{Number(order.pay_amount).toFixed(2)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="状态" span={2}>
            <Tag color={statusMap[order.status]?.color}>{statusMap[order.status]?.label || '未知'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="下单时间" span={2}>
            {new Date(order.created_at).toLocaleString('zh-CN')}
          </Descriptions.Item>
          {order.travel_date && <Descriptions.Item label="出行日期" span={2}>{order.travel_date}</Descriptions.Item>}
          {order.visitor_info?.names?.length > 0 && (
            <Descriptions.Item label="游客姓名" span={2}>
              <Space wrap>{order.visitor_info.names.map((n: string, i: number) => <Tag key={i}>{n}</Tag>)}</Space>
            </Descriptions.Item>
          )}
          {order.remark && <Descriptions.Item label="备注" span={2}>{order.remark}</Descriptions.Item>}
        </Descriptions>

        {order.tickets?.length > 0 && (
          <>
            <Divider />
            <Title level={5}>电子票列表</Title>
            <Table dataSource={order.tickets} columns={ticketColumns} rowKey="id" pagination={false} size="small" />
          </>
        )}
      </Card>

      <Modal title="评价" open={reviewOpen} onCancel={() => setReviewOpen(false)} onOk={handleReview}
        confirmLoading={reviewSubmitting} okText="提交评价" width={440}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Text style={{ display: 'block', marginBottom: 8 }}>评分</Text>
          <Rate value={reviewRating} onChange={setReviewRating} />
        </div>
        <Input.TextArea rows={3} placeholder="写下您的感受（选填）" value={reviewContent}
          onChange={e => setReviewContent(e.target.value)} />
      </Modal>
    </div>
  );
}
