var express = require('express')
  , router = express.Router();

const coopModel = require("../models/cooperative_model");
modelCotisse = new coopModel("cotisse");

router.get('/cooperative', function (req, res) {
  cooperatives = modelCotisse.get_all_cooperatives();
  cooperatives.then(function (response) {
      res.json(response);
    }, function(error) {
      res.json(error);
    });
})

module.exports = router
