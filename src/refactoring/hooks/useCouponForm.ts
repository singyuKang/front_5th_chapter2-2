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

    // 쿠폰 이름 검증
    if (!newCoupon.name.trim()) {
      isValid = false;
    }

    // 쿠폰 코드 검증
    if (!newCoupon.code.trim()) {
      isValid = false;
    }

    // 할인 값 검증
    if (newCoupon.discountValue <= 0) {
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
