import { useState } from 'react';
import { Product } from '../../types.ts';

//  ✓ 특정 제품으로 초기화할 수 있다.
//  ✓ 제품을 업데이트할 수 있다.
//  ✓ 새로운 제품을 추가할 수 있다.
export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState(initialProducts);

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  return {
    products,
    updateProduct,
    addProduct,
  };
};
