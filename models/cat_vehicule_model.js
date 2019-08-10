const Model = require('./core/model');

class CatVehiculeModel extends Model {
  constructor(subdomain) {
    super(subdomain);
    this.table = "cat_vehicule";
  }

  get_cat_vehicule(cat_vehicule) {
    return this.select(this.table, cat_vehicule, {});
  }

  get_all_cat_vehicules() {
    return this.select(this.table, {}, {});
  }

  add_cat_vehicule(cat_vehicules) {
    return this.insert(this.table, cat_vehicules, false);
  }

  update_cat_vehicule(cat_vehicule_update) {
    return this.update(this.table, { cat_vehic_id: cat_vehicule_update.cat_vehic_id}, cat_vehicule_update);
  }

  delete_cat_vehicule(cat_vehicule) {
    return this.delete(this.table, cat_vehicule);
  }

  control_duplicate(cat_vehicule) {
    return this.select(this.table, cat_vehicule, {});
  }

  control_duplicate_update(cat_vehicule_update) {
    return this.select(this.table, cat_vehicule_update, { cat_vehic_id:cat_vehicule_update.cat_vehic_id});
  }
}
module.exports = CatVehiculeModel;
