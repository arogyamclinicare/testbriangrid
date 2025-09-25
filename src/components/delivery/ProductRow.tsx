'use client';

import React, { useState, useEffect } from 'react';
import { useDeliveryStore } from '@/stores/deliveryStore';
import { getProductById, calculateLineTotal } from '@/lib/utils/calculations';
import Button from '@/components/ui/Button';

interface ProductRowProps {
  productId: string;
}

const ProductRow: React.FC<ProductRowProps> = ({ productId }) => {
  const product = getProductById(productId);
  const { items, updateItemQuantity } = useDeliveryStore();
  const currentQuantity = items[productId]?.quantity || 0;

  const [quantityInput, setQuantityInput] = useState(currentQuantity.toString());

  useEffect(() => {
    setQuantityInput(currentQuantity.toString());
  }, [currentQuantity]);

  if (!product) {
    return null;
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only positive integers or empty string
    if (/^\d*$/.test(value)) {
      setQuantityInput(value);
      const newQuantity = parseInt(value, 10);
      updateItemQuantity(productId, isNaN(newQuantity) ? 0 : newQuantity);
    }
  };

  const handleIncrement = (amount: number) => {
    const newQuantity = currentQuantity + amount;
    updateItemQuantity(productId, newQuantity);
  };

  const handleDecrement = (amount: number) => {
    const newQuantity = Math.max(0, currentQuantity - amount);
    updateItemQuantity(productId, newQuantity);
  };

  const lineTotal = calculateLineTotal(currentQuantity, product.price);

  return (
    <div className="flex items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200">
      <div className="flex-1">
        <p className="text-gray-900 font-medium">{product.name}</p>
        <p className="text-gray-600 text-sm">₹{product.price.toFixed(2)} / unit</p>
      </div>

      <div className="flex items-center space-x-1 ml-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDecrement(1)}
          disabled={currentQuantity <= 0}
          aria-label={`Decrement quantity for ${product.name}`}
        >
          -
        </Button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={quantityInput}
          onChange={handleQuantityChange}
          className="w-16 text-center p-1 border border-gray-300 rounded-md text-gray-900 text-sm focus:ring-primary focus:border-primary"
          aria-label={`Quantity for ${product.name}`}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleIncrement(1)}
          aria-label={`Increment quantity for ${product.name}`}
        >
          +
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleIncrement(5)}
          aria-label={`Add 5 to quantity for ${product.name}`}
        >
          +5
        </Button>
      </div>

      <div className="ml-4 text-right">
        <p className="text-gray-900 font-medium">₹{lineTotal.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductRow;