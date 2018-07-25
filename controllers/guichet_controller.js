var express = require('express')
  , router = express.Router();

const guichetModel = require("../models/guichet_model");

router.get('/guichet', async function (req, res) {
	guichet = new guichetModel("cotisse");
  	guichets = await guichet.get_all_guichets();
  	//console.log(guichets);
  	res.json(guichets);
});

router.post('/guichet/:action', async function (req, res) {
	guichet = new guichetModel("cotisse");
	var result = null;
  	if(req.params.action == "add" || req.params.action == "ajouter") {
  		var nom = req.body.nom;
		var adresse = req.body.adresse;
		var ville = req.body.ville;
		if(nom == undefined || adresse == undefined || ville == undefined) {
			result = {status: 0, message: "Vérifiez les paramètres envoyés"};
		} else {
			result = await guichet.add_guichet({ville_id: ville, guichet_nom: nom, guichet_adresse: adresse});
		}
  	}
  	res.json(result);
});

module.exports = router;