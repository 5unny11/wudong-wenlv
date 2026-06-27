 import { Row, Col, Card, Typography, Tag, Avatar, Space, Input, Button } from 'antd';
 import { HeartOutlined, MessageOutlined, ShareAltOutlined, SearchOutlined } from '@ant-design/icons';
 
 const mockNotes = [
   { id: 1, user: '旅行者小王', title: '乌东苗寨·遇见最美梯田', likes: 86, comments: 12, tags: ['风景', '摄影'], img: '🌅' },
   { id: 2, user: '非遗爱好者', title: '探访苗族银饰传承人', likes: 64, comments: 8, tags: ['非遗', '银饰'], img: '🥈' },
   { id: 3, user: '美食猎人', title: '苗家长桌宴吃什么？', likes: 128, comments: 23, tags: ['美食', '体验'], img: '🍲' },
   { id: 4, user: '背包客小刘', title: '两天一夜苗寨攻略', likes: 215, comments: 35, tags: ['攻略', '住宿'], img: '📝' },
   { id: 5, user: '民族风写真', title: '苗寨拍照打卡指南', likes: 93, comments: 15, tags: ['摄影', '穿搭'], img: '📸' },
   { id: 6, user: '亲子游妈妈', title: '带孩子体验苗寨农耕', likes: 72, comments: 9, tags: ['亲子', '体验'], img: '🌾' },
 ];
 
 const topics = ['全部', '风景', '非遗', '美食', '攻略', '摄影', '亲子'];
 
 export default function CommunityPage() {
   return (
     <div style={{ maxWidth: 1200, margin: '24px auto', padding: '0 24px' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
         <Typography.Title level={3} style={{ margin: 0 }}>游记社区</Typography.Title>
         <Button type="primary">发布游记</Button>
       </div>
       <Space wrap style={{ marginBottom: 16 }}>
         <Input prefix={<SearchOutlined />} placeholder="搜索游记、话题..." style={{ width: 300 }} />
         {topics.map(t => <Tag key={t} color={t === '全部' ? 'blue' : undefined} style={{ cursor: 'pointer', padding: '2px 12px' }}>{t}</Tag>)}
       </Space>
       <Row gutter={[16, 16]}>
         {mockNotes.map(note => (
           <Col xs={24} sm={12} md={8} key={note.id}>
             <Card hoverable cover={<div style={{ height: 200, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, borderRadius: '8px 8px 0 0' }}>{note.img}</div>}>
               <Card.Meta
                 avatar={<Avatar style={{ background: '#1677ff' }}>{note.user[0]}</Avatar>}
                 title={note.title}
                 description={
                   <div>
                     <Typography.Text type="secondary" style={{ fontSize: 12 }}>{note.user}</Typography.Text>
                     <div style={{ marginTop: 4 }}>{note.tags.map(t => <Tag key={t} style={{ fontSize: 11 }}>{t}</Tag>)}</div>
                     <Space style={{ marginTop: 8, fontSize: 13, color: '#999' }}>
                       <span><HeartOutlined /> {note.likes}</span>
                       <span><MessageOutlined /> {note.comments}</span>
                       <ShareAltOutlined />
                     </Space>
                   </div>
                 }
               />
             </Card>
           </Col>
         ))}
       </Row>
     </div>
   );
 }
