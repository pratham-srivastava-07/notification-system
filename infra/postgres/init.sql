CREATE TABLE rules (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  channels TEXT[] NOT NULL,
  conditions JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE templates (
  id UUID PRIMARY KEY,
  channel TEXT NOT NULL,
  version INT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE delivery_logs (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL,
  attempts INT DEFAULT 0,
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
