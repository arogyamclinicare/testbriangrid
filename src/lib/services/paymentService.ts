import { SupabaseMCP, Payment } from '@/lib/supabase/mcp-config';

export interface SavePaymentRequest {
  shopId: string;
  date: string;
  amount: number;
}

export class PaymentService {
  static async savePayment(request: SavePaymentRequest): Promise<{ success: boolean; error?: string }> {
    try {
      const newPayment = await SupabaseMCP.createPayment({
        shop_id: request.shopId,
        date: request.date,
        amount: request.amount,
      });

      console.log('Payment saved:', newPayment);
      return { success: true };
    } catch (error: unknown) {
      console.error('Error saving payment:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static async getPaymentsForShop(shopId: string, date?: string): Promise<Payment[]> {
    return SupabaseMCP.getPayments(shopId, date);
  }

  static async getOutstandingBalance(shopId: string): Promise<number> {
    return SupabaseMCP.getShopBalance(shopId);
  }
}