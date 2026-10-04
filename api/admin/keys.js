const handler=require('../exam-keys');module.exports=(req,res)=>{req.query.public=undefined;return handler(req,res)};
