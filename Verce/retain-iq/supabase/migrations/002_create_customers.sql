CREATE TABLE customers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name        text NOT NULL,
  phone       text NOT NULL,
  email       text,
  tags        text[] DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (business_id, phone)
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON customers
  USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );
