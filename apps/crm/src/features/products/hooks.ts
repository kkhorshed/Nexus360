import { useState } from 'react';
import { Product, ViewType, ProductFormData } from './types';
import { FilterState } from '../../components/common/DataFilter';
import { initialProducts } from './data/mockData';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [view, setView] = useState<ViewType>('table');
  const [filters, setFilters] = useState<FilterState>({});

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterLoad = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
  };

  return {
    products,
    page,
    rowsPerPage,
    view,
    filters,
    handleChangePage,
    handleChangeRowsPerPage,
    handleFilterLoad,
    handleViewChange,
  };
};

export const useProductForm = (onClose: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement product creation/update logic
      console.log('Form submitted:', data);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEditingProduct(null);
    onClose();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  return {
    isSubmitting,
    editingProduct,
    handleSubmit,
    handleClose,
    handleEdit,
  };
};
