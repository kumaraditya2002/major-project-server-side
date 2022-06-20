const express=require('express');
const {UserSignin,userSignup}=require('../controllers/userauth')
const {validateUserSignupRequest,validateSigninRequest,isUserSignupRequestValidated,isSigninRequestValidated} = require('../validators/auth')
const router=express.Router();

router.post('/user/signup',validateUserSignupRequest,isUserSignupRequestValidated,userSignup);
router.post('/user/signin',validateSigninRequest,isSigninRequestValidated,UserSignin);

module.exports=router;