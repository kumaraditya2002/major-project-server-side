const mongoose=require('mongoose');

const hawkerReview=new mongoose.Schema({
    hawkerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hawker',
        required:true
    },
    reviews:[{
        name:{
            type:String,
            required:true,
            trim:true
        },
        rating:{
            type:Number,
            required:true,
            min:1,
            max:5
        },
        review:{
            type:String,
            required:true,
            trim:true
        }
    }]
},{timestamps:true});

module.exports = mongoose.model('Review',hawkerReview);