import { useState, useEffect } from 'react';
import { Table, Tag, Typography, Select, Space, Button, Card, Modal, Descriptions } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import api from '@/api';

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

export default function OrderManage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params: any = { page, pageSize: 20 };
      if (statusFilter !== undefined) params.status = statusFilter;
      const res = await api.get('/admin/travel/orders', { params });
      if (res.data.code === 0) {
        setOrders(res.data.data.list);
        setTotal(res.data.data.total);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [page, statusFilter]);

  const handleViewDetail = async (orderId: number) => {
    try {
      const res = await api.get(`/admin/travel/orders/${orderId}`);
      if (res.data.code === 0) {
        setCurrentOrder(res.data.data);
        setDetailOpen(true);
      }
    } catch (err) {
    }
  };

  const columns = [
    { title: '订单号', dataIndex: 'order_no', ellipsis: true },
    { title: '用户ID', dataIndex: 'user_id', width: 80 },
    {
      title: '类型', dataIndex: 'order_type',
      render: (t: string) => <Tag>{t === 'ticket' ? '门票' : '路线'}</Tag>,
    },
    {
      title: '金额', dataIndex: 'pay_amount',
      render: (v: number) => <Text type="danger" strong>¥{Number(v).toFixed(2)}</Text>,
    },
    {
      title: '状态', dataIndex: 'status',
      render: (s: number) => <Tag color={statusMap[s]?.color}>{statusMap[s]?.label || '未知'}</Tag>,
    },
    {
      title: '下单时间', dataIndex: 'created_at',
      render: (v: string) => new Date(v).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      render: (_: any, record: any) => (
        <Button type="link" size="small" icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record.id)}>
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4}>订单管理</Title>
        <Select
          style={{ width: 150 }}
          placeholder="筛选状态"
          allowClear
          onChange={v => { setStatusFilter(v); setPage(1); }}
          options={[
            { label: '待支付', value: 0 },
            { label: '已支付', value: 1 },
            { label: '已完成', value: 3 },
            { label: '已取消', value: 4 },
          ]}
        />
      </div>

      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: page,
          total,
          pageSize: 20,
          onChange: p => setPage(p),
          showTotal: t => `共 ${t} 条`,
        }}
      />

      {/* 订单详情 Modal */}
      <Modal
        title="订单详情"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        width={600}
      >
        {currentOrder && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="订单号">{currentOrder.order_no}</Descriptions.Item>
            <Descriptions.Item label="类型">
              <Tag>{currentOrder.order_type === 'ticket' ? '门票' : '路线'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="金额">¥{Number(currentOrder.total_amount).toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="实付">¥{Number(currentOrder.pay_amount).toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="状态" span={2}>
              <Tag color={statusMap[currentOrder.status]?.color}>
                {statusMap[currentOrder.status]?.label || '未知'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="下单时间" span={2}>
              {new Date(currentOrder.created_at).toLocaleString('zh-CN')}
            </Descriptions.Item>
            {currentOrder.remark && (
              <Descriptions.Item label="备注" span={2}>{currentOrder.remark}</Descriptions.Item>
            )}
            <Descriptions.Item label="电子票数" span={2}>
              {currentOrder.tickets?.length || 0} 张
            </Descriptions.Item>
          </Descriptions>
        )}
        {currentOrder?.tickets?.length > 0 && (
          <>
            <Title level={5} style={{ marginTop: 16 }}>电子票列表</Title>
            <Table
              dataSource={currentOrder.tickets}
              rowKey="id"
              size="small"
              pagination={false}
              columns={[
                { title: '票号', dataIndex: 'qr_code', ellipsis: true },
                { title: '有效期', render: (_: any, r: any) => `${r.valid_from} ~ ${r.valid_to}` },
                {
                  title: '状态', dataIndex: 'status',
                  render: (s: number) => (
                    <Tag color={s === 0 ? 'blue' : s === 1 ? 'green' : 'default'}>
                      {s === 0 ? '未使用' : s === 1 ? '已使用' : '已退款'}
                    </Tag>
                  ),
                },
              ]}
            />
          </>
        )}
      </Modal>
    </div>
  );
}
