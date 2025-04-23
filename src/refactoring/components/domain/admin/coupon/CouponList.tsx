import React from 'react';
import { Coupon } from '../../../../../types';
import CouponItem from './CouponItem';

type CouponListProps = {
  coupons: Coupon[];
};

const CouponList: React.FC<CouponListProps> = ({ coupons }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
      <div className="space-y-2">
        {coupons.map((coupon, index) => (
          <CouponItem key={coupon.code} coupon={coupon} index={index} />
        ))}
      </div>
    </div>
  );
};

export default CouponList;
