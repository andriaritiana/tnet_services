const express = require('express');
const router = express.Router();
const Joi = require('joi');

const ChaufVehicModel = require("../models/chaufvehic_model");
const model = new ChaufVehicModel();

router.get('/chaufvehic',  (req, res) => {
  model.get_all_chaufvehics()
  .then(response => { console.log(response); res.json(response); })
  .catch(error => { console.log(error); res.json(error);})
})

router.get('/chaufvehic/:id', (req, res) => {
  let coopId = req.params.id;
  model.get_chaufvehic({ coop_id: coopId })
    .then(response => {  res.json(response)})
    .catch(error => { res
                        .status(404)
                        .json(message.id_not_found, error);});
});

router.post("/chaufvehic/add", (req, res) => {
  const { error } = chaufvehic_add_validation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  else{
    const chaufvehic = {
      coop_nom: req.body.coop_nom,
      coop_adresse: req.body.coop_adresse,
      coop_etat_parametre: req.body.coop_etat_parametre
    }
    model.control_duplicate(chaufvehic)
    .then(response => {
      if(response.data){
        res.json(message.duplicate_value);
      }else{
        model.add_chaufvehic(chaufvehic)
        .then(response => { res.json(response)})
        .catch(error => { res.json(error)});
      }})
    .catch(error => { res.json(error) });
  }
});

router.post("/chaufvehic/update", (req, res) => {
  /* throw new InputValidationError("Validation error…"); */
  const { error } = chaufvehic_update_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const chaufvehic_update = {
      coop_id: req.body.coop_id,
      coop_nom: req.body.coop_nom,
      coop_adresse: req.body.coop_adresse,
      coop_etat_parametre: req.body.coop_etat_parametre
    }
    model
      .control_duplicate_update(chaufvehic_update)
      .then(response => {
        if (response.data) {
          res.json(message.duplicate_value);
        } else {
          model
            .update_chaufvehic(chaufvehic_update)
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

router.post("/chaufvehic/delete",  (req, res) => {
  const { error } = chaufvehic_delete_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const chaufvehic = {
      coop_id: req.body.coop_id
    }
  model.delete_chaufvehic(chaufvehic)
    .then(response => { res.json(response) })
    .catch(error => { res.json(error) })
  }
});

function chaufvehic_add_validation(chaufvehic){
  const chaufvehic_schema = {
    coop_nom: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(chaufvehic, chaufvehic_schema);
}

function chaufvehic_update_validation(chaufvehic){
  const chaufvehic_schema = {
    coop_id:Joi.required(),
    coop_nom: Joi.string().min(3).required(),
    coop_adresse: Joi.string(),
    coop_etat_parametre: Joi.number()
  };
  return Joi.validate(chaufvehic, chaufvehic_schema);
}

function chaufvehic_delete_validation(chaufvehic) {
  	const chaufvehic_schema = {
    	coop_id: Joi.required()
  	};
    return Joi.validate(chaufvehic, chaufvehic_schema);
}

module.exports = router;
