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
