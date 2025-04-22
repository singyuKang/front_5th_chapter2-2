import React from 'react';
import Button from '../../../common/Button';
import { Product } from '../../../../../types';

type ProductFormProps = {
  newProduct: Omit<Product, 'id'>;
  onProductChange: (product: Omit<Product, 'id'>) => void;
  onAddProduct: () => void;
};

const ProductForm: React.FC<ProductFormProps> = ({ newProduct, onProductChange, onAddProduct }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
      <div className="mb-2">
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
          상품명
        </label>
        <input
          id="productName"
          type="text"
          value={newProduct.name}
          onChange={(e) => onProductChange({ ...newProduct, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
          가격
        </label>
        <input
          id="productPrice"
          type="number"
          value={newProduct.price}
          onChange={(e) => onProductChange({ ...newProduct, price: parseInt(e.target.value) })}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">
          재고
        </label>
        <input
          id="productStock"
          type="number"
          value={newProduct.stock}
          onChange={(e) => onProductChange({ ...newProduct, stock: parseInt(e.target.value) })}
          className="w-full p-2 border rounded"
        />
      </div>
      <Button onClick={onAddProduct} variant="secondary" className="w-full">
        추가
      </Button>
    </div>
  );
};

export default ProductForm;
