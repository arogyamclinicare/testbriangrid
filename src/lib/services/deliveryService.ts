import { SupabaseMCP, Delivery } from '@/lib/supabase/mcp-config';
import { DeliveryItem } from '@/stores/deliveryStore';
import { getAllProducts } from '@/lib/utils/calculations';

export interface SaveDeliveryRequest {
  shopId: string;
  date: string;
  items: { [productId: string]: DeliveryItem };
}

export class DeliveryService {
  static async saveDelivery(request: SaveDeliveryRequest): Promise<{ success: boolean; error?: string }> {
    try {
      const products = getAllProducts();
      const productMap = new Map(products.map(p => [p.id, p]));

      const productQuantities: { [key: string]: number } = {};
      let totalAmount = 0;

      for (const productId in request.items) {
        const item = request.items[productId];
        const product = productMap.get(productId);

        if (!product || !item) {
          console.warn(`Product with ID ${productId} not found or item is undefined. Skipping.`);
          continue;
        }

        productQuantities[productId] = item.quantity;
        totalAmount += item.quantity * product.price;
      }

      const newDelivery = await SupabaseMCP.createDelivery({
        shop_id: request.shopId,
        date: request.date,
        product_quantities: productQuantities,
        total_amount: totalAmount,
      });

      console.log('Delivery saved:', newDelivery);
      return { success: true };
    } catch (error: unknown) {
      console.error('Error saving delivery:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  static async getDeliveriesForShop(shopId: string, date?: string): Promise<Delivery[]> {
    return SupabaseMCP.getDeliveries(shopId, date);
  }
}