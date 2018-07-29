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

router.post("/cooperative/add", function(req, res) {
  coop = {
    coop_nom: req.body.coop_nom,
    coop_adresse: req.body.coop_adresse,
    coop_etat_parametre: req.body.coop_etat_parametre
  }
  modelCotisse.add_cooperative(coop).then( (response) => {
    res.json(response);
  }, (error) => {
    res.json(error)
  });
});

router.post("/cooperative/update", function (req, res) {
  id = { coop_id: req.body.coop_id };
  cooperatives = {
    coop_nom: req.body.coop_nom,
    coop_adresse: req.body.coop_adresse,
    coop_etat_parametre: req.body.coop_etat_parametre
  }
  modelCotisse.update_cooperative(id, cooperatives).then(response => {
      res.json(response);
    }, error => {
      res.json(error);
    });
});

module.exports = router
