import React from 'react';
import { Product, Discount } from '../../../../../types';
import Button from '../../../common/Button';
import DiscountForm from './DiscountForm';
import DiscountList from './DiscountList';

type ProductEditFormProps = {
  product: Product;
  editingProduct: Product;
  newDiscount: Discount;
  onProductNameUpdate: (id: string, name: string) => void;
  onPriceUpdate: (id: string, price: number) => void;
  onStockUpdate: (id: string, stock: number) => void;
  onDiscountChange: (discount: Discount) => void;
  onAddDiscount: (productId: string) => void;
  onRemoveDiscount: (productId: string, index: number) => void;
  onEditComplete: () => void;
};

const ProductEditForm: React.FC<ProductEditFormProps> = ({
  product,
  editingProduct,
  newDiscount,
  onProductNameUpdate,
  onPriceUpdate,
  onStockUpdate,
  onDiscountChange,
  onAddDiscount,
  onRemoveDiscount,
  onEditComplete,
}) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <input
          type="text"
          value={editingProduct.name}
          onChange={(e) => onProductNameUpdate(product.id, e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        <input
          type="number"
          value={editingProduct.price}
          onChange={(e) => onPriceUpdate(product.id, parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">재고: </label>
        <input
          type="number"
          value={editingProduct.stock}
          onChange={(e) => onStockUpdate(product.id, parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
        <DiscountList
          discounts={editingProduct.discounts}
          onRemoveDiscount={(index: number) => onRemoveDiscount(product.id, index)}
          isEditing={true}
        />
        <DiscountForm
          newDiscount={newDiscount}
          onDiscountChange={onDiscountChange}
          onAddDiscount={() => onAddDiscount(product.id)}
        />
      </div>
      <Button
        onClick={onEditComplete}
        variant="default"
        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
      >
        수정 완료
      </Button>
    </div>
  );
};

export default ProductEditForm;
