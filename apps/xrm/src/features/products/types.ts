export interface Product {
  id: number;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  description: string;
  specifications?: string;
}

export type ViewType = 'table' | 'card';

export interface Column {
  id: string;
  label: string;
  numeric: boolean;
}

export interface ProductFormData extends Omit<Product, 'id'> {}

export interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
}

export interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}
