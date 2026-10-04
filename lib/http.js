function json(res, status, value, headers={}) { Object.entries(headers).forEach(([k,v])=>res.setHeader(k,v)); res.status(status).json(value); }
async function body(req) { if (req.body && typeof req.body === 'object') return req.body; return new Promise(resolve=>{let raw='';req.on('data',c=>{raw+=c;if(raw.length>1000000)req.destroy()});req.on('end',()=>{try{resolve(JSON.parse(raw||'{}'))}catch{resolve({})}})}); }
function security(res){res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');res.setHeader('Content-Security-Policy',"default-src 'self' 'unsafe-inline' data:; img-src 'self' data:; connect-src 'self'");}
module.exports={json,body,security};
