'use client';

import { useState } from 'react';
import { useViewport } from '@/hooks/useViewport';

interface Shop {
  id: string;
  name: string;
  routeOrder: number;
  todayDelivered: number;
  pending: number;
}

interface ShopsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onShopSelect: (shop: Shop) => void;
  selectedShopId?: string | undefined;
}

const ShopsPanel: React.FC<ShopsPanelProps> = ({
  isOpen,
  onClose,
  onShopSelect,
  selectedShopId,
}) => {
  const { isMobile } = useViewport();
  const [sortBy, setSortBy] = useState<'route' | 'pending'>('route');
  const [filter, setFilter] = useState<'all' | 'pending'>('all');

  // Mock data for shops
  const shops: Shop[] = [
    { id: '1', name: 'Shop 1', routeOrder: 1, todayDelivered: 150, pending: 0 },
    { id: '2', name: 'Shop 2', routeOrder: 2, todayDelivered: 200, pending: 50 },
    { id: '3', name: 'Shop 3', routeOrder: 3, todayDelivered: 0, pending: 120 },
    { id: '4', name: 'Shop 4', routeOrder: 4, todayDelivered: 180, pending: 0 },
    { id: '5', name: 'Shop 5', routeOrder: 5, todayDelivered: 0, pending: 200 },
    { id: '6', name: 'Shop 6', routeOrder: 6, todayDelivered: 220, pending: 0 },
    { id: '7', name: 'Shop 7', routeOrder: 7, todayDelivered: 0, pending: 80 },
    { id: '8', name: 'Shop 8', routeOrder: 8, todayDelivered: 160, pending: 0 },
    { id: '9', name: 'Shop 9', routeOrder: 9, todayDelivered: 0, pending: 150 },
    { id: '10', name: 'Shop 10', routeOrder: 10, todayDelivered: 190, pending: 0 },
    { id: '11', name: 'Shop 11', routeOrder: 11, todayDelivered: 0, pending: 90 },
    { id: '12', name: 'Shop 12', routeOrder: 12, todayDelivered: 210, pending: 0 },
    { id: '13', name: 'Shop 13', routeOrder: 13, todayDelivered: 0, pending: 110 },
    { id: '14', name: 'Shop 14', routeOrder: 14, todayDelivered: 170, pending: 0 },
    { id: '15', name: 'Shop 15', routeOrder: 15, todayDelivered: 0, pending: 130 },
    { id: '16', name: 'Shop 16', routeOrder: 16, todayDelivered: 240, pending: 0 },
    { id: '17', name: 'Shop 17', routeOrder: 17, todayDelivered: 0, pending: 70 },
    { id: '18', name: 'Shop 18', routeOrder: 18, todayDelivered: 200, pending: 0 },
    { id: '19', name: 'Shop 19', routeOrder: 19, todayDelivered: 0, pending: 160 },
    { id: '20', name: 'Shop 20', routeOrder: 20, todayDelivered: 180, pending: 0 },
  ];

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  // Filter and sort shops
  const filteredShops = shops
    .filter(shop => filter === 'all' || shop.pending > 0)
    .sort((a, b) => {
      if (sortBy === 'route') return a.routeOrder - b.routeOrder;
      return b.pending - a.pending;
    });

  const handleShopClick = (shop: Shop) => {
    onShopSelect(shop);
    if (isMobile) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobile
            ? `w-80 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `w-80 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Shops</h2>
            {isMobile && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="Close panel"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-3">
            {/* Sort toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSortBy('route')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  sortBy === 'route'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Route Order
              </button>
              <button
                onClick={() => setSortBy('pending')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  sortBy === 'pending'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Highest Due
              </button>
            </div>

            {/* Filter toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Shops
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'pending'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pending Only
              </button>
            </div>
          </div>
        </div>

        {/* Shops list */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {filteredShops.map((shop) => (
              <button
                key={shop.id}
                onClick={() => handleShopClick(shop)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedShopId === shop.id
                    ? 'bg-primary-50 border border-primary-200'
                    : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{shop.name}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      {shop.todayDelivered > 0 && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                          Delivered {formatCurrency(shop.todayDelivered)}
                        </span>
                      )}
                      {shop.pending > 0 && (
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                          Pending {formatCurrency(shop.pending)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopsPanel;
