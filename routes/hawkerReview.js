const express=require('express');
const {getReview,addReview} = require('../controllers/hawkerreview');
const { requireSignin } = require('../middleware/auth');

const router=express.Router();

router.get('/hawker/review/:hawkerid',getReview);
router.post('/hawker/postreview/:hawkerid',requireSignin,addReview);

module.exports=router;