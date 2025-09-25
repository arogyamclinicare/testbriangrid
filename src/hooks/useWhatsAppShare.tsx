'use client';

import { useCallback } from 'react';
import { generateDeliveryReceipt, generatePaymentReceipt, DeliveryReceiptData, PaymentReceiptData } from '@/lib/utils/whatsappTemplates';
import { shareViaWebShare, copyToClipboard, shareWhatsAppDirect, ShareResult } from '@/lib/utils/shareUtils';

export type DeliveryShareData = DeliveryReceiptData;
export type PaymentShareData = PaymentReceiptData;

export const useWhatsAppShare = () => {
  const handleShare = useCallback(async (message: string, title: string = 'Share Receipt'): Promise<ShareResult> => {
    // 1. Try Web Share API
    const webShareResult = await shareViaWebShare(message, title);
    if (webShareResult.success || webShareResult.error === 'Share cancelled') {
      return webShareResult;
    }

    // 2. Fallback to direct WhatsApp link (might not work on all desktop browsers)
    const whatsappDirectResult = shareWhatsAppDirect(message);
    if (whatsappDirectResult.success) {
      return whatsappDirectResult;
    }

    // 3. Final fallback to clipboard
    const clipboardResult = await copyToClipboard(message);
    if (clipboardResult.success) {
      alert('Receipt copied to clipboard! You can paste it into WhatsApp.');
      return clipboardResult;
    } else {
      alert(`Failed to share or copy receipt: ${clipboardResult.error}`);
      return clipboardResult;
    }
  }, []);

  const shareDelivery = useCallback(
    async (data: DeliveryShareData) => {
      const message = generateDeliveryReceipt(data);
      return handleShare(message, 'Share Delivery Receipt');
    },
    [handleShare]
  );

  const sharePayment = useCallback(
    async (data: PaymentShareData) => {
      const message = generatePaymentReceipt(data);
      return handleShare(message, 'Share Payment Receipt');
    },
    [handleShare]
  );

  return { shareDelivery, sharePayment };
};