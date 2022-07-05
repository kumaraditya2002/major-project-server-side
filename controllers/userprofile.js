const User = require("../models/user");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

exports.updateUserLocation = (req, res) => {
  User.findOne({ _id: req.user._id }).exec((error, user) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        message: error.message,
      });
    } else {
      user.lat = req.body.lat;
      user.long = req.body.long;
      user.save((err, data) => {
        if (err)
          return res.status(400).json({
            ok: false,
            message: err.message,
          });
        else
          return res.status(200).json({
            ok: true,
            data,
          });
      });
    }
  });
};

exports.getEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({ ok: true, user });
  } catch (err) {
    return res.status(400).json({ ok: false, err });
  }
};
exports.changeEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const euser = await User.findById(req.user._id);
      // console.log(euser);
      euser.email = req.body.email;
      euser.save((err, rsp) => {
        if (err) return res.status(400).json({ ok: false, err: err.message });
        else return res.status(200).json({ ok: true, rsp });
      });
    } else {
      return res
        .status(400)
        .json({ ok: false, err: "Email already registered" });
    }
  } catch (err) {
    return res.status(400).json({ ok: false, err: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // console.log(user);
    if (user.authenticate(req.body.cpassword)) {
      user.hash_password=bcrypt.hashSync(req.body.npassword,10);
      user.save((err,data)=>{
        if(err)
          return res.status(400).json({ ok: false, err: err.message });
        else
          return res.status(200).json({ ok: true, data});
      })
    } else {
      return res.status(400).json({ ok: false, err: "Invalid password" });
    }
    
  } catch (err) {
    return res.status(400).json({ ok: false, err: err.message });
  }
};

exports.resetPassword=async (req,res)=>{
  try{
    const {email}=req.body;
    // console.log(req.body)
    const user=await User.findOne({email});
    if(!user){
      return res.status(401).json({ok:false,err:'Email not registered'})
    }
    else{
      const token=jwt.sign({_id:user._id},"123456",{expiresIn:'20m'});
      
      user.updateOne({resetLink:token},(err,data)=>{
        if(err)
          return res.status(400).json({ok:false,err:err.message});
        else{
          return res.status(200).json({ok:true,token});
        }
      })
    }
  }catch(err){
    return res.status(401).json({ok:false,err:err.message})
  }
}

exports.forgotPassword=async (req,res)=>{
  try{
    const resetLink=req.body.token;
    const user=await User.findOne({resetLink});
    // console.log(user)
    if(!user){
      return res.status(401).json({ok:false,err:'Something went wrong try again'})
    }else{
      user.hash_password=bcrypt.hashSync(req.body.password,10);
      user.save((err,data)=>{
        if(err)
          res.status(401).json({ok:false,err:err.message})
        else{
          res.status(200).json({ok:true,data})
        }
      })
    }
  }catch(err){
    return res.status(401).json({ok:false,err:err.message})
  }
}