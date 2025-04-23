import React from 'react';
import { Coupon } from '../../../../types';
import CouponForm from './coupon/CouponForm';
import CouponList from './coupon/CouponList';

type CouponManagementProps = {
  coupons: Coupon[];
  onCouponAdd: (coupon: Coupon) => void;
};

const CouponManagement: React.FC<CouponManagementProps> = ({ coupons, onCouponAdd }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
      <div className="bg-white p-4 rounded shadow">
        <CouponForm onAddCoupon={onCouponAdd} />
        <CouponList coupons={coupons} />
      </div>
    </div>
  );
};

export default CouponManagement;
