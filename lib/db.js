const { Pool } = require('pg');
const pool = global.__examioPool || new Pool({ connectionString: process.env.DATABASE_URL, max: 3, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined });
if (!global.__examioPool) global.__examioPool = pool;
async function query(text, params) { if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured'); return pool.query(text, params); }
module.exports = { pool, query };
