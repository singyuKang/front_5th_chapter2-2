import React, { useState } from 'react';
import { Discount, Product } from '../../../../types';
import Button from '../../common/Button';
import ProductForm from './product/ProductForm';
import ProductList from './product/ProductList';
import { useProductForm } from '../../../hooks/useProductForm';

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
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });

  // 상품 추가 관련 훅
  const {
    newProduct,
    setNewProduct,
    showNewProductForm,
    toggleNewProductForm,
    handleAddNewProduct,
  } = useProductForm({ onProductAdd });

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: updatedProduct.discounts.filter((_, i) => i !== index),
      };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  // 새로운 핸들러 함수 추가
  const handleProductNameUpdate = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, name: newName };
      setEditingProduct(updatedProduct);
    }
  };

  // 새로운 핸들러 함수 추가
  const handlePriceUpdate = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = { ...editingProduct, price: newPrice };
      setEditingProduct(updatedProduct);
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct) {
      const newProduct = { ...updatedProduct, stock: newStock };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
    }
  };

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = products.find((p) => p.id === productId);
    if (updatedProduct && editingProduct) {
      const newProduct = {
        ...updatedProduct,
        discounts: [...updatedProduct.discounts, newDiscount],
      };
      onProductUpdate(newProduct);
      setEditingProduct(newProduct);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  // 수정 완료 핸들러 함수 추가
  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  // handleEditProduct 함수 수정
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
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
