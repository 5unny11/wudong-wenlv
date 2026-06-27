import { Tabs } from 'antd';
import { EnvironmentOutlined, CarOutlined, ScanOutlined, OrderedListOutlined } from '@ant-design/icons';
import ScenicSpotManage from './ScenicSpotManage';
import RouteManage from './RouteManage';
import ETicketVerify from './ETicketVerify';
import OrderManage from './OrderManage';

export default function AdminTravel() {
  const tabItems = [
    { key: 'scenic', label: <span><EnvironmentOutlined /> 景区管理</span>, children: <ScenicSpotManage /> },
    { key: 'routes', label: <span><CarOutlined /> 路线管理</span>, children: <RouteManage /> },
    { key: 'verify', label: <span><ScanOutlined /> 电子票核销</span>, children: <ETicketVerify /> },
    { key: 'orders', label: <span><OrderedListOutlined /> 订单管理</span>, children: <OrderManage /> },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Tabs defaultActiveKey="scenic" items={tabItems} />
    </div>
  );
}
