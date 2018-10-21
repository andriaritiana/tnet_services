const express = require('express');
const router = express.Router();
const Joi = require('joi');

const VilleModel = require("../models/ville_model");
const model = new VilleModel(cooperative_name);

router.get('/ville',  (req, res) => {
  model.get_all_villes()
  .then(response => { return res.json(response); })
  .catch(error => { return res.json(error);})
})

router.get('/ville/:id', (req, res) => {
  let villeId = req.params.id;
  model.get_ville({ ville_id: villeId })
    .then(response => {  return res.json(response)})
    .catch(error => { return res
                        .status(404)
                        .json(message.id_not_found, error);});
});

router.post("/ville/add", (req, res) => {
  const { error } = ville_add_validation(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  else{
    const ville = {
      ville_nom: req.body.ville_nom
    }
    model.control_duplicate(ville)
    .then(response => {
      if(response.data){
        return res.json(message.duplicate_value);
      }else{
        model.add_ville(ville)
        .then(response => { return res.json(response)})
        .catch(error => { return res.json(error)});
      }})
    .catch(error => { return res.json(error) });
  }
});

router.post("/ville/update", (req, res) => {
  /* throw new InputValidationError("Validation error…"); */
  const { error } = ville_update_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const ville_update = {
      ville_id: req.body.ville_id,
      ville_nom: req.body.ville_nom
    }
    model
      .control_duplicate_update(ville_update)
      .then(response => {
        if (response.data) {
          return res.json(message.duplicate_value);
        } else {
          model
            .update_ville(ville_update)
            .then(response => {
              return res.json(response);
            })
            .catch(error => {
              res.json(error);
            });
        }
      })
  }
});

router.post("/ville/delete",  (req, res) => {
  const { error } = ville_delete_validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  else {
    const ville = {
      ville_id: req.body.ville_id
    }
  model.delete_ville(ville)
    .then(response => { return res.json(response) })
    .catch(error => { return res.json(error) })
  }
});

function ville_add_validation(ville){
  const ville_schema = {
    ville_nom: Joi.string().min(3).required()
  };
  return Joi.validate(ville, ville_schema);
}

function ville_update_validation(ville){
  const ville_schema = {
    ville_id:Joi.required(),
    ville_nom: Joi.string().min(3).required()
  };
  return Joi.validate(ville, ville_schema);
}

function ville_delete_validation(ville) {
  	const ville_schema = {
    	ville_id: Joi.required()
  	};
    return Joi.validate(ville, ville_schema);
}

module.exports = router;
