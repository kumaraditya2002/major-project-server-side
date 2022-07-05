const express=require('express');
const {updateUserLocation, getEmail,changeEmail,changePassword,resetPassword,forgotPassword}=require('../controllers/userprofile')
const {requireSignin}=require('../middleware/auth')
const router=express.Router();

router.post('/user/updatelocation',requireSignin,updateUserLocation);
router.post('/user/info',requireSignin,getEmail);
router.post('/user/changeemail',requireSignin,changeEmail);
router.post('/user/changepassword',requireSignin,changePassword);
router.post('/user/resetpassword',resetPassword);
router.post('/user/forgotpassword',forgotPassword);

module.exports=router;
