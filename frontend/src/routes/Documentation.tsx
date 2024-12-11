import React, { useState } from 'react';
import PageWrapper from '../components/Common/PageWrapper';
import DeploymentGuide from './Documentation/DeploymentGuide';
import QuickReference from './Documentation/QuickReference';
import LayoutGuide from './Documentation/LayoutGuide';
import GridSystemGuide from './Documentation/GridSystemGuide';
import SystemDesignGuide from './Documentation/SystemDesignGuide';
import DatabaseGuide from './Documentation/DatabaseGuide';
import SSOSetupGuide from './Documentation/SSOSetupGuide';
import layout from '../styles/Layout.module.css';
import styles from '../styles/Documentation.module.css';

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      items: [
        { id: 'introduction', title: 'Introduction' },
        { id: 'quick-start', title: 'Quick Start Guide' },
        { id: 'installation', title: 'Installation' }
      ]
    },
    {
      id: 'architecture',
      title: 'Architecture',
      items: [
        { id: 'system-design', title: 'System Design' },
        { id: 'database', title: 'Database Architecture' }
      ]
    },
    {
      id: 'development',
      title: 'Development',
      items: [
        { id: 'layout-guide', title: 'Layout System' },
        { id: 'grid-system', title: 'Grid System Examples' }
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment',
      items: [
        { id: 'deployment-guide', title: 'Deployment Guide' },
        { id: 'quick-reference', title: 'Quick Reference' }
      ]
    },
    {
      id: 'security',
      title: 'Security',
      items: [
        { id: 'sso-setup', title: 'Azure SSO Setup' }
      ]
    },
    {
      id: 'features',
      title: 'Features',
      items: [
        { id: 'companies', title: 'Managing Companies' },
        { id: 'contacts', title: 'Working with Contacts' },
        { id: 'deals', title: 'Deal Pipeline' }
      ]
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'system-design':
        return <SystemDesignGuide />;
      case 'database':
        return <DatabaseGuide />;
      case 'deployment-guide':
        return <DeploymentGuide />;
      case 'quick-reference':
        return <QuickReference />;
      case 'layout-guide':
        return <LayoutGuide />;
      case 'grid-system':
        return <GridSystemGuide />;
      case 'sso-setup':
        return <SSOSetupGuide />;
      default:
        return (
          <div className={styles.docContent}>
            <h1>Introduction</h1>
            <p>Welcome to the CRM documentation. This guide will help you understand and use all the features of our system effectively.</p>
            
            <h2>System Overview</h2>
            <p>Our CRM system provides comprehensive tools for managing your customer relationships, sales pipeline, and team collaboration.</p>
            
            <h2>Documentation Structure</h2>
            <ul>
              <li><strong>Architecture:</strong> System design and database architecture</li>
              <li><strong>Development:</strong> Layout system and implementation guides</li>
              <li><strong>Deployment:</strong> Setup and configuration instructions</li>
              <li><strong>Security:</strong> SSO setup and security best practices</li>
              <li><strong>Features:</strong> Detailed feature documentation</li>
            </ul>
            
            <h2>Key Features</h2>
            <ul>
              <li>Company and contact management</li>
              <li>Deal pipeline tracking</li>
              <li>Team collaboration tools</li>
              <li>Product catalog management</li>
              <li>Reporting and analytics</li>
            </ul>
          </div>
        );
    }
  };

  const renderTableOfContents = () => {
    switch (activeSection) {
      case 'system-design':
        return (
          <ul>
            <li><a href="#architecture-overview">Architecture Overview</a></li>
            <li><a href="#service-communication">Service Communication</a></li>
            <li><a href="#data-flow">Data Flow</a></li>
            <li><a href="#security-architecture">Security Architecture</a></li>
            <li><a href="#scalability">Scalability</a></li>
          </ul>
        );
      case 'database':
        return (
          <ul>
            <li><a href="#schema-design">Schema Design</a></li>
            <li><a href="#table-relationships">Table Relationships</a></li>
            <li><a href="#key-tables">Key Tables</a></li>
            <li><a href="#indexes">Indexes</a></li>
            <li><a href="#performance-considerations">Performance Considerations</a></li>
            <li><a href="#data-migration">Data Migration</a></li>
            <li><a href="#backup-strategy">Backup Strategy</a></li>
          </ul>
        );
      case 'sso-setup':
        return (
          <ul>
            <li><a href="#prerequisites">Prerequisites</a></li>
            <li><a href="#azure-ad-configuration">Azure AD Configuration</a></li>
            <li><a href="#application-configuration">Application Configuration</a></li>
            <li><a href="#implementation-steps">Implementation Steps</a></li>
            <li><a href="#testing-sso">Testing SSO</a></li>
            <li><a href="#troubleshooting">Troubleshooting</a></li>
            <li><a href="#security-considerations">Security Considerations</a></li>
          </ul>
        );
      // ... other cases for different sections
      default:
        return null;
    }
  };

  return (
    <PageWrapper
      title="Documentation"
      description="Browse system documentation and guides"
    >
      <section id="Documentation.controls" className={layout.section}>
        <div className={styles.headerControls}>
          <div className={styles.searchBar}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input type="text" placeholder="Search documentation..." />
          </div>
        </div>
      </section>

      <div className={styles.docLayout}>
        <section id="Documentation.navigation" className={layout.section}>
          <nav className={styles.docNav}>
            {sections.map(section => (
              <div key={section.id} className={styles.navSection}>
                <h3>{section.title}</h3>
                <ul>
                  {section.items.map(item => (
                    <li 
                      key={item.id}
                      className={activeSection === item.id ? styles.active : ''}
                    >
                      <a 
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveSection(item.id);
                        }}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </section>

        <section id="Documentation.content" className={layout.section}>
          {renderContent()}
        </section>

        <section id="Documentation.toc" className={layout.section}>
          <div className={styles.tableOfContents}>
            <h4>On This Page</h4>
            {renderTableOfContents()}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

export default Documentation;
