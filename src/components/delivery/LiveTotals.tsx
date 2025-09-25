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
        'bg-gradient-to-r from-white to-gray-50 p-6 border-t-2 border-primary-200 shadow-lg',
        isSticky ? 'sticky bottom-0 shadow-2xl backdrop-blur-sm bg-white/95' : ''
      )}
    >
      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
            <span className="text-gray-600 font-medium">Subtotal:</span>
          </div>
          <span className="text-lg font-bold text-gray-800">₹{calculation.subtotal.toFixed(2)}</span>
        </div>
        
        {/* Grand Total */}
        <div className="flex justify-between items-center bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-xl border-2 border-primary-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
            <span className="text-primary-700 font-bold text-lg">Grand Total:</span>
          </div>
          <span className="text-2xl font-bold text-primary-800">₹{calculation.grandTotal.toFixed(2)}</span>
        </div>
        
        {/* Items count indicator */}
        {calculation.subtotal > 0 && (
          <div className="text-center">
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Items will be saved to database
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTotals;