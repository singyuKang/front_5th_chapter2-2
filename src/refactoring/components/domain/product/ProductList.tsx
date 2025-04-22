import React from 'react';
import { Product } from '../../../../types';
import ProductItem from './ProductItem';

type ProductListProps = {
  products: Product[];
  getRemainingStock: (product: Product) => number;
  getMaxDiscount: (discounts: { quantity: number; rate: number }[]) => number;
  onAddToCart: (product: Product) => void;
};

const ProductList: React.FC<ProductListProps> = ({
  products,
  getRemainingStock,
  getMaxDiscount,
  onAddToCart,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
      <div className="space-y-2">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            remainingStock={getRemainingStock(product)}
            getMaxDiscount={getMaxDiscount}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
