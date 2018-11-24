const Model = require('./core/model');

class ClasseVehiculeModel extends Model {
  constructor(subdomain) {
    super(subdomain);
    this.table = "classe_vehicule";
  }

  get_classe_vehicule(classe_vehicule) {
    return this.select(this.table, classe_vehicule, {});
  }

  get_all_classe_vehicules() {
    return this.select(this.table, {}, [], true);
  }

  add_classe_vehicule(classe_vehicules) {
    return this.insert(this.table, classe_vehicules, false);
  }

  update_classe_vehicule(classe_vehicule_update) {
    return this.update(this.table, { cat_vehic_id: classe_vehicule_update.cat_vehic_id}, classe_vehicule_update);
  }

  delete_classe_vehicule(classe_vehicule) {
    return this.delete(this.table, classe_vehicule);
  }

  control_duplicate(classe_vehicule) {
    return this.select(this.table, classe_vehicule, {});
  }

  control_duplicate_update(classe_vehicule_update) {
    return this.select(this.table, classe_vehicule_update, { cat_vehic_id:classe_vehicule_update.cat_vehic_id});
  }
}
module.exports = ClasseVehiculeModel;
