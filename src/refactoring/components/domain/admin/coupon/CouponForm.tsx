import React from 'react';
import { Coupon } from '../../../../../types';
import Button from '../../../common/Button';
import { useCouponForm } from '../../../../hooks/useCouponForm';

type CouponFormProps = {
  onAddCoupon: (coupon: Coupon) => void;
};

const CouponForm: React.FC<CouponFormProps> = ({ onAddCoupon }) => {
  const {
    newCoupon,
    handleNameChange,
    handleCodeChange,
    handleDiscountTypeChange,
    handleDiscountValueChange,
    handleAddCoupon,
  } = useCouponForm({ onAddCoupon });

  return (
    <div className="space-y-2 mb-4">
      <input
        type="text"
        placeholder="쿠폰 이름"
        value={newCoupon.name}
        onChange={(e) => handleNameChange(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="쿠폰 코드"
        value={newCoupon.code}
        onChange={(e) => handleCodeChange(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <div className="flex gap-2">
        <select
          value={newCoupon.discountType}
          onChange={(e) => handleDiscountTypeChange(e.target.value as 'amount' | 'percentage')}
          className="w-full p-2 border rounded"
        >
          <option value="amount">금액(원)</option>
          <option value="percentage">할인율(%)</option>
        </select>
        <input
          type="number"
          placeholder="할인 값"
          value={newCoupon.discountValue}
          onChange={(e) => handleDiscountValueChange(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <Button onClick={handleAddCoupon} variant="success" className="w-full">
        쿠폰 추가
      </Button>
    </div>
  );
};

export default CouponForm;
