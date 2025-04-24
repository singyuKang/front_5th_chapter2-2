import { CartItem, Coupon, Product } from '../../types';

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

export const getMaxApplicableDiscountRate = (
  discounts: { quantity: number; rate: number }[],
  quantity: number,
): number => {
  return discounts
    .filter((discount) => quantity >= discount.quantity)
    .reduce((maxRate, discount) => Math.max(maxRate, discount.rate), 0);
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
  const totalBeforeDiscount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  let totalAfterDiscount = cart.reduce((sum, item) => {
    const discountRate = getMaxApplicableDiscountRate(item.product.discounts, item.quantity);
    return sum + item.product.price * item.quantity * (1 - discountRate);
  }, 0);

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
  }

  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const updatedQuantity = Math.max(0, Math.min(newQuantity, item.product.stock));
        return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);
};

//  가장 큰 할인 계산
export const caculateMaxDiscount = (discounts: { quantity: number; rate: number }[]) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};

// 남아있는 재고 계산
export const calculateRemainingStock = (product: Product, cart: CartItem[] = []) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};

// 적용된 금액
export const getAppliedDiscount = (item: CartItem): number => {
  return getMaxApplicableDiscountRate(item.product.discounts, item.quantity);
};

// 카트 아이템 업데이트
export const createUpdatedCartWithProduct = (cart: CartItem[], product: Product): CartItem[] => {
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    return cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
        : item,
    );
  }

  return [...cart, { product, quantity: 1 }];
};
