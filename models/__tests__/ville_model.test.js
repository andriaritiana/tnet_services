const { describe, it } = require('mocha')
const expect = require('chai').expect
require('../../shared/global')
const { cooperatives } = require('../../db/vars')
const { getRndInteger } = require('../../shared/utilities')
const cooperative = cooperatives[getRndInteger(0, cooperatives.length - 1)]
const VilleModel = require('../ville_model')
const model = new VilleModel(cooperative)

describe.only('Ville model', () => {
  debug(cooperative)
  const newVille = {
    ville_id: getRndInteger(80, 2000),
    prov_id: getRndInteger(1, 6),
    ville_nom: "Villetest"
  }
  describe('add_ville', () => {
    it('Should create a new ville into the database', (done) => {
      model.add_ville(newVille, false)
      .then( (res) => {
        expect(res.status).to.equals(1)
        expect(res.id).to.equals(newVille.ville_id)
        done()
      })
    })
  })

  describe('get_all_villes', () => {
    it('Should get the list of all villes in the selected db', (done) => {
      model.get_all_villes(false)
      .then( (res) => {
        expect(res.status).to.equals(1)
        expect(res.data).to.be.an('array')
        expect(res.data[0]).to.be.an('object')
        done()
      })
    })
  })

  describe('update_ville', () => {
    it('Should update the inserted ville into the name Test_Ville and the prov_id equal 2', (done) => {
      model.update_ville({ prov_id: 2, ville_nom: 'Test_ville' }, { ville_id: newVille.ville_id }, false)
      .then( (res) => {
        expect(res.status).to.equals(1)
        //TODO Find the element in db and should be modified
        done()
      })
    })
  })
  
  describe('delete_ville', () => {
    it('Should delete the inserted ville', (done) => {
      model.delete_ville({ ville_id: newVille.ville_id })
      .then( (res) => {
        expect(res.status).to.equals(1)
        //TODO Find the element in db and should not be there
        done()
      })
    })
  })
})