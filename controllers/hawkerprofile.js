const Hawker = require("../models/hawker");

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


exports.updateProfileContact = (req, res) => {
    Hawker.findOne({ _id: req.user._id }).exec((error, user) => {
      if (error) {
        return res.status(400).json({
            ok:false,
            message: error.message,
          });
      } else {
        user.contact = req.body.contact;
        user.save((err, data) => {
          if (err) return res.status(400).json({
            ok:false,
            message: err.message,
          });
          else return res.status(200).json({
            ok:true,
            data
          });
        });
      }
    });
  };
  exports.updateProfileImage = (req, res) => {
    Hawker.findOne({ _id: req.user._id }).exec((error, user) => {
      if (error) {
        return res.status(400).json({
            ok:false,
            message: error.message,
          });
      } else {
        user.profileimage = req.file.path;
        user.save((err, data) => {
          if (err) return res.status(400).json({
            ok:false,
            message: err.message,
          });
          else return res.status(200).json({
            ok:true,
            data
          });
        });
      }
    });
  };
  exports.updateProfileAddress = (req, res) => {
    Hawker.findOne({ _id: req.user._id }).exec((error, user) => {
      if (error) {
        return res.status(400).json({
            ok:false,
            message: error.message,
          });
      } else {
        user.locality = req.body.locality;
        user.city=req.body.city;
        user.save((err, data) => {
          if (err) return res.status(400).json({
            ok:false,
            message: err.message,
          });
          else return res.status(200).json({
            ok:true,
            data
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
            ok:false,
            message: error.message,
          });
      } else {
        user.lat = req.body.lat;
        user.long=req.body.long;
        user.save((err, data) => {
          if (err) return res.status(400).json({
            ok:false,
            message: err.message,
          });
          else return res.status(200).json({
            ok:true,
            data
          });
        });
      }
    });
  };
exports.updateProfileEmail = (req, res) => {
  Hawker.findOne({ email: req.body.email }).exec((error, user) => {
    if (error) return res.status(400).json({
        ok:false,
        message: error.message,
      });
    else if (user)
      return res.status(400).json({
        ok:false,
        message: "Email already registered with other account",
      });
    else {
      Hawker.findOne({ _id: req.user._id }).exec((error, user) => {
        if (error) return res.status(400).json({
            ok:false,
            message: error.message,
          });
        else {
          user.email = req.body.email;
          user.save((err, data) => {
            if (err) return res.status(400).json({
                ok:false,
                message: err.message,
              });
            else return res.status(200).json({ok:true,data});
          });
        }
      });
    }
  });
};
