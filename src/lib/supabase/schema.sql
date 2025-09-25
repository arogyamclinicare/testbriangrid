-- BrainGrid Milk Distribution Database Schema
-- Single-user prototype with no authentication required

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Shops table - 20 shops in fixed route order
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  route_order INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table - Fixed 6 products with prices
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deliveries table - Product quantities stored as JSONB
CREATE TABLE IF NOT EXISTS deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  product_quantities JSONB NOT NULL DEFAULT '{}',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table - Customer payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes table - Timestamped notes for shops
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_deliveries_shop_date ON deliveries(shop_id, date);
CREATE INDEX IF NOT EXISTS idx_payments_shop_date ON payments(shop_id, date);
CREATE INDEX IF NOT EXISTS idx_notes_shop_date ON notes(shop_id, date);
CREATE INDEX IF NOT EXISTS idx_shops_route_order ON shops(route_order);

-- Row Level Security (RLS) - Allow all operations for single-user prototype
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations (single-user prototype)
CREATE POLICY "Allow all operations on shops" ON shops FOR ALL USING (true);
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations on deliveries" ON deliveries FOR ALL USING (true);
CREATE POLICY "Allow all operations on payments" ON payments FOR ALL USING (true);
CREATE POLICY "Allow all operations on notes" ON notes FOR ALL USING (true);

-- Insert default products
INSERT INTO products (name, price) VALUES
  ('Smart', 26.00),
  ('Tone milk 180ml', 10.50),
  ('DTM 180ml', 9.00),
  ('Vikas Gold', 35.50),
  ('Dahi 180ml', 18.00),
  ('Vikas Tak', 15.00)
ON CONFLICT (name) DO NOTHING;

-- Insert 20 default shops
INSERT INTO shops (name, route_order) VALUES
  ('Shop 1', 1),
  ('Shop 2', 2),
  ('Shop 3', 3),
  ('Shop 4', 4),
  ('Shop 5', 5),
  ('Shop 6', 6),
  ('Shop 7', 7),
  ('Shop 8', 8),
  ('Shop 9', 9),
  ('Shop 10', 10),
  ('Shop 11', 11),
  ('Shop 12', 12),
  ('Shop 13', 13),
  ('Shop 14', 14),
  ('Shop 15', 15),
  ('Shop 16', 16),
  ('Shop 17', 17),
  ('Shop 18', 18),
  ('Shop 19', 19),
  ('Shop 20', 20)
ON CONFLICT (route_order) DO NOTHING;
