const Favorites = require("../models/userFav");
const mongoose = require("mongoose");

exports.addFav = (req, res) => {
  // console.log(typeof req.body.favorites);
  Favorites.findOne({ userId: req.user._id }).exec((err, data) => {
    if (err) return res.status(400).json({ ok: false, message: err.message });
    else if (data) {
      if (!data.favorites.includes(mongoose.Types.ObjectId(req.body.favorites)))
        data.favorites.push(mongoose.Types.ObjectId(req.body.favorites));
      data.save((err, data) => {
        if (err)
          return res.status(400).json({ ok: false, message: err.message });
        else {
          Favorites.findOne({ userId: req.user._id })
            .populate("favorites")
            .exec((err, rsp) => {
              if (err)
                return res
                  .status(400)
                  .json({ ok: false, message: err.message });
              else return res.status(200).json({ ok: true, rsp });
            });
        }
      });
    } else {
      let fav = [];
      fav.push(mongoose.Types.ObjectId(req.body.favorites));
      let _fav = new Favorites({ userId: req.user._id, favorites: fav });
      _fav.save((err, data) => {
        if (err)
          return res.status(400).json({ ok: false, message: err.message });
        else {
          Favorites.findOne({ userId: req.user._id })
            .populate("favorites")
            .exec((err, rsp) => {
              if (err)
                return res
                  .status(400)
                  .json({ ok: false, message: err.message });
              else return res.status(200).json({ ok: true, rsp });
            });
        }
      });
    }
  });
};
exports.deleteFav = (req, res) => {
  Favorites.findOne({ userId: req.user._id }).exec((err, data) => {
    if (err) return res.status(400).json({ ok: false, message: err.message });
    else {
      let nFav = [];
      data.favorites.forEach((e) => {
        if (e.toString() != req.body.favorites) nFav.push(e);
      });
      data.favorites = nFav;
      data.save((err, data) => {
        if (err)
          return res.status(400).json({ ok: false, message: err.message });
        else {
          Favorites.findOne({ userId: req.user._id })
            .populate("favorites")
            .exec((err, rsp) => {
              if (err)
                return res
                  .status(400)
                  .json({ ok: false, message: err.message });
              else return res.status(200).json({ ok: true, rsp });
            });
        }
      });
    }
  });
};
exports.getFav = (req, res) => {
  Favorites.findOne({ userId: req.user._id }).exec((err, data) => {
    if (err) return res.status(400).json({ ok: false, message: err.message });
    else {
      Favorites.findOne({ userId: req.user._id })
        .populate("favorites")
        .exec((err, data) => {
          if (err)
            return res.status(400).json({ ok: false, message: err.message });
          else return res.status(200).json({ ok: true, data });
        });
    }
  });
};
