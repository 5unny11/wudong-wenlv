import { Routes, Route, Navigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import AdminTravel from './pages/travel';
import LoginPage from './pages/Login';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
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
        extra={<Button type="primary" onClick={() => { localStorage.clear(); window.location.reload(); }}>重新登录</Button>}
      />
    );
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/travel" element={<RequireAuth><AdminTravel /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/travel" replace />} />
    </Routes>
  );
}
