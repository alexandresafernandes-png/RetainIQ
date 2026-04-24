CREATE TYPE interaction_status AS ENUM ('pending', 'sent', 'delivered', 'replied', 'failed');
CREATE TYPE interaction_direction AS ENUM ('outbound', 'inbound');

CREATE TABLE interactions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id  uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id  uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  template_id  uuid REFERENCES templates(id) ON DELETE SET NULL,
  sent_at      timestamptz,
  delivered_at timestamptz,
  replied_at   timestamptz,
  status       interaction_status NOT NULL DEFAULT 'pending',
  direction    interaction_direction NOT NULL DEFAULT 'outbound',
  message_body text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON interactions
  USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- Allow n8n service role to update status
CREATE INDEX idx_interactions_business_id ON interactions (business_id);
CREATE INDEX idx_interactions_customer_id ON interactions (customer_id);
CREATE INDEX idx_interactions_status ON interactions (status);
