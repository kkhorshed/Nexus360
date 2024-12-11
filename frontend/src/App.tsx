import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Typography, theme } from 'antd';
import { AppLauncher } from '@nexus360/ui';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const { token } = theme.useToken();

  const MainLayout = () => (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 24px',
          background: token.colorPrimary,
          position: 'fixed',
          width: '100%',
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      >
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Nexus360
        </Title>
      </Header>
      <Content 
        style={{ 
          padding: '24px',
          marginTop: 64,
          background: token.colorBgLayout
        }}
      >
        <div style={{ 
          maxWidth: 1200,
          margin: '0 auto',
          padding: '24px',
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadow
        }}>
          <Title 
            level={2}
            style={{ 
              textAlign: 'center',
              marginBottom: 48,
              color: token.colorTextHeading
            }}
          >
            Welcome to Nexus360 Platform
          </Title>
          <AppLauncher />
        </div>
      </Content>
    </Layout>
  );

  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
