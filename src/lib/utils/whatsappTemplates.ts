// DeliveryItem type is not needed here as we use a different structure

export interface DeliveryReceiptData {
  date: string;
  shopName: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  totalAmount: number;
  pendingAfter: number;
}

export interface PaymentReceiptData {
  date: string;
  shopName: string;
  amount: number;
  pendingAfter: number;
}

const BUSINESS_NAME = 'BrainGrid'; // From requirements

export const generateDeliveryReceipt = (data: DeliveryReceiptData): string => {
  const itemsList = data.items
    .map((item) => {
      const lineTotal = item.quantity * item.price;
      return `- ${item.name} × ${item.quantity} @ ₹${item.price.toFixed(2)} = ₹${lineTotal.toFixed(2)}`;
    })
    .join('\n');

  return `Delivery Receipt
Date: ${data.date}
Shop: ${data.shopName}

Items:
${itemsList}

Total: ₹${data.totalAmount.toFixed(2)}
Pending after this: ₹${data.pendingAfter.toFixed(2)}

Thank you,
${BUSINESS_NAME}`;
};

export const generatePaymentReceipt = (data: PaymentReceiptData): string => {
  return `Payment Receipt
Date: ${data.date}
Shop: ${data.shopName}

Amount received: ₹${data.amount.toFixed(2)}
Outstanding after this: ₹${data.pendingAfter.toFixed(2)}

Thank you,
${BUSINESS_NAME}`;
};