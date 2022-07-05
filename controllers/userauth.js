const User=require('../models/user');
const jwt=require('jsonwebtoken');

exports.userSignup=(req,res)=>{
    User.findOne({email:req.body.email})
    .exec((error,user)=>{
        if(user) return res.status(400).json({
            ok:false,
            error:"Email already registered please login"
        });
        // console.log(req.body);
        const {
            name,
            email,
            password,
           
        } = req.body;
        const _user=new User({name,email,password});

        _user.save((error,data)=>{
            if(error){
                return res.status(400).json({
                    ok:false,
                    error:"Something went wrong"
                });
            }
            else if(data){
                return res.status(201).json({
                    ok:true,
                    message:"Signup Sucessful please login"
                });
            }
        });
    });
}

exports.UserSignin=(req,res)=>{
    User.findOne({email:req.body.email})
    .exec((error,user)=>{
        if(error){
            return res.status(400).json({ok:false,error:error.message});
        }
        if(user){
            if(user.authenticate(req.body.password)){
                const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);

                const {_id,name,email}=user;

                res.status(200).json({
                    ok:true,
                    token,
                    user:{
                        _id,name,email
                    }
                });

            }else{
                return res.status(400).json({ok:false,error:"Invalid password"});
            }
        }
        else{
            return res.status(400).json({ok:false,error:"You are not registered please sign up first"});
        }
    });
}

