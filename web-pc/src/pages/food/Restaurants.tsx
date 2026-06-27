 import { Row, Col, Card, Typography, Tag, Input, Space, Rate } from 'antd';
 import { SearchOutlined } from '@ant-design/icons';
 
 const mockRestaurants = [
   { id: 1, name: '苗家长桌宴', rating: 4.8, tags: ['特色', '聚餐'], desc: '传统苗族宴席，酸汤鱼·腊肉·糯米饭', img: '🍲' },
   { id: 2, name: '乌东小吃坊', rating: 4.5, tags: ['小吃', '休闲'], desc: '糍粑·米酒·烤鱼·特色烧烤', img: '🥘' },
   { id: 3, name: '梯田农庄', rating: 4.6, tags: ['农家', '田园'], desc: '梯田大米·土鸡·时令蔬菜', img: '🌾' },
   { id: 4, name: '苗家特产馆', rating: 4.3, tags: ['特产', '伴手礼'], desc: '米酒·腊肉·茶叶·干货', img: '🎁' },
 ];
 
 export default function RestaurantsPage() {
   return (
     <div style={{ maxWidth: 1200, margin: '24px auto', padding: '0 24px' }}>
       <Typography.Title level={3}>餐饮美食</Typography.Title>
       <Input prefix={<SearchOutlined />} placeholder="搜索餐厅、特产..." style={{ width: 400, marginBottom: 24 }} size="large" />
       <Row gutter={[16, 16]}>
         {mockRestaurants.map(r => (
           <Col xs={24} sm={12} md={6} key={r.id}>
             <Card hoverable cover={<div style={{ height: 160, background: '#fffbe6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>{r.img}</div>}>
               <Card.Meta title={r.name} description={
                 <div>
                   <Rate disabled allowHalf value={r.rating} style={{ fontSize: 12 }} /> <span style={{ color: '#faad14' }}>{r.rating}</span>
                   <div style={{ marginTop: 8 }}>{r.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
                   <Typography.Text type="secondary" style={{ fontSize: 12 }}>{r.desc}</Typography.Text>
                 </div>
               } />
             </Card>
           </Col>
         ))}
       </Row>
     </div>
   );
 }
