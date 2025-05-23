import React from 'react';
import { Coupon } from '../../../../types';
import Heading from '../../common/Heading';

type CouponSelectorProps = {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon) => void;
};

const CouponSelector: React.FC<CouponSelectorProps> = ({
  coupons,
  selectedCoupon,
  onApplyCoupon,
}) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <Heading as="h2" className="text-2xl font-semibold mb-4">
        쿠폰 적용
      </Heading>
      <select
        onChange={(e) => onApplyCoupon(coupons[parseInt(e.target.value)])}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="">쿠폰 선택</option>
        {coupons.map((coupon, index) => (
          <option key={coupon.code} value={index}>
            {coupon.name} -{' '}
            {coupon.discountType === 'amount'
              ? `${coupon.discountValue}원`
              : `${coupon.discountValue}%`}
          </option>
        ))}
      </select>
      {selectedCoupon && (
        <p className="text-green-600">
          적용된 쿠폰: {selectedCoupon.name}(
          {selectedCoupon.discountType === 'amount'
            ? `${selectedCoupon.discountValue}원`
            : `${selectedCoupon.discountValue}%`}{' '}
          할인)
        </p>
      )}
    </div>
  );
};

export default CouponSelector;
