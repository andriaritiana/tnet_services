const express = require('express');
const router = express.Router();
const Joi = require('joi');
const fs = require("fs");

const provinceModel = require("../models/province_model");
const cooperativeModel = require("../models/cooperative_model");

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

router.get('/api/cooperatives', async function(req, res) {
	cooperative = new cooperativeModel("default");
	try {
		let cooperatives = await cooperative.get_all_cooperatives();
		if(cooperatives.status == 1) {
			cooperatives.data.map((coop) => {
				if(!fs.existsSync(coop.coop_urlimage)) {
					coop.coop_urlimage = "assets/images/coop-logo-default.jpeg";
				}
			});
		}
		res.json(cooperatives);
	} catch(err) {
		debug(err);
		res.status(500).json({status: 0, message: "Erreur de traitement survenue"});
	}
});

router.get('/api/cooperative/:coop', async function(req, res) {
	cooperative = new cooperativeModel("default");
	try {
		let cooprtv = await cooperative.get_cooperative({coop_id: req.params.coop}, true, false);
		if(cooprtv) {
			debug(cooprtv);
			const info_coop = cooprtv[0];
			//cooperative = new cooperativeModel(info_coop.coop_sousdomaine);
			let testexist = fs.existsSync(info_coop.coop_urlimage);
			debug(testexist);
			if(!testexist) {
				info_coop.coop_urlimage = "assets/images/coop-logo-default.jpeg";
				debug("pass here");
			}
			res.json({status: 1, data: info_coop, message: "Ok"});
		} else {
			res.status(500).json({status: 0, message: "Le coopérative n'existe plus!"});
		}
	} catch(err) {
		debug(err);
		res.status(500).json({status: 0, message: "Erreur de traitement survenue"});
	}
});

module.exports = router;