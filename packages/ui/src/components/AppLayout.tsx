import React, { useState } from 'react';
import { Layout, Menu, Button, Tooltip } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { UserProfile } from '../components/UserProfile';
import cequensLogo from '../../public/cequens-logo.svg';

const { Header, Content, Sider } = Layout;

interface AppLayoutProps {
  menuItems: { name: string; path: string; children?: { name: string; path: string }[] }[];
  children: React.ReactNode;
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  menuItems, 
  children,
  user,
  onLogout
}) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="ant-layout-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={cequensLogo} 
            alt="CEQUENS Logo" 
            style={{ height: 32, marginRight: 16, cursor: 'pointer' }} 
            title="Go to Dashboard"
          />
        </div>
        {user && (
          <UserProfile 
            user={user}
            onLogout={onLogout}
          />
        )}
      </Header>
      <Layout>
        <Sider 
          className="ant-layout-sider"
          width={250} 
          collapsible 
          collapsed={collapsed} 
          onCollapse={(value) => setCollapsed(value)} 
          style={{ 
            transition: 'all 0.3s ease', 
            background: '#fff', /* Set sidebar background to white */
            paddingTop: 0 /* Remove any padding at the top */
          }}
        >
          <Tooltip title={collapsed ? 'Expand Menu' : 'Collapse Menu'} placement="right">
            <Button 
              type="text" 
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
              onClick={() => setCollapsed(!collapsed)} 
              style={{ margin: '16px', transition: 'all 0.3s ease' }}
            />
          </Tooltip>
          <Menu 
            mode="inline" 
            style={{ height: '100%', borderRight: 0 }} 
            selectedKeys={[location.pathname]}
          >
            {menuItems.map((item) => (
              item.children ? (
                <Menu.SubMenu key={item.name} title={item.name}>
                  {item.children.map((child) => (
                    <Menu.Item key={child.path}>
                      <Link to={child.path}>{child.name}</Link>
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              ) : (
                <Menu.Item key={item.path}>
                  <Link to={item.path}>{item.name}</Link>
                </Menu.Item>
              )
            ))}
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 250, padding: '24px', marginTop: 64, transition: 'all 0.3s ease' }}>
          <Content className={`ant-layout-content ${collapsed ? 'collapsed' : ''}`}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
