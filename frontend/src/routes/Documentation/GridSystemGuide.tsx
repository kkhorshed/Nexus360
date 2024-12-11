import React from 'react';
import styles from '../../styles/Documentation.module.css';
import layout from '../../styles/Layout.module.css';
import companiesStyles from '../../styles/Companies.module.css';

const GridSystemGuide: React.FC = () => {
  return (
    <div className={styles.docContent}>
      <h1>Page Layout Structure: Companies Page Example</h1>
      
      <section>
        <h2>Page Structure Overview</h2>
        <p>
          The Companies page demonstrates a typical layout structure using the PageWrapper component
          and grid system. Here's a breakdown of its layout components:
        </p>
      </section>

      <section>
        <h2>1. Header Controls Section</h2>
        <div style={{ border: '1px dashed #91d5ff', padding: '20px', marginBottom: '2rem', borderRadius: '4px' }}>
          <div className={companiesStyles.headerControls}>
            <button className={companiesStyles.addButton}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Add New Company
            </button>
            <div className={companiesStyles.viewToggle}>
              <button className={`${companiesStyles.toggleButton} ${companiesStyles.active}`}>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z"/>
                </svg>
                Cards
              </button>
              <button className={companiesStyles.toggleButton}>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M3 3h18v4H3V3zm0 7h18v4H3v-4zm0 7h18v4H3v-4z"/>
                </svg>
                Table
              </button>
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <code>Layout Structure:</code>
            <pre style={{ background: '#f6f8fa', padding: '1rem', borderRadius: '4px' }}>
{`<PageWrapper>
  <section className={layout.section}>
    <div className={styles.headerControls}>
      <button className={styles.addButton}>
        Add New Company
      </button>
      <div className={styles.viewToggle}>
        <button>Cards</button>
        <button>Table</button>
      </div>
    </div>
  </section>
  ...
</PageWrapper>`}
            </pre>
          </div>
        </div>

        <h2>2. Card Grid Layout</h2>
        <div style={{ border: '1px dashed #b7eb8f', padding: '20px', marginBottom: '2rem', borderRadius: '4px' }}>
          <div className={companiesStyles.cardGrid}>
            {[1, 2, 3].map((num) => (
              <div key={num} className={companiesStyles.companyCard}>
                <h3>Company {num}</h3>
                <div className={companiesStyles.companyInfo}>
                  <div className={companiesStyles.companyDetail}>Industry: Technology</div>
                  <div className={companiesStyles.companyDetail}>Location: New York, USA</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem' }}>
            <code>Grid Structure:</code>
            <pre style={{ background: '#f6f8fa', padding: '1rem', borderRadius: '4px' }}>
{`// CSS Grid Layout
.cardGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 0.5rem;
}

// Component Structure
<section className={layout.section}>
  <div className={styles.cardGrid}>
    {companies.map(company => (
      <DataCard
        key={company.id}
        title={company.name}
        subtitle={company.industry}
        ...
      />
    ))}
  </div>
</section>`}
            </pre>
          </div>
        </div>

        <h2>3. Table View Layout</h2>
        <div style={{ border: '1px dashed #ffd591', padding: '20px', marginBottom: '2rem', borderRadius: '4px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Company Name</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Industry</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Location</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((num) => (
                <tr key={num} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '1rem' }}>Company {num}</td>
                  <td style={{ padding: '1rem' }}>Technology</td>
                  <td style={{ padding: '1rem' }}>New York, USA</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`${companiesStyles.status} ${companiesStyles.statusActive}`}>
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '1rem' }}>
            <code>Table Structure:</code>
            <pre style={{ background: '#f6f8fa', padding: '1rem', borderRadius: '4px' }}>
{`<section className={layout.section}>
  <DataTable
    columns={columns}
    data={companiesData}
    onRowClick={handleRowClick}
  />
</section>`}
            </pre>
          </div>
        </div>

        <h2>4. Responsive Behavior</h2>
        <pre style={{ background: '#f6f8fa', padding: '1rem', borderRadius: '4px' }}>
{`/* Responsive styles */
@media (max-width: 768px) {
  .headerControls {
    flex-direction: column;
    align-items: stretch;
  }

  .cardGrid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .viewToggle {
    width: 100%;
  }
}`}
        </pre>
      </section>

      <section>
        <h2>Key Layout Features</h2>
        <ul>
          <li>Uses PageWrapper for consistent page structure</li>
          <li>Flexible grid system for card layouts</li>
          <li>Responsive design with mobile breakpoints</li>
          <li>Toggle between grid and table views</li>
          <li>Consistent spacing using layout utility classes</li>
        </ul>
      </section>
    </div>
  );
};

export default GridSystemGuide;
