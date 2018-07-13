var express = require('express')
  , router = express.Router();

  const coopModel = require("../models/cooperative_model");
  modelCotisse = new coopModel("cotisse");

router.get('/cooperative', function (req, res) {
  cooperatives = modelCotisse.get_all_cooperatives();
  console.log(cooperatives);
  res.json(cooperatives);
})

module.exports = router
