const express=require('express');
const {hawkerProfileInfo,getHawkersProfile, updateProfileEmail,resetPassword,sortByPrice,sortByRating, updateProfileContact,filterByItem, updateProfileAddress,updateProfileImage,updateProfileLatLong,forgotPassword}=require('../controllers/hawkerprofile')
const {requireSignin}=require('../middleware/auth')
const router=express.Router();
var multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  });
  const fileFilter=(req, file, cb)=>{
    if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png'){
        cb(null,true);
    }else{
        cb(null, false);
    }
   }
   var upload = multer({ 
    storage:storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter:fileFilter
 });

router.get('/hawker/profile',requireSignin,hawkerProfileInfo);
router.post('/hawker/allhawkers',getHawkersProfile);
router.post('/hawker/search',filterByItem);
router.post('/hawker/sortbyrating',sortByRating);
router.post('/hawker/sortbyprice',sortByPrice);
router.post('/hawker/updateemail',requireSignin,updateProfileEmail);
router.post('/hawker/updatecontact',requireSignin,updateProfileContact);
router.post('/hawker/updateaddr',requireSignin,updateProfileAddress);
router.post('/hawker/updatelocation',requireSignin,updateProfileLatLong);
router.post('/hawker/resetpassword' ,resetPassword);
router.post('/hawker/forgotpassword' ,forgotPassword);
router.post('/hawker/updateimage',upload.single('updateProfile'),requireSignin,updateProfileImage);

module.exports=router;