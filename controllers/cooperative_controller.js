const express = require('express');
const router = express.Router();
const Joi = require('joi');

const coopModel = require("../models/cooperative_model");
modelCotisse = new coopModel("cotisse");

router.get('/cooperative',  (req, res) => {
  modelCotisse.get_all_cooperatives()
  .then( (response) => { res.json(response)})
  .catch(error => { res.json(error)})
})

router.get('/cooperative/:id', (req, res) => {
  coopId = req.params.id;
  modelCotisse.get_cooperative({ coop_id: coopId })
    .then(response => {  res.json(response)})
    .catch(error => { res
                        .status(404)
                        .json(message.id_not_found, error);});
});

router.post("/cooperative/add", (req, res) => {
  const { error } = cooperative_add_validation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  else{
    const cooperative = {
      coop_nom: req.body.coop_nom,
      coop_adresse: req.body.coop_adresse,
      coop_etat_parametre: req.body.coop_etat_parametre
    }
    modelCotisse.control_duplicate(cooperative)
    .then(response => {
      if(response.data){
        res.json(message.duplicate_value);
      }else{
        modelCotisse.add_cooperative(cooperative)
        .then(response => { res.json(response)})
        .catch(error => { res.json(error)});
      }})
    .catch(error => { res.json(error) });
  }
});

router.post("/cooperative/update", (req, res) => {
  const { error } = cooperative_update_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const cooperative_update = {
      coop_id: req.body.coop_id,
      coop_nom: req.body.coop_nom,
      coop_adresse: req.body.coop_adresse,
      coop_etat_parametre: req.body.coop_etat_parametre
    }

    /* modelCotisse
      .control_duplicate_update(cooperative_update)
      .then(response => {
        if (response.data) {
          res.json(message.duplicate_value);
        } else {
          modelCotisse
            .update_cooperative(cooperative, cooperative_update)
            .then(response => {
              res.json(response);
            })
            .catch(error => {
              res.json(error);
            });
        }
      }) */
      modelCotisse
        .update_cooperative(cooperative_update)
        .then(response => {
          res.json(response);
        })
        .catch(error => {
          res.json(error);
        })
      .catch(error => {
        res.json(error);
      });
  }
});

router.post("/cooperative/delete",  (req, res) => {
  const { error } = cooperative_delete_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const cooperative = {
      coop_id: req.body.coop_id
    }
  modelCotisse.delete_cooperative(cooperative)
    .then(response => { res.json(response) })
    .catch(error => { res.json(error) })
  }
});

function cooperative_add_validation(cooperative){
  const cooperative_schema = {
    coop_nom: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(cooperative, cooperative_schema);
}

function cooperative_update_validation(cooperative){
  const cooperative_schema = {
    coop_id:Joi.required(),
    coop_nom: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(cooperative, cooperative_schema);
}

function cooperative_delete_validation(cooperative) {
  const cooperative_schema = {
    coop_id: Joi.required()
  };
  return Joi.validate(cooperative, cooperative_schema);
}

module.exports = router;
