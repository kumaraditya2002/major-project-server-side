const Hawker = require("../models/hawker");
const Review = require("../models/hawkerReview");
const Inventory = require("../models/inventory");
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt');

function findDistance(lat1,lon1,lat2,lon2) {
  lat1=parseFloat(lat1);
  lon1=parseFloat(lon1);
  lat2=parseFloat(lat2);
  lon2=parseFloat(lon2);
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
exports.hawkerProfileInfo = (req, res) => {
  Hawker.findOne({ _id: req.user._id }).exec((error, user) => {
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    if (user) {
      res.status(200).json(user);
    }
  });
};

const filterUtil = async (req, res) => {
  try {
    var catArr = req.body.cat;
    var itemName = req.body.item.toLowerCase();
    const data = await Hawker.find({});
    let rsp=[],r=0.5;
    do{
      if(r>2)
        break;
       rsp=data.filter(e=>r-findDistance(e.lat,e.long,req.body.lat,req.body.long)>=0)
       r+=0.5;
    }while(rsp.length===0)
    
    if (catArr.length === 0) {
      return await Promise.all(
        rsp.map(async (e) => {
          const inv = await Inventory.findOne({ hawkerId: e._id });
          let ans = [];
          if (inv) {
            ans = inv.items.filter((e) =>
              e.name.toLowerCase().includes(itemName)
            );
          }
          if (ans.length > 0) return e;
          else return {};
        })
      );
    } else {
      const newRsp = rsp.filter((e) => catArr.includes(e.category));
      return await Promise.all(
        newRsp.map(async (e) => {
          const inv = await Inventory.findOne({ hawkerId: e._id });
          let ans = [];
          if (inv) {
            ans = inv.items.filter((e) =>
              e.name.toLowerCase().includes(itemName)
            );
          }
          if (ans.length > 0) return e;
          else return {};
        })
      );
    }
  } catch (error) {
    return err;
  }
};
exports.filterByItem = (req, res) => {
  filterUtil(req, res)
    .then((data) => {
      let ans = [];
      ans = data.filter((e) => Object.keys(e).length !== 0);
      return res.status(200).json({ ok: true, ans });
    })
    .catch((err) => res.status(400).json({ ok: false, err }));
};
exports.sortByRating = async (req, res) => {
  try {
    
    let rsp1=await filterUtil(req,res);
    rsp1=rsp1.filter((e) => Object.keys(e).length !== 0);
    // console.log(rsp1)

    const data = await Promise.all(
      rsp1.map(async (e) => {
        const rev = await Review.findOne({ hawkerId: e._id });
        let rating = 0,
          sum = 0;
        if (rev) {
          rev.reviews.forEach((e) => (sum += e.rating));
          rating = (sum / rev.reviews.length).toFixed(1);

        }
        return {
          id:e._id,
          rating: parseFloat(rating)
        
        };
      })
    );
    
    let obj={};
    data.forEach(e=>obj[e.id]=e.rating)
    rsp1.sort((a,b)=>{
        if(obj[a.id]>obj[b.id])
          return -1;
        return 1
    })
    return res.status(200).json({ ok: true, rsp1 });
  } catch (err) {
    return res.status(400).json({ ok: false, err: err.message });
  }
};

const filterUtil1 = async (req, res) => {
  try {
    var catArr = req.body.cat;
    var itemName = req.body.item.toLowerCase();
    const data = await Hawker.find({});
    let rsp=[],r=0.5;
    do{
      if(r>2)
        break;
       rsp=data.filter(e=>r-findDistance(e.lat,e.long,req.body.lat,req.body.long)>=0)
       r+=0.5;
    }while(rsp.length===0)
    
    if (catArr.length === 0) {
      return await Promise.all(
        rsp.map(async (e) => {
          const inv = await Inventory.findOne({ hawkerId: e._id });
          let ans = [];
          if (inv) {
            ans = inv.items.filter((e) =>
              e.name.toLowerCase().includes(itemName)
            );
          }
          if (ans.length > 0) return {hawker:e,items:ans};
          else return {};
        })
      );
    } else {
      const newRsp = rsp.filter((e) => catArr.includes(e.category));
      return await Promise.all(
        newRsp.map(async (e) => {
          const inv = await Inventory.findOne({ hawkerId: e._id });
          let ans = [];
          if (inv) {
            ans = inv.items.filter((e) =>
              e.name.toLowerCase().includes(itemName)
            );
          }
          if (ans.length > 0) return {e,ans};
          else return {};
        })
      );
    }
  } catch (error) {
    return err;
  }
};

exports.sortByPrice=async (req,res)=>{
    try{
      let rsp=await filterUtil1(req,res);
      rsp=rsp.filter((e) => Object.keys(e).length !== 0);
      rsp.sort((a,b)=>{
        let unitA=a.items[0].price.split(' ')[1].split('/')[1];
        let unitB=b.items[0].price.split(' ')[1].split('/')[1];
        let priceA=parseInt(a.items[0].price.split(' ')[0]);
        let priceB=parseInt(b.items[0].price.split(' ')[0]);
        if(a.hawker.category==='Vegetable Seller' && unitA!==unitB){
          if(unitA==='gm')
            priceA/=1000;
        
          if(unitB==='gm')
            priceB/=1000;
        }
        if(priceA>priceB)
          return 1;
        return -1;
      })
      const data=[];
      rsp.forEach(e=>{
        data.push(e.hawker)
      })
      return res.status(200).json({ok:true,data});
    }
    catch(err){
      return res.status(400).json({ok:false,err})
    }
}


exports.getHawkersProfile = async (req, res) => {
  try{
    // console.log(req.body.lat,req.body.long)
    const rsp=await Hawker.find({})
    let data=[],r=0.5;
    do{
      if(r>2)
        break;
       data=rsp.filter(e=>r-findDistance(e.lat,e.long,req.body.lat,req.body.long)>=0)
       r+=0.5;
    }while(data.length===0)
    return res.status(200).json({ ok: true, data,r });
  }
  catch(err){
    return res.status(400).json({ ok: false, err: err.message });
  }

};

exports.updateProfileContact = (req, res) => {
  Hawker.findOne({ _id: req.user._id }).exec((error, user) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        message: error.message,
      });
    } else {
      user.contact = req.body.contact;
      user.save((err, data) => {
        if (err)
          return res.status(400).json({
            ok: false,
            message: err.message,
          });
        else
          return res.status(200).json({
            ok: true,
            data,
          });
      });
    }
  });
};

exports.updateProfileImage = (req, res) => {
  Hawker.findOne({ _id: req.user._id }).exec((error, user) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        message: error.message,
      });
    } else {
      user.profileimage = req.file.path;
      user.save((err, data) => {
        if (err)
          return res.status(400).json({
            ok: false,
            message: err.message,
          });
        else
          return res.status(200).json({
            ok: true,
            data,
          });
      });
    }
  });
};
exports.updateProfileAddress = (req, res) => {
  Hawker.findOne({ _id: req.user._id }).exec((error, user) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        message: error.message,
      });
    } else {
      user.locality = req.body.locality;
      user.city = req.body.city;
      user.save((err, data) => {
        if (err)
          return res.status(400).json({
            ok: false,
            message: err.message,
          });
        else
          return res.status(200).json({
            ok: true,
            data,
          });
      });
    }
  });
};
exports.updateProfileLatLong = (req, res) => {
  // console.log(req.body)
  Hawker.findOne({ _id: req.user._id }).exec((error, user) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        message: error.message,
      });
    } else {
      user.lat = req.body.lat;
      user.long = req.body.long;
      user.save((err, data) => {
        if (err)
          return res.status(400).json({
            ok: false,
            message: err.message,
          });
        else
          return res.status(200).json({
            ok: true,
            data,
          });
      });
    }
  });
};
exports.updateProfileEmail = (req, res) => {
  Hawker.findOne({ email: req.body.email }).exec((error, user) => {
    if (error)
      return res.status(400).json({
        ok: false,
        message: error.message,
      });
    else if (user)
      return res.status(400).json({
        ok: false,
        message: "Email already registered with other account",
      });
    else {
      Hawker.findOne({ _id: req.user._id }).exec((error, user) => {
        if (error)
          return res.status(400).json({
            ok: false,
            message: error.message,
          });
        else {
          user.email = req.body.email;
          user.save((err, data) => {
            if (err)
              return res.status(400).json({
                ok: false,
                message: err.message,
              });
            else return res.status(200).json({ ok: true, data });
          });
        }
      });
    }
  });
};

exports.resetPassword=async (req,res)=>{
  try{
    const {email}=req.body;
    // console.log(req.body)
    const hawker=await Hawker.findOne({email});
    // console.log(hawker)
    if(!hawker){
      return res.status(401).json({ok:false,err:'Email not registered'})
    }
    else{
      const token=jwt.sign({_id:hawker._id},"123456",{expiresIn:'20m'});
      
      hawker.updateOne({resetLink:token},(err,data)=>{
        if(err)
          return res.status(400).json({ok:false,err:err.message});
        else{
          return res.status(200).json({ok:true,token});
        }
      })
    }
  }catch(err){
    return res.status(401).json({ok:false,err:err.message})
  }
}

exports.forgotPassword=async (req,res)=>{
  try{
    const resetLink=req.body.token;
    const hawker=await Hawker.findOne({resetLink});
    // console.log(hawker)
    if(!hawker){
      return res.status(401).json({ok:false,err:'Something went wrong try again'})
    }else{
      hawker.hash_password=bcrypt.hashSync(req.body.password,10);
      hawker.save((err,data)=>{
        if(err)
          res.status(401).json({ok:false,err:err.message})
        else{
          res.status(200).json({ok:true,data})
        }
      })
    }
  }catch(err){
    return res.status(401).json({ok:false,err:err.message})
  }
}