const Hawker = require("../models/hawker");
const Inventory = require("../models/inventory");

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

const filterUtil=async (req, res) => {
  try {
    var catArr = req.body.cat;
    var itemName = req.body.item.toLowerCase();
    const rsp = await Hawker.find({});
    if (catArr.length === 0) {
      return await Promise.all(rsp.map(async (e) => {
        const inv = await Inventory.findOne({ hawkerId: e._id });
        let ans=[];
        if(inv){
          ans=inv.items.filter(e=>e.name.toLowerCase().includes(itemName));
        }
        if(ans.length>0)
          return e
        else
          return {};
      }))
      
    }
    else{
      const newRsp=rsp.filter(e=>catArr.includes(e.category));
      return await Promise.all(newRsp.map(async (e) => {
        const inv = await Inventory.findOne({ hawkerId: e._id });
        let ans=[];
        if(inv){
          ans=inv.items.filter(e=>e.name.toLowerCase().includes(itemName));
        }
        if(ans.length>0)
          return e;
        else
          return {};
      }))
    }
  } catch(error) {
    return err;
  }
};
exports.filterByItem =  (req, res) => {
    filterUtil(req,res)
    .then(data=>{
      let ans=[];
      ans=data.filter(e=>Object.keys(e).length !== 0)
      return res.status(200).json({ok:true,ans});
    })
    .catch(err=>res.status(400).json({ok:false,err}))
};

exports.getHawkersProfile = async (req, res) => {
  // const filter = {};
  await Hawker.find({})
    .then((data) => res.status(200).json({ ok: true, data }))
    .catch((err) => {
      res.status(400).json({ ok: false, err });
    });
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
