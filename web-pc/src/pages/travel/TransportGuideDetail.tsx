import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Spin, Descriptions, Tag, Row, Col, Divider } from 'antd';
import { ArrowLeftOutlined, EnvironmentOutlined, CarOutlined } from '@ant-design/icons';
import { travelAPI } from '@/api';

const { Title, Text, Paragraph } = Typography;

export default function TransportGuideDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [guide, setGuide] = useState<any>(null);

  useEffect(() => {
    loadGuide();
  }, [id]);

  const loadGuide = async () => {
    setLoading(true);
    try {
      if (!id) return;
      const res = await travelAPI.getTransportGuide(Number(id));
      if (res.code === 0) setGuide(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
  if (!guide) return <div style={{ textAlign: 'center', padding: 80 }}><Text>攻略不存在</Text></div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/travel')} style={{ marginBottom: 16, padding: 0 }}>
        返回出行首页
      </Button>

      <div style={{
        height: 200, borderRadius: 8, marginBottom: 24,
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64,
      }}>
        🚌
      </div>

      <Title level={3}>{guide.title}</Title>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={8}><Text type="secondary">出发地</Text><br /><Text strong>{guide.departure}</Text></Col>
        <Col span={8}><Text type="secondary">目的地</Text><br /><Text strong>{guide.destination}</Text></Col>
        <Col span={8}><Text type="secondary">交通方式</Text><br /><Text strong>{guide.transport_mode}</Text></Col>
      </Row>

      {(guide.duration || guide.cost) && (
        <Card size="small" style={{ marginBottom: 24 }}>
          <Row gutter={24}>
            {guide.duration && <Col span={12}><Text type="secondary">预计耗时</Text><br /><Text style={{ fontSize: 20, fontWeight: 600 }}>{guide.duration}小时</Text></Col>}
            {guide.cost && <Col span={12}><Text type="secondary">参考费用</Text><br /><Text style={{ fontSize: 20, fontWeight: 600, color: '#ff4d4f' }}>¥{guide.cost}</Text></Col>}
          </Row>
        </Card>
      )}

      <Divider />
      <Title level={5}>详细攻略</Title>
      <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{guide.detail || '暂无详细说明'}</Paragraph>
    </div>
  );
}
