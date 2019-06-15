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
	constructor(subdomain = "default") {
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
	* @param JSON dataCondition (clé:valeur ex: {champ1: 12}) (champs de condition, peut être {})
	* @param array dataField (valeur,... ex: ["champ1","champ2"]) (champs à sélectionner, peut être [] )
	* @param bool noStatus (retourne avec un statut ou data uniquement)
	* @param int limit (nombre limite de données à récupérer)
	* @param int offset (Récupérer à partir de la ligne numéro) 
	* @param bool closeConnection (Fermer le client ou laisser ouvert) 
	* @return object (JSON)
	*/
	select(table, dataCondition, dataField, noStatus = false, limit = 0, offset = 0, closeConnection = true, orderBy = "") {
		debug('order by')
		debug(orderBy)
		const model = this;
		return new Promise(function(resolve, reject) {
			if(model.dberror) {
				if(noStatus) debug("No database selected");
				reject(noStatus ? false : new error.DatabaseError("No database selected"));
			} else {
				var condition = model.getValMerged(dataCondition, "condition");
				var champs = model.getValMerged(dataField);
				var querystring = `select ${champs} from ${table} where ${condition}`;
				if(orderBy) {
					querystring += " order by "+orderBy;
				}
				if(limit > 0) {
					querystring += " limit "+limit;
				}
				if(offset > 0) {
					querystring += " offset "+offset;
				}
				debug(querystring);
				model.client.query(querystring, (err, res) => {
					if(err == null) {
						//debug(res);
						let results = res.rows;
						resolve(noStatus ? results : {status:1, message: "Données récupérées", data: results});
					} else {
						debug(err);
						reject(noStatus ? false : new error.DatabaseError("Erreur de récupération des données"));
					}
					if(closeConnection) model.client.end();
				});
			}
		});
	}

	/**
	* sélectionner des lignes d'une table joignant une ou plusieurs autre(s) table(s)
	* @param string table
	* @param array join (ex: [["table1", "table1.champ = table2.champ", "inner"]] ou [["table1", "table1.champ = table2.champ"]] ou ["table1 on table1.champ = table2.champ"])
	* @param JSON dataCondition (clé:valeur ex: {champ1: 12}) (champs de condition, peut être {})
	* @param array dataField (valeur, ... ex: ["champ1", "champ2"]) (champs à sélectionner, peut être [] )
	* @param bool noStatus (retourne avec un statut ou data uniquement)
	* @param int limit (nombre limite de données à récupérer)
	* @param int offset (Récupérer à partir de la ligne numéro) 
	* @param bool closeConnection (Fermer le client ou laisser ouvert) 
	* @return object (JSON)
	*/
	select_join(table, join, dataCondition, dataField, noStatus = false, limit = 0, offset = 0, closeConnection = true, orderBy = "") {
		const model = this;
		return new Promise(function(resolve, reject) {
			if(model.dberror) {
				if(noStatus) debug("No database selected");
				reject(noStatus ? false : new error.DatabaseError("No database selected"));
			} else {
				const condition = model.getValMerged(dataCondition, "condition");
				const champs = model.getValMerged(dataField);
				let querystring = `select ${champs} from ${table} where ${condition} `;
				if(!_.isEmpty(join)) {
					let jointure = "";
					if(_.isArray(join)) {
					
						jointure += _.reduce(join, (joins, jn, i) => {
							if(_.isArray(jn)) {
								return `${i == 1 ?  _.isArray(join[0]) ? ` ${join[0][2] ? join[0][2] : ''} join ${join[0][0]} on ${join[0][1]}` : ` join ${join[0]}` : joins} ${jn[2] ? jn[2] : ''} join ${jn[0]} on ${jn[1]}`
							} else return `${i == 1 ?  _.isArray(join[0]) ? ` ${join[0][2] ? join[0][2] : ''} join ${join[0][0]} on ${join[0][1]}` : ` join ${join[0]}` : joins} join ${jn}`
						})
					} else if(_.isObject(join)) {
						debug('object')
						_.keys(join).forEach((index) => {
							if(_.isArray(join[index]))jointure += `${join[index][1]} join ${index} on ${join[index][0]}`
							else jointure += ` join ${index} on ${join[index]}`
						})
					} else {
						jointure += "join "+join+" ";
					}
					querystring = `select ${champs} from ${table} ${jointure} where ${condition}`;
				}
				if(orderBy) {
					querystring += " order by "+orderBy;
				}
				if(limit > 0) {
					querystring += " limit "+limit;
				}
				if(offset > 0) {
					querystring += " offset "+offset;
				}
				debug(querystring)
				model.client.query(querystring, (err, res) => {
					//console.log(err, res)
					if(err == null) {
						let results = res.rows;
						resolve(noStatus ? results : {status:1, message: "Données récupérées", data: results});
					} else {
						debug(err);
						reject(noStatus ? false : new error.DatabaseError("Erreur de récupération des données"));
					}
					if(closeConnection) model.client.end();
				});
			}
		});
	}

	/**
	* Insérer une ou plusieures lignes dans une table
	* @param string table (nom de la table)
	* @param JSON data (clé:valeur ex: {champ1: 12}) (données à insérer, ne peut pas être {})
	* @param boolean multiple (si l'insértion est de type multiple ou une seule ligne)
	* @param bool noStatus (retourne avec un statut ou data uniquement)
	* @param bool end (Fermer le client ou laisser ouvert) 
	* @return object (JSON)
	*/
	insert(table, data, multiple = false, noStatus = false, closeConnection = true) {
		const model = this;
		if(_.isArray(data) && multiple == false) {
			throw new error.DatabaseError("Bad combination error: cannot insert single array element")
		} else if(!_.isArray(data) && multiple == true) {
			throw new error.DatabaseError(`Bad combination error: cannot insert multiple ${typeof data} element`)
		}
		return new Promise(function(resolve, reject) {
			if(model.dberror) {
				if(noStatus) debug("No database selected");
				reject(new error.DatabaseError("No database selected"));
			} else {
				if(_.keys(data).length == 0) {
					if(noStatus) debug("Aucune ligne à insérer");
					reject(noStatus ? false : {status:0, message: "Aucune ligne à insérer"});
				} else {
					if(multiple) {
						var data_row = "";
						var values = "";
						_.each(data, function(data1) {
							if(data_row == "") {
								data_row = model.getValMerged(data1);
							}
							if(values == "") {
								values = model.getValMerged(data1, "valeur");
							} else {
								values += "), ("+ model.getValMerged(data1, "valeur");
							}
						});
						let querystring = `insert into ${table} (${data_row}) values(${values}) returning *`;
						model.client.query(querystring, (err, res) => {
							//console.log(err, res)
							if(err == null) {
								let key0 = _.keys(res.rows[0])[0];
								resolve({status:1, message: "Données insérées", ids: res.rows.map((row) => row[key0])});
							} else {
								debug(err);
								reject(new error.DatabaseError("Echec de l'insertion des données"+err));
							}
							if(closeConnection) model.client.end();
						});
					} else {
						let data_row = model.getValMerged(data);
						let data_val = model.getValMerged(data, "valeur");
						let querystring = `insert into ${table}(${data_row}) values(${data_val}) returning *`;

						debug(querystring);
						model.client.query(querystring, (err, res) => {
							//console.log( res)
							if(err == null) {
								let key0 = _.keys(res.rows[0])[0];
								let id = res.rows[0][key0];
								resolve(noStatus ? id : {status:1, message: "Données insérées", id: id});
							} else {
								debug(err);
								reject(noStatus ? false : new error.DatabaseError("Echec de l'insertion des données"+ err));
							}
							if(closeConnection) model.client.end();
						});
					}
				}
			}
		});
	}

	/**
	* Mettre à jour des lignes d'une table
	* @param string table (nom de la table)
	* @param JSON dataCondition (clé:valeur ex: {champ1: 12}) (champs de conditions, ne peut pas être {})
	* @param JSON data_update (clé:valeur ex: {cham1p1: 12}) (champs à modifier, ne peut pas être {})
	* @param bool closeConnection (Fermer le client ou laisser ouvert) 
	* @return object (JSON)
	*/
	update(table, dataCondition, dataUpdate, closeConnection = true) {
		const model = this;
		return new Promise(function(resolve, reject) {
			if(model.dberror) {
				if(noStatus) debug("No database selected");
				reject(new error.DatabaseError("No database selected"));
			} else {
				if(_.keys(dataCondition).length == 0 || _.keys(dataUpdate).length == 0) {
					reject(new error.DatabaseError("Action performed not allowed"));
				} else {
					let condition = model.getValMerged(dataCondition, "condition");
					let dataset = model.getValMerged(dataUpdate, "set");
					let querystring = `update ${table} set ${dataset} where ${condition}`;
					//console.log(querystring);
					model.client.query(querystring, (err, res) => {
						//console.log(err, res)
						if(err == null) {
							resolve({status:1, message: "Mise à jour réussie"});
						} else {
							debug(err);
							reject(new error.DatabaseError(`Echec de la mise à jour ${err}`));
						}
						if(closeConnection) model.client.end();
					});
				}
			}
		});
	}

	/**
	* Supprimer des lignes d'une table
	* @param string table (nom de la table)s
	* @param JSON dataCondition (clé:valeur ex: {champ1: 12}) (champs de condition, ne peut pas être {})
	* @param bool closeConnection (Fermer le client ou laisser ouvert) 
	* @return object (JSON)
	*/
	delete(table, dataCondition, closeConnection = true) {
		const model = this;
		return new Promise(function(resolve, reject) {
			if(model.dberror) {
				if(noStatus) debug("No database selected");
				reject(new error.DatabaseError("No database selected"));
			} else {
				if(_.keys(dataCondition).length == 0) {
					reject(new error.DatabaseError("Action performed not allowed"));
				} else {
					let condition = model.getValMerged(dataCondition, "condition");
					let querystring = `delete from ${table} where ${condition}`;
					model.client.query(querystring, (err, res) => {
						//console.log(err, res)
						if(err == null) {
							resolve({status:1, message: "Suppression réussie"});
						} else {
							debug(err);
							reject(new error.DatabaseError("Echec de la suppression : "+err));
						}
						if(closeConnection) model.client.end();
					});
				}
			}
		});
	}

	/**
	* Réduit un array ou un objet à un string séparé par des virgules ou and selon le type
	*/
	getValMerged(data, type = 'champ') {
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
				return utilities.trim(data) ? data : "*";
			}
		} else if(type == "valeur") {
			if(!_.isArray(data) && _.isObject(data)){
				if(_.keys(data).length > 1) {
					return _.reduce(data, function(valeur, val, i) {
						if(`${valeur}`.contains("', ") || `${valeur}`.contains("null, ")) {
							return valeur + ", "+(val != null ? "'"+`${val}`.replace("'","''")+"'" : "null");
						} else {
							return (valeur == null ? "null" : "'"+`${valeur}`.replace("'","''")+"'" )+", '"+`${val}`.replace("'","''")+"'";
						}
					});
				} else if(_.keys(data).length == 1) {
					return data[_.keys(data)[0]] == null ? "null" : "'"+data[_.keys(data)[0]].replace("'","''")+"'";
				} else {
					return "";
				}
			} else {
				debug('Type not supported yet')
				throw new error.DatabaseError('Value type not supported')
			}
		} else if(type == "condition") {
			if(_.isArray(data)) {
				return data.length == 0 ? 'true' : _.reduce(data, function(cond, val) {
					return cond+" and "+val;
				});
			} else if(_.isObject(data)) {
				if(_.keys(data).length > 1) {
					return _.reduce(data, function(cond, val, i) {
						const hasOperator = `${i}`.split(' ')[1]
						if(`${cond}`.contains("' and")) {
							return cond + " and "+i+(hasOperator ? 
								( val == null || `${val}`.toLowerCase() == "null" ? " null" : " '" + `${val}`.replace("'","''") + "'") :
								( val == null || `${val}`.toLowerCase() == "null" ? " is null" : " = '" + `${val}`.replace("'","''") + "'")
							)
						} else {
							const hasOperator0 = `${_.keys(data)[0]}`.split(' ')[1]
							const cond0 = _.keys(data)[0] + ( hasOperator0 ? ( cond == null || `${cond}`.toLowerCase() == "null" ? " null" : " '" + `${cond}`.replace("'","''") + "'") : ( cond == null || `${cond}`.toLowerCase() == "null" ? " is null" : " = '" + `${cond}`.replace("'","''") + "'") )
							const cond1 = ` and ${i}` + ( hasOperator ? ( val == null || `${val}`.toLowerCase() == "null" ? " null" : " '" + `${val}`.replace("'","''") + "'") : ( val == null || `${val}`.toLowerCase() == "null" ? " is null" : " = '" + `${val}`.replace("'","''") + "'") )
							return `${cond0}${cond1}`
						}
					})
				} else if(_.keys(data).length == 1) {
					const hasOperator = `${_.keys(data)[0]}`.split(' ')[1]
					const index = _.keys(data)[0]
					return  index + ( hasOperator ? 
									(data[index] == null || `${data[index]}`.toLowerCase() == "null" ? " null" : " '" + `${data[index]}`.replace("'","''") + "'") :
									(data[index] == null || `${data[index]}`.toLowerCase() == "null" ? " is null" : " = '" + `${data[index]}`.replace("'","''") + "'") 
									)
				} else { //vide
					return "true";
				}
			} else {
				return !utilities.trim(data) ? "true" : data;
			}
		} else { //type == "set"
			if(!_.isArray(data) && _.isObject(data)) {
				if(_.keys(data).length > 1) {
					return _.reduce(data, function(cond, val, i) {
						if(`${cond}`.contains("', ")) {
							return `${cond}, ${i} = ${val == null || `${val}`.toLowerCase() == null ? "null" : "'"+`${val}`.replace("'","''")+"'"}`;
						} else {
							const index = _.keys(data)[0]
							return `${index} = ${cond == null || `${cond}`.toLowerCase() == "null" ? "null" : "'"+`${cond}`.replace("'","''")+"'" }, ${i} = ${val == null || `${val}`.toLowerCase() == "null" ? "null" : "'"+`${val}`.replace("'","''")+"'"}`;
						}
					})
				} else if(_.keys(data).length == 1) {
					const index = _.keys(data)[0]
					return `${index} = ${data[index] == null || `${data[index]}`.toLowerCase() == "null" ? "null" : "'"+`${data[index]}`.replace("'","''")+"'" }`;
				} else {
					debug('Set empty values not supported')
				  throw new error.DatabaseError('Cannot set empty values')
				}
			} else {
				debug('Set params not supported yet')
				throw new error.DatabaseError('Set params type not supported')
			}
		}
	}
}

module.exports = CoreModel;
