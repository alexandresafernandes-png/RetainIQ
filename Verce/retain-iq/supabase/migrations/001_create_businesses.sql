CREATE TABLE businesses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  phone       text,
  whatsapp_id text,
  delay_hours int NOT NULL DEFAULT 24,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_only" ON businesses
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());
