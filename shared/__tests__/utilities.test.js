const { describe, it } = require('mocha')
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
const { getRndInteger, forEach, trim} = require('../utilities')
require('../global')
chai.use(chaiAsPromised)

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
  it("Should be an iterator that we can use with async functions with array elements", async () => {
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

  it("Should be an iterator that we can use with async functions with object elements", async () => {
    const objectElement = { first: "String", second: "21", third: {delta: 25}}
    let sumNumber = 0
    await forEach(objectElement, (elem, i) => {
        return new Promise( (resolve) => {
        setTimeout(() => {
          sumNumber += i == "second" ? parseInt(elem) : ( i == "third" ? elem.delta : 0) 
          resolve(true)
        }, 1500)
      })
    })
    expect(sumNumber).to.be.equals(46)
  })

  it("Should reject with false if the parameter is not an iterable", async(done) => {
    expect(
      forEach('Test', (elem) => {
        setTimeout(debug(elem), 2000)
      })
    ).to.be.rejectedWith(false)
    expect(
      forEach(1232, (elem) => {
        setTimeout(debug(elem), 2000)
      })
    ).to.be.rejectedWith(false)
    done()
  })
})

describe('trim', () => {
  it('Should return the string with the spaces at beginning and at the end removed', () => {
    expect(trim('  String ')).to.be.equals('String')
    expect(trim('     ')).to.be.equals('')
  })
})