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

  return {
    newProduct,
    setNewProduct,
    showNewProductForm,
    toggleNewProductForm,
    handleAddNewProduct,
  };
}
