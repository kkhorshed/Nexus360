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
import ProductForm from './ProductForm';
import ProductCard from './ProductCard';
import PageWrapper from '../../components/common/PageWrapper';
import { DataFilter, FilterState } from '../../components/common/DataFilter';
import { Product } from './types';

type ViewType = 'table' | 'card';

const columns = [
  { id: 'name', label: 'Product Name', numeric: false },
  { id: 'category', label: 'Category', numeric: false },
  { id: 'sku', label: 'SKU', numeric: false },
  { id: 'price', label: 'Price', numeric: true },
  { id: 'stock', label: 'Stock Level', numeric: true },
];

// Dummy data for demonstration
const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Enterprise Software',
    category: 'Software',
    sku: 'SW-001',
    price: 999.99,
    stock: 75,
    description: 'Enterprise-grade software solution'
  },
  {
    id: 2,
    name: 'Cloud Storage',
    category: 'Services',
    sku: 'SV-001',
    price: 199.99,
    stock: 15,
    description: 'Secure cloud storage service'
  },
];

export default function Products() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [view, setView] = useState<ViewType>('table');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filters, setFilters] = useState<FilterState>({});

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setDrawerOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (data: Partial<Product>) => {
    // TODO: Implement product creation/update logic
    console.log('Form submitted:', data);
    handleDrawerClose();
  };

  const handleFilterDrawerToggle = () => {
    setFilterDrawerOpen(!filterDrawerOpen);
  };

  const handleFilterLoad = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(0);
    setFilterDrawerOpen(false);
  };

  const getStockColor = (stock: number): 'success' | 'warning' | 'error' => {
    if (stock > 50) return 'success';
    if (stock > 20) return 'warning';
    return 'error';
  };

  const getStockPercentage = (stock: number) => {
    return Math.min((stock / 100) * 100, 100);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
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
                        onClick={() => handleEditClick(product)}
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
        rowsPerPageOptions={[5, 10, 25]}
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
                onEdit={handleEditClick}
              />
            </Paper>
          </Grid>
        ))}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <TablePagination
            rowsPerPageOptions={[8, 16, 24]}
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
                onClick={() => setView('table')}
                color={view === 'table' ? "primary" : "inherit"}
              >
                <ViewListIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Switch to card view">
              <Button
                variant="outlined"
                onClick={() => setView('card')}
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
          columns={columns}
          data={products}
          storageKey="products-filters"
        />
      </RightDrawer>

      <RightDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      >
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleSubmit}
          onCancel={handleDrawerClose}
        />
      </RightDrawer>
    </PageWrapper>
  );
}
