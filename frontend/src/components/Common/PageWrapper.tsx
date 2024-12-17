import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import layout from '../../styles/Layout.module.css';

interface PageWrapperProps {
  children: ReactNode;
  title: string;
  description: string;
  controls?: ReactNode;
}

const PageWrapper = ({ 
  children, 
  title, 
  description, 
  controls 
}: PageWrapperProps): JSX.Element => {
  const location = useLocation();
  const path = location.pathname.split('/')[1];
  const pageName = path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Home';
  const currentPage = path === 'settings' ? 'Settings' : pageName;

  return (
    <div className={layout.container}>
      <div id={`${currentPage}.page-wrapper`} className={layout.pageWrapper}>
        <div id={`${currentPage}.main-frame`} className={layout.mainFrame}>
          <div className={layout.pageHeader}>
            <div className={layout.headerContent}>
              <h1 className={layout.pageTitle}>{title}</h1>
              <p className={layout.pageDescription}>{description}</p>
            </div>
            {controls && (
              <div className={layout.pageControls}>
                {controls}
              </div>
            )}
          </div>
          <div className={layout.pageContent}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageWrapper;
