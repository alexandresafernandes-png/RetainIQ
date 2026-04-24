CREATE TYPE feedback_status AS ENUM ('pending', 'completed', 'expired');
CREATE TYPE sentiment AS ENUM ('positive', 'neutral', 'negative');

CREATE TABLE feedback_sessions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id    uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id    uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  interaction_id uuid REFERENCES interactions(id) ON DELETE SET NULL,
  token          text NOT NULL UNIQUE,
  status         feedback_status NOT NULL DEFAULT 'pending',
  response_text  text,
  rating         smallint CHECK (rating BETWEEN 1 AND 5),
  sentiment      sentiment,
  submitted_at   timestamptz,
  expires_at     timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE feedback_sessions ENABLE ROW LEVEL SECURITY;

-- Authenticated business owners see their own data
CREATE POLICY "tenant_isolation" ON feedback_sessions
  USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- Public token-based access (for feedback form submission)
-- This is handled via the service role key in API routes, not via RLS

CREATE INDEX idx_feedback_sessions_token ON feedback_sessions (token);
CREATE INDEX idx_feedback_sessions_business_id ON feedback_sessions (business_id);
CREATE INDEX idx_feedback_sessions_customer_id ON feedback_sessions (customer_id);
