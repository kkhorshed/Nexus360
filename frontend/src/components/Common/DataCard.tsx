import React from 'react';
import styles from '../../styles/DataCard.module.css';

interface DataCardProps {
  title: string;
  subtitle?: string;
  status?: string;
  value?: string | number;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  subtitle,
  status,
  value,
  icon,
  onClick
}) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.cardHeader}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <div className={styles.cardContent}>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      <div className={styles.cardFooter}>
        {status && <span className={styles.status}>{status}</span>}
        {value && <span className={styles.value}>{value}</span>}
      </div>
    </div>
  );
};

export default DataCard;
