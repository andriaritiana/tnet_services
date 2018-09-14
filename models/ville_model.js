const Model = require('./core/model');

class VilleModel extends Model {
  constructor(subdomain) {
    super(subdomain);
    this.table = "ville";
  }

  get_all_villes(end = true) {
  	return this.select("ville", {}, {}, false, 0, 0, end);
  }

  add_ville(ville, end = true) {
  	return this.insert("ville", ville, false, false, end);
  }

  update_ville(info, condition, end = true) {
  	return this.update("ville", condition, info, end);
  }

  delete_ville(condition, end = true) {
  	return this.delete("ville", condition, end);
  }

  control_duplicate(ville) {
    return this.select(this.table, ville, {});
  }

  control_duplicate_update(ville_update) {
    return this.select(this.table, ville_update, { ville_id:ville_update.ville_id});
  }
}
module.exports = VilleModel;
