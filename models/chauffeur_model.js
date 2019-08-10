const Model = require('./core/model');

class ChauffeurModel extends Model {
  constructor(subdomain) {
    super(subdomain);
    this.table = "chauffeur";
  }

  get_chauffeur(chauffeur) {
    return this.select(this.table, chauffeur, {});
  }

  get_all_chauffeurs() {
    return this.select(this.table, {}, {});
  }

  add_chauffeur(chauffeurs) {
    return this.insert(this.table, chauffeurs, false);
  }

  update_chauffeur(chauffeur_update) {
    return this.update(this.table, { chauf_id: chauffeur_update.chauf_id}, chauffeur_update);
  }

  delete_chauffeur(chauffeur) {
    return this.delete(this.table, chauffeur);
  }

  control_duplicate(chauffeur) {
    return this.select(this.table, chauffeur, {});
  }

  control_duplicate_update(chauffeur_update) {
    return this.select(this.table, chauffeur_update, { chauf_id:chauffeur_update.chauf_id});
  }
}
module.exports = ChauffeurModel;
