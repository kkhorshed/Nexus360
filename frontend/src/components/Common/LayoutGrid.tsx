import React from 'react';
import LayoutElements from './LayoutElements';
import styles from '../../styles/MainLayout.module.css';

interface LayoutGuideProps {
  show: boolean;
}

const LayoutGuide: React.FC<LayoutGuideProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className={styles.guideContainer}>
      <LayoutElements
        elements={{
          container: true,
          header: true,
          sider: true,
          content: true,
          contentWrapper: true,
          headerContainer: true,
          siderContainer: true,
          mainContainer: true,
          menu: true,
        }}
      />
    </div>
  );
};

export default LayoutGuide;
