import React, { useState } from 'react';
import PageWrapper from '../components/Common/PageWrapper';
import DealBoard from '../components/Deals/DealBoard';
import DataTable from '../components/Common/DataTable';
import styles from '../styles/Deals.module.css';

interface Deal {
  id: number;
  title: string;
  value: string;
  stage: 'New' | 'In Progress' | 'Closed';
  company?: string;
  lastUpdated?: string;
}

const mockDeals: Deal[] = [
  {
    id: 1,
    title: 'Enterprise Software License',
    value: '$50,000',
    stage: 'New',
    company: 'Acme Corp',
    lastUpdated: '2 hours ago'
  },
  {
    id: 2,
    title: 'Consulting Services',
    value: '$25,000',
    stage: 'In Progress',
    company: 'TechStart Inc',
    lastUpdated: '1 day ago'
  },
  {
    id: 3,
    title: 'Support Package',
    value: '$10,000',
    stage: 'Closed',
    company: 'Global Systems',
    lastUpdated: '3 days ago'
  },
  {
    id: 4,
    title: 'Custom Development',
    value: '$75,000',
    stage: 'In Progress',
    company: 'Innovation Labs',
    lastUpdated: '5 hours ago'
  },
  {
    id: 5,
    title: 'Hardware Supply',
    value: '$30,000',
    stage: 'New',
    company: 'Tech Solutions',
    lastUpdated: '1 hour ago'
  }
];

const Deals: React.FC = () => {
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');

  return (
    <PageWrapper
      title="Deals"
      description="Track and manage your sales pipeline"
    >
      <div id="Deals.controls" className={styles.headerControls}>
        <button className={styles.addButton}>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add New Deal
        </button>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleButton} ${viewMode === 'board' ? styles.active : ''}`}
            onClick={() => setViewMode('board')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
            </svg>
            Board
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

      {viewMode === 'board' ? (
        <div id="Deals.board" className={styles.boardContainer}>
          <DealBoard deals={mockDeals} />
        </div>
      ) : (
        <div id="Deals.content" className={styles.contentContainer}>
          <DataTable
            columns={[
              { key: 'title', header: 'Deal' },
              { key: 'value', header: 'Value' },
              { key: 'stage', header: 'Stage' },
              { key: 'company', header: 'Company' },
              { key: 'lastUpdated', header: 'Last Updated' }
            ]}
            data={mockDeals}
            onRowClick={console.log}
          />
        </div>
      )}
    </PageWrapper>
  );
};

export default Deals;
