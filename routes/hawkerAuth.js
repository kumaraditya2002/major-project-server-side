const express=require('express');
const {hawkerSignin,hawkerSignup}=require('../controllers/auth')
const {validateSignupRequest,validateSigninRequest,isSignupRequestValidated,isSigninRequestValidated} = require('../validators/auth')
const router=express.Router();

router.post('/hawker/signup',validateSignupRequest,isSignupRequestValidated,hawkerSignup);
router.post('/hawker/signin',validateSigninRequest,isSigninRequestValidated,hawkerSignin);

module.exports=router;