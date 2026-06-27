import { useState, useEffect } from 'react';
import { Card, Typography, Button, Table, Tag, Space, Modal, Form, Input, InputNumber, Select, message, Popconfirm, List } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '@/api';

const { Title } = Typography;

export default function RouteManage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const [currentRouteId, setCurrentRouteId] = useState<number>(0);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [form] = Form.useForm();
  const [scheduleForm] = Form.useForm();

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/travel/routes');
      if (res.data.code === 0) setRoutes(res.data.data);
    } catch (err) {
      message.error('加载路线列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRoutes(); }, []);

  const handleSaveRoute = async () => {
    try {
      const values = await form.validateFields();
      if (editingRoute) {
        await api.put(`/admin/travel/routes/${editingRoute.id}`, values);
        message.success('路线已更新');
      } else {
        await api.post('/admin/travel/routes', { ...values, merchant_id: 1 });
        message.success('路线已创建');
      }
      setModalOpen(false);
      form.resetFields();
      setEditingRoute(null);
      loadRoutes();
    } catch (err: any) {
      message.error(err.response?.data?.message || '保存失败');
    }
  };

  const handleDeleteRoute = async (id: number) => {
    try {
      await api.delete(`/admin/travel/routes/${id}`);
      message.success('已下架');
      loadRoutes();
    } catch (err) {
      message.error('操作失败');
    }
  };

  const openScheduleModal = async (route: any) => {
    setCurrentRouteId(route.id);
    setSchedules(route.schedules || []);
    setScheduleModalOpen(true);
  };

  const handleSaveSchedule = async () => {
    try {
      const values = await scheduleForm.validateFields();
      if (editingSchedule) {
        await api.put(`/admin/travel/route-schedules/${editingSchedule.id}`, values);
        message.success('行程已更新');
      } else {
        await api.post('/admin/travel/route-schedules', { ...values, route_id: currentRouteId });
        message.success('行程已添加');
      }
      scheduleForm.resetFields();
      setEditingSchedule(null);
      // 重新加载路线列表刷新 schedules
      loadRoutes();
    } catch (err: any) {
      message.error(err.response?.data?.message || '保存失败');
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    try {
      await api.delete(`/admin/travel/route-schedules/${id}`);
      message.success('行程已删除');
      loadRoutes();
    } catch (err) {
      message.error('操作失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '路线名称', dataIndex: 'title', ellipsis: true },
    {
      title: '类型', dataIndex: 'duration',
      render: (d: string) => <Tag>{d === 'one_day' ? '一日游' : d === 'two_day' ? '两日游' : '多日游'}</Tag>,
    },
    { title: '价格', dataIndex: 'price', render: (v: number) => <span style={{ color: '#ff4d4f', fontWeight: 600 }}>¥{v}</span> },
    { title: '出发地', dataIndex: 'start_city' },
    {
      title: '状态', dataIndex: 'status',
      render: (s: number) => <Tag color={s === 1 ? 'green' : 'default'}>{s === 1 ? '已上架' : '已下架'}</Tag>,
    },
    {
      title: '操作', width: 220,
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}
            onClick={() => { setEditingRoute(record); form.setFieldsValue(record); setModalOpen(true); }}>
            编辑
          </Button>
          <Button type="link" size="small" onClick={() => openScheduleModal(record)}>行程</Button>
          <Popconfirm title="确定下架此路线？" onConfirm={() => handleDeleteRoute(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>下架</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4}>路线套餐管理</Title>
        <Button type="primary" icon={<PlusOutlined />}
          onClick={() => { setEditingRoute(null); form.resetFields(); setModalOpen(true); }}>
          新增路线
        </Button>
      </div>

      <Table dataSource={routes} columns={columns} rowKey="id" loading={loading}
        pagination={{ pageSize: 10 }} />

      {/* 路线 Modal */}
      <Modal
        title={editingRoute ? '编辑路线' : '新增路线'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditingRoute(null); form.resetFields(); }}
        onOk={handleSaveRoute}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="路线名称" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Space size="middle">
            <Form.Item label="类型" name="duration" rules={[{ required: true }]}>
              <Select style={{ width: 140 }}
                options={[{ label: '一日游', value: 'one_day' }, { label: '两日游', value: 'two_day' }, { label: '多日游', value: 'multi_day' }]} />
            </Form.Item>
            <Form.Item label="价格（元/人）" name="price" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: 160 }} prefix="¥" />
            </Form.Item>
          </Space>
          <Space size="middle">
            <Form.Item label="出发城市" name="start_city"><Input style={{ width: 160 }} /></Form.Item>
            <Form.Item label="目的城市" name="dest_city"><Input style={{ width: 160 }} /></Form.Item>
          </Space>
          <Form.Item label="包含项目" name="includes"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item label="行程概述" name="schedule"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item label="注意事项" name="notice"><Input.TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>

      {/* 行程管理 Modal */}
      <Modal
        title="行程管理"
        open={scheduleModalOpen}
        onCancel={() => { setScheduleModalOpen(false); setEditingSchedule(null); scheduleForm.resetFields(); }}
        footer={null}
        width={700}
      >
        <List
          dataSource={schedules}
          locale={{ emptyText: '暂无行程安排' }}
          renderItem={(s: any) => (
            <List.Item
              actions={[
                <Button type="link" size="small" onClick={() => { setEditingSchedule(s); scheduleForm.setFieldsValue(s); }}>
                  编辑
                </Button>,
                <Popconfirm title="确定删除？" onConfirm={() => handleDeleteSchedule(s.id)}>
                  <Button type="link" size="small" danger>删除</Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={<Tag color="blue">第{s.day_number}天</Tag>}
                description={s.description}
              />
            </List.Item>
          )}
        />
        <div style={{ marginTop: 16, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
          <Title level={5}>{editingSchedule ? '编辑行程' : '新增行程'}</Title>
          <Form form={scheduleForm} layout="vertical">
            <Form.Item label="第几天" name="day_number" rules={[{ required: true }]}>
              <InputNumber min={1} max={30} style={{ width: 100 }} />
            </Form.Item>
            <Form.Item label="行程描述" name="description" rules={[{ required: true }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
            <Space size="middle">
              <Form.Item label="景点" name="attractions"><Input style={{ width: 200 }} /></Form.Item>
              <Form.Item label="用餐" name="meals"><Input style={{ width: 150 }} /></Form.Item>
              <Form.Item label="住宿" name="accommodation"><Input style={{ width: 150 }} /></Form.Item>
              <Form.Item label="交通" name="transport"><Input style={{ width: 150 }} /></Form.Item>
            </Space>
            <Form.Item>
              <Button type="primary" onClick={handleSaveSchedule}>
                {editingSchedule ? '更新' : '添加'}
              </Button>
              {editingSchedule && (
                <Button style={{ marginLeft: 8 }} onClick={() => { setEditingSchedule(null); scheduleForm.resetFields(); }}>
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
