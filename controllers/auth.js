const Hawker=require('../models/hawker');
const jwt=require('jsonwebtoken');

exports.hawkerSignup=(req,res)=>{
    Hawker.findOne({email:req.body.email})
    .exec((error,user)=>{
        if(user) return res.status(400).json({
            message:"Email already registered please login"
        });

        const {
            name,
            email,
            contact,
            password,
            category,
            locality,
            city,
            lat,
            long
        } = req.body;
        const _hawker=new Hawker({name,email,contact,password,category,locality,city,lat,long,profileimage:'uploads/default.jpeg'});

        _hawker.save((error,data)=>{
            if(error){
                return res.status(400).json({
                    message:"Something went wrong"
                });
            }
            else if(data){
                return res.status(201).json({
                    message:"Signup Sucessful please login"
                });
            }
        });
    });
}

exports.hawkerSignin=(req,res)=>{
    Hawker.findOne({email:req.body.email})
    .exec((error,user)=>{
        if(error){
            return res.status(400).json({error:error.message});
        }
        if(user){
            if(user.authenticate(req.body.password)){
                const token=jwt.sign({_id:user._id},process.env.JWT_SECRET);

                const {_id,name,email,contact}=user;

                res.status(200).json({
                    token,
                    user:{
                        _id,name,email,contact
                    }
                });

            }else{
                return res.status(400).json({error:"Invalid password"});
            }
        }
        else{
            return res.status(400).json({error:"You are not registered please sign up first"});
        }
    });
}

