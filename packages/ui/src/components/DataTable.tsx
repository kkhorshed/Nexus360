import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnsType<T>;
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  rowKey?: string | ((record: T) => string);
  onRowClick?: (record: T) => void;
  className?: string;
}

function DataTable<T extends object>({ 
  data,
  columns,
  loading = false,
  pagination,
  rowKey = 'id',
  onRowClick,
  className = ''
}: DataTableProps<T>) {
  return (
    <Table
      className={`data-table ${className}`}
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={
        pagination
          ? {
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: pagination.onChange,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }
          : false
      }
      rowKey={rowKey}
      onRow={onRowClick ? (record) => ({
        onClick: () => onRowClick(record)
      }) : undefined}
    />
  );
}

export default DataTable;
