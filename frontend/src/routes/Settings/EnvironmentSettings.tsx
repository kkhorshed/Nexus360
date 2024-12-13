import React, { useState, useEffect } from 'react';
import PageWrapper from '../../components/Common/PageWrapper';
import layout from '../../styles/Layout.module.css';
import styles from '../../styles/Settings.module.css';
import { Card, Tabs, Form, Input, Button, Switch, message } from 'antd';

const { TabPane } = Tabs;

interface EnvVariable {
  key: string;
  value: string;
  description: string;
}

interface ServiceConfig {
  name: string;
  url: string;
  port: string;
  enabled: boolean;
}

const EnvironmentSettings: React.FC = () => {
  const [envVariables, setEnvVariables] = useState<EnvVariable[]>([
    { 
      key: 'VITE_AUTH_SERVICE_URL', 
      value: 'http://localhost:8081',
      description: 'Authentication service endpoint'
    },
    { 
      key: 'VITE_APP_NAME', 
      value: 'CRM',
      description: 'Application name'
    },
    { 
      key: 'VITE_APP_VERSION', 
      value: '1.0.0',
      description: 'Application version'
    }
  ]);

  const [services, setServices] = useState<ServiceConfig[]>([
    {
      name: 'Authentication Service',
      url: 'localhost',
      port: '8081',
      enabled: true
    },
    {
      name: 'Frontend Service',
      url: 'localhost',
      port: '3001',
      enabled: true
    }
  ]);

  const handleEnvSave = (values: any) => {
    const updatedVariables = envVariables.map(variable => ({
      ...variable,
      value: values[variable.key] || variable.value
    }));
    setEnvVariables(updatedVariables);
    message.success('Environment variables updated successfully');
  };

  const handleServiceSave = (values: any) => {
    const updatedServices = services.map((service, index) => ({
      ...service,
      url: values[`url_${index}`] || service.url,
      port: values[`port_${index}`] || service.port,
      enabled: values[`enabled_${index}`] ?? service.enabled
    }));
    setServices(updatedServices);
    message.success('Service configurations updated successfully');
  };

  return (
    <PageWrapper
      title="Environment Settings"
      description="Configure environment variables and service settings"
    >
      <section className={layout.section}>
        <Card>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Environment Variables" key="1">
              <Form
                layout="vertical"
                onFinish={handleEnvSave}
                initialValues={Object.fromEntries(
                  envVariables.map(v => [v.key, v.value])
                )}
              >
                {envVariables.map((variable, index) => (
                  <Form.Item
                    key={index}
                    label={variable.key}
                    name={variable.key}
                    help={variable.description}
                  >
                    <Input placeholder={`Enter ${variable.key}`} />
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save Environment Variables
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="Service Configuration" key="2">
              <Form
                layout="vertical"
                onFinish={handleServiceSave}
                initialValues={Object.fromEntries([
                  ...services.map((s, i) => [`url_${i}`, s.url]),
                  ...services.map((s, i) => [`port_${i}`, s.port]),
                  ...services.map((s, i) => [`enabled_${i}`, s.enabled])
                ])}
              >
                {services.map((service, index) => (
                  <Card 
                    key={index} 
                    title={service.name}
                    className={styles.serviceCard}
                    style={{ marginBottom: '1rem' }}
                  >
                    <Form.Item
                      label="URL"
                      name={`url_${index}`}
                      rules={[{ required: true, message: 'URL is required' }]}
                    >
                      <Input placeholder="Enter service URL" />
                    </Form.Item>
                    <Form.Item
                      label="Port"
                      name={`port_${index}`}
                      rules={[{ required: true, message: 'Port is required' }]}
                    >
                      <Input placeholder="Enter port number" />
                    </Form.Item>
                    <Form.Item
                      label="Status"
                      name={`enabled_${index}`}
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
                    </Form.Item>
                    <div className={styles.serviceStatus}>
                      <span className={styles.statusLabel}>Current Status:</span>
                      <span className={`${styles.statusIndicator} ${service.enabled ? styles.active : styles.inactive}`}>
                        {service.enabled ? 'Running' : 'Stopped'}
                      </span>
                    </div>
                  </Card>
                ))}
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save Service Configuration
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </Card>
      </section>
    </PageWrapper>
  );
};

export default EnvironmentSettings;
