import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '@/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { phone: string; password: string }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', values);
      if (res.data.code === 0) {
        const user = res.data.data.user;
        // 先校验管理员权限，再写入本地存储
        if (user.is_merchant !== 1) {
          message.error('无管理员权限，请联系平台管理员');
          setLoading(false);
          return;
        }
        sessionStorage.setItem('token', res.data.data.token);
        sessionStorage.setItem('user', JSON.stringify(user));
        message.success('登录成功');
        navigate('/travel');
      } else {
        message.error(res.data.message || '登录失败');
      }
    } catch (err) {
      message.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 400, textAlign: 'center' }}>
        <Typography.Title level={3}>乌东文旅·管理后台</Typography.Title>
        <Typography.Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>仅限管理员登录</Typography.Text>
        <Form onFinish={onFinish} layout="vertical" autoComplete="off">
          <Form.Item name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input prefix={<PhoneOutlined />} placeholder="手机号" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>登录</Button>
        </Form>
      </Card>
    </div>
  );
}
