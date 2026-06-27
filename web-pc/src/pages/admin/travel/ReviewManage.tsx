import { useState, useEffect } from 'react';
import { Typography, Table, Tag, Select, Button, Modal, Descriptions, Popconfirm, message, Space, Rate } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import api from '@/api';

const { Title } = Typography;

const targetTypeMap: Record<string, string> = { scenic_spot: '景区', tour_route: '路线' };

export default function ReviewManage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [detailOpen, setDetailOpen] = useState(false);
  const [current, setCurrent] = useState<any>(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const params: any = { page, pageSize: 20 };
      if (typeFilter) params.targetType = typeFilter;
      const res = await api.get('/admin/travel/reviews', { params });
      if (res.data.code === 0) { setReviews(res.data.data.list); setTotal(res.data.data.total); }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, [page, typeFilter]);

  const handleDelete = async (id: number) => {
    await api.delete(`/admin/travel/reviews/${id}`);
    message.success('已删除');
    loadReviews();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    {
      title: '类型', dataIndex: 'target_type',
      render: (t: string) => <Tag>{targetTypeMap[t] || t}</Tag>,
    },
    { title: '目标ID', dataIndex: 'target_id', width: 80 },
    { title: '用户ID', dataIndex: 'user_id', width: 80 },
    {
      title: '评分', dataIndex: 'rating',
      render: (v: number) => <Rate disabled value={v} style={{ fontSize: 14 }} />,
    },
    { title: '内容', dataIndex: 'content', ellipsis: true, width: 200 },
    {
      title: '时间', dataIndex: 'created_at',
      render: (v: string) => new Date(v).toLocaleString('zh-CN'),
    },
    {
      title: '操作', width: 120,
      render: (_: any, r: any) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}
            onClick={() => { setCurrent(r); setDetailOpen(true); }}>详情</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4}>评价管理</Title>
        <Select style={{ width: 130 }} placeholder="筛选类型" allowClear
          onChange={v => { setTypeFilter(v); setPage(1); }}
          options={[{ label: '景区', value: 'scenic_spot' }, { label: '路线', value: 'tour_route' }]} />
      </div>
      <Table dataSource={reviews} columns={columns} rowKey="id" loading={loading}
        pagination={{ current: page, total, pageSize: 20, onChange: p => setPage(p), showTotal: t => `共 ${t} 条` }} />
      <Modal title="评价详情" open={detailOpen} onCancel={() => setDetailOpen(false)} footer={null} width={500}>
        {current && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="ID">{current.id}</Descriptions.Item>
            <Descriptions.Item label="类型">
              <Tag>{targetTypeMap[current.target_type] || current.target_type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="目标ID">{current.target_id}</Descriptions.Item>
            <Descriptions.Item label="用户ID">{current.user_id}</Descriptions.Item>
            <Descriptions.Item label="评分"><Rate disabled value={current.rating} /></Descriptions.Item>
            <Descriptions.Item label="内容">{current.content || '（无文字）'}</Descriptions.Item>
            {current.images?.length > 0 && (
              <Descriptions.Item label="图片">{current.images.length} 张</Descriptions.Item>
            )}
            <Descriptions.Item label="时间">{new Date(current.created_at).toLocaleString('zh-CN')}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
