const { describe, it, after } = require('mocha')
const chaiAsPromised = require("chai-as-promised")
const chai = require('chai')
const expect = require('chai').expect
chai.use(chaiAsPromised)
require('../../../shared/global')
const { cooperatives } = require('../../../db/vars')
const { getRndInteger } = require('../../../shared/utilities')
const CoreModel = require('../model')
let dbToLoad = "default"

describe('Core Model test', async () => {
  const coreModel = new CoreModel()
  const threeCoops = [{coop_sousdomaine: "coopThree1", coop_abrev: "coopThree1", coop_nom: "coopThree1", coop_description: "coopThree1 description", coop_adresse: "coopThree1 place", coop_nomcontact: "coopThree1 contact", coop_tel: "0350263226", coop_urlimage: "/coopThree1/logo.jpg", coop_contactclient: "coopThree1 cli contact"},
                        {coop_sousdomaine: "coopThree2", coop_abrev: "coopThree2", coop_nom: "coopThree2", coop_description: "coopThree2 description", coop_adresse: "coopThree2 place", coop_nomcontact: "coopThree2 contact", coop_tel: "0350263226", coop_urlimage: "/coopThree2/logo.jpg", coop_contactclient: "coopThree2 cli contact"},
                        {coop_sousdomaine: "coopThree3", coop_abrev: "coopThree3", coop_nom: "coopThree3", coop_description: "coopThree3 description", coop_adresse: "coopThree3 place", coop_nomcontact: "coopThree3 contact", coop_tel: "0350263226", coop_urlimage: "/coopThree3/logo.jpg", coop_contactclient: "coopThree3 cli contact"}]
  const coopTest1 = {coop_sousdomaine: "coopTest", coop_abrev: "coopTest", coop_nom: "coopTest", coop_description: "coopTest description", coop_adresse: "coopTest place", coop_nomcontact: "coopTest contact", coop_tel: "0350263226", coop_urlimage: "/coopTest/logo.jpg", coop_contactclient: "coopTest cli contact"}
  describe('Constructor and loader', () => {
    it('Should load the default database and its name should be dbtest_transnet', (done) => {
      expect(coreModel.dberror).to.equals(false)
      expect(coreModel.currentsubdomain).to.equals(dbToLoad)
      expect(coreModel.client).to.be.an('object')
      expect(coreModel.client.connectionParameters.database).to.equals('dbtest_transnet')
      done()
    })

    it('Should load a the database of the selected cooperative and its name dbtest_coop_coopname', (done) => {
      dbToLoad = cooperatives[getRndInteger(0, cooperatives.length -1)]
      coreModel.loadDatabase(dbToLoad)
      expect(coreModel.dberror).to.equals(false)
      expect(coreModel.currentsubdomain).to.equals(dbToLoad)
      expect(coreModel.client).to.be.an('object')
      expect(coreModel.client.connectionParameters.database).to.equals(`dbtest_coop_${dbToLoad}`)
      done()
    })
  })

  describe('Get val merged', () => {
    describe('Type champ entered or no type entered', () => {
      it('Should return the keys of the object and return * if it is empty', (done) => {
        const fields = coreModel.getValMerged({field1: 1, field2: 2, field3: 3})
        const field = coreModel.getValMerged({field: 'string'}, 'champ')
        const all = coreModel.getValMerged({})
        expect(fields).to.be.a('string')
        expect(field).to.be.a('string')
        expect(all).to.be.a('string')
        expect(fields).to.be.equals('field1, field2, field3')
        expect(field).to.be.equals('field')
        expect(all).to.be.equals('*')
        done()
      })
  
      it('Should return array\'s element merged with a coma and return * if it is empty', (done) => {
        const fields = coreModel.getValMerged(['field1', 'field2', 'field3'])
        const field = coreModel.getValMerged(['field'])
        const all = coreModel.getValMerged([], 'champ')
        expect(fields).to.be.a('string')
        expect(field).to.be.a('string')
        expect(all).to.be.a('string')
        expect(fields).to.be.equals('field1, field2, field3')
        expect(field).to.be.equals('field')
        expect(all).to.be.equals('*')
        done()
      })
  
      it('Should return the same string and return * if it is empty', (done) => {
        const fields = coreModel.getValMerged('field1, field2', 'champ')
        const all = coreModel.getValMerged('')
        expect(fields).to.be.a('string')
        expect(all).to.be.a('string')
        expect(fields).to.be.equals('field1, field2')
        expect(all).to.be.equals('*')
        done()
      })
    })

    describe('Type valeur entered', () => {
      it('Should return values merged with a coma if the parameter is and object and an empty string if it is empty', (done) => {
        const values = coreModel.getValMerged({field1: 1, field2: 'value 2', field3: 'third'}, 'valeur')
        const value = coreModel.getValMerged({}, 'valeur')
        expect(values).to.be.a('string')
        expect(value).to.be.a('string')
        expect(values).to.be.equals(`'1', 'value 2', 'third'`)
        expect(value).to.be.equals('')
        done()
      })

      it('Should throw a new databaseError if the parameter is not an object', (done) => {
        expect(() => {
          coreModel.getValMerged(['value1', 'value2'], 'valeur')
        }).to.throw( 'Value type not supported')
        expect(() => {
          coreModel.getValMerged("value1", 'valeur')
        }).to.throw( 'Value type not supported')
        done()
      })
    })

    describe('Type condition entered', () => {
      it('Should return key => value merged with and if parameter type is object and true if it is empty', (done) => {
        const conditions = coreModel.getValMerged({field1: 12, field2: null, "field3 like": "%likeMe%"}, 'condition')
        const simpleCondition = coreModel.getValMerged({field: 'simpleVal'}, 'condition')
        const conditionTrue = coreModel.getValMerged({}, 'condition')
        expect(conditions).to.be.a('string')
        expect(conditionTrue).to.be.a('string')
        expect(simpleCondition).to.be.a('string')
        expect(conditions).to.be.equals(`field1 = '12' and field2 is null and field3 like '%likeMe%'`)
        expect(simpleCondition).to.be.equals(`field = 'simpleVal'`)
        expect(conditionTrue).to.be.equals('true')
        done()
      })
  
      it('Should return values merged with and if parameter type is array and true if it is empty', (done) => {
        const conditions = coreModel.getValMerged(['field1 = 1', 'field2 <= 120', "field3 like '%omega'"], 'condition')
        const simpleCondition = coreModel.getValMerged(['fieldTrop is null'])
        const conditionTrue = coreModel.getValMerged([], 'condition')
        expect(conditions).to.be.a('string')
        expect(conditionTrue).to.be.a('string')
        expect(simpleCondition).to.be.a('string')
        expect(conditions).to.be.equals(`field1 = 1 and field2 <= 120 and field3 like '%omega'`)
        expect(simpleCondition).to.be.equals(`fieldTrop is null`)
        expect(conditionTrue).to.be.equals('true')
        done()
      })
  
      it('Should return the same if parameter type is string and true if it is empty', (done) => {
        const conditions = coreModel.getValMerged("field1 like 'koul' and field2 = 2", 'condition')
        const conditionTrue = coreModel.getValMerged("   ", 'condition')
        expect(conditions).to.be.a('string')
        expect(conditionTrue).to.be.a('string')
        expect(conditions).to.be.equals(`field1 like 'koul' and field2 = 2`)
        expect(conditionTrue).to.be.equals('true')
        done()
      })
    })

    describe('Type set entered', () => {
      it('Should return key = value merged with coma if param type is an object and throw error if it is empty', (done) => {
        const listValues = coreModel.getValMerged({field1: "value1", field2: null, field3: 130}, "set")
        const value = coreModel.getValMerged({field: 12}, "set")
        expect(listValues).to.be.a('string')
        expect(value).to.be.a('string')
        expect(listValues).to.be.equals(`field1 = 'value1', field2 = null, field3 = '130'`)
        expect(value).to.be.equals(`field = '12'`)
        expect(() => {
          coreModel.getValMerged({}, 'set')
        }).to.throw('Cannot set empty values')
        done()
      })
    })
  })

  describe('select', () => {
    it('Should return rows from the specified table and the specified fields and respect limit, offset and order by', (done) => {
      coreModel.loadDatabase('default')
      coreModel.select('cooperative', {}, ['coop_id', 'coop_nom'], false, 5, 3, false, 'coop_nom').
      then( (res) => {
        expect(res.status).to.equals(1)
        expect(res.data.length).to.equals(5)
        expect(res.data[0]).to.have.all.keys('coop_id', 'coop_nom')
        expect(res.data[0].coop_nom).to.equals('cotrasud')
        expect(res.data[0]).to.not.have.any.keys('coop_description','coop_sousdomaine', 'coop_abrev')
        done()
      })
    })

    it('Should return rows from the specified table with the specified condition', (done) => {
      coreModel.loadDatabase('default')
      coreModel.select('cooperative', {"coop_nom like": "cotra%"}, [], false, 0, 0, false, '').
      then( (res) => {
        expect(res.status).to.equals(1)
        expect(res.data[0]).to.have.all.keys('coop_id', 'coop_sousdomaine', 'coop_abrev', 'coop_nom', 'coop_description', 'coop_adresse', 'coop_nomcontact', 'coop_tel', 'coop_urlimage', 'coop_contactclient')
        expect(res.data[0].coop_nom).to.equals('cotrama')
        done()
      })
    })
  })

  describe('select join', () => {
    it('Should return rows from specified table joining the other table and the specified field and respect limit, offset and order by', (done) => {
      coreModel.loadDatabase('default')
      coreModel.select_join('province', {ville: "province.prov_id = ville.prov_id"}, {}, ['province.prov_id', 'prov_nom', 'ville_nom'], false, 10, 4, false, 'prov_id').
      then( (res) => {
        expect(res.status).to.equals(1)
        expect(res.data.length).to.equals(10)
        expect(res.data[0]).to.have.all.keys('prov_id', 'prov_nom', 'ville_nom')
        expect(res.data[0].prov_id).to.equals(1)
        expect(res.data[0]).to.not.have.any.keys('prov_description', 'ville_id')
        done()
      })
    })

    it('Should return rows from specified table with the specified condition', (done) => {
      coreModel.loadDatabase('default')
      coreModel.select_join('province', {ville: "province.prov_id = ville.prov_id"}, {"ville.prov_id": 2}, [], false, 0, 0, true, '').
      then( (res) => {
        expect(res.status).to.equals(1)
        expect(res.data[0]).to.have.all.keys('prov_id', 'prov_nom', 'prov_description', 'ville_id', 'ville_nom')
        expect(res.data[0].prov_id).to.equals(2)
        done()
      })
    })
  })

  describe('insert', () => {
    
    it('Should insert a row into the database if parameter type is object and insert type is not multiple', (done) => {
      coreModel.loadDatabase('default')
      coreModel.insert('cooperative', coopTest1, false, false, false).
      then( (res) => {
        expect(res.status).to.equals(1)
        expect(res.id).to.be.a('number')
        done()
      })
    })

    it('Should insert all rows into the database if parameter type is array and insert type is multiple', (done) => {
      coreModel.loadDatabase('default')
      coreModel.insert('cooperative', threeCoops, true, false, false).
      then( (res) => {
        expect(res.status).to.equals(1)
        expect(res.ids).to.be.an('array')
        expect(res.ids[0]).to.be.a('number')
        done()
      })
    })

    it('Should throw error if bad combination of array or object with insert type', (done) => {
      expect(() => {
        coreModel.insert('cooperative', coopTest1, true)
      }).to.throw('Bad combination error: cannot insert multiple object element')
      expect(() => {
        coreModel.insert('cooperative', threeCoops, false)
      }).to.throw('Bad combination error: cannot insert single array element')
      done()
    })
  })

  describe('Update', () => {
    it('Should update the specified table with the specified data according to the specified condition', (done) => {
      coreModel.loadDatabase('default')
      coreModel.update('cooperative', {"coop_sousdomaine like": "coopT%"}, {coop_abrev: "test update", coop_adresse: "address updated", coop_tel: "0202254678"}, false)
      .then((res) => {
        expect(res.status).to.equals(1)
        coreModel.select('cooperative', {"coop_sousdomaine like": "coopT%"}, ['coop_abrev', 'coop_adresse', 'coop_tel'], false, 0, 0, false)
        .then( (updated) => {
          expect(updated.status).to.equals(1)
          expect(updated.data.length).to.be.gte(1)
          expect(updated.data[0].coop_abrev).to.equals("test update")
          expect(updated.data[0].coop_adresse).to.equals("address updated")
          expect(updated.data[0].coop_tel).to.equals("0202254678")
          done()
        })
      })
    })

    it('Should not allow to update all rows by passing empty condition parameter', async () => {
      await expect(
        coreModel.update('cooperative', {}, {coop_abrev: "test update", coop_adresse: "address updated", coop_tel: "0202254678"}, false)
      ).to.be.rejectedWith('Action performed not allowed')
      
      await expect(
        coreModel.update('cooperative', "", {coop_abrev: "test update", coop_adresse: "address updated", coop_tel: "0202254678"}, false)
      ).to.be.rejectedWith('Action performed not allowed')

    })
  })

  describe('Delete', () => {
    it('Should remove from the database the specified rows according to the specified conditions', (done) => {
      coreModel.loadDatabase('default') 
      coreModel.delete('cooperative', {"coop_sousdomaine like": "coopT%"}, false).
      then((res) => {
        expect(res.status).to.equals(1)
        coreModel.select('cooperative', {"coop_sousdomaine like": "coopT%"}, [], false, 0, 0, true)
        .then( (deleted) => {
          expect(deleted.status).to.equals(1)
          expect(deleted.data.length).to.equals(0)
          done()
        })
      })
    })

    it('Should not allow to remove all rows by passing empty condition parameter', async () => {
      await expect(
        coreModel.delete('cooperative', {}, false)
      ).to.be.rejectedWith('Action performed not allowed')
      
      await expect(
        coreModel.delete('cooperative', "", false)
      ).to.be.rejectedWith('Action performed not allowed')

    })
  })

})