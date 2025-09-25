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
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Payment Entry</h3>
            <p className="text-sm text-gray-600">
              Record customer payments and update balances
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Outstanding balance display */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-orange-600 font-bold uppercase tracking-wide">Outstanding Balance</p>
              </div>
              <p className="text-3xl font-bold text-orange-800">
                {formatCurrency(currentPending)}
              </p>
              <p className="text-xs text-orange-600 mt-1">Amount due from customer</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Payment input */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <label htmlFor="payment-amount" className="block text-lg font-bold text-gray-800 mb-4">
              💰 Payment Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-2xl font-bold text-primary-600">₹</span>
              </div>
              <input
                type="text"
                id="payment-amount"
                value={paymentAmount}
                onChange={handlePaymentAmountChange}
                placeholder="0.00"
                className="block w-full pl-12 pr-4 py-4 border-2 border-primary-200 rounded-xl focus:ring-4 focus:ring-primary-500 focus:border-primary-500 text-2xl font-bold text-gray-800 bg-primary-50"
                inputMode="decimal"
              />
              {paymentAmount && parseFloat(paymentAmount) > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2 flex items-center space-x-1">
              <span>💡</span>
              <span>Enter amount in rupees (max: {formatCurrency(currentPending)})</span>
            </p>
          </div>

          {/* Quick amount buttons */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <p className="text-lg font-bold text-gray-800 mb-4">⚡ Quick Select</p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="primary"
                size="touch"
                onClick={() => setPaymentAmount(currentPending.toString())}
                disabled={currentPending <= 0}
                className="h-16 text-lg font-bold"
              >
                💯 Full Amount
              </Button>
              <Button
                variant="outline"
                size="touch"
                onClick={() => setPaymentAmount((currentPending * 0.5).toFixed(2))}
                disabled={currentPending <= 0}
                className="h-16 text-lg font-bold"
              >
                🔄 Half Amount
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="border-t-2 border-primary-200 bg-gradient-to-r from-white to-gray-50 p-6 shadow-lg">
        <div className="flex space-x-4">
          <Button
            variant="outline"
            size="touch"
            onClick={() => setPaymentAmount('')}
            className="flex-1 h-16 text-lg font-bold"
          >
            🗑️ Clear
          </Button>
          <Button
            variant="primary"
            size="touch"
            onClick={handleSaveAndShare}
            disabled={!paymentAmount || parseFloat(paymentAmount) <= 0 || isSaving}
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
