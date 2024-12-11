import React from 'react';
import { Card, Typography, Space, Tag, Button, Table, Badge } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  status: 'active' | 'inactive';
  description: string;
  features: string[];
}

const ProductCatalog: React.FC = () => {
  const products: Product[] = [
    {
      id: '1',
      name: 'SMS API',
      category: 'Messaging',
      price: 0.02,
      status: 'active',
      description: 'Enterprise-grade SMS API for global messaging',
      features: ['Global Coverage', 'Delivery Reports', 'Unicode Support']
    },
    {
      id: '2',
      name: 'WhatsApp Business API',
      category: 'Messaging',
      price: 0.05,
      status: 'active',
      description: 'Official WhatsApp Business API integration',
      features: ['Rich Media', 'Templates', 'Quick Replies']
    },
    {
      id: '3',
      name: 'Voice API',
      category: 'Voice',
      price: 0.03,
      status: 'active',
      description: 'Programmable voice calls and IVR',
      features: ['Text-to-Speech', 'Call Recording', 'IVR Builder']
    }
  ];

  const columns: ColumnsType<Product> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space direction="vertical" size="small">
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.description}</Text>
        </Space>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: text => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: price => `$${price.toFixed(3)} per unit`
    },
    {
      title: 'Features',
      dataIndex: 'features',
      key: 'features',
      render: features => (
        <Space size={[0, 4]} wrap>
          {features.map(feature => (
            <Tag key={feature} color="default">{feature}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Badge 
          status={status === 'active' ? 'success' : 'default'} 
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Product Catalog</Title>
        <Button type="primary" icon={<PlusOutlined />}>Add Product</Button>
      </div>

      <Card>
        <Table 
          columns={columns} 
          dataSource={products}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default ProductCatalog;
