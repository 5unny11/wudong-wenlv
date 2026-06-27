import { useState } from 'react';
import { Card, Typography, Input, Button, message, Result, Space } from 'antd';
import { ScanOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import api from '@/api';

const { Title, Text } = Typography;

export default function ETicketVerify() {
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; ticket?: any }>({});

  const handleVerify = async () => {
    if (!qrCode.trim()) {
      message.warning('请输入电子票号');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/admin/travel/e-tickets/verify', { qrCode: qrCode.trim() });
      if (res.data.code === 0) {
        setResult({ success: true, ticket: res.data.data });
      } else {
        setResult({ success: false });
      }
    } catch (err) {
      setResult({ success: false });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQrCode('');
    setResult({});
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Title level={4}>电子票核销</Title>
      <Card>
        {!result.success && result.success !== false && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <ScanOutlined style={{ fontSize: 48, color: '#1677ff' }} />
              <Text style={{ display: 'block', marginTop: 8, color: '#666' }}>
                输入电子票号（TKT 开头）
              </Text>
            </div>

            <Space.Compact style={{ width: '100%' }}>
              <Input
                size="large"
                placeholder="请输入电子票号"
                value={qrCode}
                onChange={e => setQrCode(e.target.value)}
                onPressEnter={handleVerify}
              />
              <Button type="primary" size="large" loading={loading} onClick={handleVerify}>
                核销
              </Button>
            </Space.Compact>
          </>
        )}

        {result.success === true && (
          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="核销成功"
            subTitle="该电子票已标记为已使用"
            extra={
              <Button type="primary" onClick={handleReset}>继续核销</Button>
            }
          />
        )}

        {result.success === false && (
          <Result
            status="error"
            icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            title="核销失败"
            subTitle="未找到该电子票，或该票已使用/已退款"
            extra={
              <Button onClick={handleReset}>重新核销</Button>
            }
          />
        )}
      </Card>
    </div>
  );
}
