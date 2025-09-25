'use client';

import { useState } from 'react';
import { useDeliveryStore } from '@/stores/deliveryStore';
import { getAllProducts } from '@/lib/utils/calculations';
import { DeliveryService, SaveDeliveryRequest } from '@/lib/services/deliveryService';
import { PaymentService } from '@/lib/services/paymentService';
import { useWhatsAppShare } from '@/hooks/useWhatsAppShare';
import ProductRow from './ProductRow';
import LiveTotals from './LiveTotals';
import Button from '@/components/ui/Button';
import SharePrompt from '@/components/sharing/SharePrompt';

interface DeliveryTabProps {
  shopId?: string;
  shopName?: string;
}

const DeliveryTab: React.FC<DeliveryTabProps> = ({ shopId, shopName }) => {
  const { items, calculation, clearAll, hasItems } = useDeliveryStore();
  const { shareDelivery } = useWhatsAppShare();
  const products = getAllProducts();

  const [isSaving, setIsSaving] = useState(false);
  const [showSharePrompt, setShowSharePrompt] = useState(false);
  const [pendingAfterAmount, setPendingAfterAmount] = useState(0);

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all items?')) {
      clearAll();
    }
  };

  const handleSaveAndShare = async () => {
    if (!shopId || !shopName || !hasItems) return;

    setIsSaving(true);

    try {
      // Calculate pending amount after this delivery
      const currentPending = await PaymentService.getOutstandingBalance(shopId);
      const newPending = currentPending + calculation.grandTotal;
      setPendingAfterAmount(newPending);

      // Save delivery to database
      const deliveryRequest: SaveDeliveryRequest = {
        shopId,
        date: new Date().toISOString().split('T')[0]!,
        items,
      };

      const saveResult = await DeliveryService.saveDelivery(deliveryRequest);

      if (saveResult.success) {
        setShowSharePrompt(true);
      } else {
        alert(`Failed to save delivery: ${saveResult.error}`);
      }
    } catch (error) {
      console.error('Error saving delivery:', error);
      alert('Failed to save delivery. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareComplete = async () => {
    if (shopId && shopName) {
      // Convert items object to array format for sharing
      const itemsArray = Object.values(items).map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const shareResult = await shareDelivery({
        shopName,
        date: new Date().toISOString().split('T')[0]!,
        items: itemsArray,
        totalAmount: calculation.grandTotal,
        pendingAfter: pendingAfterAmount,
      });

      console.log('Share result:', shareResult);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">🚚 Delivery Entry</h3>
            <p className="text-sm text-gray-600">
              Enter quantities for each product. Totals update automatically.
            </p>
          </div>
        </div>

        {hasItems && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 font-bold"
            >
              🗑️ Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Products list */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {products.map((product) => (
            <ProductRow key={product.id} productId={product.id} />
          ))}
        </div>
      </div>

      {/* Sticky totals footer */}
      <LiveTotals isSticky />

      {/* Bottom action bar */}
      <div className="border-t-2 border-primary-200 bg-gradient-to-r from-white to-gray-50 p-6 shadow-lg">
        <div className="flex space-x-4">
          <Button
            variant="outline"
            size="touch"
            onClick={() => console.log('Save Draft')}
            className="flex-1 h-16 text-lg font-bold"
          >
            💾 Save Draft
          </Button>
          <Button
            variant="primary"
            size="touch"
            onClick={handleSaveAndShare}
            disabled={!hasItems || isSaving}
            loading={isSaving}
            className="flex-1 h-16 text-lg font-bold"
          >
            {isSaving ? '⏳ Saving...' : '💾 Save & Share'}
          </Button>
        </div>
      </div>

      {/* Share prompt */}
      <SharePrompt
        isOpen={showSharePrompt}
        onClose={() => setShowSharePrompt(false)}
        type="delivery"
        onComplete={handleShareComplete}
        deliveryData={shopId && shopName ? {
          shopName,
          date: new Date().toISOString().split('T')[0]!,
          items: Object.values(items).map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: calculation.grandTotal,
          pendingAfter: pendingAfterAmount,
        } : undefined}
      />
    </div>
  );
};

export default DeliveryTab;
