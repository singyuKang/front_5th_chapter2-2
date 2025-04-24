import React from 'react';
import { Product } from '../../../../types';
import Button from '../../common/Button';
import ProductForm from './product/ProductForm';
import ProductList from './product/ProductList';
import { useProductForm } from '../../../hooks/useProductForm';
import { useProductList } from '../../../hooks/useProductList';
import Heading from '../../common/Heading';

type ProductManagementProps = {
  products: Product[];
  onProductUpdate: (product: Product) => void;
  onProductAdd: (product: Product) => void;
};

const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  onProductUpdate,
  onProductAdd,
}) => {
  // 상품 추가 관련 훅
  const {
    newProduct,
    setNewProduct,
    showNewProductForm,
    toggleNewProductForm,
    handleAddNewProduct,
  } = useProductForm({ onProductAdd });

  // 상품 목록 관리 관련 훅
  const {
    openProductIds,
    editingProduct,
    newDiscount,
    setNewDiscount,
    toggleProductAccordion,
    handleEditProduct,
    handleProductNameUpdate,
    handlePriceUpdate,
    handleStockUpdate,
    handleAddDiscount,
    handleRemoveDiscount,
    handleEditComplete,
  } = useProductList({ products, onProductUpdate });

  return (
    <div>
      <Heading as="h2" className="text-2xl font-semibold mb-4">
        상품 관리
      </Heading>
      <Button
        onClick={toggleNewProductForm}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
      >
        {showNewProductForm ? '취소' : '새 상품 추가'}
      </Button>
      {showNewProductForm && (
        <ProductForm
          newProduct={newProduct}
          onProductChange={setNewProduct}
          onAddProduct={handleAddNewProduct}
        />
      )}
      <ProductList
        products={products}
        openProductIds={openProductIds}
        editingProduct={editingProduct}
        newDiscount={newDiscount}
        onToggleProduct={toggleProductAccordion}
        onEditProduct={handleEditProduct}
        onProductNameUpdate={handleProductNameUpdate}
        onPriceUpdate={handlePriceUpdate}
        onStockUpdate={handleStockUpdate}
        onDiscountChange={setNewDiscount}
        onAddDiscount={handleAddDiscount}
        onRemoveDiscount={handleRemoveDiscount}
        onEditComplete={handleEditComplete}
      />
    </div>
  );
};

export default ProductManagement;
