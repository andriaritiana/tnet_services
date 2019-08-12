const queries = {
"chauffeur" : ["create table chauffeur ( chauf_id    serial  not null, chauf_nom   varchar(100) null, chauf_tel   varchar(50) null, constraint pk_chauffeur primary key (chauf_id) )",
                "create unique index chauffeur_pk on chauffeur (chauf_id )"],
"chauffvehic": ["create table chauffvehic ( chaufvehic_id  serial  not null, vehic_numero  character varying(8) not null, chauf_id    integer not null, chaufvehic_date  date null, constraint pk_chauffvehic primary key (chaufvehic_id) )",
                "create unique index chauffvehic_pk on chauffvehic (chaufvehic_id )",
                "create  index aso_19_fk on chauffvehic (vehic_numero )",
                "create  index as_19_fk on chauffvehic (chauf_id )"],
"classe_vehicule": ["create table classe_vehicule ( clv_id serial  not null, clv_libelle varchar(50) null, constraint pk_classe_vehicule primary key (clv_id) )",
            "create unique index cat_vehicule_pk on classe_vehicule (clv_id )"],
"cooperative": ["create table cooperative ( coop_id serial  not null, coop_nom    varchar(50) null, coop_adresse varchar(100) null, coop_etat_parametre  bool null, constraint pk_cooperative primary key (coop_id) )",
                "create unique index cooperative_pk on cooperative (coop_id )"],
"etat_reservation": ["create table etat_reservation ( etat_res_id serial  not null, etat_res_libelle varchar(50) null, constraint pk_etat_reservation primary key (etat_res_id) )",
                    "create unique index type_reservation_pk on etat_reservation (etat_res_id )"],
"frais": ["create table frais ( frais_id    serial  not null, itin_id integer not null, clv_id integer null, typv_id integer null, frais_montant  float8  null, constraint pk_frais primary key (frais_id) )",
            "create unique index frais_pk on frais (frais_id )",
            "create  index aso_14_fk on frais (typv_id )",
            "create  index aso_15_fk on frais (itin_id )",
            "create  index as_20_fk on frais (clv_id )"],
"guichet": ["create table guichet ( guichet_id  serial  not null, ville_id integer not null, param_id    integer null, guichet_nom varchar(50) null, guichet_adresse  varchar(255) null, constraint pk_guichet primary key (guichet_id) )",
            "create unique index guichet_pk on guichet (guichet_id )",
            "create  index asoc_12_fk on guichet (ville_id )",
            "create  index par2_fk on guichet (param_id )"],
"guichetier": ["create table guichetier ( guichetier_id  serial  not null, guichet_id  integer not null, guichetier_nom varchar(100) null, guichetier_telephone varchar(50)    null, guichetier_adresse   varchar(255) null, constraint pk_guichetier primary key (guichetier_id) )",
            "create unique index guichetier_pk on guichetier (guichetier_id )",
            "create  index as_18_fk on guichetier (guichet_id )"],
"itineraire": ["create table itineraire ( itin_id serial  not null, guichet_id  integer not null, itin_depart varchar(50) null, itin_arrivee varchar(50) null, itin_depart_dispo    varchar(50) null, constraint pk_itineraire primary key (itin_id) )",
            "create unique index itineraire_pk on itineraire (itin_id )",
            "create  index programer_fk on itineraire (guichet_id )"],
"listage": ["create table listage ( listage_id  serial  not null, chaufvehic_id  integer not null, listage_etat varchar(10) null, listage_ordre  integer null, constraint pk_listage primary key (listage_id) )",
            "create unique index listage_pk on listage (listage_id )",
            "create  index asoc_19_fk on listage (chaufvehic_id )"],
"mode_payement": ["create table mode_payement ( modep_id    serial  not null, modep_libelle  varchar(50) null, modep_numero varchar(100) null, constraint pk_mode_payement primary key (modep_id) )",
            "create unique index mode_payement_pk on mode_payement (modep_id )"],
"parametre": ["create table parametre (param_id serial not null, guichet_id integer null, param_utiliseclasse integer null, param_typevoitureparclasse integer null, param_heuredepartfixe integer null, param_paramminutearriveavantdepart integer null, param_minuteretardtolere integer null, param_permutationchauffeur integer null, param_reservesansavance integer null, param_supprreservesansavanceavant integer null, param_supprreservenoncompleteavant integer null, param_typevehiculefixeparheuredepart integer null, param_frais integer null, param_typevehiculereservationpardefaut varchar(150) null, param_nbvehicreservsimultane integer null, param_annulerreservparclient integer not null, constraint pk_parametre primary key (param_id) )",
            "create unique index parametre_pk on parametre (param_id )",
            "create  index par_fk on parametre (guichet_id )"],
"passager": ["create table passager ( passager_id serial  not null, passeger_tel varchar(50) null, passager_nom varchar(100) null, passager_terminal    varchar(100) null, constraint pk_passager primary key (passager_id) )",
            "create unique index passager_pk on passager (passager_id )"],
"province": ["CREATE TABLE province ( prov_id integer NOT NULL, prov_nom varchar(50), prov_description text)", 
            "CREATE SEQUENCE Province_prov_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1"],
"reservation": ["create table reservation ( reserv_id   serial  not null, modep_id    integer not null, etat_res_id integer not null, voy_id  integer not null, passager_id integer not null, reserv_nb_passager   integer null, reserv_place varchar(150) null, reserv_avance  float8  null, reserv_montant_total float8  null, reserv_date date null, constraint pk_reservation primary key (reserv_id) )",
                "create unique index reservation_pk on reservation (reserv_id )",
                "create  index association_8_fk on reservation (passager_id )",
                "create  index association_9_fk on reservation (voy_id )",
                "create  index association_10_fk on reservation (etat_res_id )",
                "create  index aso_17_fk on reservation (modep_id )"],
"type_classe": ["create table type_classe ( tc_id   serial  not null, clv_id integer not null, typv_id integer not null, constraint pk_type_classe primary key (tc_id))",
                "create unique index type_classe_pk on type_classe (tc_id)",
                "create  index as_2_fk on type_classe (clv_id)",
                "create  index as_3_fk on type_classe (typv_id)"],
"type_vehicule": ["create table type_vehicule ( typv_id serial  not null, typv_nom varchar(50) null, typv_description varchar(255) null, typv_url_image varchar(255) null, constraint pk_type_vehicule primary key (typv_id) )",
                "create unique index type_vehicule_pk on type_vehicule (typv_id )"],
"vehicule": ["CREATE TABLE vehicule (vehic_numero character varying(8) NOT NULL, typv_id integer not null, clv_id integer null, vehic_couleur character varying(10), constraint pk_vehicule primary key (vehic_numero) )",
            "create unique index vehicule_pk on vehicule (vehic_numero )",
            "create  index as_1_fk on vehicule (typv_id )",
            "create  index asv_2_fk on vehicule (clv_id )"],
"ville" : ["create table ville ( ville_id serial  not null, prov_id integer NOT NULL, ville_nom varchar(50) null, constraint pk_ville primary key (ville_id) )",
            "create unique index ville_pk on ville (ville_id )"],
"voyage": ["create table voyage ( voy_id  serial  not null, listage_id  integer not null, typv_id integer not null, clv_id integer null, itin_id integer not null, voy_heure_depart date null, voy_heure_arrivee    date null, voy_etat    varchar(20) null, constraint pk_voyage primary key (voy_id) )",
            "create unique index voyage_pk on voyage (voy_id )",
            "create  index appartenir_fk on voyage (itin_id )",
            "create  index as_13_fk on voyage (typv_id )",
            "create  index association_11_fk on voyage (clv_id )",
            "create  index association_12_fk on voyage (listage_id )"],
"constraints": ["alter table chauffvehic add constraint fk_chauffve_aso_19_vehicule foreign key (vehic_numero)    references vehicule (vehic_numero)    on delete restrict on update restrict",
                "alter table chauffvehic add constraint fk_chauffve_as_19_chauffeu foreign key (chauf_id)    references chauffeur (chauf_id)    on delete restrict on update restrict",
                "alter table frais add constraint fk_frais_aso_14_type_veh foreign key (typv_id)    references type_vehicule (typv_id)    on delete restrict on update restrict",
                "alter table frais add constraint fk_frais_aso_15_itinerai foreign key (itin_id)    references itineraire (itin_id)    on delete restrict on update restrict",
                "alter table frais add constraint fk_frais_as_20_classe_v foreign key (clv_id)    references classe_vehicule (clv_id)    on delete restrict on update restrict",
                "alter table guichet add constraint fk_guichet_asoc_12_ville foreign key (ville_id)    references ville (ville_id)    on delete restrict on update restrict",
                "alter table guichet add constraint fk_guichet_asos_20_parametr foreign key (param_id)    references parametre (param_id)    on delete restrict on update restrict",
                "alter table guichetier add constraint fk_guicheti_as_18_guichet foreign key (guichet_id)    references guichet (guichet_id)    on delete restrict on update restrict",
                "alter table itineraire add constraint fk_itinerai_programer_guichet foreign key (guichet_id)    references guichet (guichet_id)    on delete restrict on update restrict",
                "alter table listage add constraint fk_listage_as_21_chauffve foreign key (chaufvehic_id)    references chauffvehic (chaufvehic_id)    on delete restrict on update restrict",
                "alter table parametre add constraint fk_parametr_asos_19_guichet foreign key (guichet_id)    references guichet (guichet_id)    on delete restrict on update restrict",
                "alter table reservation add constraint fk_reservat_aso_17_mode_pay foreign key (modep_id)    references mode_payement (modep_id)    on delete restrict on update restrict",
                "alter table reservation add constraint fk_reservat_as_10_etat_res foreign key (etat_res_id)    references etat_reservation (etat_res_id)    on delete restrict on update restrict",
                "alter table reservation add constraint fk_reservat_as_8_passager foreign key (passager_id)    references passager (passager_id)    on delete restrict on update restrict",
                "alter table reservation add constraint fk_reservat_as_9_voyage foreign key (voy_id)    references voyage (voy_id)    on delete restrict on update restrict",
                "alter table type_classe add constraint fk_type_cla_as_2_classe_v foreign key (clv_id)    references classe_vehicule (clv_id)    on delete restrict on update restrict",
                "alter table type_classe add constraint fk_type_cla_as_3_type_veh foreign key (typv_id)    references type_vehicule (typv_id)    on delete restrict on update restrict",
                "alter table vehicule add constraint fk_vehicule_as_1_type_veh foreign key (typv_id)    references type_vehicule (typv_id)    on delete restrict on update restrict",
                "alter table voyage add constraint fk_voyage_apparteni_itinerai foreign key (itin_id)    references itineraire (itin_id)    on delete restrict on update restrict",
                "alter table voyage add constraint fk_voyage_as_12_listage foreign key (listage_id)    references listage (listage_id)    on delete restrict on update restrict",
                "alter table voyage add constraint fk_voyage_as_13_type_veh foreign key (typv_id)    references type_vehicule (typv_id)    on delete restrict on update restrict",
                "alter table voyage add constraint fk_voyage_as_14_classe_v foreign key (clv_id)    references classe_vehicule (clv_id)    on delete restrict on update restrict"]
};

module.exports = queries;