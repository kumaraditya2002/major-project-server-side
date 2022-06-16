const mongoose=require('mongoose');

const invSchema=new mongoose.Schema({
    hawkerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hawker',
        required:true
    },
    items:[{
        name:{
            type:String,
            required:true,
            trim:true
        },
        price:{
            type:String,
            required:true,
            trim:true
        }
    }]
},{timestamps:true});

module.exports = mongoose.model('Inventory',invSchema);