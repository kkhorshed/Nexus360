import React from 'react';
import { Layout, Menu, Typography, theme } from 'antd';
import { Link } from 'react-router-dom';
import { UserProfile } from '../components/UserProfile';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

interface AppLayoutProps {
  appName: string;
  menuItems: { name: string; path: string }[];
  children: React.ReactNode;
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  appName, 
  menuItems, 
  children,
  user,
  onLogout
}) => {
  const { token } = theme.useToken();

  return (
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          justifyContent: 'space-between'
        }}
      >
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          {appName}
        </Title>
        {user && (
          <UserProfile 
            user={user}
            onLogout={onLogout}
          />
        )}
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu mode="inline" style={{ height: '100%', borderRight: 0 }}>
            {menuItems.map((item) => (
              <Menu.Item key={item.path}>
                <Link to={item.path}>{item.name}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{ 
            background: '#fff', 
            padding: '24px', 
            margin: 0, 
            borderRadius: token.borderRadiusLG,
            minHeight: 280 
          }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
