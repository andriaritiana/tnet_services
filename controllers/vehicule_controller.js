const express = require('express');
const router = express.Router();
const Joi = require('joi');

const VehiculeModel = require("../models/vehicule_model");
const model = new VehiculeModel(cooperative_name);

router.get('/vehicule',  (req, res) => {
  model.get_all_vehicules()
  .then( (response) => {res.send(response);})
  .catch( (error) => {res.send(error);})
})

router.get('/vehicule/:id', (req, res) => {
  coopId = req.params.id;
  model.get_vehicule({ coop_id: coopId })
    .then(response => {  res.json(response)})
    .catch(error => { res
                        .status(404)
                        .json(message.id_not_found, error);});
});

router.post("/vehicule/add", (req, res) => {
  const { error } = vehicule_add_validation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  else{
    const vehicule = {
      coop_nom: req.body.coop_nom,
      coop_adresse: req.body.coop_adresse,
      coop_etat_parametre: req.body.coop_etat_parametre
    }
    model.control_duplicate(vehicule)
    .then(response => {
      if(response.data){
        res.json(message.duplicate_value);
      }else{
        model.add_vehicule(vehicule)
        .then(response => { res.json(response)})
        .catch(error => { res.json(error)});
      }})
    .catch(error => { res.json(error) });
  }
});

router.post("/vehicule/update", (req, res) => {
  /* throw new InputValidationError("Validation error…"); */
  const { error } = vehicule_update_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const vehicule_update = {
      coop_id: req.body.coop_id,
      coop_nom: req.body.coop_nom,
      coop_adresse: req.body.coop_adresse,
      coop_etat_parametre: req.body.coop_etat_parametre
    }
    model
      .control_duplicate_update(vehicule_update)
      .then(response => {
        if (response.data) {
          res.json(message.duplicate_value);
        } else {
          model
            .update_vehicule(vehicule_update)
            .then(response => {
              res.json(response);
            })
            .catch(error => {
              res.json(error);
            });
        }
      })
  }
});

router.post("/vehicule/delete",  (req, res) => {
  const { error } = vehicule_delete_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const vehicule = {
      coop_id: req.body.coop_id
    }
  model.delete_vehicule(vehicule)
    .then(response => { res.json(response) })
    .catch(error => { res.json(error) })
  }
});

function vehicule_add_validation(vehicule){
  const vehicule_schema = {
    coop_nom: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(vehicule, vehicule_schema);
}

function vehicule_update_validation(vehicule){
  const vehicule_schema = {
    coop_id:Joi.required(),
    coop_nom: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(vehicule, vehicule_schema);
}

function vehicule_delete_validation(vehicule) {
  	const vehicule_schema = {
    	coop_id: Joi.required()
  	};
    return Joi.validate(vehicule, vehicule_schema);
}

module.exports = router;
