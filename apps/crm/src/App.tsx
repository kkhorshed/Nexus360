import React, { useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ShopOutlined,
  DollarOutlined,
  TeamOutlined,
  BuildOutlined
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Header from './components/Header';
import DealBoard from './components/DealBoard';
import ProductCatalog from './components/ProductCatalog';

const { Sider, Content } = Layout;

const App: React.FC = () => {
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = 'http://localhost:3006/api/auth/login';
    }
  }, []);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="1" icon={<DashboardOutlined />}>
                <Link to="/dashboard">Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<DollarOutlined />}>
                <Link to="/deals">Deals</Link>
              </Menu.Item>
              <Menu.Item key="3" icon={<ShopOutlined />}>
                <Link to="/products">Products</Link>
              </Menu.Item>
              <Menu.Item key="4" icon={<TeamOutlined />}>
                <Link to="/customers">Customers</Link>
              </Menu.Item>
              <Menu.Item key="5" icon={<BuildOutlined />}>
                <Link to="/settings">Settings</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content style={{ 
              background: '#fff', 
              padding: 24, 
              margin: '16px 0', 
              borderRadius: 8,
              minHeight: 280 
            }}>
              <Routes>
                <Route path="/dashboard" element={<div>Dashboard Content</div>} />
                <Route path="/deals" element={<DealBoard />} />
                <Route path="/products" element={<ProductCatalog />} />
                <Route path="/customers" element={<div>Customers Content</div>} />
                <Route path="/settings" element={<div>Settings Content</div>} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
