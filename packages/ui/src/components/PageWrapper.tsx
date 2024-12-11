import React from 'react';

export interface PageWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, description, children }) => {
  return (
    <div className="page-wrapper">
      <header className="page-header">
        <h1 className="page-title">{title}</h1>
        <p className="page-description">{description}</p>
      </header>
      <main className="page-content">
        {children}
      </main>
    </div>
  );
};

export default PageWrapper;
