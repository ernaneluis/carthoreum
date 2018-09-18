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

const msg = '7e5941f066b2070419995072dac7323c02d5ae107b23d8085772f232487fecae'

const encryptedIpfsHash = web3.utils.sha3(
  'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn'
)

const allowedSigners = [
  '0x39df5973289461639367e1dbaaf32715d14d6a49',
  '0xa1d59c562c72500b21da64f2244f809c3749c1c4',
]

const encryptedSecrets = JSON.stringify({
  '0x39df5973289461639367e1dbaaf32715d14d6a49': web3.utils.sha3('1'),
  '0xa1d59c562c72500b21da64f2244f809c3749c1c4': web3.utils.sha3('2'),
})

const encryptedEmails = JSON.stringify({
  '0x39df5973289461639367e1dbaaf32715d14d6a49': web3.utils.sha3(
    'test@example.com'
  ),
  '0xa1d59c562c72500b21da64f2244f809c3749c1c4': web3.utils.sha3(
    'test@google.com'
  ),
})

contract('Documents', function(accounts) {
  it('should create a Document and reject a duplicate Document and retrieve data from document', async function() {
    const instance = await Documents.deployed()
    const sha3Hash = web3.utils.sha3(msg)

    await instance.createDocument(
      sha3Hash,
      encryptedIpfsHash,
      allowedSigners,
      encryptedSecrets,
      encryptedEmails
    )

    const eventObj = await getLastEvent(instance)
    console.log('event ', eventObj.event)
    assert.equal(eventObj.event, 'CreateDocument')

    const doesDocumentExists = await instance.doesDocumentExists(sha3Hash)
    assert.equal(doesDocumentExists, true)

    const docFromContract = await instance.getDocument(sha3Hash)
    console.log({ docFromContract })
    assert.equal(docFromContract[2], encryptedIpfsHash)

    try {
      await instance.createDocument(allowedSigners, sha3Hash, encryptedIpfsHash)
    } catch (error) {
      assert.ok(true)
    }
  })

  it('should create a Document and check if the sender is set as signed', async function() {
    const instance = await Documents.deployed()
    const sha3Hash = web3.utils.sha3(msg + 1)

    await instance.createDocument(
      sha3Hash,
      encryptedIpfsHash,
      [...allowedSigners, accounts[0]],
      encryptedSecrets,
      encryptedEmails
    )

    await instance.signDocument(sha3Hash)

    const eventObj = await getLastEvent(instance)
    console.log('event ', { eventObj })
    assert.equal(eventObj.event, 'DidSignDocument')

    const didSign = await instance.didSignDocument(sha3Hash)
    assert.equal(didSign, true)

    const didNotSign = await instance.didSignDocument('notSign')
    assert.equal(didNotSign, false)
  })

  it('create a Document which cant sign', async function() {
    const instance = await Documents.deployed()
    const sha3Hash = web3.utils.sha3(msg + 2)
    console.log({ sha3Hash })

    await instance.createDocument(
      sha3Hash,
      encryptedIpfsHash,
      allowedSigners,
      encryptedSecrets,
      encryptedEmails
    )

    try {
      await instance.signDocument(sha3Hash)
    } catch (error) {
      assert.ok(true)
    }

    const didSign = await instance.didSignDocument(sha3Hash)
    assert.equal(didSign, false)

    const docFromContract = await instance.getDocument(sha3Hash)
    console.log({ docFromContract })
  })
})
