const express = require('express');
const router = express.Router();
const Joi = require('joi');

const ClasseVehiculeModel = require("../models/classe_vehicule_model");
const model = new ClasseVehiculeModel(cooperative_name);

router.get('/classe_vehicule',  (req, res) => {
  model.get_all_classe_vehicules()
  .then(response => {res.send(response); })
  .catch(error => {res.send(error);})
})

router.get('/classe_vehicule/:id', (req, res) => {
  let catVehicId = req.params.id;
  model.get_classe_vehicule({ cat_vehic_id: catVehicId })
    .then(response => {  res.json(response)})
    .catch(error => { res
                        .status(404)
                        .json(message.id_not_found, error);});
});

router.post("/classe_vehicule/add", (req, res) => {
  const { error } = classe_vehicule_add_validation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  else{
    const classe_vehicule = {
      cat_vehic_libelle: req.body.cat_vehic_libelle
    }
    model.control_duplicate(classe_vehicule)
    .then(response => {
      if(response.data){
        res.json(message.duplicate_value);
      }else{
        model.add_classe_vehicule(classe_vehicule)
        .then(response => { res.json(response)})
        .catch(error => { res.json(error)});
      }})
    .catch(error => { res.json(error) });
  }
});

router.post("/classe_vehicule/update", (req, res) => {
  /* throw new InputValidationError("Validation error…"); */
  const { error } = classe_vehicule_update_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const classe_vehicule_update = {
      cat_vehic_id: req.body.cat_vehic_id,
      cat_vehic_libelle: req.body.cat_vehic_libelle
    }
    model
      .control_duplicate_update(classe_vehicule_update)
      .then(response => {
        if (response.data) {
          res.json(message.duplicate_value);
        } else {
          model
            .update_classe_vehicule(classe_vehicule_update)
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

router.post("/classe_vehicule/delete",  (req, res) => {
  const { error } = classe_vehicule_delete_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const classe_vehicule = {
      cat_vehic_id: req.body.cat_vehic_id
    }
  model.delete_classe_vehicule(classe_vehicule)
    .then(response => { res.json(response) })
    .catch(error => { res.json(error) })
  }
});

function classe_vehicule_add_validation(classe_vehicule){
  const classe_vehicule_schema = {
    cat_vehic_libelle: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(classe_vehicule, classe_vehicule_schema);
}

function classe_vehicule_update_validation(classe_vehicule){
  const classe_vehicule_schema = {
    cat_vehic_id:Joi.required(),
    cat_vehic_libelle: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(classe_vehicule, classe_vehicule_schema);
}

function classe_vehicule_delete_validation(classe_vehicule) {
  	const classe_vehicule_schema = {
    	cat_vehic_id: Joi.required()
  	};
    return Joi.validate(classe_vehicule, classe_vehicule_schema);
}

module.exports = router;
