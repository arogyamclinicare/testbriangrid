'use client';

import React from 'react';
import { useDeliveryStore } from '@/stores/deliveryStore';
import { twMerge } from 'tailwind-merge';

interface LiveTotalsProps {
  isSticky?: boolean;
}

const LiveTotals: React.FC<LiveTotalsProps> = ({ isSticky = false }) => {
  const { calculation } = useDeliveryStore();

  return (
    <div
      className={twMerge(
        'bg-white p-4 border-t border-gray-200',
        isSticky ? 'sticky bottom-0 shadow-mobile-bottom' : ''
      )}
    >
      <div className="flex justify-between items-center text-gray-700 text-sm mb-2">
        <span>Subtotal:</span>
        <span>₹{calculation.subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center text-gray-900 font-bold text-lg">
        <span>Grand Total:</span>
        <span>₹{calculation.grandTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default LiveTotals;