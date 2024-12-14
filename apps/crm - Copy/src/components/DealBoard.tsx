import React from 'react';
import { Card, Typography, Space, Tag, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  company: string;
  probability: number;
  expectedCloseDate: string;
}

const DealBoard: React.FC = () => {
  const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  
  const deals: Deal[] = [
    {
      id: '1',
      title: 'Enterprise SMS Integration',
      value: 50000,
      stage: 'Qualified',
      company: 'Tech Corp',
      probability: 60,
      expectedCloseDate: '2024-03-15'
    },
    {
      id: '2',
      title: 'WhatsApp Business API',
      value: 75000,
      stage: 'Proposal',
      company: 'Global Solutions',
      probability: 75,
      expectedCloseDate: '2024-04-01'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Deal Pipeline</Title>
        <Button type="primary" icon={<PlusOutlined />}>Add Deal</Button>
      </div>

      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '8px 0' }}>
        {stages.map(stage => (
          <div key={stage} style={{ minWidth: '300px' }}>
            <Card title={stage} style={{ marginBottom: '16px' }}>
              {deals
                .filter(deal => deal.stage === stage)
                .map(deal => (
                  <Card key={deal.id} style={{ marginBottom: '8px' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text strong>{deal.title}</Text>
                      <Text type="secondary">{deal.company}</Text>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Tag color="blue">${deal.value.toLocaleString()}</Tag>
                        <Text type="secondary">{deal.probability}%</Text>
                      </div>
                      <Text type="secondary">Close: {deal.expectedCloseDate}</Text>
                    </Space>
                  </Card>
                ))}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealBoard;
