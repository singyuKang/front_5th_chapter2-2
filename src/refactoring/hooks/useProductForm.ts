import { useState } from 'react';
import { Product } from '../../types';

type UseProductFormProps = {
  onProductAdd: (product: Product) => void;
};

export function useProductForm({ onProductAdd }: UseProductFormProps) {
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const toggleNewProductForm = () => {
    setShowNewProductForm(!showNewProductForm);
  };

  const handleAddNewProduct = () => {
    if (!validateForm()) {
      return;
    }

    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    });
    setShowNewProductForm(false);
    return productWithId;
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // 상품명
    if (!newProduct.name.trim()) {
      isValid = false;
    }

    // 상품가격
    if (newProduct.price <= 0) {
      isValid = false;
    }

    // 상품 갯수
    if (newProduct.stock <= 0) {
      isValid = false;
    }

    return isValid;
  };

  return {
    newProduct,
    setNewProduct,
    showNewProductForm,
    toggleNewProductForm,
    handleAddNewProduct,
  };
}
