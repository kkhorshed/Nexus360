import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import {
  MessageOutlined,
  TeamOutlined,
  LineChartOutlined,
  FundProjectionScreenOutlined,
  DollarOutlined,
  CrownOutlined
} from '@ant-design/icons';

const { Title } = Typography;

export interface AppLauncherProps {
  className?: string;
}

interface App {
  name: string;
  url: string;
  icon: React.ReactNode;
  description: string;
}

const apps: App[] = [
  { 
    name: 'AI Chat',
    url: 'http://localhost:3020/',
    icon: <MessageOutlined style={{ fontSize: '24px' }} />,
    description: 'Intelligent conversational interface'
  },
  { 
    name: 'CRM',
    url: 'http://localhost:3010/',
    icon: <TeamOutlined style={{ fontSize: '24px' }} />,
    description: 'Customer relationship management'
  },
  { 
    name: 'Forecasting',
    url: 'http://localhost:3040/',
    icon: <LineChartOutlined style={{ fontSize: '24px' }} />,
    description: 'Sales and revenue forecasting'
  },
  { 
    name: 'Marketing',
    url: 'http://localhost:3050/',
    icon: <FundProjectionScreenOutlined style={{ fontSize: '24px' }} />,
    description: 'Campaign and lead management'
  },
  { 
    name: 'Sales Compensation',
    url: 'http://localhost:3030/',
    icon: <DollarOutlined style={{ fontSize: '24px' }} />,
    description: 'Commission and incentive tracking'
  },
  { 
    name: 'Admin',
    url: 'http://localhost:3060/',
    icon: <CrownOutlined style={{ fontSize: '24px' }} />,
    description: 'Platform administration and user management'
  }
];

const AppLauncher: React.FC<AppLauncherProps> = ({ className }) => {
  return (
    <div className={className} style={{ padding: '20px' }}>
      <Row gutter={[24, 24]}>
        {apps.map((app) => (
          <Col xs={24} sm={12} md={8} lg={6} key={app.name}>
            <Card
              hoverable
              onClick={() => window.open(app.url, '_blank', 'noopener,noreferrer')}
              style={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '24px'
              }}
            >
              <div style={{ 
                marginBottom: '16px',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f5f5',
                borderRadius: '50%'
              }}>
                {app.icon}
              </div>
              <Title level={4} style={{ margin: '0 0 8px 0' }}>{app.name}</Title>
              <Typography.Text type="secondary">{app.description}</Typography.Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AppLauncher;
