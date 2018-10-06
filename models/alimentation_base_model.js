let cooperatives = [];
const Model = require('./core/model');
const tables = require('./core/db_tables');

class CooperativeModel extends Model {
  constructor(subdomain) {
    let subdomain = (typeof subdomain == "undefined") ? "default" : subdomain;
    super(subdomain);
    this.table = "cooperative";
  }

  lancer_alimentation_auto() {
      let provinces = await this.select('province', {}, {}, true);
      let villes = await this.select('ville', {}, {}, true);
      let model = this;
      let default_parameter = {
        param_id: "",
        guichet_id: "",
        param_heuredepfixe: "",
        param_vehicdiffheuredep: "",
        param_vehicchaqueclasse: "",
        param_chaufpermute: "",
        param_autorisationsansavance: "",
        param_invaliderresretardpaye: "",
        param_invaliderresnonpaye: "",
        param_paritinparclasse: "",
        param_nbvehicreservsimultane: "",
        param_annulerreservparclient: "",
        param_affectchauffvehic: ""
      };
      if(villes != false) {
        let nbville = _.keys(villes).length;
        _.forEach(cooperatives, function(cooperative) {
          this.loadDatabase("default");
          let info_cooperative = {coop_sousdomaine: cooperative.toLowerCase(),
                                  coop_abrev: cooperative,
                                  coop_nom: cooperative,
                                  coop_description: "La coopérative "+cooperative+" est une coopérative qui a été créée pour servir la société malagasy. Son objectif est d'apporter la joie au peuple.",
                                  coop_adresse: "Adresse de la coopérative "+cooperative,
                                  coop_nomcontact: "Contact de la coop",
                                  coop_tel: "02022"+utilities.getRndInteger(10000, 99999),
                                  coop_urlimage: cooperative+".png"	
                                  };
          let coopexist = await this.select("cooperative", {coop_abrev: cooperative},"", true);
          if(coopexist == false) {
            let idcoop = await this.insert("cooperative", info_cooperative, false, true);
            if(idcoop) {
              let querystring = "createdb db_coop_"+cooperative;
              let dbcreated = false;
              model.client.query(querystring, (err, res) => {
                if(err == null) {
                  dbcreated = true;
                } else {
                  debug(error.DatabaseError("Echec de la creation de  la base : "+err));
                }
                model.client.end();
              });
              if(dbcreated) {
                model.dbliste[cooperative] = "db_coop_"+cooperative;
                model.loadDatabase(cooperative);
                model.createDbStructure();
                _.forEach(provinces, function(province) {
                  this.insert("province", province);
                });
                _.forEach(villes, function(ville) {
                  this.insert("ville", ville);
                }); 

              }
            } else {
              debug('La coopérative '+cooperative+' existe déjà dans la base');
            }
          }
        });
    } else {
      debug("Aucune ville dans la base!!! Opération annulée")
    }
  }

  createDbStructure() {
    let model = this;
    _.forEach(tables, function(querycreate) {
      if(_.isArray(querycreate)) {
        _.forEach(querycreate, function(query) {
          model.client.query(query, (err, res) => {
            if(err == null) {
              continue;
            } else {
              debug(error.DatabaseError("Echec de l'exécution de la requête : "+err));
            }
          });
        });
      } else {
        model.client.query(querycreate, (err, res) => {
          if(err == null) {
            continue;
          } else {
            debug(error.DatabaseError("Echec de l'exécution de la requête : "+err));
          }
        });
      }
    });
    model.client.end();
  }
}

module.exports = CooperativeModel;