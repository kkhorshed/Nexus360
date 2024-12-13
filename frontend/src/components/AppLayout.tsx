import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Sider, Content } = Layout;

interface AppLayoutProps {
  appName: string;
  menuItems: { name: string; path: string }[];
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ appName, menuItems, children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ background: '#fff' }}>
        <div style={{ padding: '16px', fontWeight: 'bold', textAlign: 'center' }}>{appName}</div>
        <Menu mode="inline" style={{ height: '100%' }}>
          {menuItems.map((item) => (
            <Menu.Item key={item.path}>
              <Link to={item.path}>{item.name}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout style={{ padding: '24px' }}>
        <Content style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
