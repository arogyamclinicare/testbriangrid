'use client';

import { useState } from 'react';
import { PaymentService, SavePaymentRequest } from '@/lib/services/paymentService';
import { useWhatsAppShare } from '@/hooks/useWhatsAppShare';
import Button from '@/components/ui/Button';
import SharePrompt from '@/components/sharing/SharePrompt';

interface PaymentTabProps {
  shopId?: string;
  shopName?: string;
  currentPending?: number;
}

const PaymentTab: React.FC<PaymentTabProps> = ({ shopId, shopName, currentPending = 0 }) => {
  const { sharePayment } = useWhatsAppShare();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSharePrompt, setShowSharePrompt] = useState(false);
  const [pendingAfterAmount, setPendingAfterAmount] = useState(0);

  const handlePaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive numbers with up to 2 decimal places
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setPaymentAmount(value);
    }
  };

  const handleSaveAndShare = async () => {
    if (!shopId || !shopName || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (amount > currentPending) {
      alert('Payment amount cannot exceed outstanding balance');
      return;
    }

    setIsSaving(true);

    try {
      // Calculate pending amount after this payment
      const newPending = currentPending - amount;
      setPendingAfterAmount(newPending);

      // Save payment to database
      const paymentRequest: SavePaymentRequest = {
        shopId,
        date: new Date().toISOString().split('T')[0]!,
        amount,
      };

      const saveResult = await PaymentService.savePayment(paymentRequest);

      if (saveResult.success) {
        setShowSharePrompt(true);
      } else {
        alert(`Failed to save payment: ${saveResult.error}`);
      }
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('Failed to save payment. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareComplete = async () => {
    if (shopId && shopName) {
      const result = await sharePayment({
        shopName,
        date: new Date().toISOString().split('T')[0]!,
        amount: parseFloat(paymentAmount),
        pendingAfter: pendingAfterAmount,
      });

      console.log('Share result:', result);
    }
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Entry</h3>
        <p className="text-sm text-gray-600">
          Record customer payments and update balances.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Outstanding balance display */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-orange-600 font-medium">Outstanding Balance</p>
              <p className="text-2xl font-bold text-orange-800">
                {formatCurrency(currentPending)}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Payment input */}
        <div className="space-y-4">
          <div>
            <label htmlFor="payment-amount" className="block text-sm font-medium text-gray-700 mb-2">
              Payment Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="text"
                id="payment-amount"
                value={paymentAmount}
                onChange={handlePaymentAmountChange}
                placeholder="0.00"
                className="block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
                inputMode="decimal"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter amount in rupees (max: {formatCurrency(currentPending)})
            </p>
          </div>

          {/* Quick amount buttons */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Quick Select</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaymentAmount(currentPending.toString())}
                disabled={currentPending <= 0}
              >
                Full Amount
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaymentAmount((currentPending * 0.5).toFixed(2))}
                disabled={currentPending <= 0}
              >
                Half Amount
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="touch"
            onClick={() => setPaymentAmount('')}
            className="flex-1"
          >
            Clear
          </Button>
          <Button
            variant="primary"
            size="touch"
            onClick={handleSaveAndShare}
            disabled={!paymentAmount || parseFloat(paymentAmount) <= 0 || isSaving}
            loading={isSaving}
            className="flex-1"
          >
            {isSaving ? 'Saving...' : 'Save & Share'}
          </Button>
        </div>
      </div>

      {/* Share prompt */}
      <SharePrompt
        isOpen={showSharePrompt}
        onClose={() => setShowSharePrompt(false)}
        type="payment"
        onComplete={handleShareComplete}
        paymentData={shopId && shopName ? {
          shopName,
          date: new Date().toISOString().split('T')[0]!,
          amount: parseFloat(paymentAmount),
          pendingAfter: pendingAfterAmount,
        } : undefined}
      />
    </div>
  );
};

export default PaymentTab;
