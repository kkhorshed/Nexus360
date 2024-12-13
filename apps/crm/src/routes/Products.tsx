import React, { useState } from 'react';
import PageWrapper from '../components/Common/PageWrapper';
import DataCard from '../components/Common/DataCard';
import DataTable from '../components/Common/DataTable';
import layout from '../styles/Layout.module.css';
import styles from '../styles/Products.module.css';

const Products: React.FC = () => {
  const [viewMode, setViewMode] = useState<'catalog' | 'table'>('catalog');

  const mockProducts = [
    {
      id: 1,
      name: 'Enterprise CRM',
      category: 'Software',
      price: '$999/month',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Team Collaboration',
      category: 'Software',
      price: '$499/month',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Analytics Suite',
      category: 'Software',
      price: '$799/month',
      status: 'Active'
    }
  ];

  return (
    <PageWrapper
      title="Products"
      description="Browse and manage your product catalog"
    >
      <section id="Products.controls" className={layout.section}>
        <div className={styles.headerControls}>
          <button className={styles.addButton}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add New Product
          </button>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleButton} ${viewMode === 'catalog' ? styles.active : ''}`}
              onClick={() => setViewMode('catalog')}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z"/>
              </svg>
              Catalog
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

      {viewMode === 'catalog' ? (
        <section id="Products.catalog" className={layout.section}>
          <div className={styles.productGrid}>
            {mockProducts.map(product => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productIcon}>
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                </div>
                <h3>{product.name}</h3>
                <p className={styles.category}>{product.category}</p>
                <p className={styles.price}>{product.price}</p>
                <span className={styles.status}>{product.status}</span>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section id="Products.content" className={layout.section}>
          <DataTable
            columns={[
              { key: 'name', header: 'Product Name' },
              { key: 'category', header: 'Category' },
              { key: 'price', header: 'Price' },
              { key: 'status', header: 'Status' }
            ]}
            data={mockProducts}
            onRowClick={console.log}
          />
        </section>
      )}
    </PageWrapper>
  );
};

export default Products;
