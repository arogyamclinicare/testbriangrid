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
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-primary-200">
      <div className="flex items-center justify-between">
        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate">{product.name}</h3>
          <p className="text-sm text-gray-600 font-medium">₹{product.price.toFixed(2)} / unit</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDecrement(1)}
            disabled={currentQuantity <= 0}
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
            aria-label={`Decrement quantity for ${product.name}`}
          >
            −
          </Button>
          
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={quantityInput}
              onChange={handleQuantityChange}
              className="w-16 h-10 text-center border-2 border-primary-200 rounded-lg text-gray-900 text-sm font-bold focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-primary-50"
              aria-label={`Quantity for ${product.name}`}
            />
            {currentQuantity > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIncrement(1)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
            aria-label={`Increment quantity for ${product.name}`}
          >
            +
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleIncrement(5)}
            className="px-3 py-2 rounded-lg font-bold text-sm"
            aria-label={`Add 5 to quantity for ${product.name}`}
          >
            +5
          </Button>
        </div>

        {/* Line Total */}
        <div className="ml-4 text-right min-w-0">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-3 py-2 rounded-lg">
            <p className="text-lg font-bold text-primary-800">
              ₹{lineTotal.toFixed(2)}
            </p>
            {currentQuantity > 0 && (
              <p className="text-xs text-primary-600 font-medium">
                {currentQuantity} × ₹{product.price.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRow;