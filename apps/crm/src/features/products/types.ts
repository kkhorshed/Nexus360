export interface Product {
  id: number;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  description: string;
  [key: string]: string | number; // Add index signature for DataFilter compatibility
}
