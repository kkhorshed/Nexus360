import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Typography,
  Tooltip,
  SelectChangeEvent,
  useTheme,
} from '@mui/material';
import {
  FirstPage,
  LastPage,
  NavigateNext,
  NavigateBefore,
} from '@mui/icons-material';
import { ROWS_PER_PAGE_OPTIONS } from '../constants';
import { getPageRange } from '../utils/helpers';

interface PageControlsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: SelectChangeEvent<number>) => void;
}

export default function PageControls({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: PageControlsProps) {
  const theme = useTheme();
  const { start, end } = getPageRange(page, rowsPerPage, count);

  const handleFirstPageClick = () => {
    onPageChange(null, 0);
  };

  const handlePreviousPageClick = () => {
    onPageChange(null, page - 1);
  };

  const handleNextPageClick = () => {
    onPageChange(null, page + 1);
  };

  const handleLastPageClick = () => {
    onPageChange(null, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Rows per page:
        </Typography>
        <Select
          value={rowsPerPage}
          onChange={onRowsPerPageChange}
          size="small"
          sx={{
            minWidth: 80,
            height: 32,
            '& .MuiSelect-select': {
              py: 0.5,
            },
          }}
        >
          {ROWS_PER_PAGE_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {`${start}-${end} of ${count}`}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="First page">
            <span>
              <IconButton
                onClick={handleFirstPageClick}
                disabled={page === 0}
                size="small"
                sx={{
                  '&:not(:disabled):hover': {
                    bgcolor: 'primary.light',
                  },
                }}
              >
                <FirstPage fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          
          <Tooltip title="Previous page">
            <span>
              <IconButton
                onClick={handlePreviousPageClick}
                disabled={page === 0}
                size="small"
                sx={{
                  '&:not(:disabled):hover': {
                    bgcolor: 'primary.light',
                  },
                }}
              >
                <NavigateBefore fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 0.5,
              borderRadius: 1,
              bgcolor: 'action.selected',
              minWidth: 48,
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2">
              {page + 1}
            </Typography>
          </Box>

          <Tooltip title="Next page">
            <span>
              <IconButton
                onClick={handleNextPageClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                size="small"
                sx={{
                  '&:not(:disabled):hover': {
                    bgcolor: 'primary.light',
                  },
                }}
              >
                <NavigateNext fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Last page">
            <span>
              <IconButton
                onClick={handleLastPageClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                size="small"
                sx={{
                  '&:not(:disabled):hover': {
                    bgcolor: 'primary.light',
                  },
                }}
              >
                <LastPage fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
