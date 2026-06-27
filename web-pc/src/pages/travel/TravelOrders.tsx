import { useState, useEffect } from 'react';
import { Card, Typography, Button, Spin, Tag, Space, Table, Empty, message, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
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

export default function TravelOrdersPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await travelAPI.listMyTravelOrders();
      if (res.code === 0) setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: number) => {
    try {
      const res = await travelAPI.cancelTravelOrder(orderId);
      if (res.code === 0) {
        message.success('订单已取消');
        loadOrders();
      } else {
        message.error(res.message);
      }
    } catch (err) {
      message.error('取消失败');
    }
  };

  const columns = [
    { title: '订单号', dataIndex: 'order_no', key: 'order_no', ellipsis: true },
    {
      title: '类型', dataIndex: 'order_type', key: 'order_type',
      render: (t: string) => <Tag>{t === 'ticket' ? '门票' : '路线'}</Tag>,
    },
    {
      title: '金额', dataIndex: 'pay_amount', key: 'pay_amount',
      render: (v: number) => <Text type="danger">¥{Number(v).toFixed(2)}</Text>,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (s: number) => <Tag color={statusMap[s]?.color}>{statusMap[s]?.label || '未知'}</Tag>,
    },
    {
      title: '下单时间', dataIndex: 'created_at', key: 'created_at',
      render: (v: string) => new Date(v).toLocaleString('zh-CN'),
    },
    {
      title: '操作', key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small" onClick={() => navigate(`/travel/orders/${record.id}`)}>详情</Button>
          {record.status === 0 && (
            <Popconfirm title="确定取消此订单？" onConfirm={() => handleCancel(record.id)}>
              <Button type="link" size="small" danger>取消</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Title level={3}>我的旅游订单</Title>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>
      ) : orders.length === 0 ? (
        <Empty description="暂无旅游订单" />
      ) : (
        <Table dataSource={orders} columns={columns} rowKey="id" pagination={false} />
      )}
    </div>
  );
}
