import { useState, useEffect } from 'react';
import { Typography, Button, Table, Tag, Space, Modal, Form, Input, InputNumber, Select, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '@/api';

const { Title } = Typography;

export default function TransportGuideManage() {
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<any>(null);
  const [form] = Form.useForm();

  const loadGuides = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/travel/transport-guides');
      if (res.data.code === 0) setGuides(res.data.data);
    } catch (err) {
      message.error('加载交通攻略失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGuides(); }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingGuide) {
        await api.put(`/admin/travel/transport-guides/${editingGuide.id}`, values);
        message.success('已更新');
      } else {
        await api.post('/admin/travel/transport-guides', values);
        message.success('已创建');
      }
      setModalOpen(false); form.resetFields(); setEditingGuide(null);
      loadGuides();
    } catch (err: any) {
      message.error(err.response?.data?.message || '保存失败');
    }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/admin/travel/transport-guides/${id}`);
    message.success('已下架');
    loadGuides();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '标题', dataIndex: 'title', ellipsis: true },
    {
      title: '路线', key: 'route',
      render: (_: any, r: any) => <span>{r.departure} → {r.destination}</span>,
    },
    { title: '方式', dataIndex: 'transport_mode', render: (v: string) => <Tag>{v}</Tag> },
    { title: '耗时(h)', dataIndex: 'duration', width: 80 },
    { title: '费用', dataIndex: 'cost', render: (v: number) => v ? <span style={{ color: '#ff4d4f' }}>¥{v}</span> : '-' },
    {
      title: '状态', dataIndex: 'status',
      render: (s: number) => <Tag color={s === 1 ? 'green' : 'default'}>{s === 1 ? '显示' : '隐藏'}</Tag>,
    },
    {
      title: '操作', width: 150,
      render: (_: any, r: any) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}
            onClick={() => { setEditingGuide(r); form.setFieldsValue(r); setModalOpen(true); }}>编辑</Button>
          <Popconfirm title="确定下架？" onConfirm={() => handleDelete(r.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>下架</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4}>交通攻略管理</Title>
        <Button type="primary" icon={<PlusOutlined />}
          onClick={() => { setEditingGuide(null); form.resetFields(); setModalOpen(true); }}>新增攻略</Button>
      </div>
      <Table dataSource={guides} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      <Modal
        title={editingGuide ? '编辑交通攻略' : '新增交通攻略'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditingGuide(null); form.resetFields(); }}
        onOk={handleSave} width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="标题" name="title" rules={[{ required: true }]}><Input /></Form.Item>
          <Space size="middle">
            <Form.Item label="出发地" name="departure" rules={[{ required: true }]}><Input style={{ width: 160 }} /></Form.Item>
            <Form.Item label="目的地" name="destination" rules={[{ required: true }]}><Input style={{ width: 160 }} /></Form.Item>
          </Space>
          <Space size="middle">
            <Form.Item label="交通方式" name="transport_mode" rules={[{ required: true }]}>
              <Select style={{ width: 160 }}
                options={['大巴', '中巴', '高铁+中巴', '自驾', '火车', '飞机', '高铁', '拼车'].map(v => ({ label: v, value: v }))} />
            </Form.Item>
            <Form.Item label="耗时(小时)" name="duration"><InputNumber min={0} step={0.5} style={{ width: 160 }} /></Form.Item>
            <Form.Item label="费用(元)" name="cost"><InputNumber min={0} style={{ width: 160 }} /></Form.Item>
          </Space>
          <Form.Item label="详细说明" name="detail"><Input.TextArea rows={4} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
