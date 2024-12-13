import React from 'react';
import styles from '../styles/MainLayout.module.css';

interface UIGuideProps {
  children?: React.ReactNode;
}

const UIGuide: React.FC<UIGuideProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>UI Guide</div>
        <div className={styles.userMenu}>Theme Switcher</div>
      </header>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <nav>
            <a href="#buttons" className={styles.menuItem}>Buttons</a>
            <a href="#forms" className={styles.menuItem}>Forms</a>
            <a href="#cards" className={styles.menuItem}>Cards</a>
            <a href="#tables" className={styles.menuItem}>Tables</a>
          </nav>
        </aside>
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
      <footer className={styles.footer}>
        UI Guide Footer
      </footer>
    </div>
  );
};

export default UIGuide;
