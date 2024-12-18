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
  Chip,
  Tooltip,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { User } from '../types';
import PageControls from './PageControls';

interface UserTableProps {
  users: User[];
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: keyof User;
  visibleColumns: Record<string, boolean>;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (pageSize: number) => void;
  onRequestSort: (property: keyof User) => void;
  isLoading?: boolean;
  totalCount?: number;
}

const TABLE_HEAD_CELLS = [
  { id: 'displayName' as keyof User, label: 'Name', sortable: true },
  { id: 'userPrincipalName' as keyof User, label: 'Email', sortable: true },
  { id: 'department' as keyof User, label: 'Department', sortable: true },
  { id: 'jobTitle' as keyof User, label: 'Job Title', sortable: true },
  { id: 'officeLocation' as keyof User, label: 'Office Location', sortable: true },
  { id: 'roles' as keyof User, label: 'Roles', sortable: false },
  { id: 'appPermissions' as keyof User, label: 'Apps', sortable: false },
  { id: 'status' as keyof User, label: 'Status', sortable: true },
  { id: 'lastSyncAt' as keyof User, label: 'Last Sync', sortable: true },
  { id: 'createdAt' as keyof User, label: 'Created', sortable: true },
  { id: 'updatedAt' as keyof User, label: 'Updated', sortable: true },
];

interface FormattedDate {
  short: string;
  full: string;
}

const formatDate = (dateString?: string): FormattedDate => {
  if (!dateString) {
    return {
      short: 'N/A',
      full: 'No date available'
    };
  }
  const date = new Date(dateString);
  return {
    short: new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
    }).format(date),
    full: new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'long'
    }).format(date)
  };
};

const LoadingSkeleton = () => (
  <TableRow>
    <TableCell colSpan={12}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading users...
        </Typography>
      </Box>
    </TableCell>
  </TableRow>
);

export default function UserTable({
  users,
  page,
  rowsPerPage,
  order,
  orderBy,
  visibleColumns,
  onPageChange,
  onRowsPerPageChange,
  onRequestSort,
  isLoading = false,
  totalCount,
}: UserTableProps) {
  const visibleHeadCells = TABLE_HEAD_CELLS.filter(
    cell => visibleColumns[cell.id]
  );

  return (
    <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {visibleHeadCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                  sx={{ 
                    backgroundColor: 'background.paper',
                    fontWeight: 'bold'
                  }}
                >
                  {headCell.sortable ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => onRequestSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <LoadingSkeleton />
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleHeadCells.length} align="center">
                  <Typography variant="body1" sx={{ py: 3 }}>
                    No users found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
                >
                  {visibleColumns.displayName && (
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          src={user.profilePictureUrl || undefined}
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            bgcolor: user.status === 'active' ? 'primary.main' : 'grey.500',
                            transition: 'background-color 0.3s'
                          }}
                        >
                          {user.displayName?.charAt(0) || '?'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {user.displayName || 'Unknown User'}
                          </Typography>
                          {user.givenName && user.surname && (
                            <Typography variant="caption" color="textSecondary">
                              {`${user.givenName} ${user.surname}`}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                  )}
                  {visibleColumns.userPrincipalName && (
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          maxWidth: 200
                        }}
                      >
                        {user.email || user.mail || user.userPrincipalName || 'No Email'}
                      </Typography>
                    </TableCell>
                  )}
                  {visibleColumns.department && (
                    <TableCell>
                      <Typography variant="body2">
                        {user.department || 'N/A'}
                      </Typography>
                    </TableCell>
                  )}
                  {visibleColumns.jobTitle && (
                    <TableCell>
                      <Typography variant="body2">
                        {user.jobTitle || 'N/A'}
                      </Typography>
                    </TableCell>
                  )}
                  {visibleColumns.officeLocation && (
                    <TableCell>
                      <Typography variant="body2">
                        {user.officeLocation || 'N/A'}
                      </Typography>
                    </TableCell>
                  )}
                  {visibleColumns.roles && (
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {user.roles?.map((role: string) => (
                          <Chip
                            key={role}
                            label={role}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                  )}
                  {visibleColumns.appPermissions && (
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {user.appPermissions
                          ?.filter((p) => p.hasAccess)
                          .map((p) => (
                            <Chip
                              key={p.appId}
                              label={p.appName}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          ))}
                      </Box>
                    </TableCell>
                  )}
                  {visibleColumns.status && (
                    <TableCell>
                      <Chip
                        label={user.status || 'unknown'}
                        color={user.status === 'active' ? 'success' : 'error'}
                        size="small"
                        sx={{ 
                          minWidth: 80,
                          transition: 'all 0.3s'
                        }}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.lastSyncAt && (
                    <TableCell>
                      <Tooltip title={formatDate(user.lastSyncAt).full}>
                        <Typography variant="body2">
                          {formatDate(user.lastSyncAt).short}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  )}
                  {visibleColumns.createdAt && (
                    <TableCell>
                      <Tooltip title={formatDate(user.createdAt).full}>
                        <Typography variant="body2">
                          {formatDate(user.createdAt).short}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  )}
                  {visibleColumns.updatedAt && (
                    <TableCell>
                      <Tooltip title={formatDate(user.updatedAt).full}>
                        <Typography variant="body2">
                          {formatDate(user.updatedAt).short}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
        <PageControls
          count={totalCount ?? users.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </Box>
    </Paper>
  );
}
