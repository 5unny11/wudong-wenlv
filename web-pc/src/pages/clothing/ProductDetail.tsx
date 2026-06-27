 import { Row, Col, Typography, Button, Divider, Tag, Rate, Space, InputNumber } from 'antd';
 import { useParams } from 'react-router-dom';
 import { ShoppingCartOutlined } from '@ant-design/icons';
 
 export default function ProductDetailPage() {
   const { id } = useParams();
   return (
     <div style={{ maxWidth: 1200, margin: '24px auto', padding: '0 24px' }}>
       <Row gutter={48}>
         <Col span={10}>
           <div style={{ height: 400, background: '#f5f0eb', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, fontSize: 100 }}>🥈</div>
         </Col>
         <Col span={14}>
           <Typography.Title level={3}>苗族银饰手镯</Typography.Title>
           <Tag color="purple">银饰</Tag>
           <div style={{ fontSize: 28, color: '#ff4d4f', fontWeight: 600, margin: '16px 0' }}>¥398.00</div>
           <Typography.Paragraph type="secondary">传承人杨师傅手工锻造，采用苗族传统银饰工艺，每件产品均有独特纹样。</Typography.Paragraph>
           <Divider />
           <Space direction="vertical" style={{ width: '100%' }}>
             <div><Typography.Text strong>规格：</Typography.Text><Tag>标准款</Tag><Tag>加宽款</Tag></div>
             <div><Typography.Text strong>数量：</Typography.Text><InputNumber min={1} max={99} defaultValue={1} /></div>
           </Space>
           <Divider />
           <Space size="large">
             <Button type="primary" size="large" icon={<ShoppingCartOutlined />}>加入购物车</Button>
             <Button size="large">立即购买</Button>
           </Space>
           <Divider />
           <Typography.Text strong>工艺介绍</Typography.Text>
           <Typography.Paragraph style={{ marginTop: 8 }}>
             苗族银饰锻造技艺是国家级非物质文化遗产。本产品由乌东村银饰传承人纯手工打造，采用錾刻、浮雕等传统技法。
           </Typography.Paragraph>
         </Col>
       </Row>
     </div>
   );
 }
