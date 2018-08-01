const Model = require('./core/model');

class CooperativeModel extends Model {

  constructor(subdomain) {
    super(subdomain);
    this.table = "cooperative";
  }

  get_all_cooperatives() {
    return this.select(this.table, {}, {});
  }

  add_cooperative(cooperatives){
    return this.insert(this.table, cooperatives, false);
  }

  update_cooperative(id, cooperative){
    return this.update(this.table, id, cooperative);
  }

  delete_cooperative(id) {
    return this.delete(this.table, id);
  }
}
module.exports = CooperativeModel;
