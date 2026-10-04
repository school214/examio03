module.exports=(req,res)=>{req.query.action='profile';return require('./index')(req,res)};
