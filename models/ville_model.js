const Model = require('./core/model');

class VilleModel extends Model {
  constructor(subdomain) {
    super(subdomain);
    this.table = "ville";
  }

  get_ville(ville) {
    return this.select(this.table, ville, {});
  }

  get_all_villes() {
    return this.select(this.table, {}, {});
  }

  add_ville(villes) {
    return this.insert(this.table, villes, false);
  }

  update_ville(ville_update) {
    return this.update(this.table, { ville_id: ville_update.ville_id}, ville_update);
  }

  delete_ville(ville) {
    return this.delete(this.table, ville);
  }

  control_duplicate(ville) {
    return this.select(this.table, ville, {});
  }

  control_duplicate_update(ville_update) {
    return this.select(this.table, ville_update, { ville_id:ville_update.ville_id});
  }
}
module.exports = VilleModel;
