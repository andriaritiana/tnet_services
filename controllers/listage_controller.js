const express = require('express');
const router = express.Router();
const Joi = require('joi');

const ListageModel = require("../models/listage_model");
model = new ListageModel(cooperative_name);

router.get('/listage',  (req, res) => {
  model.get_all_listages()
  .then( (response) => {res.send(response);})
  .catch( (error) => {res.send(error);})
})

router.get('/listage/:id', (req, res) => {
  coopId = req.params.id;
  model.get_listage({ coop_id: coopId })
    .then(response => {  res.json(response)})
    .catch(error => { res
                        .status(404)
                        .json(message.id_not_found, error);});
});

router.post("/listage/add", (req, res) => {
  const { error } = listage_add_validation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  else{
    const listage = {
      coop_nom: req.body.coop_nom,
      coop_adresse: req.body.coop_adresse,
      coop_etat_parametre: req.body.coop_etat_parametre
    }
    model.control_duplicate(listage)
    .then(response => {
      if(response.data){
        res.json(message.duplicate_value);
      }else{
        model.add_listage(listage)
        .then(response => { res.json(response)})
        .catch(error => { res.json(error)});
      }})
    .catch(error => { res.json(error) });
  }
});

router.post("/listage/update", (req, res) => {
  /* throw new InputValidationError("Validation error…"); */
  const { error } = listage_update_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const listage_update = {
      coop_id: req.body.coop_id,
      coop_nom: req.body.coop_nom,
      coop_adresse: req.body.coop_adresse,
      coop_etat_parametre: req.body.coop_etat_parametre
    }
    model
      .control_duplicate_update(listage_update)
      .then(response => {
        if (response.data) {
          res.json(message.duplicate_value);
        } else {
          model
            .update_listage(listage_update)
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

router.post("/listage/delete",  (req, res) => {
  const { error } = listage_delete_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const listage = {
      coop_id: req.body.coop_id
    }
  model.delete_listage(listage)
    .then(response => { res.json(response) })
    .catch(error => { res.json(error) })
  }
});

function listage_add_validation(listage){
  const listage_schema = {
    coop_nom: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(listage, listage_schema);
}

function listage_update_validation(listage){
  const listage_schema = {
    coop_id:Joi.required(),
    coop_nom: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(listage, listage_schema);
}

function listage_delete_validation(listage) {
  	const listage_schema = {
    	coop_id: Joi.required()
  	};
    return Joi.validate(listage, listage_schema);
}

module.exports = router;
