import React from 'react';
import UIElements from './UIElements';
import styles from '../../styles/MainLayout.module.css';

interface UIGuideProps {
  show: boolean;
}

const UIGuide: React.FC<UIGuideProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className={styles.guideContainer}>
      <UIElements
        elements={{
          container: true,
          pageWrapper: true,
          mainFrame: true,
          section: true,
          controls: true,
          content: true,
          cards: true,
        }}
      />
    </div>
  );
};

export default UIGuide;
