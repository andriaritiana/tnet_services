const Model = require('./core/model');

class ListageModel extends Model {
  constructor(subdomain) {
    super(subdomain);
    this.table = "listage";
  }

  get_listage(listage) {
    return this.select(this.table, listage, {});
  }

  get_all_listages() {
    return this.select(this.table, {}, {});
  }

  add_listage(listages) {
    return this.insert(this.table, listages, false);
  }

  update_listage(listage_update) {
    return this.update(this.table, { listage_id: listage_update.listage_id}, listage_update);
  }

  delete_listage(listage) {
    return this.delete(this.table, listage);
  }

  control_duplicate(listage) {
    return this.select(this.table, listage, {});
  }

  control_duplicate_update(listage_update) {
    return this.select(this.table, listage_update, { listage_id:listage_update.listage_id});
  }
}
module.exports = ListageModel;