const handler=require('./index');module.exports=(req,res)=>{req.query.public='1';return handler(req,res)};
