import { useState } from 'react';
import { describe, expect, test, vi, beforeEach, MockInstance } from 'vitest';
import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import { CartPage } from '../../refactoring/pages/CartPage';
import { AdminPage } from '../../refactoring/pages/AdminPage';
import { CartItem, Coupon, Product } from '../../types';
import {
  caculateMaxDiscount,
  calculateRemainingStock,
  createUpdatedCartWithProduct,
  getMaxApplicableDiscountRate,
} from '../../refactoring/models/cart';
import * as useLocalStorageModule from '../../refactoring/hooks/useLocalStorage';
import { useCoupons } from '../../refactoring/hooks';

const mockProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];
const mockCoupons: Coupon[] = [
  {
    name: '5000원 할인 쿠폰',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인 쿠폰',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
  };

  const handleProductAdd = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return (
    <AdminPage
      products={products}
      coupons={coupons}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      onCouponAdd={handleCouponAdd}
    />
  );
};

describe('advanced > ', () => {
  describe('시나리오 테스트 > ', () => {
    test('장바구니 페이지 테스트 > ', async () => {
      render(<CartPage products={mockProducts} coupons={mockCoupons} />);
      const product1 = screen.getByTestId('product-p1');
      const product2 = screen.getByTestId('product-p2');
      const product3 = screen.getByTestId('product-p3');
      const addToCartButtonsAtProduct1 = within(product1).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct2 = within(product2).getByText('장바구니에 추가');
      const addToCartButtonsAtProduct3 = within(product3).getByText('장바구니에 추가');

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent('상품1');
      expect(product1).toHaveTextContent('10,000원');
      expect(product1).toHaveTextContent('재고: 20개');
      expect(product2).toHaveTextContent('상품2');
      expect(product2).toHaveTextContent('20,000원');
      expect(product2).toHaveTextContent('재고: 20개');
      expect(product3).toHaveTextContent('상품3');
      expect(product3).toHaveTextContent('30,000원');
      expect(product3).toHaveTextContent('재고: 20개');

      // 2. 할인 정보 표시
      expect(screen.getByText('10개 이상: 10% 할인')).toBeInTheDocument();

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText('상품 금액: 10,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 0원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 10,000원')).toBeInTheDocument();

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1);
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent('재고: 0개');
      fireEvent.click(addToCartButtonsAtProduct1);
      expect(product1).toHaveTextContent('재고: 0개');

      // 7. 할인율 계산
      expect(screen.getByText('상품 금액: 200,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 20,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 180,000원')).toBeInTheDocument();

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

      const increaseButtons = screen.getAllByText('+');
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]); // 상품2
        fireEvent.click(increaseButtons[2]); // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 110,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 590,000원')).toBeInTheDocument();

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole('combobox');
      fireEvent.change(couponSelect, { target: { value: '1' } }); // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 169,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 531,000원')).toBeInTheDocument();

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: '0' } }); // 5000원 할인 쿠폰
      expect(screen.getByText('상품 금액: 700,000원')).toBeInTheDocument();
      expect(screen.getByText('할인 금액: 115,000원')).toBeInTheDocument();
      expect(screen.getByText('최종 결제 금액: 585,000원')).toBeInTheDocument();
    });

    test('관리자 페이지 테스트 > ', async () => {
      render(<TestAdminPage />);

      const $product1 = screen.getByTestId('product-1');

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText('새 상품 추가'));

      fireEvent.change(screen.getByLabelText('상품명'), { target: { value: '상품4' } });
      fireEvent.change(screen.getByLabelText('가격'), { target: { value: '15000' } });
      fireEvent.change(screen.getByLabelText('재고'), { target: { value: '30' } });

      fireEvent.click(screen.getByText('추가'));

      const $product4 = screen.getByTestId('product-4');

      expect($product4).toHaveTextContent('상품4');
      expect($product4).toHaveTextContent('15000원');
      expect($product4).toHaveTextContent('재고: 30');

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('toggle-button'));
      fireEvent.click(within($product1).getByTestId('modify-button'));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue('20'), { target: { value: '25' } });
        fireEvent.change(within($product1).getByDisplayValue('10000'), {
          target: { value: '12000' },
        });
        fireEvent.change(within($product1).getByDisplayValue('상품1'), {
          target: { value: '수정된 상품1' },
        });
      });

      fireEvent.click(within($product1).getByText('수정 완료'));

      expect($product1).toHaveTextContent('수정된 상품1');
      expect($product1).toHaveTextContent('12000원');
      expect($product1).toHaveTextContent('재고: 25');

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId('modify-button'));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText('수량'), { target: { value: '5' } });
        fireEvent.change(screen.getByPlaceholderText('할인율 (%)'), { target: { value: '5' } });
      });
      fireEvent.click(screen.getByText('할인 추가'));

      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument();
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).toBeInTheDocument();

      fireEvent.click(screen.getAllByText('삭제')[0]);
      expect(screen.queryByText('10개 이상 구매 시 10% 할인')).not.toBeInTheDocument();
      expect(screen.queryByText('5개 이상 구매 시 5% 할인')).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText('쿠폰 이름'), { target: { value: '새 쿠폰' } });
      fireEvent.change(screen.getByPlaceholderText('쿠폰 코드'), { target: { value: 'NEW10' } });
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'percentage' } });
      fireEvent.change(screen.getByPlaceholderText('할인 값'), { target: { value: '10' } });

      fireEvent.click(screen.getByText('쿠폰 추가'));

      const $newCoupon = screen.getByTestId('coupon-3');

      expect($newCoupon).toHaveTextContent('새 쿠폰 (NEW10):10% 할인');
    });
  });

  describe('자유롭게 작성해보세요.', () => {
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

    vi.mock('../../refactoring/hooks/useLocalStorage', () => ({
      default: vi.fn(),
    }));

    vi.mock('../../refactoring/hooks/useLocalStorage', () => ({
      __esModule: true,
      default: vi.fn(),
    }));

    describe('useCoupons 테스트', () => {
      const mockCoupons = [
        {
          name: '5000원 할인 쿠폰',
          discountType: 'amount' as const,
          discountValue: 5000,
          code: 'AMOUNT5000',
        },
        {
          code: 'PERCENT10',
          discountType: 'percentage' as const,
          discountValue: 10,
          name: '10% 할인 쿠폰',
        },
      ];

      const newCoupon = {
        name: '50000원 할인 쿠폰',
        discountType: 'amount' as const,
        discountValue: 50000,
        code: 'AMOUNT50000',
      };

      let mockSetValue: ReturnType<typeof vi.fn>;

      beforeEach(() => {
        vi.resetAllMocks();

        mockSetValue = vi.fn();
        (useLocalStorageModule.default as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
          mockCoupons,
          mockSetValue,
        ]);
      });

      test('초기 쿠폰 목록이 정상적으로 로드되어야 함', () => {
        const { result } = renderHook(() => useCoupons(mockCoupons));

        expect(result.current.coupons).toEqual(mockCoupons);
        expect(result.current.coupons).toHaveLength(2);
        expect(result.current.coupons[0].code).toBe('AMOUNT5000');
        expect(result.current.coupons[1].code).toBe('PERCENT10');

        // useLocalStorage가 올바른 키와 초기값으로 호출되었는지 확인
        expect(useLocalStorageModule.default).toHaveBeenCalledWith('coupons', mockCoupons);
      });

      test('addCoupon 함수가 쿠폰을 추가해야 함', () => {
        const { result } = renderHook(() => useCoupons(mockCoupons));

        act(() => {
          result.current.addCoupon(newCoupon);
        });

        expect(mockSetValue).toHaveBeenCalled();

        const updaterFunction = mockSetValue.mock.calls[0][0];
        const updatedCoupons = updaterFunction(mockCoupons);
        expect(updatedCoupons).toHaveLength(3);
        expect(updatedCoupons[2]).toEqual(newCoupon);
      });
    });
  });
});
