const mongoose=require('mongoose');

const favoritesSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    favorites:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Hawker'
    }]
},{timestamps:true});

module.exports = mongoose.model('Favorite',favoritesSchema);