const express = require('express');
const router = express.Router();
const Joi = require('joi');

const VoyageModel = require("../models/voyage_model");
const model = new VoyageModel(cooperative_name);

router.get('/voyage',  (req, res) => {
  model.get_all_voyages()
  .then( (response) => { console.log(response); res.json(response);})
  .catch( (error) => { console.log(error); res.json(error);})
})

router.get('/voyage/:id', (req, res) => {
  coopId = req.params.id;
  model.get_voyage({ coop_id: coopId })
    .then(response => {  res.json(response)})
    .catch(error => { res
                        .status(404)
                        .json(message.id_not_found, error);});
});

router.post("/voyage/add", (req, res) => {
  const { error } = voyage_add_validation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  else{
    const voyage = {
      coop_nom: req.body.coop_nom,
      coop_adresse: req.body.coop_adresse,
      coop_etat_parametre: req.body.coop_etat_parametre
    }
    model.control_duplicate(voyage)
    .then(response => {
      if(response.data){
        res.json(message.duplicate_value);
      }else{
        model.add_voyage(voyage)
        .then(response => { res.json(response)})
        .catch(error => { res.json(error)});
      }})
    .catch(error => { res.json(error) });
  }
});

router.post("/voyage/update", (req, res) => {
  /* throw new InputValidationError("Validation error…"); */
  const { error } = voyage_update_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const voyage_update = {
      coop_id: req.body.coop_id,
      coop_nom: req.body.coop_nom,
      coop_adresse: req.body.coop_adresse,
      coop_etat_parametre: req.body.coop_etat_parametre
    }
    model
      .control_duplicate_update(voyage_update)
      .then(response => {
        if (response.data) {
          res.json(message.duplicate_value);
        } else {
          model
            .update_voyage(voyage_update)
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

router.post("/voyage/delete",  (req, res) => {
  const { error } = voyage_delete_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const voyage = {
      coop_id: req.body.coop_id
    }
  model.delete_voyage(voyage)
    .then(response => { res.json(response) })
    .catch(error => { res.json(error) })
  }
});

function voyage_add_validation(voyage){
  const voyage_schema = {
    coop_nom: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(voyage, voyage_schema);
}

function voyage_update_validation(voyage){
  const voyage_schema = {
    coop_id:Joi.required(),
    coop_nom: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(voyage, voyage_schema);
}

function voyage_delete_validation(voyage) {
  	const voyage_schema = {
    	coop_id: Joi.required()
  	};
    return Joi.validate(voyage, voyage_schema);
}

module.exports = router;
