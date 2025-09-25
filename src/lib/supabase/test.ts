import { SupabaseMCP } from './mcp-config';

// Test database connection and basic operations
export async function testDatabaseConnection() {
  try {
    console.log('🧪 Testing Supabase database connection...');
    
    // Test 1: Get all shops
    console.log('📋 Testing shops retrieval...');
    const shops = await SupabaseMCP.getShops();
    console.log(`✅ Found ${shops.length} shops`);
    
    // Test 2: Get all products
    console.log('🛍️ Testing products retrieval...');
    const products = await SupabaseMCP.getProducts();
    console.log(`✅ Found ${products.length} products`);
    
    // Test 3: Get today's summary
    console.log('📊 Testing today summary...');
    const summary = await SupabaseMCP.getTodaySummary();
    console.log('✅ Today summary:', summary);
    
    // Test 4: Test shop balance calculation
    if (shops.length > 0) {
      console.log('💰 Testing shop balance calculation...');
      const firstShop = shops[0];
      const balance = await SupabaseMCP.getShopBalance(firstShop.id);
      console.log(`✅ Shop "${firstShop.name}" balance: ₹${balance}`);
    }
    
    console.log('🎉 All database tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}

// Test real-time subscriptions
export async function testRealtimeSubscriptions() {
  try {
    console.log('🔄 Testing real-time subscriptions...');
    
    const shopsSubscription = SupabaseMCP.subscribeToShops((payload) => {
      console.log('📡 Shops subscription update:', payload);
    });
    
    const deliveriesSubscription = SupabaseMCP.subscribeToDeliveries((payload) => {
      console.log('📡 Deliveries subscription update:', payload);
    });
    
    const paymentsSubscription = SupabaseMCP.subscribeToPayments((payload) => {
      console.log('📡 Payments subscription update:', payload);
    });
    
    console.log('✅ Real-time subscriptions established');
    
    // Clean up subscriptions after 5 seconds
    setTimeout(() => {
      shopsSubscription.unsubscribe();
      deliveriesSubscription.unsubscribe();
      paymentsSubscription.unsubscribe();
      console.log('🧹 Subscriptions cleaned up');
    }, 5000);
    
    return true;
  } catch (error) {
    console.error('❌ Real-time subscription test failed:', error);
    return false;
  }
}
