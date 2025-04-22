import React from 'react';
import Button from '../../../common/Button';

import { Product, Discount } from '../../../../../types';
import DiscountList from './DiscountList';
import ProductEditForm from './ProductEditForm';

type ProductItemProps = {
  product: Product;
  index: number;
  isOpen: boolean;
  editingProduct: Product | null;
  newDiscount: Discount;
  onToggle: (id: string) => void;
  onEdit: (product: Product) => void;
  onProductNameUpdate: (id: string, name: string) => void;
  onPriceUpdate: (id: string, price: number) => void;
  onStockUpdate: (id: string, stock: number) => void;
  onDiscountChange: (discount: Discount) => void;
  onAddDiscount: (productId: string) => void;
  onRemoveDiscount: (productId: string, index: number) => void;
  onEditComplete: () => void;
};

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  index,
  isOpen,
  editingProduct,
  newDiscount,
  onToggle,
  onEdit,
  onProductNameUpdate,
  onPriceUpdate,
  onStockUpdate,
  onDiscountChange,
  onAddDiscount,
  onRemoveDiscount,
  onEditComplete,
}) => {
  return (
    <div data-testid={`product-${index + 1}`} className="bg-white p-4 rounded shadow">
      <Button
        dataTestId="toggle-button"
        onClick={() => onToggle(product.id)}
        variant="default"
        className="w-full text-left font-semibold px-0"
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </Button>
      {isOpen && (
        <div className="mt-2">
          {editingProduct && editingProduct.id === product.id ? (
            <ProductEditForm
              product={product}
              editingProduct={editingProduct}
              newDiscount={newDiscount}
              onProductNameUpdate={onProductNameUpdate}
              onPriceUpdate={onPriceUpdate}
              onStockUpdate={onStockUpdate}
              onDiscountChange={onDiscountChange}
              onAddDiscount={onAddDiscount}
              onRemoveDiscount={onRemoveDiscount}
              onEditComplete={onEditComplete}
            />
          ) : (
            <div>
              <DiscountList discounts={product.discounts} />
              <Button
                dataTestId="modify-button"
                onClick={() => onEdit(product)}
                variant="default"
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
              >
                수정
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductItem;
