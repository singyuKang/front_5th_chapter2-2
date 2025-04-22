import React from 'react';
import { Discount } from '../../../../../types';
import DiscountItem from './DiscountItem';

type DiscountListProps = {
  discounts: Discount[];
  onRemoveDiscount?: (index: number) => void;
  isEditing?: boolean;
};

const DiscountList: React.FC<DiscountListProps> = ({
  discounts,
  onRemoveDiscount,
  isEditing = false,
}) => {
  return (
    <>
      {discounts.map((discount, index) => (
        <DiscountItem
          key={index}
          discount={discount}
          index={index}
          onRemove={onRemoveDiscount}
          isEditing={isEditing}
        />
      ))}
    </>
  );
};

export default DiscountList;
