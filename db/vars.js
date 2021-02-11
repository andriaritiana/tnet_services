/**
 * Variables global utilisés pour générer les données 
 * Outre la liste des coopératives, les données sont utilisés de manière aléatoire
 */
module.exports = {
  cooperatives: ["cotisse", "vatsy", "kofimanga", "kofiam", "cotrama", "mami", "cotrasud", "fifiabe", "transwell", "madatrans", "bandebleu"],
  cooperativesToCreate: ["cotisse", "vatsy", "kofimanga", "kofiam", "cotrama", "mami", "cotrasud", "fifiabe", "transwell", "madatrans", "bandebleu"],
  names: ["Jean", "Denis", "Fidy", "Rolland", "Rivo", "Robert", "Denis", "Jules", "Honoré", "Bertin", "Zaka", "Andry", "Lova", "Hery", "Zo"],
  lastNames: ["Randrianirina", "Randrianaly", "Andriamaro", "Zainjafy", "Manambelo", "Andrianomena", "Ramanandraibe", "Rasolofo", "Rakotoarivelo", "Radavida"],
  lettersIm: ["FA", "FB", "FC", "FE", "FD", "FH", "FG", "TA", "TB", "TC", "TD", "TE", "TF", "TG", "TAA", "TAB","TAC", "TBE", "TBF", "TBG", "THA","TGE"],
  colors: ["Blanche", "Gris", "Bleue", "Verte", "Rouge", "Violet", "Orange", "Jaune"],
  prix: ["10000", "15000","20000","25000","30000","40000","50000"],
  classes: [{clv_libelle: "Premium"},
                {clv_libelle: "VIP"}, 
                {clv_libelle: "Standard"}],
  typeVehicle: [{typv_nom: "Mini-bus 18 places",
                    typv_description: "18;2;16;4;3;3;1",
                    typv_url_image: "/aucun"
                    },
                    {typv_nom: "Mini-bus 14 places",
                    typv_description: "18;2;16;3;3;3;1",
                    typv_url_image: "/aucun"
                    },
                    {typv_nom: "Sprinter 22 places",
                    typv_description: "18;2;20;4;3;3;1",
                    typv_url_image: "/aucun"
                    }
                  ],
  classesTypes: [{typv_id: 1,
                          clv_id: 3},
                        {typv_id: 2,
                          clv_id: 1},
                        {typv_id: 3,
                          clv_id: 1}],
  defaultParams: { guichet_id: null,
                    param_utiliseclasse: 0,
                    param_typevoitureparclasse: 0,
                    param_heuredepartfixe: 1,
                    param_paramminutearriveavantdepart: 30,
                    param_minuteretardtolere: 15,
                    param_permutationchauffeur: 0,
                    param_reservesansavance: 1,
                    param_supprreservesansavanceavant: 24,
                    param_supprreservenoncompleteavant: 1,
                    param_typevehiculefixeparheuredepart: 1,
                    param_frais: 1,
                    param_typevehiculereservationpardefaut: "1, 2",
                    param_nbvehicreservsimultane: "5",
                    param_annulerreservparclient: "1",
                  }
}