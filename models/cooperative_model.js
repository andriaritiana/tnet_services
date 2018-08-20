const Model = require('./core/model');

class CooperativeModel extends Model {
  constructor(subdomain) {
    super(subdomain);
    this.table = "cooperative";
  }

  get_cooperative(cooperative) {
    return this.select(this.table, cooperative, {});
  }

  get_all_cooperatives() {
    return this.select(this.table, {}, {});
  }

  add_cooperative(cooperatives) {
    return this.insert(this.table, cooperatives, false);
  }

  update_cooperative(cooperative, cooperative_update) {
    return this.update(this.table, cooperative, cooperative_update);
  }

  delete_cooperative(cooperative) {
    return this.delete(this.table, cooperative);
  }
}
module.exports = CooperativeModel;
