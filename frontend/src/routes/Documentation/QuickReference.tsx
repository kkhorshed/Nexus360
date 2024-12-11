import React from 'react';
import styles from '../../styles/Documentation.module.css';

const QuickReference: React.FC = () => {
  return (
    <div className={styles.docContent}>
      <h1>Quick Reference</h1>

      <h2>Common Commands</h2>
      
      <h3>Installation</h3>
      <pre><code># Install all dependencies
npm run install-all

# Install specific service
cd services/auth-service && npm install
cd frontend && npm install</code></pre>

      <h3>Development</h3>
      <pre><code># Start all services in development mode
npm start

# Start auth service in development mode
cd services/auth-service
npm run dev

# Start frontend in development mode
cd frontend
npm run dev</code></pre>

      <h3>Building</h3>
      <pre><code># Build auth service
cd services/auth-service
npm run build

# Build frontend
cd frontend
npm run build</code></pre>

      <h3>Database</h3>
      <pre><code># Initialize database
cd services/auth-service
npm run db:init

# Backup database
pg_dump -U your_postgres_user crm_auth_db {'>'} backup.sql

# Restore database
psql -U your_postgres_user crm_auth_db {'<'} backup.sql</code></pre>

      <h2>Environment Variables Reference</h2>
      
      <h3>Auth Service (.env)</h3>
      <pre><code>AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=
AZURE_AD_REDIRECT_URI=
FRONTEND_URL=
SESSION_SECRET=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DB=
NODE_ENV=</code></pre>

      <h3>Frontend (.env)</h3>
      <pre><code>VITE_AUTH_SERVICE_URL=</code></pre>

      <h2>Required Ports</h2>
      <ul>
        <li>Frontend: 3000</li>
        <li>Auth Service: 8081</li>
        <li>PostgreSQL: 5432</li>
      </ul>

      <h2>Health Check Endpoints</h2>
      <ul>
        <li>Auth Service: <code>GET /health</code></li>
        <li>Frontend: <code>GET /health.html</code></li>
      </ul>

      <h2>Common Issues & Solutions</h2>
      
      <h3>1. Port already in use:</h3>
      <pre><code># Clear ports
cd services/auth-service
npm run clear-ports</code></pre>

      <h3>2. Database connection failed:</h3>
      <ul>
        <li>Check PostgreSQL service is running</li>
        <li>Verify database credentials in .env</li>
        <li>Ensure database exists</li>
      </ul>

      <h3>3. Azure SSO not working:</h3>
      <ul>
        <li>Verify Azure AD credentials</li>
        <li>Check redirect URI configuration</li>
        <li>Ensure proper permissions are set</li>
      </ul>

      <h2>Production Checklist</h2>
      <ul>
        <li>All .env files configured</li>
        <li>Database initialized</li>
        <li>SSL certificates installed</li>
        <li>CORS configured</li>
        <li>Services built in production mode</li>
        <li>Health checks responding</li>
        <li>Backups configured</li>
        <li>Monitoring set up</li>
        <li>Load balancer configured (if applicable)</li>
      </ul>
    </div>
  );
};

export default QuickReference;
