const Model = require('./core/model');

/* config_db = {
  user: 'postgres',
      host: 'localhost',
          database: 'db_coop_cotisse',
              password: 'root',
                  port: '5432'
}

const pg = require('pg');
const pool = new pg.Pool(config_db); */

class VilleModel extends Model {
  constructor(subdomain) {
    super(subdomain);
    this.table = "ville";
  }

  get_ville(ville) {
    return this.select(this.table, ville, {});
  }

  get_all_villes() {
    return this.select(this.table, {}, {});
/*       return new Promise(function (resolve, reject) {
          pool.query('SELECT * FROM ville', (err, res) => {
              if (!err) {
                    console.log("RESULT");
                  resolve(res.rows);
              } else {
                console.log("ERREOR");
                  reject(err);
              }
          });
      }); */
  }

  add_ville(villes) {
    return this.insert(this.table, villes, false);
  }

  update_ville(ville_update) {
    return this.update(this.table, { ville_id: ville_update.ville_id}, ville_update);
  }

  delete_ville(ville) {
    return this.delete(this.table, ville);
  }

  control_duplicate(ville) {
    return this.select(this.table, ville, {});
  }

  control_duplicate_update(ville_update) {
    return this.select(this.table, ville_update, { ville_id:ville_update.ville_id});
  }
}
module.exports = VilleModel;
