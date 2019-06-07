const { describe, it } = require('mocha')
const expect = require('chai').expect
const { getRndInteger, forEach} = require('../utilities')
require('../global')

describe("getRndInteger", () => {
  it("Should generate a random number between 5 and 20", (done) => {
    const number = getRndInteger(5, 20)
    expect(number).to.be.a('number')
    expect(number).to.be.gte(5)
    expect(number).to.be.lte(20)
    done()
  })
})

describe("forEach", () => {
  it("Should be an iterator that we can use with async functions", async () => {
    const arrayOfElement = ["String", "21", {delta: 25}]
    let sumNumber = 0
    await forEach(arrayOfElement, (elem, i) => {
       return new Promise( (resolve) => {
        setTimeout(() => {
          sumNumber += i == 1 ? parseInt(elem) : ( i == 2 ? elem.delta : 0) 
          resolve(true)
        }, 1500)
      })
    })
    expect(sumNumber).to.be.equals(46)
  })
})