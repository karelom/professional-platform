-- ============================================================
-- 花寓職人平台 — Supabase 資料庫初始化腳本
-- 在 Supabase SQL Editor 中一次執行即可完成建表 + RLS + 函數
-- ============================================================

-- ------------------------------------------------------------
-- 1. 輔助函數
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ------------------------------------------------------------
-- 2. 建表
-- ------------------------------------------------------------

-- profiles（用戶資料，與 auth.users 綁定）
CREATE TABLE profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone       text UNIQUE NOT NULL,
  name        text NOT NULL,
  role        text NOT NULL DEFAULT 'artisan'
              CHECK (role IN ('admin', 'artisan')),
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- products（商品講義模板）
CREATE TABLE products (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  emoji       text,
  tags        text[] DEFAULT '{}',
  steps       jsonb NOT NULL DEFAULT '[]',
  notes       jsonb NOT NULL DEFAULT '[]',
  quality     jsonb NOT NULL DEFAULT '[]',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- orders（訂單，含從模板複製的講義）
CREATE TABLE orders (
  id              text PRIMARY KEY,
  product_id      uuid REFERENCES products(id),
  product_name    text NOT NULL,
  product_emoji   text,
  product_tags    text[] DEFAULT '{}',
  artisan_id      uuid REFERENCES profiles(id),
  qty             int NOT NULL,
  unit_price      int NOT NULL,
  deadline        date NOT NULL,
  status          text NOT NULL DEFAULT 'draft'
                  CHECK (status IN (
                    'draft', 'accepted', 'reviewing',
                    'approved', 'rejected',
                    'shipping', 'settled', 'cancelled'
                  )),
  steps           jsonb NOT NULL DEFAULT '[]',
  notes           jsonb NOT NULL DEFAULT '[]',
  quality         jsonb NOT NULL DEFAULT '[]',
  admin_notes     text DEFAULT '',
  cancel_reason   text,
  cancelled_at    timestamptz,
  cancelled_by    uuid REFERENCES profiles(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- submissions（送審紀錄，一筆訂單可有多次送審）
CREATE TABLE submissions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        text NOT NULL REFERENCES orders(id),
  artisan_id      uuid NOT NULL REFERENCES profiles(id),
  photos          text[] NOT NULL DEFAULT '{}',
  notes           text DEFAULT '',
  review_status   text NOT NULL DEFAULT 'pending'
                  CHECK (review_status IN ('pending', 'approved', 'rejected')),
  review_note     text,
  reviewed_at     timestamptz,
  reviewed_by     uuid REFERENCES profiles(id),
  submitted_at    timestamptz NOT NULL DEFAULT now()
);

-- settlements（分潤/金流記錄）
CREATE TABLE settlements (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id        uuid NOT NULL REFERENCES profiles(id),
  order_id          text REFERENCES orders(id),
  amount            int NOT NULL,
  type              text NOT NULL
                    CHECK (type IN ('revenue', 'shipping_subsidy', 'deduction')),
  shipping_status   text NOT NULL DEFAULT 'not_shipped'
                    CHECK (shipping_status IN ('not_shipped', 'shipped', 'received')),
  payment_status    text NOT NULL DEFAULT 'pending'
                    CHECK (payment_status IN ('pending', 'paid')),
  note              text DEFAULT '',
  date              date NOT NULL DEFAULT CURRENT_DATE,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- notifications（App 內通知）
CREATE TABLE notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id),
  title       text NOT NULL,
  body        text NOT NULL,
  link        text,
  is_read     boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- 3. 索引（常用查詢加速）
-- ------------------------------------------------------------

CREATE INDEX idx_orders_artisan_id ON orders(artisan_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_submissions_order_id ON submissions(order_id);
CREATE INDEX idx_submissions_artisan_id ON submissions(artisan_id);
CREATE INDEX idx_settlements_artisan_id ON settlements(artisan_id);
CREATE INDEX idx_settlements_date ON settlements(date);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = false;

-- ------------------------------------------------------------
-- 4. RLS（Row Level Security）
-- ------------------------------------------------------------

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (id = auth.uid() OR is_admin());
CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL USING (is_admin());

-- products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_select" ON products
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "products_admin_all" ON products
  FOR ALL USING (is_admin());

-- orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_select" ON orders
  FOR SELECT USING (artisan_id = auth.uid() OR is_admin());
CREATE POLICY "orders_admin_all" ON orders
  FOR ALL USING (is_admin());
CREATE POLICY "orders_artisan_update" ON orders
  FOR UPDATE USING (artisan_id = auth.uid())
  WITH CHECK (status IN ('accepted', 'reviewing', 'shipping'));

-- submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "submissions_select" ON submissions
  FOR SELECT USING (artisan_id = auth.uid() OR is_admin());
CREATE POLICY "submissions_artisan_insert" ON submissions
  FOR INSERT WITH CHECK (artisan_id = auth.uid());
CREATE POLICY "submissions_admin_update" ON submissions
  FOR UPDATE USING (is_admin());

-- settlements
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settlements_select" ON settlements
  FOR SELECT USING (artisan_id = auth.uid() OR is_admin());
CREATE POLICY "settlements_admin_all" ON settlements
  FOR ALL USING (is_admin());

-- notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_select" ON notifications
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "notifications_update" ON notifications
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "notifications_admin_insert" ON notifications
  FOR INSERT WITH CHECK (is_admin());

-- ------------------------------------------------------------
-- 5. Storage Bucket
-- ------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('submissions', 'submissions', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "submissions_storage_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'submissions'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "submissions_storage_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'submissions');

-- ------------------------------------------------------------
-- 6. updated_at 自動更新觸發器
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
