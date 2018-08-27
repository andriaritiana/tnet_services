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

  update_cooperative(cooperative_update) {
    return this.update(this.table, { coop_id: cooperative_update.coop_id}, cooperative_update);
  }

  delete_cooperative(cooperative) {
    return this.delete(this.table, cooperative);
  }

  control_duplicate(cooperative) {
    return this.select(this.table, cooperative, {});
  }

  control_duplicate_update(cooperative_update) {
    return this.select(this.table, cooperative_update, { coop_id:cooperative_update.coop_id});
  }
}
module.exports = CooperativeModel;
