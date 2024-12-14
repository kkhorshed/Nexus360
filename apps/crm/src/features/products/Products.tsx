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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import RightDrawer from '../../components/common/RightDrawer';
import ProductForm from './ProductForm';
import ProductCard from './ProductCard';
import ViewToggle from '../../components/common/ViewToggle';
import PageWrapper from '../../components/common/PageWrapper';

export default function Products() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [view, setView] = useState<'table' | 'card'>('table');

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

  const handleEditClick = (product: any) => {
    setEditingProduct(product);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (data: any) => {
    // TODO: Implement product creation/update logic
    console.log('Form submitted:', data);
    handleDrawerClose();
  };

  const getStockColor = (stock: number) => {
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

  // Dummy data for demonstration
  const products = [
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

  const renderTableView = () => (
    <Paper>
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
                <TableRow key={product.id}>
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
                        sx={{ height: 8 }}
                      />
                      <Box sx={{ minWidth: 35, mt: 0.5 }}>
                        {product.stock} units
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(product)}
                    >
                      <EditIcon />
                    </IconButton>
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
    <Grid container spacing={2}>
      {products
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard
              product={product}
              onEdit={handleEditClick}
            />
          </Grid>
        ))}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
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
  );

  return (
    <PageWrapper
      title="Products"
      description="Manage your products and services"
      actions={
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ViewToggle view={view} onViewChange={setView} />
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
