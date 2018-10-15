
const Model = require('./core/model');
const tables = require('./core/db_tables');
/**
 * Variables global utilisés pour générer les données 
 * Outre la liste des coopératives, les données sont utilisés de manière aléatoire
 */
let cooperatives = ["vatsy", "kofimanga", "kofiam"];
let noms = ["Jean", "Denis", "Fidy", "Rolland", "Rivo", "Robert", "Denis", "Jules", "Honoré", "Bertin", "Zaka", "Andry", "Lova", "Hery", "Zo"];
let prenoms = ["Randrianirina", "Randrianaly", "Andriamaro", "Zainjafy", "Manambelo", "Andrianomena", "Ramanandraibe", "Rasolofo", "Rakotoarivelo", "Radavida"];
let lettres_im = ["FA", "FB", "FC", "FE", "FD", "FH", "FG", "TA", "TB", "TC", "TD", "TE", "TF", "TG", "TAA", "TAB","TAC", "TBE", "TBF", "TBG", "THA","TGE"];
let couleurs = ["Blanche", "Gris", "Bleue", "Verte", "Rouge", "Violet", "Orange", "Jaune"];

/**
 * @author Andry
 * cette classe est utilisé pour créer une ou des base de données et générer des données de certaines tables
 */
class AlimentationModel extends Model {
  constructor(subdomain) {
    var subdomain = (typeof subdomain == "undefined") ? "default" : subdomain;
    super(subdomain);
    this.table = "cooperative";
  }

  /**
   * Fonction appelée pour générer toutes les bases inexistantes dans la liste des bases de données
   */
  async lancer_alimentation_auto() {
    try {
      let provinces = await this.select('province', {}, {}, true, 0, 0, false);
      let villes = await this.select('ville', {}, {}, true, 0, 0, false);
      let default_parameter = {
        guichet_id: null,
        param_heuredepfixe: "1",
        param_vehicdiffheuredep: "60",
        param_vehicchaqueclasse: "0",
        param_chaufpermute: "0",
        param_autorisationsansavance: "1",
        param_invaliderresretardpaye: "1",
        param_invaliderresnonpaye: "0",
        param_paritinparclasse: "1",
        param_nbvehicreservsimultane: "5",
        param_annulerreservparclient: "1",
        param_affectchauffvehic: "0"
      };
    debug('Villes et provinces récupérées');
    if(villes != false) {
        let nbville = _.keys(villes).length;
        //Loop coopératives
        debug("Début traitement cooperative");
        this.generateDbCoop("vatsy", {default_parameter, provinces, villes}, 0);
    } else {
      debug("Aucune ville dans la base!!! Opération annulée")
    }
    debug('arret de la connexion à la base');
  } catch(e) {
    debug(e);
  }
  }

  /**
   * Fonction qui peut être appelée récursivement pour générer la structure est les contenues d'une base d'une coopérative
   * @param {string} name 
   * @param {array(parametre_duichet, procinces, villes)} parametre 
   * @param {int} index //Index de la coopérative dans la liste
   * @param {bool} recursive 
   */
  async generateDbCoop(name, parametre, index, recursive) {
    var recursive = typeof recursive == "undefined" ? true : recursive;
    let model = this;
    let param = parametre.default_parameter;
    let villes = parametre.villes;
    let provinces = parametre.provinces;
    let nbville = _.keys(villes).length;
    model.loadDatabase("default");
    let itineraires = [];
    let info_cooperative = {coop_sousdomaine: name.toLowerCase(),
                            coop_abrev: name,
                            coop_nom: name,
                            coop_description: "La coopérative "+name+" est une coopérative qui a été créée pour servir la société malagasy. Son objectif est d'apporter la joie au peuple.",
                            coop_adresse: "Adresse de la coopérative "+name,
                            coop_nomcontact: "Contact de la coop",
                            coop_tel: "02022"+utilities.getRndInteger(10000, 99999),
                            coop_urlimage: name+".png"	
                            };
    (new Promise(async (resolve, reject) => {
      try {
        model.select("cooperative", {coop_abrev: name},"", true, 0, 0, false).then(
          function(coopexist) {
            if(coopexist == false) {
              debug('debut creation cooperative');
              //debug(info_cooperative);
              model.insert("cooperative", info_cooperative, false, true, false).then(
                function(idcoop) {
                if(idcoop) {
                  debug('cooperative inséré');
                  let querystring = "create database db_coop_"+name;
                  let param_parguichet = utilities.getRndInteger(0,1) == 1;
                  //let dbcreated = false;
                  model.client.query(querystring, async (err, res) => {
                    if(err == null) {
                      //dbcreated = true;
                      try {
                        debug("base créée");
                        debug("Initialisation du structure de la base de "+name);
                        model.dbliste[name] = "db_coop_"+name;
                        model.loadDatabase(name);
                        await model.createDbStructure();
                        if(!param_parguichet) {
                          param.guichet_id = null;
                          debug("Insertion paramètres pour tous les guichets");
                          await model.insert("parametre", param, false, true, false);
                        }
                        debug("Insertion des provinces!");
                        await utilities.forEach(provinces, async function(province) {
                          await model.insert("province", province, false, true, false);
                        });
                        debug("Insertion des villes!");
                        await utilities.forEach(villes, async function(ville) {
                          model.insert("ville", ville, false, true, false);
                        }); 
                        let nbguichet = utilities.getRndInteger(1, nbville);
                        let nbvoiture = nbguichet * utilities.getRndInteger(2, 4);
                        let maxoffset = nbville - nbguichet;
                        let offset = utilities.getRndInteger(0, maxoffset);
                        let ville_departs = await model.select("ville", {}, {}, true, nbguichet, offset, false);
                        debug("Début traitement des chauffeurs et véhicules");
                        for(let i = 0; i < nbvoiture; i++) {
                          let numerovoiture = utilities.getRndInteger(0,9)+""+utilities.getRndInteger(0,9)+""+utilities.getRndInteger(0,9)+""+utilities.getRndInteger(0,9)+lettres_im[utilities.getRndInteger(0, lettres_im.length - 1)];
                          let nom_chauffeur = prenoms[utilities.getRndInteger(0, prenoms.length - 1)]+" "+noms[utilities.getRndInteger(0, noms.length - 1)];
                          let couleurvoiture = couleurs[utilities.getRndInteger(0, couleurs.length - 1)];
                          let voituredone = false;
                          while(!voituredone) {
                            let voitureexist = await model.select('vehicule', {vehic_numero: numerovoiture}, {}, true, 0, 0, false);
                            if(voitureexist != false) {
                              debug(voitureexist);
                              numerovoiture = utilities.getRndInteger(0,9)+""+utilities.getRndInteger(0,9)+""+utilities.getRndInteger(0,9)+""+utilities.getRndInteger(0,9)+lettres_im[utilities.getRndInteger(0, lettres_im.length - 1)];
                            } else {
                              voituredone = true;
                            }
                          }
                          let numtelchauffeur = "03"+utilities.getRndInteger(2, 4)+utilities.getRndInteger(1000000, 9999999);
                          let idvoiture = await model.insert("vehicule", {vehic_numero: numerovoiture, vehic_couleur: couleurvoiture}, false, true, false);
                          let idchauffeur = await model.insert("chauffeur", {chauf_nom: nom_chauffeur, chauf_tel: numtelchauffeur}, false, true, false);
                          if(idvoiture && idchauffeur) {
                            let date = new Date();
                            let idchauffvehic = await model.insert("chauffvehic", 
                                                                  {chauf_id: idchauffeur,
                                                                    vehic_numero: idvoiture,
                                                                    chaufvehic_date: date.getFullYear()+"-"+date.getMonth()+"-"+date.getDay()
                                                                  }, false, true, false);
                            if(!idchauffvehic) debug("Echec de traitement chauffeur véhicule voiture_id: "+id+" chauffeur_id: "+idchauffeur);
                          } else {
                            debug("Echec d'insertion de chauffeur ou véhicule voiture_id: "+id+" chauffeur_id: "+idchauffeur);
                          }
                        } 
                        debug("Début traitement des guichets!");
                        await utilities.forEach(ville_departs, async function(villedep) {
                          let info_guichet = {
                              ville_id: villedep.ville_id,
                              guichet_nom: "Guichet de "+villedep.ville_nom,
                              guichet_adresse: "Adresse à "+villedep.ville_nom
                          };
                          let idguichet = await model.insert("guichet", info_guichet, false, true, false);
                          if(!idguichet) {
                            debug("Impossible d'insérer le guichet");
                          } else {
                            let nbitineraire = utilities.getRndInteger(1, nbville - 1);
                            let departcompte = utilities.getRndInteger(1, nbville - (nbitineraire+1));
                            let ville_arrivees = _.filter(villes, function(v, index) {
                              if(index >= departcompte && index <= (nbitineraire + departcompte)) {
                                return v.ville_id != villedep.ville_id;
                              }
                            });
                            if(param_parguichet) {
                              param.guichet_id = idguichet;
                              debug("Insertion paramètre duichet "+idguichet);
                              await model.insert("parametre", param, false, true, false);
                            }
                            await utilities.forEach(ville_arrivees, async function(ville_arrive) {
                              let info_itineraire = {
                                  guichet_id: idguichet,
                                  itin_depart: villedep.ville_id,
                                  itin_arrivee: ville_arrive.ville_id
                              };
                              let id_itineraire = await model.insert("itineraire", info_itineraire, false, true, false);
                              if(!id_itineraire) {
                                debug("Impossible d'insérer l'itinéraire");
                              } else {
                                info_itineraire.itin_id = id_itineraire;
                                itineraires.push(info_itineraire);
                              }
                            });
                          }
                        });
                        debug('fin de traitement de la base de '+name);
                        if(itineraires.length > 0) {
                          debug("Traitement des itineraires dans la base transnet!");
                          model.loadDatabase("default");
                          await utilities.forEach(itineraires, async function(itineraire) {
                            let itin = await model.select("itineraire", {itin_depart: itineraire.itin_depart, itin_arrivee: itineraire.itin_arrivee}, {}, true, 0, 0, false);
                            if(itin && _.keys(itin).length > 0) {
                              let iditin = itin[0]["itin_id"];
                              let info = await model.insert("coop_itin", {coop_id: idcoop, itin_id: iditin}, false, true, false);
                              if(!info) {
                                debug("Impossible d'ajouter l'itinéraire à la coop  "+name+" itin "+iditin);
                              }
                            } else {
                              let iditin = await model.insert("itineraire", {itin_depart: itineraire.itin_depart, itin_arrivee: itineraire.itin_arrivee}, false, true, false);
                              if(iditin) {
                                let info = await model.insert("coop_itin", {coop_id: idcoop, itin_id: iditin}, false, true, false);
                                if(!info) {
                                  debug("Impossible d'ajouter l'itinéraire à la coop  "+name+" itin "+iditin);
                                }
                              } else {
                                debug("Impossible d'ajouter l'itineraire "+itineraire.itin_id+" de la cooperative "+cooperative);
                              }
                            }
                          });
                        }
                        debug('finish it');
                        resolve(true);
                      } catch(err) {
                        debug(err);
                        reject(err);
                      }
                    } else {
                      debug(new error.DatabaseError("Echec de la creation de  la base : "+err));
                      reject(err);
                    }
                    //model.client.end();
                  });
                } else {
                  debug('Echec de l\'insertion de la coopérative '+name+' dans la base db_transnet');
                  reject(false);
                }
              }).catch(
                function(err) {
                  reject(err);
                }
              );
            } else {
              debug("La coopérative existe dans la base");
              resolve(true);
            }
          }
        ).catch(function(err) {
          reject(err);
        });
      } catch(e) {
        debug(e);
        reject(false);
      }
    })
    ).then(function(resp) {
      if(resp) {
        if(recursive && cooperatives[index + 1] != undefined) {
          model.generateDbCoop(cooperatives[index + 1], parametre, index + 1);
        } else {
          model.client.end();
        }
      } else {
        debug('Une erreur inattendue a été rencontré avec la coopérative '+name);
      }
    }).catch(function(resp) {
      debug('reject >>> '+resp);
      debug('Une erreur dans le traitement de la coopérative '+name);
    });
  }

  /**
   * Fonction qui génére la structure de la base d'une coopérative, 
   * appelée par generateDbCoop
   */
  async createDbStructure() {
    let model = this;
    debug('run create');
    return new Promise( async (resolve, reject) => {
       await utilities.forEach(tables, async function(querycreate) {
            if(_.isArray(querycreate)) {
              await utilities.forEach(querycreate, async function(query) {
                //debug(query);
                await model.client.query(query, (err, res) => {
                  if(err == null) {
                    //debug(res);
                  } else {
                    debug(err);
                    reject(new error.DatabaseError("Echec de l'exécution de la requête : "+err));
                  }
                });
              });
            } else {
              //debug(querycreate);
              await model.client.query(querycreate, (err, res) => {
                if(err == null) {
                  //debug(res);
                } else {
                  debug(err);
                  reject(new error.DatabaseError("Echec de l'exécution de la requête : "+err));
                }
              });
            }
          });
      debug("resolve");
      resolve(true);
    });
    
  }
}

module.exports = AlimentationModel;