 import { Row, Col, Card, Typography, Tag, Input, DatePicker, Space, Rate } from 'antd';
 import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
 
 const mockHomestays = [
   { id: 1, name: '云上苗寨·木楼', rating: 4.9, price: 388, tags: ['木楼', '观景'], desc: '全木结构·梯田景观·苗家早餐', img: '🏡' },
   { id: 2, name: '吊脚楼民宿', rating: 4.7, price: 268, tags: ['吊脚楼', '实惠'], desc: '传统吊脚楼·近广场·含晚餐', img: '🛖' },
   { id: 3, name: '梯田观景客栈', rating: 4.8, price: 458, tags: ['观景', '舒适'], desc: '推窗见梯田·独立卫浴·空调', img: '🌄' },
   { id: 4, name: '苗家小院', rating: 4.6, price: 198, tags: ['经济', '体验'], desc: '农家小院·自助厨房·体验农耕', img: '🏠' },
 ];
 
 const { RangePicker } = DatePicker;
 
 export default function HomestaysPage() {
   return (
     <div style={{ maxWidth: 1200, margin: '24px auto', padding: '0 24px' }}>
       <Typography.Title level={3}>苗寨住宿</Typography.Title>
       <Space style={{ marginBottom: 24 }} wrap>
         <Input prefix={<SearchOutlined />} placeholder="搜索民宿..." style={{ width: 300 }} size="large" />
         <RangePicker placeholder={['入住日期', '离店日期']} size="large" />
       </Space>
       <Row gutter={[16, 16]}>
         {mockHomestays.map(h => (
           <Col xs={24} sm={12} md={6} key={h.id}>
             <Card hoverable cover={<div style={{ height: 180, background: '#e6fffb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>{h.img}</div>}>
               <Card.Meta title={h.name} description={
                 <div>
                   <Rate disabled allowHalf value={h.rating} style={{ fontSize: 12 }} /> <span style={{ color: '#faad14' }}>{h.rating}</span>
                   <div style={{ fontSize: 20, color: '#ff4d4f', fontWeight: 600, margin: '8px 0' }}>¥{h.price}<span style={{ fontSize: 12, fontWeight: 400, color: '#999' }}>/晚</span></div>
                   <Space size={4} wrap>{h.tags.map(t => <Tag key={t} style={{ fontSize: 11 }}>{t}</Tag>)}</Space>
                   <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{h.desc}</div>
                 </div>
               } />
             </Card>
           </Col>
         ))}
       </Row>
     </div>
   );
 }
