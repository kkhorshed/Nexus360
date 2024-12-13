import { Helmet } from 'react-helmet';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Helmet>
        <title>CRM Dashboard</title>
        <meta name="description" content="CRM Dashboard" />
      </Helmet>

      <main className={styles.main}>
        <h1 className={styles.title}>Dashboard</h1>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Total Customers</h2>
            <p className={styles.stat}>1,234</p>
          </div>

          <div className={styles.card}>
            <h2>Active Deals</h2>
            <p className={styles.stat}>45</p>
          </div>

          <div className={styles.card}>
            <h2>Team Members</h2>
            <p className={styles.stat}>12</p>
          </div>

          <div className={styles.card}>
            <h2>Monthly Revenue</h2>
            <p className={styles.stat}>$45,678</p>
          </div>
        </div>

        <div className={styles.activities}>
          <h2>Recent Activities</h2>
          <div className={styles.activityList}>
            <p>Activity feed will be implemented here</p>
          </div>
        </div>
      </main>
    </div>
  );
}
