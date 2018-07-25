const Model = require('./core/model');

class ItineraireModel extends Model {

  constructor(subdomain) {
    super(subdomain);
  }

  get_all_itineraires() {
    return this.select("itineraire", {}, {});
  }

  get_itineraires_bydepart(id_depart) {
  	return this.select_join("itineraire", [["ville", "ville.ville_id = itineraire.itin_arrivee"]], {itin_depart: id_depart}, {});
  }

  get_itineraires_byarrivee(id_arrivee) {
  	return this.select_join("itineraire", [["ville", "ville.ville_id = itineraire.itin_depart"]], {itin_arrivee: id_arrivee}, {});
  }

  add_itineraire(itineraire) {
  	return this.insert("itineraire", itineraire, false);
  }

  update_itineraire(info, condition) {
  	return this.update("itineraire", condition, info);
  }

  delete_itineraire(condition) {
  	return this.delete("itineraire", condition);
  }

}

module.exports = ItineraireModel;