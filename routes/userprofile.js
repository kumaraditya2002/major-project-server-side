const express=require('express');
const {updateUserLocation}=require('../controllers/userprofile')
const {requireSignin}=require('../middleware/auth')
const router=express.Router();

router.post('/user/updatelocation',requireSignin,updateUserLocation);

module.exports=router;
