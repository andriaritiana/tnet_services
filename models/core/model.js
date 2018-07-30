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
		const config = require('../../config/db_config');
		const dbliste = require('../../config/db_list');
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
	* @param array data_champ (valeur,... ex: ["champ1","champ2"]) (champs à sélectionner, peut être [] )
	* @return object (JSON)
	*/
	select(table, data_condition, data_champ) {
		var model = this;
		return new Promise(function(resolve, reject) {
			if(model.dberror) {
				reject({status: -1, message: "Aucune base de données seléctionnée"});
			} else {
				var condition = model.get_valmerged(data_condition, "condition");
				var champs = model.get_valmerged(data_champ, "champ");
				var querystring = " select "+champs+" from "+table+" where "+condition;
				console.log(querystring);
				var query = model.client.query(querystring);
				var results = [];
				model.client.query(querystring, (err, res) => {
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
	* sélectionner des lignes d'une table joignant une ou plusieurs autre(s) table(s)
	* @param string table
	* @param array join (ex: [["table1", "table1.champ = table2.champ", "inner"]] ou [["table1", "table1.champ = table2.champ"]] ou ["table1 on table1.champ = table2.champ"])
	* @param JSON data_condition (clé:valeur ex: {champ1: 12}) (champs de condition, peut être {})
	* @param array data_champ (valeur, ... ex: ["champ1", "champ2"]) (champs à sélectionner, peut être [] )
	* @return object (JSON)
	*/
	select_join(table, join, data_condition, data_champ) {
		var model = this;
		return new Promise(function(resolve, reject) {
			if(model.dberror) {
				reject({status: -1, message: "Aucune base de données seléctionnée"});
			} else {
				var condition = model.get_valmerged(data_condition, "condition");
				var champs = model.get_valmerged(data_champ, "champ");
				var querystring = " select "+champs+" from "+table+" where "+condition;
				if(!_.isEmpty(join)) {
					var jointure = "";
					_.each(join, function(data) {
						if(_.isArray(data)) {
							if(data.length == 2) {
								jointure += "join "+data[0]+" on "+data[1]+" ";
							} else if(data.length == 3) {
								jointure += data[2]+"join "+data[0]+" on "+data[1]+" ";
							} else {
								jointure += "join "+data[0]+" ";
							}
						} else {
							jointure += "join "+data+" ";
						}
					});
					querystring = " select "+champs+" from "+table+" "+jointure+" where "+condition;
				}
				var query = model.client.query(querystring);
				var results = [];
				model.client.query(querystring, (err, res) => {
					//console.log(err, res)
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
				if(_.keys(data).length == 0) {
					reject({status:0, message: "Aucune ligne à insérer"});
				} else {
					if(multiple) {
						var has_error = false;
						var ids = [], errors = [];
						var data_row = "";
						var values = "";
						_.each(data, function(data1) {
							if(data_row == "") {
								data_row = model.get_valmerged(data1, "champ");
							}
							if(values == "") {
								values = model.get_valmerged(data1, "valeur");
							} else {
								values += "), ("+ model.get_valmerged(data1, "valeur");
							}
						});
						var querystring = "insert into "+table+" ("+data_row+") values("+values+") returning *";
						model.client.query(querystring, (err, res) => {
							//console.log(err, res)
							if(err == null) {
								var key0 = _.keys(res.rows[0])[0];
								var id = res.rows[0][key0];
								resolve({status:1, message: "Données insérées", id: id});
							} else {
								reject({status:0, message: "Echec de l'insertion des données", error: err});
							}
							model.client.end();
						});
					} else {
						var data_row = model.get_valmerged(data, "champ");
						var data_val = model.get_valmerged(data, "valeur");
						var querystring = "insert into "+table+"("+data_row+") values("+data_val+") returning *";

						model.client.query(querystring, (err, res) => {
							//console.log( res)
							if(err == null) {
								var key0 = _.keys(res.rows[0])[0];
								var id = res.rows[0][key0];
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
				if(_.keys(data_condition).length == 0 || _.keys(data_update).length == 0) {
					return {status: 0, message: "Cette action n'est pas permise"};
				} else {
					var condition = model.get_valmerged(data_condition, "condition");
					var dataset = model.get_valmerged(data_update, "set");
					var querystring = "update "+table+" set "+dataset+" where "+condition;
					//console.log(querystring);
					var query = model.client.query(querystring);
					model.client.query(querystring, (err, res) => {
						//console.log(err, res)
						if(err == null) {
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
	* @param string table (nom de la table)s
	* @param JSON data_condition (clé:valeur ex: {champ1: 12}) (champs de condition, ne peut pas être {})
	* @return object (JSON)
	*/
	delete(table, data_condition) {
		var model = this;
		return new Promise(function(resolve, reject) {
			if(model.dberror) {
				return {status: -1, message: "Aucune base de données seléctionnéé"};
			} else {
				if(_.keys(data_condition).length == 0) {
					return {status: 0, message: "Cette action n'est pas permise"};
				} else {
					var condition = model.get_valmerged(data_condition, "condition");
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

	/**
	* Réduit un array ou un objet à un string séparé par des virgules ou and selon le type
	*/
	get_valmerged(data, type) {
		if(type == "champ") {
			 if(_.isArray(data)) {
				if(data.length >= 1) {
					return _.reduce(data, function(champ, val, i) {
						return champ + ", "+val;
					});
				} else {
					return "*";
				}
			} else {
				if(_.keys(data).length > 1) {
					return _.reduce(data, function(champ, val, i) {
						if(champ.includes(', ')) {
							return champ + ", "+i;
						} else {
							return _.keys(data)[0]+", "+i;
						}
					});
				} else if(_.keys(data).length == 1) {
					return _.keys(data)[0];
				} else { //vide
					return "*";
				}
			}
		} else if(type == "valeur") {
			if(_.keys(data).length > 1) {
				return _.reduce(data, function(valeur, val, i) {
					if((valeur+"").includes("', ")) {
						return valeur + ", '"+val+"'";
					} else {
						return "'"+valeur+"', '"+val+"'";
					}
				});
			} else {
				return "'"+data[_.keys(data)[0]]+"'";
			}
		} else if(type == "condition") {
			if(_.keys(data).length > 1) {
				return _.reduce(data, function(cond, val, i) {
					if((cond+"").includes("' and")) {
						return cond + " and "+i+" = '"+val+"'";
					} else {
						return _.keys(data)[0]+" = '"+cond+"' and "+i+" = '"+val+"'";
					}
				});
			} else if(_.keys(data).length == 1) {
				return _.keys(data)[0]+" = '"+data[_.keys(data)[0]]+"'";
			} else { //vide
				return "true";
			}
		} else { //type == "set"
			if(_.keys(data).length > 1) {
				return _.reduce(data, function(cond, val, i) {
					if((cond+"").includes("', ")) {
						return cond + ", "+i+" = '"+val+"'";
					} else {
						return _.keys(data)[0]+" = '"+cond+"', "+i+" = '"+val+"'";
					}
				});
			} else if(_.keys(data).length == 1) {
				return _.keys(data)[0]+" = '"+data[_.keys(data)[0]]+"'";
			}
		}
	}
}
module.exports = CoreModel;
