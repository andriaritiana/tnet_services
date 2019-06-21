const Model = require('./core/model');
const nodeEnv = process.env.NODE_ENV;

class CooperativeModel extends Model {
  constructor(subdomain) {
    super(subdomain);
    this.table = "cooperative";
  }

  get_cooperative(cooperative) {
    return this.select(this.table, cooperative, {}, false, 0, 0, nodeEnv == "test" ? false : true);
  }

  get_all_cooperatives() {
    return this.select(this.table, {}, {}, false, 0, 0, nodeEnv == "test" ? false : true);
  }

  add_cooperative(cooperatives) {
    return this.insert(this.table, cooperatives, false, false, nodeEnv == "test" ? false : true);
  }

  update_cooperative(cooperative_update) {
    if(!cooperative_update.coop_id) throw(new error.DatabaseError("Cannot update cooperative without id"))
    return this.update(this.table, { coop_id: cooperative_update.coop_id}, cooperative_update, nodeEnv == "test" ? false : true);
  }

  delete_cooperative(cooperative) {
    return this.delete(this.table, cooperative, nodeEnv == "test" ? false : true);
  }

  control_duplicate(cooperative) {
    return this.select(this.table, cooperative, {}, false, 0, 0, nodeEnv == "test" ? false : true);
  }

  control_duplicate_update(cooperative_update) {
    return this.select(this.table, cooperative_update, {}, false, 0, 0, nodeEnv == "test" ? false : true);
  }
}
module.exports = CooperativeModel;
