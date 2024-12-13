import React from 'react';
import styles from '../../styles/Documentation.module.css';

const SystemDesignGuide: React.FC = () => {
  return (
    <div className={styles.docContent}>
      <h1>System Design</h1>
      
      <section>
        <h2>Architecture Overview</h2>
        <p>
          The CRM system follows a microservices architecture with the following key components:
        </p>
        <ul>
          <li>Frontend React Application</li>
          <li>Authentication Service</li>
          <li>Contact Service</li>
          <li>Sales Service</li>
          <li>Integration Service</li>
          <li>Notification Service</li>
        </ul>
      </section>

      <section>
        <h2>Service Communication</h2>
        <div className={styles.codeExample}>
          <pre>
{`Frontend App
    ↓
API Gateway
    ↓
┌─────────────────────────────────┐
│ Microservices                   │
├─────────┬─────────┬────────────┤
│ Auth    │ Sales   │ Contact    │
│ Service │ Service │ Service    │
└─────────┴─────────┴────────────┘`}
          </pre>
        </div>
      </section>

      <section>
        <h2>Data Flow</h2>
        <p>
          The system implements event-driven architecture for real-time updates:
        </p>
        <ul>
          <li>User actions trigger events</li>
          <li>Events are published to message queue</li>
          <li>Services subscribe to relevant events</li>
          <li>Updates are pushed to frontend via WebSocket</li>
        </ul>
      </section>

      <section>
        <h2>Security Architecture</h2>
        <ul>
          <li>JWT-based authentication</li>
          <li>Role-based access control (RBAC)</li>
          <li>Azure SSO integration</li>
          <li>API request validation</li>
          <li>Rate limiting</li>
        </ul>
      </section>

      <section>
        <h2>Scalability</h2>
        <p>
          The system is designed to scale horizontally:
        </p>
        <ul>
          <li>Containerized services with Docker</li>
          <li>Kubernetes orchestration</li>
          <li>Load balancing</li>
          <li>Database sharding capabilities</li>
        </ul>
      </section>
    </div>
  );
};

export default SystemDesignGuide;
