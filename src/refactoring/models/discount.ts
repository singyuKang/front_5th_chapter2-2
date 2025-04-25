import { Discount } from '../../types';

export function validateDiscount(discount: Discount): boolean {
  let isValid = true;

  if (discount.quantity <= 0) {
    isValid = false;
  }

  if (discount.rate <= 0) {
    isValid = false;
  }

  return isValid;
}
