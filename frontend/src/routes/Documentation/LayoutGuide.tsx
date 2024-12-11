import React from 'react';
import styles from '../../styles/Documentation.module.css';

const LayoutGuide: React.FC = () => {
  return (
    <div className={styles.docContent}>
      <h1>Layout System Documentation</h1>
      
      <section>
        <h2>Overview</h2>
        <p>
          The CRM application uses a two-level layout system consisting of MainLayout and PageWrapper 
          components to provide a consistent and organized user interface.
        </p>
      </section>

      <section>
        <h2>MainLayout Component</h2>
        <p>
          MainLayout is the top-level layout component that provides the basic structure for the application.
          It includes:
        </p>
        <ul>
          <li><strong>Header:</strong> Contains the application header with navigation and user controls</li>
          <li><strong>Sider:</strong> Left sidebar with main navigation menu (250px width)</li>
          <li><strong>Content Area:</strong> Main content region where page content is rendered</li>
        </ul>
        <div className={styles.codeExample}>
          <pre>
{`<MainLayout>
  <Header />
  <Layout>
    <Sider>
      {/* Navigation Menu */}
    </Sider>
    <Content>
      {/* Page Content */}
    </Content>
  </Layout>
</MainLayout>`}
          </pre>
        </div>
      </section>

      <section>
        <h2>PageWrapper Component</h2>
        <p>
          PageWrapper is used within individual route components to maintain consistent page structure.
          It provides:
        </p>
        <ul>
          <li><strong>Container:</strong> Outer container with layout.container class</li>
          <li><strong>Page Wrapper:</strong> Inner wrapper with layout.pageWrapper class</li>
          <li><strong>Main Frame:</strong> Content frame with layout.mainFrame class</li>
          <li><strong>Page Header:</strong> Standardized header with title and description</li>
          <li><strong>Content Area:</strong> Flexible content section for page-specific content</li>
        </ul>
        <div className={styles.codeExample}>
          <pre>
{`<PageWrapper
  title="Page Title"
  description="Page description text"
>
  {/* Page Content */}
</PageWrapper>`}
          </pre>
        </div>
      </section>

      <section>
        <h2>Usage Guidelines</h2>
        <h3>When to Use MainLayout</h3>
        <ul>
          <li>Used automatically for all authenticated routes</li>
          <li>Not used for the login page and other authentication-related pages</li>
          <li>Provides consistent navigation and structure across the application</li>
        </ul>

        <h3>When to Use PageWrapper</h3>
        <ul>
          <li>Use in all route components that need standard page structure</li>
          <li>Required for maintaining consistent spacing and header styling</li>
          <li>Helps maintain accessibility with proper heading hierarchy</li>
        </ul>
      </section>

      <section>
        <h2>Layout Hierarchy</h2>
        <div className={styles.codeExample}>
          <pre>
{`App
└── MainLayout (overall app structure)
    ├── Header
    ├── Sider (navigation)
    └── Content
        └── Route Components
            └── PageWrapper
                ├── Page Header
                └── Page Content`}
          </pre>
        </div>
      </section>

      <section>
        <h2>CSS Classes</h2>
        <h3>MainLayout Classes</h3>
        <ul>
          <li><code>mainLayout</code>: Applied to the root layout container</li>
          <li><code>header</code>: Styles for the top header section</li>
          <li><code>sider</code>: Styles for the left sidebar navigation</li>
          <li><code>content</code>: Styles for the main content area</li>
        </ul>

        <h3>PageWrapper Classes</h3>
        <ul>
          <li><code>container</code>: Outer container styles</li>
          <li><code>pageWrapper</code>: Inner wrapper styles</li>
          <li><code>mainFrame</code>: Content frame styles</li>
          <li><code>pageHeader</code>: Styles for the page header section</li>
          <li><code>pageContent</code>: Styles for the main content section</li>
        </ul>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul>
          <li>Always use PageWrapper for route components to maintain consistency</li>
          <li>Provide meaningful titles and descriptions in PageWrapper props</li>
          <li>Avoid nested PageWrapper components</li>
          <li>Use the provided CSS classes for custom components to maintain consistent styling</li>
          <li>Consider responsive design when adding content within the layout structure</li>
        </ul>
      </section>
    </div>
  );
};

export default LayoutGuide;
