const Model = require('./core/model');

class TypeVehiculeModel extends Model {
  constructor(subdomain) {
    super(subdomain);
    this.table = "type_vehicule";
  }

  get_type_vehicule(type_vehicule) {
    return this.select(this.table, type_vehicule, {});
  }

  get_all_type_vehicules() {
    return this.select(this.table, {}, {});
  }

  add_type_vehicule(type_vehicules) {
    return this.insert(this.table, type_vehicules, false);
  }

  update_type_vehicule(type_vehicule_update) {
    return this.update(this.table, { typv_id: type_vehicule_update.typv_id}, type_vehicule_update);
  }

  delete_type_vehicule(type_vehicule) {
    return this.delete(this.table, type_vehicule);
  }

  control_duplicate(type_vehicule) {
    return this.select(this.table, type_vehicule, {});
  }

  control_duplicate_update(type_vehicule_update) {
    return this.select(this.table, type_vehicule_update, { typv_id:type_vehicule_update.typv_id});
  }
}
module.exports = TypeVehiculeModel;
