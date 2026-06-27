import { Form, Input, Button, Card, Typography, message } from 'antd';
import { PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '@/api';
import { useUserStore } from '@/store/user';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setToken, setUser } = useUserStore();

  const onFinish = async (values: { phone: string; password: string }) => {
    const res = await authAPI.login(values.phone, values.password);
    if (res.code === 0) {
      setToken(res.data.token);
      setUser(res.data.user);
      message.success('登录成功');
      navigate('/');
    } else {
      message.error(res.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 24 }}>
      <Card>
        <Typography.Title level={3} style={{ textAlign: 'center' }}>登录</Typography.Title>
        <Form onFinish={onFinish} layout="vertical" autoComplete="off">
          <Form.Item name="phone" rules={[{ required: true, message: '请输入手机号' }, { pattern: /^1\d{10}$/, message: '手机号格式不正确' }]}>
            <Input prefix={<PhoneOutlined />} placeholder="手机号" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">登录</Button>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            还没有账号？<Link to="/register">立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
