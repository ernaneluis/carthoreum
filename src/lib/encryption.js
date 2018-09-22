import Wallet from 'ethereumjs-wallet'
import ecies from 'eth-ecies'
import * as openpgp from 'openpgp'

import store from '../store/store'
import { setEncryptingFileProgress } from '../store/actions/uiActions'

let fileSize = 0

openpgp.initWorker({ path: './openpgp.worker.js' }) // set the relative web worker path

export const createSharedKey = () => Wallet.generate().getPrivateKey()

export const encrypt = ({ data, ethereumPublicKey }) =>
  ecies.encrypt(ethereumPublicKey, data)

export const decrypt = ({ encryptedData, ethereumPrivateKey }) =>
  ecies.decrypt(ethereumPrivateKey, encryptedData)

export const encryptFile = ({ data, password }) => {
  //add 20% more because dont know the final size of encrypted file
  fileSize = data.length * 1.2

  let result = []

  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(data)
      controller.close()
    },
  })

  const options = {
    message: openpgp.message.fromBinary(readableStream), // input as Message object
    passwords: [password], // multiple passwords possible
    armor: false, // don't ASCII armor (for Uint8Array output)
  }

  return openpgp.encrypt(options).then(async ciphertext => {
    // get raw encrypted packets as Uint8Array
    const encrypted = ciphertext.message.packets.write()
    const reader = openpgp.stream.getReader(encrypted)
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        store.dispatch(setEncryptingFileProgress(100))
        return new Uint8Array(result)
      } else {
        // value for fetch streams is a Uint8Array
        result = [...result, ...value]

        const progress = (result.length / fileSize) * 100
        store.dispatch(setEncryptingFileProgress(progress))
      }
    }
  })
}

export const decryptFile = async ({ encryptedData, password }) => {
  const options = {
    message: await openpgp.message.read(encryptedData), // parse encrypted bytes
    passwords: [password], // decrypt with password
    format: 'binary', // output as Uint8Array
  }

  return openpgp.decrypt(options).then(plaintext => plaintext.data)
}
