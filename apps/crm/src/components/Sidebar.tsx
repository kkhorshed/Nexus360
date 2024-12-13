import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
  TeamOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';

const Sidebar: React.FC = () => {
  return (
    <Menu
      mode="inline"
      theme="light"
      style={{ height: '100%', borderRight: 0 }}
    >
      <Menu.Item key="companies" icon={<TeamOutlined />}>
        <Link to="/companies">Companies</Link>
      </Menu.Item>
      <Menu.Item key="contacts" icon={<UserOutlined />}>
        <Link to="/contacts">Contacts</Link>
      </Menu.Item>
      <Menu.Item key="deals" icon={<DollarOutlined />}>
        <Link to="/deals">Deals</Link>
      </Menu.Item>
      <Menu.Item key="products" icon={<ShoppingCartOutlined />}>
        <Link to="/products">Products</Link>
      </Menu.Item>
      <Menu.Item key="teams" icon={<TeamOutlined />}>
        <Link to="/teams">Teams</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Sidebar;
