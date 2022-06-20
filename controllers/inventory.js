const Inventory=require('../models/inventory');

exports.addInventory=(req,res)=>{
    Inventory.findOne({hawkerId:req.user._id})
    .exec((error,inv)=>{
        if(error)
            return res.status(400).json({message:"Please Try Again"});
        if(inv){
            const addOn=req.body.items;
            // console.log(req.body)
            addOn.forEach(e => {
                inv.items.push(e);
            });
            inv.save((err,data)=>{
                if(err)
                    return res.status(400).json({message:"Please Try Again"});
                else
                    return res.status(200).json(data);
            })
        } 
        else{

            const item={
                hawkerId:req.user._id,
                items:req.body.items
            }
            const _inv=new Inventory(item);
    
            _inv.save((error,data)=>{
                if(error){
                    return res.status(400).json({
                        message:"Something went wrong"
                    });
                }
                else if(data){
                    return res.status(200).json(data);
                }
            });
        }
    });
}

exports.deleteItem=(req,res)=>{
    // console.log(req.body)
    const items=req.body;
    Inventory.findOne({hawkerId:req.user._id})
    .exec((err,inv)=>{
        if(err)
            return res.status(400).json({message:"Something went wrong"});
        else{
            const del=req.body;
            let remItems=[];
            inv.items.forEach(e=>{
                if(!del.includes(e._id.toString()))
                    remItems.push(e);
            });
            inv.items=remItems;
            inv.save((err,data)=>{
                if(err)
                    return res.status(400).json({ message:"Something went wrong"});
                else
                    return res.status(200).json({ data});
            })
        }
    })
}

exports.getItems=(req,res)=>{
    Inventory.findOne({hawkerId:req.user._id})
    .exec((err,inv)=>{
        if(err)
            return res.status(400).json({message:"Something went wrong"});
        else
            return res.status(200).json({ inv});
    });
}
exports.getHawInv=(req,res)=>{
    Inventory.findOne({hawkerId:req.params.hawkerid})
    .exec((err,inv)=>{
        if(err)
            return res.status(400).json({message:"Something went wrong"});
        else
            return res.status(200).json({ inv});
    });
}

