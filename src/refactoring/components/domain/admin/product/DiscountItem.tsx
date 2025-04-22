import React from 'react';
import Button from '../../../common/Button';
import { Discount } from '../../../../../types';

type DiscountItemProps = {
  discount: Discount;
  index: number;
  onRemove?: (index: number) => void;
  isEditing?: boolean;
};

const DiscountItem: React.FC<DiscountItemProps> = ({
  discount,
  index,
  onRemove,
  isEditing = false,
}) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <span>
        {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
      </span>
      {isEditing && onRemove && (
        <Button
          onClick={() => onRemove(index)}
          variant="default"
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          삭제
        </Button>
      )}
    </div>
  );
};

export default DiscountItem;
