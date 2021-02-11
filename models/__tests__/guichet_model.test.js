const { describe, it } = require('mocha')
const expect = require('chai').expect
require('../../shared/global')
const { cooperatives } = require('../../db/vars')
const { getRndInteger } = require('../../shared/utilities')
const cooperative = cooperatives[getRndInteger(0, cooperatives.length - 1)]
const GuichetModel = require('../guichet_model')
const model = new GuichetModel(cooperative)

describe.only('Guichet model', () => {

  const guichetToAdd = {ville_id: '1',
                         param_id: '1',
                         guichet_nom: 'GuichetTest Nom ToAdd',
                         guichet_adresse: 'GuichetTest Adresse ToAdd'}

  const guichetierToAdd = {guichet_id: '1',
                           guichetier_nom: 'GuichetierTest Name',
                           guichetier_telephone: '0340012356',
                           guichetier_adresse: 'GuichetierTest adresse'}

  describe('get all guichets', () => {
    it('Should load all the guichets in the selected database database', (done) => {
      model.get_all_guichets(false).then(
        (res) => {
          expect(res.status).to.equals(1)
          expect(res.data).to.be.an('array')
          expect(res.data[0]).to.have.all.keys('guichet_id', 'ville_id', 'param_id', 'guichet_nom', 'guichet_adresse')
          done()
        }
      )
    })
  })

  describe('get all guichetiers', () => {
    it('Should load all guichetiers in the database', (done) => {
      model.get_all_guichetiers(false).then(
        (res) => {
          expect(res.status).to.equals(1)
          expect(res.data).to.be.an('array')
          if(res.data.length > 0) {
            expect(res.data[0]).to.have.all.keys('guichetier_id', 'guichet_id', 'guichetier_nom', 'guichetier_telephone', 'guichetier_adresse')
          }
          done()
        }
      )
    })
  })

  describe('add guichet', () => {
    it('Should insert a new guichet into the database and return its id', (done) => {
      model.add_guichet(guichetToAdd, false).then(
        (res) => {
          expect(res.status).to.equals(1)
          expect(res.id).to.be.a('number')
          guichetToAdd.guichet_id = res.id
          done()
        }
      )
    })
  })

  describe('add guichetier', () => {
    it('Should insert a new guichetier into the database and return its id', (done) => {
      if(guichetToAdd.guichet_id) guichetierToAdd.guichet_id = guichetToAdd.guichet_id
      model.add_guichetier(guichetierToAdd, false).then(
        (res) => {
          expect(res.status).to.equals(1)
          expect(res.id).to.be.a('number')
          guichetierToAdd.guichetier_id = res.id
          done()
        }
      )
    })
  })

  describe('update guichet', () => {
    it('Should update the added guichet and when we fetch it in the database, the fields value should be updated', (done) => {
      model.update_guichet({guichet_nom: "updated guichet test", guichet_adresse: "Adresse guichet modified", ville_id: "2"}, {guichet_id: guichetToAdd.guichet_id}, false).then(
        (res) => {
          expect(res.status).to.equals(1)
          model.select('guichet', {guichet_id: guichetToAdd.guichet_id}, {}, false, 0, 0, false).then(
            (info) => {
              if(info.status == 1) {
                expect(info.data[0]).to.have.all.keys('guichet_id', 'ville_id', 'param_id', 'guichet_nom', 'guichet_adresse')
                expect(info.data[0].guichet_nom).to.equals('updated guichet test')
                expect(info.data[0].guichet_adresse).to.equals('Adresse guichet modified')
                expect(info.data[0].ville_id).to.equals(2)
                done()
              }
            }
          )
        }
      )
    })
  })

  describe('update guichetier', () => {
    it('Should update the added guichetier and when we fetch it in the database, the fields value should be updated', (done) => {
      model.update_guichetier({guichetier_nom: "new guichetier name", guichetier_adresse: "New guichetier adresse", guichetier_telephone: "0320050000"}, {guichetier_id: guichetierToAdd.guichetier_id}, false).then(
        (res) => {
          expect(res.status).to.equals(1)
          model.select('guichetier', {guichetier_id: guichetierToAdd.guichetier_id}, {}, false, 0, 0, false).then(
            (info) => {
              if(info.status == 1) {
                expect(info.data[0]).to.have.all.keys('guichetier_id', 'guichet_id', 'guichetier_nom', 'guichetier_telephone', 'guichetier_adresse')
                expect(info.data[0].guichetier_nom).to.equals('new guichetier name')
                expect(info.data[0].guichetier_adresse).to.equals('New guichetier adresse')
                expect(info.data[0].guichetier_telephone).to.equals('0320050000')
                done()
              }
            }
          )
        }
      )
    })
  })

  describe('get params', () => {
    
    it('Should return the default parameter because the new guichet does not have a parameter', (done) => {
      model.get_params(guichetToAdd.guichet_id, false).then(
        (res) => {
          expect(res.status).to.equals(1)
          expect(res.data[0]).to.be.an('object')
          expect(res.data[0]).to.have.all.keys('param_id',  'guichet_id',  'param_utiliseclasse',  'param_typevoitureparclasse',  'param_heuredepartfixe',  'param_paramminutearriveavantdepart',  'param_minuteretardtolere',  'param_permutationchauffeur',  'param_reservesansavance',  'param_supprreservesansavanceavant',  'param_supprreservenoncompleteavant',  'param_typevehiculefixeparheuredepart',  'param_frais',  'param_typevehiculereservationpardefaut',
            'param_nbvehicreservsimultane',  'param_annulerreservparclient')
          done()
        }
      )
    })

    it('Should return the default parameter because the new guichet does not have a parameter', (done) => {
      model.get_params(guichetToAdd.guichet_id, false).then(
        (res) => {
          expect(res.status).to.equals(1)
          done()
        }
      )
    })
  })
})