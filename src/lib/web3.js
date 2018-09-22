import documentsContractAbi from './documentsContractAbi.json'
import * as Web3 from 'web3'

window.addEventListener('load', () => {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(window.web3.currentProvider)

    window.web3.eth.net.getId().then(netId => {
      if (netId === 1) {
        console.log('This is mainnet')
      } else if (netId === 4) {
        console.log('This is the Rinkeby test network.')
      }
    })
  } else {
    alert('You need MetaMask installed on your browser to use this app')
  }
})

const documentsContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS
const oneFinney = 1000000000000000

export const createDocument = async ({
  document: {
    sha3Hash,
    encryptedIpfsHash,
    allowedSigners,
    encryptedSecrets,
    encryptedEmails,
  },
}) => {
  const { web3 } = window
  const from = (await web3.eth.getAccounts())[0]
  const contract = new web3.eth.Contract(
    documentsContractAbi,
    documentsContractAddress
  )

  console.log({ sha3Hash }, { encryptedIpfsHash }, { from })

  return contract.methods
    .createDocument(
      sha3Hash,
      encryptedIpfsHash,
      ['0x68EE075867E5e5c24FD0305a854661dd4e75302E'],
      '0x68EE075867E5e5c24FD0305a854661dd4e75302Esecrets',
      '0x68EE075867E5e5c24FD0305a854661dd4e75302Eemail'
    )
    .send({ from, value: oneFinney })
}
