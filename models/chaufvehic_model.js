const Model = require('./core/model');

class ChaufVehicModel extends Model {
  constructor(subdomain) {
    super(subdomain);
    this.table = "chauffvehic";
  }

  get_chaufvehic(chaufvehic) {
    return this.select(this.table, chaufvehic, {});
  }

  get_all_chaufvehics() {
    return this.select_join(this.table, [
      "chauffeur ON chauffeur.chauf_id = chauffvehic.chauf_id",
      "vehicule ON vehicule.vehic_id = chauffvehic.vehic_id"
    ], {}, [], true);
  }

  add_chaufvehic(chaufvehics) {
    return this.insert(this.table, chaufvehics, false);
  }

  update_chaufvehic(chaufvehic_update) {
    return this.update(this.table, { chaufvehic_id: chaufvehic_update.chaufvehic_id}, chaufvehic_update);
  }

  delete_chaufvehic(chaufvehic) {
    return this.delete(this.table, chaufvehic);
  }

  control_duplicate(chaufvehic) {
    return this.select(this.table, chaufvehic, {});
  }

  control_duplicate_update(chaufvehic_update) {
    return this.select(this.table, chaufvehic_update, { chaufvehic_id:chaufvehic_update.chaufvehic_id});
  }
}
module.exports = ChaufVehicModel;
