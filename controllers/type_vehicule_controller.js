const express = require('express');
const router = express.Router();
const Joi = require('joi');

const TypeVehiculeModel = require("../models/type_vehicule_model");
const model = new TypeVehiculeModel(cooperative_name);

router.get('/type_vehicule',  (req, res) => {
  model.get_all_type_vehicules()
  .then( (response) => { console.log(response); res.send(response);})
  .catch( (error) => {console.log(error); res.send(error);})
})

router.get('/type_vehicule/:id', (req, res) => {
  coopId = req.params.id;
  model.get_type_vehicule({ coop_id: coopId })
    .then(response => {  res.json(response)})
    .catch(error => { res
                        .status(404)
                        .json(message.id_not_found, error);});
});

router.post("/type_vehicule/add", (req, res) => {
  const { error } = type_vehicule_add_validation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  else{
    const type_vehicule = {
      coop_nom: req.body.coop_nom,
      coop_adresse: req.body.coop_adresse,
      coop_etat_parametre: req.body.coop_etat_parametre
    }
    model.control_duplicate(type_vehicule)
    .then(response => {
      if(response.data){
         res.json(message.duplicate_value);
      }else{
        model.add_type_vehicule(type_vehicule)
        .then(response => {  res.json(response)})
        .catch(error => {  res.json(error)});
      }})
    .catch(error => {  res.json(error) });
  }
});

router.post("/type_vehicule/update", (req, res) => {
  /* throw new InputValidationError("Validation error…"); */
  const { error } = type_vehicule_update_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const type_vehicule_update = {
      coop_id: req.body.coop_id,
      coop_nom: req.body.coop_nom,
      coop_adresse: req.body.coop_adresse,
      coop_etat_parametre: req.body.coop_etat_parametre
    }
    model
      .control_duplicate_update(type_vehicule_update)
      .then(response => {
        if (response.data) {
           res.json(message.duplicate_value);
        } else {
          model
            .update_type_vehicule(type_vehicule_update)
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

router.post("/type_vehicule/delete",  (req, res) => {
  const { error } = type_vehicule_delete_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const type_vehicule = {
      coop_id: req.body.coop_id
    }
  model.delete_type_vehicule(type_vehicule)
    .then(response => {  res.json(response) })
    .catch(error => {  res.json(error) })
  }
});

function type_vehicule_add_validation(type_vehicule){
  const type_vehicule_schema = {
    coop_nom: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(type_vehicule, type_vehicule_schema);
}

function type_vehicule_update_validation(type_vehicule){
  const type_vehicule_schema = {
    coop_id:Joi.required(),
    coop_nom: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(type_vehicule, type_vehicule_schema);
}

function type_vehicule_delete_validation(type_vehicule) {
  	const type_vehicule_schema = {
    	coop_id: Joi.required()
  	};
    return Joi.validate(type_vehicule, type_vehicule_schema);
}

module.exports = router;
