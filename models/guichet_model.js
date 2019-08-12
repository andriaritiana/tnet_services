const Model = require('./core/model');

class GuichetModel extends Model {

  constructor(subdomain) {
    super(subdomain);
  }

  async get_all_guichets(closeConnection = true) {
  	//Exemple d'utilisation de condition en commentaire
  	//return await this.select("guichet", {guichet_id: "<= 5", guichet_nom: "is not NULL"}, []);
  	return await this.select("guichet", {}, [], false, 0, 0, closeConnection);
  }

  get_all_guichetiers(closeConnection = true) {
  	return this.select("guichetier", {}, {}, false, 0, 0, closeConnection);
  }

  add_guichet(guichet, closeConnection = true) {
  	//console.log("call", guichet);
  	return this.insert("guichet", guichet, false, false, closeConnection);
  }

  add_guichetier(guichetier, closeConnection = true) {
  	return this.insert("guichetier", guichetier, false, false, closeConnection);
  }

  update_guichet(info, condition, closeConnection = true) {
  	return this.update("guichet", condition, info, closeConnection);
  }

  update_guichetier(info, condition, closeConnection = true) {
  	return this.update("guichetier", condition, info, closeConnection);
  }

  get_params(id_guichet) {
  	var params = this.select("parametre", {guichet_id: id_guichet}, {});
  	if(params.data == undefined || _.isEmpty(params.data)) {
  		params = this.select("parametre", {}, {});
  	}
  	return params;
  }

  delete_guichet(id_guichet) {
  	return this.delete("guichet", {guichet_id: id_guichet});
  }

  delete_guichetier(id_guichetier) {
  	return this.delete("guichetier", {guichetier_id: id_guichetier});
  }

}

module.exports = GuichetModel;