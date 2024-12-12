import React from 'react';
import { Avatar, Dropdown, Space, Typography } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Text } = Typography;

interface UserProfileProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  user = { name: '', email: '' }, 
  onLogout 
}) => {
  const items: MenuProps['items'] = [
    {
      key: 'email',
      label: <Text type="secondary">{user.email}</Text>,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      danger: true,
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: onLogout,
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Space style={{ cursor: 'pointer' }}>
        <Avatar 
          icon={<UserOutlined />} 
          src={user.avatar}
          style={{ backgroundColor: user.avatar ? 'transparent' : '#1890ff' }}
        />
        <Text style={{ color: 'white' }}>{user.name}</Text>
      </Space>
    </Dropdown>
  );
};

export default UserProfile;
