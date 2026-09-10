CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone TEXT,
  full_name TEXT,
  wallet_balance DECIMAL(15,2) DEFAULT 0,
  is_admin BOOLEAN DEFAULT FALSE,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  daily_profit DECIMAL(15,2) NOT NULL,
  image_url TEXT,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(15,2) NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  product_id UUID NOT NULL REFERENCES products(id),
  purchase_date TIMESTAMP DEFAULT NOW(),
  daily_profit DECIMAL(15,2) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_profits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  purchase_id UUID NOT NULL REFERENCES purchases(id),
  profit_date DATE NOT NULL,
  profit_amount DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referral_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id),
  referred_user_id UUID NOT NULL REFERENCES users(id),
  level INTEGER NOT NULL,
  commission_percentage DECIMAL(5,2) NOT NULL,
  commission_amount DECIMAL(15,2),
  from_purchase_id UUID REFERENCES purchases(id),
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO products (name, price, daily_profit, image_url, description) VALUES
('Emerald Dream', 10000, 3000, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop', 'Beautiful emerald diamond stone'),
('Sapphire Elegance', 15000, 5500, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop', 'Premium sapphire diamond'),
('Ruby Radiance', 20000, 7000, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop', 'Stunning ruby diamond'),
('Diamond Brilliance', 25000, 9500, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop', 'Exceptional diamond brilliance'),
('Crystal Crown', 30000, 10000, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop', 'Royal crystal crown'),
('Platinum Treasure', 50000, 18000, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop', 'Platinum treasure collection'),
('Golden Glory', 75000, 20000, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop', 'Golden glory masterpiece'),
('Supreme Sovereign', 100000, 27000, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop', 'Supreme sovereign collection');

INSERT INTO users (email, password_hash, full_name, is_admin, referral_code) VALUES
('admin@nagapearls.com', '$2b$10$admin_hash_placeholder', 'Admin User', TRUE, 'ADMIN001');