const express = require('express')
  , router = express.Router();

const coopModel = require("../models/cooperative_model");
modelCotisse = new coopModel("cotisse");

router.get('/cooperative', function (req, res) {
  let cooperatives = modelCotisse.get_all_cooperatives();
  cooperatives.then(function (response) {
      res.json(response);
    }, function(error) {
      res.json(error);
    });
})

router.post("/cooperative/add", function(req, res) {
  let cooperative = {
    coop_nom: req.body.coop_nom,
    coop_adresse: req.body.coop_adresse,
    coop_etat_parametre: req.body.coop_etat_parametre
  }
  modelCotisse.add_cooperative(cooperative).then(response => {
      res.json(response);
    }, error => {
      res.json(error);
    });
});

router.post("/cooperative/update", function (req, res) {
  let id = { coop_id: req.body.coop_id };
  let cooperative_update = {
    coop_nom: req.body.coop_nom,
    coop_adresse: req.body.coop_adresse,
    coop_etat_parametre: req.body.coop_etat_parametre
  }
  modelCotisse.update_cooperative(id, cooperative_update).then(response => {
      res.json(response);
    }, error => {
      res.json(error);
    });
});

router.post("/cooperative/delete", function (req, res) {
  let id = { coop_id: req.body.coop_id };
  modelCotisse.delete_cooperative(id).then(response => {
      res.json(response);
    }, error => {
      res.json(error);
    });
});

module.exports = router;
