import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel
} from '@mui/material';

interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], record: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (record: T) => void;
  pagination?: {
    total: number;
    current: number;
    pageSize: number;
    onChange: (page: number, pageSize: number) => void;
  };
  sorting?: {
    field: keyof T | null;
    order: 'asc' | 'desc';
    onChange: (field: keyof T, order: 'asc' | 'desc') => void;
  };
}

function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
  pagination,
  sorting
}: DataTableProps<T>) {
  const handleChangePage = (_: unknown, newPage: number) => {
    if (pagination) {
      pagination.onChange(newPage + 1, pagination.pageSize);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (pagination) {
      pagination.onChange(1, parseInt(event.target.value, 10));
    }
  };

  const handleSort = (field: keyof T) => {
    if (sorting && sorting.onChange) {
      const isAsc = sorting.field === field && sorting.order === 'asc';
      sorting.onChange(field, isAsc ? 'desc' : 'asc');
    }
  };

  const renderCellContent = (column: Column<T>, record: T): React.ReactNode => {
    const value = record[column.key];
    if (column.render) {
      return column.render(value, record);
    }
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.sortable && sorting ? (
                    <TableSortLabel
                      active={sorting.field === column.key}
                      direction={sorting.field === column.key ? sorting.order : 'asc'}
                      onClick={() => handleSort(column.key)}
                    >
                      {column.title}
                    </TableSortLabel>
                  ) : (
                    column.title
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((record) => (
              <TableRow
                key={record.id}
                hover={!!onRowClick}
                onClick={() => onRowClick?.(record)}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((column) => (
                  <TableCell key={`${record.id}-${String(column.key)}`}>
                    {renderCellContent(column, record)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.current - 1}
          rowsPerPage={pagination.pageSize}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50]}
        />
      )}
    </Paper>
  );
}

export default DataTable;
