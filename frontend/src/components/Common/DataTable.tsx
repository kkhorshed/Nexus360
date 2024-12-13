import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from '../../styles/DataTable.module.css';

interface Column {
  key: string;
  header: string;
  render?: (value: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, onRowClick }) => {
  // Convert our column format to Ant Design's format
  const antColumns: ColumnsType<any> = columns.map(col => ({
    title: col.header,
    dataIndex: col.key,
    key: col.key,
    render: col.render,
  }));

  return (
    <div className={styles.tableWrapper}>
      <Table
        columns={antColumns}
        dataSource={data}
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),
        })}
        className={styles.table}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
    </div>
  );
};

export default DataTable;
