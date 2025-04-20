import { CartItem, Coupon } from '../../types';

export const calculateItemTotal = (item: CartItem) => {
  const { product, quantity } = item;
  const baseTotal = product.price * quantity;

  const applicableDiscount = product.discounts
    .filter((discount) => quantity >= discount.quantity)
    .sort((a, b) => b.rate - a.rate)[0];

  if (applicableDiscount) {
    return baseTotal * (1 - applicableDiscount.rate);
  }

  return baseTotal;
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { product, quantity } = item;
  const applicableDiscount = product.discounts
    .filter((discount) => quantity >= discount.quantity)
    .sort((a, b) => b.rate - a.rate)[0];

  if (applicableDiscount) {
    return applicableDiscount.rate;
  }

  return 0;
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  return {
    totalBeforeDiscount: 0,
    totalAfterDiscount: 0,
    totalDiscount: 0,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  return [];
};
