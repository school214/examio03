const crypto = require('crypto');
const { query } = require('./db');
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
function hash(value) { return crypto.createHash('sha256').update(`${process.env.SESSION_SECRET || 'missing'}:${value}`).digest('hex'); }
function clientIp(req) { return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim().slice(0, 128); }
function parseCookies(req) { return Object.fromEntries(String(req.headers.cookie || '').split(';').filter(Boolean).map(x => { const i=x.indexOf('='); return [x.slice(0,i).trim(), decodeURIComponent(x.slice(i+1))]; })); }
function secureCookie(req) { return String(req.headers['x-forwarded-proto'] || '').toLowerCase() === 'https' || process.env.NODE_ENV === 'production'; }
function cookieHeader(name, value, maxAge) { return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=${secureCookie({headers:{'x-forwarded-proto':'https'}}) ? 'None; Secure' : 'Lax'}${maxAge === undefined ? '' : `; Max-Age=${maxAge}`}`; }
async function isBlocked(ip) { const r=await query('SELECT 1 FROM blocked_ips WHERE ip=$1',[ip]); return r.rowCount>0; }
async function logVisit(req, page, adminSession=false) { await query('INSERT INTO ip_logs(ip,user_agent,page,admin_session) VALUES($1,$2,$3,$4)',[clientIp(req),String(req.headers['user-agent']||'').slice(0,500),String(page||'').slice(0,300),adminSession]); }
async function session(req) { const raw=parseCookies(req).examio_admin_session; if(!raw) return null; const r=await query('SELECT s.*, a.display_name, a.title FROM sessions s JOIN admins a ON a.id=s.admin_id WHERE s.token_hash=$1 AND s.expires_at>NOW() AND a.active=true',[hash(raw)]); return r.rows[0]||null; }
async function requireSession(req,res) { const s=await session(req); if(!s){res.status(401).json({error:'Unauthorized'});return null} return s; }
async function csrfOk(req,s) { const raw=String(req.headers['x-csrf-token']||''); return Boolean(raw && hash(raw)===s.csrf_hash); }
function newToken(){return crypto.randomBytes(32).toString('base64url');}
module.exports={hash,clientIp,parseCookies,cookieHeader,isBlocked,logVisit,session,requireSession,csrfOk,newToken,SESSION_TTL_MS};
