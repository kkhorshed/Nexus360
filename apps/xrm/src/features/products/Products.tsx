import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Chip,
  LinearProgress,
  Grid,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import InventoryIcon from '@mui/icons-material/Inventory';

import RightDrawer from '../../components/common/RightDrawer';
import PageWrapper from '../../components/common/PageWrapper';
import { DataFilter } from '../../components/common/DataFilter';
import { ProductCard, ProductForm } from './components';
import { useProducts, useProductForm } from './hooks';
import { COLUMNS, ROWS_PER_PAGE_OPTIONS, CARD_VIEW_ROWS_PER_PAGE_OPTIONS } from './constants';
import { getStockColor, getStockPercentage, formatPrice } from './utils/helpers';

export default function Products() {
  const {
    products,
    page,
    rowsPerPage,
    view,
    filters,
    handleChangePage,
    handleChangeRowsPerPage,
    handleFilterLoad,
    handleViewChange,
  } = useProducts();

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    isSubmitting,
    editingProduct,
    handleSubmit,
    handleClose,
    handleEdit,
  } = useProductForm(() => setDrawerOpen(false));

  const handleAddClick = () => {
    handleClose();
    setDrawerOpen(true);
  };

  const handleFilterDrawerToggle = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  const renderTableView = () => (
    <Paper 
      elevation={2}
      sx={{
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock Level</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow 
                  key={product.id}
                  sx={{
                    transition: 'background-color 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InventoryIcon color="action" />
                      {product.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={product.category} size="small" />
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={getStockPercentage(product.stock)}
                        color={getStockColor(product.stock)}
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                      <Box sx={{ minWidth: 35, mt: 0.5 }}>
                        {product.stock} units
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit product">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(product)}
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
      <TablePagination
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );

  const renderCardView = () => (
    <Grid container spacing={3}>
      {products
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Paper 
              elevation={2}
              sx={{
                height: '100%',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[8],
                },
              }}
            >
              <ProductCard
                product={product}
                onEdit={handleEdit}
              />
            </Paper>
          </Grid>
        ))}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <TablePagination
            rowsPerPageOptions={CARD_VIEW_ROWS_PER_PAGE_OPTIONS}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Grid>
    </Grid>
  );

  return (
    <PageWrapper
      title="Products"
      description="Manage your products and services"
      actions={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Filter products">
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleFilterDrawerToggle}
              color={Object.keys(filters).length > 0 ? "primary" : "inherit"}
            >
              Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
            </Button>
          </Tooltip>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Switch to table view">
              <Button
                variant="outlined"
                onClick={() => handleViewChange('table')}
                color={view === 'table' ? "primary" : "inherit"}
              >
                <ViewListIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Switch to card view">
              <Button
                variant="outlined"
                onClick={() => handleViewChange('card')}
                color={view === 'card' ? "primary" : "inherit"}
              >
                <ViewModuleIcon />
              </Button>
            </Tooltip>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add Product
          </Button>
        </Box>
      }
    >
      {view === 'table' ? renderTableView() : renderCardView()}

      <RightDrawer
        open={filterDrawerOpen}
        onClose={handleFilterDrawerToggle}
        title="Filter Products"
      >
        <DataFilter
          currentFilters={filters}
          onFilterLoad={handleFilterLoad}
          columns={COLUMNS}
          data={products}
          storageKey="products-filters"
        />
      </RightDrawer>

      <RightDrawer
        open={drawerOpen}
        onClose={handleClose}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      >
        <ProductForm
          initialData={editingProduct || undefined}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </RightDrawer>
    </PageWrapper>
  );
}
