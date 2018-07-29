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

  update_cooperative(id, cooperatives){
    console.log(this.table, id, cooperatives);
    return this.update(this.table, id, cooperatives);
  }
}
module.exports = CooperativeModel;
