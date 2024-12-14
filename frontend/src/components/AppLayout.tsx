import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header, Content } = Layout;

interface AppLayoutProps {
  appName: string;
  menuItems: { name: string; path: string }[];
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ appName, menuItems, children }) => {
  return (
    <Layout style={{ 
      minHeight: '100vh',
      background: '#f0f2f5',
      padding: '16px'
    }}>
      <Header style={{ 
        background: '#fff',
        borderRadius: '12px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          fontWeight: 'bold',
          fontSize: '18px',
          marginRight: '48px'
        }}>
          {appName}
        </div>
        <Menu 
          mode="horizontal" 
          style={{ 
            flex: 1,
            background: 'transparent',
            border: 'none',
            lineHeight: '64px',
            width: 'auto',
            display: 'flex'
          }}
          disabledOverflow={true}
        >
          {menuItems.map((item) => (
            <Menu.Item key={item.path}>
              <Link to={item.path}>{item.name}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Header>
      <Content style={{ 
        background: '#fff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        minHeight: '280px'
      }}>
        {children}
      </Content>
    </Layout>
  );
};

export default AppLayout;
