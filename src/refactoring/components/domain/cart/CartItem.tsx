import React from 'react';
import { CartItem as CartItemType } from '../../../../types';
import Button from '../../common/Button';

type CartItemProps = {
  item: CartItemType;
  appliedDiscount: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
};

const CartItem: React.FC<CartItemProps> = ({
  item,
  appliedDiscount,
  onUpdateQuantity,
  onRemoveFromCart,
}) => {
  return (
    <div className="flex justify-between items-center bg-white p-3 rounded shadow">
      <div>
        <span className="font-semibold">{item.product.name}</span>
        <br />
        <span className="text-sm text-gray-600">
          {item.product.price}원 x {item.quantity}
          {appliedDiscount > 0 && (
            <span className="text-green-600 ml-1">
              ({(appliedDiscount * 100).toFixed(0)}% 할인 적용)
            </span>
          )}
        </span>
      </div>
      <div>
        <Button
          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
          className="bg-gray-300 text-gray-800 px-2 py-1.5 rounded mr-1 hover:bg-gray-400"
        >
          -
        </Button>
        <Button
          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
          className="bg-gray-300 text-gray-800 px-2 py-1.5 mr-1 hover:bg-gray-400"
        >
          +
        </Button>
        <Button
          onClick={() => onRemoveFromCart(item.product.id)}
          variant="danger"
          className="px-2 py-1.5"
        >
          삭제
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
