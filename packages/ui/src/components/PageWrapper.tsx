import React from 'react';
import styles from '../styles/PageWrapper.module.css';

export interface PageWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ 
  title, 
  description, 
  children 
}) => {
  return (
    <div className={styles.pageWrapper}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{title}</h1>
        {description && (
          <p className={styles.pageDescription}>{description}</p>
        )}
      </header>
      <main className={styles.pageContent}>
        {children}
      </main>
    </div>
  );
};

export default PageWrapper;
