const Model = require('./core/model');

class VilleModel extends Model {

  constructor(subdomain) {
    super(subdomain);
  }

  get_all_villes() {
  	return this.select("ville", {}, {});
  }

  add_ville(ville) {
  	return this.insert("ville", ville, false);
  }

  update_ville(info, condition) {
  	return this.update("ville", condition, info);
  }

  delete_ville(condition) {
  	return this.delete("ville", condition);
  }
}

module.exports = VilleModel;