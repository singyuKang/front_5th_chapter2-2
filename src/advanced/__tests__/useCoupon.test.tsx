import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as useLocalStorageModule from '../../refactoring/hooks/useLocalStorage';
import { useCoupons } from '../../refactoring/hooks';
import { act, renderHook } from '@testing-library/react';

describe('useCoupons 테스트', () => {
  vi.mock('../../refactoring/hooks/useLocalStorage', () => ({
    __esModule: true,
    default: vi.fn(),
  }));
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
