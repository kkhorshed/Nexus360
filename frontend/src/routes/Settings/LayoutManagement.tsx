import React, { useState } from 'react';
import { Layout, Card, Switch, Form, Input, Button, Space, Typography } from 'antd';
import PageWrapper from '../../components/Common/PageWrapper';
import styles from '../../styles/Layout.module.css';

const { Title, Text } = Typography;

const LayoutManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [siderVisible, setSiderVisible] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);

  const handleSave = (values: any) => {
    console.log('Layout settings:', values);
    // Here you would implement the actual saving logic
  };

  return (
    <PageWrapper
      title="Layout Management"
      description="Customize the application layout settings and visibility of different components."
    >
      <Card className={styles.layoutCard}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* Component Visibility */}
          <Card title="Component Visibility" size="small">
            <Form.Item label="Sider Menu">
              <Switch
                checked={siderVisible}
                onChange={setSiderVisible}
                checkedChildren="Visible"
                unCheckedChildren="Hidden"
              />
            </Form.Item>
            <Form.Item label="Header">
              <Switch
                checked={headerVisible}
                onChange={setHeaderVisible}
                checkedChildren="Visible"
                unCheckedChildren="Hidden"
              />
            </Form.Item>
          </Card>

          {/* Dimensions */}
          <Form
            form={form}
            layout="vertical"
            className={styles.layoutForm}
            onFinish={handleSave}
            initialValues={{
              siderWidth: 250,
              headerHeight: 64,
              contentPadding: 24,
            }}
          >
            <Card title="Layout Dimensions" size="small">
              <Form.Item
                name="siderWidth"
                label="Sider Width (px)"
                rules={[{ required: true, message: 'Please input sider width' }]}
              >
                <Input type="number" min={200} max={400} />
              </Form.Item>

              <Form.Item
                name="headerHeight"
                label="Header Height (px)"
                rules={[{ required: true, message: 'Please input header height' }]}
              >
                <Input type="number" min={48} max={96} />
              </Form.Item>

              <Form.Item
                name="contentPadding"
                label="Content Padding (px)"
                rules={[{ required: true, message: 'Please input content padding' }]}
              >
                <Input type="number" min={0} max={48} />
              </Form.Item>
            </Card>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save Layout Settings
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.previewSection}>
            <Title level={4}>Layout Preview</Title>
            <Text type="secondary">
              Changes will be reflected in real-time as you adjust the settings above.
            </Text>
            {/* Add preview component here if needed */}
          </div>
        </Space>
      </Card>
    </PageWrapper>
  );
};

export default LayoutManagement;
