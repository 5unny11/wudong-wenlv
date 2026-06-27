import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Spin, Tag, Descriptions, Space, Divider, message } from 'antd';
import { ArrowLeftOutlined, QrcodeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { travelAPI } from '@/api';

const { Title, Text, Paragraph } = Typography;

export default function ETicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<any>(null);

  useEffect(() => {
    loadTicket();
  }, [id]);

  const loadTicket = async () => {
    setLoading(true);
    try {
      if (!id) return;
      const res = await travelAPI.getETicket(Number(id));
      if (res.code === 0) setTicket(res.data);
      else message.error(res.message);
    } catch (err) {
      message.error('加载电子票失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  if (!ticket) return <div style={{ textAlign: 'center', padding: 80 }}><Text>电子票不存在</Text></div>;

  const statusColor: Record<number, string> = { 0: 'blue', 1: 'green', 2: 'default' };
  const statusText: Record<number, string> = { 0: '未使用', 1: '已使用', 2: '已退款' };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/travel')} style={{ marginBottom: 16, padding: 0 }}>
        返回出行首页
      </Button>

      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>电子票</Title>
          <Tag color={statusColor[ticket.status]} style={{ marginTop: 8 }}>
            {statusText[ticket.status]}
          </Tag>
        </div>

        {/* 二维码区域（模拟） */}
        <div style={{
          width: 200, height: 200, margin: '0 auto 24px',
          background: '#f5f5f5', borderRadius: 8,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          border: '2px dashed #d9d9d9',
        }}>
          <QrcodeOutlined style={{ fontSize: 64, color: '#1677ff' }} />
          <Text type="secondary" style={{ marginTop: 8, fontSize: 12 }}>票号: {ticket.qr_code}</Text>
        </div>

        <Divider />

        <Descriptions column={1} size="small" bordered>
          <Descriptions.Item label="票号">{ticket.qr_code}</Descriptions.Item>
          <Descriptions.Item label="有效期">
            {ticket.valid_from} ~ {ticket.valid_to}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={statusColor[ticket.status]}>{statusText[ticket.status]}</Tag>
          </Descriptions.Item>
          {ticket.used_at && (
            <Descriptions.Item label="使用时间">
              {new Date(ticket.used_at).toLocaleString('zh-CN')}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </div>
  );
}
