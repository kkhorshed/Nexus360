import { TablePagination } from '@mui/material';

interface PageControlsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (pageSize: number) => void;
}

export default function PageControls({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: PageControlsProps) {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={(_, newPage) => onPageChange(newPage)}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
      rowsPerPageOptions={[10, 25, 50, 100]}
    />
  );
}
