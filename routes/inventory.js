const express=require('express');
const {addInventory, deleteItem, getItems} = require('../controllers/inventory');
const {requireSignin}= require('../middleware/auth');

const router=express.Router();

router.post('/hawker/additem',requireSignin,addInventory);
router.post('/hawker/deleteitem',requireSignin,deleteItem);
router.get('/hawker/getitem',requireSignin,getItems);

module.exports=router;
