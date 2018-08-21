const Model = require('./core/model');

class VehiculeModel extends Model {

  constructor(subdomain) {
    super(subdomain);
  }

  get_all_vehicules() {
  	return this.select("vehicule", {}, []);
  }

  get_all_categories() {
  	return this.select("cat_vehicule", {}, []);
  }

  get_all_types() {
  	return this.select("type_vehicule", {}, []);
  }

  add_data(table, data) {
  	return this.insert(table, data, false);
  }

  update_data(table, info, condition) {
  	return this.update(table, condition, info);
  }

  delete_data(table, condition) {
  	return this.delete(table, condition);
  }

}

module.exports = VehiculeModel;