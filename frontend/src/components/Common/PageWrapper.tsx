import React from 'react';
import { useLocation } from 'react-router-dom';
import layout from '../../styles/Layout.module.css';

interface PageWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, title, description }) => {
  const location = useLocation();
  const path = location.pathname.split('/')[1];
  const pageName = path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Home';
  const currentPage = path === 'settings' ? 'Settings' : pageName;

  return (
    <div className={layout.container}>
      <div id={`${currentPage}.page-wrapper`} className={layout.pageWrapper}>
        <div id={`${currentPage}.main-frame`} className={layout.mainFrame}>
          <div className={layout.pageHeader}>
            <h1 className={layout.pageTitle}>{title}</h1>
            <p className={layout.pageDescription}>{description}</p>
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
