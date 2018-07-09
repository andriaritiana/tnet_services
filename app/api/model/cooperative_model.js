const Model = require('./base/model');

class CooperativeModel extends Model {

  constructor(subdomain) {
    super(subdomain);
  }

  get_all_cooperatives() {
    return this.select("cooperative", {}, {});
  }
}
module.exports = CooperativeModel;
