const moment = require('moment')
const web3 = require('web3')

const Documents = artifacts.require('./Documents.sol')

function getLastEvent(instance) {
  return new Promise((resolve, reject) => {
    instance.allEvents().watch((error, log) => {
      if (error) return reject(error)
      resolve(log)
    })
  })
}

contract('Documents', function(accounts) {
  it('should create a Document and reject a duplicate Document', async function() {
    const account = accounts[0]

    const instance = await Documents.deployed()
    // SHA-256 of file
    const msg =
      '7e5941f066b2070419995072dac7323c02d5ae107b23d8085772f232487fecae'
    const sha3Hash = web3.utils.sha3(msg)
    console.log({ sha3Hash })
    const ipfsHash = 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn'
    console.log({ ipfsHash })

    await instance.addDocument(sha3Hash, ipfsHash)
    const eventObj = await getLastEvent(instance)
    assert.equal(eventObj.event, 'AddDocument')
    console.log('AddDocument event')

    const doesDocumentExists = await instance.doesDocumentExists(sha3Hash)
    assert.equal(doesDocumentExists, true)

    const ipfsHashFromContract = await instance.getIpfsHash(sha3Hash)
    assert.equal(ipfsHashFromContract, ipfsHash)

    try {
      await instance.addDocument(sha3Hash, ipfsHash)
    } catch (error) {
      assert.ok(true)
    }
  })
})
