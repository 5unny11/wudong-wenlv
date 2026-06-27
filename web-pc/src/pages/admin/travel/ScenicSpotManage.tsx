import { useState, useEffect } from 'react';
import { Card, Typography, Button, Table, Tag, Space, Modal, Form, Input, InputNumber, message, Popconfirm, List } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '@/api';

const { Title } = Typography;

export default function ScenicSpotManage() {
  const [spots, setSpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<any>(null);
  const [currentSpotId, setCurrentSpotId] = useState<number>(0);
  const [tickets, setTickets] = useState<any[]>([]);
  const [editingTicket, setEditingTicket] = useState<any>(null);
  const [form] = Form.useForm();
  const [ticketForm] = Form.useForm();

  const loadSpots = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/travel/scenic-spots');
      if (res.data.code === 0) setSpots(res.data.data);
    } catch (err) {
      message.error('加载景区列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSpots(); }, []);

  const handleSaveSpot = async () => {
    try {
      const values = await form.validateFields();
      if (editingSpot) {
        await api.put(`/admin/travel/scenic-spots/${editingSpot.id}`, values);
        message.success('景区已更新');
      } else {
        await api.post('/admin/travel/scenic-spots', values);
        message.success('景区已创建');
      }
      setModalOpen(false);
      form.resetFields();
      setEditingSpot(null);
      loadSpots();
    } catch (err: any) {
      message.error(err.response?.data?.message || '保存失败');
    }
  };

  const handleDeleteSpot = async (id: number) => {
    try {
      await api.delete(`/admin/travel/scenic-spots/${id}`);
      message.success('已下架');
      loadSpots();
    } catch (err) {
      message.error('操作失败');
    }
  };

  const openTicketModal = async (spotId: number) => {
    setCurrentSpotId(spotId);
    try {
      const res = await api.get(`/admin/travel/scenic-spots`);
      const spot = res.data.data.find((s: any) => s.id === spotId);
      setTickets(spot?.tickets || []);
    } catch (err) {
      setTickets([]);
    }
    setTicketModalOpen(true);
  };

  const handleSaveTicket = async () => {
    try {
      const values = await ticketForm.validateFields();
      if (editingTicket) {
        await api.put(`/admin/travel/ticket-types/${editingTicket.id}`, values);
        message.success('票种已更新');
      } else {
        await api.post('/admin/travel/ticket-types', { ...values, scenic_spot_id: currentSpotId });
        message.success('票种已创建');
      }
      setTicketModalOpen(false);
      ticketForm.resetFields();
      setEditingTicket(null);
      loadSpots();
    } catch (err: any) {
      message.error(err.response?.data?.message || '保存失败');
    }
  };

  const handleDeleteTicket = async (id: number) => {
    try {
      await api.delete(`/admin/travel/ticket-types/${id}`);
      message.success('票种已删除');
      loadSpots();
    } catch (err) {
      message.error('操作失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '景区名称', dataIndex: 'name' },
    { title: '地址', dataIndex: 'address', ellipsis: true },
    { title: '开放时间', dataIndex: 'open_time' },
    {
      title: '票种', key: 'tickets',
      render: (_: any, r: any) => r.tickets?.map((t: any) => (
        <Tag key={t.id} style={{ marginBottom: 2 }}>{t.name} ¥{t.price}</Tag>
      )),
    },
    {
      title: '状态', dataIndex: 'status',
      render: (s: number) => <Tag color={s === 1 ? 'green' : 'default'}>{s === 1 ? '已上架' : '已下架'}</Tag>,
    },
    {
      title: '操作', width: 220,
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}
            onClick={() => { setEditingSpot(record); form.setFieldsValue(record); setModalOpen(true); }}>
            编辑
          </Button>
          <Button type="link" size="small" onClick={() => openTicketModal(record.id)}>票种</Button>
          <Popconfirm title="确定下架此景区？" onConfirm={() => handleDeleteSpot(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>下架</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4}>景区管理</Title>
        <Button type="primary" icon={<PlusOutlined />}
          onClick={() => { setEditingSpot(null); form.resetFields(); setModalOpen(true); }}>
          新增景区
        </Button>
      </div>

      <Table dataSource={spots} columns={columns} rowKey="id" loading={loading}
        pagination={{ pageSize: 10 }} />

      {/* 景区 Modal */}
      <Modal
        title={editingSpot ? '编辑景区' : '新增景区'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditingSpot(null); form.resetFields(); }}
        onOk={handleSaveSpot}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="景区名称" name="name" rules={[{ required: true, message: '请输入景区名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="地址" name="address"><Input /></Form.Item>
          <Form.Item label="开放时间" name="open_time"><Input placeholder="如 08:00-18:00" /></Form.Item>
          <Form.Item label="景区介绍" name="intro"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item label="封面图片URL" name="main_image"><Input placeholder="选填" /></Form.Item>
        </Form>
      </Modal>

      {/* 票种 Modal */}
      <Modal
        title="票种管理"
        open={ticketModalOpen}
        onCancel={() => { setTicketModalOpen(false); setEditingTicket(null); ticketForm.resetFields(); }}
        footer={null}
        width={600}
      >
        <List
          dataSource={tickets}
          locale={{ emptyText: '暂无票种' }}
          renderItem={(t: any) => (
            <List.Item
              actions={[
                <Button type="link" size="small" onClick={() => { setEditingTicket(t); ticketForm.setFieldsValue(t); }}>
                  编辑
                </Button>,
                <Popconfirm title="确定删除此票种？" onConfirm={() => handleDeleteTicket(t.id)}>
                  <Button type="link" size="small" danger>删除</Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta title={t.name} description={`¥${t.price} / 库存${t.stock} / 有效期${t.valid_days || '-'}天`} />
            </List.Item>
          )}
        />
        <div style={{ marginTop: 16, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
          <Title level={5}>{editingTicket ? '编辑票种' : '新增票种'}</Title>
          <Form form={ticketForm} layout="inline" style={{ gap: 8 }}>
            <Form.Item label="名称" name="name" rules={[{ required: true }]}>
              <Input style={{ width: 120 }} />
            </Form.Item>
            <Form.Item label="价格" name="price" rules={[{ required: true }]}>
              <InputNumber min={0} prefix="¥" style={{ width: 100 }} />
            </Form.Item>
            <Form.Item label="库存" name="stock">
              <InputNumber min={0} style={{ width: 80 }} />
            </Form.Item>
            <Form.Item label="有效期(天)" name="valid_days">
              <InputNumber min={1} style={{ width: 80 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleSaveTicket}>{editingTicket ? '更新' : '添加'}</Button>
              {editingTicket && (
                <Button style={{ marginLeft: 8 }} onClick={() => { setEditingTicket(null); ticketForm.resetFields(); }}>
                  取消编辑
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
