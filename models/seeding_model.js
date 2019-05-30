
const Model = require('./core/model')
const queries = require('../db/table_queries')
const purgeQueries = require('../db/purge_queries')
const { cooperativesToCreate, cooperatives, names, lastNames, lettersIm, prix, classes, classesTypes, typeVehicle, defaultParams, colors } = require('../db/vars')

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

  purgeDatabase() {
    const model = this;
    debug('run purge');
    return new Promise( async (resolve, reject) => {
       await utilities.forEach(cooperatives, async (coopName) => {
          let dropQuery = `drop database if exists ${ process.env.NODE_ENV == "test" ? "dbtest" : "db" }_coop_${ coopName }`
          await model.client.query( dropQuery, (err, res) => {
            if(err == null) {
              //debug(res);
            } else {
              debug(err);
              debug(dropQuery);
              reject(new error.DatabaseError("Echec de l'exécution de la requête : "+err));
            }
          });
      });
      await utilities.forEach(purgeQueries, async (query) => {
        await model.client.query( query, (err, res) => {
          if(err == null) {
            //debug(res);
          } else {
            debug(err);
            debug(query);
            reject(new error.DatabaseError("Echec de l'exécution de la requête : "+err));
          }
        });
      })
      debug("Purge complete");
      resolve(true);
    });
      
  }

  /**
   * Fonction appelée pour générer toutes les bases inexistantes dans la liste des bases de données
   */
  async lancer_alimentation_auto() {
    try {
      let provinces = await this.select('province', {}, {}, true, 0, 0, false);
      let villes = await this.select('ville', {}, {}, true, 0, 0, false);
      let default_parameter = { ...defaultParams };
      debug('Villes et provinces récupérées');
      if(villes != false) {
          //Loop coopératives
          debug("Début traitement cooperative");
          this.generateDbCoop("cotisse", { default_parameter, provinces, villes }, 0);
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
   * @param {array(parametre_guichet, procinces, villes)} parametre 
   * @param {int} index //Index de la coopérative dans la liste
   * @param {bool} recursive 
   */
  async generateDbCoop(name, parametre, index, recursive = true) {
    debug('Call for '+name)
    const dbPrefix = process.env.NODE_ENV == "test" ? "dbtest" : "db"
    const model = this
    let param = parametre.default_parameter
    const villes = parametre.villes
    const provinces = parametre.provinces
    const nbville = _.keys(villes).length
    model.loadDatabase("default")
    let itineraires = []
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
                async function(idcoop) {
                  if(idcoop) {
                    debug('cooperative inséré');
                    let querystring = `create database ${ dbPrefix }_coop_${ name }`;
                    let param_parguichet = utilities.getRndInteger(0,1) == 1;
                    //let dbcreated = false;
                    await model.client.query(querystring, async (err, res) => {
                      if(err == null) {
                        //dbcreated = true;
                        try {
                          debug("base créée");
                          debug(`Initialisation du structure de la base de ${ name }`);
                          model.dbliste[name] = `${ dbPrefix }_coop_${ name }`;
                          model.loadDatabase(name);
                          await model.createDbStructure();
                          if(!param_parguichet) {
                            param.guichet_id = null;
                            param.param_utiliseclasse = utilities.getRndInteger(0, 1);
                            param.param_typevoitureparclasse = utilities.getRndInteger(0, 1);
                            param.param_frais = utilities.getRndInteger(1, 4);
                            debug("Insertion paramètres pour tous les guichets");
                            await model.insert("parametre", param, false, true, false);
                          }
                          debug("Insertion des provinces!");
                          await utilities.forEach(provinces, async function(province) {
                            await model.insert("province", province, false, true, false);
                          });
                          debug("Insertion des villes!");
                          await utilities.forEach(villes, async function(ville) {
                            await model.insert("ville", ville, false, true, false);
                          }); 
                          debug("Insertion des types de voiture par défaut");
                          let types_temp = [];
                          await utilities.forEach(typeVehicle, async function(type_v) {
                            let idtype = await model.insert("type_vehicule", type_v, false, true, false);
                            if(idtype) {
                              type_v.typv_id = idtype;
                              types_temp.push(type_v);
                            }
                          });
                          if(param.param_utiliseclasse == 1) {
                            debug("Insertion des classes");
                            await utilities.forEach(classes, async function(classe) {
                              await model.insert("classe_vehicule", classe, false, true, false);
                            });
                            if(param.param_typevoitureparclasse == 1) {
                              debug("Affectation des types de véhicules aux classes");
                              await utilities.forEach(classesTypes, async function(ctype) {
                                await model.insert("type_classe", ctype, false, true, false);
                              });
                            }
                          }
                          let nbguichet = utilities.getRndInteger(1, nbville);
                          let nbvoiture = nbguichet * utilities.getRndInteger(2, 4);
                          let maxoffset = nbville - nbguichet;
                          let offset = utilities.getRndInteger(0, maxoffset);
                          let ville_departs = await model.select("ville", {}, {}, true, nbguichet, offset, false);
                          debug("Début traitement des chauffeurs et véhicules");
                          for(let i = 0; i < nbvoiture; i++) {
                            let numerovoiture = utilities.getRndInteger(0,9)+""+utilities.getRndInteger(0,9)+""+utilities.getRndInteger(0,9)+""+utilities.getRndInteger(0,9)+lettersIm[utilities.getRndInteger(0, lettersIm.length - 1)];
                            let nom_chauffeur = lastNames[utilities.getRndInteger(0, lastNames.length - 1)]+" "+names[utilities.getRndInteger(0, names.length - 1)];
                            let couleurvoiture = colors[utilities.getRndInteger(0, colors.length - 1)];
                            let voituredone = false;
                            while(!voituredone) {
                              let voitureexist = await model.select('vehicule', {vehic_numero: numerovoiture}, {}, true, 0, 0, false);
                              if(voitureexist != false) {
                                debug(voitureexist);
                                numerovoiture = utilities.getRndInteger(0,9)+""+utilities.getRndInteger(0,9)+""+utilities.getRndInteger(0,9)+""+utilities.getRndInteger(0,9)+lettersIm[utilities.getRndInteger(0, lettersIm.length - 1)];
                              } else {
                                voituredone = true;
                              }
                            }
                            let numtelchauffeur = "03"+utilities.getRndInteger(2, 4)+""+utilities.getRndInteger(1000000, 9999999);
                            let info_voiture =  {typv_id: utilities.getRndInteger(1,3), vehic_numero: numerovoiture, vehic_couleur: couleurvoiture};
                            if(param.param_utiliseclasse == 1 && param.param_typevoitureparclasse == 0) {
                              info_voiture.clv_id = utilities.getRndInteger(1, 3);
                            }
                            let idvoiture = await model.insert("vehicule",info_voiture, false, true, false);
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
                                param.param_utiliseclasse = utilities.getRndInteger(0, 1);
                                param.param_typevoitureparclasse = utilities.getRndInteger(0, 1);
                                param.param_frais = utilities.getRndInteger(1, 4);
                                debug("Insertion paramètre du guichet "+idguichet);
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
                                  switch(param.param_frais) {
                                    case 2: //par itinéraire et type de véhicule
                                          await utilities.forEach(types_temp, async function(type_v) {
                                            await model.insert("frais", {itin_id: id_itineraire, typv_id: type_v.typv_id, frais_montant: prix[utilities.getRndInteger(0, prix.length - 1)]}, false, true, false);
                                          });
                                          break;
                                    case 2: //par itinéraire et classe
                                          await utilities.forEach(classes, async function(classe, i) {
                                            await model.insert("frais", {itin_id: id_itineraire, clv_id: (i + 1), frais_montant: prix[utilities.getRndInteger(0, prix.length - 1)]}, false, true, false);
                                          });
                                          break;
                                    case 2: //par itinéraire et classe et type de véhicule
                                          await utilities.forEach(classesTypes, async function(ctype) {
                                            await utilities.forEach(types_temp, async function(type_v) {
                                              await model.insert("frais", {itin_id: id_itineraire, clv_id: ctype.clv_id, typv_id: type_v.typv_id, frais_montant: prix[utilities.getRndInteger(0, prix.length - 1)]}, false, true, false);
                                            });
                                          });
                                          break;
                                    default: //par itinéraire uniquement
                                          await model.insert("frais", {itin_id: id_itineraire, frais_montant: prix[utilities.getRndInteger(0, prix.length - 1)]}, false, true, false);
                                          break;
                                  }
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
              )
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
        if(recursive && cooperativesToCreate[index + 1] != undefined) {
          model.generateDbCoop(cooperativesToCreate[index + 1], parametre, index + 1);
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
    const model = this;
    debug('run create');
    return new Promise( async (resolve, reject) => {
       await utilities.forEach(queries, async function(querycreate) {
            if(_.isArray(querycreate)) {
              await utilities.forEach(querycreate, async function(query) {
                //debug(query);
                await model.client.query(query, (err, res) => {
                  if(err == null) {
                    //debug(res);
                  } else {
                    debug(err);
                    debug(query);
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
                  debug(querycreate);
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