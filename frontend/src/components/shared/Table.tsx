import React, { useState, useMemo } from 'react';
import { TableColumn } from '../../utils/types';

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (record: T) => void;
  loading?: boolean;
  sortable?: boolean;
  pagination?: {
    total: number;
    current: number;
    pageSize: number;
    onChange: (page: number) => void;
  };
}

export function Table<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  loading = false,
  sortable = false,
  pagination
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);

  const sortedData = useMemo(() => {
    if (!sortConfig || !sortable) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig, sortable]);

  const handleSort = (key: keyof T) => {
    if (!sortable) return;

    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const renderPagination = () => {
    if (!pagination) return null;

    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="flex justify-end items-center space-x-2 mt-4">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => pagination.onChange(page)}
            className={`px-3 py-1 rounded ${
              page === pagination.current
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  sortable && column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                onClick={() => column.sortable && handleSort(column.key)}
                style={{ width: column.width }}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.title}</span>
                  {sortable && column.sortable && sortConfig?.key === column.key && (
                    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((record) => (
            <tr
              key={record.id}
              onClick={() => onRowClick?.(record)}
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            >
              {columns.map((column) => (
                <td
                  key={`${record.id}-${String(column.key)}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render
                    ? column.render(record[column.key], record)
                    : String(record[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination()}
    </div>
  );
}
