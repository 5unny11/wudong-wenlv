 import React from 'react';
 import { Layout, Menu, Input, Button, Badge, Space } from 'antd';
 import { useNavigate, useLocation } from 'react-router-dom';
 import {
   HomeOutlined, ShoppingCartOutlined, UserOutlined,
   SkinOutlined, CoffeeOutlined, HomeFilled,
   CarOutlined, PictureOutlined,
 } from '@ant-design/icons';
 
 const { Header, Content, Footer } = Layout;
 
 const menuItems = [
   { key: '/', icon: <HomeOutlined />, label: '首页' },
   { key: '/products', icon: <SkinOutlined />, label: '非遗' },
   { key: '/restaurants', icon: <CoffeeOutlined />, label: '美食' },
   { key: '/homestays', icon: <HomeFilled />, label: '住宿' },
   { key: '/travel', icon: <CarOutlined />, label: '出行' },
   { key: '/community', icon: <PictureOutlined />, label: '社区' },
 ];
 
 export default function MainLayout({ children }: { children: React.ReactNode }) {
   const navigate = useNavigate();
   const location = useLocation();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.is_merchant === 1;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 40px', background: '#fff', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#1677ff', marginRight: 40, cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => navigate('/')}>
          乌东文旅
        </div>
        <Menu mode="horizontal" selectedKeys={[location.pathname]} items={menuItems} onClick={({ key }) => navigate(key)} style={{ flex: 1, border: 'none' }} />
        <Space size="middle">
          <Badge count={0} size="small"><ShoppingCartOutlined style={{ fontSize: 18, cursor: 'pointer' }} onClick={() => navigate('/cart')} /></Badge>
          {token ? (
            <Space>
              <Button type="text" onClick={() => navigate('/travel/orders')}>我的订单</Button>
              {isAdmin && <Button type="text" onClick={() => navigate('/admin/travel')}>管理后台</Button>}
              <Button type="text" icon={<UserOutlined />} onClick={() => navigate('/profile')}>个人中心</Button>
            </Space>
          ) : (
            <Button type="primary" onClick={() => navigate('/login')}>登录</Button>
          )}
        </Space>
      </Header>
       <Content style={{ minHeight: 'calc(100vh - 134px)' }}>
         {children}
       </Content>
       <Footer style={{ textAlign: 'center', color: '#999', background: '#fafafa' }}>
         乌东文旅 &copy; {new Date().getFullYear()} — 贵州黔东南苗族侗族自治州·乌东村
       </Footer>
     </Layout>
   );
 }
