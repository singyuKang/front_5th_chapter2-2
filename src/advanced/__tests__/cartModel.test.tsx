import { describe, expect, test } from 'vitest';
import { CartItem, Product } from '../../types';
import {
  caculateMaxDiscount,
  calculateRemainingStock,
  createUpdatedCartWithProduct,
  getMaxApplicableDiscountRate,
} from '../../refactoring/models/cart';

test('cart 유틸함수 테스트', () => {
  const mockProduct1: Product = {
    id: 'prod-1',
    name: '테스트 상품',
    price: 10000,
    stock: 5,
    discounts: [
      { quantity: 2, rate: 0.1 },
      { quantity: 3, rate: 0.2 },
    ],
  };

  const mockProduct2: Product = {
    id: 'prod-2',
    name: '할인 없는 상품',
    price: 5000,
    stock: 10,
    discounts: [],
  };

  const mockCart: CartItem[] = [{ product: mockProduct1, quantity: 2 }];

  describe('caculateMaxDiscount 테스트', () => {
    test('최대 할인율을 올바르게 계산해야 함', () => {
      const result = caculateMaxDiscount(mockProduct1.discounts);
      // 가장 큰 할인율 20% 반환
      expect(result).toBe(0.2);
    });

    test('할인이 없는 경우 0을 반환해야 함', () => {
      const result = caculateMaxDiscount([]);
      expect(result).toBe(0);
    });
  });

  describe('calculateRemainingStock 테스트', () => {
    test('장바구니에 담긴 상품의 남은 재고를 올바르게 계산해야 함', () => {
      const result = calculateRemainingStock(mockProduct1, mockCart);
      // 초기 재고 5개에서 장바구니에 2개 담겨 있으므로 3개 남음
      expect(result).toBe(3);
    });

    test('장바구니에 없는 상품의 경우 전체 재고를 반환해야 함', () => {
      const result = calculateRemainingStock(mockProduct2, mockCart);
      // 장바구니에 없으므로 전체 재고 10개 반환
      expect(result).toBe(10);
    });

    test('빈 장바구니가 전달되면 전체 재고를 반환해야 함', () => {
      const result = calculateRemainingStock(mockProduct1, []);
      expect(result).toBe(5);
    });
  });

  describe('getMaxApplicableDiscountRate 테스트', () => {
    test('구매 수량에 해당하는 최대 할인율을 반환해야 함', () => {
      // 2개 구매 시 10% 할인 적용
      expect(getMaxApplicableDiscountRate(mockProduct1.discounts, 2)).toBe(0.1);

      // 3개 구매 시 20% 할인 적용
      expect(getMaxApplicableDiscountRate(mockProduct1.discounts, 3)).toBe(0.2);

      // 4개 구매 시 여전히 최대 할인인 20% 적용
      expect(getMaxApplicableDiscountRate(mockProduct1.discounts, 4)).toBe(0.2);
    });

    test('구매 수량이 최소 할인 기준에 못 미치면 0을 반환해야 함', () => {
      expect(getMaxApplicableDiscountRate(mockProduct1.discounts, 1)).toBe(0);
    });

    test('할인이 없는 경우 0을 반환해야 함', () => {
      expect(getMaxApplicableDiscountRate([], 5)).toBe(0);
    });
  });

  describe('createUpdatedCartWithProduct 테스트', () => {
    test('장바구니에 새 상품을 추가해야 함', () => {
      const updatedCart = createUpdatedCartWithProduct(mockCart, mockProduct2);

      // 장바구니 길이가 2가 되어야 함 (기존 1개 + 새로 추가된 1개)
      expect(updatedCart.length).toBe(2);

      // 새로 추가된 상품이 있는지 확인
      const newItem = updatedCart.find((item) => item.product.id === mockProduct2.id);
      expect(newItem).toBeDefined();
      expect(newItem?.quantity).toBe(1);

      // 기존 상품이 그대로 있는지 확인
      const existingItem = updatedCart.find((item) => item.product.id === mockProduct1.id);
      expect(existingItem).toBeDefined();
      expect(existingItem?.quantity).toBe(2);
    });

    test('이미 있는 상품의 경우 수량을 증가시켜야 함', () => {
      const updatedCart = createUpdatedCartWithProduct(mockCart, mockProduct1);

      // 장바구니 길이는 그대로 1이어야 함 (새 항목이 추가되지 않고 기존 항목 업데이트)
      expect(updatedCart.length).toBe(1);

      // 기존 상품의 수량이 증가했는지 확인 (2에서 3으로)
      const updatedItem = updatedCart.find((item) => item.product.id === mockProduct1.id);
      expect(updatedItem).toBeDefined();
      expect(updatedItem?.quantity).toBe(3);
    });

    test('재고 이상으로 수량이 증가하지 않아야 함', () => {
      // 초기 장바구니에 이미 재고(5개) 근접한 수량(4개)이 담겨있는 경우
      const initialCart: CartItem[] = [{ product: mockProduct1, quantity: 4 }];

      const updatedCart = createUpdatedCartWithProduct(initialCart, mockProduct1);

      // 수량이 재고 한도(5개)를 넘지 않아야 함
      const updatedItem = updatedCart.find((item) => item.product.id === mockProduct1.id);
      expect(updatedItem?.quantity).toBe(5);

      // 다시 한번 더 추가해도 재고 한도(5개)를 넘지 않아야 함
      const finalCart = createUpdatedCartWithProduct(updatedCart, mockProduct1);
      const finalItem = finalCart.find((item) => item.product.id === mockProduct1.id);
      expect(finalItem?.quantity).toBe(5);
    });
  });
});
