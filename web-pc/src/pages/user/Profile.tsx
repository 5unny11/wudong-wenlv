import { useState, useEffect } from 'react';
import { Tabs, Card, Avatar, Typography, Button, Tag, Empty, Spin, Table, Row, Col, Statistic, Input, message, Space } from 'antd';
import { UserOutlined, CrownOutlined, OrderedListOutlined, EditOutlined } from '@ant-design/icons';
import { useUserStore } from '@/store/user';
import { useNavigate } from 'react-router-dom';
import { travelAPI } from '@/api';
import api from '@/api';

export default function ProfilePage() {
  const { user, logout, setUser } = useUserStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminStats, setAdminStats] = useState<any>({});
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const isAdmin = user?.is_merchant === 1;

  useEffect(() => {
    if (!sessionStorage.getItem('token')) { navigate('/login'); return; }
    loadOrders();
    if (isAdmin) loadAdminStats();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await travelAPI.listMyTravelOrders();
      if (res.code === 0) setOrders(res.data);
    } catch (err) {
    } finally { setLoading(false); }
  };

  const loadAdminStats = async () => {
    try {
      const res = await api.get('/admin/travel/stats');
      if (res.data.code === 0) {
        setAdminStats({
          totalOrders: res.data.data.orders || 0,
          scenicSpots: res.data.data.spots || 0,
          routes: res.data.data.routes || 0,
        });
      }
    } catch (err) { }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const startEditName = () => { setNewName(user?.nickname || ''); setEditingName(true); };
  const saveName = async () => {
    if (!newName.trim()) { message.warning('昵称不能为空'); return; }
    try {
      const res = await api.put('/user/profile', { nickname: newName.trim() });
      if (res.data.code === 0) {
        setUser({ ...user, nickname: newName.trim() });
        message.success('昵称已更新');
        setEditingName(false);
      } else {
        message.error(res.data.message);
      }
    } catch (err) { message.error('修改失败'); }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '24px auto', padding: '0 24px' }}>
      {/* 个人信息卡片 */}
      <Card style={{ marginBottom: 24, borderRadius: 12, borderTop: isAdmin ? '3px solid #D4A14B' : undefined }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar size={64} icon={isAdmin ? <CrownOutlined /> : <UserOutlined />}
            style={{ background: isAdmin ? '#D4A14B' : undefined }} />
          <div>
            {editingName ? (
              <Space style={{ marginBottom: 4 }}>
                <Input size="small" value={newName} onChange={e => setNewName(e.target.value)} onPressEnter={saveName} style={{ width: 160 }} />
                <Button size="small" type="primary" onClick={saveName}>保存</Button>
                <Button size="small" onClick={() => setEditingName(false)}>取消</Button>
              </Space>
            ) : (
              <Typography.Title level={4} style={{ margin: 0 }}>
                {user?.nickname || '游客'}
                <Button type="link" size="small" icon={<EditOutlined />} onClick={startEditName} style={{ marginLeft: 8, fontSize: 14 }} />
                {isAdmin && <Tag color="blue" style={{ marginLeft: 4, verticalAlign: 'middle' }}>管理员</Tag>}
              </Typography.Title>
            )}
            <Typography.Text type="secondary">{user?.phone || ''}</Typography.Text>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            {isAdmin && <Button type="link" icon={<CrownOutlined />} onClick={() => navigate('/admin/travel')} style={{ marginRight: 8 }}>进入管理后台</Button>}
            <Button onClick={handleLogout} danger>退出登录</Button>
          </div>
        </div>
      </Card>

      {/* 管理员数据面板 */}
      {isAdmin && (
        <Card title="平台概览" style={{ marginBottom: 24, borderRadius: 12 }}>
          <Row gutter={24}>
            <Col span={8}><Statistic title="全平台订单" value={adminStats.totalOrders || 0} suffix="笔" /></Col>
            <Col span={8}><Statistic title="景区数量" value={adminStats.scenicSpots || 0} suffix="个" /></Col>
            <Col span={8}><Statistic title="路线套餐" value={adminStats.routes || 0} suffix="条" /></Col>
          </Row>
        </Card>
      )}

      {/* 订单列表 */}
      <Card title="我的订单" style={{ borderRadius: 12 }}>
        {loading ? <Spin><div style={{ padding: 40 }} /></Spin> :
          orders.length === 0 ? <Empty description="暂无订单"><Button type="primary" onClick={() => navigate('/travel')}>去选购</Button></Empty> :
            <Table dataSource={orders} rowKey="id" pagination={{ pageSize: 10 }} size="small"
              columns={[
                { title: '订单号', dataIndex: 'order_no', ellipsis: true },
                { title: '类型', dataIndex: 'order_type', render: (t: string) => <Tag>{t === 'ticket' ? '门票' : '路线'}</Tag> },
                { title: '金额', dataIndex: 'pay_amount', render: (v: number) => <span style={{ color: '#E85D2F', fontWeight: 600 }}>¥{Number(v).toFixed(2)}</span> },
                { title: '状态', dataIndex: 'status', render: (s: number) => {
                  const m: Record<number, any> = { 0: { l: '待支付', c: 'orange' }, 1: { l: '已支付', c: 'blue' }, 3: { l: '已完成', c: 'green' }, 4: { l: '已取消', c: 'default' } };
                  return <Tag color={m[s]?.c}>{m[s]?.l}</Tag>;
                }},
                { title: '时间', dataIndex: 'created_at', render: (v: string) => new Date(v).toLocaleString('zh-CN') },
                { title: '', render: (_: any, r: any) => <Button type="link" size="small" onClick={() => navigate(`/travel/orders/${r.id}`)}>详情</Button> },
              ]}
            />
        }
      </Card>
    </div>
  );
}
