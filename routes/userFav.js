const express=require('express');
const {getFav,addFav,deleteFav} = require('../controllers/userFav');
const { requireSignin } = require('../middleware/auth');

const router=express.Router();

router.post('/user/addfav',requireSignin,addFav);
router.get('/user/getfav',requireSignin,getFav);
router.post('/user/deletefav',requireSignin,deleteFav);


module.exports=router;