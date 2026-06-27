import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Result, Button, Layout } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { CompassOutlined } from '@ant-design/icons';
import AdminTravel from './pages/travel';
import LoginPage from './pages/Login';
import { theme } from './theme';

const { Header, Content, Footer } = Layout;

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = sessionStorage.getItem('token');
  const userStr = sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.is_merchant === 1;

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    return (
      <Result
        status="403"
        title="无权限"
        subTitle="仅管理员可访问管理后台"
        extra={<Button type="primary" onClick={() => { sessionStorage.clear(); window.location.reload(); }}>重新登录</Button>}
      />
    );
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <ConfigProvider theme={theme} locale={zhCN}>
      <Layout style={{ minHeight: '100vh', background: '#F7F8FA' }}>
        <Header style={{
          display: 'flex', alignItems: 'center', padding: '0 32px',
          background: '#1F5FA8', height: 52,
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CompassOutlined style={{ fontSize: 20 }} />
            乌东文旅 · 管理后台
          </div>
          <div style={{ flex: 1 }} />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>第四组 · 线路订票</span>
        </Header>
        <Content style={{ padding: 24 }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/travel" element={<RequireAuth><AdminTravel /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/travel" replace />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center', color: '#8C8C8C', fontSize: 12, background: 'transparent' }}>
          乌东文旅管理后台 &copy; {new Date().getFullYear()}
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}
