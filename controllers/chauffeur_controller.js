const express = require('express');
const router = express.Router();
const Joi = require('joi');

const ChauffeurModel = require("../models/chauffeur_model");
const model = new ChauffeurModel(cooperative_name);

router.get('/chauffeur',  (req, res) => {
  model.get_all_chauffeurs()
  .then(response => { console.log(response); res.json(response); })
  .catch(error => { console.log(error); res.json(error);})
})

router.get('/chauffeur/:id', (req, res) => {
  let coopId = req.params.id;
  model.get_chauffeur({ coop_id: coopId })
    .then(response => {  res.json(response)})
    .catch(error => { res
                        .status(404)
                        .json(message.id_not_found, error);});
});

router.post("/chauffeur/add", (req, res) => {
  const { error } = chauffeur_add_validation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  else{
    const chauffeur = {
      coop_nom: req.body.coop_nom,
      coop_adresse: req.body.coop_adresse,
      coop_etat_parametre: req.body.coop_etat_parametre
    }
    model.control_duplicate(chauffeur)
    .then(response => {
      if(response.data){
        res.json(message.duplicate_value);
      }else{
        model.add_chauffeur(chauffeur)
        .then(response => { res.json(response)})
        .catch(error => { res.json(error)});
      }})
    .catch(error => { res.json(error) });
  }
});

router.post("/chauffeur/update", (req, res) => {
  /* throw new InputValidationError("Validation error…"); */
  const { error } = chauffeur_update_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const chauffeur_update = {
      coop_id: req.body.coop_id,
      coop_nom: req.body.coop_nom,
      coop_adresse: req.body.coop_adresse,
      coop_etat_parametre: req.body.coop_etat_parametre
    }
    model
      .control_duplicate_update(chauffeur_update)
      .then(response => {
        if (response.data) {
          res.json(message.duplicate_value);
        } else {
          model
            .update_chauffeur(chauffeur_update)
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

router.post("/chauffeur/delete",  (req, res) => {
  const { error } = chauffeur_delete_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const chauffeur = {
      coop_id: req.body.coop_id
    }
  model.delete_chauffeur(chauffeur)
    .then(response => { res.json(response) })
    .catch(error => { res.json(error) })
  }
});

function chauffeur_add_validation(chauffeur){
  const chauffeur_schema = {
    coop_nom: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(chauffeur, chauffeur_schema);
}

function chauffeur_update_validation(chauffeur){
  const chauffeur_schema = {
    coop_id:Joi.required(),
    coop_nom: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(chauffeur, chauffeur_schema);
}

function chauffeur_delete_validation(chauffeur) {
  	const chauffeur_schema = {
    	coop_id: Joi.required()
  	};
    return Joi.validate(chauffeur, chauffeur_schema);
}

module.exports = router;
