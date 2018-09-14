const Model = require('./core/model');

class VoyageModel extends Model {
  constructor(subdomain) {
    super(subdomain);
    this.table = "voyage";
  }

  get_voyage(voyage) {
    return this.select(this.table, voyage, {});
  }

  get_all_voyages() {
    return this.select(this.table, {}, {});
  }

  add_voyage(voyages) {
    return this.insert(this.table, voyages, false);
  }

  update_voyage(voyage_update) {
    return this.update(this.table, { voyage_id: voyage_update.voyage_id}, voyage_update);
  }

  delete_voyage(voyage) {
    return this.delete(this.table, voyage);
  }

  control_duplicate(voyage) {
    return this.select(this.table, voyage, {});
  }

  control_duplicate_update(voyage_update) {
    return this.select(this.table, voyage_update, { voyage_id:voyage_update.voyage_id});
  }
}
module.exports = VoyageModel;
