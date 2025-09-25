'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { DeliveryShareData, PaymentShareData } from '@/hooks/useWhatsAppShare';
import { ShareResult } from '@/lib/utils/shareUtils';

interface SharePromptProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'delivery' | 'payment';
  onComplete: (result: ShareResult) => void;
  deliveryData?: DeliveryShareData | undefined;
  paymentData?: PaymentShareData | undefined;
}

const SharePrompt: React.FC<SharePromptProps> = ({
  isOpen,
  onClose,
  type,
  onComplete,
  deliveryData,
  paymentData,
}) => {
  const handleShare = async () => {
    // In a real scenario, the onComplete would trigger the actual share logic
    // and pass the result back. For now, we'll simulate success.
    onComplete({ success: true, method: 'system_share' });
    onClose();
  };

  // Data is available for sharing logic in onComplete callback

  const title = type === 'delivery' ? 'Share Delivery Receipt' : 'Share Payment Receipt';
  const message =
    type === 'delivery'
      ? 'Delivery saved successfully! Would you like to share the receipt via WhatsApp?'
      : 'Payment saved successfully! Would you like to share the receipt via WhatsApp?';

  // Show data preview if available
  const showDataPreview = (type === 'delivery' && deliveryData) || (type === 'payment' && paymentData);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-center p-4">
        <p className="text-gray-700 mb-6">{message}</p>
        
        {showDataPreview && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4 text-left">
            <p className="text-sm text-gray-600">
              {type === 'delivery' && deliveryData && (
                <>Total: ₹{deliveryData.totalAmount.toFixed(2)}</>
              )}
              {type === 'payment' && paymentData && (
                <>Amount: ₹{paymentData.amount.toFixed(2)}</>
              )}
            </p>
          </div>
        )}
        
        <div className="flex flex-col space-y-3">
          <Button variant="primary" size="touch" onClick={handleShare}>
            Share via WhatsApp
          </Button>
          <Button variant="outline" size="touch" onClick={onClose}>
            Not now
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SharePrompt;