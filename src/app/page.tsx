'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import ShopsPanel from '@/components/layout/ShopsPanel';
import ShopDetail from '@/components/layout/ShopDetail';

interface Shop {
  id: string;
  name: string;
  routeOrder: number;
  todayDelivered: number;
  pending: number;
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleShopSelect = (shop: Shop) => {
    setSelectedShop(shop);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <Header
        onMenuToggle={handleMenuToggle}
        isMenuOpen={isMenuOpen}
      />

      {/* Main content area */}
      <div className="flex-1 flex w-full max-w-full overflow-x-hidden">
        {/* Shops Panel */}
        <ShopsPanel
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onShopSelect={handleShopSelect}
          selectedShopId={selectedShop?.id}
        />

        {/* Shop Detail */}
        <ShopDetail shop={selectedShop} />
      </div>
    </div>
  );
}
