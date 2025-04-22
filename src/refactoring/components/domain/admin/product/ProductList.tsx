import React from 'react';

import { Product, Discount } from '../../../../../types';
import ProductItem from './ProductItem';

type ProductListProps = {
  products: Product[];
  openProductIds: Set<string>;
  editingProduct: Product | null;
  newDiscount: Discount;
  onToggleProduct: (id: string) => void;
  onEditProduct: (product: Product) => void;
  onProductNameUpdate: (id: string, name: string) => void;
  onPriceUpdate: (id: string, price: number) => void;
  onStockUpdate: (id: string, stock: number) => void;
  onDiscountChange: (discount: Discount) => void;
  onAddDiscount: (productId: string) => void;
  onRemoveDiscount: (productId: string, index: number) => void;
  onEditComplete: () => void;
};

const ProductList: React.FC<ProductListProps> = ({
  products,
  openProductIds,
  editingProduct,
  newDiscount,
  onToggleProduct,
  onEditProduct,
  onProductNameUpdate,
  onPriceUpdate,
  onStockUpdate,
  onDiscountChange,
  onAddDiscount,
  onRemoveDiscount,
  onEditComplete,
}) => {
  return (
    <div className="space-y-2">
      {products.map((product, index) => (
        <ProductItem
          key={product.id}
          product={product}
          index={index}
          isOpen={openProductIds.has(product.id)}
          editingProduct={editingProduct}
          newDiscount={newDiscount}
          onToggle={onToggleProduct}
          onEdit={onEditProduct}
          onProductNameUpdate={onProductNameUpdate}
          onPriceUpdate={onPriceUpdate}
          onStockUpdate={onStockUpdate}
          onDiscountChange={onDiscountChange}
          onAddDiscount={onAddDiscount}
          onRemoveDiscount={onRemoveDiscount}
          onEditComplete={onEditComplete}
        />
      ))}
    </div>
  );
};

export default ProductList;
