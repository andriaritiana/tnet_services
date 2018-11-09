const Model = require('./core/model');

class ProvinceModel extends Model {
    constructor(subdomain) {
        super(subdomain);
    }

    async get_all_provinces() {
        return await this.select("province", {}, []);
    }

    get_provinces_with_info() {
        let model = this;
        return new Promise(async (resolve, reject) => {
            let provinces = await model.select("province", {}, "prov_id, trim(both from prov_nom) as prov_nom, prov_description, (select count(distinct coop_id) from ville join itineraire on itineraire.itin_arrivee = ville.ville_id join coop_itin on coop_itin.itin_id = itineraire.itin_id where ville.prov_id = province.prov_id) as nb_province", true, 0, 0, false, "prov_id asc");
            if(provinces != false) {
                debug(utilities.getRndInteger(2,6));
                await utilities.forEach(provinces, async function(prov) {
                    if(prov.nb_province > 0) {
                        let beginin = 0;
                        if(parseInt(prov.nb_province) > 5) {
                            let max = parseInt(prov.nb_province) - 5;
                            beginin = utilities.getRndInteger(0,max);
                        }
                        prov.infos = await model.getProvinceInfos(prov.prov_id, beginin);
                    } else {
                        prov.infos = [];
                    }
                });
                debug(provinces);
                //model.client.end();
                resolve({status:1, message: "Données récupérées", data:provinces});
            } else {
                reject(new error.DatabaseError("Erreur de récupération des données"));
            }
        });
    }

    getProvinceInfos(idprov, beginin) {
        let model = this;
        return new Promise(async (resolve, reject) => {
            let cooperatives = await model.select_join("cooperative", 
                                                            [["coop_itin", "coop_itin.coop_id = cooperative.coop_id"], 
                                                             ["itineraire", "coop_itin.itin_id = itineraire.itin_id"],
                                                             ["ville", "itineraire.itin_arrivee = ville.ville_id"]],
                                                            {prov_id: idprov},
                                                            "distinct cooperative.*", 
                                                            true,
                                                            5, beginin, false);
            await utilities.forEach(cooperatives, async function(coop) {
                let arrivees = await model.select_join("itineraire", 
                                                [["coop_itin", "coop_itin.itin_id = itineraire.itin_id"],
                                                ["ville", "itineraire.itin_arrivee = ville.ville_id"]],
                                                {coop_id: coop.coop_id},
                                                "distinct ville.*", 
                                                true, 0, 0, false);
                if(_.keys(arrivees).length > 0) {
                    coop.ville = arrivees[utilities.getRndInteger(0, _.keys(arrivees).length - 1)];
                }
            });
            resolve(cooperatives);
        });
    }
}

module.exports = ProvinceModel;