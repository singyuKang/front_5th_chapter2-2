import React from 'react';
import { CartItem as CartItemType } from '../../../../types';
import CartItem from './CartItem';

type CartListProps = {
  cart: CartItemType[];
  getAppliedDiscount: (item: CartItemType) => number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
};

const CartList: React.FC<CartListProps> = ({
  cart,
  getAppliedDiscount,
  onUpdateQuantity,
  onRemoveFromCart,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
      <div className="space-y-2">
        {cart.map((item) => (
          <CartItem
            key={item.product.id}
            item={item}
            appliedDiscount={getAppliedDiscount(item)}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveFromCart={onRemoveFromCart}
          />
        ))}
      </div>
    </div>
  );
};

export default CartList;
