const express = require('express');
const router = express.Router();
const Joi = require('joi');

const provinceModel = require("../models/province_model");

router.get('/api/provinces/infos', async function (req, res) {
	province = new provinceModel("default");
	try {
		provinces = await province.get_provinces_with_info();
  		res.json(provinces);
	} catch (e) {
		debug(e);
		res.status(500).json({status: 0, message: "Erreur de traitement survenue"});
	}
});

module.exports = router;