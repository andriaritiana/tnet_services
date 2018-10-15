var express = require('express')
  , router = express.Router();

const baseModel = require("../models/alimentation_base_model");

router.get('/alimenter', async function (req, res) {
    debug("init");
	try {
        base = new baseModel("default");
		let result = await base.lancer_alimentation_auto();
  		debug(result);
	} catch (e) {
		debug(e);
		res.status(500).json({status: 0, message: "Erreur de traitement survenue"});
	}
});

module.exports = router;