import { Product } from '../../types.ts';
import useLocalStorage from './useLocalStorage.ts';

//  ✓ 특정 제품으로 초기화할 수 있다.
//  ✓ 제품을 업데이트할 수 있다.
//  ✓ 새로운 제품을 추가할 수 있다.
export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts: Product[]) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts: Product[]) => [...prevProducts, newProduct]);
  };

  const removeProduct = (productId: string) => {
    setProducts((prevProducts: Product[]) => prevProducts.filter((p) => p.id !== productId));
  };

  return {
    products,
    updateProduct,
    addProduct,
    removeProduct,
  };
};
