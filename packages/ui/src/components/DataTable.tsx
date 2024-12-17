import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  CircularProgress,
  Box
} from '@mui/material';

export interface Column<T> {
  title: string;
  key: string;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string | number;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
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
  const handleChangePage = (_event: unknown, newPage: number) => {
    if (pagination) {
      pagination.onChange(newPage + 1, pagination.pageSize);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (pagination) {
      pagination.onChange(1, parseInt(event.target.value, 10));
    }
  };

  const getRowKey = (record: T): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return (record as any)[rowKey];
  };

  const getValue = (record: T, key: string) => {
    return key.split('.').reduce((obj: any, key) => obj?.[key], record);
  };

  return (
    <Paper className={className} sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  style={{ width: column.width }}
                >
                  {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              data.map((record) => (
                <TableRow
                  key={getRowKey(record)}
                  hover={!!onRowClick}
                  onClick={onRowClick ? () => onRowClick(record) : undefined}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(getValue(record, column.key), record)
                        : getValue(record, column.key)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
            {!loading && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.pageSize}
          page={pagination.current - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
}

export default DataTable;
