import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Spin, Tag, Descriptions, Table, Divider, message } from 'antd';
import { ArrowLeftOutlined, QrcodeOutlined } from '@ant-design/icons';
import { travelAPI } from '@/api';

const { Title, Text } = Typography;

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: '待支付', color: 'orange' },
  1: { label: '已支付', color: 'blue' },
  3: { label: '已完成', color: 'green' },
  4: { label: '已取消', color: 'default' },
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
    </div>
  );
}
