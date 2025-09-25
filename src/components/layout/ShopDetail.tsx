'use client';

import { useState } from 'react';
import { useTouchGestures } from '@/hooks/useViewport';
import Button from '@/components/ui/Button';
import DeliveryTab from '@/components/delivery/DeliveryTab';
import PaymentTab from '@/components/delivery/PaymentTab';

interface Shop {
  id: string;
  name: string;
  routeOrder: number;
  todayDelivered: number;
  pending: number;
}

interface ShopDetailProps {
  shop: Shop | null;
}

type TabType = 'delivery' | 'payment' | 'notes' | 'history';

const ShopDetail: React.FC<ShopDetailProps> = ({ shop }) => {
  const [activeTab, setActiveTab] = useState<TabType>('delivery');
  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchGestures();

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'delivery',
      label: 'Delivery',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      id: 'history',
      label: 'History',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (direction === 'left' && currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1];
      if (nextTab) setActiveTab(nextTab.id);
    } else if (direction === 'right' && currentIndex > 0) {
      const prevTab = tabs[currentIndex - 1];
      if (prevTab) setActiveTab(prevTab.id);
    }
  };

  const handleTouchEnd = () => {
    const swipeResult = onTouchEnd();
    if (swipeResult?.isLeftSwipe) {
      handleSwipe('left');
    } else if (swipeResult?.isRightSwipe) {
      handleSwipe('right');
    }
  };

  if (!shop) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Shop</h3>
          <p className="text-gray-500">Choose a shop from the menu to view details</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  return (
    <div className="flex-1 flex flex-col">
      {/* Shop header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-900">{shop.name}</h2>
        <div className="flex items-center space-x-4 mt-2">
          {shop.todayDelivered > 0 && (
            <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
              Delivered {formatCurrency(shop.todayDelivered)}
            </span>
          )}
          {shop.pending > 0 && (
            <span className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              Pending {formatCurrency(shop.pending)}
            </span>
          )}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div
        className="flex-1 overflow-y-auto"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {activeTab === 'delivery' && (
          <DeliveryTab shopId={shop.id} shopName={shop.name} />
        )}

        {activeTab === 'payment' && (
          <PaymentTab shopId={shop.id} shopName={shop.name} currentPending={shop.pending} />
        )}

        {activeTab === 'notes' && (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 text-center">Notes form will be implemented here</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">History</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 text-center">Transaction history will be implemented here</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="touch"
            className="flex-1"
            onClick={() => console.log('Quick action 1')}
          >
            Quick Action 1
          </Button>
          <Button
            variant="primary"
            size="touch"
            className="flex-1"
            onClick={() => console.log('Save')}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;
