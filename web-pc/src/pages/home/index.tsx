 import React from 'react';
 import { Carousel, Row, Col, Card, Typography, Space, Input, Button } from 'antd';
 import { useNavigate } from 'react-router-dom';
 import {
   SearchOutlined, EnvironmentOutlined,
   SkinOutlined, CoffeeOutlined, HomeFilled, CarOutlined,
 } from '@ant-design/icons';
 
 const { Title, Paragraph } = Typography;
 
 const categories = [
   { icon: <SkinOutlined />, title: '苗家非遗', desc: '银饰·蜡染·刺绣', path: '/products', color: '#1677ff' },
   { icon: <CoffeeOutlined />, title: '特色美食', desc: '长桌宴·农产品', path: '/restaurants', color: '#52c41a' },
   { icon: <HomeFilled />, title: '苗寨民宿', desc: '木楼·吊脚楼', path: '/homestays', color: '#fa8c16' },
   { icon: <CarOutlined />, title: '游玩路线', desc: '门票·一日游', path: '/travel', color: '#eb2f96' },
 ];
 
 const bgStyle: React.CSSProperties = {
   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
   color: '#fff',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   height: 420,
 };
 
 export default function HomePage() {
   const navigate = useNavigate();
   return (
     <div>
       {/* 全屏轮播 */}
       <Carousel autoplay>
         {[1, 2, 3].map(i => (
           <div key={i}>
             <div style={bgStyle}>
               <div style={{ textAlign: 'center' }}>
                 <Title level={1} style={{ color: '#fff', margin: 0 }}>乌东苗寨</Title>
                 <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, marginTop: 12 }}>
                   贵州黔东南 · 苗族文化体验之旅
                 </Paragraph>
                 <Space style={{ marginTop: 24 }}>
                   <Input prefix={<SearchOutlined />} placeholder="搜索非遗商品、民宿、路线..." style={{ width: 420, borderRadius: 4 }} size="large" />
                   <Button type="primary" size="large" ghost>搜索</Button>
                 </Space>
               </div>
             </div>
           </div>
         ))}
       </Carousel>
 
       {/* 功能入口 */}
       <div style={{ maxWidth: 1200, margin: '-30px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
         <Card style={{ borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
           <Row gutter={24} style={{ textAlign: 'center' }}>
             {categories.map(cat => (
               <Col span={6} key={cat.title}>
                 <div onClick={() => navigate(cat.path)} style={{ cursor: 'pointer', padding: '16px 0', borderRadius: 8, transition: 'all 0.3s' }}
                   onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f5f5f5'; }}
                   onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                   <div style={{ fontSize: 32, color: cat.color }}>{cat.icon}</div>
                   <div style={{ fontSize: 16, fontWeight: 600, marginTop: 8 }}>{cat.title}</div>
                   <div style={{ fontSize: 13, color: '#999' }}>{cat.desc}</div>
                 </div>
               </Col>
             ))}
           </Row>
         </Card>
       </div>
 
       {/* 内容区域 */}
       <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 24px' }}>
         <Title level={3}>热门推荐</Title>
         <Row gutter={[16, 16]}>
           {[1,2,3,4].map(i => (
             <Col span={6} key={i}>
               <Card hoverable cover={<div style={{ height: 180, background: '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🏔️</div>}>
                 <Card.Meta title={`苗寨一日游 · 路线${i}`} description={<span><EnvironmentOutlined /> 乌东村出发 · ¥298起</span>} />
               </Card>
             </Col>
           ))}
         </Row>
       </div>
 
       <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 24px' }}>
         <Title level={3}>精选非遗</Title>
         <Row gutter={[16, 16]}>
           {[1,2,3].map(i => (
             <Col span={8} key={i}>
               <Card hoverable cover={<div style={{ height: 240, background: '#fff7e6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>🪡</div>}>
                 <Card.Meta title={`苗族银饰 · 手工锻造`} description="传承人 · 杨师傅" />
               </Card>
             </Col>
           ))}
         </Row>
       </div>
     </div>
   );
 }
