const express = require('express');
const router = express.Router();
const Joi = require('joi');

const CatVehiculeModel = require("../models/cat_vehicule_model");
const model = new CatVehiculeModel(cooperative_name);

router.get('/cat_vehicule',  (req, res) => {
  model.get_all_cat_vehicules()
  .then(response => { res.json(response); })
  .catch(error => { res.json(error);})
})

router.get('/cat_vehicule/:id', (req, res) => {
  let catVehicId = req.params.id;
  model.get_cat_vehicule({ cat_vehic_id: catVehicId })
    .then(response => {  res.json(response)})
    .catch(error => { res
                        .status(404)
                        .json(message.id_not_found, error);});
});

router.post("/cat_vehicule/add", (req, res) => {
  const { error } = cat_vehicule_add_validation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  else{
    const cat_vehicule = {
      cat_vehic_libelle: req.body.cat_vehic_libelle
    }
    model.control_duplicate(cat_vehicule)
    .then(response => {
      if(response.data){
        res.json(message.duplicate_value);
      }else{
        model.add_cat_vehicule(cat_vehicule)
        .then(response => { res.json(response)})
        .catch(error => { res.json(error)});
      }})
    .catch(error => { res.json(error) });
  }
});

router.post("/cat_vehicule/update", (req, res) => {
  /* throw new InputValidationError("Validation error…"); */
  const { error } = cat_vehicule_update_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const cat_vehicule_update = {
      cat_vehic_id: req.body.cat_vehic_id,
      cat_vehic_libelle: req.body.cat_vehic_libelle
    }
    model
      .control_duplicate_update(cat_vehicule_update)
      .then(response => {
        if (response.data) {
          res.json(message.duplicate_value);
        } else {
          model
            .update_cat_vehicule(cat_vehicule_update)
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

router.post("/cat_vehicule/delete",  (req, res) => {
  const { error } = cat_vehicule_delete_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const cat_vehicule = {
      cat_vehic_id: req.body.cat_vehic_id
    }
  model.delete_cat_vehicule(cat_vehicule)
    .then(response => { res.json(response) })
    .catch(error => { res.json(error) })
  }
});

function cat_vehicule_add_validation(cat_vehicule){
  const cat_vehicule_schema = {
    cat_vehic_libelle: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(cat_vehicule, cat_vehicule_schema);
}

function cat_vehicule_update_validation(cat_vehicule){
  const cat_vehicule_schema = {
    cat_vehic_id:Joi.required(),
    cat_vehic_libelle: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(cat_vehicule, cat_vehicule_schema);
}

function cat_vehicule_delete_validation(cat_vehicule) {
  	const cat_vehicule_schema = {
    	cat_vehic_id: Joi.required()
  	};
    return Joi.validate(cat_vehicule, cat_vehicule_schema);
}

module.exports = router;
