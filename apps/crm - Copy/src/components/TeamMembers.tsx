import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from '../../hooks/useAuth';

interface TeamMember {
  id: string;
  displayName: string;
  email: string;
  roles: string[];
  department?: string;
  applications: string[];
}

const TeamMembers: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_SERVICE_URL}/users/azure`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${user?.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }

      const data = await response.json();
      setMembers(data);
    } catch (error) {
      message.error('Failed to load team members');
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<TeamMember> = [
    {
      title: 'Name',
      dataIndex: 'displayName',
      key: 'displayName',
      sorter: (a, b) => a.displayName.localeCompare(b.displayName)
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department: string) => department || '-'
    },
    {
      title: 'Roles',
      key: 'roles',
      dataIndex: 'roles',
      render: (roles: string[]) => (
        <Space size={[0, 4]} wrap>
          {roles.map(role => (
            <Tag color="blue" key={role}>
              {role}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: 'Applications',
      key: 'applications',
      dataIndex: 'applications',
      render: (applications: string[]) => (
        <Space size={[0, 4]} wrap>
          {applications.map(app => (
            <Tag color="green" key={app}>
              {app}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEditAccess(record)}>
            Edit Access
          </Button>
        </Space>
      )
    }
  ];

  const handleEditAccess = async (member: TeamMember) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_SERVICE_URL}/users/${member.id}/access`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`
        },
        credentials: 'include',
        body: JSON.stringify({
          applications: member.applications,
          roles: member.roles
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update user access');
      }

      message.success(`Updated access for ${member.displayName}`);
      await fetchTeamMembers(); // Refresh the list
    } catch (error) {
      message.error('Failed to update user access');
      console.error('Error updating user access:', error);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Table
        columns={columns}
        dataSource={members}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} members`
        }}
      />
    </div>
  );
};

export default TeamMembers;
