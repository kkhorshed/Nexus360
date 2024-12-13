import React from 'react';
import { Layout, Avatar, Space, Dropdown, MenuProps } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import styles from '../../styles/Header.module.css';

const { Header: AntHeader } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const Header: React.FC = () => {
  const handleLogout = () => {
    window.location.href = 'http://localhost:3001/auth/logout';
  };

  const userMenuItems: MenuItem[] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      type: 'item',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      type: 'item',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
      type: 'item',
    },
  ];

  return (
    <AntHeader className={`${styles.header} app-header`}>
      <div className={styles.logoContainer}>
        <img src="/cequens-logo.svg" alt="CEQUENS Logo" className={styles.logo} />
      </div>
      <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
        <Space className={styles.userInfo}>
          <Avatar size="small" icon={<UserOutlined />} />
          <span className={styles.userName}>John Doe</span>
        </Space>
      </Dropdown>
    </AntHeader>
  );
};

export default Header;
