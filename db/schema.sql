CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name VARCHAR(120) NOT NULL,
  title VARCHAR(160) NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  type VARCHAR(30) NOT NULL,
  prompt TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  model_answer TEXT NOT NULL DEFAULT '',
  max_length INTEGER,
  points INTEGER NOT NULL DEFAULT 1,
  image_url TEXT,
  UNIQUE(exam_id, position)
);
CREATE TABLE IF NOT EXISTS exam_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  key VARCHAR(160) NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  expiry DATE,
  exam_id UUID REFERENCES exams(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  csrf_hash TEXT NOT NULL,
  ip VARCHAR(128) NOT NULL,
  user_agent TEXT NOT NULL DEFAULT '',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS ip_logs (
  id BIGSERIAL PRIMARY KEY,
  ip VARCHAR(128) NOT NULL,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT NOT NULL DEFAULT '',
  page TEXT NOT NULL DEFAULT '',
  admin_session BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS ip_logs_visited_at_idx ON ip_logs(visited_at);
CREATE INDEX IF NOT EXISTS ip_logs_ip_idx ON ip_logs(ip);
CREATE TABLE IF NOT EXISTS blocked_ips (
  ip VARCHAR(128) PRIMARY KEY,
  reason TEXT NOT NULL DEFAULT '',
  created_by UUID REFERENCES admins(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS login_attempts (
  ip VARCHAR(128) PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locked_until TIMESTAMPTZ
);
INSERT INTO exams (title, description) SELECT 'Fysik 8 — Elektromagnetism', 'Examio standardprov för årskurs 8.' WHERE NOT EXISTS (SELECT 1 FROM exams WHERE title='Fysik 8 — Elektromagnetism');
INSERT INTO exam_keys (name, key, status, exam_id)
SELECT 'fysik-elektromagnetisum', 'fysik-elektromagnetisum', 'active', e.id FROM exams e
WHERE e.title='Fysik 8 — Elektromagnetism' AND NOT EXISTS (SELECT 1 FROM exam_keys WHERE key='fysik-elektromagnetisum');
