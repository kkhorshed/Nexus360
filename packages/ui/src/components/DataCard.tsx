import React from 'react';

export interface DataCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  className?: string;
}

const DataCard: React.FC<DataCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend,
  className = ''
}) => {
  return (
    <div className={`data-card ${className}`}>
      <div className="data-card-header">
        {icon && <span className="data-card-icon">{icon}</span>}
        <h3 className="data-card-title">{title}</h3>
      </div>
      <div className="data-card-content">
        <div className="data-card-value">{value}</div>
        {trend && (
          <div className={`data-card-trend ${trend.direction}`}>
            <span className="trend-value">{trend.value}%</span>
            <span className="trend-direction">
              {trend.direction === 'up' ? '↑' : '↓'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCard;
