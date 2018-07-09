const _ = require('underscore');
const { Client } = require('pg')

/**
* @Author Andri
* Modèle mère
*/
class CoreModel {

	/**
	* Le constructeur doit toujours recevoir le nom du sous-domaine en paramètre
	*/
	constructor(subdomain) {
		const config = require('./db_config');
		const dbliste = require('./db_list');
		if(dbliste[subdomain] == undefined) {
			this.dberror = true;
		} else {
			this.dberror = false;
			config.database = dbliste[subdomain];
			this.client = new Client(config);
			this.client.connect();
		}
	}

	/**
	* Sélectionner des lignes d'une table
	* @param string table (nom de la table)
	* @param JSON data_condition (clé:valeur ex: {champ1: 12}) (champs de condition, peut être {})
	* @param JSON data_condition (clé:valeur ex: {champ1: 12}) (champs à sélectionner, peut être {} )
	* @return object (JSON)
	*/
	select(table, data_condition, data_champ) {
		var model = this;
		return new Promise(function(resolve, reject) {
			if(model.dberror) {
				reject({status: -1, message: "Aucune base de données seléctionnée"});
			} else {
				var condition = _.isEmpty(data_condition) ? "true" : _.reduce(data_condition, function(cond, val, i) { return cond + (cond == undefined ? i+" = '"+val : " and "+i+" = '"+val); })
				var champs = _.isEmpty(data_champ.length) ? "*" : _.reduce(data_champ, function(champ, val) { return champ + (champ == undefined ? "champ" : ", "+champ);});
				var querystring = " select "+champs+" from "+table+" where "+condition;
				var query = model.client.query(querystring);
				var results = [];
				model.client.query(querystring, (err, res) => {
					console.log(err, res)
					if(err == null) {
						results = res.rows;
						resolve({status:1, message: "Données récupérées", data: results});
					} else {
						reject({status:0, message: "Erreur de récupération des données", error: err});
					}
					model.client.end();
				});
			}
		});
	}

	/**
	* Insérer une ou plusieures lignes dans une table
	* @param string table (nom de la table)
	* @param JSON data (clé:valeur ex: {champ1: 12}) (données à insérer, ne peut pas être {})
	* @param boolean multiple (si l'insértion est de type multiple ou une seule ligne)
	* @return object (JSON)
	*/
	insert(table, data, multiple) {
		var model = this;
		return new Promise(function(resolve, reject) {
			if(model.dberror) {
				reject({status: -1, message: "Aucune base de données seléctionnée"});
			} else {
				if(data.length == 0) {
					reject({status:0, message: "Aucune ligne à insérer"});
				} else {
					if(multiple) {
						var has_error = false;
						var ids = [], errors = [];
						var data_row = "";
						var values = "";
						_.each(data, function(data1) {
							if(data_row == "") {
								data_row = _.reduce(data1, function(champ, val, i) {
									return champ + (champ == undefined ? i: ", "+i);
								});
							}
							if(values == "") {
								values = _.reduce(data1, function(valeur, val, i) {
									return valeur + (valeur == undefined ? val : ", "+val);
								});
							} else {
								values += "), ("._.reduce(data1, function(valeur, val, i) {
									return valeur + (valeur == undefined ? val : ", "+val);
								});
							}
						});
						var querystring = "insert into "+table+" ("+data_row+") values("+values+")";
						model.client.query(querystring, (err, res) => {
							//console.log(err, res)
							if(err == null) {
								var id = res.rows[0].id;
								resolve({status:1, message: "Données insérées", id: id});
							} else {
								reject({status:0, message: "Echec de l'insertion des données", error: err});
							}
							model.client.end();
						});
					} else {
						var data_row = _.reduce(data, function(champ, val, i) {
							return champ + (champ == undefined ? i: ", "+i);
						});
						var data_val = _.reduce(data, function(valeur, val, i) {
							return valeur + (valeur == undefined ? val : ", "+val);
						});
						var querystring = "insert into "+table+" ("+data_row+") values("+data_val+")";
						model.client.query(querystring, (err, res) => {
							//console.log(err, res)
							if(err == null) {
								var id = res.rows[0].id;
								resolve({status:1, message: "Données insérées", id: id});
							} else {
								reject({status:0, message: "Echec de l'insertion des données", error: err});
							}
							model.client.end();
						});
					}
				}
			}
		});
	}

	/**
	* Mettre à jour des lignes d'une table
	* @param string table (nom de la table)
	* @param JSON data_condition (clé:valeur ex: {champ1: 12}) (champs de conditions, ne peut pas être {})
	* @param JSON data_update (clé:valeur ex: {champ1: 12}) (champs à modifier, ne peut pas être {})
	* @return object (JSON)
	*/
	update(table, data_condition, data_update) {
		var model = this;
		return new Promise(function(resolve, reject) {
			if(model.dberror) {
				return {status: -1, message: "Aucune base de données seléctionnéé"};
			} else {
				if(data_condition.length == 0 || data_update.length == 0) {
					return {status: 0, message: "Cette action n'est pas permise"};
				} else {
					var condition = _.reduce(data_condition, function(cond, val, i) {
						return cond + (cond == undefined ? i+" = '"+val : " and "+i+" = '"+val);
					});
					var dataset = _.reduce(data_update, function(memo, val, i) {
						return memo + (memo == undefined ? i+" = '"+val : ", "+i+" = '"+val);
					});
					var querystring = "update "+table+" set "+dataset+" where "+condition;
					var query = model.client.query(querystring);
					model.client.query(querystring, (err, res) => {
						//console.log(err, res)
						if(err == null) {
							var id = res.rows[0].id;
							resolve({status:1, message: "Mise à jour réussie"});
						} else {
							reject({status:0, message: "Echec de la mise à jour", error: err});
						}
						model.client.end();
					});
				}
			}
		});
	}

	/**
	* Supprimer des lignes d'une table
	* @param string table (nom de la table)
	* @param JSON data_condition (clé:valeur ex: {champ1: 12}) (champs de condition, ne peut pas être {})
	* @return object (JSON)
	*/
	delete(table, data_condition) {
		var model = this;
		return new Promise(function(resolve, reject) {
			if(model.dberror) {
				return {status: -1, message: "Aucune base de données seléctionnéé"};
			} else {
				if(data_condition.length == 0) {
					return {status: 0, message: "Cette action n'est pas permise"};
				} else {
					var condition = _.reduce(data_condition, function(cond, val, i) {
						return cond + (cond == undefined ? i+" = '"+val : " and "+i+" = '"+val);
					});
					var querystring = "delete from "+table+" where "+condition;
					var query = this.client.query(querystring);
					model.client.query(querystring, (err, res) => {
						//console.log(err, res)
						if(err == null) {
							var id = res.rows[0].id;
							reject({status:1, message: "Mise à jour réussie"});
						} else {
							resolve({status:0, message: "Echec de la mise à jour", error: err});
						}
						model.client.end();
					});
				}
			}
		});
	}
}
module.exports = CoreModel;
