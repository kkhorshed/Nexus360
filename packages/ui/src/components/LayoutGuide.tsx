import React from 'react';
import styles from '../styles/MainLayout.module.css';

interface LayoutGuideProps {
  children?: React.ReactNode;
}

const LayoutGuide: React.FC<LayoutGuideProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>Logo</div>
        <div className={styles.userMenu}>User Menu</div>
      </header>
      <div className={styles.content}>
        <aside className={styles.sidebar}>Sidebar</aside>
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
      <footer className={styles.footer}>
        Footer
      </footer>
    </div>
  );
};

export default LayoutGuide;
