import React from 'react';
import Button from '../../../common/Button';
import { Discount } from '../../../../../types';

type DiscountFormProps = {
  newDiscount: Discount;
  onDiscountChange: (discount: Discount) => void;
  onAddDiscount: () => void;
};

const DiscountForm: React.FC<DiscountFormProps> = ({
  newDiscount,
  onDiscountChange,
  onAddDiscount,
}) => {
  return (
    <div className="flex space-x-2">
      <input
        type="number"
        placeholder="수량"
        value={newDiscount.quantity}
        onChange={(e) =>
          onDiscountChange({
            ...newDiscount,
            quantity: parseInt(e.target.value),
          })
        }
        className="w-1/3 p-2 border rounded"
      />
      <input
        type="number"
        placeholder="할인율 (%)"
        value={newDiscount.rate * 100}
        onChange={(e) =>
          onDiscountChange({
            ...newDiscount,
            rate: parseInt(e.target.value) / 100,
          })
        }
        className="w-1/3 p-2 border rounded"
      />
      <Button
        onClick={onAddDiscount}
        variant="default"
        className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        할인 추가
      </Button>
    </div>
  );
};

export default DiscountForm;
