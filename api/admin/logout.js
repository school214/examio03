module.exports=(req,res)=>{req.query.action='logout';return require('./index')(req,res)};
