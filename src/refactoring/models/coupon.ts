import { Coupon } from '../../types';

export function validateCoupon(coupon: Coupon): boolean {
  let isValid = true;

  if (!coupon.name.trim()) {
    isValid = false;
  }

  if (!coupon.code.trim()) {
    isValid = false;
  }

  if (coupon.discountValue <= 0) {
    isValid = false;
  }

  return isValid;
}
