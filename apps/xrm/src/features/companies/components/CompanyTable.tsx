import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BusinessIcon from '@mui/icons-material/Business';
import { CompanyTableProps, VisibleColumns } from '../types';
import { TABLE_HEAD_CELLS } from '../constants';
import { isVisibleColumn, formatWebsiteUrl } from '../utils/helpers';
import PageControls from './PageControls';

const isColumnKey = (key: string): key is keyof VisibleColumns => {
  return ['name', 'industry', 'companyType', 'email', 'phone', 'website'].includes(key);
};

export default function CompanyTable({
  companies,
  onEdit,
  page,
  rowsPerPage,
  order,
  orderBy,
  visibleColumns,
  onPageChange,
  onRowsPerPageChange,
  onRequestSort,
}: CompanyTableProps) {
  const visibleHeadCells = TABLE_HEAD_CELLS.filter(
    cell => isVisibleColumn(cell.id, visibleColumns) && visibleColumns[cell.id]
  );

  const handleSort = (property: string) => {
    if (isColumnKey(property)) {
      onRequestSort(property);
    }
  };

  return (
    <Paper elevation={2}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {visibleHeadCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  {headCell.sortable ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label
                  )}
                </TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((company) => (
                <TableRow 
                  key={company.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {visibleColumns.name && (
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon 
                          color="primary" 
                          sx={{ 
                            backgroundColor: 'primary.light',
                            borderRadius: '50%',
                            p: 0.5,
                          }} 
                        />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {company.name}
                        </Typography>
                      </Box>
                    </TableCell>
                  )}
                  {visibleColumns.industry && (
                    <TableCell>
                      <Tooltip title={`View all ${company.industry} companies`}>
                        <Chip 
                          label={company.industry} 
                          size="small"
                          sx={{ cursor: 'pointer' }}
                        />
                      </Tooltip>
                    </TableCell>
                  )}
                  {visibleColumns.companyType && (
                    <TableCell>
                      <Tooltip title={`View all ${company.companyType} companies`}>
                        <Chip 
                          label={company.companyType} 
                          size="small"
                          variant="outlined"
                          sx={{ cursor: 'pointer' }}
                        />
                      </Tooltip>
                    </TableCell>
                  )}
                  {visibleColumns.email && (
                    <TableCell>
                      <Tooltip title="Send email">
                        <Typography 
                          variant="body2" 
                          component="a"
                          href={`mailto:${company.email}`}
                          sx={{ 
                            cursor: 'pointer',
                            textDecoration: 'none',
                            color: 'text.secondary',
                            '&:hover': { color: 'primary.main' }
                          }}
                        >
                          {company.email}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  )}
                  {visibleColumns.phone && (
                    <TableCell>
                      <Tooltip title="Call">
                        <Typography 
                          variant="body2" 
                          component="a"
                          href={`tel:${company.phone}`}
                          sx={{ 
                            cursor: 'pointer',
                            textDecoration: 'none',
                            color: 'text.secondary',
                            '&:hover': { color: 'primary.main' }
                          }}
                        >
                          {company.phone}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  )}
                  {visibleColumns.website && (
                    <TableCell>
                      <Tooltip title="Visit website">
                        <Typography 
                          variant="body2"
                          component="a"
                          href={formatWebsiteUrl(company.website)}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            cursor: 'pointer',
                            textDecoration: 'none',
                            color: 'text.secondary',
                            '&:hover': { color: 'primary.main' }
                          }}
                        >
                          {company.website}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  )}
                  <TableCell align="right">
                    <Tooltip title="Edit company">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(company)}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'primary.light',
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PageControls
        count={companies.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
}
