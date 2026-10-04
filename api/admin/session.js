module.exports=(req,res)=>{req.query.action='session';return require('./index')(req,res)};
