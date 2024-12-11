import React from 'react';
import { Layout } from 'antd';
import LayoutElements from '../../components/Common/LayoutElements';
import styles from '../../styles/Documentation.module.css';

const { Content } = Layout;

const MainLayoutGuide: React.FC = () => {
  return (
    <Content className={styles.documentationContent}>
      <div className={styles.guideSection}>
        <h1>Main Layout Elements Guide</h1>
        <p>
          This guide highlights the key layout elements used across the application.
          Hover over the highlighted elements to see detailed information about their
          purpose, usage, and spacing guidelines.
        </p>

        {/* Add IDs to layout elements for the LayoutElements component to highlight */}
        <Layout id="layout-container" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
          <div id="layout-header" style={{ height: '64px', background: '#fff', padding: '0 24px', lineHeight: '64px' }}>
            Header
          </div>
          <Layout>
            <div id="layout-sider" style={{ width: '250px', background: '#fff', padding: '24px 0' }}>
              Sider Navigation
            </div>
            <Layout style={{ padding: '24px' }}>
              <div id="layout-content" style={{ background: '#fff', padding: '24px', minHeight: '280px' }}>
                Main Content Area
              </div>
            </Layout>
          </Layout>
        </Layout>

        <LayoutElements
          elements={{
            container: true,
            header: true,
            sider: true,
            content: true
          }}
        />
      </div>
    </Content>
  );
};

export default MainLayoutGuide;
