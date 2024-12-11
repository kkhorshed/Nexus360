import React from 'react';
import styles from '../../styles/Documentation.module.css';

const DeploymentGuide: React.FC = () => {
  return (
    <div className={styles.docContent}>
      <h1>Deployment Guide</h1>
      
      <h2>System Requirements</h2>
      <ul>
        <li>Node.js (v18 or higher recommended)</li>
        <li>PostgreSQL (v13 or higher)</li>
        <li>npm or yarn package manager</li>
      </ul>

      <h2>Pre-deployment Setup</h2>
      <h3>1. Database Setup</h3>
      <ol>
        <li>Install PostgreSQL if not already installed</li>
        <li>Create a new database named <code>crm_auth_db</code></li>
        <li>Initialize the database by running:
          <pre><code>cd services/auth-service
npm run db:init</code></pre>
        </li>
      </ol>

      <h3>2. Environment Configuration</h3>
      <h4>Auth Service Configuration</h4>
      <p>Create <code>.env</code> file in <code>services/auth-service/</code> with:</p>
      <pre><code># Azure AD Configuration
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_client_secret
AZURE_AD_TENANT_ID=your_tenant_id
AZURE_AD_REDIRECT_URI=http://localhost:8081/auth/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Session Secret
SESSION_SECRET=your_session_secret

# PostgreSQL Configuration
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=crm_auth_db

# Node Environment
NODE_ENV=production</code></pre>

      <h2>Installation</h2>
      <ol>
        <li>Clone the repository</li>
        <li>Install dependencies:
          <pre><code>npm run install-all</code></pre>
        </li>
      </ol>

      <h2>Building the Application</h2>
      <h3>1. Build Auth Service</h3>
      <pre><code>cd services/auth-service
npm run build</code></pre>

      <h3>2. Build Frontend</h3>
      <pre><code>cd frontend
npm run build</code></pre>

      <h2>Deployment Steps</h2>
      <h3>1. Auth Service Deployment</h3>
      <ol>
        <li>Ensure PostgreSQL is running and accessible</li>
        <li>Start the auth service:
          <pre><code>cd services/auth-service
npm start</code></pre>
        </li>
      </ol>

      <h3>2. Frontend Deployment</h3>
      <ol>
        <li>After building, deploy the contents of <code>frontend/dist</code> to your web server</li>
        <li>Configure your web server (nginx/apache) to serve the static files</li>
        <li>For SPA routing, configure the web server to redirect all requests to index.html</li>
      </ol>

      <h2>Azure SSO Configuration</h2>
      <ol>
        <li>Register your application in Azure AD</li>
        <li>Configure:
          <ul>
            <li>Redirect URIs</li>
            <li>Client ID and Secret</li>
            <li>Required permissions for Microsoft Graph API</li>
          </ul>
        </li>
        <li>Update the auth service .env file with your Azure credentials</li>
      </ol>

      <h2>Production Considerations</h2>
      <ul>
        <li>Use process managers like PM2 for Node.js services</li>
        <li>Set up SSL certificates for HTTPS</li>
        <li>Configure proper CORS settings</li>
        <li>Use secure session storage</li>
        <li>Implement proper logging</li>
        <li>Set up monitoring and alerts</li>
      </ul>

      <h2>Security Checklist</h2>
      <ul>
        <li>SSL/TLS certificates installed</li>
        <li>Environment variables properly set</li>
        <li>Database access restricted</li>
        <li>Azure AD permissions configured</li>
        <li>CORS policies set</li>
        <li>Session security configured</li>
        <li>Rate limiting enabled</li>
        <li>Logging configured</li>
        <li>Monitoring set up</li>
      </ul>
    </div>
  );
};

export default DeploymentGuide;
