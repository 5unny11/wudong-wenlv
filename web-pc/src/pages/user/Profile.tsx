 import { Tabs, Card, Avatar, Typography, Button, List } from 'antd';
 import { UserOutlined } from '@ant-design/icons';
 import { useUserStore } from '@/store/user';
 import { useNavigate } from 'react-router-dom';
 
 export default function ProfilePage() {
   const { user, logout } = useUserStore();
   const navigate = useNavigate();
 
   const handleLogout = () => { logout(); navigate('/'); };
 
   if (!localStorage.getItem('token')) {
     navigate('/login');
     return null;
   }
 
   return (
     <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 24px' }}>
       <Card style={{ marginBottom: 24 }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
           <Avatar size={64} icon={<UserOutlined />} />
           <div>
             <Typography.Title level={4} style={{ margin: 0 }}>{user?.nickname || '游客'}</Typography.Title>
             <Typography.Text type="secondary">{user?.phone || ''}</Typography.Text>
           </div>
           <div style={{ marginLeft: 'auto' }}>
             <Button onClick={handleLogout} danger>退出登录</Button>
           </div>
         </div>
       </Card>
       <Tabs items={[
         { key: 'orders', label: '我的订单', children: <Typography.Text type="secondary">暂无订单</Typography.Text> },
         { key: 'favorites', label: '我的收藏', children: <Typography.Text type="secondary">暂无收藏</Typography.Text> },
         { key: 'reviews', label: '我的评价', children: <Typography.Text type="secondary">暂无评价</Typography.Text> },
       ]} />
     </div>
   );
 }
