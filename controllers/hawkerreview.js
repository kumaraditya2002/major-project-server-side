const Review = require("../models/hawkerReview");
const User = require("../models/user");

exports.getReview=(req,res)=>{
    Review.findOne({hawkerId:req.params.hawkerid})
    .exec((err,review)=>{
        if(err)
            return res.status(400).json({message:"Something went wrong"});
        else
            return res.status(200).json(review);
    });
}

exports.addReview=(req,res)=>{
    Review.findOne({hawkerId:req.params.hawkerid})
    .exec((err,rev)=>{
        if(err)
            return res.status(400).json({message:"Something went wrong from"});
        if(rev){
            User.findOne({_id:req.user._id})
            .exec((err,user)=>{
                if(err)
                    return res.status(400).json({message:"Something went wrong from"});
                else{
                    rev.reviews.push({name:user.name,rating:req.body.rating,review:req.body.review});
                    rev.save((err,data)=>{
                        if(err)
                            return res.status(400).json({message:"Something went wrong from"});
                        else
                            return res.status(200).json(data);
                    })
                }
            })
            
        }
        else{
            User.findOne({_id:req.user._id})
            .exec((err,user)=>{
                if(err)
                    return res.status(400).json({message:"Something went wrong from"});
                else{
                    let arr=[];
                    arr.push({name:user.name,rating:req.body.rating,review:req.body.review});
                    // console.log(req.user)
                    // console.log(req.body)
                    let newReview=Review({hawkerId:req.params.hawkerid,reviews:arr});
                    newReview.save((error,data)=>{
                        if(error){
                            return res.status(400).json({
                                message:"Something went wrong from"
                            });
                        }
                        else if(data){
                            return res.status(200).json(data);
                        }
                    });
                }
            })
        }
        
    });
}