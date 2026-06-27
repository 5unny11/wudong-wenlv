import type { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#1F5FA8',
    colorSuccess: '#6B8E3D',
    colorWarning: '#FAAD14',
    colorError: '#FF4D4F',
    colorLink: '#1F5FA8',
    colorTextBase: '#1A1A1A',
    colorBgContainer: '#FFFFFF',
    colorBgLayout: '#F7F8FA',
    borderRadius: 8,
    fontSize: 14,
  },
  components: {
    Button: {
      primaryShadow: '0 4px 12px rgba(31, 95, 168, 0.20)',
    },
    Card: {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    },
  },
};
