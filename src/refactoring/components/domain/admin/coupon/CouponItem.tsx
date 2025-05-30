import React from 'react';
import { Coupon } from '../../../../../types';

type CouponItemProps = {
  coupon: Coupon;
  index: number;
};

const CouponItem: React.FC<CouponItemProps> = ({ coupon, index }) => {
  return (
    <div data-testid={`coupon-${index + 1}`} className="bg-gray-100 p-2 rounded">
      {coupon.name} ({coupon.code}):
      {coupon.discountType === 'amount'
        ? `${coupon.discountValue}원`
        : `${coupon.discountValue}%`}{' '}
      할인
    </div>
  );
};

export default CouponItem;
