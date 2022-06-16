const jwt=require('jsonwebtoken');

exports.requireSignin = (req,res,next)=>{
    if(!req.headers.authorization)
        return res.status(400).json({messg:"You are not signedIn"});
    const token=req.headers.authorization.split(' ')[1];
    const user=jwt.verify(token,process.env.JWT_SECRET);
    req.user=user;
    next();
}