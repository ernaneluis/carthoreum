import Wallet from 'ethereumjs-wallet'
import ecies from 'eth-ecies'
import * as openpgp from 'openpgp'

openpgp.initWorker({ path: './openpgp.worker.js' }) // set the relative web worker path

export const createSharedKey = () => Wallet.generate().getPrivateKey()

export const encrypt = ({ data, ethereumPublicKey }) =>
  ecies.encrypt(ethereumPublicKey, data)

export const decrypt = ({ encryptedData, ethereumPrivateKey }) =>
  ecies.decrypt(ethereumPrivateKey, encryptedData)

export const encryptFile = async ({ data, password }) => {
  console.log('encryptFile')
  const options = {
    message: await openpgp.message.fromBinary(data), // input as Message object
    passwords: [password], // multiple passwords possible
    armor: false, // don't ASCII armor (for Uint8Array output)
  }
  return openpgp.encrypt(options).then(
    ciphertext => ciphertext.message.packets.write() // get raw encrypted packets as Uint8Array
  )
}

export const decryptFile = async ({ encryptedData, password }) => {
  const options = {
    message: await openpgp.message.read(encryptedData), // parse encrypted bytes
    passwords: [password], // decrypt with password
    format: 'binary', // output as Uint8Array
  }

  return openpgp.decrypt(options).then(plaintext => plaintext.data)
}
