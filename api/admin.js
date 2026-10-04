const auth = require('../lib/handlers/auth');
const keys = require('../lib/handlers/exam-keys');
const exams = require('../lib/handlers/exams');
const visits = require('../lib/handlers/visits');
const settings = require('../lib/handlers/settings');

module.exports = (req, res) => {
  let parts = [];
  try {
    const url = new URL(req.url, 'http://localhost');
    const r = url.searchParams.get('r') || '';
    const fromPath = url.pathname.replace(/^\/api\/admin\/?/, '');
    parts = (r || fromPath).split('/').filter(Boolean).map(decodeURIComponent);
  } catch (e) {}
  if (!req.query) req.query = {};
  const q = req.query;
  for (const k of ['r', 'action', 'id', 'public', 'slug']) delete q[k];
  const [name, arg] = parts;
  if (parts.length === 1 && ['login', 'session', 'logout', 'profile'].includes(name)) { q.action = name; return auth(req, res); }
  if (name === 'keys' && parts.length <= 2) { if (arg) q.id = arg; return keys(req, res); }
  if (name === 'exams' && parts.length <= 2) { if (arg) q.id = arg; return exams(req, res); }
  if (name === 'visits' && parts.length <= 2) { if (arg) q.action = arg; return visits(req, res); }
  if (name === 'settings' && parts.length === 1) return settings(req, res);
  res.status(404).json({ error: 'Not found' });
};