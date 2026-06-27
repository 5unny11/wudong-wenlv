import React from 'react';
import { Layout, Button, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, CompassOutlined } from '@ant-design/icons';
import { useUserStore } from '@/store/user';

const { Header, Content, Footer } = Layout;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { user, token } = useUserStore();
  const isAdmin = user?.is_merchant === 1;

  return (
    <Layout style={{ minHeight: '100vh', background: '#F7F8FA' }}>
      <Header style={{
        display: 'flex', alignItems: 'center', padding: '0 40px',
        background: '#fff', borderBottom: '1px solid #f0f0f0',
        position: 'sticky', top: 0, zIndex: 100,
        height: 56,
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#1F5FA8', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={() => navigate('/travel')}>
          <CompassOutlined style={{ fontSize: 22 }} />
          乌东文旅 · 线路订票
        </div>
        <div style={{ flex: 1 }} />
        <Space size="small">
          {token ? (
            <>
              <Button type="text" onClick={() => navigate('/travel/orders')}>我的订单</Button>
              {isAdmin && <Button type="text" onClick={() => navigate('/admin/travel')}>管理后台</Button>}
              <Button type="text" icon={<UserOutlined />} onClick={() => navigate('/profile')}>
                {user?.nickname || '个人中心'}
                {isAdmin && <Tag color="blue" style={{ marginLeft: 4, fontSize: 11, lineHeight: '18px' }}>管理员</Tag>}
              </Button>
            </>
          ) : (
            <Button type="primary" onClick={() => navigate('/login')}>登录 / 注册</Button>
          )}
        </Space>
      </Header>
      <Content style={{ minHeight: 'calc(100vh - 120px)' }}>
        {children}
      </Content>
      <Footer style={{ textAlign: 'center', color: '#8C8C8C', background: 'transparent', fontSize: 13 }}>
        乌东文旅 &copy; {new Date().getFullYear()} — 贵州黔东南苗族侗族自治州 · 乌东村
      </Footer>
    </Layout>
  );
}
