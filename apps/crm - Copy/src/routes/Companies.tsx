import React, { useState } from 'react';
import PageWrapper from '../components/Common/PageWrapper';
import DataCard from '../components/Common/DataCard';
import DataTable from '../components/Common/DataTable';
import layout from '../styles/Layout.module.css';
import styles from '../styles/Companies.module.css';

interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  employees: number;
  revenue: string;
  status: string;
}

// Sample data
const companiesData: Company[] = [
  {
    id: 1,
    name: 'Acme Corporation',
    industry: 'Technology',
    location: 'New York, USA',
    employees: 500,
    revenue: '$50M',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Global Industries',
    industry: 'Manufacturing',
    location: 'Chicago, USA',
    employees: 1000,
    revenue: '$100M',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Tech Solutions',
    industry: 'Software',
    location: 'San Francisco, USA',
    employees: 250,
    revenue: '$25M',
    status: 'Active'
  }
];

// Table columns configuration
const columns = [
  { key: 'name', header: 'Company Name' },
  { key: 'industry', header: 'Industry' },
  { key: 'location', header: 'Location' },
  { key: 'employees', header: 'Employees' },
  { key: 'revenue', header: 'Revenue' },
  {
    key: 'status',
    header: 'Status',
    render: (value: string) => (
      <span className={`${styles.status} ${styles.statusActive}`}>{value}</span>
    )
  }
];

const Companies: React.FC = () => {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  const handleRowClick = (company: Company) => {
    console.log('Company clicked:', company);
  };

  const handleAddNew = () => {
    console.log('Add new company clicked');
  };

  return (
    <PageWrapper
      title="Companies"
      description="Manage your company relationships and track key information"
    >
      <section id="Companies.controls" className={layout.section}>
        <div className={styles.headerControls}>
          <button className={styles.addButton} onClick={handleAddNew}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add New Company
          </button>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleButton} ${viewMode === 'card' ? styles.active : ''}`}
              onClick={() => setViewMode('card')}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z"/>
              </svg>
              Cards
            </button>
            <button
              className={`${styles.toggleButton} ${viewMode === 'table' ? styles.active : ''}`}
              onClick={() => setViewMode('table')}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M3 3h18v4H3V3zm0 7h18v4H3v-4zm0 7h18v4H3v-4z"/>
              </svg>
              Table
            </button>
          </div>
        </div>
      </section>

      {viewMode === 'card' ? (
        <section id="Companies.cards" className={layout.section}>
          <div className={styles.cardGrid}>
            {companiesData.map((company) => (
              <DataCard
                key={company.id}
                title={company.name}
                subtitle={company.industry}
                status={company.status}
                value={company.revenue}
                icon={
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path
                      fill="currentColor"
                      d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"
                    />
                  </svg>
                }
                onClick={() => handleRowClick(company)}
              />
            ))}
          </div>
        </section>
      ) : (
        <section id="Companies.content" className={layout.section}>
          <DataTable
            columns={columns}
            data={companiesData}
            onRowClick={handleRowClick}
          />
        </section>
      )}
    </PageWrapper>
  );
};

export default Companies;
