import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  FileTextOutlined,
  SettingOutlined,
  EyeOutlined,
  LayoutOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import Header from './Header';
import UIGuide from '../Common/UIGuide';
import LayoutGuide from '../Common/LayoutGuide';
import styles from '../../styles/MainLayout.module.css';

const { Sider } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
  onGuideToggle: () => void;
  showGuide: boolean;
  onLayoutGuideToggle: () => void;
  showLayoutGuide: boolean;
}

type MenuItem = Required<MenuProps>['items'][number];

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  onGuideToggle, 
  showGuide,
  onLayoutGuideToggle,
  showLayoutGuide 
}) => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      key: 'main',
      type: 'group',
      label: 'Main',
      children: [
        {
          key: '/companies',
          icon: <TeamOutlined />,
          label: <Link to="/companies">Companies</Link>,
        },
        {
          key: '/contacts',
          icon: <UserOutlined />,
          label: <Link to="/contacts">Contacts</Link>,
        },
        {
          key: '/teams',
          icon: <TeamOutlined />,
          label: <Link to="/teams">Teams</Link>,
        },
        {
          key: '/deals',
          icon: <DollarOutlined />,
          label: <Link to="/deals">Deals</Link>,
        },
      ],
    },
    {
      key: 'catalog',
      type: 'group',
      label: 'Catalog',
      children: [
        {
          key: '/products',
          icon: <ShoppingCartOutlined />,
          label: <Link to="/products">Products</Link>,
        },
      ],
    },
    {
      key: 'system',
      type: 'group',
      label: 'System',
      children: [
        {
          key: '/documentation',
          icon: <FileTextOutlined />,
          label: <Link to="/documentation">Documentation</Link>,
        },
        {
          key: '/settings',
          icon: <SettingOutlined />,
          label: 'Settings',
          children: [
            {
              key: '/settings/environment',
              icon: <ToolOutlined />,
              label: <Link to="/settings/environment">Environment Settings</Link>,
            },
            {
              key: '/settings/layout',
              icon: <LayoutOutlined />,
              label: <Link to="/settings/layout">Layout Management</Link>,
            }
          ]
        },
        {
          key: 'ui-guide',
          icon: <EyeOutlined />,
          label: 'UI Guide',
          onClick: onGuideToggle,
          className: showGuide ? styles.active : undefined
        },
        {
          key: 'layout-guide',
          icon: <LayoutOutlined />,
          label: 'Layout Guide',
          onClick: onLayoutGuideToggle,
          className: showLayoutGuide ? styles.active : undefined
        },
      ],
    },
  ];

  return (
    <div className={styles.mainLayout} id="App.container">
      <div className={styles.headerContainer} id="App.header">
        <Header />
      </div>
      <div className={styles.contentWrapper} id="App.contentWrapper">
        <div className={styles.siderContainer} id="App.sider">
          <Menu
            mode="inline"
            theme="light"
            selectedKeys={[location.pathname]}
            defaultOpenKeys={['settings']}
            items={menuItems}
            className={styles.menu}
            id="App.menu"
          />
        </div>
        <div className={styles.mainContainer} id="App.content">
          {children}
          <UIGuide show={showGuide} />
          <LayoutGuide show={showLayoutGuide} />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
