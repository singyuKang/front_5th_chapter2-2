import React from 'react';
import { Product, CartItem } from '../../../../types';
import ProductItem from './ProductItem';
import { calculateRemainingStock } from '../../../models/cart';

type ProductListProps = {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
};

const ProductList: React.FC<ProductListProps> = ({ products, cart, onAddToCart }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
      <div className="space-y-2">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            remainingStock={calculateRemainingStock(product, cart)}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
