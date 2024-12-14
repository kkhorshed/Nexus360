import React, { useState } from 'react';
import { Layout, Menu, Button, Tooltip } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Link, useLocation, matchPath } from 'react-router-dom';
import { UserProfile } from '../components/UserProfile';

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
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Helper function to check if a path matches the current location
  const isPathActive = (path: string) => {
    return !!matchPath(path, location.pathname);
  };

  // Helper function to check if a menu item or any of its children is active
  const isMenuItemActive = (item: { path: string; children?: { path: string }[] }) => {
    if (isPathActive(item.path)) return true;
    if (item.children) {
      return item.children.some(child => isPathActive(child.path));
    }
    return false;
  };

  const renderMenuItem = (item: { name: string; path: string }) => (
    <Menu.Item key={item.path}>
      <Link to={item.path}>{item.name}</Link>
    </Menu.Item>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="ant-layout-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/">
            <img 
              src="/cequens-logo.svg" 
              alt="CEQUENS Logo" 
              style={{ height: 32, marginRight: 16, cursor: 'pointer' }} 
              title="Go to Dashboard"
            />
          </Link>
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
            background: '#fff',
            paddingTop: 0
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
            defaultOpenKeys={menuItems
              .filter(item => item.children && isMenuItemActive(item))
              .map(item => item.name)
            }
          >
            {menuItems.map((item) => (
              item.children ? (
                <Menu.SubMenu key={item.name} title={item.name}>
                  {item.children.map((child) => renderMenuItem(child))}
                </Menu.SubMenu>
              ) : (
                renderMenuItem(item)
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
