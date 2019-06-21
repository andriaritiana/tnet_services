const { describe, it } = require('mocha')
const expect = require('chai').expect
require('../../shared/global')
const { cooperatives } = require('../../db/vars')
const { getRndInteger } = require('../../shared/utilities')
const cooperative = cooperatives[getRndInteger(0, cooperatives.length - 1)]
const CoopModel = require('../cooperative_model')
const model = new CoopModel("default")

describe.only('Cooperative model', () => {
  debug(`Base sélectionnée pour le test : ${cooperative}`)
  const newCoop = { coop_sousdomaine: 'newCoopTest',
                    coop_abrev: 'newCoopTest',
                    coop_nom: 'newCoopTest',
                    coop_description:
                     "La coopérative newCoopTest est une coopérative qui a été créée pour servir la société malagasy. Son objectif est d'apporter la joie au peuple.",
                    coop_adresse: 'Adresse de la coopérative newCoopTest',
                    coop_nomcontact: 'Contact de la coop',
                    coop_tel: '0202283435',
                    coop_urlimage: 'newCoopTest.png',
                    coop_contactclient: null }

  describe('get_cooperative', () => {
    it('Should return the concerned cooperative according to parameter entered', (done) => {
      model.get_cooperative({"coop_nom like": "%tran%"}).
      then( (res) => {
        debug(res)
        expect(res.status).to.equals(1)
        expect(res.data[0]).to.be.an('object')
        expect(res.data[0]).to.have.all.keys('coop_id', 'coop_sousdomaine', 'coop_abrev', 'coop_nom', 'coop_description', 'coop_adresse', 'coop_nomcontact', 'coop_tel', 'coop_urlimage', 'coop_contactclient')
        done()
      })
    })
  })

  describe('get_all_cooperatives', () => {
    //model.loadDatabase('default')
    it('Should return the list of all cooperatives in the db', (done) => {
      model.get_all_cooperatives().
      then( (res) => {
        expect(res.status).to.equals(1)
        expect(res.data[0]).to.be.an('object')
        expect(res.data[0]).to.have.all.keys('coop_id', 'coop_sousdomaine', 'coop_abrev', 'coop_nom', 'coop_description', 'coop_adresse', 'coop_nomcontact', 'coop_tel', 'coop_urlimage', 'coop_contactclient')
        done()
      })
    })
  })

  describe('add_cooperative', () => {
    //model.loadDatabase('default')
    it('Should create new row cooperative in table in database', (done) => {
      model.add_cooperative(newCoop)
      .then( (res) => {
        expect(res.status).to.equals(1)
        expect(res.id).to.be.a('number')
        newCoop.coop_id = res.id
        done()
      })
    })
  })

  describe('update_cooperative', () => {
    it('Should throw an error if object parameter does not have a coop_id property', (done) => {
      expect( () => model.update_cooperative({coop_nom: "test error"})).to.throw('Cannot update cooperative without id')
      done()
    })

    it('Should update the newCoop and change the name and subdomain to coopUpdated', (done) => {
      newCoop.coop_nom = 'coopUpdated'
      newCoop.coop_sousdomaine = 'coopUpdated'
      model.update_cooperative(newCoop). 
      then( (res) => {
        expect(res.status).to.equals(1)
        model.get_cooperative(newCoop)
        .then( (getRes) => {
          expect(getRes.status).to.equals(1)
          expect(getRes.data[0].coop_id).to.equals(newCoop.coop_id)
          expect(getRes.data[0].coop_nom).to.equals('coopUpdated')
          expect(getRes.data[0].coop_sousdomaine).to.equals('coopUpdated')
          done()
        })
      })
    })
  })

  describe('delete_cooperative', () => {
    it('Should remove the new coop and we could not find it in the db', (done) => {
      model.delete_cooperative(newCoop). 
      then( (res) => {
        expect(res.status).to.equals(1)
        model.get_cooperative(newCoop)
        .then( (getRes) => {
          expect(getRes.status).to.equals(1)
          expect(getRes.data.length).to.equals(0)
          done()
        })
      })
    })
  })
})