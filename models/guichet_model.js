const Model = require('./core/model');

class GuichetModel extends Model {

  constructor(subdomain) {
    super(subdomain);
  }

  async get_all_guichets() {
  	//Exemple d'utilisation de condition en commentaire
  	//return await this.select("guichet", {guichet_id: "<= 5", guichet_nom: "is not NULL"}, []);
  	return await this.select("guichet", {}, []);
  }

  get_all_guichetiers() {
  	return this.select("guichetier", {}, {});
  }

  add_guichet(guichet) {
  	//console.log("call", guichet);
  	return this.insert("guichet", guichet, false);
  }

  add_guichetier(guichetier) {
  	return this.insert("guichetier", guichetier, false);
  }

  update_guichet(info, condition) {
  	return this.update("guichet", condition, info);
  }

  update_guichetier(info, condition) {
  	return this.update("guichetier", condition, info);
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