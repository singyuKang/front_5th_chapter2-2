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
  const updateCart = cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
        return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);

  return updateCart;
};
