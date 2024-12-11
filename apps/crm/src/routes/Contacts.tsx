import React, { useState } from 'react';
import PageWrapper from '../components/Common/PageWrapper';
import DataCard from '../components/Common/DataCard';
import DataTable from '../components/Common/DataTable';
import layout from '../styles/Layout.module.css';
import styles from '../styles/Contacts.module.css';

const Contacts: React.FC = () => {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  return (
    <PageWrapper
      title="Contacts"
      description="Manage your contacts and track interactions"
    >
      <section id="Contacts.controls" className={layout.section}>
        <div className={styles.headerControls}>
          <button className={styles.addButton}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add New Contact
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
        <section id="Contacts.cards" className={layout.section}>
          <div className={styles.cardGrid}>
            {/* Contact cards content */}
          </div>
        </section>
      ) : (
        <section id="Contacts.content" className={layout.section}>
          {/* Contact table content */}
        </section>
      )}
    </PageWrapper>
  );
};

export default Contacts;
