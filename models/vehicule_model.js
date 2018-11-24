const Model = require('./core/model');

class VehiculeModel extends Model {
  constructor(subdomain) {
    super(subdomain);
    this.table = "vehicule";
  }

  get_vehicule(vehicule) {
    return this.select(this.table, vehicule, {});
  }

  get_all_vehicules() {
    return this.select_join(
      this.table, ["type_vehicule ON type_vehicule.typv_id = vehicule.typv_id"], {}, [], true
      );
  }

  add_vehicule(vehicules) {
    return this.insert(this.table, vehicules, false);
  }

  update_vehicule(vehicule_update) {
    return this.update(this.table, { vehic_id: vehicule_update.vehic_id}, vehicule_update);
  }

  delete_vehicule(vehicule) {
    return this.delete(this.table, vehicule);
  }

  control_duplicate(vehicule) {
    return this.select(this.table, vehicule, {});
  }

  control_duplicate_update(vehicule_update) {
    return this.select(this.table, vehicule_update, { vehic_id:vehicule_update.vehic_id});
  }
}
module.exports = VehiculeModel;
