const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.updateUserLocation = (req, res) => {
  User.findOne({ _id: req.user._id }).exec((error, user) => {
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
