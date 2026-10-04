module.exports=(req,res)=>{req.query.action='login';return require('./index')(req,res)};
