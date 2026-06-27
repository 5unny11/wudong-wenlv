 import { Form, Input, Button, Card, Typography, message } from 'antd';
 import { PhoneOutlined, LockOutlined } from '@ant-design/icons';
 import { useNavigate, Link } from 'react-router-dom';
 import { authAPI } from '@/api';
 
 export default function RegisterPage() {
   const navigate = useNavigate();
   const onFinish = async (values: { phone: string; password: string }) => {
     const res = await authAPI.register(values.phone, values.password);
     if (res.code === 0) {
       message.success('注册成功，请登录');
       navigate('/login');
     } else {
       message.error(res.message);
     }
   };
   return (
     <div style={{ maxWidth: 400, margin: '60px auto', padding: 24 }}>
       <Card>
         <Typography.Title level={3} style={{ textAlign: 'center' }}>注册</Typography.Title>
         <Form onFinish={onFinish} layout="vertical">
           <Form.Item name="phone" rules={[{ required: true }, { pattern: /^1\d{10}$/, message: '手机号格式不正确' }]}>
             <Input prefix={<PhoneOutlined />} placeholder="手机号" size="large" />
           </Form.Item>
           <Form.Item name="password" rules={[{ required: true, min: 6, message: '密码至少6位' }]}>
             <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
           </Form.Item>
           <Button type="primary" htmlType="submit" block size="large">注册</Button>
           <div style={{ textAlign: 'center', marginTop: 16 }}>
             已有账号？<Link to="/login">去登录</Link>
           </div>
         </Form>
       </Card>
     </div>
   );
 }
