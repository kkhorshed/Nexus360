import React from 'react';
import styles from '../../styles/Documentation.module.css';

const SSOSetupGuide: React.FC = () => {
  return (
    <div className={styles.docContent}>
      <h1>Azure SSO Setup Guide</h1>
      
      <section>
        <h2>Prerequisites</h2>
        <ul>
          <li>Azure Active Directory account with admin access</li>
          <li>CRM application registered in Azure AD</li>
          <li>Access to application configuration files</li>
        </ul>
      </section>

      <section>
        <h2>Azure AD Configuration</h2>
        <ol>
          <li>
            <h3>Register Application</h3>
            <p>In Azure Portal:</p>
            <ol>
              <li>Navigate to Azure Active Directory</li>
              <li>Select "App registrations"</li>
              <li>Click "New registration"</li>
              <li>Enter application details:
                <ul>
                  <li>Name: CRM Application</li>
                  <li>Supported account types: Single tenant</li>
                  <li>Redirect URI: https://your-domain/auth/callback</li>
                </ul>
              </li>
            </ol>
          </li>
          <li>
            <h3>Configure Authentication</h3>
            <pre className={styles.codeExample}>
{`{
  "auth": {
    "clientId": "your-client-id",
    "authority": "https://login.microsoftonline.com/your-tenant-id",
    "redirectUri": "https://your-domain/auth/callback"
  }
}`}
            </pre>
          </li>
        </ol>
      </section>

      <section>
        <h2>Application Configuration</h2>
        <h3>Environment Variables</h3>
        <pre className={styles.codeExample}>
{`# Auth Service .env
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_TENANT_ID=your-tenant-id
AZURE_REDIRECT_URI=https://your-domain/auth/callback

# Frontend .env
VITE_AUTH_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
VITE_CLIENT_ID=your-client-id`}
        </pre>

        <h3>MSAL Configuration</h3>
        <pre className={styles.codeExample}>
{`// src/config/msalConfig.ts
export const msalConfig = {
  auth: {
    clientId: process.env.VITE_CLIENT_ID,
    authority: process.env.VITE_AUTH_AUTHORITY,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read", "profile", "email"]
};`}
        </pre>
      </section>

      <section>
        <h2>Implementation Steps</h2>
        <ol>
          <li>
            <h3>Backend Setup</h3>
            <pre className={styles.codeExample}>
{`// src/middleware/auth.ts
import { validateToken } from '../utils/azure';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const validated = await validateToken(token);
    req.user = validated;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};`}
            </pre>
          </li>
          <li>
            <h3>Frontend Integration</h3>
            <pre className={styles.codeExample}>
{`// src/auth/AuthProvider.tsx
import { MsalProvider, useMsal } from "@azure/msal-react";
import { msalInstance } from "./msalConfig";

export const AuthProvider: React.FC = ({ children }) => {
  return (
    <MsalProvider instance={msalInstance}>
      {children}
    </MsalProvider>
  );
};`}
            </pre>
          </li>
        </ol>
      </section>

      <section>
        <h2>Testing SSO</h2>
        <ol>
          <li>Configure test users in Azure AD</li>
          <li>Set up test environment variables</li>
          <li>Verify login flow:
            <ul>
              <li>Click login button</li>
              <li>Redirect to Microsoft login</li>
              <li>Authorize application</li>
              <li>Successful callback handling</li>
            </ul>
          </li>
          <li>Test token validation</li>
          <li>Verify user information</li>
        </ol>
      </section>

      <section>
        <h2>Troubleshooting</h2>
        <h3>Common Issues</h3>
        <ul>
          <li>
            <strong>Invalid Client Error</strong>
            <p>Verify client ID and secret in environment variables</p>
          </li>
          <li>
            <strong>Redirect URI Mismatch</strong>
            <p>Ensure URI in Azure AD matches application config</p>
          </li>
          <li>
            <strong>Token Validation Failure</strong>
            <p>Check authority URL and tenant ID configuration</p>
          </li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <ul>
          <li>Enable token encryption</li>
          <li>Implement proper session management</li>
          <li>Configure secure token storage</li>
          <li>Set up proper CORS policies</li>
          <li>Regular security audits</li>
        </ul>
      </section>
    </div>
  );
};

export default SSOSetupGuide;
