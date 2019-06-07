const { Client } = require('pg')
const { connection, list, list_test } = require('config').db
const config = { ...connection }
if (typeof String.prototype.contains === 'undefined') { 
	String.prototype.contains = function(it) { return this.indexOf(it) != -1; }; 
}
/**
* @Author Andri
* Modèle mère
*/
class CoreModel {

	/**
	* Le constructeur doit toujours recevoir le nom du sous-domaine en paramètre
	*/
	constructor(subdomain) {
		this.dbliste = process.env.NODE_ENV == "test" ? { ...list_test } : { ...list }
		this.loadDatabase(subdomain);
	}

	loadDatabase(subdomain) {
		if(this.dbliste[subdomain] == undefined) {
			this.dberror = true;
		} else {
			this.currentsubdomain = subdomain;
			this.dberror = false;
			config.database = this.dbliste[subdomain];
			this.client = new Client(config);
			this.client.connect();
		}
	}


	/**
	* Sélectionner des lignes d'une table
	* @param string table (nom de la table)
	* @param JSON data_condition (clé:valeur ex: {champ1: 12}) (champs de condition, peut être {})
	* @param array data_champ (valeur,... ex: ["champ1","champ2"]) (champs à sélectionner, peut être [] )
	* @param bool nostatus (retourne avec un statut ou data uniquement)
	* @param int limit (nombre limite de données à récupérer)
	* @param int offset (Récupérer à partir de la ligne numéro) 
	* @param bool end (Fermer le client ou laisser ouvert) 
	* @return object (JSON)
	*/
	select(table, data_condition, data_champ, nostatus, limit, offset, end, orderby) {
		var end = typeof end == "undefined" ? true : end;
		var nostatus = (typeof nostatus !== 'undefined') ? nostatus : false;
		var limit = (typeof limit !== 'undefined') ? limit : 0;
		var offset = (typeof offset !== 'undefined') ? offset : 0;
		var orderby = (typeof orderby !== 'undefined') ? orderby : false;
		var model = this;
		return new Promise(function(resolve, reject) {
			if(model.dberror) {
				if(nostatus) debug("Aucune base de données seléctionnée");
				reject(nostatus ? false : new error.DatabaseError("Aucune base de données seléctionnée"));
			} else {
				var condition = model.get_valmerged(data_condition, "condition");
				var champs = model.get_valmerged(data_champ, "champ");
				var querystring = " select "+champs+" from "+table+" where "+condition;
				if(limit > 0) {
					querystring += " limit "+limit;
				}
				if(offset > 0) {
					querystring += " offset "+offset;
				}
				if(orderby) {
					querystring += " order by "+orderby;
				}
				debug(querystring);
				model.client.query(querystring, (err, res) => {
					if(err == null) {
						//debug(res);
						let results = res.rows;
						resolve(nostatus ? results : {status:1, message: "Données récupérées", data: results});
					} else {
						debug(err);
						reject(nostatus ? false : new error.DatabaseError("Erreur de récupération des données"));
					}
					if(end) model.client.end();
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
	* @param bool nostatus (retourne avec un statut ou data uniquement)
	* @param int limit (nombre limite de données à récupérer)
	* @param int offset (Récupérer à partir de la ligne numéro) 
	* @param bool end (Fermer le client ou laisser ouvert) 
	* @return object (JSON)
	*/
	select_join(table, join, data_condition, data_champ, nostatus, limit, offset, end) {
		var end = typeof end == "undefined" ? true : end;
		var nostatus = (typeof nostatus !== 'undefined') ? nostatus : false;
		var limit = (typeof limit !== 'undefined') ? limit : 0;
		var offset = (typeof offset !== 'undefined') ? offset : 0;
		var model = this;
		return new Promise(function(resolve, reject) {
			if(model.dberror) {
				if(nostatus) debug("Aucune base de données seléctionnée");
				reject(nostatus ? false : new error.DatabaseError("Aucune base de données seléctionnée"));
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
				if(limit > 0) {
					querystring += " limit "+limit;
				}
				if(offset > 0) {
					querystring += " offset "+offset;
				}
				model.client.query(querystring, (err, res) => {
					//console.log(err, res)
					if(err == null) {
						let results = res.rows;
						resolve(nostatus ? results : {status:1, message: "Données récupérées", data: results});
					} else {
						debug(err);
						reject(nostatus ? false : new error.DatabaseError("Erreur de récupération des données"));
					}
					if(end) model.client.end();
				});
			}
		});
	}

	/**
	* Insérer une ou plusieures lignes dans une table
	* @param string table (nom de la table)
	* @param JSON data (clé:valeur ex: {champ1: 12}) (données à insérer, ne peut pas être {})
	* @param boolean multiple (si l'insértion est de type multiple ou une seule ligne)
	* @param bool nostatus (retourne avec un statut ou data uniquement)
	* @param bool end (Fermer le client ou laisser ouvert) 
	* @return object (JSON)
	*/
	insert(table, data, multiple, nostatus, end) {
		var end = typeof end == "undefined" ? true : end;
		var nostatus = (typeof nostatus !== 'undefined') ? nostatus : false;
		var multiple = (typeof multiple !== 'undefined') ? multiple : false;
		var model = this;
		return new Promise(function(resolve, reject) {
			if(model.dberror) {
				if(nostatus) debug("Aucune base de données seléctionnée");
				reject(new error.DatabaseError("Aucune base de données seléctionnée"));
			} else {
				if(_.keys(data).length == 0) {
					if(nostatus) debug("Aucune ligne à insérer");
					reject(nostatus ? false : {status:0, message: "Aucune ligne à insérer"});
				} else {
					if(multiple) {
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
								debug(err);
								reject(new error.DatabaseError("Echec de l'insertion des données"+err));
							}
							if(end) model.client.end();
						});
					} else {
						var data_row = model.get_valmerged(data, "champ");
						var data_val = model.get_valmerged(data, "valeur");
						var querystring = "insert into "+table+"("+data_row+") values("+data_val+") returning *";

						debug(querystring);
						model.client.query(querystring, (err, res) => {
							//console.log( res)
							if(err == null) {
								var key0 = _.keys(res.rows[0])[0];
								var id = res.rows[0][key0];
								resolve(nostatus ? id : {status:1, message: "Données insérées", id: id});
							} else {
								debug(err);
								reject(nostatus ? false : new error.DatabaseError("Echec de l'insertion des données"+ err));
							}
							if(end) model.client.end();
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
	* @param JSON data_update (clé:valeur ex: {cham1p1: 12}) (champs à modifier, ne peut pas être {})
	* @param bool end (Fermer le client ou laisser ouvert) 
	* @return object (JSON)
	*/
	update(table, data_condition, data_update, end = true) {
		var model = this;
		return new Promise(function(resolve, reject) {
			if(model.dberror) {
				if(nostatus) debug("Aucune base de données seléctionnée");
				reject(new error.DatabaseError("Aucune base de données seléctionnée"));
			} else {
				if(_.keys(data_condition).length == 0 || _.keys(data_update).length == 0) {
					reject(new error.DatabaseError("Cette action n'est pas permise"));
				} else {
					var condition = model.get_valmerged(data_condition, "condition");
					var dataset = model.get_valmerged(data_update, "set");
					var querystring = "update "+table+" set "+dataset+" where "+condition;
					//console.log(querystring);
					model.client.query(querystring, (err, res) => {
						//console.log(err, res)
						if(err == null) {
							resolve({status:1, message: "Mise à jour réussie"});
						} else {
							debug(err);
							reject(new error.DatabaseError("Echec de la mise à jour"+err));
						}
						if(end) model.client.end();
					});
				}
			}
		});
	}

	/**
	* Supprimer des lignes d'une table
	* @param string table (nom de la table)s
	* @param JSON data_condition (clé:valeur ex: {champ1: 12}) (champs de condition, ne peut pas être {})
	* @param bool end (Fermer le client ou laisser ouvert) 
	* @return object (JSON)
	*/
	delete(table, data_condition, end) {
		var end = typeof end == "undefined" ? true : end;
		var model = this;
		return new Promise(function(resolve, reject) {
			if(model.dberror) {
				if(nostatus) debug("Aucune base de données seléctionnée");
				reject(new error.DatabaseError("Aucune base de données seléctionnée"));
			} else {
				if(_.keys(data_condition).length == 0) {
					retject(new error.DatabaseError("Cette action n'est pas permise"));
				} else {
					var condition = model.get_valmerged(data_condition, "condition");
					var querystring = "delete from "+table+" where "+condition;
					model.client.query(querystring, (err, res) => {
						//console.log(err, res)
						if(err == null) {
							resolve({status:1, message: "Suppression réussie"});
						} else {
							debug(err);
							reject(new error.DatabaseError("Echec de la suppression : "+err));
						}
						if(end) model.client.end();
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
			} else if(_.isObject(data)) {
				if(_.keys(data).length > 1) {
					return _.reduce(data, function(champ, val, i) {
						if((champ+"").contains(', ')) {
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
			} else {//string
				return data;
			}
		} else if(type == "valeur") {
			if(_.keys(data).length > 1) {
				return _.reduce(data, function(valeur, val, i) {
					if((valeur+"").contains("', ") || (valeur+"").contains("null, ")) {
						return valeur + ", "+(val != null ? "'"+(val+"").replace("'","''")+"'" : "null");
					} else {
						return (valeur == null ? "null" : "'"+(""+valeur).replace("'","''")+"'" )+", '"+(val+"").replace("'","''")+"'";
					}
				});
			} else {
				return data[_.keys(data)[0]] == null ? "null" : "'"+data[_.keys(data)[0]].replace("'","''")+"'";
			}
		} else if(type == "condition") {
			if(_.isObject(data)) {
				if(_.keys(data).length > 1) {
					return _.reduce(data, function(cond, val, i) {
						if((cond+"").contains("' and")) {
							return cond + " and "+i+(val == null  || val.toLowerCase() == "null" ? " is null" 
									: val.toLowerCase() == "is not null" ? " "+val 
									: val.split(' ')[1] == undefined ? " = '"+val.replace("'","''")+"'"
									: " "+val.split(' ')[0]+" '"+val.split(' ')[1].replace("'","''")+"'");
						} else {
							return _.keys(data)[0]+(cond == null || (""+cond).toLowerCase() == "null" ? " is null" 
									: (""+cond).toLowerCase() == "is not null" ? " "+cond
									: (""+cond).split(' ')[1] == undefined ? " = '"+(""+cond).replace("'","''")+"'" 
									: " "+(""+cond).split(' ')[0]+" '"+(""+cond).split(' ')[1].replace("'","''")+"'")+" and "+i+
									(val == null  || (""+val).toLowerCase() == "null" ? " is null" 
									: (""+val).toLowerCase() == "is not null" ? " "+val
									: (""+val).split(' ')[1] == undefined ? " = '"+(""+val).replace("'","''")+"'" 
									: " "+(""+val).split(' ')[0]+" '"+(""+val).split(' ')[1].replace("'","''")+"'");
						}
					});
				} else if(_.keys(data).length == 1) {
					return _.keys(data)[0]+(data[_.keys(data)[0]] == null  || (data[_.keys(data)[0]]+"").toLowerCase() == "null" ? " is null" 
									: (data[_.keys(data)[0]]+"").toLowerCase() == "is not null" ? " is not null" 
									: (data[_.keys(data)[0]]+"").split(' ')[1] == undefined ? " = '"+(data[_.keys(data)[0]]+"").replace("'","''")+"'"
									: " "+data[_.keys(data)[0]].split(' ')[0]+" '"+data[_.keys(data)[0]].split(' ')[1].replace("'","''")+"'");
				} else { //vide
					return "true";
				}
			} else if(_.isArray(data)) {
				return _.reduce(data, function(cond, val, i) {
					return cond+" and "+val;
				});
			} else {
				return data == undefined || data == null || data == "" ? "true" : data;
			}
		} else { //type == "set"
			if(_.keys(data).length > 1) {
				return _.reduce(data, function(cond, val, i) {
					if((cond+"").contains("', ")) {
						return cond + ", "+i+" = '"+(""+val).replace("'","''")+"'";
					} else {
						return _.keys(data)[0]+" = '"+ (""+cond).replace("'","''")+"', "+i+" = '"+(""+val).replace("'","''")+"'";
					}
				});
			} else if(_.keys(data).length == 1) {
				return _.keys(data)[0]+" = '"+data[_.keys(data)[0]].replace("'","''")+"'";
			}
		}
	}
}

module.exports = CoreModel;
