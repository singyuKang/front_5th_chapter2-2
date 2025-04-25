import { Product } from '../../types';

export function validateProduct(product: Omit<Product, 'id'>): boolean {
  let isValid = true;

  // 상품명
  if (!product.name.trim()) {
    isValid = false;
  }

  // 상품가격
  if (product.price <= 0) {
    isValid = false;
  }

  // 상품 갯수
  if (product.stock <= 0) {
    isValid = false;
  }

  return isValid;
}
