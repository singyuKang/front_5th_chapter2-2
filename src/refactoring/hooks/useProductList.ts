import { useState } from 'react';
import { Discount, Product } from '../../types';
import { validateDiscount } from '../models/discount';

type UseProductListProps = {
  products: Product[];
  onProductUpdate: (product: Product) => void;
};

// hooks/useProductList.ts
export function useProductList({ products, onProductUpdate }: UseProductListProps) {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });

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

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleProductNameUpdate = (productId: string, newName: string) => {
    if (editingProduct && editingProduct.id === productId) {
      setEditingProduct({ ...editingProduct, name: newName });
    }
  };

  const handlePriceUpdate = (productId: string, newPrice: number) => {
    if (editingProduct && editingProduct.id === productId) {
      setEditingProduct({ ...editingProduct, price: newPrice });
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const updatedProduct = { ...product, stock: newStock };
      onProductUpdate(updatedProduct);
      setEditingProduct(updatedProduct);
    }
  };

  const handleAddDiscount = (productId: string) => {
    if (!validateDiscount(newDiscount)) {
      return;
    }

    if (editingProduct && editingProduct.id === productId) {
      const updatedProduct = {
        ...editingProduct,
        discounts: [...editingProduct.discounts, newDiscount],
      };
      onProductUpdate(updatedProduct);
      setEditingProduct(updatedProduct);
      setNewDiscount({ quantity: 0, rate: 0 });
    }
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const updatedProduct = {
        ...product,
        discounts: product.discounts.filter((_, i) => i !== index),
      };
      onProductUpdate(updatedProduct);
      setEditingProduct(updatedProduct);
    }
  };

  const handleEditComplete = () => {
    if (editingProduct) {
      onProductUpdate(editingProduct);
      setEditingProduct(null);
    }
  };

  return {
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
  };
}
