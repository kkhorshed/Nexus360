import React from 'react';
import styles from '../../styles/Documentation.module.css';

const DatabaseGuide: React.FC = () => {
  return (
    <div className={styles.docContent}>
      <h1>Database Architecture</h1>
      
      <section>
        <h2>Schema Design</h2>
        <div className={styles.codeExample}>
          <pre>
{`┌──────────────┐     ┌──────────────┐
│   Users      │     │  Companies   │
├──────────────┤     ├──────────────┤
│ id           │     │ id           │
│ email        │     │ name         │
│ name         │     │ industry     │
│ role         │     │ location     │
└──────────────┘     │ employees    │
       ▲             │ revenue      │
       │             └──────────────┘
       │                    ▲
       │                    │
┌──────────────┐     ┌──────────────┐
│   Contacts   │     │    Deals     │
├──────────────┤     ├──────────────┤
│ id           │     │ id           │
│ user_id      │ ◄── │ contact_id   │
│ company_id   │     │ company_id   │
│ email        │     │ amount       │
│ phone        │     │ status       │
└──────────────┘     └──────────────┘`}
          </pre>
        </div>
      </section>

      <section>
        <h2>Table Relationships</h2>
        <ul>
          <li><strong>Users to Contacts:</strong> One-to-Many</li>
          <li><strong>Companies to Contacts:</strong> One-to-Many</li>
          <li><strong>Companies to Deals:</strong> One-to-Many</li>
          <li><strong>Contacts to Deals:</strong> One-to-Many</li>
        </ul>
      </section>

      <section>
        <h2>Key Tables</h2>
        
        <h3>Users</h3>
        <pre className={styles.codeExample}>
{`CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
        </pre>

        <h3>Companies</h3>
        <pre className={styles.codeExample}>
{`CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  location VARCHAR(255),
  employees INTEGER,
  revenue DECIMAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
        </pre>

        <h3>Contacts</h3>
        <pre className={styles.codeExample}>
{`CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  company_id UUID REFERENCES companies(id),
  email VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
        </pre>

        <h3>Deals</h3>
        <pre className={styles.codeExample}>
{`CREATE TABLE deals (
  id UUID PRIMARY KEY,
  contact_id UUID REFERENCES contacts(id),
  company_id UUID REFERENCES companies(id),
  amount DECIMAL NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
        </pre>
      </section>

      <section>
        <h2>Indexes</h2>
        <ul>
          <li>Primary keys on all id fields</li>
          <li>Foreign key indexes for relationships</li>
          <li>Unique index on users.email</li>
          <li>Compound index on (company_id, status) for deals</li>
        </ul>
      </section>

      <section>
        <h2>Performance Considerations</h2>
        <ul>
          <li>Indexed fields for frequent queries</li>
          <li>Normalized structure to minimize redundancy</li>
          <li>Timestamp fields for change tracking</li>
          <li>UUID for distributed ID generation</li>
        </ul>
      </section>

      <section>
        <h2>Data Migration</h2>
        <p>Database migrations are managed using TypeORM:</p>
        <pre className={styles.codeExample}>
{`npm run typeorm migration:generate -- -n CreateInitialTables
npm run typeorm migration:run`}
        </pre>
      </section>

      <section>
        <h2>Backup Strategy</h2>
        <ul>
          <li>Daily full backups</li>
          <li>Continuous WAL archiving</li>
          <li>Point-in-time recovery capability</li>
          <li>Automated backup verification</li>
        </ul>
      </section>
    </div>
  );
};

export default DatabaseGuide;
