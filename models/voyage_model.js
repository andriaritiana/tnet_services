const Model = require('./core/model');

class VoyageModel extends Model {
  constructor(subdomain) {
    super(subdomain);
    this.table = "voyage";
  }

  get_voyage(voyage) {
    return this.select(this.table, voyage, {});
  }

  get_all_voyages() {
    return this.select_join(this.table,[
      "listage ON listage.listage_id = voyage.listage_id",
      "chauffvehic ON chauffvehic.chaufvehic_id = listage.chaufvehic_id",
      "chauffeur ON chauffeur.chauf_id = chauffvehic.chauf_id",
      "vehicule ON vehicule.vehic_id = chauffvehic.vehic_id",
      "type_vehicule ON type_vehicule.typv_id = voyage.typv_id",
      "classe_vehicule ON classe_vehicule.cl_vehic_id = voyage.cl_vehic_id",
      "itineraire ON itineraire.itin_id = voyage.itin_id",
      "guichet ON guichet.guichet_id = itineraire.guichet_id"
    ], {}, [], true);
  }

  add_voyage(voyages) {
    return this.insert(this.table, voyages, false);
  }

  update_voyage(voyage_update) {
    return this.update(this.table, { voy_id: voyage_update.voy_id}, voyage_update);
  }

  delete_voyage(voyage) {
    return this.delete(this.table, voyage);
  }

  control_duplicate(voyage) {
    return this.select(this.table, voyage, {});
  }

  control_duplicate_update(voyage_update) {
    return this.select(this.table, voyage_update, { voy_id:voyage_update.voy_id});
  }
}
module.exports = VoyageModel;
