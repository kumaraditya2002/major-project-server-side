const express=require('express');
const {addInventory, deleteItem, getItems,getHawInv} = require('../controllers/inventory');
const {requireSignin}= require('../middleware/auth');

const router=express.Router();

router.post('/hawker/additem',requireSignin,addInventory);
router.post('/hawker/deleteitem',requireSignin,deleteItem);
router.get('/hawker/getitem',requireSignin,getItems);
router.get('/hawker/getinv/:hawkerid',getHawInv);

module.exports=router;
