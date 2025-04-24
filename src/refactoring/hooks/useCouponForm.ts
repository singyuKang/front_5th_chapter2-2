import { useState } from 'react';
import { Coupon } from '../../types';

type UseCouponFormProps = {
  onAddCoupon: (coupon: Coupon) => void;
};

export function useCouponForm({ onAddCoupon }: UseCouponFormProps) {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const handleNameChange = (name: string) => {
    setNewCoupon((prev) => ({ ...prev, name }));
  };

  const handleCodeChange = (code: string) => {
    setNewCoupon((prev) => ({ ...prev, code }));
  };

  const handleDiscountTypeChange = (discountType: 'amount' | 'percentage') => {
    setNewCoupon((prev) => ({ ...prev, discountType }));
  };

  const handleDiscountValueChange = (value: string) => {
    const discountValue = parseInt(value) || 0;
    setNewCoupon((prev) => ({ ...prev, discountValue }));
  };

  const handleAddCoupon = () => {
    // 유효성 검사
    if (!validateForm()) {
      return;
    }

    onAddCoupon(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
    });
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { name: '', code: '', discountValue: '' };

    // 쿠폰 이름 검증
    if (!newCoupon.name.trim()) {
      newErrors.name = '쿠폰 이름을 입력해주세요';
      isValid = false;
    }

    // 쿠폰 코드 검증
    if (!newCoupon.code.trim()) {
      newErrors.code = '쿠폰 코드를 입력해주세요';
      isValid = false;
    }

    // 할인 값 검증
    if (newCoupon.discountValue <= 0) {
      newErrors.discountValue = '할인 값은 0보다 커야 합니다';
      isValid = false;
    }

    return isValid;
  };

  return {
    newCoupon,
    handleNameChange,
    handleCodeChange,
    handleDiscountTypeChange,
    handleDiscountValueChange,
    handleAddCoupon,
  };
}
