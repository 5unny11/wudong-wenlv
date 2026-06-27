 import { Row, Col, Card, Typography, Tag, Space } from 'antd';
 import { useNavigate } from 'react-router-dom';
 
 const mockProducts = [
   { id: 1, title: '苗族银饰手镯', price: 398, sales: 128, tag: '银饰', img: '🥈' },
   { id: 2, title: '手工蜡染围巾', price: 168, sales: 86, tag: '蜡染', img: '🧣' },
   { id: 3, title: '苗绣·花开富贵', price: 588, sales: 42, tag: '刺绣', img: '🪡' },
   { id: 4, title: '苗族传统服饰', price: 1280, sales: 23, tag: '服饰', img: '👘' },
   { id: 5, title: '银制吊坠·蝴蝶妈妈', price: 268, sales: 156, tag: '银饰', img: '🦋' },
   { id: 6, title: '蜡染桌布·手工蓝染', price: 198, sales: 67, tag: '蜡染', img: '🟦' },
 ];
 
 export default function ProductsPage() {
   const navigate = useNavigate();
   return (
     <div style={{ maxWidth: 1200, margin: '24px auto', padding: '0 24px' }}>
       <Typography.Title level={3}>非遗手工艺品</Typography.Title>
       <Space style={{ marginBottom: 16 }} wrap>
         {['全部', '银饰', '蜡染', '刺绣', '服饰'].map(t => <Tag key={t} color={t === '全部' ? 'blue' : undefined} style={{ cursor: 'pointer', padding: '4px 12px' }}>{t}</Tag>)}
       </Space>
       <Row gutter={[16, 16]}>
         {mockProducts.map(p => (
           <Col xs={12} sm={8} md={6} key={p.id}>
             <Card hoverable onClick={() => navigate(`/products/${p.id}`)}
               cover={<div style={{ height: 200, background: '#f5f0eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>{p.img}</div>}>
               <Card.Meta title={p.title} description={<>
                 <div style={{ color: '#ff4d4f', fontSize: 18, fontWeight: 600 }}>¥{p.price}</div>
                 <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>已售 {p.sales} 件</div>
               </>} />
             </Card>
           </Col>
         ))}
       </Row>
     </div>
   );
 }
