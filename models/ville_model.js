const Model = require('./core/model');

class VilleModel extends Model {

  constructor(subdomain) {
    super(subdomain);
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
}

module.exports = VilleModel;