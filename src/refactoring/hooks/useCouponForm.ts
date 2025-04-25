import { useState } from 'react';
import { Coupon } from '../../types';
import { validateCoupon } from '../models/coupon';

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
    if (!validateCoupon(newCoupon)) {
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

  return {
    newCoupon,
    handleNameChange,
    handleCodeChange,
    handleDiscountTypeChange,
    handleDiscountValueChange,
    handleAddCoupon,
  };
}
