const express = require('express');
const router = express.Router();
const Joi = require('joi');

const coopModel = require("../models/cooperative_model");
modelCotisse = new coopModel("cotisse");

router.get('/cooperative',  (req, res) => {
  const cooperatives = modelCotisse.get_all_cooperatives();
  cooperatives.then( (response) => {
    res.json(response);
    }, (error) => {
      res.json(error);
    });
})

router.get('/cooperative/:id', (req, res) => {
  let cooperative = { coop_id: parseInt(req.params.id)};
  modelCotisse.get_cooperative(cooperative).then(response => {
      res.json(response);
    }, error => {
      res.status(404).json("Identifiant de coppérative non trouvé");
    });
});

router.post("/cooperative/add", (req, res) => {
  const { error } = cooperative_validation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

    const cooperative = {
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

router.put("/cooperative/update/:id", (req, res) => {
  let cooperative = { coop_id: parseInt(req.params.id) };
  modelCotisse.get_cooperative(cooperative).then(response => {

      const { error } = cooperative_validation(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const cooperative_update = {
        coop_nom: req.body.coop_nom,
        coop_adresse: req.body.coop_adresse,
        coop_etat_parametre: req.body.coop_etat_parametre
      }

      modelCotisse.update_cooperative(cooperative, cooperative_update).then(response => {
          res.json(response);
        }, (error) => {
          res.json(error);
        });

    }, error => {
      res.status(404).json("Identifiant de coppérative non trouvé");
    });


});

router.delete("/cooperative/delete/:id",  (req, res) => {
  let cooperative = { coop_id: parseInt(req.params.id) };
  modelCotisse.get_cooperative(cooperative).then(response => {
    modelCotisse.delete_cooperative(cooperative).then(response => {
        res.json(response);
      }, (error) => {
        res.json(error);
      });

    }, error => {
      res.status(404).json("Identifiant de coppérative non trouvé");
    });

});

function cooperative_validation(cooperative){
  const schema = {
    coop_nom: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(cooperative, schema);
}

module.exports = router;
