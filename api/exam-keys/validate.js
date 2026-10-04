const handler = require('../../lib/handlers/exam-keys');
module.exports = (req, res) => { if (!req.query) req.query = {}; req.query.public = '1'; delete req.query.id; return handler(req, res); };